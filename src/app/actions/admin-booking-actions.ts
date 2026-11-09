"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdminPermission } from "./admin-common";
import { createUnifiedBooking } from "@/lib/booking-engine";
import {
  notifyCustomerBookingStatusChange,
  retryTelegramNotification,
  registerTelegramWebhook,
  sendTelegramMessage,
  syncBookingTelegramAdminMessage,
} from "@/lib/telegram-notifier";
import { syncRecordToSupabase } from "@/lib/supabase";

/**
 * Updates ServiceBooking status, logs before/after data, syncs to Supabase,
 * and sends a real-time Telegram notification to the Customer (if linked) and Admin Chat.
 */
export async function updateServiceBookingStatus(params: {
  bookingId: string;
  status: string;
  assignedTo?: string;
  customerNotes?: string;
}) {
  const session = await checkAdminPermission();

  try {
    const existing = await prisma.serviceBooking.findUnique({
      where: { id: params.bookingId },
      include: { customer: true },
    });

    if (!existing) {
      return { success: false, error: "Không tìm thấy yêu cầu đặt dịch vụ." };
    }

    const updated = await prisma.serviceBooking.update({
      where: { id: params.bookingId },
      data: {
        status: params.status,
        ...(params.assignedTo !== undefined ? { assignedTo: params.assignedTo } : {}),
        ...(params.customerNotes !== undefined ? { customerNotes: params.customerNotes } : {}),
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        actorType: "ADMIN",
        actorName: session.name,
        action: "UPDATE_BOOKING_STATUS",
        entity: "ServiceBooking",
        entityId: existing.id,
        details: `Cập nhật trạng thái đặt dịch vụ ${existing.bookingCode} từ ${existing.status} sang ${params.status}`,
        beforeData: JSON.stringify({
          status: existing.status,
          assignedTo: existing.assignedTo,
        }),
        afterData: JSON.stringify({
          status: updated.status,
          assignedTo: updated.assignedTo,
        }),
      },
    });

    void syncRecordToSupabase("service_bookings", {
      id: updated.id,
      booking_code: updated.bookingCode,
      customer_id: updated.customerId,
      service_id: updated.serviceId,
      source: updated.source,
      project_title: updated.projectTitle,
      project_description: updated.projectDescription,
      status: updated.status,
      assigned_to: updated.assignedTo,
    });

    // Notify customer via Telegram if customer has telegramUserId
    if (existing.customer.telegramUserId && existing.status !== params.status) {
      await notifyCustomerBookingStatusChange({
        bookingCode: existing.bookingCode,
        projectTitle: existing.projectTitle,
        serviceName: existing.serviceName,
        newStatus: params.status,
        telegramUserId: existing.customer.telegramUserId,
        adminNote: params.customerNotes,
      });
    }

    // Update original Telegram Admin notification message in-place
    await syncBookingTelegramAdminMessage(existing.id, session.name);

    revalidatePath("/admin/bookings");
    revalidatePath("/admin/customers");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi cập nhật trạng thái booking.",
    };
  }
}

/**
 * Creates a new ServiceBooking directly from CRM Admin (`/admin/bookings`).
 */
export async function createBookingFromAdmin(formData: FormData) {
  await checkAdminPermission();

  const fullName = formData.get("fullName")?.toString().trim() || "";
  const phone = formData.get("phone")?.toString().trim() || "";
  const email = formData.get("email")?.toString().trim() || "";
  const companyName = formData.get("companyName")?.toString().trim() || "";
  const serviceId = formData.get("serviceId")?.toString().trim() || "";
  const serviceName = formData.get("serviceName")?.toString().trim() || "";
  const projectTitle = formData.get("projectTitle")?.toString().trim() || "";
  const projectDescription = formData.get("projectDescription")?.toString().trim() || "";
  const budgetRange = formData.get("budgetRange")?.toString().trim() || "";
  const preferredStartDate = formData.get("preferredStartDate")?.toString().trim() || "";

  const res = await createUnifiedBooking({
    fullName,
    phone,
    email,
    companyName,
    serviceId,
    serviceName,
    projectTitle,
    projectDescription,
    budgetRange,
    preferredStartDate,
    source: "ADMIN",
    pageSource: "/admin/bookings",
  });

  if (!res.success) {
    return { success: false, error: res.message };
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/customers");
  revalidatePath("/admin/leads");
  revalidatePath("/admin");

  return {
    success: true,
    bookingCode: res.bookingCode,
  };
}

/**
 * Converts a ServiceBooking into an official Quotation record (`quotations` + `quotation_items`)
 * and marks the booking status as `QUOTATION_SENT`.
 */
export async function convertBookingToQuotation(bookingId: string) {
  const session = await checkAdminPermission();

  try {
    const booking = await prisma.serviceBooking.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        service: true,
      },
    });

    if (!booking) {
      return { success: false, error: "Không tìm thấy yêu cầu đặt dịch vụ." };
    }

    const qCount = await prisma.quotation.count();
    const quotationCode = `QT-${new Date().getFullYear()}-${String(qCount + 101).padStart(4, "0")}`;
    const basePrice = booking.service?.startingPrice || booking.budgetMin || 35000000;
    const taxAmount = Math.round(basePrice * 0.08);
    const totalAmount = basePrice + taxAmount;

    const quotation = await prisma.quotation.create({
      data: {
        code: quotationCode,
        customerId: booking.customerId,
        bookingId: booking.id,
        clientName: booking.customer.name,
        clientEmail: booking.customer.email,
        clientPhone: booking.customer.phone,
        clientCompany: booking.customer.company,
        serviceGroup: booking.service?.group || "TECH",
        serviceName: booking.serviceName,
        packageName: "Gói Giải Pháp Doanh Nghiệp (Custom)",
        requirements: `${booking.projectTitle}\n\n${booking.projectDescription}`,
        budgetRange: booking.budgetRange,
        desiredTimeline: booking.preferredStartDate,
        subtotal: basePrice,
        discount: 0,
        taxAmount,
        totalAmount,
        status: "QUOTED",
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        items: {
          create: [
            {
              serviceId: booking.serviceId,
              title: `${booking.serviceName} — ${booking.projectTitle}`,
              description: booking.projectDescription,
              quantity: 1,
              unitPrice: basePrice,
              totalPrice: basePrice,
            },
          ],
        },
      },
    });

    await prisma.serviceBooking.update({
      where: { id: booking.id },
      data: { status: "QUOTATION_SENT" },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        actorType: "ADMIN",
        actorName: session.name,
        action: "CONVERT_BOOKING_TO_QUOTATION",
        entity: "Quotation",
        entityId: quotation.id,
        details: `Khởi tạo báo giá ${quotationCode} từ yêu cầu đặt dịch vụ ${booking.bookingCode}`,
      },
    });

    if (booking.customer.telegramUserId) {
      await notifyCustomerBookingStatusChange({
        bookingCode: booking.bookingCode,
        projectTitle: booking.projectTitle,
        serviceName: booking.serviceName,
        newStatus: "QUOTATION_SENT",
        telegramUserId: booking.customer.telegramUserId,
        adminNote: `Mã báo giá chính thức: ${quotationCode}`,
      });
    }

    revalidatePath("/admin/bookings");
    revalidatePath("/admin/quotations");
    revalidatePath("/admin");

    return {
      success: true,
      quotationCode,
      quotationId: quotation.id,
    };
  } catch (error) {
    console.error("Error converting booking to quotation:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi khởi tạo báo giá.",
    };
  }
}

/**
 * Converts a ServiceBooking into an active Project (`projects`) and updates booking status to `IN_PROGRESS`.
 */
export async function convertBookingToProject(bookingId: string) {
  const session = await checkAdminPermission();

  try {
    const booking = await prisma.serviceBooking.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        service: true,
      },
    });

    if (!booking) {
      return { success: false, error: "Không tìm thấy yêu cầu đặt dịch vụ." };
    }

    const existingProject = await prisma.project.findFirst({
      where: { bookingId: booking.id },
    });
    if (existingProject) {
      return {
        success: false,
        error: `Đơn hàng này đã được chuyển thành dự án ${existingProject.code} trước đó.`,
      };
    }

    const pCount = await prisma.project.count();
    const projectCode = `PRJ-${new Date().getFullYear()}-${String(pCount + 101).padStart(4, "0")}`;
    const slugBase = booking.projectTitle
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const project = await prisma.project.create({
      data: {
        code: projectCode,
        name: booking.projectTitle,
        slug: `${slugBase}-${Date.now().toString().slice(-4)}`,
        customerId: booking.customerId,
        bookingId: booking.id,
        category: booking.serviceName,
        description: booking.projectDescription,
        status: "PENDING",
        priority: "HIGH",
        progress: 0,
        budget: booking.service?.startingPrice || booking.budgetMin || 45000000,
        startDate: new Date(),
        managerName: session.name,
        notes: `Chuyển đổi từ Booking ${booking.bookingCode} (${booking.source})`,
      },
    });

    await prisma.serviceBooking.update({
      where: { id: booking.id },
      data: { status: "IN_PROGRESS" },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        actorType: "ADMIN",
        actorName: session.name,
        action: "CONVERT_BOOKING_TO_PROJECT",
        entity: "Project",
        entityId: project.id,
        details: `Khởi tạo dự án ${projectCode} từ yêu cầu đặt dịch vụ ${booking.bookingCode}`,
      },
    });

    if (booking.customer.telegramUserId) {
      await notifyCustomerBookingStatusChange({
        bookingCode: booking.bookingCode,
        projectTitle: booking.projectTitle,
        serviceName: booking.serviceName,
        newStatus: "IN_PROGRESS",
        telegramUserId: booking.customer.telegramUserId,
        adminNote: `Mã dự án triển khai: ${projectCode}`,
      });
    }

    revalidatePath("/admin/bookings");
    revalidatePath("/admin/projects");
    revalidatePath("/admin");

    return {
      success: true,
      projectCode,
      projectId: project.id,
    };
  } catch (error) {
    console.error("Error converting booking to project:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi khởi tạo dự án.",
    };
  }
}

/**
 * Retries a failed Telegram notification from CRM `/admin/notifications` or `/admin/telegram`.
 */
export async function retryFailedTelegramNotificationAction(notificationId: string) {
  await checkAdminPermission();
  const res = await retryTelegramNotification(notificationId);
  revalidatePath("/admin/notifications");
  revalidatePath("/admin/telegram");
  return res;
}

/**
 * Sends a live test notification to TELEGRAM_ADMIN_CHAT_ID from `/admin/telegram`.
 */
export async function sendTestTelegramNotificationAction() {
  const session = await checkAdminPermission();
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!adminChatId) {
    return {
      success: false,
      message: "Chưa cấu hình biến môi trường TELEGRAM_ADMIN_CHAT_ID.",
    };
  }

  const nowStr = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  const text = [
    "🧪 KIỂM TRA KẾT NỐI TELEGRAM – NGUYÊN AGENCY CRM",
    "",
    `• Trạng thái Bot: Hoạt động ổn định`,
    `• Người kích hoạt: ${session.name}`,
    `• Thời gian: ${nowStr}`,
    "• Hệ thống đồng bộ Website + Supabase + Telegram Bot + CRM `/admin` đã sẵn sàng nhận khách hàng thực tế!",
  ].join("\n");

  const res = await sendTelegramMessage(adminChatId, text);

  await prisma.notification.create({
    data: {
      targetRole: "ADMIN",
      title: "Kiểm tra kết nối Telegram Bot",
      message: text,
      type: res.ok ? "SUCCESS" : "ALERT",
      channel: "TELEGRAM",
      deliveryStatus: res.ok ? "SENT" : "FAILED",
      errorLog: res.ok ? null : res.description || "Test failed",
    },
  });

  revalidatePath("/admin/telegram");
  revalidatePath("/admin/notifications");

  return {
    success: res.ok,
    message: res.ok
      ? "Đã gửi tin nhắn kiểm tra tới Telegram Admin thành công!"
      : `Gửi thất bại: ${res.description}`,
  };
}

/**
 * Configures the Telegram Webhook URL from `/admin/telegram`.
 */
export async function setupTelegramWebhookAction(webhookUrl: string) {
  await checkAdminPermission();
  const cleaned = webhookUrl.trim();
  if (!cleaned.startsWith("https://")) {
    return {
      success: false,
      message: "Telegram yêu cầu URL Webhook phải bắt đầu bằng https://",
    };
  }

  const res = await registerTelegramWebhook(cleaned);
  revalidatePath("/admin/telegram");

  return {
    success: res.ok,
    message: res.ok
      ? `Đã đăng ký Webhook thành công: ${cleaned}`
      : `Đăng ký Webhook thất bại: ${res.description}`,
  };
}

/**
 * Adds or updates a Telegram Admin / Staff account in `telegram_admins`.
 */
export async function saveTelegramAdminAction(formData: FormData) {
  const session = await checkAdminPermission();
  const telegramUserId = formData.get("telegramUserId")?.toString().trim() || "";
  const telegramUsername = formData.get("telegramUsername")?.toString().trim() || null;
  const fullName = formData.get("fullName")?.toString().trim() || "";
  const role = formData.get("role")?.toString().trim() || "ADMIN";

  if (!telegramUserId || !/^\d+$/.test(telegramUserId) || !fullName) {
    return {
      success: false,
      message: "Vui lòng nhập Telegram User ID hợp lệ (chỉ gồm chữ số) và Họ tên.",
    };
  }

  const record = await prisma.telegramAdmin.upsert({
    where: { telegramUserId },
    update: {
      telegramUsername,
      fullName,
      role,
      isActive: true,
    },
    create: {
      telegramUserId,
      telegramUsername,
      fullName,
      role,
      isActive: true,
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: session.userId,
      actorType: "ADMIN",
      actorName: session.name,
      action: "UPSERT_TELEGRAM_ADMIN",
      entity: "TelegramAdmin",
      entityId: record.id,
      details: `Cấp quyền Telegram Admin (${role}) cho ${fullName} (ID: ${telegramUserId})`,
    },
  });

  void syncRecordToSupabase("telegram_admins", {
    id: record.id,
    telegram_user_id: record.telegramUserId,
    telegram_username: record.telegramUsername,
    full_name: record.fullName,
    role: record.role,
    is_active: record.isActive,
  });

  revalidatePath("/admin/telegram");
  return {
    success: true,
    message: `Đã lưu tài khoản Telegram Admin: ${fullName} (${role})`,
  };
}

export async function toggleTelegramAdminStatusAction(id: string, isActive: boolean) {
  const session = await checkAdminPermission();
  const updated = await prisma.telegramAdmin.update({
    where: { id },
    data: { isActive },
  });

  await prisma.activityLog.create({
    data: {
      userId: session.userId,
      actorType: "ADMIN",
      actorName: session.name,
      action: "TOGGLE_TELEGRAM_ADMIN",
      entity: "TelegramAdmin",
      entityId: updated.id,
      details: `${isActive ? "Kích hoạt" : "Tạm khóa"} quyền Telegram Admin của ${updated.fullName}`,
    },
  });

  revalidatePath("/admin/telegram");
  return {
    success: true,
    message: `Đã ${isActive ? "kích hoạt" : "tạm khóa"} tài khoản ${updated.fullName}.`,
  };
}


