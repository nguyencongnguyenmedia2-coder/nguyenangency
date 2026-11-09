"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdminPermission, logActivity } from "./admin-common";

// ==========================================
// 1. PROJECTS CRUD
// ==========================================

export async function saveProject(formData: FormData) {
  const session = await checkAdminPermission();
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim() || "";
  const customerId = formData.get("customerId")?.toString() || "";
  const category = formData.get("category")?.toString() || "Web Application";
  const description = formData.get("description")?.toString().trim() || "";
  const progress = parseInt(formData.get("progress")?.toString() || "0", 10) || 0;
  const status = formData.get("status")?.toString() || "IN_PROGRESS";
  const managerName = formData.get("managerName")?.toString() || "Nguyên Director";

  if (!name || !customerId) {
    return { success: false, error: "Vui lòng nhập tên dự án và chọn khách hàng." };
  }

  try {
    if (id) {
      await prisma.project.update({
        where: { id },
        data: {
          name,
          customerId,
          category,
          description: description || name,
          progress,
          status,
          managerName,
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "UPDATE",
        entity: "Project",
        entityId: id,
        details: `Cập nhật dự án ${name} (${progress}%)`,
      });
    } else {
      const count = await prisma.project.count();
      const code = `PRJ-2026-${String(count + 1).padStart(3, "0")}`;
      const slug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const created = await prisma.project.create({
        data: {
          code,
          name,
          slug: `${slug}-${Date.now().toString().slice(-4)}`,
          customerId,
          category,
          description: description || name,
          progress,
          status,
          managerName,
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "CREATE",
        entity: "Project",
        entityId: created.id,
        details: `Tạo dự án mới ${name} (${code})`,
      });
    }

    revalidatePath("/admin/projects");
    revalidatePath("/client/dashboard");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving project:", error);
    return { success: false, error: "Lỗi lưu dự án." };
  }
}

export async function deleteProject(id: string) {
  const session = await checkAdminPermission();

  try {
    const proj = await prisma.project.findUnique({ where: { id } });
    if (!proj) return { success: false, error: "Dự án không tồn tại." };

    await prisma.project.delete({ where: { id } });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "DELETE",
      entity: "Project",
      entityId: id,
      details: `Xóa dự án ${proj.name} (${proj.code})`,
    });

    revalidatePath("/admin/projects");
    revalidatePath("/client/dashboard");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return { success: false, error: "Lỗi xóa dự án." };
  }
}

// ==========================================
// 2. TASKS CRUD
// ==========================================

export async function saveTask(formData: FormData) {
  const session = await checkAdminPermission();
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString().trim() || "";
  const projectId = formData.get("projectId")?.toString() || "";
  const priority = formData.get("priority")?.toString() || "MEDIUM";
  const status = formData.get("status")?.toString() || "IN_PROGRESS";
  const assigneeName = formData.get("assigneeName")?.toString() || "Nguyên Director";

  if (!title || !projectId) {
    return { success: false, error: "Vui lòng nhập tên nhiệm vụ và chọn dự án." };
  }

  try {
    if (id) {
      await prisma.projectTask.update({
        where: { id },
        data: {
          title,
          projectId,
          priority,
          status,
          assigneeName,
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "UPDATE",
        entity: "ProjectTask",
        entityId: id,
        details: `Cập nhật nhiệm vụ: ${title}`,
      });
    } else {
      const created = await prisma.projectTask.create({
        data: {
          title,
          projectId,
          priority,
          status,
          assigneeName,
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "CREATE",
        entity: "ProjectTask",
        entityId: created.id,
        details: `Tạo nhiệm vụ mới: ${title}`,
      });
    }

    revalidatePath("/admin/tasks");
    revalidatePath("/admin/projects");
    revalidatePath("/client/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving task:", error);
    return { success: false, error: "Lỗi lưu nhiệm vụ." };
  }
}

export async function deleteTask(id: string) {
  const session = await checkAdminPermission();

  try {
    const task = await prisma.projectTask.findUnique({ where: { id } });
    if (!task) return { success: false, error: "Nhiệm vụ không tồn tại." };

    await prisma.projectTask.delete({ where: { id } });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "DELETE",
      entity: "ProjectTask",
      entityId: id,
      details: `Xóa nhiệm vụ: ${task.title}`,
    });

    revalidatePath("/admin/tasks");
    revalidatePath("/admin/projects");
    revalidatePath("/client/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting task:", error);
    return { success: false, error: "Lỗi xóa nhiệm vụ." };
  }
}

// ==========================================
// 3. CONTRACTS CRUD
// ==========================================

export async function saveContract(formData: FormData) {
  const session = await checkAdminPermission();
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString().trim() || "";
  const customerId = formData.get("customerId")?.toString() || "";
  const totalValue = parseFloat(formData.get("totalValue")?.toString() || "0") || 0;
  const status = formData.get("status")?.toString() || "ACTIVE";
  const termsSummary = formData.get("termsSummary")?.toString() || "";

  if (!title || !customerId) {
    return { success: false, error: "Vui lòng nhập tên hợp đồng và chọn khách hàng." };
  }

  try {
    if (id) {
      await prisma.contract.update({
        where: { id },
        data: {
          title,
          customerId,
          totalValue,
          status,
          termsSummary,
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "UPDATE",
        entity: "Contract",
        entityId: id,
        details: `Cập nhật hợp đồng: ${title}`,
      });
    } else {
      const count = await prisma.contract.count();
      const code = `CTR-2026-${String(count + 1).padStart(3, "0")}`;

      const created = await prisma.contract.create({
        data: {
          code,
          title,
          customerId,
          totalValue,
          status,
          termsSummary,
          signedDate: new Date(),
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "CREATE",
        entity: "Contract",
        entityId: created.id,
        details: `Tạo hợp đồng mới ${title} (${code})`,
      });
    }

    revalidatePath("/admin/contracts");
    revalidatePath("/client/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving contract:", error);
    return { success: false, error: "Lỗi lưu hợp đồng." };
  }
}

export async function deleteContract(id: string) {
  const session = await checkAdminPermission();

  try {
    const ctr = await prisma.contract.findUnique({ where: { id } });
    if (!ctr) return { success: false, error: "Hợp đồng không tồn tại." };

    await prisma.contract.delete({ where: { id } });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "DELETE",
      entity: "Contract",
      entityId: id,
      details: `Hủy/Xóa hợp đồng ${ctr.title} (${ctr.code})`,
    });

    revalidatePath("/admin/contracts");
    revalidatePath("/client/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting contract:", error);
    return { success: false, error: "Lỗi xóa hợp đồng." };
  }
}

// ==========================================
// 4. INVOICES CRUD
// ==========================================

export async function saveInvoice(formData: FormData) {
  const session = await checkAdminPermission();
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString().trim() || "";
  const customerId = formData.get("customerId")?.toString() || "";
  const amount = parseFloat(formData.get("amount")?.toString() || "0") || 0;
  const status = formData.get("status")?.toString() || "UNPAID";
  const notes = formData.get("notes")?.toString() || "";

  if (!title || !customerId || amount <= 0) {
    return { success: false, error: "Vui lòng nhập tiêu đề, khách hàng và số tiền hợp lệ (> 0)." };
  }

  try {
    const taxAmount = amount * 0.08;
    const totalAmount = amount + taxAmount;

    if (id) {
      await prisma.invoice.update({
        where: { id },
        data: {
          title,
          customerId,
          amount,
          taxAmount,
          totalAmount,
          status,
          notes,
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "UPDATE",
        entity: "Invoice",
        entityId: id,
        details: `Cập nhật hóa đơn ${title}`,
      });
    } else {
      const count = await prisma.invoice.count();
      const code = `INV-2026-${String(count + 1).padStart(3, "0")}`;

      const created = await prisma.invoice.create({
        data: {
          code,
          title,
          customerId,
          amount,
          taxAmount,
          totalAmount,
          status,
          notes,
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days later
        },
      });

      await logActivity({
        userId: session.userId,
        actorName: session.name,
        action: "CREATE",
        entity: "Invoice",
        entityId: created.id,
        details: `Xuất hóa đơn mới ${title} (${code})`,
      });
    }

    revalidatePath("/admin/invoices");
    revalidatePath("/client/dashboard");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving invoice:", error);
    return { success: false, error: "Lỗi lưu hóa đơn." };
  }
}

export async function deleteInvoice(id: string) {
  const session = await checkAdminPermission();

  try {
    const inv = await prisma.invoice.findUnique({
      where: { id },
      include: { payments: true },
    });

    if (!inv) return { success: false, error: "Hóa đơn không tồn tại." };

    if (inv.payments.length > 0) {
      return {
        success: false,
        error: "Không thể xóa hóa đơn đã có giao dịch thanh toán thực tế. Hãy cập nhật trạng thái CANCELLED.",
      };
    }

    await prisma.invoice.delete({ where: { id } });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "DELETE",
      entity: "Invoice",
      entityId: id,
      details: `Hủy/Xóa hóa đơn ${inv.title} (${inv.code})`,
    });

    revalidatePath("/admin/invoices");
    revalidatePath("/client/dashboard");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting invoice:", error);
    return { success: false, error: "Lỗi xóa hóa đơn." };
  }
}

// ==========================================
// 5. PAYMENTS CRUD
// ==========================================

export async function savePayment(formData: FormData) {
  const session = await checkAdminPermission();
  const invoiceId = formData.get("invoiceId")?.toString() || "";
  const amount = parseFloat(formData.get("amount")?.toString() || "0") || 0;
  const method = formData.get("method")?.toString() || "Bank Transfer";
  const notes = formData.get("notes")?.toString() || "";

  if (!invoiceId || amount <= 0) {
    return { success: false, error: "Vui lòng chọn hóa đơn và nhập số tiền thanh toán (> 0)." };
  }

  try {
    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) return { success: false, error: "Hóa đơn không tồn tại." };

    const payment = await prisma.payment.create({
      data: {
        invoiceId,
        amount,
        method,
        notes,
      },
    });

    // Automatically update Invoice status to PAID or PARTIAL
    const allPayments = await prisma.payment.findMany({ where: { invoiceId } });
    const totalPaid = allPayments.reduce((acc, cur) => acc + cur.amount, 0);

    const newStatus = totalPaid >= invoice.totalAmount ? "PAID" : "PARTIAL";

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: newStatus,
        paidDate: newStatus === "PAID" ? new Date() : undefined,
      },
    });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "PAYMENT",
      entity: "Payment",
      entityId: payment.id,
      details: `Ghi nhận thanh toán ${amount.toLocaleString()} VNĐ cho hóa đơn ${invoice.code}`,
    });

    revalidatePath("/admin/payments");
    revalidatePath("/admin/invoices");
    revalidatePath("/admin");
    revalidatePath("/client/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving payment:", error);
    return { success: false, error: "Lỗi ghi nhận thanh toán." };
  }
}

export async function deletePayment(id: string) {
  const session = await checkAdminPermission();

  try {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { invoice: true },
    });

    if (!payment) return { success: false, error: "Giao dịch thanh toán không tồn tại." };

    const invoiceId = payment.invoiceId;

    await prisma.payment.delete({ where: { id } });

    // Recalculate invoice status
    const remainingPayments = await prisma.payment.findMany({ where: { invoiceId } });
    const totalRemaining = remainingPayments.reduce((acc, cur) => acc + cur.amount, 0);

    let newStatus = "SENT";
    if (totalRemaining >= payment.invoice.totalAmount) {
      newStatus = "PAID";
    } else if (totalRemaining > 0) {
      newStatus = "PARTIAL";
    }

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: newStatus,
        paidDate: newStatus === "PAID" ? payment.invoice.paidDate : null,
      },
    });

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "DELETE",
      entity: "Payment",
      entityId: id,
      details: `Hủy ghi nhận thanh toán ${payment.amount.toLocaleString()} VNĐ của hóa đơn ${payment.invoice.code}`,
    });

    revalidatePath("/admin/payments");
    revalidatePath("/admin/invoices");
    revalidatePath("/admin");
    revalidatePath("/client/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting payment:", error);
    return { success: false, error: "Lỗi xóa giao dịch thanh toán." };
  }
}
