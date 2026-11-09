"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdminPermission, logActivity } from "./admin-common";

// ==========================================
// 1. CUSTOMERS CRUD
// ==========================================

export async function saveCustomer(formData: FormData) {
  const session = await checkAdminPermission();
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim() || "";
  const email = formData.get("email")?.toString().trim() || "";
  const phone = formData.get("phone")?.toString().trim() || "";
  const company = formData.get("company")?.toString().trim() || "";
  const position = formData.get("position")?.toString().trim() || "";
  const address = formData.get("address")?.toString().trim() || "";
  const tier = formData.get("tier")?.toString() || "ENTERPRISE";
  const careStatus = formData.get("careStatus")?.toString() || "ACTIVE";
  const notes = formData.get("notes")?.toString().trim() || "";

  if (!name || !email) {
    return { success: false, error: "Vui lòng nhập họ tên và email khách hàng." };
  }

  try {
    if (id) {
      // Update
      const updated = await prisma.customer.update({
        where: { id },
        data: {
          name,
          email,
          phone,
          company,
          position,
          address,
          tier,
          careStatus,
          notes,
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "UPDATE",
        entity: "Customer",
        entityId: id,
        details: `Cập nhật thông tin khách hàng ${name} (${updated.code})`,
      });
    } else {
      // Create
      const count = await prisma.customer.count();
      const code = `CUS-2026-${String(count + 1).padStart(3, "0")}`;

      // Check duplicate email
      const existing = await prisma.customer.findUnique({ where: { email } });
      if (existing) {
        return { success: false, error: "Email này đã tồn tại trong danh bạ khách hàng." };
      }

      const created = await prisma.customer.create({
        data: {
          code,
          name,
          email,
          phone,
          company,
          position,
          address,
          tier,
          careStatus,
          notes,
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "CREATE",
        entity: "Customer",
        entityId: created.id,
        details: `Thêm khách hàng mới ${name} (${code})`,
      });
    }

    revalidatePath("/admin/customers");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving customer:", error);
    return { success: false, error: error.message || "Lỗi lưu khách hàng." };
  }
}

export async function deleteCustomer(id: string) {
  const session = await checkAdminPermission();

  try {
    // Check constraints: prevent deleting customer with contracts or invoices
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        contracts: true,
        invoices: true,
        projects: true,
      },
    });

    if (!customer) {
      return { success: false, error: "Khách hàng không tồn tại." };
    }

    if (customer.contracts.length > 0 || customer.invoices.length > 0 || customer.projects.length > 0) {
      return {
        success: false,
        error: "Không thể xóa: Khách hàng này đã có dự án, hợp đồng hoặc hóa đơn ràng buộc. Vui lòng chuyển trạng thái sang INACTIVE thay vì xóa.",
      };
    }

    // Soft delete if deletedAt supported, or delete
    await prisma.customer.delete({ where: { id } });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "DELETE",
      entity: "Customer",
      entityId: id,
      details: `Xóa khách hàng ${customer.name} (${customer.code})`,
    });

    revalidatePath("/admin/customers");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting customer:", error);
    return { success: false, error: "Lỗi hệ thống khi xóa khách hàng." };
  }
}

// ==========================================
// 2. LEADS CRUD
// ==========================================

export async function saveLead(formData: FormData) {
  const session = await checkAdminPermission();
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim() || "";
  const email = formData.get("email")?.toString().trim() || "";
  const phone = formData.get("phone")?.toString().trim() || "";
  const company = formData.get("company")?.toString().trim() || "";
  const serviceInterest = formData.get("serviceInterest")?.toString() || "3D Website & Web App";
  const budget = formData.get("budget")?.toString() || "";
  const stage = formData.get("stage")?.toString() || "NEW_LEAD";
  const priority = formData.get("priority")?.toString() || "HIGH";
  const notes = formData.get("notes")?.toString().trim() || "";

  if (!name || !email) {
    return { success: false, error: "Vui lòng nhập họ tên và email của Lead." };
  }

  try {
    if (id) {
      const updated = await prisma.lead.update({
        where: { id },
        data: {
          name,
          email,
          phone,
          company,
          serviceInterest,
          budget,
          stage,
          priority,
          notes,
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "UPDATE",
        entity: "Lead",
        entityId: id,
        details: `Cập nhật Lead ${name} (${updated.code}) sang trạng thái ${stage}`,
      });
    } else {
      const timestamp = Date.now().toString().slice(-4);
      const code = `LEAD-2026-${timestamp}`;

      const created = await prisma.lead.create({
        data: {
          code,
          name,
          email,
          phone,
          company,
          serviceInterest,
          budget,
          stage,
          priority,
          notes,
          source: "Manual Entry (Admin)",
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "CREATE",
        entity: "Lead",
        entityId: created.id,
        details: `Tạo Lead thủ công ${name} (${code})`,
      });
    }

    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving lead:", error);
    return { success: false, error: "Lỗi lưu Lead." };
  }
}

export async function deleteLead(id: string) {
  const session = await checkAdminPermission();

  try {
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return { success: false, error: "Lead không tồn tại." };

    await prisma.lead.delete({ where: { id } });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "DELETE",
      entity: "Lead",
      entityId: id,
      details: `Xóa Lead ${lead.name} (${lead.code})`,
    });

    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting lead:", error);
    return { success: false, error: "Lỗi khi xóa Lead." };
  }
}

