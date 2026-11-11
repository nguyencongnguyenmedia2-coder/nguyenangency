import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";
import { checkAdminPermission, logActivity } from "@/app/actions/admin-common";
import { uploadToSupabaseBucket } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "application/pdf",
]);

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

export async function POST(req: NextRequest) {
  let session;
  try {
    session = await checkAdminPermission();
  } catch (err: any) {
    const status = err?.message === "FORBIDDEN" ? 403 : 401;
    return NextResponse.json(
      { ok: false, error: "Không có quyền tải file lên hệ thống quản trị." },
      { status }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folderRaw = formData.get("folder")?.toString().trim() || "general";
    const titleRaw = formData.get("title")?.toString().trim() || "";

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Vui lòng chọn file hợp lệ để tải lên." },
        { status: 400 }
      );
    }

    const mimeType = file.type || "image/jpeg";
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        {
          ok: false,
          error: `Định dạng file (${mimeType}) không được hỗ trợ. Chỉ chấp nhận JPG, PNG, WEBP, GIF, SVG, MP4, PDF.`,
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Dung lượng file vượt quá giới hạn 15MB." },
        { status: 400 }
      );
    }

    const safeFolder =
      folderRaw
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, "")
        .slice(0, 32) || "general";

    const ext = path.extname(file.name) || ".jpg";
    const baseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/(^-|-$)+/g, "")
      .slice(0, 48);

    const uniqueFileName = `${Date.now()}-${baseName || "asset"}${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Upload to Supabase Storage bucket `nguyen-agency-media` (Cloud Storage - persistent across serverless instances)
    const storagePath = `${safeFolder}/${uniqueFileName}`;
    const supaRes = await uploadToSupabaseBucket(
      "nguyen-agency-media",
      storagePath,
      buffer,
      mimeType
    );

    // 2. Best-effort local filesystem cache (only works on local dev or writable /tmp, won't crash on read-only Vercel)
    let localUrl = `/uploads/${safeFolder}/${uniqueFileName}`;
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads", safeFolder);
      await mkdir(uploadDir, { recursive: true });
      const fullLocalPath = path.join(uploadDir, uniqueFileName);
      await writeFile(fullLocalPath, buffer);
    } catch (fsErr) {
      // Ignored on serverless environments where /var/task is read-only
      console.warn("[Upload] Local filesystem write skipped (serverless environment):", fsErr);
    }

    // Always prefer cloud Supabase Public URL if uploaded, fallback to local URL
    const finalUrl = supaRes.publicUrl || localUrl;
    const supabasePublicUrl = supaRes.publicUrl || null;

    if (!supaRes.success && !finalUrl.startsWith("http")) {
      // If Supabase upload failed and filesystem is read-only, inform user
      console.warn("[Upload] Supabase upload error:", supaRes.error);
    }

    const assetTitle = titleRaw || file.name;
    const type = mimeType.startsWith("video")
      ? "VIDEO"
      : mimeType.startsWith("application")
      ? "DOCUMENT"
      : "IMAGE";

    const createdAsset = await prisma.mediaAsset.create({
      data: {
        title: assetTitle,
        fileName: uniqueFileName,
        url: finalUrl,
        storagePath: storagePath,
        mimeType,
        type,
        folder: safeFolder,
        size: file.size,
        altText: assetTitle,
        uploadedBy: session.name || "Admin",
      },
    });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "UPLOAD",
      entity: "MediaAsset",
      entityId: createdAsset.id,
      details: `Tải lên media: ${assetTitle} (${finalUrl})${
        supabasePublicUrl ? ` [Supabase Storage synced]` : ""
      }`,
    });

    revalidatePath("/admin/media");

    return NextResponse.json({
      ok: true,
      url: finalUrl,
      localUrl,
      supabaseUrl: supabasePublicUrl,
      supabaseSynced: supaRes.success,
      asset: createdAsset,
    });
  } catch (error: any) {
    console.error("[Upload API Error]:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Lỗi khi xử lý tải file lên." },
      { status: 500 }
    );
  }
}
