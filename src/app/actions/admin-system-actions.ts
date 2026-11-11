"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { checkAdminPermission, logActivity, safeRevalidatePath, revalidateAllPublicRoutes } from "./admin-common";

// ==========================================
// 0. CACHE MANAGEMENT
// ==========================================

/**
 * Force revalidate all public-facing pages.
 * Admin can call this from the Settings page when data appears stale.
 */
export async function forceRevalidateAllPages() {
  await checkAdminPermission();
  revalidateAllPublicRoutes();
  return {
    success: true,
    message: "✅ Đã làm mới cache toàn bộ website. Dữ liệu mới nhất sẽ hiển thị sau vài giây.",
    timestamp: new Date().toISOString(),
  };
}

// ==========================================
// 1. QUOTATIONS CRUD
// ==========================================

export async function saveQuotation(formData: FormData) {
  const session = await checkAdminPermission();
  const id = formData.get("id")?.toString();
  const clientName = formData.get("clientName")?.toString().trim() || "";
  const clientEmail = formData.get("clientEmail")?.toString().trim() || "";
  const clientCompany = formData.get("clientCompany")?.toString().trim() || "";
  const serviceName = formData.get("serviceName")?.toString() || "3D Website Development";
  const packageName = formData.get("packageName")?.toString() || "";
  const requirements = formData.get("requirements")?.toString() || "";
  const totalAmount = parseFloat(formData.get("totalAmount")?.toString() || "0") || 0;
  const status = formData.get("status")?.toString() || "NEW";

  if (!clientName || !clientEmail) {
    return { success: false, error: "Vui lòng nhập tên và email khách hàng." };
  }

  try {
    if (id) {
      await prisma.quotation.update({
        where: { id },
        data: {
          clientName,
          clientEmail,
          clientCompany,
          serviceName,
          packageName,
          requirements: requirements || serviceName,
          totalAmount,
          subtotal: totalAmount,
          status,
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "UPDATE",
        entity: "Quotation",
        entityId: id,
        details: `Cập nhật báo giá cho ${clientName} (${status})`,
      });
    } else {
      const count = await prisma.quotation.count();
      const code = `QT-2026-${String(count + 1).padStart(4, "0")}`;

      const created = await prisma.quotation.create({
        data: {
          code,
          clientName,
          clientEmail,
          clientCompany,
          serviceName,
          packageName,
          requirements: requirements || serviceName,
          totalAmount,
          subtotal: totalAmount,
          status,
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "CREATE",
        entity: "Quotation",
        entityId: created.id,
        details: `Tạo báo giá mới ${code} cho ${clientName}`,
      });
    }

    safeRevalidatePath("/admin/quotations");
    safeRevalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving quotation:", error);
    return { success: false, error: "Lỗi lưu báo giá." };
  }
}

export async function deleteQuotation(id: string) {
  const session = await checkAdminPermission();

  try {
    const q = await prisma.quotation.findUnique({ where: { id } });
    if (!q) return { success: false, error: "Báo giá không tồn tại." };

    await prisma.quotation.delete({ where: { id } });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "DELETE",
      entity: "Quotation",
      entityId: id,
      details: `Xóa báo giá ${q.code} (${q.clientName})`,
    });

    safeRevalidatePath("/admin/quotations");
    safeRevalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting quotation:", error);
    return { success: false, error: "Lỗi xóa báo giá." };
  }
}

export async function convertQuotationToProject(quotationId: string) {
  const session = await checkAdminPermission();

  try {
    const q = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { customer: true },
    });

    if (!q) return { success: false, error: "Báo giá không tồn tại." };

    let customerId = q.customerId;
    if (!customerId) {
      let cust = await prisma.customer.findUnique({ where: { email: q.clientEmail } });
      if (!cust) {
        const count = await prisma.customer.count();
        const customerCode = `CUS-2026-${String(count + 1).padStart(3, "0")}`;
        cust = await prisma.customer.create({
          data: {
            code: customerCode,
            name: q.clientName,
            email: q.clientEmail,
            company: q.clientCompany || undefined,
            tier: "ENTERPRISE",
            careStatus: "ACTIVE",
          },
        });
      }
      customerId = cust.id;
      await prisma.quotation.update({
        where: { id: quotationId },
        data: { customerId },
      });
    }

    const count = await prisma.project.count();
    const code = `PRJ-2026-${String(count + 1).padStart(3, "0")}`;
    const name = `Dự Án ${q.serviceName} (${q.clientName})`;
    const slug = `${code.toLowerCase()}-${q.clientName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now().toString().slice(-4)}`;

    const project = await prisma.project.create({
      data: {
        code,
        name,
        slug,
        customerId,
        category: q.serviceName.includes("3D") ? "3D Web Experience" : "Digital Platform",
        description: q.requirements || `Thực hiện dự án theo báo giá ${q.code}`,
        budget: q.totalAmount,
        progress: 10,
        status: "IN_PROGRESS",
        priority: "HIGH",
        startDate: new Date(),
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        managerName: session.name || "Nguyên Director",
      },
    });

    // Create 3 kickoff tasks
    await prisma.projectTask.createMany({
      data: [
        {
          projectId: project.id,
          title: "1. Thống nhất Scope of Work & Chi tiết kỹ thuật",
          description: `Triển khai từ báo giá ${q.code}`,
          status: "IN_PROGRESS",
          priority: "HIGH",
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          assigneeName: "Technical Lead",
        },
        {
          projectId: project.id,
          title: "2. Thiết kế Visual Concept, Wireframe & 3D Assets",
          description: "Mô hình 3D, animation GSAP và trải nghiệm UI/UX",
          status: "PENDING",
          priority: "HIGH",
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          assigneeName: "Senior 3D Artist",
        },
        {
          projectId: project.id,
          title: "3. Lập trình Core Features & Tối ưu chuẩn 60 FPS",
          description: "Tích hợp Backend API, cơ sở dữ liệu và bảo mật",
          status: "PENDING",
          priority: "MEDIUM",
          dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
          assigneeName: "Fullstack Engineer",
        },
      ],
    });

    // Update quotation status to APPROVED
    await prisma.quotation.update({
      where: { id: quotationId },
      data: { status: "APPROVED" },
    });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "CONVERT_QUOTATION",
      entity: "Project",
      entityId: project.id,
      details: `Chuyển đổi thành công báo giá ${q.code} thành dự án mới: ${project.name} (${project.code})`,
    });

    safeRevalidatePath("/admin/quotations");
    safeRevalidatePath("/admin/projects");
    safeRevalidatePath("/admin");
    return { success: true, projectCode: project.code, projectName: project.name };
  } catch (error: any) {
    console.error("Error converting quotation to project:", error);
    return { success: false, error: "Lỗi chuyển đổi báo giá thành dự án." };
  }
}

// ==========================================
// 2. USERS CRUD
// ==========================================

export async function saveUser(formData: FormData) {
  const session = await checkAdminPermission();
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim() || "";
  const email = formData.get("email")?.toString().trim() || "";
  const roleName = formData.get("roleName")?.toString() || "STAFF";
  const title = formData.get("title")?.toString().trim() || "";
  const password = formData.get("password")?.toString() || "";

  if (!name || !email) {
    return { success: false, error: "Vui lòng nhập họ tên và email." };
  }

  try {
    if (id) {
      const dataToUpdate: any = {
        name,
        email,
        roleName,
        title,
      };

      if (password) {
        dataToUpdate.passwordHash = await bcrypt.hash(password, 10);
      }

      await prisma.user.update({
        where: { id },
        data: dataToUpdate,
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "UPDATE",
        entity: "User",
        entityId: id,
        details: `Cập nhật tài khoản ${email} (${roleName})`,
      });
    } else {
      if (!password) {
        return { success: false, error: "Vui lòng nhập mật khẩu cho tài khoản mới." };
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return { success: false, error: "Email này đã được sử dụng." };
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const created = await prisma.user.create({
        data: {
          name,
          email,
          roleName,
          title,
          passwordHash,
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "CREATE",
        entity: "User",
        entityId: created.id,
        details: `Tạo tài khoản quản trị mới ${email} (${roleName})`,
      });
    }

    safeRevalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving user:", error);
    return { success: false, error: "Lỗi lưu tài khoản người dùng." };
  }
}

export async function deleteUser(id: string) {
  const session = await checkAdminPermission();

  try {
    if (id === session.userId) {
      return { success: false, error: "Bạn không thể tự xóa tài khoản của chính mình." };
    }

    const u = await prisma.user.findUnique({ where: { id } });
    if (!u) return { success: false, error: "Tài khoản không tồn tại." };

    await prisma.user.delete({ where: { id } });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "DELETE",
      entity: "User",
      entityId: id,
      details: `Xóa tài khoản ${u.email}`,
    });

    safeRevalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Lỗi xóa người dùng." };
  }
}

// ==========================================
// 3. SITE SETTINGS CRUD
// ==========================================

export async function saveSiteSetting(formData: FormData) {
  const session = await checkAdminPermission();
  const id = formData.get("id")?.toString();
  const key = formData.get("key")?.toString().trim() || "";
  const value = formData.get("value")?.toString().trim() || "";
  const group = formData.get("group")?.toString() || "GENERAL";
  const description = formData.get("description")?.toString().trim() || "";

  if (!key) {
    return { success: false, error: "Khóa cấu hình (Key) không được để trống." };
  }

  try {
    if (id) {
      await prisma.siteSetting.update({
        where: { id },
        data: {
          key,
          value,
          group,
          description,
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "UPDATE",
        entity: "SiteSetting",
        entityId: id,
        details: `Cập nhật cấu hình ${key} = ${value.slice(0, 50)}`,
      });
    } else {
      const existing = await prisma.siteSetting.findUnique({ where: { key } });
      if (existing) {
        await prisma.siteSetting.update({
          where: { key },
          data: {
            value,
            group,
            description,
          },
        });
      } else {
        const created = await prisma.siteSetting.create({
          data: {
            key,
            value,
            group,
            description,
          },
        });

        await logActivity({
          userId: session.userId,
          actorName: session.name,
          action: "CREATE",
          entity: "SiteSetting",
          entityId: created.id,
          details: `Thêm cấu hình mới ${key}`,
        });
      }
    }

    safeRevalidatePath("/admin/settings");
    safeRevalidatePath("/", "layout");
    safeRevalidatePath("/");
    safeRevalidatePath("/contact");
    safeRevalidatePath("/about");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving site setting:", error);
    return { success: false, error: "Lỗi lưu cấu hình hệ thống." };
  }
}

export async function deleteSiteSetting(id: string) {
  const session = await checkAdminPermission();

  try {
    const s = await prisma.siteSetting.findUnique({ where: { id } });
    if (!s) return { success: false, error: "Cấu hình không tồn tại." };

    await prisma.siteSetting.delete({ where: { id } });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "DELETE",
      entity: "SiteSetting",
      entityId: id,
      details: `Xóa cấu hình ${s.key}`,
    });

    safeRevalidatePath("/admin/settings");
    safeRevalidatePath("/", "layout");
    safeRevalidatePath("/");
    safeRevalidatePath("/contact");
    safeRevalidatePath("/about");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting site setting:", error);
    return { success: false, error: "Lỗi xóa cấu hình." };
  }
}

// ==========================================
// 4. MEDIA ASSETS CRUD
// ==========================================

export async function saveMediaAsset(formData: FormData) {
  const session = await checkAdminPermission();
  const title = formData.get("title")?.toString().trim() || "";
  const url = formData.get("url")?.toString().trim() || "";
  const mimeType = formData.get("mimeType")?.toString() || "image/jpeg";
  const folder = formData.get("folder")?.toString() || "general";

  if (!title || !url) {
    return { success: false, error: "Vui lòng nhập tên và URL hình ảnh/tài liệu." };
  }

  try {
    const fileName = title.toLowerCase().replace(/[^a-z0-9]/g, "-") + ".jpg";
    const type = mimeType.startsWith("video")
      ? "VIDEO"
      : mimeType.startsWith("application")
      ? "DOCUMENT"
      : "IMAGE";

    const created = await prisma.mediaAsset.create({
      data: {
        title,
        fileName,
        url,
        mimeType,
        type,
        folder,
        size: 0,
        uploadedBy: session.name || "Admin",
      },
    });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "CREATE",
      entity: "MediaAsset",
      entityId: created.id,
      details: `Thêm media mới: ${title}`,
    });

    safeRevalidatePath("/admin/media");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving media asset:", error);
    return { success: false, error: "Lỗi thêm media asset." };
  }
}

export async function deleteMediaAsset(id: string) {
  const session = await checkAdminPermission();

  try {
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) return { success: false, error: "Media không tồn tại." };

    await prisma.mediaAsset.delete({ where: { id } });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "DELETE",
      entity: "MediaAsset",
      entityId: id,
      details: `Xóa media: ${asset.title}`,
    });

    safeRevalidatePath("/admin/media");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting media asset:", error);
    return { success: false, error: "Lỗi xóa media." };
  }
}
