import React from "react";
import prisma from "@/lib/prisma";
import MediaManagerClient from "@/components/admin/MediaManagerClient";

export const metadata = {
  title: "Media Library – NGUYÊN CRM",
};

export default async function AdminMediaPage() {
  let assets: any[] = [];
  try {
    assets = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.warn("[AdminMediaPage] DB fetch fallback active:", err);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          THƯ VIỆN MEDIA DÙNG CHUNG (CENTRAL ASSETS)
        </h1>
        <p className="text-xs text-[#A1A1AA] mt-1">
          Kho lưu trữ hình ảnh, video preview phục vụ đồng bộ cho Homepage, Services, Case Studies và LAB.
        </p>
      </div>

      <MediaManagerClient initialAssets={assets} />
    </div>
  );
}
