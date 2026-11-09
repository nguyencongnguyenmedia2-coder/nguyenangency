import { z } from 'zod';
import { prisma } from './prisma';
import { syncRecordToSupabase } from './supabase';
import { sendTelegramAdminNotification } from './telegram-notifier';

export const BookingSourceEnum = z.enum(['WEBSITE', 'TELEGRAM', 'ADMIN', 'OTHER']);

export const BookingRequestSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(120, 'Họ và tên tối đa 120 ký tự'),
  phone: z
    .string()
    .trim()
    .regex(/^(0|\+84)[0-9\s.-]{8,13}$/, 'Số điện thoại không hợp lệ (VD: 0987654321)'),
  email: z
    .string()
    .trim()
    .email('Địa chỉ Email không hợp lệ')
    .optional()
    .or(z.literal('')),
  companyName: z.string().trim().max(150).optional().or(z.literal('')),
  address: z.string().trim().max(250).optional().or(z.literal('')),
  serviceId: z.string().trim().optional().or(z.literal('')),
  serviceName: z.string().trim().optional().or(z.literal('')),
  projectTitle: z
    .string()
    .trim()
    .min(2, 'Tên dự án hoặc chủ đề phải có ít nhất 2 ký tự')
    .max(200),
  projectDescription: z
    .string()
    .trim()
    .min(5, 'Mô tả nhu cầu phải có ít nhất 5 ký tự')
    .max(5000),
  budgetRange: z.string().trim().optional().or(z.literal('')),
  budgetMin: z.number().nonnegative().optional(),
  budgetMax: z.number().nonnegative().optional(),
  preferredStartDate: z.string().trim().optional().or(z.literal('')),
  preferredContactTime: z.string().trim().optional().or(z.literal('')),
  customerNotes: z.string().trim().max(2000).optional().or(z.literal('')),
  source: BookingSourceEnum.default('WEBSITE'),
  pageSource: z.string().trim().optional().or(z.literal('')),
  telegramUserId: z.string().trim().optional().or(z.literal('')),
  telegramUsername: z.string().trim().optional().or(z.literal('')),
  attachmentUrl: z.string().trim().optional().or(z.literal('')),
  ipAddress: z.string().trim().optional(),
  // Honeypot field for anti-bot spam on website forms
  websiteHoneypot: z.string().optional(),
});

export type BookingRequestInput = z.infer<typeof BookingRequestSchema>;

export function normalizePhoneNumber(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+84')) {
    return '0' + digits.slice(3);
  }
  if (digits.startsWith('84') && digits.length >= 11) {
    return '0' + digits.slice(2);
  }
  return digits;
}

export function normalizeEmailAddress(email?: string | null, telegramUserId?: string | null): string {
  const cleaned = (email || '').trim().toLowerCase();
  if (cleaned && cleaned.includes('@')) {
    return cleaned;
  }
  if (telegramUserId) {
    return `tg_${telegramUserId}@telegram.nguyenagency.vn`;
  }
  return `guest_${Date.now()}_${Math.floor(Math.random() * 1000)}@guest.nguyenagency.vn`;
}

/**
 * Generates booking code in format #NA-YYYYMMDD-XXX (e.g., #NA-20261105-001)
 */
export async function generateBookingCode(): Promise<string> {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const datePart = `${yyyy}${mm}${dd}`;
  const prefix = `#NA-${datePart}-`;

  const countToday = await prisma.serviceBooking.count({
    where: {
      bookingCode: {
        startsWith: prefix,
      },
    },
  });

  for (let offset = 1; offset <= 50; offset++) {
    const seq = String(countToday + offset).padStart(3, '0');
    const candidate = `${prefix}${seq}`;
    const existing = await prisma.serviceBooking.findUnique({
      where: { bookingCode: candidate },
      select: { id: true },
    });
    if (!existing) {
      return candidate;
    }
  }

  return `${prefix}${Math.floor(100 + Math.random() * 900)}`;
}

/**
 * Unified Booking & Customer Engine used by both Website Forms, Telegram Bot, and CRM Admin.
 */
export async function createUnifiedBooking(rawInput: BookingRequestInput): Promise<{
  success: boolean;
  message: string;
  bookingCode?: string;
  bookingId?: string;
  customerId?: string;
  leadId?: string;
  isExistingCustomer?: boolean;
  error?: string;
}> {
  // 1. Check Honeypot for spam
  if (rawInput.websiteHoneypot && rawInput.websiteHoneypot.trim() !== '') {
    return {
      success: false,
      message: 'Yêu cầu bị từ chối do phát hiện spam.',
      error: 'HONEYPOT_TRIGGERED',
    };
  }

  // 2. Validate with Zod
  const parsed = BookingRequestSchema.safeParse(rawInput);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      success: false,
      message: firstIssue?.message || 'Dữ liệu đầu vào không hợp lệ.',
      error: 'VALIDATION_ERROR',
    };
  }

  const data = parsed.data;
  const normalizedPhone = normalizePhoneNumber(data.phone);
  const normalizedEmail = normalizeEmailAddress(data.email, data.telegramUserId);
  const hasRealEmail = Boolean(data.email && data.email.trim().includes('@'));

  try {
    // 3. Resolve Service from database (single source of truth)
    let resolvedServiceId: string | null = null;
    let resolvedServiceName = data.serviceName?.trim() || 'Tư vấn giải pháp tổng thể';

    if (data.serviceId) {
      const serviceByIdOrSlug = await prisma.service.findFirst({
        where: {
          OR: [{ id: data.serviceId }, { slug: data.serviceId }],
          deletedAt: null,
        },
      });
      if (serviceByIdOrSlug) {
        resolvedServiceId = serviceByIdOrSlug.id;
        resolvedServiceName = serviceByIdOrSlug.title;
      }
    } else if (data.serviceName) {
      const serviceByName = await prisma.service.findFirst({
        where: {
          OR: [
            { title: data.serviceName.trim() },
            { slug: data.serviceName.trim() },
          ],
          deletedAt: null,
        },
      });
      if (serviceByName) {
        resolvedServiceId = serviceByName.id;
        resolvedServiceName = serviceByName.title;
      }
    }

    // 4. Customer Deduplication (Check by telegramUserId, phone, or email — NEVER by name alone)
    const orConditions: Array<Record<string, unknown>> = [];
    if (data.telegramUserId) {
      orConditions.push({ telegramUserId: data.telegramUserId });
    }
    if (normalizedPhone) {
      orConditions.push({ phone: normalizedPhone });
      if (data.phone.trim() !== normalizedPhone) {
        orConditions.push({ phone: data.phone.trim() });
      }
    }
    if (hasRealEmail) {
      orConditions.push({ email: normalizedEmail });
    }

    let existingCustomer =
      orConditions.length > 0
        ? await prisma.customer.findFirst({
            where: {
              OR: orConditions,
              deletedAt: null,
            },
          })
        : null;

    // 5. Anti-duplicate submission check within 60 seconds
    if (existingCustomer) {
      const sixtySecondsAgo = new Date(Date.now() - 60 * 1000);
      const duplicateBooking = await prisma.serviceBooking.findFirst({
        where: {
          customerId: existingCustomer.id,
          projectTitle: data.projectTitle,
          createdAt: { gte: sixtySecondsAgo },
        },
      });

      if (duplicateBooking) {
        return {
          success: true,
          message: 'Yêu cầu của bạn đã được hệ thống ghi nhận.',
          bookingCode: duplicateBooking.bookingCode,
          bookingId: duplicateBooking.id,
          customerId: existingCustomer.id,
          isExistingCustomer: true,
        };
      }
    }

    const bookingCode = await generateBookingCode();
    const isExistingCustomer = Boolean(existingCustomer);

    // 6. Execute database transaction
    const result = await prisma.$transaction(async (tx) => {
      let customer = existingCustomer;

      if (customer) {
        // Update missing or newer contact info on existing customer
        const updatePayload: Record<string, unknown> = {
          careStatus: 'FOLLOW_UP',
        };
        if (!customer.phone && normalizedPhone) {
          updatePayload.phone = normalizedPhone;
        }
        if (
          hasRealEmail &&
          customer.email.endsWith('@telegram.nguyenagency.vn')
        ) {
          // Verify no other customer already owns this real email
          const emailTaken = await tx.customer.findUnique({
            where: { email: normalizedEmail },
          });
          if (!emailTaken) {
            updatePayload.email = normalizedEmail;
          }
        }
        if (data.telegramUserId && !customer.telegramUserId) {
          updatePayload.telegramUserId = data.telegramUserId;
        }
        if (data.telegramUsername && !customer.telegramUsername) {
          updatePayload.telegramUsername = data.telegramUsername;
        }
        if (data.companyName && !customer.company) {
          updatePayload.company = data.companyName;
        }
        if (data.address && !customer.address) {
          updatePayload.address = data.address;
        }

        customer = await tx.customer.update({
          where: { id: customer.id },
          data: updatePayload,
        });
      } else {
        const custCount = await tx.customer.count();
        const customerCode = `CUS-${new Date().getFullYear()}-${String(custCount + 101).padStart(4, '0')}`;

        customer = await tx.customer.create({
          data: {
            code: customerCode,
            name: data.fullName,
            email: normalizedEmail,
            phone: normalizedPhone,
            telegramUserId: data.telegramUserId || null,
            telegramUsername: data.telegramUsername || null,
            company: data.companyName || null,
            address: data.address || null,
            source: data.source,
            tier: 'ENTERPRISE',
            careStatus: 'ACTIVE',
            notes: data.customerNotes || `Khởi tạo từ kênh ${data.source}`,
          },
        });
      }

      // Create ServiceBooking record
      const booking = await tx.serviceBooking.create({
        data: {
          bookingCode,
          customerId: customer.id,
          serviceId: resolvedServiceId,
          serviceName: resolvedServiceName,
          source: data.source,
          projectTitle: data.projectTitle,
          projectDescription: data.projectDescription,
          budgetRange: data.budgetRange || 'Chưa xác định',
          budgetMin: data.budgetMin ?? null,
          budgetMax: data.budgetMax ?? null,
          preferredStartDate: data.preferredStartDate || null,
          preferredContactTime: data.preferredContactTime || null,
          customerNotes: data.customerNotes || null,
          pageSource: data.pageSource || (data.source === 'TELEGRAM' ? 'Telegram Bot' : '/contact'),
          status: 'NEW',
        },
      });

      // Create CRM Lead record linked to Customer & Booking
      const leadCount = await tx.lead.count();
      const leadCode = `LEAD-${new Date().getFullYear()}-${String(leadCount + 101).padStart(4, '0')}`;

      const historyEntry = [
        {
          date: new Date().toISOString(),
          action: `Tiếp nhận yêu cầu đặt dịch vụ (${bookingCode}) qua ${data.source}`,
          note: `${data.projectTitle} — ${data.projectDescription}`,
        },
      ];

      const lead = await tx.lead.create({
        data: {
          code: leadCode,
          name: data.fullName,
          email: hasRealEmail ? normalizedEmail : customer.email,
          phone: normalizedPhone,
          company: data.companyName || customer.company || null,
          serviceInterest: resolvedServiceName,
          budget: data.budgetRange || 'Chưa xác định',
          source: data.source,
          stage: 'NEW_LEAD',
          priority: 'HIGH',
          notes: `[${bookingCode}] ${data.projectTitle}: ${data.projectDescription}`,
          historyJson: JSON.stringify(historyEntry),
          customerId: customer.id,
          bookingId: booking.id,
        },
      });

      // Also record in ContactSubmission when submitted from Website
      if (data.source === 'WEBSITE') {
        const subCount = await tx.contactSubmission.count();
        const subCode = `REQ-${new Date().getFullYear()}-${String(subCount + 101).padStart(4, '0')}`;
        await tx.contactSubmission.create({
          data: {
            code: subCode,
            name: data.fullName,
            email: hasRealEmail ? normalizedEmail : customer.email,
            phone: normalizedPhone,
            company: data.companyName || null,
            serviceType: resolvedServiceName,
            budget: data.budgetRange || null,
            message: `[${bookingCode}] ${data.projectTitle}\n${data.projectDescription}`,
            attachmentUrl: data.attachmentUrl || null,
            status: 'NEW',
            ipAddress: data.ipAddress || null,
          },
        });
      }

      // Create Internal CRM Notification
      await tx.notification.create({
        data: {
          targetRole: 'ADMIN',
          title: `Đặt dịch vụ mới ${bookingCode}: ${data.fullName}`,
          message: `Nguồn: ${data.source} • Dịch vụ: ${resolvedServiceName} • Ngân sách: ${data.budgetRange || 'Thỏa thuận'}`,
          type: 'SUCCESS',
          channel: 'INTERNAL',
          customerId: customer.id,
          bookingId: booking.id,
          link: `/admin/bookings?code=${encodeURIComponent(bookingCode)}`,
          deliveryStatus: 'SENT',
        },
      });

      // Create Activity Log
      await tx.activityLog.create({
        data: {
          actorType: data.source === 'TELEGRAM' ? 'TELEGRAM_BOT' : data.source === 'ADMIN' ? 'ADMIN' : 'CUSTOMER',
          actorName: data.fullName,
          action: 'CREATE_SERVICE_BOOKING',
          entity: 'ServiceBooking',
          entityId: booking.id,
          details: `Khách hàng ${data.fullName} (${normalizedPhone}) đặt dịch vụ "${resolvedServiceName}" qua ${data.source} với mã ${bookingCode}`,
          afterData: JSON.stringify({
            bookingCode,
            customerId: customer.id,
            serviceName: resolvedServiceName,
            source: data.source,
            budgetRange: data.budgetRange,
          }),
          ipAddress: data.ipAddress || null,
        },
      });

      return { customer, booking, lead };
    });

    // 7. Best-effort sync to Supabase Cloud tables
    void syncRecordToSupabase('customers', {
      id: result.customer.id,
      full_name: result.customer.name,
      phone: result.customer.phone,
      email: result.customer.email,
      telegram_user_id: result.customer.telegramUserId,
      telegram_username: result.customer.telegramUsername,
      company_name: result.customer.company,
      address: result.customer.address,
      notes: result.customer.notes,
      source: result.customer.source,
    });

    void syncRecordToSupabase('service_bookings', {
      id: result.booking.id,
      booking_code: result.booking.bookingCode,
      customer_id: result.customer.id,
      service_id: result.booking.serviceId,
      source: result.booking.source,
      project_title: result.booking.projectTitle,
      project_description: result.booking.projectDescription,
      budget_min: result.booking.budgetMin,
      budget_max: result.booking.budgetMax,
      preferred_start_date: result.booking.preferredStartDate,
      preferred_contact_time: result.booking.preferredContactTime,
      customer_notes: result.booking.customerNotes,
      status: result.booking.status,
    });

    // 8. Send real-time Telegram Admin Notification
    await sendTelegramAdminNotification({
      bookingId: result.booking.id,
      bookingCode: result.booking.bookingCode,
      customerId: result.customer.id,
      fullName: result.customer.name,
      phone: normalizedPhone,
      email: hasRealEmail ? normalizedEmail : 'Chưa cung cấp',
      companyName: data.companyName || result.customer.company || 'Cá nhân / Chưa cung cấp',
      telegramUsername: data.telegramUsername || result.customer.telegramUsername || undefined,
      telegramUserId: data.telegramUserId || result.customer.telegramUserId || undefined,
      source: data.source,
      pageSource: result.booking.pageSource || undefined,
      serviceName: resolvedServiceName,
      projectTitle: data.projectTitle,
      budgetRange: data.budgetRange || 'Chưa xác định',
      preferredStartDate: data.preferredStartDate || 'Linh hoạt',
      preferredContactTime: data.preferredContactTime || 'Giờ hành chính',
      description: data.projectDescription,
      createdAt: result.booking.createdAt,
    });

    return {
      success: true,
      message: 'Yêu cầu của bạn đã được ghi nhận thành công!',
      bookingCode: result.booking.bookingCode,
      bookingId: result.booking.id,
      customerId: result.customer.id,
      leadId: result.lead.id,
      isExistingCustomer,
    };
  } catch (error) {
    console.error('[BookingEngine] Error creating booking:', error);
    return {
      success: false,
      message: 'Đã có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại sau.',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    };
  }
}

