"use server";

import prisma from "@/lib/prisma";
import { checkAdminPermission, logActivity, safeRevalidatePath } from "./admin-common";

export async function saveHomepageSection(formData: FormData) {
  const session = await checkAdminPermission();
  const id = formData.get("id")?.toString();
  const sectionKey = formData.get("sectionKey")?.toString().trim() || "";
  const name = formData.get("name")?.toString().trim() || "";
  const title = formData.get("title")?.toString().trim() || "";
  const subtitle = formData.get("subtitle")?.toString().trim() || "";
  const description = formData.get("description")?.toString().trim() || "";
  const content = formData.get("content")?.toString().trim() || "";
  const mediaUrl = formData.get("mediaUrl")?.toString().trim() || "";
  const ctaText = formData.get("ctaText")?.toString().trim() || "";
  const ctaLink = formData.get("ctaLink")?.toString().trim() || "";
  const order = parseInt(formData.get("order")?.toString() || "0", 10) || 0;
  const isActive = formData.get("isActive") === "true";

  if (!sectionKey || !title) {
    return { success: false, error: "Vui lòng nhập mã Section (Key) và Tiêu đề." };
  }

  try {
    if (id) {
      await prisma.homepageSection.update({
        where: { id },
        data: {
          sectionKey,
          name: name || sectionKey,
          title,
          subtitle,
          description,
          content,
          mediaUrl,
          ctaText,
          ctaLink,
          order,
          isActive,
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "UPDATE",
        entity: "HomepageSection",
        entityId: id,
        details: `Cập nhật section trang chủ: ${name || sectionKey} (${title})`,
      });
    } else {
      const created = await prisma.homepageSection.create({
        data: {
          sectionKey,
          name: name || sectionKey,
          title,
          subtitle,
          description,
          content,
          mediaUrl,
          ctaText,
          ctaLink,
          order,
          isActive,
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "CREATE",
        entity: "HomepageSection",
        entityId: created.id,
        details: `Thêm section trang chủ mới: ${name || sectionKey}`,
      });
    }

    safeRevalidatePath("/");
    safeRevalidatePath("/admin/homepage");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving homepage section:", error);
    return { success: false, error: "Lỗi lưu section trang chủ." };
  }
}

export async function toggleHomepageSection(id: string, isActive: boolean) {
  const session = await checkAdminPermission();

  try {
    const updated = await prisma.homepageSection.update({
      where: { id },
      data: { isActive },
    });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "UPDATE",
      entity: "HomepageSection",
      entityId: id,
      details: `${isActive ? "Bật" : "Tắt"} hiển thị section trang chủ: ${updated.name}`,
    });

    safeRevalidatePath("/");
    safeRevalidatePath("/admin/homepage");
    return { success: true };
  } catch (error: any) {
    console.error("Error toggling homepage section:", error);
    return { success: false, error: "Lỗi chuyển trạng thái section." };
  }
}

export async function reorderHomepageSections(items: { id: string; order: number }[]) {
  const session = await checkAdminPermission();

  try {
    for (const item of items) {
      await prisma.homepageSection.update({
        where: { id: item.id },
        data: { order: item.order },
      });
    }

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "REORDER",
      entity: "HomepageSection",
      entityId: "HOMEPAGE_SECTIONS",
      details: `Sắp xếp lại thứ tự ${items.length} section trên trang chủ`,
    });

    safeRevalidatePath("/");
    safeRevalidatePath("/admin/homepage");
    return { success: true };
  } catch (error: any) {
    console.error("Error reordering homepage sections:", error);
    return { success: false, error: "Lỗi cập nhật thứ tự." };
  }
}

export async function deleteHomepageSection(id: string) {
  const session = await checkAdminPermission();

  try {
    const sec = await prisma.homepageSection.findUnique({ where: { id } });
    if (!sec) return { success: false, error: "Section không tồn tại." };

    await prisma.homepageSection.delete({ where: { id } });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "DELETE",
      entity: "HomepageSection",
      entityId: id,
      details: `Xóa section trang chủ: ${sec.name}`,
    });

    safeRevalidatePath("/");
    safeRevalidatePath("/admin/homepage");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting homepage section:", error);
    return { success: false, error: "Lỗi xóa section." };
  }
}

