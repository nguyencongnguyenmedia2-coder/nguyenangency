"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveQuotationByCode(code: string) {
  try {
    const q = await prisma.quotation.findUnique({
      where: { code },
    });

    if (!q) {
      return { success: false, error: "Không tìm thấy thông tin báo giá." };
    }

    await prisma.quotation.update({
      where: { code },
      data: {
        status: "APPROVED",
      },
    });

    // Notify admins
    await prisma.notification.create({
      data: {
        title: "BÁO GIÁ ĐÃ ĐƯỢC DUYỆT TRỰC TUYẾN!",
        message: `Khách hàng ${q.clientName} vừa chấp thuận báo giá ${q.code} (${q.serviceName}) với tổng ngân sách ${q.totalAmount.toLocaleString()} VNĐ.`,
        type: "SUCCESS",
        link: "/admin/quotations",
      },
    });

    await prisma.activityLog.create({
      data: {
        actorName: q.clientName,
        action: "CLIENT_APPROVE_QUOTATION",
        entity: "Quotation",
        entityId: q.id,
        details: `Khách hàng ${q.clientName} chấp thuận báo giá ${q.code}`,
      },
    });

    revalidatePath(`/quotation/${code}`);
    revalidatePath("/admin/quotations");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error approving quotation:", error);
    return { success: false, error: "Lỗi phê duyệt báo giá." };
  }
}

export async function requestRevisionByCode(code: string, feedback: string) {
  if (!feedback.trim()) {
    return { success: false, error: "Vui lòng nhập nội dung đề xuất điều chỉnh." };
  }

  try {
    const q = await prisma.quotation.findUnique({ where: { code } });
    if (!q) return { success: false, error: "Không tìm thấy thông tin báo giá." };

    await prisma.quotation.update({
      where: { code },
      data: { status: "REVISION" },
    });

    await prisma.notification.create({
      data: {
        title: `YÊU CẦU ĐIỀU CHỈNH BÁO GIÁ: ${q.code}`,
        message: `Khách hàng ${q.clientName} gửi phản hồi: "${feedback}"`,
        type: "WARNING",
        link: "/admin/quotations",
      },
    });

    await prisma.activityLog.create({
      data: {
        actorName: q.clientName,
        action: "CLIENT_REVISE_QUOTATION",
        entity: "Quotation",
        entityId: q.id,
        details: `Đề xuất chỉnh sửa báo giá ${q.code}: ${feedback}`,
      },
    });

    revalidatePath(`/quotation/${code}`);
    revalidatePath("/admin/quotations");
    return { success: true };
  } catch (error: any) {
    console.error("Error requesting revision:", error);
    return { success: false, error: "Lỗi gửi yêu cầu điều chỉnh." };
  }
}

