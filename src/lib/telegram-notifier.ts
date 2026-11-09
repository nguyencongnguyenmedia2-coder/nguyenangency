import { prisma } from './prisma';

export interface TelegramInlineButton {
  text: string;
  url?: string;
  callback_data?: string;
  copy_text?: { text: string };
}

export interface TelegramReplyMarkup {
  inline_keyboard: TelegramInlineButton[][];
}

function getBotToken(): string | null {
  return process.env.TELEGRAM_BOT_TOKEN || null;
}

function getAdminChatId(): string | null {
  return process.env.TELEGRAM_ADMIN_CHAT_ID || null;
}

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
}

/**
 * Low-level Telegram Bot API caller with timeout and structured error reporting.
 */
export async function callTelegramApi<T = unknown>(
  method: string,
  body: Record<string, unknown>
): Promise<{ ok: boolean; result?: T; description?: string; errorCode?: number }> {
  const token = getBotToken();
  if (!token) {
    return {
      ok: false,
      description: 'Thiếu biến môi trường TELEGRAM_BOT_TOKEN',
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const json = (await response.json()) as {
      ok: boolean;
      result?: T;
      description?: string;
      error_code?: number;
    };

    if (!json.ok) {
      return {
        ok: false,
        description: json.description || `HTTP ${response.status}`,
        errorCode: json.error_code || response.status,
      };
    }

    return {
      ok: true,
      result: json.result,
    };
  } catch (err) {
    return {
      ok: false,
      description: err instanceof Error ? err.message : 'Telegram network error',
    };
  }
}

export async function sendTelegramMessage(
  chatId: string | number,
  text: string,
  replyMarkup?: TelegramReplyMarkup,
  parseMode?: 'HTML' | 'Markdown'
): Promise<{ ok: boolean; messageId?: number; description?: string }> {
  const payload: Record<string, unknown> = {
    chat_id: chatId,
    text,
  };
  if (replyMarkup) {
    payload.reply_markup = replyMarkup;
  }
  if (parseMode) {
    payload.parse_mode = parseMode;
  }
  const res = await callTelegramApi<{ message_id: number }>('sendMessage', payload);
  return {
    ok: res.ok,
    messageId: res.result?.message_id,
    description: res.description,
  };
}

export async function editTelegramMessage(
  chatId: string | number,
  messageId: number,
  text: string,
  replyMarkup?: TelegramReplyMarkup,
  parseMode?: 'HTML' | 'Markdown'
): Promise<{ ok: boolean; description?: string }> {
  const payload: Record<string, unknown> = {
    chat_id: chatId,
    message_id: messageId,
    text,
  };
  if (replyMarkup) {
    payload.reply_markup = replyMarkup;
  }
  if (parseMode) {
    payload.parse_mode = parseMode;
  }
  const res = await callTelegramApi('editMessageText', payload);
  return { ok: res.ok, description: res.description };
}

export async function answerCallbackQuery(
  callbackQueryId: string,
  text?: string,
  showAlert = false
): Promise<void> {
  await callTelegramApi('answerCallbackQuery', {
    callback_query_id: callbackQueryId,
    text,
    show_alert: showAlert,
  });
}

export interface AdminNotificationPayload {
  bookingId: string;
  bookingCode: string;
  customerId: string;
  fullName: string;
  phone: string;
  email: string;
  companyName: string;
  telegramUsername?: string;
  telegramUserId?: string;
  source: string;
  pageSource?: string;
  serviceName: string;
  projectTitle: string;
  budgetRange: string;
  preferredStartDate?: string;
  preferredContactTime?: string;
  description: string;
  status?: string;
  actorName?: string;
  updatedAt?: Date;
  createdAt?: Date;
}

const STATUS_BADGE_MAP: Record<string, string> = {
  NEW: '🔵 MỚI TIẾP NHẬN',
  CONFIRMED: '🟢 ĐÃ XÁC NHẬN',
  CONSULTING: '🟡 ĐANG TƯ VẤN',
  QUOTATION_SENT: '🟣 ĐÃ GỬI BÁO GIÁ',
  IN_PROGRESS: '🚀 ĐANG THỰC HIỆN',
  COMPLETED: '🏆 HOÀN THÀNH',
  CANCELLED: '🔴 ĐÃ HỦY',
};

/**
 * Builds the exact Telegram Admin Control Center notification message (Section 1 & Section 12).
 */
export function buildBookingAdminMessageText(payload: AdminNotificationPayload): string {
  const timeFormatted = (payload.createdAt || new Date()).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
  });

  const cleanCode = payload.bookingCode.replace(/^#/, '');
  const lines = [
    '🔔 KHÁCH HÀNG ĐẶT DỊCH VỤ MỚI',
    'NGUYÊN AGENCY',
    '━━━━━━━━━━━━━━━━',
    '👤 KHÁCH HÀNG',
    `Họ tên: ${payload.fullName}`,
    `Điện thoại: ${payload.phone}`,
    `Email: ${payload.email}`,
    '',
    '🛠 DỊCH VỤ',
    `Dịch vụ: ${payload.serviceName}`,
    `Ngân sách: ${payload.budgetRange}`,
    `Thời gian mong muốn: ${payload.preferredStartDate || 'Linh hoạt'}`,
    '',
    '📝 YÊU CẦU',
    payload.description,
    '',
    `📌 NGUỒN: ${payload.source}`,
    `🆔 MÃ YÊU CẦU: ${cleanCode}`,
    `⏱ Thời gian tiếp nhận: ${timeFormatted}`,
    '━━━━━━━━━━━━━━━━',
  ];

  if (payload.status && payload.status !== 'NEW') {
    const badge = STATUS_BADGE_MAP[payload.status] || payload.status;
    const updateTime = (payload.updatedAt || new Date()).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Ho_Chi_Minh',
    });
    lines.push(
      badge,
      `Booking: ${cleanCode}`,
      `Người xử lý: ${payload.actorName || 'Admin'}`,
      `Thời gian: ${updateTime}`
    );
  }

  return lines.join('\n');
}

/**
 * Builds the 4-row Inline Keyboard for the Telegram Admin Control Center (Section 1, 10, 12, 14).
 * Dynamically adjusts buttons based on current status to prevent duplicate confirmations or invalid actions.
 */
export function buildBookingAdminInlineKeyboard(
  bookingId: string,
  currentStatus = 'NEW',
  hasProject = false
): TelegramReplyMarkup {
  const rows: TelegramInlineButton[][] = [];

  // Hàng 1: ✅ Xác nhận đơn | 📞 Gọi khách hàng
  const row1: TelegramInlineButton[] = [];
  if (currentStatus === 'NEW') {
    row1.push({
      text: '✅ Xác nhận đơn',
      callback_data: `booking:confirm:${bookingId}`,
    });
  }
  row1.push({
    text: '📞 Gọi khách hàng',
    callback_data: `booking:call:${bookingId}`,
  });
  rows.push(row1);

  // Hàng 2: 💰 Tạo báo giá | 📁 Chuyển thành dự án
  const row2: TelegramInlineButton[] = [];
  if (currentStatus !== 'CANCELLED' && currentStatus !== 'COMPLETED') {
    row2.push({
      text: '💰 Tạo báo giá',
      callback_data: `booking:quotation:${bookingId}`,
    });
    if (!hasProject) {
      row2.push({
        text: '📁 Chuyển thành dự án',
        callback_data: `booking:project:${bookingId}`,
      });
    }
  }
  if (row2.length > 0) {
    rows.push(row2);
  }

  // Hàng 3: 👁 Xem chi tiết | 🔄 Cập nhật trạng thái
  const row3: TelegramInlineButton[] = [
    {
      text: '👁 Xem chi tiết',
      callback_data: `booking:detail:${bookingId}`,
    },
  ];
  if (currentStatus !== 'COMPLETED') {
    row3.push({
      text: '🔄 Cập nhật trạng thái',
      callback_data: `booking:status:${bookingId}`,
    });
  }
  rows.push(row3);

  // Hàng 4: ❌ Từ chối / Hủy yêu cầu
  if (currentStatus !== 'CANCELLED' && currentStatus !== 'COMPLETED') {
    rows.push([
      {
        text: '❌ Từ chối / Hủy yêu cầu',
        callback_data: `booking:cancel:${bookingId}`,
      },
    ]);
  }

  return { inline_keyboard: rows };
}

/**
 * Formats and sends the mandatory Admin Notification to TELEGRAM_ADMIN_CHAT_ID (Section 1)
 * and stores `telegramMessageId` on `ServiceBooking` so it can be edited in-place later.
 */
export async function sendTelegramAdminNotification(
  payload: AdminNotificationPayload
): Promise<{ sent: boolean; notificationId: string; messageId?: number; error?: string }> {
  const adminChatId = getAdminChatId();
  const messageText = buildBookingAdminMessageText(payload);
  const replyMarkup = buildBookingAdminInlineKeyboard(payload.bookingId, payload.status || 'NEW');

  if (!adminChatId) {
    const failedNotif = await prisma.notification.create({
      data: {
        targetRole: 'ADMIN',
        title: `Telegram Alert [${payload.bookingCode}]`,
        message: messageText,
        type: 'WARNING',
        channel: 'TELEGRAM',
        customerId: payload.customerId,
        bookingId: payload.bookingId,
        link: `/admin/bookings?code=${encodeURIComponent(payload.bookingCode)}`,
        deliveryStatus: 'FAILED',
        errorLog: 'Thiếu cấu hình TELEGRAM_ADMIN_CHAT_ID',
      },
    });
    return {
      sent: false,
      notificationId: failedNotif.id,
      error: 'Thiếu cấu hình TELEGRAM_ADMIN_CHAT_ID',
    };
  }

  const sendRes = await sendTelegramMessage(adminChatId, messageText, replyMarkup);

  if (sendRes.ok && sendRes.messageId) {
    await prisma.serviceBooking
      .update({
        where: { id: payload.bookingId },
        data: {
          telegramChatId: String(adminChatId),
          telegramMessageId: sendRes.messageId,
        },
      })
      .catch(() => null);
  }

  const notif = await prisma.notification.create({
    data: {
      targetRole: 'ADMIN',
      title: `Telegram Alert [${payload.bookingCode}]`,
      message: messageText,
      type: sendRes.ok ? 'SUCCESS' : 'ALERT',
      channel: 'TELEGRAM',
      customerId: payload.customerId,
      bookingId: payload.bookingId,
      link: `/admin/bookings?code=${encodeURIComponent(payload.bookingCode)}`,
      deliveryStatus: sendRes.ok ? 'SENT' : 'FAILED',
      errorLog: sendRes.ok ? null : sendRes.description || 'Gửi Telegram thất bại',
    },
  });

  return {
    sent: sendRes.ok,
    notificationId: notif.id,
    messageId: sendRes.messageId,
    error: sendRes.description,
  };
}

/**
 * Updates the original Telegram Admin notification message in-place when booking state changes (Section 12),
 * falling back to sending a single linked update if the original message cannot be edited.
 */
export async function syncBookingTelegramAdminMessage(
  bookingId: string,
  actorName: string
): Promise<void> {
  const booking = await prisma.serviceBooking.findUnique({
    where: { id: bookingId },
    include: {
      customer: true,
      projects: { select: { id: true } },
    },
  });

  if (!booking) return;

  const adminChatId = booking.telegramChatId || getAdminChatId();
  if (!adminChatId) return;

  const hasProject = booking.projects.length > 0;
  const text = buildBookingAdminMessageText({
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
    actorName,
    createdAt: booking.createdAt,
    updatedAt: new Date(),
  });

  const keyboard = buildBookingAdminInlineKeyboard(booking.id, booking.status, hasProject);

  if (booking.telegramMessageId) {
    const editRes = await editTelegramMessage(
      adminChatId,
      booking.telegramMessageId,
      text,
      keyboard
    );
    if (editRes.ok) {
      return;
    }
  }

  // Fallback if original message could not be edited
  const sent = await sendTelegramMessage(adminChatId, text, keyboard);
  if (sent.ok && sent.messageId) {
    await prisma.serviceBooking
      .update({
        where: { id: booking.id },
        data: {
          telegramChatId: String(adminChatId),
          telegramMessageId: sent.messageId,
        },
      })
      .catch(() => null);
  }
}

/**
 * Retries a previously failed Telegram notification stored in `Notification`.
 */
export async function retryTelegramNotification(notificationId: string): Promise<{
  success: boolean;
  message: string;
}> {
  const notif = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notif) {
    return { success: false, message: 'Không tìm thấy bản ghi thông báo.' };
  }

  const adminChatId = getAdminChatId();
  if (!adminChatId) {
    return { success: false, message: 'Chưa cấu hình TELEGRAM_ADMIN_CHAT_ID.' };
  }

  const markup = notif.bookingId
    ? buildBookingAdminInlineKeyboard(notif.bookingId, 'NEW')
    : undefined;

  const res = await sendTelegramMessage(adminChatId, notif.message, markup);
  await prisma.notification.update({
    where: { id: notif.id },
    data: {
      deliveryStatus: res.ok ? 'SENT' : 'FAILED',
      errorLog: res.ok ? null : res.description || 'Retry failed',
    },
  });

  return {
    success: res.ok,
    message: res.ok
      ? 'Đã gửi lại thông báo Telegram thành công!'
      : `Gửi lại thất bại: ${res.description}`,
  };
}

/**
 * Sends a status update to the Customer on Telegram (if linked) when CRM Admin updates booking status.
 */
export async function notifyCustomerBookingStatusChange(params: {
  bookingCode: string;
  projectTitle: string;
  serviceName: string;
  newStatus: string;
  telegramUserId?: string | null;
  adminNote?: string;
}): Promise<boolean> {
  if (!params.telegramUserId) {
    return false;
  }

  const statusLabels: Record<string, string> = {
    NEW: '🆕 Mới tiếp nhận',
    CONFIRMED: '✅ Đã xác nhận yêu cầu',
    CONSULTING: '💬 Đang tư vấn chuyên sâu',
    QUOTATION_SENT: '📄 Đã gửi báo giá chính thức',
    IN_PROGRESS: '🚀 Đang triển khai dự án',
    COMPLETED: '🏆 Hoàn thành bàn giao',
    CANCELLED: '❌ Đã hủy',
  };

  const label = statusLabels[params.newStatus] || params.newStatus;
  const lines = [
    '📣 CẬP NHẬT TRẠNG THÁI DỰ ÁN – NGUYÊN AGENCY',
    '',
    `🆔 Mã đặt dịch vụ: ${params.bookingCode.replace(/^#/, '')}`,
    `🛠 Dịch vụ: ${params.serviceName}`,
    `📌 Dự án: ${params.projectTitle}`,
    `🔄 Trạng thái mới: ${label}`,
  ];

  if (params.adminNote) {
    lines.push('', `💡 Ghi chú từ chuyên gia: ${params.adminNote}`);
  }

  lines.push(
    '',
    'Gõ /mybookings bất kỳ lúc nào để tra cứu tiến độ hoặc nhắn tin trực tiếp tại đây để được hỗ trợ.'
  );

  const res = await sendTelegramMessage(params.telegramUserId, lines.join('\n'));
  return res.ok;
}

/**
 * Checks Telegram Bot live status and webhook configuration.
 */
export async function getTelegramBotStatus(): Promise<{
  connected: boolean;
  botUsername?: string;
  botFirstName?: string;
  botId?: number;
  adminChatIdConfigured: boolean;
  adminChatIdMasked: string;
  webhookUrl?: string;
  pendingUpdateCount?: number;
  lastErrorMessage?: string;
  error?: string;
}> {
  const adminChatId = getAdminChatId();
  const maskedChatId = adminChatId
    ? `${adminChatId.slice(0, 3)}***${adminChatId.slice(-3)}`
    : 'Chưa cấu hình';

  const meRes = await callTelegramApi<{
    id: number;
    is_bot: boolean;
    first_name: string;
    username: string;
  }>('getMe', {});

  if (!meRes.ok || !meRes.result) {
    return {
      connected: false,
      adminChatIdConfigured: Boolean(adminChatId),
      adminChatIdMasked: maskedChatId,
      error: meRes.description || 'Không thể kết nối Telegram Bot API',
    };
  }

  const webhookRes = await callTelegramApi<{
    url: string;
    has_custom_certificate: boolean;
    pending_update_count: number;
    last_error_date?: number;
    last_error_message?: string;
  }>('getWebhookInfo', {});

  return {
    connected: true,
    botId: meRes.result.id,
    botFirstName: meRes.result.first_name,
    botUsername: meRes.result.username,
    adminChatIdConfigured: Boolean(adminChatId),
    adminChatIdMasked: maskedChatId,
    webhookUrl: webhookRes.result?.url || '',
    pendingUpdateCount: webhookRes.result?.pending_update_count || 0,
    lastErrorMessage: webhookRes.result?.last_error_message,
  };
}

/**
 * Registers the Telegram Webhook URL with X-Telegram-Bot-Api-Secret-Token.
 */
export async function registerTelegramWebhook(webhookUrl: string): Promise<{
  ok: boolean;
  description?: string;
}> {
  const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET;
  const payload: Record<string, unknown> = {
    url: webhookUrl,
    allowed_updates: ['message', 'callback_query'],
  };
  if (secretToken) {
    payload.secret_token = secretToken;
  }

  const res = await callTelegramApi('setWebhook', payload);
  return {
    ok: res.ok,
    description: res.description,
  };
}

export function getPublicCrmUrl(path: string): string | null {
  const siteUrl = getSiteUrl();
  if (siteUrl.startsWith('https://') && !siteUrl.includes('localhost')) {
    return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
  }
  return null;
}
