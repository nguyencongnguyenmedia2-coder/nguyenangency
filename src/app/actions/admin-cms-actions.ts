"use server";

import prisma from "@/lib/prisma";
import { checkAdminPermission, logActivity, safeRevalidatePath, revalidateAllPublicRoutes } from "./admin-common";
import {
  syncRecordToSupabase,
  deleteRecordFromSupabase,
} from "@/lib/supabase";

export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "INACTIVE";

function normalizeStatus(raw?: string | null): ContentStatus {
  const upper = (raw || "PUBLISHED").trim().toUpperCase();
  if (upper === "DRAFT") return "DRAFT";
  if (upper === "ARCHIVED") return "ARCHIVED";
  if (upper === "INACTIVE" || upper === "UNPUBLISHED") return "INACTIVE";
  return "PUBLISHED";
}

function slugifyText(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function parseLinesOrJsonToArray(
  raw?: string | null,
  fallback: string[] = []
): string {
  if (!raw || !raw.trim()) return JSON.stringify(fallback);
  const trimmed = raw.trim();
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return JSON.stringify(parsed);
    } catch {
      // fall through to line/comma split
    }
  }
  const items = trimmed
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
  return JSON.stringify(items.length > 0 ? items : fallback);
}

// ==========================================
// 1. SERVICES CRUD
// ==========================================

export async function saveService(formData: FormData) {
  const session = await checkAdminPermission();
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString().trim() || "";
  const customSlug = formData.get("slug")?.toString().trim() || "";
  const tagline = formData.get("tagline")?.toString().trim() || "";
  const group = formData.get("group")?.toString() || "MEDIA";
  const categoryId = formData.get("categoryId")?.toString() || "";
  const shortDesc = formData.get("shortDesc")?.toString().trim() || "";
  const description = formData.get("description")?.toString().trim() || "";
  const thumbnailRaw = formData.get("thumbnail");
  const thumbnail =
    thumbnailRaw !== null ? thumbnailRaw.toString().trim() || null : undefined;
  const coverImageRaw = formData.get("coverImage");
  const coverImage =
    coverImageRaw !== null ? coverImageRaw.toString().trim() || null : undefined;
  const galleryJsonRaw = formData.get("galleryJson");
  const galleryJson =
    galleryJsonRaw !== null ? galleryJsonRaw.toString().trim() : undefined;
  const altText = formData.get("altText")?.toString().trim() || null;
  const estimatedTime =
    formData.get("estimatedTime")?.toString() || "2 - 4 tuần";
  const priceLabel =
    formData.get("priceLabel")?.toString() || "Liên hệ báo giá";
  const startingPrice =
    parseFloat(formData.get("startingPrice")?.toString() || "0") || null;
  const status = normalizeStatus(formData.get("status")?.toString());
  const isFeatured = formData.get("isFeatured") === "true";
  const order = parseInt(formData.get("order")?.toString() || "0", 10) || 0;
  const metaTitle = formData.get("metaTitle")?.toString().trim() || null;
  const metaDescription =
    formData.get("metaDescription")?.toString().trim() || null;

  const featuresRaw = formData.get("featuresJson")?.toString();
  const benefitsRaw = formData.get("benefitsJson")?.toString();

  if (!title || !shortDesc) {
    return {
      success: false,
      error: "Vui lòng nhập tên dịch vụ và mô tả ngắn.",
    };
  }

  // Quy tắc kiểm soát chất lượng: Dịch vụ xuất bản bắt buộc phải có ảnh đại diện
  if (status === "PUBLISHED") {
    if (thumbnail !== undefined && (!thumbnail || thumbnail.trim() === "")) {
      return {
        success: false,
        error: "Dịch vụ thiếu ảnh đại diện (Thumbnail). Bắt buộc phải có ảnh đại diện mới được phép xuất bản (PUBLISHED).",
      };
    }
  }

  try {
    const slugBase = slugifyText(customSlug || title);

    let finalCategoryId = categoryId;
    if (!finalCategoryId) {
      const defaultCat = await prisma.serviceCategory.findFirst({
        where: { group },
      });
      finalCategoryId = defaultCat ? defaultCat.id : "";
    }

    let targetSlug = slugBase;
    let previousSlug = "";

    if (id) {
      const existing = await prisma.service.findUnique({ where: { id } });
      if (!existing) {
        return { success: false, error: "Dịch vụ cần cập nhật không tồn tại." };
      }
      previousSlug = existing.slug;
      targetSlug = customSlug ? slugifyText(customSlug) : existing.slug;

      // Avoid slug collision if slug was changed
      if (targetSlug !== existing.slug) {
        const conflict = await prisma.service.findUnique({
          where: { slug: targetSlug },
        });
        if (conflict && conflict.id !== id) {
          targetSlug = `${targetSlug}-${Date.now().toString().slice(-4)}`;
        }
      }

      await prisma.service.update({
        where: { id },
        data: {
          title,
          slug: targetSlug,
          tagline: tagline || existing.tagline,
          group,
          ...(finalCategoryId ? { categoryId: finalCategoryId } : {}),
          shortDesc,
          description: description || shortDesc,
          ...(thumbnail !== undefined ? { thumbnail } : {}),
          ...(coverImage !== undefined ? { coverImage } : {}),
          ...(galleryJson !== undefined ? { galleryJson } : {}),
          ...(altText !== null ? { altText } : {}),
          ...(featuresRaw !== undefined
            ? { featuresJson: parseLinesOrJsonToArray(featuresRaw) }
            : {}),
          ...(benefitsRaw !== undefined
            ? { benefitsJson: parseLinesOrJsonToArray(benefitsRaw) }
            : {}),
          estimatedTime,
          priceLabel,
          startingPrice,
          status,
          isFeatured,
          ...(formData.get("order") !== null ? { order } : {}),
          metaTitle,
          metaDescription,
          deletedAt: status === "ARCHIVED" ? existing.deletedAt : null,
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "UPDATE",
        entity: "Service",
        entityId: id,
        details: `Cập nhật dịch vụ ${title} (${group}) [${status}]`,
      });
    } else {
      if (!finalCategoryId) {
        const cat = await prisma.serviceCategory.create({
          data: {
            name: group === "MEDIA" ? "Media Creative" : "Tech Software",
            slug: `${group.toLowerCase()}-cat-${Date.now()}`,
            group,
          },
        });
        finalCategoryId = cat.id;
      }

      const existingBySlug = await prisma.service.findUnique({
        where: { slug: slugBase },
      });
      targetSlug = existingBySlug
        ? `${slugBase}-${Date.now().toString().slice(-4)}`
        : slugBase;

      const created = await prisma.service.create({
        data: {
          title,
          slug: targetSlug,
          tagline: tagline || "Kiến tạo giải pháp độc bản chuẩn quốc tế",
          group,
          categoryId: finalCategoryId,
          shortDesc,
          description: description || shortDesc,
          thumbnail: thumbnail ?? null,
          coverImage: coverImage ?? null,
          galleryJson: galleryJson || "[]",
          altText: altText || `${title} - NGUYÊN AGENCY`,
          featuresJson: parseLinesOrJsonToArray(featuresRaw, [
            "Khảo sát & Tư vấn kiến trúc giải pháp",
            "Thiết kế độc bản theo nhận diện thương hiệu",
            "Kiểm thử đa thiết bị & Bàn giao 100% bản quyền",
          ]),
          benefitsJson: parseLinesOrJsonToArray(benefitsRaw, [
            "Tối ưu hóa trải nghiệm và tỷ lệ chuyển đổi",
            "Bảo hành kỹ thuật 12 tháng toàn diện",
          ]),
          estimatedTime,
          priceLabel,
          startingPrice,
          status,
          isFeatured,
          order,
          metaTitle,
          metaDescription,
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "CREATE",
        entity: "Service",
        entityId: created.id,
        details: `Tạo dịch vụ mới ${title} (${group}) [${status}]`,
      });
    }

    revalidateAllPublicRoutes([`/services/${targetSlug}`, ...(previousSlug && previousSlug !== targetSlug ? [`/services/${previousSlug}`] : []), "/admin/services"]);

    const savedSvc = await prisma.service.findFirst({
      where: { slug: targetSlug },
    });
    if (savedSvc) {
      void syncRecordToSupabase("services", {
        id: savedSvc.id,
        name: savedSvc.title,
        slug: savedSvc.slug,
        category: savedSvc.group,
        short_description: savedSvc.shortDesc,
        description: savedSvc.description,
        thumbnail: savedSvc.thumbnail,
        price_type: savedSvc.startingPrice ? "STARTING_FROM" : "CUSTOM",
        base_price: savedSvc.startingPrice || 0,
        is_active: savedSvc.status === "PUBLISHED",
        is_featured: savedSvc.isFeatured,
      });
    }

    return { success: true, slug: targetSlug };
  } catch (error: any) {
    console.error("Error saving service:", error);
    return { success: false, error: "Lỗi lưu dịch vụ." };
  }
}

export async function updateServiceStatus(id: string, rawStatus: string) {
  const session = await checkAdminPermission();
  const status = normalizeStatus(rawStatus);

  try {
    const updated = await prisma.service.update({
      where: { id },
      data: {
        status,
        deletedAt: null,
      },
    });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "STATUS_CHANGE",
      entity: "Service",
      entityId: id,
      details: `Đổi trạng thái dịch vụ "${updated.title}" -> ${status}`,
    });

    void syncRecordToSupabase("services", {
      id: updated.id,
      name: updated.title,
      slug: updated.slug,
      category: updated.group,
      short_description: updated.shortDesc,
      description: updated.description,
      thumbnail: updated.thumbnail,
      price_type: updated.startingPrice ? "STARTING_FROM" : "CUSTOM",
      base_price: updated.startingPrice || 0,
      is_active: updated.status === "PUBLISHED",
      is_featured: updated.isFeatured,
    });

    revalidateAllPublicRoutes([`/services/${updated.slug}`, "/admin/services"]);
    return { success: true };
  } catch (error: any) {
    console.error("Error updating service status:", error);
    return { success: false, error: "Không thể cập nhật trạng thái dịch vụ." };
  }
}

export async function deleteService(id: string) {
  const session = await checkAdminPermission();

  try {
    const s = await prisma.service.findUnique({ where: { id } });
    if (!s) return { success: false, error: "Dịch vụ không tồn tại." };

    const bookingCount = await prisma.serviceBooking.count({
      where: { serviceId: id },
    });

    if (bookingCount > 0) {
      // Soft-delete / Archive when bookings reference this service
      await prisma.service.update({
        where: { id },
        data: {
          status: "ARCHIVED",
          deletedAt: new Date(),
        },
      });

      void syncRecordToSupabase("services", {
        id: s.id,
        name: s.title,
        slug: s.slug,
        category: s.group,
        short_description: s.shortDesc,
        description: s.description,
        thumbnail: s.thumbnail,
        price_type: s.startingPrice ? "STARTING_FROM" : "CUSTOM",
        base_price: s.startingPrice || 0,
        is_active: false,
        is_featured: false,
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "ARCHIVE",
        entity: "Service",
        entityId: id,
        details: `Lưu trữ (Archive) dịch vụ ${s.title} (có ${bookingCount} booking liên kết)`,
      });
    } else {
      await prisma.service.delete({ where: { id } });
      void deleteRecordFromSupabase("services", id);

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "DELETE",
        entity: "Service",
        entityId: id,
        details: `Xóa dịch vụ ${s.title}`,
      });
    }

    revalidateAllPublicRoutes([`/services/${s.slug}`, "/admin/services"]);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting service:", error);
    return { success: false, error: "Lỗi xóa dịch vụ." };
  }
}

// ==========================================
// 2. PORTFOLIO CRUD
// ==========================================

export async function savePortfolio(formData: FormData) {
  const session = await checkAdminPermission();
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString().trim() || "";
  const customSlug = formData.get("slug")?.toString().trim() || "";
  const clientName = formData.get("clientName")?.toString().trim() || "";
  const year = formData.get("year")?.toString() || "2026";
  const categoryId = formData.get("categoryId")?.toString() || "";
  const shortDesc = formData.get("shortDesc")?.toString().trim() || "";
  const thumbnail =
    formData.get("thumbnail")?.toString().trim() ||
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80";
  const videoPreview = formData.get("videoPreview")?.toString().trim() || null;
  const objective = formData.get("objective")?.toString().trim() || "";
  const challenge = formData.get("challenge")?.toString().trim() || "";
  const solution = formData.get("solution")?.toString().trim() || "";
  const liveUrl = formData.get("liveUrl")?.toString().trim() || "";
  const isFeatured = formData.get("isFeatured") === "true";
  const status = normalizeStatus(formData.get("status")?.toString());
  const metaTitle = formData.get("metaTitle")?.toString().trim() || null;
  const metaDescription =
    formData.get("metaDescription")?.toString().trim() || null;

  const technologiesRaw = formData.get("technologiesJson")?.toString();
  const resultsRaw = formData.get("resultsJson")?.toString();
  const galleryRaw = formData.get("galleryJson")?.toString();

  if (!title || !clientName) {
    return {
      success: false,
      error: "Vui lòng nhập tên dự án và khách hàng.",
    };
  }

  try {
    let finalCategoryId = categoryId;
    if (!finalCategoryId) {
      const defaultCat = await prisma.portfolioCategory.findFirst();
      if (defaultCat) {
        finalCategoryId = defaultCat.id;
      } else {
        const newCat = await prisma.portfolioCategory.create({
          data: { name: "Web App", slug: "web-app" },
        });
        finalCategoryId = newCat.id;
      }
    }

    let targetSlug = "";
    let previousSlug = "";

    if (id) {
      const existing = await prisma.portfolio.findUnique({ where: { id } });
      if (!existing) {
        return { success: false, error: "Dự án không tồn tại." };
      }
      previousSlug = existing.slug;
      targetSlug = customSlug ? slugifyText(customSlug) : existing.slug;

      if (targetSlug !== existing.slug) {
        const conflict = await prisma.portfolio.findUnique({
          where: { slug: targetSlug },
        });
        if (conflict && conflict.id !== id) {
          targetSlug = `${targetSlug}-${Date.now().toString().slice(-4)}`;
        }
      }

      await prisma.portfolio.update({
        where: { id },
        data: {
          title,
          slug: targetSlug,
          clientName,
          year,
          categoryId: finalCategoryId,
          shortDesc: shortDesc || title,
          thumbnail,
          videoPreview,
          objective: objective || shortDesc || title,
          challenge: challenge || shortDesc || title,
          solution: solution || shortDesc || title,
          liveUrl: liveUrl || null,
          isFeatured,
          status,
          metaTitle,
          metaDescription,
          deletedAt: null,
          ...(technologiesRaw !== undefined
            ? { technologiesJson: parseLinesOrJsonToArray(technologiesRaw) }
            : {}),
          ...(resultsRaw !== undefined
            ? { resultsJson: parseLinesOrJsonToArray(resultsRaw) }
            : {}),
          ...(galleryRaw !== undefined
            ? {
                galleryJson: parseLinesOrJsonToArray(galleryRaw, [thumbnail]),
              }
            : {}),
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "UPDATE",
        entity: "Portfolio",
        entityId: id,
        details: `Cập nhật dự án ${title} [${status}]`,
      });
    } else {
      const slugBase = slugifyText(customSlug || title);
      const conflict = await prisma.portfolio.findUnique({
        where: { slug: slugBase },
      });
      targetSlug = conflict
        ? `${slugBase}-${Date.now().toString().slice(-4)}`
        : slugBase;

      const created = await prisma.portfolio.create({
        data: {
          title,
          slug: targetSlug,
          clientName,
          year,
          categoryId: finalCategoryId,
          shortDesc: shortDesc || title,
          thumbnail,
          videoPreview,
          objective: objective || shortDesc || title,
          challenge: challenge || shortDesc || title,
          solution: solution || shortDesc || title,
          liveUrl: liveUrl || null,
          isFeatured,
          status,
          metaTitle,
          metaDescription,
          technologiesJson: parseLinesOrJsonToArray(technologiesRaw, [
            "Next.js",
            "Three.js",
            "PostgreSQL",
          ]),
          resultsJson: parseLinesOrJsonToArray(resultsRaw, []),
          galleryJson: parseLinesOrJsonToArray(galleryRaw, [thumbnail]),
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "CREATE",
        entity: "Portfolio",
        entityId: created.id,
        details: `Tạo dự án portfolio mới ${title} [${status}]`,
      });
    }

    revalidateAllPublicRoutes([`/portfolio/${targetSlug}`, ...(previousSlug && previousSlug !== targetSlug ? [`/portfolio/${previousSlug}`] : []), "/admin/portfolio"]);
    return { success: true, slug: targetSlug };
  } catch (error: any) {
    console.error("Error saving portfolio:", error);
    return { success: false, error: "Lỗi lưu portfolio." };
  }
}

export async function updatePortfolioStatus(id: string, rawStatus: string) {
  const session = await checkAdminPermission();
  const status = normalizeStatus(rawStatus);

  try {
    const updated = await prisma.portfolio.update({
      where: { id },
      data: { status, deletedAt: null },
    });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "STATUS_CHANGE",
      entity: "Portfolio",
      entityId: id,
      details: `Đổi trạng thái dự án "${updated.title}" -> ${status}`,
    });

    revalidateAllPublicRoutes([`/portfolio/${updated.slug}`, "/admin/portfolio"]);
    return { success: true };
  } catch (error: any) {
    console.error("Error updating portfolio status:", error);
    return { success: false, error: "Không thể cập nhật trạng thái dự án." };
  }
}

export async function deletePortfolio(id: string) {
  const session = await checkAdminPermission();

  try {
    const p = await prisma.portfolio.findUnique({ where: { id } });
    if (!p) return { success: false, error: "Dự án không tồn tại." };

    await prisma.portfolio.delete({ where: { id } });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "DELETE",
      entity: "Portfolio",
      entityId: id,
      details: `Xóa dự án portfolio ${p.title}`,
    });

    revalidateAllPublicRoutes([`/portfolio/${p.slug}`, "/admin/portfolio"]);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting portfolio:", error);
    return { success: false, error: "Lỗi xóa dự án." };
  }
}

// ==========================================
// 3. LAB PRODUCTS CRUD
// ==========================================

export async function saveLabProduct(formData: FormData) {
  const session = await checkAdminPermission();
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim() || "";
  const customSlug = formData.get("slug")?.toString().trim() || "";
  const tagline = formData.get("tagline")?.toString().trim() || "";
  const shortDesc = formData.get("shortDesc")?.toString().trim() || "";
  const description = formData.get("description")?.toString().trim() || "";
  const productStage = formData.get("productStage")?.toString() || "LIVE";
  const version = formData.get("version")?.toString() || "v1.0";
  const pricingModel =
    formData.get("pricingModel")?.toString() || "Freemium / SaaS";
  const demoUrl = formData.get("demoUrl")?.toString().trim() || null;
  const websiteUrl = formData.get("websiteUrl")?.toString().trim() || null;
  const status = normalizeStatus(formData.get("status")?.toString());
  const isFeatured =
    formData.get("isFeatured") !== null
      ? formData.get("isFeatured") === "true"
      : true;
  const thumbnail =
    formData.get("thumbnail")?.toString().trim() ||
    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80";
  const featuresRaw = formData.get("featuresJson")?.toString();
  const techStackRaw = formData.get("techStackJson")?.toString();

  if (!name || !shortDesc) {
    return {
      success: false,
      error: "Vui lòng nhập tên sản phẩm LAB và mô tả ngắn.",
    };
  }

  try {
    let cat = await prisma.productCategory.findFirst();
    if (!cat) {
      cat = await prisma.productCategory.create({
        data: { name: "AI Tools", slug: "ai-tools" },
      });
    }

    let targetSlug = "";
    let previousSlug = "";

    if (id) {
      const existing = await prisma.labProduct.findUnique({ where: { id } });
      if (!existing) {
        return { success: false, error: "Sản phẩm LAB không tồn tại." };
      }
      previousSlug = existing.slug;
      targetSlug = customSlug ? slugifyText(customSlug) : existing.slug;

      if (targetSlug !== existing.slug) {
        const conflict = await prisma.labProduct.findUnique({
          where: { slug: targetSlug },
        });
        if (conflict && conflict.id !== id) {
          targetSlug = `${targetSlug}-${Date.now().toString().slice(-4)}`;
        }
      }

      await prisma.labProduct.update({
        where: { id },
        data: {
          name,
          slug: targetSlug,
          tagline: tagline || existing.tagline || "Digital Product",
          shortDesc,
          description: description || shortDesc,
          thumbnail,
          productStage,
          version,
          pricingModel,
          demoUrl,
          websiteUrl,
          status,
          isFeatured,
          deletedAt: null,
          ...(featuresRaw !== undefined
            ? { featuresJson: parseLinesOrJsonToArray(featuresRaw) }
            : {}),
          ...(techStackRaw !== undefined
            ? { techStackJson: parseLinesOrJsonToArray(techStackRaw) }
            : {}),
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "UPDATE",
        entity: "LabProduct",
        entityId: id,
        details: `Cập nhật sản phẩm LAB ${name} [${status}]`,
      });
    } else {
      const slugBase = slugifyText(customSlug || name);
      const conflict = await prisma.labProduct.findUnique({
        where: { slug: slugBase },
      });
      targetSlug = conflict
        ? `${slugBase}-${Date.now().toString().slice(-4)}`
        : slugBase;

      const created = await prisma.labProduct.create({
        data: {
          name,
          slug: targetSlug,
          tagline: tagline || "Next-Gen Digital Product",
          categoryId: cat.id,
          shortDesc,
          description: description || shortDesc,
          thumbnail,
          productStage,
          version,
          pricingModel,
          demoUrl,
          websiteUrl,
          status,
          isFeatured,
          featuresJson: parseLinesOrJsonToArray(featuresRaw, [
            "Tự động hóa quy trình bằng AI",
            "Giao diện tương tác tốc độ cao",
            "Tích hợp API doanh nghiệp",
          ]),
          techStackJson: parseLinesOrJsonToArray(techStackRaw, [
            "Next.js",
            "Three.js",
            "PostgreSQL",
          ]),
          galleryJson: JSON.stringify([thumbnail]),
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "CREATE",
        entity: "LabProduct",
        entityId: created.id,
        details: `Tạo sản phẩm LAB ${name} [${status}]`,
      });
    }

    revalidateAllPublicRoutes([`/lab/${targetSlug}`, ...(previousSlug && previousSlug !== targetSlug ? [`/lab/${previousSlug}`] : []), "/admin/lab"]);
    return { success: true, slug: targetSlug };
  } catch (error: any) {
    console.error("Error saving lab product:", error);
    return { success: false, error: "Lỗi lưu sản phẩm LAB." };
  }
}

export async function updateLabProductStatus(id: string, rawStatus: string) {
  const session = await checkAdminPermission();
  const status = normalizeStatus(rawStatus);

  try {
    const updated = await prisma.labProduct.update({
      where: { id },
      data: { status, deletedAt: null },
    });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "STATUS_CHANGE",
      entity: "LabProduct",
      entityId: id,
      details: `Đổi trạng thái sản phẩm LAB "${updated.name}" -> ${status}`,
    });

    revalidateAllPublicRoutes([`/lab/${updated.slug}`, "/admin/lab"]);
    return { success: true };
  } catch (error: any) {
    console.error("Error updating lab product status:", error);
    return {
      success: false,
      error: "Không thể cập nhật trạng thái sản phẩm LAB.",
    };
  }
}

export async function deleteLabProduct(id: string) {
  const session = await checkAdminPermission();

  try {
    const prod = await prisma.labProduct.findUnique({ where: { id } });
    if (!prod) return { success: false, error: "Sản phẩm không tồn tại." };

    await prisma.labProduct.delete({ where: { id } });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "DELETE",
      entity: "LabProduct",
      entityId: id,
      details: `Xóa sản phẩm LAB ${prod.name}`,
    });

    revalidateAllPublicRoutes([`/lab/${prod.slug}`, "/admin/lab"]);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting lab product:", error);
    return { success: false, error: "Lỗi xóa sản phẩm LAB." };
  }
}

// ==========================================
// 4. BLOG POSTS CRUD
// ==========================================

export async function saveBlogPost(formData: FormData) {
  const session = await checkAdminPermission();
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString().trim() || "";
  const customSlug = formData.get("slug")?.toString().trim() || "";
  const excerpt = formData.get("excerpt")?.toString().trim() || "";
  const content = formData.get("content")?.toString().trim() || "";
  const authorName =
    formData.get("authorName")?.toString().trim() || "NGUYÊN Creative Lab";
  const readTime = formData.get("readTime")?.toString() || "6 phút đọc";
  const status = normalizeStatus(formData.get("status")?.toString());
  const thumbnail =
    formData.get("thumbnail")?.toString().trim() ||
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80";
  const tagsRaw = formData.get("tagsJson")?.toString();
  const metaTitle = formData.get("metaTitle")?.toString().trim() || null;
  const metaDescription =
    formData.get("metaDescription")?.toString().trim() || null;

  if (!title || !excerpt) {
    return {
      success: false,
      error: "Vui lòng nhập tiêu đề bài viết và tóm tắt.",
    };
  }

  try {
    let cat = await prisma.blogCategory.findFirst();
    if (!cat) {
      cat = await prisma.blogCategory.create({
        data: { name: "Tech & 3D", slug: "tech-3d" },
      });
    }

    let targetSlug = "";
    let previousSlug = "";

    if (id) {
      const existing = await prisma.blogPost.findUnique({ where: { id } });
      if (!existing) {
        return { success: false, error: "Bài viết không tồn tại." };
      }
      previousSlug = existing.slug;
      targetSlug = customSlug ? slugifyText(customSlug) : existing.slug;

      if (targetSlug !== existing.slug) {
        const conflict = await prisma.blogPost.findUnique({
          where: { slug: targetSlug },
        });
        if (conflict && conflict.id !== id) {
          targetSlug = `${targetSlug}-${Date.now().toString().slice(-4)}`;
        }
      }

      await prisma.blogPost.update({
        where: { id },
        data: {
          title,
          slug: targetSlug,
          excerpt,
          content: content || excerpt,
          authorName,
          readTime,
          status,
          thumbnail,
          metaTitle,
          metaDescription,
          deletedAt: null,
          ...(tagsRaw !== undefined
            ? { tagsJson: parseLinesOrJsonToArray(tagsRaw) }
            : {}),
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "UPDATE",
        entity: "BlogPost",
        entityId: id,
        details: `Cập nhật bài viết ${title} [${status}]`,
      });
    } else {
      const slugBase = slugifyText(customSlug || title);
      const conflict = await prisma.blogPost.findUnique({
        where: { slug: slugBase },
      });
      targetSlug = conflict
        ? `${slugBase}-${Date.now().toString().slice(-4)}`
        : slugBase;

      const created = await prisma.blogPost.create({
        data: {
          title,
          slug: targetSlug,
          excerpt,
          content: content || excerpt,
          categoryId: cat.id,
          authorName,
          readTime,
          status,
          thumbnail,
          metaTitle,
          metaDescription,
          tagsJson: parseLinesOrJsonToArray(tagsRaw, [
            "3D WebGL",
            "Next.js Architecture",
            "Digital Agency",
          ]),
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "CREATE",
        entity: "BlogPost",
        entityId: created.id,
        details: `Tạo bài viết mới ${title} [${status}]`,
      });
    }

    revalidateAllPublicRoutes([`/blog/${targetSlug}`, ...(previousSlug && previousSlug !== targetSlug ? [`/blog/${previousSlug}`] : []), "/admin/blog"]);
    return { success: true, slug: targetSlug };
  } catch (error: any) {
    console.error("Error saving blog post:", error);
    return { success: false, error: "Lỗi lưu bài viết." };
  }
}

export async function updateBlogPostStatus(id: string, rawStatus: string) {
  const session = await checkAdminPermission();
  const status = normalizeStatus(rawStatus);

  try {
    const updated = await prisma.blogPost.update({
      where: { id },
      data: { status, deletedAt: null },
    });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "STATUS_CHANGE",
      entity: "BlogPost",
      entityId: id,
      details: `Đổi trạng thái bài viết "${updated.title}" -> ${status}`,
    });

    safeRevalidatePath("/");
    safeRevalidatePath("/blog");
    safeRevalidatePath(`/blog/${updated.slug}`);
    safeRevalidatePath("/admin/blog");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating blog post status:", error);
    return { success: false, error: "Không thể cập nhật trạng thái bài viết." };
  }
}

export async function deleteBlogPost(id: string) {
  const session = await checkAdminPermission();

  try {
    const p = await prisma.blogPost.findUnique({ where: { id } });
    if (!p) return { success: false, error: "Bài viết không tồn tại." };

    await prisma.blogPost.delete({ where: { id } });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "DELETE",
      entity: "BlogPost",
      entityId: id,
      details: `Xóa bài viết ${p.title}`,
    });

    safeRevalidatePath("/");
    safeRevalidatePath("/blog");
    safeRevalidatePath(`/blog/${p.slug}`);
    safeRevalidatePath("/admin/blog");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting blog post:", error);
    return { success: false, error: "Lỗi xóa bài viết." };
  }
}

// ==========================================
// 5. SERVICE PACKAGES (PRICING) CRUD
// ==========================================

export async function saveServicePackage(formData: FormData) {
  const session = await checkAdminPermission();
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim() || "";
  const packageGroup = formData.get("packageGroup")?.toString().trim() || "Website Packages";
  const priceLabel = formData.get("priceLabel")?.toString().trim() || "";
  const priceAmount =
    parseFloat(formData.get("priceAmount")?.toString() || "0") || 0;
  const description = formData.get("description")?.toString().trim() || "";
  const timeline = formData.get("timeline")?.toString().trim() || "2 - 4 tuần";
  const featuresRaw = formData.get("featuresJson")?.toString();
  const isPopular = formData.get("isPopular") === "true";
  const order = parseInt(formData.get("order")?.toString() || "0", 10) || 0;
  const status = normalizeStatus(formData.get("status")?.toString());

  if (!name || !priceLabel) {
    return {
      success: false,
      error: "Vui lòng nhập tên gói dịch vụ và mức giá hiển thị.",
    };
  }

  try {
    if (id) {
      await prisma.servicePackage.update({
        where: { id },
        data: {
          name,
          packageGroup,
          priceDisplay: priceLabel,
          price: priceAmount > 0 ? priceAmount : null,
          isCustomQuote: priceAmount <= 0,
          description: description || name,
          deliveryTime: timeline,
          ...(featuresRaw !== undefined
            ? { featuresJson: parseLinesOrJsonToArray(featuresRaw) }
            : {}),
          isPopular,
          order,
          status,
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "UPDATE",
        entity: "ServicePackage",
        entityId: id,
        details: `Cập nhật gói bảng giá ${name} (${priceLabel})`,
      });
    } else {
      const slugBase = slugifyText(name);
      const slug = `${slugBase}-${Date.now().toString().slice(-4)}`;
      const created = await prisma.servicePackage.create({
        data: {
          name,
          slug,
          packageGroup,
          priceDisplay: priceLabel,
          price: priceAmount > 0 ? priceAmount : null,
          isCustomQuote: priceAmount <= 0,
          description: description || name,
          deliveryTime: timeline,
          featuresJson: parseLinesOrJsonToArray(featuresRaw, [
            "Tư vấn chiến lược & Kiến trúc hệ thống",
            "Thiết kế UI/UX độc bản Luxury Dark",
            "Bảo hành kỹ thuật 12 tháng",
          ]),
          comparisonJson: "{}",
          ctaText: "Chọn gói dịch vụ",
          isPopular,
          order,
          status,
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "CREATE",
        entity: "ServicePackage",
        entityId: created.id,
        details: `Thêm gói bảng giá mới ${name} (${priceLabel})`,
      });
    }

    safeRevalidatePath("/pricing");
    safeRevalidatePath("/services");
    safeRevalidatePath("/admin/services");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving service package:", error);
    return { success: false, error: "Lỗi lưu gói dịch vụ." };
  }
}

export async function deleteServicePackage(id: string) {
  const session = await checkAdminPermission();

  try {
    const pkg = await prisma.servicePackage.findUnique({ where: { id } });
    if (!pkg) return { success: false, error: "Gói dịch vụ không tồn tại." };

    await prisma.servicePackage.delete({ where: { id } });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "DELETE",
      entity: "ServicePackage",
      entityId: id,
      details: `Xóa gói bảng giá ${pkg.name}`,
    });

    safeRevalidatePath("/pricing");
    safeRevalidatePath("/services");
    safeRevalidatePath("/admin/services");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting service package:", error);
    return { success: false, error: "Lỗi xóa gói dịch vụ." };
  }
}

// ==========================================
// 6. TESTIMONIALS CRUD
// ==========================================

export async function saveTestimonial(formData: FormData) {
  const session = await checkAdminPermission();
  const id = formData.get("id")?.toString();
  const clientName = formData.get("clientName")?.toString().trim() || "";
  const clientRole = formData.get("clientRole")?.toString().trim() || "";
  const company = formData.get("company")?.toString().trim() || "";
  const content = formData.get("content")?.toString().trim() || "";
  const rating = parseInt(formData.get("rating")?.toString() || "5", 10) || 5;
  const status = normalizeStatus(formData.get("status")?.toString());

  if (!clientName || !content) {
    return {
      success: false,
      error: "Vui lòng nhập tên khách hàng và nội dung đánh giá.",
    };
  }

  try {
    if (id) {
      await prisma.testimonial.update({
        where: { id },
        data: {
          clientName,
          clientRole: clientRole || "CEO / Founder",
          company: company || "Enterprise Partner",
          content,
          rating,
          status,
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "UPDATE",
        entity: "Testimonial",
        entityId: id,
        details: `Cập nhật đánh giá khách hàng: ${clientName} (${company})`,
      });
    } else {
      const created = await prisma.testimonial.create({
        data: {
          clientName,
          clientRole: clientRole || "CEO / Founder",
          company: company || "Enterprise Partner",
          content,
          rating,
          status,
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "CREATE",
        entity: "Testimonial",
        entityId: created.id,
        details: `Thêm đánh giá khách hàng mới: ${clientName} (${company})`,
      });
    }

    safeRevalidatePath("/");
    safeRevalidatePath("/about");
    safeRevalidatePath("/admin/homepage");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving testimonial:", error);
    return { success: false, error: "Lỗi lưu đánh giá khách hàng." };
  }
}

export async function deleteTestimonial(id: string) {
  const session = await checkAdminPermission();

  try {
    const t = await prisma.testimonial.findUnique({ where: { id } });
    if (!t) return { success: false, error: "Đánh giá không tồn tại." };

    await prisma.testimonial.delete({ where: { id } });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "DELETE",
      entity: "Testimonial",
      entityId: id,
      details: `Xóa đánh giá của ${t.clientName}`,
    });

    safeRevalidatePath("/");
    safeRevalidatePath("/about");
    safeRevalidatePath("/admin/homepage");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting testimonial:", error);
    return { success: false, error: "Lỗi xóa đánh giá." };
  }
}

// ==========================================
// 7. FAQ CRUD
// ==========================================

export async function saveFAQ(formData: FormData) {
  const session = await checkAdminPermission();
  const id = formData.get("id")?.toString();
  const question = formData.get("question")?.toString().trim() || "";
  const answer = formData.get("answer")?.toString().trim() || "";
  const category = formData.get("category")?.toString().trim() || "General";
  const order = parseInt(formData.get("order")?.toString() || "0", 10) || 0;
  const status = normalizeStatus(formData.get("status")?.toString());

  if (!question || !answer) {
    return {
      success: false,
      error: "Vui lòng nhập câu hỏi và câu trả lời FAQ.",
    };
  }

  try {
    if (id) {
      await prisma.fAQ.update({
        where: { id },
        data: {
          question,
          answer,
          category,
          order,
          status,
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "UPDATE",
        entity: "FAQ",
        entityId: id,
        details: `Cập nhật FAQ: ${question}`,
      });
    } else {
      const created = await prisma.fAQ.create({
        data: {
          question,
          answer,
          category,
          order,
          status,
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "CREATE",
        entity: "FAQ",
        entityId: created.id,
        details: `Thêm FAQ mới: ${question}`,
      });
    }

    safeRevalidatePath("/");
    safeRevalidatePath("/faq");
    safeRevalidatePath("/pricing");
    safeRevalidatePath("/services");
    safeRevalidatePath("/lab");
    safeRevalidatePath("/admin/homepage");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving FAQ:", error);
    return { success: false, error: "Lỗi lưu câu hỏi FAQ." };
  }
}

export async function deleteFAQ(id: string) {
  const session = await checkAdminPermission();

  try {
    const f = await prisma.fAQ.findUnique({ where: { id } });
    if (!f) return { success: false, error: "Câu hỏi FAQ không tồn tại." };

    await prisma.fAQ.delete({ where: { id } });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "DELETE",
      entity: "FAQ",
      entityId: id,
      details: `Xóa FAQ: ${f.question}`,
    });

    safeRevalidatePath("/");
    safeRevalidatePath("/faq");
    safeRevalidatePath("/pricing");
    safeRevalidatePath("/admin/homepage");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting FAQ:", error);
    return { success: false, error: "Lỗi xóa câu hỏi FAQ." };
  }
}
