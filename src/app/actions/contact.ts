"use server";

import { revalidatePath } from "next/cache";
import { createUnifiedBooking } from "@/lib/booking-engine";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name")?.toString().trim() || "";
  const email = formData.get("email")?.toString().trim() || "";
  const phone = formData.get("phone")?.toString().trim() || "";
  const company = formData.get("company")?.toString().trim() || "";
  const serviceId = formData.get("serviceId")?.toString().trim() || "";
  const serviceType = formData.get("serviceType")?.toString().trim() || "Tư vấn giải pháp tổng thể";
  const projectTitle =
    formData.get("projectTitle")?.toString().trim() ||
    `${serviceType} — ${company || name}`;
  const budget = formData.get("budget")?.toString().trim() || "50M - 100M VNĐ";
  const preferredStartDate = formData.get("preferredStartDate")?.toString().trim() || "Linh hoạt";
  const preferredContactTime = formData.get("preferredContactTime")?.toString().trim() || "Giờ hành chính";
  const message = formData.get("message")?.toString().trim() || "";
  const pageSource = formData.get("pageSource")?.toString().trim() || "/contact";
  const websiteHoneypot = formData.get("websiteHoneypot")?.toString() || "";

  if (!name || !phone || !message) {
    return {
      success: false,
      error: "Vui lòng điền đầy đủ Họ tên, Số điện thoại và Mô tả yêu cầu dự án.",
    };
  }

  const res = await createUnifiedBooking({
    fullName: name,
    phone,
    email,
    companyName: company,
    serviceId,
    serviceName: serviceType,
    projectTitle,
    projectDescription: message,
    budgetRange: budget,
    preferredStartDate,
    preferredContactTime,
    source: "WEBSITE",
    pageSource,
    websiteHoneypot,
  });

  if (!res.success) {
    return {
      success: false,
      error: res.message || "Không thể gửi yêu cầu. Vui lòng kiểm tra lại thông tin.",
    };
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/customers");
  revalidatePath("/admin/leads");
  revalidatePath("/admin/notifications");
  revalidatePath("/admin");

  return {
    success: true,
    code: res.bookingCode,
    bookingId: res.bookingId,
    message: `Cảm ơn bạn! Yêu cầu (${res.bookingCode}) đã được ghi nhận và thông báo ngay tới đội ngũ chuyên gia NGUYÊN AGENCY.`,
  };
}
