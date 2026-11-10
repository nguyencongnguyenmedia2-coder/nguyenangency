import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendTelegramAdminNotification } from "@/lib/telegram-notifier";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      serviceInterest,
      budget,
      message,
      chatHistory,
    } = body;

    const trimmedEmail = (email || "").trim().toLowerCase();
    const trimmedName = (name || "").trim() || "Khách Hàng Mascot Chat";
    const trimmedMessage = (message || "").trim();

    if (!trimmedEmail && !phone) {
      return NextResponse.json(
        { ok: false, error: "Vui lòng cung cấp Email hoặc Số điện thoại để NGUYÊN AGENCY liên hệ lại." },
        { status: 400 }
      );
    }

    const leadCode = `LEAD-${Date.now().toString().slice(-6)}`;
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const bookingCode = `NA-${todayStr}-${randomSuffix}`;

    const effectiveEmail = trimmedEmail || `guest_${Date.now()}@mascot.nguyenagency.vn`;

    // 1. Upsert Customer in CRM
    let customer: any = null;
    try {
      customer = await prisma.customer.upsert({
        where: { email: effectiveEmail },
        update: {
          name: trimmedName,
          phone: phone || undefined,
          source: "MASCOT_CHAT",
          careStatus: "ACTIVE",
        },
        create: {
          code: `CUS-${Date.now().toString().slice(-6)}`,
          name: trimmedName,
          email: effectiveEmail,
          phone: phone || null,
          source: "MASCOT_CHAT",
          tier: "ENTERPRISE",
          careStatus: "ACTIVE",
          notes: `Tiếp nhận từ Mascot Trợ Lý AI: ${trimmedMessage.slice(0, 200)}`,
        },
      });
    } catch (err) {
      console.warn("[Mascot Submit] Customer upsert fallback:", err);
    }

    // 2. Create Lead
    let lead: any = null;
    try {
      lead = await prisma.lead.create({
        data: {
          code: leadCode,
          name: trimmedName,
          email: effectiveEmail,
          phone: phone || null,
          serviceInterest: serviceInterest || "Tư vấn tổng thể qua Mascot AI",
          budget: budget || "Thỏa thuận",
          source: "MASCOT_CHAT",
          stage: "NEW_LEAD",
          priority: "HIGH",
          notes: trimmedMessage || "Yêu cầu tư vấn gửi qua Mascot Trợ Lý AI",
          customerId: customer?.id || null,
          historyJson: JSON.stringify(chatHistory || []),
        },
      });
    } catch (err) {
      console.warn("[Mascot Submit] Lead create fallback:", err);
    }

    // 3. Create Service Booking record
    let booking: any = null;
    if (customer?.id) {
      try {
        booking = await prisma.serviceBooking.create({
          data: {
            bookingCode,
            customerId: customer.id,
            serviceName: serviceInterest || "Dịch Vụ NGUYÊN AGENCY",
            source: "MASCOT_CHAT",
            projectTitle: `[Mascot AI] ${serviceInterest || "Tư vấn trực tiếp"}`,
            projectDescription: trimmedMessage || "Khách hàng gửi thông tin qua Mascot Trợ Lý AI.",
            budgetRange: budget || "Thỏa thuận",
            customerNotes: `Lịch sử chat mascot đính kèm theo Lead ${leadCode}`,
            status: "NEW",
          },
        });
      } catch (err) {
        console.warn("[Mascot Submit] ServiceBooking fallback:", err);
      }
    }

    // 4. Dispatch Telegram Notification to Administrators
    if (booking && customer) {
      try {
        await sendTelegramAdminNotification({
          bookingId: booking.id,
          bookingCode: booking.bookingCode,
          customerId: customer.id,
          fullName: trimmedName,
          phone: phone || "Chưa cung cấp",
          email: effectiveEmail,
          companyName: "",
          source: "MASCOT_CHAT",
          serviceName: serviceInterest || "Tư vấn trực tiếp",
          projectTitle: `[Mascot AI] ${serviceInterest || "Tư vấn trực tiếp"}`,
          budgetRange: budget || "Thỏa thuận",
          description: trimmedMessage || "Khách yêu cầu tư vấn từ Mascot Trợ Lý AI",
          status: "NEW",
        });
      } catch (teleErr) {
        console.warn("[Mascot Submit] Telegram notification error:", teleErr);
      }
    }

    return NextResponse.json({
      ok: true,
      leadCode,
      bookingCode,
      customerName: trimmedName,
      message: "Yêu cầu đã được chuyển tới chuyên gia tư vấn NGUYÊN AGENCY thành công!",
    });
  } catch (error: any) {
    console.error("[Mascot API] Exception occurred:", error);
    return NextResponse.json(
      { ok: false, error: "Đã xảy ra lỗi khi lưu thông tin. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
