import { prisma } from './prisma';
import { syncRecordToSupabase } from './supabase';
import {
  sendTelegramMessage,
  editTelegramMessage,
  answerCallbackQuery,
  notifyCustomerBookingStatusChange,
  syncBookingTelegramAdminMessage,
  buildBookingAdminMessageText,
  buildBookingAdminInlineKeyboard,
  getPublicCrmUrl,
  TelegramInlineButton,
} from './telegram-notifier';
import {
  verifyTelegramAdminPermission,
  validateBookingStatusTransition,
} from './telegram-admin-rbac';
import { formatCurrencyVND } from './utils';

export interface AdminQuoteDraftItem {
  title: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface AdminControlSessionData {
  mode?: 'ADMIN_QUOTE_WIZARD' | 'ADMIN_PROJECT_WIZARD';
  bookingId?: string;
  bookingCode?: string;
  customerId?: string;
  customerName?: string;
  serviceId?: string;
  serviceName?: string;
  // Quote wizard fields
  items?: AdminQuoteDraftItem[];
  currentItemTitle?: string;
  currentItemDesc?: string;
  currentItemQty?: number;
  discount?: number;
  validDays?: number;
  adminNotes?: string;
  // Project wizard fields
  projectName?: string;
  quotationId?: string;
  quotationCode?: string;
  startDateStr?: string;
  deadlineStr?: string;
  projectBudget?: number;
  managerName?: string;
  projectDescription?: string;
  projectNotes?: string;
}

function parseSessionData(raw?: string | null): AdminControlSessionData {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as AdminControlSessionData;
  } catch {
    return {};
  }
}

async function saveAdminWizardStep(params: {
  telegramUserId: string;
  telegramUsername?: string;
  chatId: string;
  step: string;
  state: string;
  data: AdminControlSessionData;
}) {
  await prisma.telegramConversation.upsert({
    where: { telegramUserId: params.telegramUserId },
    update: {
      telegramUsername: params.telegramUsername || undefined,
      chatId: params.chatId,
      currentStep: params.step,
      conversationState: params.state,
      temporaryData: JSON.stringify(params.data),
    },
    create: {
      telegramUserId: params.telegramUserId,
      telegramUsername: params.telegramUsername || null,
      chatId: params.chatId,
      currentStep: params.step,
      conversationState: params.state,
      temporaryData: JSON.stringify(params.data),
    },
  });
}

function parseAmountInput(input: string): number {
  const cleaned = input.trim().toLowerCase().replace(/[,._\s]/g, '');
  if (cleaned.endsWith('tr') || cleaned.endsWith('m')) {
    const num = parseFloat(cleaned.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? NaN : Math.round(num * 1_000_000);
  }
  if (cleaned.endsWith('k')) {
    const num = parseFloat(cleaned.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? NaN : Math.round(num * 1_000);
  }
  const num = parseFloat(cleaned.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? NaN : Math.round(num);
}

/**
 * Handles all Admin Slash Commands (/newbookings, /pending, /customers, /quotations, /projects, /stats, /today).
 * Returns true if the command was recognized as an Admin command.
 */
export async function handleTelegramAdminCommand(params: {
  commandText: string;
  chatId: string;
  telegramUserId: string;
  telegramUsername?: string;
}): Promise<boolean> {
  const cmd = params.commandText.split(' ')[0].split('@')[0].toLowerCase();
  const adminCommands = [
    '/newbookings',
    '/pending',
    '/customers',
    '/quotations',
    '/projects',
    '/stats',
    '/today',
  ];

  if (!adminCommands.includes(cmd)) {
    return false;
  }

  const auth = await verifyTelegramAdminPermission(
    params.telegramUserId,
    cmd === '/stats' ? 'stats.view' : 'booking.view'
  );

  if (!auth.authorized || !auth.admin) {
    await sendTelegramMessage(
      params.chatId,
      `⛔ TỪ CHỐI TRUY CẬP\n${auth.reason || 'Bạn không có quyền thực thi lệnh quản trị này.'}`
    );
    return true;
  }

  if (cmd === '/newbookings') {
    const bookings = await prisma.serviceBooking.findMany({
      where: { status: 'NEW' },
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    if (bookings.length === 0) {
      await sendTelegramMessage(
        params.chatId,
        '✅ Hiện tại không có đơn đặt dịch vụ nào đang ở trạng thái MỚI (NEW).'
      );
      return true;
    }

    const lines = [
      `🔔 DANH SÁCH ĐƠN MỚI CHỜ XÁC NHẬN (${bookings.length})`,
      '━━━━━━━━━━━━━━━━',
    ];
    const buttons: TelegramInlineButton[][] = [];

    bookings.forEach((b, i) => {
      const cleanCode = b.bookingCode.replace(/^#/, '');
      lines.push(
        `${i + 1}. [${cleanCode}] ${b.customer.name} — ${b.customer.phone || ''}`,
        `   • Dịch vụ: ${b.serviceName}`,
        `   • Ngân sách: ${b.budgetRange || 'Thỏa thuận'} | Nguồn: ${b.source}`
      );
      buttons.push([
        {
          text: `⚡ Mở bảng điều khiển ${cleanCode}`,
          callback_data: `booking:panel:${b.id}`,
        },
      ]);
    });

    await sendTelegramMessage(params.chatId, lines.join('\n'), {
      inline_keyboard: buttons,
    });
    return true;
  }

  if (cmd === '/pending') {
    const bookings = await prisma.serviceBooking.findMany({
      where: {
        status: { in: ['CONFIRMED', 'CONSULTING', 'QUOTATION_SENT', 'IN_PROGRESS'] },
      },
      include: { customer: true },
      orderBy: { updatedAt: 'desc' },
      take: 10,
    });

    if (bookings.length === 0) {
      await sendTelegramMessage(params.chatId, '📋 Không có yêu cầu nào đang trong quá trình xử lý.');
      return true;
    }

    const lines = [
      `⏳ YÊU CẦU ĐANG XỬ LÝ (${bookings.length})`,
      '━━━━━━━━━━━━━━━━',
    ];
    const buttons: TelegramInlineButton[][] = [];

    bookings.forEach((b, i) => {
      const cleanCode = b.bookingCode.replace(/^#/, '');
      lines.push(
        `${i + 1}. [${cleanCode}] ${b.customer.name} (${b.status})`,
        `   • Dịch vụ: ${b.serviceName} • Phụ trách: ${b.assignedTo || b.confirmedBy || 'Admin'}`
      );
      buttons.push([
        {
          text: `🔧 Xử lý ${cleanCode} (${b.status})`,
          callback_data: `booking:panel:${b.id}`,
        },
      ]);
    });

    await sendTelegramMessage(params.chatId, lines.join('\n'), {
      inline_keyboard: buttons,
    });
    return true;
  }

  if (cmd === '/today') {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const bookings = await prisma.serviceBooking.findMany({
      where: { createdAt: { gte: startOfToday } },
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
      take: 15,
    });

    const lines = [
      `📅 YÊU CẦU MỚI TRONG NGÀY HÔM NAY (${bookings.length})`,
      '━━━━━━━━━━━━━━━━',
    ];
    const buttons: TelegramInlineButton[][] = [];

    if (bookings.length === 0) {
      lines.push('Chưa có yêu cầu đặt dịch vụ nào phát sinh từ 00:00 hôm nay.');
    } else {
      bookings.forEach((b, i) => {
        const cleanCode = b.bookingCode.replace(/^#/, '');
        lines.push(
          `${i + 1}. [${cleanCode}] ${b.customer.name} (${b.status})`,
          `   • Dịch vụ: ${b.serviceName} • Nguồn: ${b.source}`
        );
        buttons.push([
          {
            text: `👁 Điều khiển ${cleanCode}`,
            callback_data: `booking:panel:${b.id}`,
          },
        ]);
      });
    }

    await sendTelegramMessage(
      params.chatId,
      lines.join('\n'),
      buttons.length > 0 ? { inline_keyboard: buttons } : undefined
    );
    return true;
  }

  if (cmd === '/customers') {
    const customers = await prisma.customer.findMany({
      where: { deletedAt: null },
      include: {
        _count: { select: { bookings: true, projects: true, quotations: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const lines = [
      `👥 DANH SÁCH KHÁCH HÀNG GẦN NHẤT (${customers.length})`,
      '━━━━━━━━━━━━━━━━',
    ];

    customers.forEach((c, i) => {
      lines.push(
        `${i + 1}. [${c.code}] ${c.name}`,
        `   • SĐT: ${c.phone || 'N/A'} | Nguồn: ${c.source}`,
        `   • Bookings: ${c._count.bookings} | Báo giá: ${c._count.quotations} | Dự án: ${c._count.projects}`
      );
    });

    await sendTelegramMessage(params.chatId, lines.join('\n'));
    return true;
  }

  if (cmd === '/quotations') {
    const quotes = await prisma.quotation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const lines = [
      `💰 DANH SÁCH BÁO GIÁ GẦN NHẤT (${quotes.length})`,
      '━━━━━━━━━━━━━━━━',
    ];
    const buttons: TelegramInlineButton[][] = [];

    quotes.forEach((q, i) => {
      lines.push(
        `${i + 1}. [${q.code}] ${q.clientName} — ${formatCurrencyVND(q.totalAmount)}`,
        `   • Dịch vụ: ${q.serviceName} | Trạng thái: ${q.status}`
      );
      buttons.push([
        { text: `📄 Xem ${q.code}`, callback_data: `quote:view:${q.id}` },
      ]);
    });

    await sendTelegramMessage(
      params.chatId,
      lines.join('\n'),
      buttons.length > 0 ? { inline_keyboard: buttons } : undefined
    );
    return true;
  }

  if (cmd === '/projects') {
    const projects = await prisma.project.findMany({
      where: { deletedAt: null },
      include: { customer: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const lines = [
      `📁 DANH SÁCH DỰ ÁN TRIỂN KHAI (${projects.length})`,
      '━━━━━━━━━━━━━━━━',
    ];
    const buttons: TelegramInlineButton[][] = [];

    projects.forEach((p, i) => {
      lines.push(
        `${i + 1}. [${p.code}] ${p.name}`,
        `   • KH: ${p.customer.name} | Trạng thái: ${p.status} (${p.progress}%)`
      );
      buttons.push([
        { text: `📂 Xem dự án ${p.code}`, callback_data: `project:view:${p.id}` },
      ]);
    });

    await sendTelegramMessage(
      params.chatId,
      lines.join('\n'),
      buttons.length > 0 ? { inline_keyboard: buttons } : undefined
    );
    return true;
  }

  if (cmd === '/stats') {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalCustomers,
      totalBookings,
      bookingsToday,
      newBookings,
      confirmedBookings,
      websiteBookings,
      telegramBookings,
      totalQuotations,
      totalProjects,
    ] = await Promise.all([
      prisma.customer.count({ where: { deletedAt: null } }),
      prisma.serviceBooking.count(),
      prisma.serviceBooking.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.serviceBooking.count({ where: { status: 'NEW' } }),
      prisma.serviceBooking.count({ where: { status: 'CONFIRMED' } }),
      prisma.serviceBooking.count({ where: { source: 'WEBSITE' } }),
      prisma.serviceBooking.count({ where: { source: 'TELEGRAM' } }),
      prisma.quotation.count(),
      prisma.project.count({ where: { deletedAt: null } }),
    ]);

    const statsMsg = [
      '📊 THỐNG KÊ HOẠT ĐỘNG – NGUYÊN AGENCY',
      '━━━━━━━━━━━━━━━━',
      `👥 Tổng khách hàng: ${totalCustomers}`,
      `📥 Tổng yêu cầu đặt dịch vụ: ${totalBookings}`,
      `   • Hôm nay: ${bookingsToday}`,
      `   • Chờ xác nhận (NEW): ${newBookings}`,
      `   • Đã xác nhận (CONFIRMED): ${confirmedBookings}`,
      `   • Nguồn Website: ${websiteBookings} | Nguồn Telegram: ${telegramBookings}`,
      `💰 Tổng số Báo giá: ${totalQuotations}`,
      `📁 Tổng số Dự án: ${totalProjects}`,
      '━━━━━━━━━━━━━━━━',
      `👮 Người truy vấn: ${auth.admin.fullName} (${auth.admin.role})`,
    ].join('\n');

    await sendTelegramMessage(params.chatId, statsMsg);
    return true;
  }

  return false;
}

/**
 * Handles all Admin Inline Keyboard Callback Queries (`booking:*`, `call_outcome:*`, `quote:*`, `project:*`).
 * Returns true if the callback was an Admin callback.
 */
export async function handleTelegramAdminCallback(params: {
  callbackId: string;
  data: string;
  chatId: string;
  messageId?: number;
  telegramUserId: string;
  telegramUsername?: string;
}): Promise<boolean> {
  const { data, callbackId, chatId, telegramUserId, telegramUsername } = params;

  const isAdminCallback =
    data.startsWith('booking:') &&
    !data.startsWith('booking:skip_email') &&
    data !== 'booking:cancel' &&
    data !== 'booking:edit' &&
    data !== 'booking:submit';

  const isAuxiliaryAdminCallback =
    data.startsWith('call_outcome:') ||
    data.startsWith('quote:') ||
    data.startsWith('project:') ||
    data.startsWith('adm_status:');

  if (!isAdminCallback && !isAuxiliaryAdminCallback) {
    return false;
  }

  // Determine required permission based on action
  let requiredPerm: Parameters<typeof verifyTelegramAdminPermission>[1] = 'booking.view';
  if (data.startsWith('booking:confirm:')) requiredPerm = 'booking.confirm';
  else if (data.startsWith('booking:call:') || data.startsWith('call_outcome:'))
    requiredPerm = 'booking.call';
  else if (data.startsWith('booking:quotation:') || data.startsWith('quote:'))
    requiredPerm = 'booking.quotation';
  else if (data.startsWith('booking:project:') || data.startsWith('project:'))
    requiredPerm = 'booking.project';
  else if (data.startsWith('booking:detail:')) requiredPerm = 'booking.detail';
  else if (
    data.startsWith('booking:status:') ||
    data.startsWith('booking:set_status:') ||
    data.startsWith('adm_status:')
  )
    requiredPerm = 'booking.status';
  else if (
    data.startsWith('booking:cancel:') ||
    data.startsWith('booking:confirm_cancel:')
  )
    requiredPerm = 'booking.cancel';

  const auth = await verifyTelegramAdminPermission(telegramUserId, requiredPerm);
  if (!auth.authorized || !auth.admin) {
    await answerCallbackQuery(
      callbackId,
      `⛔ Từ chối: ${auth.reason || 'Không đủ quyền quản trị.'}`,
      true
    );
    await prisma.activityLog.create({
      data: {
        actorType: 'TELEGRAM_BOT',
        actorName: telegramUsername ? `@${telegramUsername}` : `TG:${telegramUserId}`,
        action: 'UNAUTHORIZED_TELEGRAM_CALLBACK',
        entity: 'Security',
        details: `Chặn truy cập trái phép callback "${data}" từ Telegram ID ${telegramUserId}`,
      },
    });
    return true;
  }

  const admin = auth.admin;

  // ---------------------------------------------------------------------------
  // 0. Open Booking Control Panel (`booking:panel:{booking_id}`)
  // ---------------------------------------------------------------------------
  if (data.startsWith('booking:panel:')) {
    const bookingId = data.replace('booking:panel:', '');
    await answerCallbackQuery(callbackId, 'Đang mở bảng điều khiển đơn hàng...');

    const booking = await prisma.serviceBooking.findUnique({
      where: { id: bookingId },
      include: { customer: true, projects: { select: { id: true } } },
    });

    if (!booking) {
      await sendTelegramMessage(chatId, '⚠️ Không tìm thấy đơn đặt dịch vụ.');
      return true;
    }

    const msgText = buildBookingAdminMessageText({
      bookingId: booking.id,
      bookingCode: booking.bookingCode,
      customerId: booking.customerId,
      fullName: booking.customer.name,
      phone: booking.customer.phone || 'Chưa cung cấp',
      email: booking.customer.email,
      companyName: booking.customer.company || 'Cá nhân',
      source: booking.source,
      serviceName: booking.serviceName,
      projectTitle: booking.projectTitle,
      budgetRange: booking.budgetRange || 'Thỏa thuận',
      preferredStartDate: booking.preferredStartDate || 'Linh hoạt',
      description: booking.projectDescription,
      status: booking.status,
      actorName: booking.confirmedBy || booking.assignedTo || admin.fullName,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    });

    await sendTelegramMessage(
      chatId,
      msgText,
      buildBookingAdminInlineKeyboard(
        booking.id,
        booking.status,
        booking.projects.length > 0
      )
    );
    return true;
  }

  // ---------------------------------------------------------------------------
  // 1. SECTION 2: CONFIRM BOOKING (`booking:confirm:{booking_id}`)
  // ---------------------------------------------------------------------------
  if (data.startsWith('booking:confirm:')) {
    const bookingId = data.replace('booking:confirm:', '');
    const booking = await prisma.serviceBooking.findUnique({
      where: { id: bookingId },
      include: { customer: true },
    });

    if (!booking) {
      await answerCallbackQuery(callbackId, '⚠️ Không tìm thấy đơn hàng.', true);
      return true;
    }

    if (booking.status === 'CONFIRMED') {
      await answerCallbackQuery(
        callbackId,
        `⚠️ Đơn ${booking.bookingCode} đã được xác nhận trước đó bởi ${booking.confirmedBy || 'Admin'}!`,
        true
      );
      return true;
    }

    const transition = validateBookingStatusTransition(
      booking.status,
      'CONFIRMED',
      admin.role
    );
    if (!transition.valid) {
      await answerCallbackQuery(callbackId, `⚠️ ${transition.reason}`, true);
      return true;
    }

    await answerCallbackQuery(callbackId, '✅ Đang xác nhận yêu cầu...');

    const now = new Date();
    const updated = await prisma.serviceBooking.update({
      where: { id: booking.id },
      data: {
        status: 'CONFIRMED',
        confirmedBy: admin.fullName,
        confirmedAt: now,
        assignedTo: booking.assignedTo || admin.fullName,
      },
    });

    await prisma.activityLog.create({
      data: {
        actorType: 'ADMIN',
        actorName: `${admin.fullName} (TG:${admin.telegramUserId})`,
        action: 'CONFIRM_BOOKING_TELEGRAM',
        entity: 'ServiceBooking',
        entityId: booking.id,
        details: `Xác nhận yêu cầu ${booking.bookingCode} trên Telegram`,
        beforeData: JSON.stringify({ status: booking.status }),
        afterData: JSON.stringify({
          status: updated.status,
          confirmedBy: admin.fullName,
          confirmedAt: now.toISOString(),
        }),
      },
    });

    void syncRecordToSupabase('service_bookings', {
      id: updated.id,
      booking_code: updated.bookingCode,
      customer_id: updated.customerId,
      service_id: updated.serviceId,
      source: updated.source,
      project_title: updated.projectTitle,
      project_description: updated.projectDescription,
      status: updated.status,
      assigned_to: updated.assignedTo,
      confirmed_by: updated.confirmedBy,
      confirmed_at: now.toISOString(),
    });

    // Notify Customer if linked
    await notifyCustomerBookingStatusChange({
      bookingCode: booking.bookingCode,
      projectTitle: booking.projectTitle,
      serviceName: booking.serviceName,
      newStatus: 'CONFIRMED',
      telegramUserId: booking.customer.telegramUserId,
      adminNote: `Yêu cầu của bạn đã được ${admin.fullName} xác nhận tiếp nhận.`,
    });

    // Edit original notification message in-place
    await syncBookingTelegramAdminMessage(booking.id, admin.fullName);

    const cleanCode = booking.bookingCode.replace(/^#/, '');
    const confirmResultMsg = [
      '✅ ĐÃ XÁC NHẬN YÊU CẦU',
      `Mã yêu cầu: ${cleanCode}`,
      `Khách hàng: ${booking.customer.name}`,
      `Dịch vụ: ${booking.serviceName}`,
      `Người xử lý: ${admin.fullName}`,
      'Trạng thái: CONFIRMED',
    ].join('\n');

    await sendTelegramMessage(chatId, confirmResultMsg, {
      inline_keyboard: [
        [
          { text: '📞 Gọi khách hàng', callback_data: `booking:call:${booking.id}` },
          { text: '💰 Tạo báo giá', callback_data: `booking:quotation:${booking.id}` },
        ],
      ],
    });
    return true;
  }

  // ---------------------------------------------------------------------------
  // 2. SECTION 3: CALL CUSTOMER & LOG CALL OUTCOME (`booking:call:{booking_id}`)
  // ---------------------------------------------------------------------------
  if (data.startsWith('booking:call:')) {
    const bookingId = data.replace('booking:call:', '');
    const booking = await prisma.serviceBooking.findUnique({
      where: { id: bookingId },
      include: { customer: true },
    });

    if (!booking) {
      await answerCallbackQuery(callbackId, '⚠️ Không tìm thấy đơn hàng.', true);
      return true;
    }

    await answerCallbackQuery(callbackId, '📞 Thông tin liên hệ khách hàng');

    const phone = booking.customer.phone || 'Chưa cung cấp';
    const email = booking.customer.email.endsWith('@telegram.nguyenagency.vn')
      ? 'Chưa cung cấp'
      : booking.customer.email;
    const cleanCode = booking.bookingCode.replace(/^#/, '');

    const callLines = [
      '📞 LIÊN HỆ KHÁCH HÀNG TRỰC TIẾP',
      '━━━━━━━━━━━━━━━━',
      `🆔 Mã yêu cầu: ${cleanCode}`,
      `👤 Khách hàng: ${booking.customer.name}`,
      `📱 Số điện thoại: ${phone}`,
      `✉️ Email: ${email}`,
      `🛠 Dịch vụ: ${booking.serviceName}`,
      '━━━━━━━━━━━━━━━━',
      '💡 Chạm trực tiếp vào số điện thoại trên tin nhắn để quay số trên thiết bị di động, hoặc bấm nút "Sao chép SĐT" bên dưới.',
      '',
      'Sau khi trao đổi, vui lòng chọn Kết quả cuộc gọi để cập nhật vào CRM & Supabase:',
    ];

    const callKeyboard: TelegramInlineButton[][] = [];

    if (booking.customer.phone) {
      callKeyboard.push([
        {
          text: `📋 Sao chép SĐT: ${booking.customer.phone}`,
          copy_text: { text: booking.customer.phone },
        },
      ]);
    }

    if (booking.customer.telegramUsername) {
      callKeyboard.push([
        {
          text: `💬 Mở chat Telegram (@${booking.customer.telegramUsername.replace(/^@/, '')})`,
          url: `https://t.me/${booking.customer.telegramUsername.replace(/^@/, '')}`,
        },
      ]);
    }

    callKeyboard.push(
      [
        {
          text: '✅ Đã liên hệ thành công',
          callback_data: `call_outcome:CONTACTED_OK:${booking.id}`,
        },
        {
          text: '📵 Không nghe máy',
          callback_data: `call_outcome:NO_ANSWER:${booking.id}`,
        },
      ],
      [
        {
          text: '⏰ Hẹn gọi lại',
          callback_data: `call_outcome:CALLBACK_LATER:${booking.id}`,
        },
        {
          text: '💡 Khách cần tư vấn thêm',
          callback_data: `call_outcome:NEEDS_CONSULTING:${booking.id}`,
        },
      ],
      [{ text: '🔙 Quay lại đơn hàng', callback_data: `booking:panel:${booking.id}` }]
    );

    await sendTelegramMessage(chatId, callLines.join('\n'), {
      inline_keyboard: callKeyboard,
    });
    return true;
  }

  if (data.startsWith('call_outcome:')) {
    const parts = data.split(':');
    const outcome = parts[1];
    const bookingId = parts[2];

    const booking = await prisma.serviceBooking.findUnique({
      where: { id: bookingId },
      include: { customer: true, leads: true },
    });

    if (!booking) {
      await answerCallbackQuery(callbackId, '⚠️ Không tìm thấy đơn hàng.', true);
      return true;
    }

    const outcomeMap: Record<
      string,
      { label: string; leadStage: string; bookingStatus?: string }
    > = {
      CONTACTED_OK: {
        label: 'Đã liên hệ thành công',
        leadStage: 'QUALIFIED',
        bookingStatus: 'CONSULTING',
      },
      NO_ANSWER: {
        label: 'Không nghe máy',
        leadStage: 'CONTACTED',
      },
      CALLBACK_LATER: {
        label: 'Hẹn gọi lại sau',
        leadStage: 'CONTACTED',
      },
      NEEDS_CONSULTING: {
        label: 'Khách cần tư vấn chuyên sâu thêm',
        leadStage: 'QUALIFIED',
        bookingStatus: 'CONSULTING',
      },
    };

    const selected = outcomeMap[outcome] || outcomeMap.CONTACTED_OK;
    await answerCallbackQuery(callbackId, `Đã ghi nhận: ${selected.label}`);

    // Append to Customer contactHistoryJson
    let contactHistory: Array<Record<string, unknown>> = [];
    try {
      contactHistory = JSON.parse(booking.customer.contactHistoryJson || '[]');
    } catch {
      contactHistory = [];
    }
    contactHistory.unshift({
      date: new Date().toISOString(),
      actor: admin.fullName,
      channel: 'PHONE_CALL',
      bookingCode: booking.bookingCode,
      outcome: selected.label,
    });

    await prisma.customer.update({
      where: { id: booking.customerId },
      data: {
        contactHistoryJson: JSON.stringify(contactHistory),
        careStatus: 'FOLLOW_UP',
      },
    });

    // Update Lead status & history
    if (booking.leads.length > 0) {
      const lead = booking.leads[0];
      let leadHistory: Array<Record<string, unknown>> = [];
      try {
        leadHistory = JSON.parse(lead.historyJson || '[]');
      } catch {
        leadHistory = [];
      }
      leadHistory.unshift({
        date: new Date().toISOString(),
        action: `Kết quả gọi điện (${admin.fullName}): ${selected.label}`,
      });

      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          stage: selected.leadStage,
          assignedTo: admin.fullName,
          historyJson: JSON.stringify(leadHistory),
        },
      });
    }

    if (
      selected.bookingStatus &&
      (booking.status === 'NEW' || booking.status === 'CONFIRMED')
    ) {
      await prisma.serviceBooking.update({
        where: { id: booking.id },
        data: {
          status: selected.bookingStatus,
          assignedTo: admin.fullName,
        },
      });
      await syncBookingTelegramAdminMessage(booking.id, admin.fullName);
    }

    await prisma.activityLog.create({
      data: {
        actorType: 'ADMIN',
        actorName: admin.fullName,
        action: 'LOG_CALL_OUTCOME',
        entity: 'ServiceBooking',
        entityId: booking.id,
        details: `Ghi nhận kết quả gọi KH ${booking.customer.name} (${booking.bookingCode}): ${selected.label}`,
      },
    });

    await sendTelegramMessage(
      chatId,
      [
        '📞 ĐÃ CẬP NHẬT LỊCH SỬ LIÊN HỆ',
        `• Mã yêu cầu: ${booking.bookingCode.replace(/^#/, '')}`,
        `• Khách hàng: ${booking.customer.name} (${booking.customer.phone || ''})`,
        `• Kết quả cuộc gọi: ${selected.label}`,
        `• Lead Status: ${selected.leadStage}`,
        `• Người thực hiện: ${admin.fullName}`,
      ].join('\n'),
      {
        inline_keyboard: [
          [
            { text: '💰 Tạo báo giá ngay', callback_data: `booking:quotation:${booking.id}` },
            { text: '🔙 Quay lại đơn hàng', callback_data: `booking:panel:${booking.id}` },
          ],
        ],
      }
    );
    return true;
  }

  // ---------------------------------------------------------------------------
  // 3. SECTION 4: CREATE QUOTATION 10-STEP WIZARD (`booking:quotation:{booking_id}`)
  // ---------------------------------------------------------------------------
  if (data.startsWith('booking:quotation:')) {
    const bookingId = data.replace('booking:quotation:', '');
    const booking = await prisma.serviceBooking.findUnique({
      where: { id: bookingId },
      include: { customer: true },
    });

    if (!booking) {
      await answerCallbackQuery(callbackId, '⚠️ Không tìm thấy đơn hàng.', true);
      return true;
    }

    await answerCallbackQuery(callbackId, '💰 Bắt đầu tạo báo giá 10 bước...');

    const services = await prisma.service.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      orderBy: { order: 'asc' },
      take: 8,
    });

    await saveAdminWizardStep({
      telegramUserId,
      telegramUsername,
      chatId,
      step: 'ADMIN_QUOTE_STEP_1_SERVICE',
      state: 'ADMIN_QUOTE_WIZARD',
      data: {
        mode: 'ADMIN_QUOTE_WIZARD',
        bookingId: booking.id,
        bookingCode: booking.bookingCode,
        customerId: booking.customerId,
        customerName: booking.customer.name,
        serviceId: booking.serviceId || undefined,
        serviceName: booking.serviceName,
        items: [],
      },
    });

    const svcButtons: TelegramInlineButton[][] = [
      [
        {
          text: `✅ Giữ dịch vụ hiện tại: ${booking.serviceName}`,
          callback_data: `quote:pick_svc:CURRENT`,
        },
      ],
      ...services.map((s) => [
        {
          text: `🛠 ${s.title} (${s.priceLabel})`,
          callback_data: `quote:pick_svc:${s.id}`,
        },
      ]),
      [{ text: '❌ Hủy tạo báo giá', callback_data: `booking:panel:${booking.id}` }],
    ];

    await sendTelegramMessage(
      chatId,
      [
        '💰 TẠO BÁO GIÁ TRỰC TIẾP (10 BƯỚC)',
        `Đơn hàng: ${booking.bookingCode.replace(/^#/, '')} • KH: ${booking.customer.name}`,
        '━━━━━━━━━━━━━━━━',
        '📌 BƯỚC 1/10 — Chọn Dịch vụ chính cho Báo giá:',
      ].join('\n'),
      { inline_keyboard: svcButtons }
    );
    return true;
  }

  if (data.startsWith('quote:pick_svc:')) {
    const svcId = data.replace('quote:pick_svc:', '');
    const convo = await prisma.telegramConversation.findUnique({
      where: { telegramUserId },
    });
    const session = parseSessionData(convo?.temporaryData);

    if (svcId !== 'CURRENT') {
      const svc = await prisma.service.findUnique({ where: { id: svcId } });
      if (svc) {
        session.serviceId = svc.id;
        session.serviceName = svc.title;
      }
    }

    await saveAdminWizardStep({
      telegramUserId,
      telegramUsername,
      chatId,
      step: 'ADMIN_QUOTE_STEP_2_ITEM_NAME',
      state: 'ADMIN_QUOTE_WIZARD',
      data: session,
    });

    await answerCallbackQuery(callbackId, `Đã chọn: ${session.serviceName}`);
    await sendTelegramMessage(
      chatId,
      [
        `✅ Dịch vụ: ${session.serviceName}`,
        '',
        `📌 BƯỚC 2/10 — Nhập Tên hạng mục công việc thứ ${(session.items?.length || 0) + 1}:`,
        '(Ví dụ: Thiết kế UI/UX Hệ thống Website 3D độc bản)',
      ].join('\n')
    );
    return true;
  }

  if (data === 'quote:add_more_item') {
    const convo = await prisma.telegramConversation.findUnique({
      where: { telegramUserId },
    });
    const session = parseSessionData(convo?.temporaryData);

    await saveAdminWizardStep({
      telegramUserId,
      telegramUsername,
      chatId,
      step: 'ADMIN_QUOTE_STEP_2_ITEM_NAME',
      state: 'ADMIN_QUOTE_WIZARD',
      data: session,
    });

    await answerCallbackQuery(callbackId, 'Thêm hạng mục mới');
    await sendTelegramMessage(
      chatId,
      `📌 BƯỚC 2/10 — Nhập Tên hạng mục công việc thứ ${(session.items?.length || 0) + 1}:`
    );
    return true;
  }

  if (data === 'quote:goto_step7_discount') {
    const convo = await prisma.telegramConversation.findUnique({
      where: { telegramUserId },
    });
    const session = parseSessionData(convo?.temporaryData);

    await saveAdminWizardStep({
      telegramUserId,
      telegramUsername,
      chatId,
      step: 'ADMIN_QUOTE_STEP_7_DISCOUNT',
      state: 'ADMIN_QUOTE_WIZARD',
      data: session,
    });

    await answerCallbackQuery(callbackId);
    await sendTelegramMessage(
      chatId,
      '📌 BƯỚC 7/10 — Nhập số tiền Giảm giá (VNĐ) hoặc chọn bên dưới:',
      {
        inline_keyboard: [
          [
            { text: '0 VNĐ (Không giảm giá)', callback_data: 'quote:discount:0' },
            { text: 'Giảm 2.000.000 VNĐ', callback_data: 'quote:discount:2000000' },
          ],
          [
            { text: 'Giảm 5.000.000 VNĐ', callback_data: 'quote:discount:5000000' },
            { text: 'Giảm 10.000.000 VNĐ', callback_data: 'quote:discount:10000000' },
          ],
        ],
      }
    );
    return true;
  }

  if (data.startsWith('quote:discount:')) {
    const discVal = parseInt(data.replace('quote:discount:', ''), 10) || 0;
    const convo = await prisma.telegramConversation.findUnique({
      where: { telegramUserId },
    });
    const session = parseSessionData(convo?.temporaryData);
    session.discount = discVal;

    await saveAdminWizardStep({
      telegramUserId,
      telegramUsername,
      chatId,
      step: 'ADMIN_QUOTE_STEP_8_VALIDITY',
      state: 'ADMIN_QUOTE_WIZARD',
      data: session,
    });

    await answerCallbackQuery(callbackId);
    await sendTelegramMessage(
      chatId,
      '📌 BƯỚC 8/10 — Chọn hoặc nhập Thời hạn hiệu lực của báo giá (số ngày):',
      {
        inline_keyboard: [
          [
            { text: '7 ngày', callback_data: 'quote:validity:7' },
            { text: '14 ngày (Tiêu chuẩn)', callback_data: 'quote:validity:14' },
            { text: '30 ngày', callback_data: 'quote:validity:30' },
          ],
        ],
      }
    );
    return true;
  }

  if (data.startsWith('quote:validity:')) {
    const days = parseInt(data.replace('quote:validity:', ''), 10) || 14;
    const convo = await prisma.telegramConversation.findUnique({
      where: { telegramUserId },
    });
    const session = parseSessionData(convo?.temporaryData);
    session.validDays = days;

    await saveAdminWizardStep({
      telegramUserId,
      telegramUsername,
      chatId,
      step: 'ADMIN_QUOTE_STEP_9_NOTES',
      state: 'ADMIN_QUOTE_WIZARD',
      data: session,
    });

    await answerCallbackQuery(callbackId);
    await sendTelegramMessage(
      chatId,
      '📌 BƯỚC 9/10 — Nhập Ghi chú & điều khoản thanh toán (hoặc bấm nút Mặc định):',
      {
        inline_keyboard: [
          [
            {
              text: '⚡ Dùng điều khoản thanh toán 50% - 50% tiêu chuẩn',
              callback_data: 'quote:notes:DEFAULT',
            },
          ],
        ],
      }
    );
    return true;
  }

  if (data === 'quote:notes:DEFAULT') {
    const convo = await prisma.telegramConversation.findUnique({
      where: { telegramUserId },
    });
    const session = parseSessionData(convo?.temporaryData);
    session.adminNotes =
      'Thanh toán 2 đợt: Đợt 1 (50%) ngay khi ký hợp đồng, Đợt 2 (50%) khi nghiệm thu bàn giao dự án.';

    await saveAdminWizardStep({
      telegramUserId,
      telegramUsername,
      chatId,
      step: 'ADMIN_QUOTE_STEP_10_CONFIRM',
      state: 'ADMIN_QUOTE_WIZARD',
      data: session,
    });

    await answerCallbackQuery(callbackId);
    await sendQuoteStep10Summary(chatId, session);
    return true;
  }

  if (data === 'quote:confirm_create') {
    const convo = await prisma.telegramConversation.findUnique({
      where: { telegramUserId },
    });
    const session = parseSessionData(convo?.temporaryData);

    if (!session.bookingId || !session.items || session.items.length === 0) {
      await answerCallbackQuery(
        callbackId,
        '⚠️ Phiên tạo báo giá đã hết hạn hoặc chưa có hạng mục.',
        true
      );
      return true;
    }

    await answerCallbackQuery(callbackId, 'Đang lưu báo giá vào Database & Supabase...');

    const booking = await prisma.serviceBooking.findUnique({
      where: { id: session.bookingId },
      include: { customer: true },
    });

    if (!booking) {
      await sendTelegramMessage(chatId, '⚠️ Không tìm thấy đơn đặt dịch vụ gốc.');
      return true;
    }

    const subtotal = session.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const discount = Math.min(subtotal, session.discount || 0);
    const totalAmount = Math.max(0, subtotal - discount);
    const validDays = session.validDays || 14;
    const validUntil = new Date(Date.now() + validDays * 24 * 60 * 60 * 1000);

    const qCount = await prisma.quotation.count();
    const quotationCode = `QT-${new Date().getFullYear()}-${String(qCount + 1).padStart(4, '0')}`;

    const createdQuote = await prisma.$transaction(async (tx) => {
      const q = await tx.quotation.create({
        data: {
          code: quotationCode,
          customerId: booking.customerId,
          bookingId: booking.id,
          clientName: booking.customer.name,
          clientEmail: booking.customer.email,
          clientPhone: booking.customer.phone,
          clientCompany: booking.customer.company,
          serviceGroup: 'TECH',
          serviceName: session.serviceName || booking.serviceName,
          packageName: 'Báo giá chi tiết từ Telegram Admin Control Center',
          requirements: `${booking.projectTitle}\n${booking.projectDescription}`,
          budgetRange: booking.budgetRange,
          desiredTimeline: booking.preferredStartDate,
          subtotal,
          discount,
          taxAmount: 0,
          totalAmount,
          status: 'DRAFT',
          createdBy: admin.fullName,
          adminNotes: session.adminNotes || null,
          validUntil,
          items: {
            create: session.items!.map((item) => ({
              serviceId: session.serviceId || booking.serviceId || null,
              title: item.title,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
            })),
          },
        },
        include: { items: true },
      });

      await tx.activityLog.create({
        data: {
          actorType: 'ADMIN',
          actorName: admin.fullName,
          action: 'CREATE_QUOTATION_TELEGRAM',
          entity: 'Quotation',
          entityId: q.id,
          details: `Lập báo giá ${q.code} (${formatCurrencyVND(q.totalAmount)}) ở trạng thái DRAFT cho đơn ${booking.bookingCode}`,
        },
      });

      return q;
    });

    // Clear wizard state
    await saveAdminWizardStep({
      telegramUserId,
      telegramUsername,
      chatId,
      step: 'IDLE',
      state: 'IDLE',
      data: {},
    });

    void syncRecordToSupabase('quotations', {
      id: createdQuote.id,
      quotation_code: createdQuote.code,
      customer_id: createdQuote.customerId,
      booking_id: createdQuote.bookingId,
      total_amount: createdQuote.totalAmount,
      discount: createdQuote.discount,
      final_amount: createdQuote.totalAmount,
      notes: createdQuote.adminNotes,
      status: 'DRAFT',
      valid_until: validUntil.toISOString().slice(0, 10),
    });

    const quoteMsg = [
      '💰 ĐÃ TẠO BÁO GIÁ',
      `Mã báo giá: ${createdQuote.code}`,
      `Khách hàng: ${booking.customer.name}`,
      `Tổng giá trị: ${formatCurrencyVND(createdQuote.totalAmount)}`,
      'Trạng thái: DRAFT',
    ].join('\n');

    await sendTelegramMessage(chatId, quoteMsg, {
      inline_keyboard: [
        [
          { text: '📄 Xem báo giá', callback_data: `quote:view:${createdQuote.id}` },
          { text: '✉️ Gửi báo giá cho khách', callback_data: `quote:send:${createdQuote.id}` },
        ],
        [
          { text: '✏️ Chỉnh sửa', callback_data: `booking:quotation:${booking.id}` },
          { text: '🔙 Quay lại đơn hàng', callback_data: `booking:panel:${booking.id}` },
        ],
      ],
    });
    return true;
  }

  if (data.startsWith('quote:view:')) {
    const quoteId = data.replace('quote:view:', '');
    const quote = await prisma.quotation.findUnique({
      where: { id: quoteId },
      include: { items: true },
    });

    if (!quote) {
      await answerCallbackQuery(callbackId, '⚠️ Không tìm thấy báo giá.', true);
      return true;
    }

    await answerCallbackQuery(callbackId, `Chi tiết báo giá ${quote.code}`);

    const itemLines = quote.items.map(
      (it, idx) =>
        `${idx + 1}. ${it.title}\n   • Mô tả: ${it.description || 'Tiêu chuẩn'}\n   • ${it.quantity} × ${formatCurrencyVND(it.unitPrice)} = ${formatCurrencyVND(it.totalPrice)}`
    );

    const details = [
      `📄 CHI TIẾT BÁO GIÁ: ${quote.code}`,
      '━━━━━━━━━━━━━━━━',
      `👤 Khách hàng: ${quote.clientName} (${quote.clientPhone || ''})`,
      `🛠 Dịch vụ: ${quote.serviceName}`,
      `📌 Trạng thái: ${quote.status}`,
      `👮 Người lập: ${quote.createdBy || 'Admin'}`,
      `⏳ Hiệu lực đến: ${quote.validUntil ? quote.validUntil.toLocaleDateString('vi-VN') : '14 ngày'}`,
      '━━━━━━━━━━━━━━━━',
      '📋 HẠNG MỤC CÔNG VIỆC:',
      ...itemLines,
      '━━━━━━━━━━━━━━━━',
      `Tạm tính: ${formatCurrencyVND(quote.subtotal)}`,
      `Giảm giá: -${formatCurrencyVND(quote.discount)}`,
      `💎 TỔNG CỘNG: ${formatCurrencyVND(quote.totalAmount)}`,
      quote.adminNotes ? `\n📝 Ghi chú: ${quote.adminNotes}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const kb: TelegramInlineButton[][] = [
      [
        { text: '✉️ Gửi báo giá cho khách', callback_data: `quote:send:${quote.id}` },
        { text: '✅ Duyệt báo giá (APPROVED)', callback_data: `quote:approve:${quote.id}` },
      ],
    ];
    if (quote.bookingId) {
      kb.push([
        { text: '🔙 Quay lại đơn hàng', callback_data: `booking:panel:${quote.bookingId}` },
      ]);
    }

    await sendTelegramMessage(chatId, details, { inline_keyboard: kb });
    return true;
  }

  if (data.startsWith('quote:send:')) {
    const quoteId = data.replace('quote:send:', '');
    const quote = await prisma.quotation.findUnique({
      where: { id: quoteId },
      include: { customer: true, items: true },
    });

    if (!quote) {
      await answerCallbackQuery(callbackId, '⚠️ Không tìm thấy báo giá.', true);
      return true;
    }

    await answerCallbackQuery(callbackId, '✉️ Đang gửi báo giá cho khách hàng...');

    await prisma.quotation.update({
      where: { id: quote.id },
      data: { status: 'QUOTED' },
    });

    if (quote.bookingId) {
      await prisma.serviceBooking.update({
        where: { id: quote.bookingId },
        data: { status: 'QUOTATION_SENT' },
      });
      await syncBookingTelegramAdminMessage(quote.bookingId, admin.fullName);
    }

    if (quote.customer?.telegramUserId) {
      const itemSummary = quote.items
        .map((it, i) => `${i + 1}. ${it.title}: ${formatCurrencyVND(it.totalPrice)}`)
        .join('\n');

      await sendTelegramMessage(
        quote.customer.telegramUserId,
        [
          `💎 BÁO GIÁ CHÍNH THỨC TỪ NGUYÊN AGENCY – ${quote.code}`,
          '━━━━━━━━━━━━━━━━',
          `Kính gửi: ${quote.clientName}`,
          `Dịch vụ: ${quote.serviceName}`,
          '',
          '📋 Chi tiết hạng mục:',
          itemSummary,
          '',
          `Giảm giá ưu đãi: -${formatCurrencyVND(quote.discount)}`,
          `💰 TỔNG GIÁ TRỊ BÁO GIÁ: ${formatCurrencyVND(quote.totalAmount)}`,
          `📝 Ghi chú: ${quote.adminNotes || 'Theo tiêu chuẩn NGUYÊN AGENCY'}`,
          '━━━━━━━━━━━━━━━━',
          'Quý khách có thể phản hồi trực tiếp tại đây để xác nhận triển khai dự án!',
        ].join('\n')
      );
    }

    await prisma.activityLog.create({
      data: {
        actorType: 'ADMIN',
        actorName: admin.fullName,
        action: 'SEND_QUOTATION_TO_CUSTOMER',
        entity: 'Quotation',
        entityId: quote.id,
        details: `Admin xác nhận gửi báo giá ${quote.code} (${formatCurrencyVND(quote.totalAmount)}) cho khách hàng ${quote.clientName}`,
      },
    });

    await sendTelegramMessage(
      chatId,
      `✅ Đã chuyển báo giá ${quote.code} sang trạng thái SENT (QUOTED) và gửi thông báo cho khách hàng ${quote.clientName}!`
    );
    return true;
  }

  if (data.startsWith('quote:approve:')) {
    const quoteId = data.replace('quote:approve:', '');
    const quote = await prisma.quotation.update({
      where: { id: quoteId },
      data: { status: 'APPROVED' },
    });

    await answerCallbackQuery(callbackId, `Đã duyệt báo giá ${quote.code}`);
    await sendTelegramMessage(
      chatId,
      `✅ Báo giá ${quote.code} đã được đánh dấu APPROVED (Khách đồng ý). Bạn có thể chuyển đơn hàng thành Dự án ngay!`,
      quote.bookingId
        ? {
            inline_keyboard: [
              [
                {
                  text: '📁 Chuyển thành dự án ngay',
                  callback_data: `booking:project:${quote.bookingId}`,
                },
              ],
            ],
          }
        : undefined
    );
    return true;
  }

  // ---------------------------------------------------------------------------
  // 4. SECTION 5: CONVERT TO PROJECT (`booking:project:{booking_id}`)
  // ---------------------------------------------------------------------------
  if (data.startsWith('booking:project:')) {
    const bookingId = data.replace('booking:project:', '');
    const booking = await prisma.serviceBooking.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        quotations: { orderBy: { createdAt: 'desc' } },
        projects: true,
      },
    });

    // Check 1: Booking exists
    if (!booking) {
      await answerCallbackQuery(callbackId, '⚠️ Booking không tồn tại.', true);
      return true;
    }

    // Check 2: Customer exists
    if (!booking.customer) {
      await answerCallbackQuery(callbackId, '⚠️ Hồ sơ khách hàng không tồn tại.', true);
      return true;
    }

    // Check 3: Booking has not already been converted to a Project
    const existingProject =
      booking.projects[0] ||
      (await prisma.project.findFirst({ where: { bookingId: booking.id } }));

    if (existingProject) {
      await answerCallbackQuery(
        callbackId,
        `⚠️ Đơn hàng này đã được chuyển thành dự án ${existingProject.code} trước đó!`,
        true
      );
      await sendTelegramMessage(
        chatId,
        [
          'ℹ️ ĐƠN HÀNG ĐÃ CÓ DỰ ÁN LIÊN KẾT',
          `Đơn hàng ${booking.bookingCode.replace(/^#/, '')} đã được chuyển thành dự án ${existingProject.code} (${existingProject.name}).`,
          'Hệ thống chặn tạo trùng dự án theo quy tắc toàn vẹn dữ liệu.',
        ].join('\n'),
        {
          inline_keyboard: [
            [
              {
                text: `📂 Xem dự án ${existingProject.code}`,
                callback_data: `project:view:${existingProject.id}`,
              },
              {
                text: '🔙 Quay lại đơn hàng',
                callback_data: `booking:panel:${booking.id}`,
              },
            ],
          ],
        }
      );
      return true;
    }

    // Check 4: Booking status check (cannot convert CANCELLED booking)
    if (booking.status === 'CANCELLED') {
      await answerCallbackQuery(
        callbackId,
        '⚠️ Không thể chuyển đơn hàng đã HỦY (CANCELLED) thành dự án.',
        true
      );
      return true;
    }

    // Check 5: Quotation approved OR Admin has direct project creation permission
    const latestQuote = booking.quotations[0];
    const hasDirectPrivilege =
      admin.role === 'SUPER_ADMIN' || admin.role === 'ADMIN';

    if (!latestQuote && !hasDirectPrivilege) {
      await answerCallbackQuery(
        callbackId,
        '⚠️ Chưa có báo giá được duyệt. Vui lòng tạo báo giá trước.',
        true
      );
      return true;
    }

    await answerCallbackQuery(callbackId, '📁 Mở biểu mẫu khởi tạo Dự án...');

    const startDate = new Date();
    const deadlineDate = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000);
    const defaultBudget =
      latestQuote?.totalAmount || booking.budgetMin || 35000000;

    const draftData: AdminControlSessionData = {
      mode: 'ADMIN_PROJECT_WIZARD',
      bookingId: booking.id,
      bookingCode: booking.bookingCode,
      customerId: booking.customerId,
      customerName: booking.customer.name,
      serviceName: booking.serviceName,
      projectName: booking.projectTitle || `${booking.serviceName} - ${booking.customer.name}`,
      quotationId: latestQuote?.id,
      quotationCode: latestQuote?.code || 'Trực tiếp theo quyền Admin',
      startDateStr: startDate.toLocaleDateString('vi-VN'),
      deadlineStr: deadlineDate.toLocaleDateString('vi-VN'),
      projectBudget: defaultBudget,
      managerName: admin.fullName,
      projectDescription: booking.projectDescription,
      projectNotes: `Khởi tạo từ Booking ${booking.bookingCode.replace(/^#/, '')}`,
    };

    await saveAdminWizardStep({
      telegramUserId,
      telegramUsername,
      chatId,
      step: 'ADMIN_PROJECT_CONFIRM_FORM',
      state: 'ADMIN_PROJECT_WIZARD',
      data: draftData,
    });

    await sendProjectFormPreview(chatId, draftData);
    return true;
  }

  if (data === 'project:edit_name') {
    const convo = await prisma.telegramConversation.findUnique({
      where: { telegramUserId },
    });
    const session = parseSessionData(convo?.temporaryData);
    await saveAdminWizardStep({
      telegramUserId,
      telegramUsername,
      chatId,
      step: 'ADMIN_PROJECT_EDIT_NAME',
      state: 'ADMIN_PROJECT_WIZARD',
      data: session,
    });
    await answerCallbackQuery(callbackId);
    await sendTelegramMessage(chatId, '✏️ Vui lòng nhập Tên dự án mới:');
    return true;
  }

  if (data === 'project:edit_budget') {
    const convo = await prisma.telegramConversation.findUnique({
      where: { telegramUserId },
    });
    const session = parseSessionData(convo?.temporaryData);
    await saveAdminWizardStep({
      telegramUserId,
      telegramUsername,
      chatId,
      step: 'ADMIN_PROJECT_EDIT_BUDGET',
      state: 'ADMIN_PROJECT_WIZARD',
      data: session,
    });
    await answerCallbackQuery(callbackId);
    await sendTelegramMessage(
      chatId,
      '💰 Vui lòng nhập Giá trị dự án (VNĐ, ví dụ: 45000000 hoặc 45tr):'
    );
    return true;
  }

  if (data.startsWith('project:confirm_create:')) {
    const bookingId = data.replace('project:confirm_create:', '');
    const convo = await prisma.telegramConversation.findUnique({
      where: { telegramUserId },
    });
    const session = parseSessionData(convo?.temporaryData);

    await answerCallbackQuery(callbackId, '📁 Đang khởi tạo Dự án...');

    try {
      const createdProject = await prisma.$transaction(async (tx) => {
        const booking = await tx.serviceBooking.findUnique({
          where: { id: bookingId },
          include: { customer: true, quotations: { orderBy: { createdAt: 'desc' } } },
        });

        if (!booking) {
          throw new Error('BOOKING_NOT_FOUND');
        }

        // Strict duplicate check inside transaction
        const alreadyExists = await tx.project.findFirst({
          where: { bookingId: booking.id },
        });
        if (alreadyExists) {
          throw new Error(`ALREADY_CONVERTED:${alreadyExists.code}`);
        }

        const pCount = await tx.project.count();
        const projectCode = `PRJ-${new Date().getFullYear()}-${String(pCount + 1).padStart(4, '0')}`;
        const pName =
          session.projectName ||
          booking.projectTitle ||
          `Dự án ${booking.serviceName}`;

        const slugBase = pName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

        const latestQuote = booking.quotations[0];
        const budgetValue =
          session.projectBudget ||
          latestQuote?.totalAmount ||
          booking.budgetMin ||
          35000000;

        const proj = await tx.project.create({
          data: {
            code: projectCode,
            name: pName,
            slug: `${slugBase || 'project'}-${Date.now().toString().slice(-4)}`,
            customerId: booking.customerId,
            bookingId: booking.id,
            quotationId: session.quotationId || latestQuote?.id || null,
            category: booking.serviceName,
            description: session.projectDescription || booking.projectDescription,
            status: 'PENDING',
            priority: 'HIGH',
            progress: 0,
            budget: budgetValue,
            startDate: new Date(),
            deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
            managerName: session.managerName || admin.fullName,
            notes:
              session.projectNotes ||
              `Chuyển đổi từ Booking ${booking.bookingCode.replace(/^#/, '')}`,
            tasks: {
              create: [
                {
                  title: '01. Kick-off & Thu thập yêu cầu chuyên sâu (Discovery)',
                  status: 'IN_PROGRESS',
                  priority: 'HIGH',
                  assigneeName: session.managerName || admin.fullName,
                  order: 1,
                },
                {
                  title: '02. Thiết kế Kiến trúc & UI/UX Prototype',
                  status: 'PENDING',
                  priority: 'HIGH',
                  assigneeName: session.managerName || admin.fullName,
                  order: 2,
                },
                {
                  title: '03. Phát triển, Kiểm thử UAT & Bàn giao Go-Live',
                  status: 'PENDING',
                  priority: 'MEDIUM',
                  assigneeName: session.managerName || admin.fullName,
                  order: 3,
                },
              ],
            },
          },
        });

        await tx.serviceBooking.update({
          where: { id: booking.id },
          data: {
            status: 'IN_PROGRESS',
            assignedTo: session.managerName || admin.fullName,
          },
        });

        await tx.activityLog.create({
          data: {
            actorType: 'ADMIN',
            actorName: admin.fullName,
            action: 'CONVERT_BOOKING_TO_PROJECT_TELEGRAM',
            entity: 'Project',
            entityId: proj.id,
            details: `Khởi tạo dự án ${proj.code} (${proj.name}) từ yêu cầu ${booking.bookingCode} trên Telegram`,
          },
        });

        return { proj, booking };
      });

      // Clear wizard state
      await saveAdminWizardStep({
        telegramUserId,
        telegramUsername,
        chatId,
        step: 'IDLE',
        state: 'IDLE',
        data: {},
      });

      void syncRecordToSupabase('projects', {
        id: createdProject.proj.id,
        project_code: createdProject.proj.code,
        customer_id: createdProject.proj.customerId,
        booking_id: createdProject.booking.id,
        quotation_id: createdProject.proj.quotationId,
        project_name: createdProject.proj.name,
        description: createdProject.proj.description,
        status: createdProject.proj.status,
      });

      await syncBookingTelegramAdminMessage(createdProject.booking.id, admin.fullName);

      await notifyCustomerBookingStatusChange({
        bookingCode: createdProject.booking.bookingCode,
        projectTitle: createdProject.proj.name,
        serviceName: createdProject.booking.serviceName,
        newStatus: 'IN_PROGRESS',
        telegramUserId: createdProject.booking.customer.telegramUserId,
        adminNote: `Dự án đã được khởi tạo chính thức với mã: ${createdProject.proj.code}`,
      });

      const projResultText = [
        '📁 DỰ ÁN ĐÃ ĐƯỢC TẠO',
        `Mã dự án: ${createdProject.proj.code}`,
        `Tên dự án: ${createdProject.proj.name}`,
        `Khách hàng: ${createdProject.booking.customer.name}`,
        `Trạng thái: ${createdProject.proj.status}`,
      ].join('\n');

      const projButtons: TelegramInlineButton[][] = [
        [
          {
            text: '📂 Xem dự án',
            callback_data: `project:view:${createdProject.proj.id}`,
          },
          {
            text: '📋 Quản lý công việc',
            callback_data: `project:tasks:${createdProject.proj.id}`,
          },
        ],
      ];

      const publicCrmUrl = getPublicCrmUrl('/admin/projects');
      if (publicCrmUrl) {
        projButtons.push([{ text: '🔗 Xem trong CRM', url: publicCrmUrl }]);
      }
      projButtons.push([
        {
          text: '🔙 Quay lại đơn hàng',
          callback_data: `booking:panel:${createdProject.booking.id}`,
        },
      ]);

      await sendTelegramMessage(chatId, projResultText, {
        inline_keyboard: projButtons,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'UNKNOWN';
      if (msg.startsWith('ALREADY_CONVERTED:')) {
        const code = msg.replace('ALREADY_CONVERTED:', '');
        await sendTelegramMessage(
          chatId,
          `⚠️ Đơn hàng đã được chuyển thành dự án ${code} trước đó. Hệ thống tự động chặn tạo trùng.`
        );
      } else {
        await sendTelegramMessage(chatId, `❌ Lỗi khi tạo dự án: ${msg}`);
      }
    }
    return true;
  }

  if (data.startsWith('project:view:')) {
    const projectId = data.replace('project:view:', '');
    const proj = await prisma.project.findUnique({
      where: { id: projectId },
      include: { customer: true, tasks: { orderBy: { order: 'asc' } } },
    });

    if (!proj) {
      await answerCallbackQuery(callbackId, '⚠️ Không tìm thấy dự án.', true);
      return true;
    }

    await answerCallbackQuery(callbackId, `Dự án ${proj.code}`);

    const lines = [
      `📂 THÔNG TIN DỰ ÁN: ${proj.code}`,
      '━━━━━━━━━━━━━━━━',
      `📌 Tên dự án: ${proj.name}`,
      `👤 Khách hàng: ${proj.customer.name} (${proj.customer.phone || ''})`,
      `🛠 Hạng mục: ${proj.category}`,
      `💰 Ngân sách: ${formatCurrencyVND(proj.budget)}`,
      `👮 Quản lý dự án (PM): ${proj.managerName}`,
      `📊 Trạng thái: ${proj.status} (Tiến độ: ${proj.progress}%)`,
      `📝 Mô tả: ${proj.description}`,
      '━━━━━━━━━━━━━━━━',
      `📋 Số lượng Task: ${proj.tasks.length} hạng mục`,
    ];

    const kb: TelegramInlineButton[][] = [
      [
        {
          text: '📋 Quản lý công việc (Tasks)',
          callback_data: `project:tasks:${proj.id}`,
        },
      ],
    ];
    if (proj.bookingId) {
      kb.push([
        {
          text: '🔙 Quay lại đơn hàng',
          callback_data: `booking:panel:${proj.bookingId}`,
        },
      ]);
    }

    await sendTelegramMessage(chatId, lines.join('\n'), { inline_keyboard: kb });
    return true;
  }

  if (data.startsWith('project:tasks:')) {
    const projectId = data.replace('project:tasks:', '');
    const proj = await prisma.project.findUnique({
      where: { id: projectId },
      include: { tasks: { orderBy: { order: 'asc' } } },
    });

    if (!proj) {
      await answerCallbackQuery(callbackId, '⚠️ Không tìm thấy dự án.', true);
      return true;
    }

    await answerCallbackQuery(callbackId, 'Danh sách công việc dự án');

    const lines = [
      `📋 DANH SÁCH CÔNG VIỆC – ${proj.code}`,
      `Dự án: ${proj.name}`,
      '━━━━━━━━━━━━━━━━',
      ...proj.tasks.map(
        (t, idx) =>
          `${idx + 1}. [${t.status}] ${t.title}\n   • Phụ trách: ${t.assigneeName || proj.managerName}`
      ),
    ];

    await sendTelegramMessage(chatId, lines.join('\n'), {
      inline_keyboard: [
        [
          {
            text: '📂 Quay lại chi tiết dự án',
            callback_data: `project:view:${proj.id}`,
          },
        ],
      ],
    });
    return true;
  }

  // ---------------------------------------------------------------------------
  // 5. SECTION 6: DIRECT STATUS UPDATE MENU (`booking:status:{booking_id}`)
  // ---------------------------------------------------------------------------
  if (data.startsWith('booking:status:')) {
    const bookingId = data.replace('booking:status:', '');
    const booking = await prisma.serviceBooking.findUnique({
      where: { id: bookingId },
      include: { customer: true },
    });

    if (!booking) {
      await answerCallbackQuery(callbackId, '⚠️ Không tìm thấy đơn hàng.', true);
      return true;
    }

    await answerCallbackQuery(callbackId, '🔄 Chọn trạng thái mới');

    const cleanCode = booking.bookingCode.replace(/^#/, '');
    const statusMenuText = [
      '🔄 CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG',
      `Mã yêu cầu: ${cleanCode} • KH: ${booking.customer.name}`,
      `Trạng thái hiện tại: ${booking.status}`,
      '━━━━━━━━━━━━━━━━',
      'Chọn trạng thái mới bên dưới (Hệ thống tự động kiểm tra quy tắc nghiệp vụ):',
    ].join('\n');

    await sendTelegramMessage(chatId, statusMenuText, {
      inline_keyboard: [
        [
          {
            text: '🔵 NEW – Mới tiếp nhận',
            callback_data: `booking:set_status:NEW:${booking.id}`,
          },
        ],
        [
          {
            text: '🟢 CONFIRMED – Đã xác nhận',
            callback_data: `booking:set_status:CONFIRMED:${booking.id}`,
          },
        ],
        [
          {
            text: '🟡 CONSULTING – Đang tư vấn',
            callback_data: `booking:set_status:CONSULTING:${booking.id}`,
          },
        ],
        [
          {
            text: '🟣 QUOTATION_SENT – Đã gửi báo giá',
            callback_data: `booking:set_status:QUOTATION_SENT:${booking.id}`,
          },
        ],
        [
          {
            text: '🚀 IN_PROGRESS – Đang thực hiện',
            callback_data: `booking:set_status:IN_PROGRESS:${booking.id}`,
          },
        ],
        [
          {
            text: '🏆 COMPLETED – Hoàn thành',
            callback_data: `booking:set_status:COMPLETED:${booking.id}`,
          },
        ],
        [
          {
            text: '🔴 CANCELLED – Đã hủy',
            callback_data: `booking:cancel:${booking.id}`,
          },
        ],
        [
          {
            text: '🔙 Quay lại đơn hàng',
            callback_data: `booking:panel:${booking.id}`,
          },
        ],
      ],
    });
    return true;
  }

  if (data.startsWith('booking:set_status:') || data.startsWith('adm_status:')) {
    const parts = data.split(':');
    const newStatus = data.startsWith('booking:set_status:') ? parts[2] : parts[1];
    const bookingId = data.startsWith('booking:set_status:') ? parts[3] : parts[2];

    const booking = await prisma.serviceBooking.findUnique({
      where: { id: bookingId },
      include: { customer: true },
    });

    if (!booking) {
      await answerCallbackQuery(callbackId, '⚠️ Không tìm thấy đơn hàng.', true);
      return true;
    }

    const check = validateBookingStatusTransition(
      booking.status,
      newStatus,
      admin.role
    );
    if (!check.valid) {
      await answerCallbackQuery(callbackId, `⚠️ ${check.reason}`, true);
      return true;
    }

    await answerCallbackQuery(callbackId, `Đang cập nhật sang ${newStatus}...`);

    const updated = await prisma.serviceBooking.update({
      where: { id: booking.id },
      data: {
        status: newStatus,
        assignedTo: booking.assignedTo || admin.fullName,
        ...(newStatus === 'CONFIRMED' && !booking.confirmedBy
          ? { confirmedBy: admin.fullName, confirmedAt: new Date() }
          : {}),
      },
    });

    await prisma.activityLog.create({
      data: {
        actorType: 'ADMIN',
        actorName: admin.fullName,
        action: 'UPDATE_BOOKING_STATUS_TELEGRAM',
        entity: 'ServiceBooking',
        entityId: booking.id,
        details: `Cập nhật trạng thái đơn ${booking.bookingCode} từ ${booking.status} sang ${newStatus}`,
        beforeData: JSON.stringify({ status: booking.status }),
        afterData: JSON.stringify({ status: updated.status }),
      },
    });

    void syncRecordToSupabase('service_bookings', {
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

    await notifyCustomerBookingStatusChange({
      bookingCode: booking.bookingCode,
      projectTitle: booking.projectTitle,
      serviceName: booking.serviceName,
      newStatus,
      telegramUserId: booking.customer.telegramUserId,
    });

    await syncBookingTelegramAdminMessage(booking.id, admin.fullName);

    await sendTelegramMessage(
      chatId,
      [
        '🔄 ĐÃ CẬP NHẬT TRẠNG THÁI',
        `• Booking: ${booking.bookingCode.replace(/^#/, '')}`,
        `• Khách hàng: ${booking.customer.name}`,
        `• Trạng thái: ${booking.status} ➡️ ${newStatus}`,
        `• Người thực hiện: ${admin.fullName}`,
        `• Thời gian: ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`,
      ].join('\n'),
      {
        inline_keyboard: [
          [
            {
              text: '🔙 Quay lại đơn hàng',
              callback_data: `booking:panel:${booking.id}`,
            },
          ],
        ],
      }
    );
    return true;
  }

  // ---------------------------------------------------------------------------
  // 6. CANCEL / REJECT BOOKING WITH MANDATORY CONFIRMATION (`booking:cancel:{booking_id}`)
  // ---------------------------------------------------------------------------
  if (data.startsWith('booking:cancel:')) {
    const bookingId = data.replace('booking:cancel:', '');
    const booking = await prisma.serviceBooking.findUnique({
      where: { id: bookingId },
      include: { customer: true },
    });

    if (!booking) {
      await answerCallbackQuery(callbackId, '⚠️ Không tìm thấy đơn hàng.', true);
      return true;
    }

    if (booking.status === 'CANCELLED') {
      await answerCallbackQuery(callbackId, '⚠️ Đơn hàng này đã ở trạng thái HỦY.', true);
      return true;
    }

    await answerCallbackQuery(callbackId, 'Xác nhận hủy đơn hàng');

    await sendTelegramMessage(
      chatId,
      [
        '⚠️ XÁC NHẬN TỪ CHỐI / HỦY YÊU CẦU',
        `Bạn có chắc chắn muốn hủy đơn hàng ${booking.bookingCode.replace(/^#/, '')} của khách hàng ${booking.customer.name} không?`,
        'Thao tác này sẽ thông báo trạng thái hủy và ghi nhận vào nhật ký kiểm toán (Audit Log).',
      ].join('\n'),
      {
        inline_keyboard: [
          [
            {
              text: '🔴 Xác nhận Hủy đơn này',
              callback_data: `booking:confirm_cancel:${booking.id}`,
            },
            {
              text: '🔙 Không, quay lại',
              callback_data: `booking:panel:${booking.id}`,
            },
          ],
        ],
      }
    );
    return true;
  }

  if (data.startsWith('booking:confirm_cancel:')) {
    const bookingId = data.replace('booking:confirm_cancel:', '');
    const booking = await prisma.serviceBooking.findUnique({
      where: { id: bookingId },
      include: { customer: true },
    });

    if (!booking) {
      await answerCallbackQuery(callbackId, '⚠️ Không tìm thấy đơn hàng.', true);
      return true;
    }

    const check = validateBookingStatusTransition(
      booking.status,
      'CANCELLED',
      admin.role
    );
    if (!check.valid) {
      await answerCallbackQuery(callbackId, `⚠️ ${check.reason}`, true);
      return true;
    }

    await answerCallbackQuery(callbackId, 'Đã hủy yêu cầu đặt dịch vụ.');

    await prisma.serviceBooking.update({
      where: { id: booking.id },
      data: { status: 'CANCELLED' },
    });

    await prisma.activityLog.create({
      data: {
        actorType: 'ADMIN',
        actorName: admin.fullName,
        action: 'CANCEL_BOOKING_TELEGRAM',
        entity: 'ServiceBooking',
        entityId: booking.id,
        details: `Admin ${admin.fullName} từ chối/hủy đơn ${booking.bookingCode}`,
        beforeData: JSON.stringify({ status: booking.status }),
        afterData: JSON.stringify({ status: 'CANCELLED' }),
      },
    });

    void syncRecordToSupabase('service_bookings', {
      id: booking.id,
      booking_code: booking.bookingCode,
      customer_id: booking.customerId,
      project_title: booking.projectTitle,
      project_description: booking.projectDescription,
      status: 'CANCELLED',
    });

    await notifyCustomerBookingStatusChange({
      bookingCode: booking.bookingCode,
      projectTitle: booking.projectTitle,
      serviceName: booking.serviceName,
      newStatus: 'CANCELLED',
      telegramUserId: booking.customer.telegramUserId,
    });

    await syncBookingTelegramAdminMessage(booking.id, admin.fullName);

    await sendTelegramMessage(
      chatId,
      `🔴 ĐÃ HỦY YÊU CẦU ${booking.bookingCode.replace(/^#/, '')}\nNgười thực hiện: ${admin.fullName}`
    );
    return true;
  }

  // ---------------------------------------------------------------------------
  // 7. SECTION 7: VIEW 360° CUSTOMER & BOOKING DETAIL (`booking:detail:{booking_id}`)
  // ---------------------------------------------------------------------------
  if (data.startsWith('booking:detail:')) {
    const bookingId = data.replace('booking:detail:', '');
    const booking = await prisma.serviceBooking.findUnique({
      where: { id: bookingId },
      include: {
        customer: {
          include: {
            bookings: { orderBy: { createdAt: 'desc' }, take: 5 },
            leads: { orderBy: { createdAt: 'desc' }, take: 5 },
            quotations: { orderBy: { createdAt: 'desc' }, take: 5 },
            projects: { orderBy: { createdAt: 'desc' }, take: 5 },
          },
        },
      },
    });

    if (!booking || !booking.customer) {
      await answerCallbackQuery(callbackId, '⚠️ Không tìm thấy hồ sơ.', true);
      return true;
    }

    await answerCallbackQuery(callbackId, '👁 Hồ sơ chi tiết 360°');

    const c = booking.customer;
    let contactLogs: Array<{ date?: string; outcome?: string; actor?: string }> = [];
    try {
      contactLogs = JSON.parse(c.contactHistoryJson || '[]');
    } catch {
      contactLogs = [];
    }

    const bookingHistoryStr =
      c.bookings.length > 0
        ? c.bookings
            .map((b) => `  • ${b.bookingCode.replace(/^#/, '')}: ${b.serviceName} [${b.status}]`)
            .join('\n')
        : '  • Chưa có';

    const leadHistoryStr =
      c.leads.length > 0
        ? c.leads
            .map((l) => `  • ${l.code}: ${l.serviceInterest || 'Tư vấn'} [${l.stage}]`)
            .join('\n')
        : '  • Chưa có';

    const quoteHistoryStr =
      c.quotations.length > 0
        ? c.quotations
            .map((q) => `  • ${q.code}: ${formatCurrencyVND(q.totalAmount)} [${q.status}]`)
            .join('\n')
        : '  • Chưa có';

    const projectHistoryStr =
      c.projects.length > 0
        ? c.projects
            .map((p) => `  • ${p.code}: ${p.name} [${p.status} - ${p.progress}%]`)
            .join('\n')
        : '  • Chưa có';

    const callLogStr =
      contactLogs.length > 0
        ? contactLogs
            .slice(0, 3)
            .map(
              (log) =>
                `  • ${log.outcome || 'Liên hệ'} (${log.actor || 'Admin'})`
            )
            .join('\n')
        : '  • Chưa có lịch sử gọi';

    const detailMsg = [
      '👁 HỒ SƠ CHI TIẾT KHÁCH HÀNG & YÊU CẦU',
      '━━━━━━━━━━━━━━━━',
      `👤 Họ tên: ${c.name} (${c.code})`,
      `📞 Số điện thoại: ${c.phone || 'Chưa cung cấp'}`,
      `✉️ Email: ${c.email.endsWith('@telegram.nguyenagency.vn') ? 'Chưa cung cấp' : c.email}`,
      `🏢 Công ty: ${c.company || 'Cá nhân'}`,
      `📌 Nguồn khách hàng: ${c.source}`,
      `👮 Người phụ trách: ${booking.assignedTo || booking.confirmedBy || 'Chưa phân công'}`,
      '━━━━━━━━━━━━━━━━',
      `🛠 Dịch vụ quan tâm: ${booking.serviceName}`,
      `💰 Ngân sách: ${booking.budgetRange || 'Thỏa thuận'}`,
      `📝 Nội dung yêu cầu:\n${booking.projectDescription}`,
      '━━━━━━━━━━━━━━━━',
      `📚 Booking History (${c.bookings.length}):\n${bookingHistoryStr}`,
      `🎯 Lead History (${c.leads.length}):\n${leadHistoryStr}`,
      `💎 Quotation History (${c.quotations.length}):\n${quoteHistoryStr}`,
      `📁 Project History (${c.projects.length}):\n${projectHistoryStr}`,
      `📞 Lịch sử trao đổi:\n${callLogStr}`,
    ].join('\n');

    const detailButtons: TelegramInlineButton[][] = [
      [
        { text: '📞 Gọi khách hàng', callback_data: `booking:call:${booking.id}` },
        ...(c.phone
          ? [{ text: '📋 Sao chép SĐT', copy_text: { text: c.phone } }]
          : []),
      ],
      [
        { text: '💰 Tạo báo giá', callback_data: `booking:quotation:${booking.id}` },
        { text: '📁 Tạo dự án', callback_data: `booking:project:${booking.id}` },
      ],
      [
        { text: '🔄 Cập nhật trạng thái', callback_data: `booking:status:${booking.id}` },
        { text: '🔙 Quay lại đơn hàng', callback_data: `booking:panel:${booking.id}` },
      ],
    ];

    const crmUrl = getPublicCrmUrl('/admin/customers');
    if (crmUrl) {
      detailButtons.push([{ text: '🔗 Mở CRM', url: crmUrl }]);
    }

    await sendTelegramMessage(chatId, detailMsg, {
      inline_keyboard: detailButtons,
    });
    return true;
  }

  return false;
}

/**
 * Processes text inputs when an Admin is actively inside the 10-Step Quotation Wizard
 * or Project Creation Wizard in `TelegramConversation`.
 */
export async function handleTelegramAdminWizardText(params: {
  text: string;
  chatId: string;
  telegramUserId: string;
  telegramUsername?: string;
}): Promise<boolean> {
  const { text, chatId, telegramUserId, telegramUsername } = params;

  const convo = await prisma.telegramConversation.findUnique({
    where: { telegramUserId },
  });

  if (
    !convo ||
    (convo.conversationState !== 'ADMIN_QUOTE_WIZARD' &&
      convo.conversationState !== 'ADMIN_PROJECT_WIZARD')
  ) {
    return false;
  }

  const session = parseSessionData(convo.temporaryData);

  // Quotation Wizard Steps 2 -> 9
  if (convo.currentStep === 'ADMIN_QUOTE_STEP_2_ITEM_NAME') {
    session.currentItemTitle = text;
    await saveAdminWizardStep({
      telegramUserId,
      telegramUsername,
      chatId,
      step: 'ADMIN_QUOTE_STEP_3_ITEM_DESC',
      state: 'ADMIN_QUOTE_WIZARD',
      data: session,
    });

    await sendTelegramMessage(
      chatId,
      [
        `✅ Hạng mục: ${text}`,
        '',
        '📌 BƯỚC 3/10 — Nhập Mô tả chi tiết công việc cho hạng mục này:',
        '(Ví dụ: Thiết kế Figma độc quyền, hiệu ứng WebGL/GSAP, chuẩn SEO)',
      ].join('\n')
    );
    return true;
  }

  if (convo.currentStep === 'ADMIN_QUOTE_STEP_3_ITEM_DESC') {
    session.currentItemDesc = text;
    await saveAdminWizardStep({
      telegramUserId,
      telegramUsername,
      chatId,
      step: 'ADMIN_QUOTE_STEP_4_QTY',
      state: 'ADMIN_QUOTE_WIZARD',
      data: session,
    });

    await sendTelegramMessage(
      chatId,
      '📌 BƯỚC 4/10 — Nhập Số lượng (Số nguyên dương, ví dụ: 1):'
    );
    return true;
  }

  if (convo.currentStep === 'ADMIN_QUOTE_STEP_4_QTY') {
    const qty = parseInt(text, 10);
    if (isNaN(qty) || qty <= 0) {
      await sendTelegramMessage(
        chatId,
        '⚠️ Số lượng không hợp lệ. Vui lòng nhập số nguyên lớn hơn 0 (VD: 1):'
      );
      return true;
    }

    session.currentItemQty = qty;
    await saveAdminWizardStep({
      telegramUserId,
      telegramUsername,
      chatId,
      step: 'ADMIN_QUOTE_STEP_5_PRICE',
      state: 'ADMIN_QUOTE_WIZARD',
      data: session,
    });

    await sendTelegramMessage(
      chatId,
      '📌 BƯỚC 5/10 — Nhập Đơn giá (VNĐ, ví dụ: 25000000 hoặc 25tr):'
    );
    return true;
  }

  if (convo.currentStep === 'ADMIN_QUOTE_STEP_5_PRICE') {
    const unitPrice = parseAmountInput(text);
    if (isNaN(unitPrice) || unitPrice < 0) {
      await sendTelegramMessage(
        chatId,
        '⚠️ Đơn giá không hợp lệ. Vui lòng nhập số tiền (VD: 25000000 hoặc 25tr):'
      );
      return true;
    }

    const qty = session.currentItemQty || 1;
    const totalPrice = qty * unitPrice;
    const items = session.items || [];
    items.push({
      title: session.currentItemTitle || 'Hạng mục dịch vụ',
      description: session.currentItemDesc || '',
      quantity: qty,
      unitPrice,
      totalPrice,
    });
    session.items = items;

    await saveAdminWizardStep({
      telegramUserId,
      telegramUsername,
      chatId,
      step: 'ADMIN_QUOTE_STEP_6_MORE',
      state: 'ADMIN_QUOTE_WIZARD',
      data: session,
    });

    const currentSubtotal = items.reduce((s, i) => s + i.totalPrice, 0);

    await sendTelegramMessage(
      chatId,
      [
        `✅ Đã thêm hạng mục #${items.length}: ${session.currentItemTitle}`,
        `• Thành tiền: ${qty} × ${formatCurrencyVND(unitPrice)} = ${formatCurrencyVND(totalPrice)}`,
        `• Tổng tạm tính (${items.length} hạng mục): ${formatCurrencyVND(currentSubtotal)}`,
        '',
        '📌 BƯỚC 6/10 — Bạn có muốn thêm hạng mục công việc khác không?',
      ].join('\n'),
      {
        inline_keyboard: [
          [
            {
              text: '➕ Thêm hạng mục tiếp theo',
              callback_data: 'quote:add_more_item',
            },
          ],
          [
            {
              text: '➡️ Tiếp tục sang Bước 7 (Giảm giá)',
              callback_data: 'quote:goto_step7_discount',
            },
          ],
        ],
      }
    );
    return true;
  }

  if (convo.currentStep === 'ADMIN_QUOTE_STEP_7_DISCOUNT') {
    const disc = parseAmountInput(text);
    if (isNaN(disc) || disc < 0) {
      await sendTelegramMessage(
        chatId,
        '⚠️ Mức giảm giá không hợp lệ. Vui lòng nhập số (VD: 0 hoặc 2000000):'
      );
      return true;
    }
    session.discount = disc;

    await saveAdminWizardStep({
      telegramUserId,
      telegramUsername,
      chatId,
      step: 'ADMIN_QUOTE_STEP_8_VALIDITY',
      state: 'ADMIN_QUOTE_WIZARD',
      data: session,
    });

    await sendTelegramMessage(
      chatId,
      '📌 BƯỚC 8/10 — Chọn hoặc nhập Thời hạn hiệu lực của báo giá (số ngày):',
      {
        inline_keyboard: [
          [
            { text: '7 ngày', callback_data: 'quote:validity:7' },
            { text: '14 ngày', callback_data: 'quote:validity:14' },
            { text: '30 ngày', callback_data: 'quote:validity:30' },
          ],
        ],
      }
    );
    return true;
  }

  if (convo.currentStep === 'ADMIN_QUOTE_STEP_8_VALIDITY') {
    const days = parseInt(text, 10) || 14;
    session.validDays = Math.max(1, days);

    await saveAdminWizardStep({
      telegramUserId,
      telegramUsername,
      chatId,
      step: 'ADMIN_QUOTE_STEP_9_NOTES',
      state: 'ADMIN_QUOTE_WIZARD',
      data: session,
    });

    await sendTelegramMessage(
      chatId,
      '📌 BƯỚC 9/10 — Nhập Ghi chú & điều khoản báo giá:',
      {
        inline_keyboard: [
          [
            {
              text: '⚡ Dùng điều khoản 50% - 50% tiêu chuẩn',
              callback_data: 'quote:notes:DEFAULT',
            },
          ],
        ],
      }
    );
    return true;
  }

  if (convo.currentStep === 'ADMIN_QUOTE_STEP_9_NOTES') {
    session.adminNotes = text;

    await saveAdminWizardStep({
      telegramUserId,
      telegramUsername,
      chatId,
      step: 'ADMIN_QUOTE_STEP_10_CONFIRM',
      state: 'ADMIN_QUOTE_WIZARD',
      data: session,
    });

    await sendQuoteStep10Summary(chatId, session);
    return true;
  }

  // Project Wizard Custom Edits
  if (convo.currentStep === 'ADMIN_PROJECT_EDIT_NAME') {
    session.projectName = text;
    await saveAdminWizardStep({
      telegramUserId,
      telegramUsername,
      chatId,
      step: 'ADMIN_PROJECT_CONFIRM_FORM',
      state: 'ADMIN_PROJECT_WIZARD',
      data: session,
    });
    await sendProjectFormPreview(chatId, session);
    return true;
  }

  if (convo.currentStep === 'ADMIN_PROJECT_EDIT_BUDGET') {
    const amount = parseAmountInput(text);
    if (!isNaN(amount) && amount >= 0) {
      session.projectBudget = amount;
    }
    await saveAdminWizardStep({
      telegramUserId,
      telegramUsername,
      chatId,
      step: 'ADMIN_PROJECT_CONFIRM_FORM',
      state: 'ADMIN_PROJECT_WIZARD',
      data: session,
    });
    await sendProjectFormPreview(chatId, session);
    return true;
  }

  return false;
}

async function sendQuoteStep10Summary(chatId: string, session: AdminControlSessionData) {
  const items = session.items || [];
  const subtotal = items.reduce((sum, i) => sum + i.totalPrice, 0);
  const discount = Math.min(subtotal, session.discount || 0);
  const finalTotal = Math.max(0, subtotal - discount);

  const itemLines = items.map(
    (it, idx) =>
      `${idx + 1}. ${it.title}\n   • ${it.quantity} × ${formatCurrencyVND(it.unitPrice)} = ${formatCurrencyVND(it.totalPrice)}`
  );

  const summary = [
    '📋 BƯỚC 10/10 — BẢNG TỔNG KẾT & XÁC NHẬN LẬP BÁO GIÁ',
    '━━━━━━━━━━━━━━━━',
    `👤 Khách hàng: ${session.customerName}`,
    `🆔 Mã yêu cầu: ${(session.bookingCode || '').replace(/^#/, '')}`,
    `🛠 Dịch vụ: ${session.serviceName}`,
    '━━━━━━━━━━━━━━━━',
    'HẠNG MỤC BÁO GIÁ:',
    ...itemLines,
    '━━━━━━━━━━━━━━━━',
    `• Tổng các hạng mục: ${formatCurrencyVND(subtotal)}`,
    `• Giảm giá: -${formatCurrencyVND(discount)}`,
    `💎 TỔNG BÁO GIÁ: ${formatCurrencyVND(finalTotal)}`,
    `⏳ Thời hạn hiệu lực: ${session.validDays || 14} ngày`,
    `📝 Ghi chú: ${session.adminNotes || 'Không có'}`,
    '━━━━━━━━━━━━━━━━',
    'Vui lòng xác nhận để lưu Báo giá (Trạng thái DRAFT) vào Supabase & CRM:',
  ].join('\n');

  await sendTelegramMessage(chatId, summary, {
    inline_keyboard: [
      [
        {
          text: '✅ Xác nhận tạo báo giá (DRAFT)',
          callback_data: 'quote:confirm_create',
        },
      ],
      [
        {
          text: '➕ Thêm hạng mục',
          callback_data: 'quote:add_more_item',
        },
        {
          text: '❌ Hủy bỏ',
          callback_data: `booking:panel:${session.bookingId}`,
        },
      ],
    ],
  });
}

async function sendProjectFormPreview(chatId: string, session: AdminControlSessionData) {
  const formText = [
    '📁 BIỂU MẪU KHỞI TẠO DỰ ÁN MỚI',
    '━━━━━━━━━━━━━━━━',
    `📌 Tên dự án: ${session.projectName}`,
    `👤 Khách hàng: ${session.customerName}`,
    `🛠 Dịch vụ: ${session.serviceName}`,
    `💰 Mã báo giá liên quan: ${session.quotationCode}`,
    `📅 Ngày bắt đầu: ${session.startDateStr}`,
    `🏁 Ngày dự kiến hoàn thành: ${session.deadlineStr}`,
    `💎 Giá trị dự án: ${formatCurrencyVND(session.projectBudget || 0)}`,
    `👮 Người phụ trách: ${session.managerName}`,
    `📝 Mô tả: ${session.projectDescription}`,
    `🗒 Ghi chú: ${session.projectNotes}`,
    '━━━━━━━━━━━━━━━━',
    'Vui lòng kiểm tra và bấm "✅ Xác nhận tạo Dự án" bên dưới:',
  ].join('\n');

  await sendTelegramMessage(chatId, formText, {
    inline_keyboard: [
      [
        {
          text: '✅ Xác nhận tạo Dự án',
          callback_data: `project:confirm_create:${session.bookingId}`,
        },
      ],
      [
        { text: '✏️ Đổi tên dự án', callback_data: 'project:edit_name' },
        { text: '💰 Đổi giá trị dự án', callback_data: 'project:edit_budget' },
      ],
      [
        {
          text: '🔙 Quay lại đơn hàng',
          callback_data: `booking:panel:${session.bookingId}`,
        },
      ],
    ],
  });
}

