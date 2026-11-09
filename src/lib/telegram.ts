import { prisma } from './prisma';
import {
  sendTelegramMessage,
  answerCallbackQuery,
  notifyCustomerBookingStatusChange,
  TelegramReplyMarkup,
} from './telegram-notifier';
import { createUnifiedBooking, normalizePhoneNumber } from './booking-engine';
import {
  handleTelegramAdminCommand,
  handleTelegramAdminCallback,
  handleTelegramAdminWizardText,
} from './telegram-admin-control';

export interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from?: {
      id: number;
      is_bot?: boolean;
      first_name?: string;
      last_name?: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
    };
    date: number;
    text?: string;
  };
  callback_query?: {
    id: string;
    from: {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
    };
    message?: {
      message_id: number;
      chat: {
        id: number;
      };
    };
    data?: string;
  };
}

interface BookingDraftData {
  bookingMode?: 'BOOKING' | 'QUOTE';
  serviceId?: string;
  serviceName?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  projectTitle?: string;
  projectDescription?: string;
  budgetRange?: string;
  preferredStartDate?: string;
}

export function getMainMenuKeyboard(): TelegramReplyMarkup {
  return {
    inline_keyboard: [
      [
        { text: '🛠 Dịch vụ của chúng tôi', callback_data: 'menu:services' },
        { text: '🚀 Đặt dịch vụ', callback_data: 'menu:booking' },
      ],
      [
        { text: '💎 Yêu cầu báo giá', callback_data: 'menu:quote' },
        { text: '🎬 Portfolio', callback_data: 'menu:portfolio' },
      ],
      [
        { text: '🧪 Sản phẩm LAB', callback_data: 'menu:lab' },
        { text: '📞 Liên hệ tư vấn', callback_data: 'menu:contact' },
      ],
      [
        { text: '📋 Kiểm tra yêu cầu (/mybookings)', callback_data: 'menu:mybookings' },
      ],
    ],
  };
}

function getCancelKeyboard(): TelegramReplyMarkup {
  return {
    inline_keyboard: [[{ text: '❌ Hủy thao tác (/cancel)', callback_data: 'booking:cancel' }]],
  };
}

function parseDraftData(raw: string | null | undefined): BookingDraftData {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as BookingDraftData;
  } catch {
    return {};
  }
}

async function setConversationStep(params: {
  telegramUserId: string;
  telegramUsername?: string;
  chatId: string;
  step: string;
  state: string;
  draft: BookingDraftData;
}) {
  await prisma.telegramConversation.upsert({
    where: { telegramUserId: params.telegramUserId },
    update: {
      telegramUsername: params.telegramUsername || undefined,
      chatId: params.chatId,
      currentStep: params.step,
      conversationState: params.state,
      temporaryData: JSON.stringify(params.draft),
    },
    create: {
      telegramUserId: params.telegramUserId,
      telegramUsername: params.telegramUsername || null,
      chatId: params.chatId,
      currentStep: params.step,
      conversationState: params.state,
      temporaryData: JSON.stringify(params.draft),
    },
  });
}

async function resetConversation(telegramUserId: string, chatId: string, username?: string) {
  await setConversationStep({
    telegramUserId,
    telegramUsername: username,
    chatId,
    step: 'IDLE',
    state: 'IDLE',
    draft: {},
  });
}

/**
 * Starts Step 1 of the 10-step booking flow by dynamically querying active services from DB.
 */
async function startStep1SelectService(params: {
  telegramUserId: string;
  telegramUsername?: string;
  chatId: string;
  mode: 'BOOKING' | 'QUOTE';
  preselectedServiceId?: string;
}) {
  if (params.preselectedServiceId) {
    const svc = await prisma.service.findFirst({
      where: {
        id: params.preselectedServiceId,
        status: 'PUBLISHED',
        deletedAt: null,
      },
    });
    if (svc) {
      await setConversationStep({
        telegramUserId: params.telegramUserId,
        telegramUsername: params.telegramUsername,
        chatId: params.chatId,
        step: 'STEP_2_NAME',
        state: 'BOOKING_FLOW',
        draft: {
          bookingMode: params.mode,
          serviceId: svc.id,
          serviceName: svc.title,
        },
      });

      await sendTelegramMessage(
        params.chatId,
        [
          `✅ Bạn đã chọn dịch vụ: ${svc.title}`,
          '',
          '📌 BƯỚC 2/9 — Nhập Họ và Tên của bạn:',
          '(Ví dụ: Nguyễn Minh Quân)',
        ].join('\n'),
        getCancelKeyboard()
      );
      return;
    }
  }

  const activeServices = await prisma.service.findMany({
    where: { status: 'PUBLISHED', deletedAt: null },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    take: 10,
  });

  await setConversationStep({
    telegramUserId: params.telegramUserId,
    telegramUsername: params.telegramUsername,
    chatId: params.chatId,
    step: 'STEP_1_SERVICE',
    state: 'BOOKING_FLOW',
    draft: { bookingMode: params.mode },
  });

  const serviceButtons = activeServices.map((svc) => [
    {
      text: `${svc.group === 'TECH' ? '💻' : '🎨'} ${svc.title}`,
      callback_data: `pick_svc:${svc.id}`,
    },
  ]);

  serviceButtons.push([
    {
      text: '✨ Tư vấn giải pháp tổng thể (Custom)',
      callback_data: 'pick_svc:CUSTOM',
    },
  ]);
  serviceButtons.push([{ text: '❌ Hủy thao tác', callback_data: 'booking:cancel' }]);

  const title =
    params.mode === 'QUOTE'
      ? '💎 YÊU CẦU BÁO GIÁ DỰ ÁN – NGUYÊN AGENCY'
      : '🚀 ĐẶT DỊCH VỤ – NGUYÊN AGENCY';

  await sendTelegramMessage(
    params.chatId,
    [
      title,
      '',
      '📌 BƯỚC 1/9 — Vui lòng chọn dịch vụ bạn đang quan tâm từ danh sách bên dưới (hoặc nhập tên dịch vụ):',
    ].join('\n'),
    { inline_keyboard: serviceButtons }
  );
}

/**
 * Displays active services dynamically from the database (Section 10: Single source of truth).
 */
async function sendDynamicServicesMenu(chatId: string) {
  const services = await prisma.service.findMany({
    where: { status: 'PUBLISHED', deletedAt: null },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });

  if (services.length === 0) {
    await sendTelegramMessage(
      chatId,
      'Hiện tại danh sách dịch vụ đang được cập nhật. Vui lòng chọn Liên hệ tư vấn để được hỗ trợ trực tiếp.',
      getMainMenuKeyboard()
    );
    return;
  }

  const lines = [
    '🏛 HỆ SINH THÁI DỊCH VỤ – NGUYÊN AGENCY',
    'Chạm vào từng dịch vụ bên dưới để xem chi tiết & bảng giá khởi điểm:',
    '',
  ];

  services.forEach((s, idx) => {
    lines.push(`${idx + 1}. [${s.group}] ${s.title} — ${s.priceLabel}`);
  });

  const buttons = services.slice(0, 10).map((s) => [
    {
      text: `🔍 ${s.title} (${s.priceLabel})`,
      callback_data: `view_svc:${s.id}`,
    },
  ]);

  buttons.push([
    { text: '🚀 Đặt dịch vụ ngay', callback_data: 'menu:booking' },
    { text: '🏠 Menu chính', callback_data: 'menu:home' },
  ]);

  await sendTelegramMessage(chatId, lines.join('\n'), {
    inline_keyboard: buttons,
  });
}

/**
 * Displays customer's own bookings strictly filtered by telegramUserId.
 */
async function handleMyBookingsLookup(chatId: string, telegramUserId: string) {
  const customer = await prisma.customer.findUnique({
    where: { telegramUserId },
    include: {
      bookings: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!customer || customer.bookings.length === 0) {
    await sendTelegramMessage(
      chatId,
      [
        '📋 TRA CỨU YÊU CẦU ĐẶT DỊCH VỤ',
        '',
        'Hiện tại chưa có yêu cầu đặt dịch vụ nào gắn với tài khoản Telegram này.',
        '• Nếu bạn đã đặt dịch vụ trên Website bằng số điện thoại, hãy bấm "Liên kết SĐT" bên dưới.',
        '• Hoặc bấm "Đặt dịch vụ mới" để bắt đầu dự án cùng NGUYÊN AGENCY.',
      ].join('\n'),
      {
        inline_keyboard: [
          [
            { text: '🔗 Liên kết bằng Số điện thoại', callback_data: 'mybookings:link_phone' },
            { text: '🚀 Đặt dịch vụ mới', callback_data: 'menu:booking' },
          ],
          [{ text: '🏠 Quay lại Menu chính', callback_data: 'menu:home' }],
        ],
      }
    );
    return;
  }

  const statusLabels: Record<string, string> = {
    NEW: '🆕 Mới tiếp nhận',
    CONFIRMED: '✅ Đã xác nhận',
    CONSULTING: '💬 Đang tư vấn',
    QUOTATION_SENT: '📄 Đã gửi báo giá',
    IN_PROGRESS: '🚀 Đang triển khai',
    COMPLETED: '🏆 Hoàn thành',
    CANCELLED: '❌ Đã hủy',
  };

  const lines = [
    `📋 DANH SÁCH YÊU CẦU CỦA ${customer.name.toUpperCase()}`,
    `Mã KH: ${customer.code} • SĐT: ${customer.phone || 'Chưa cập nhật'}`,
    '────────────────────',
  ];

  customer.bookings.forEach((b, idx) => {
    const st = statusLabels[b.status] || b.status;
    const createdStr = b.createdAt.toLocaleDateString('vi-VN');
    lines.push(
      `${idx + 1}. Mã: ${b.bookingCode}`,
      `   • Dịch vụ: ${b.serviceName}`,
      `   • Dự án: ${b.projectTitle}`,
      `   • Ngân sách: ${b.budgetRange || 'Thỏa thuận'}`,
      `   • Trạng thái: ${st}`,
      `   • Ngày gửi: ${createdStr}`,
      ''
    );
  });

  await sendTelegramMessage(chatId, lines.join('\n'), {
    inline_keyboard: [
      [
        { text: '➕ Đặt thêm dịch vụ mới', callback_data: 'menu:booking' },
        { text: '🏠 Menu chính', callback_data: 'menu:home' },
      ],
    ],
  });
}

/**
 * Main entry point for processing a Telegram Webhook Update with idempotency protection.
 */
export async function handleTelegramUpdate(update: TelegramUpdate): Promise<{
  processed: boolean;
  reason?: string;
}> {
  if (!update || typeof update.update_id !== 'number') {
    return { processed: false, reason: 'INVALID_UPDATE' };
  }

  // 1. Idempotency check: prevent duplicate processing of the same update_id
  const alreadyProcessed = await prisma.telegramProcessedUpdate.findUnique({
    where: { updateId: update.update_id },
  });

  if (alreadyProcessed) {
    return { processed: false, reason: 'DUPLICATE_UPDATE_ID' };
  }

  const chatIdRaw =
    update.message?.chat.id || update.callback_query?.message?.chat.id;

  await prisma.telegramProcessedUpdate.create({
    data: {
      updateId: update.update_id,
      chatId: chatIdRaw ? String(chatIdRaw) : null,
    },
  });

  // 2. Handle Callback Queries (Inline Keyboard clicks)
  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = String(cb.message?.chat.id || cb.from.id);
    const telegramUserId = String(cb.from.id);
    const telegramUsername = cb.from.username;
    const data = cb.data || '';

    // Check if this is an Admin Control Center callback
    const handledByAdmin = await handleTelegramAdminCallback({
      callbackId: cb.id,
      data,
      chatId,
      messageId: cb.message?.message_id,
      telegramUserId,
      telegramUsername,
    });
    if (handledByAdmin) {
      return { processed: true };
    }

    await answerCallbackQuery(cb.id);

    if (data === 'menu:home') {
      await resetConversation(telegramUserId, chatId, telegramUsername);
      await sendTelegramMessage(
        chatId,
        [
          '🏛 CHÀO MỪNG ĐẾN VỚI NGUYÊN AGENCY',
          'Premium Creative & Digital Technology Studio.',
          '',
          'Chúng tôi đồng hành cùng doanh nghiệp kiến tạo hệ sinh thái Thương hiệu, Website/App hiệu năng cao và giải pháp AI đột phá.',
          'Vui lòng chọn chức năng bên dưới:',
        ].join('\n'),
        getMainMenuKeyboard()
      );
      return { processed: true };
    }

    if (data === 'menu:services') {
      await sendDynamicServicesMenu(chatId);
      return { processed: true };
    }

    if (data.startsWith('view_svc:')) {
      const serviceId = data.replace('view_svc:', '');
      const svc = await prisma.service.findUnique({
        where: { id: serviceId },
        include: { category: true },
      });

      if (!svc) {
        await sendTelegramMessage(chatId, 'Dịch vụ không tồn tại hoặc đã ngừng cung cấp.');
        return { processed: true };
      }

      const details = [
        `✨ ${svc.title.toUpperCase()}`,
        ` Phân hệ: ${svc.group} • Danh mục: ${svc.category.name}`,
        `💰 Chi phí tham khảo: ${svc.priceLabel}`,
        `⏱ Thời gian triển khai: ${svc.estimatedTime}`,
        '',
        `📝 Mô tả: ${svc.shortDesc}`,
        '',
        svc.description,
      ].join('\n');

      await sendTelegramMessage(chatId, details, {
        inline_keyboard: [
          [
            {
              text: '🚀 Đặt dịch vụ này ngay',
              callback_data: `start_svc_booking:${svc.id}`,
            },
          ],
          [
            { text: '⬅️ Danh sách dịch vụ', callback_data: 'menu:services' },
            { text: '🏠 Menu chính', callback_data: 'menu:home' },
          ],
        ],
      });
      return { processed: true };
    }

    if (data.startsWith('start_svc_booking:')) {
      const serviceId = data.replace('start_svc_booking:', '');
      await startStep1SelectService({
        telegramUserId,
        telegramUsername,
        chatId,
        mode: 'BOOKING',
        preselectedServiceId: serviceId,
      });
      return { processed: true };
    }

    if (data === 'menu:booking') {
      await startStep1SelectService({
        telegramUserId,
        telegramUsername,
        chatId,
        mode: 'BOOKING',
      });
      return { processed: true };
    }

    if (data === 'menu:quote') {
      await startStep1SelectService({
        telegramUserId,
        telegramUsername,
        chatId,
        mode: 'QUOTE',
      });
      return { processed: true };
    }

    if (data === 'menu:portfolio') {
      const portfolios = await prisma.portfolio.findMany({
        where: { status: 'PUBLISHED', deletedAt: null },
        include: { category: true },
        orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }],
        take: 6,
      });

      const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(
        /\/$/,
        ''
      );
      const lines = [
        '🎬 PORTFOLIO & DỰ ÁN TIÊU BIỂU – NGUYÊN AGENCY',
        '',
        ...portfolios.map(
          (p, i) =>
            `${i + 1}. ${p.title} (${p.clientName} - ${p.year})\n   • Hạng mục: ${p.category.name}\n   • Tóm tắt: ${p.shortDesc}\n   • Xem chi tiết: ${siteUrl}/portfolio/${p.slug}`
        ),
      ];

      await sendTelegramMessage(chatId, lines.join('\n\n'), {
        inline_keyboard: [
          [
            { text: '🚀 Đặt dịch vụ tương tự', callback_data: 'menu:booking' },
            { text: '🏠 Menu chính', callback_data: 'menu:home' },
          ],
        ],
      });
      return { processed: true };
    }

    if (data === 'menu:lab') {
      const labProducts = await prisma.labProduct.findMany({
        where: { status: 'PUBLISHED', deletedAt: null },
        orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }],
        take: 6,
      });

      const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(
        /\/$/,
        ''
      );
      const lines = [
        '🧪 DIGITAL LAB – SẢN PHẨM CÔNG NGHỆ & AI',
        '',
        ...labProducts.map(
          (lp, i) =>
            `${i + 1}. ${lp.name} [${lp.productStage} ${lp.version}]\n   • ${lp.tagline}\n   • Mô hình: ${lp.pricingModel}\n   • Khám phá: ${siteUrl}/lab/${lp.slug}`
        ),
      ];

      await sendTelegramMessage(chatId, lines.join('\n\n'), {
        inline_keyboard: [
          [
            { text: '🚀 Tư vấn tích hợp AI / SaaS', callback_data: 'menu:booking' },
            { text: '🏠 Menu chính', callback_data: 'menu:home' },
          ],
        ],
      });
      return { processed: true };
    }

    if (data === 'menu:contact') {
      await sendTelegramMessage(
        chatId,
        [
          '📞 LIÊN HỆ TƯ VẤN TRỰC TIẾP – NGUYÊN AGENCY',
          '',
          '• Hotline / Zalo: 0987 654 321',
          '• Email: hello@nguyenagency.com',
          '• Trụ sở: Tầng 18, Lim Tower 3, Quận 1, TP. Hồ Chí Minh',
          '',
          'Bạn có thể bấm "Đặt dịch vụ" bên dưới để chuyên gia của chúng tôi liên hệ lại trong vòng 15 phút!',
        ].join('\n'),
        {
          inline_keyboard: [
            [
              { text: '🚀 Đặt lịch tư vấn ngay', callback_data: 'menu:booking' },
              { text: '🏠 Menu chính', callback_data: 'menu:home' },
            ],
          ],
        }
      );
      return { processed: true };
    }

    if (data === 'menu:mybookings') {
      await handleMyBookingsLookup(chatId, telegramUserId);
      return { processed: true };
    }

    if (data === 'mybookings:link_phone') {
      await setConversationStep({
        telegramUserId,
        telegramUsername,
        chatId,
        step: 'VERIFY_PHONE',
        state: 'LINK_PHONE',
        draft: {},
      });
      await sendTelegramMessage(
        chatId,
        '🔗 Vui lòng nhập Số điện thoại bạn đã dùng khi đặt dịch vụ trên Website (VD: 0987654321):',
        getCancelKeyboard()
      );
      return { processed: true };
    }

    if (data === 'booking:cancel') {
      await resetConversation(telegramUserId, chatId, telegramUsername);
      await sendTelegramMessage(
        chatId,
        '✅ Đã hủy thao tác hiện tại. Bạn có thể chọn lại chức năng từ Menu chính:',
        getMainMenuKeyboard()
      );
      return { processed: true };
    }

    // Step 1 Callback: Pick Service
    if (data.startsWith('pick_svc:')) {
      const svcKey = data.replace('pick_svc:', '');
      const convo = await prisma.telegramConversation.findUnique({
        where: { telegramUserId },
      });
      const draft = parseDraftData(convo?.temporaryData);

      if (svcKey === 'CUSTOM') {
        draft.serviceId = undefined;
        draft.serviceName = 'Tư vấn giải pháp tổng thể (Custom)';
      } else {
        const svc = await prisma.service.findUnique({ where: { id: svcKey } });
        draft.serviceId = svc?.id;
        draft.serviceName = svc?.title || 'Dịch vụ NGUYÊN AGENCY';
      }

      await setConversationStep({
        telegramUserId,
        telegramUsername,
        chatId,
        step: 'STEP_2_NAME',
        state: 'BOOKING_FLOW',
        draft,
      });

      await sendTelegramMessage(
        chatId,
        [
          `✅ Dịch vụ đã chọn: ${draft.serviceName}`,
          '',
          '📌 BƯỚC 2/9 — Vui lòng nhập Họ và Tên của bạn:',
          '(Ví dụ: Trần Hoàng Nguyên)',
        ].join('\n'),
        getCancelKeyboard()
      );
      return { processed: true };
    }

    // Step 4 Callback: Skip Email
    if (data === 'booking:skip_email') {
      const convo = await prisma.telegramConversation.findUnique({
        where: { telegramUserId },
      });
      const draft = parseDraftData(convo?.temporaryData);
      draft.email = '';

      await setConversationStep({
        telegramUserId,
        telegramUsername,
        chatId,
        step: 'STEP_5_PROJECT_TITLE',
        state: 'BOOKING_FLOW',
        draft,
      });

      await sendTelegramMessage(
        chatId,
        [
          '📌 BƯỚC 5/9 — Nhập Tên dự án hoặc Thương hiệu của bạn:',
          '(Ví dụ: Website Thương mại Điện tử Luxury / Rebranding Tập đoàn XYZ)',
        ].join('\n'),
        getCancelKeyboard()
      );
      return { processed: true };
    }

    // Step 7 Callback: Select Budget Range
    if (data.startsWith('pick_budget:')) {
      const budgetCode = data.replace('pick_budget:', '');
      const budgetMap: Record<string, string> = {
        B1: '10 – 30 triệu VNĐ',
        B2: '30 – 80 triệu VNĐ',
        B3: '80 – 200 triệu VNĐ',
        B4: 'Trên 200 triệu VNĐ',
        B5: 'Cần tư vấn ngân sách',
      };
      const selectedBudget = budgetMap[budgetCode] || 'Cần tư vấn ngân sách';

      const convo = await prisma.telegramConversation.findUnique({
        where: { telegramUserId },
      });
      const draft = parseDraftData(convo?.temporaryData);
      draft.budgetRange = selectedBudget;

      await setConversationStep({
        telegramUserId,
        telegramUsername,
        chatId,
        step: 'STEP_8_TIMELINE',
        state: 'BOOKING_FLOW',
        draft,
      });

      await sendTelegramMessage(
        chatId,
        [
          `✅ Ngân sách dự kiến: ${selectedBudget}`,
          '',
          '📌 BƯỚC 8/9 — Chọn Thời gian dự kiến bắt đầu triển khai (hoặc nhập trực tiếp):',
        ].join('\n'),
        {
          inline_keyboard: [
            [
              { text: '⚡ Triển khai ngay tuần này', callback_data: 'pick_time:T1' },
              { text: '📅 Trong vòng 2 - 4 tuần tới', callback_data: 'pick_time:T2' },
            ],
            [
              { text: '🗓 Trong quý tới', callback_data: 'pick_time:T3' },
              { text: '🤝 Linh hoạt theo tư vấn', callback_data: 'pick_time:T4' },
            ],
            [{ text: '❌ Hủy thao tác', callback_data: 'booking:cancel' }],
          ],
        }
      );
      return { processed: true };
    }

    // Step 8 Callback: Select Timeline -> Move to Step 9 Confirm
    if (data.startsWith('pick_time:')) {
      const timeCode = data.replace('pick_time:', '');
      const timeMap: Record<string, string> = {
        T1: 'Triển khai ngay tuần này',
        T2: 'Trong vòng 2 - 4 tuần tới',
        T3: 'Trong quý tới',
        T4: 'Linh hoạt theo tư vấn',
      };
      const selectedTime = timeMap[timeCode] || 'Linh hoạt';

      const convo = await prisma.telegramConversation.findUnique({
        where: { telegramUserId },
      });
      const draft = parseDraftData(convo?.temporaryData);
      draft.preferredStartDate = selectedTime;

      await setConversationStep({
        telegramUserId,
        telegramUsername,
        chatId,
        step: 'STEP_9_CONFIRM',
        state: 'BOOKING_FLOW',
        draft,
      });

      await sendStep9ConfirmationPrompt(chatId, draft);
      return { processed: true };
    }

    // Step 9 Callback: Edit or Submit (Step 10)
    if (data === 'booking:edit') {
      await startStep1SelectService({
        telegramUserId,
        telegramUsername,
        chatId,
        mode: 'BOOKING',
      });
      return { processed: true };
    }

    if (data === 'booking:submit') {
      const convo = await prisma.telegramConversation.findUnique({
        where: { telegramUserId },
      });
      const draft = parseDraftData(convo?.temporaryData);

      if (!draft.fullName || !draft.phone || !draft.projectTitle) {
        await sendTelegramMessage(
          chatId,
          '⚠️ Thông tin phiên đặt dịch vụ chưa đầy đủ. Vui lòng bắt đầu lại bằng /booking.',
          getMainMenuKeyboard()
        );
        return { processed: true };
      }

      // Step 10: Save to database via unified engine
      const bookingRes = await createUnifiedBooking({
        fullName: draft.fullName,
        phone: draft.phone,
        email: draft.email || '',
        serviceId: draft.serviceId || '',
        serviceName: draft.serviceName || 'Dịch vụ NGUYÊN AGENCY',
        projectTitle: draft.projectTitle,
        projectDescription: draft.projectDescription || draft.projectTitle,
        budgetRange: draft.budgetRange || 'Cần tư vấn',
        preferredStartDate: draft.preferredStartDate || 'Linh hoạt',
        preferredContactTime: 'Qua Telegram / Điện thoại',
        source: 'TELEGRAM',
        pageSource: 'Telegram Bot 10-Step Flow',
        telegramUserId,
        telegramUsername,
      });

      await resetConversation(telegramUserId, chatId, telegramUsername);

      if (!bookingRes.success) {
        await sendTelegramMessage(
          chatId,
          `❌ Có lỗi khi lưu yêu cầu: ${bookingRes.message}. Vui lòng thử lại hoặc gõ /contact.`,
          getMainMenuKeyboard()
        );
        return { processed: true };
      }

      await sendTelegramMessage(
        chatId,
        [
          '🎉 ĐẶT DỊCH VỤ THÀNH CÔNG – NGUYÊN AGENCY',
          '',
          `🆔 Mã yêu cầu của bạn: ${bookingRes.bookingCode}`,
          `🛠 Dịch vụ: ${draft.serviceName}`,
          `📌 Dự án: ${draft.projectTitle}`,
          `💰 Ngân sách: ${draft.budgetRange}`,
          '',
          'Chuyên gia tư vấn của NGUYÊN AGENCY đã nhận được thông báo thời gian thực và sẽ liên hệ với bạn trong vòng 15 – 30 phút làm việc.',
          '',
          'Bạn có thể kiểm tra tiến độ xử lý bất kỳ lúc nào bằng lệnh /mybookings.',
        ].join('\n'),
        {
          inline_keyboard: [
            [
              { text: '📋 Kiểm tra yêu cầu của tôi', callback_data: 'menu:mybookings' },
              { text: '🏠 Menu chính', callback_data: 'menu:home' },
            ],
          ],
        }
      );

      return { processed: true };
    }

    return { processed: true };
  }

  // 3. Handle Text Messages & Slash Commands
  if (update.message && update.message.text) {
    const msg = update.message;
    const chatId = String(msg.chat.id);
    const telegramUserId = String(msg.from?.id || msg.chat.id);
    const telegramUsername = msg.from?.username;
    const text = (msg.text || '').trim();

    // Check if this is an Admin Control Center slash command (/newbookings, /pending, /customers, /quotations, /projects, /stats, /today)
    if (text.startsWith('/')) {
      const handledCmd = await handleTelegramAdminCommand({
        commandText: text,
        chatId,
        telegramUserId,
        telegramUsername,
      });
      if (handledCmd) {
        return { processed: true };
      }
    }

    // Slash commands
    if (text.startsWith('/start')) {
      await resetConversation(telegramUserId, chatId, telegramUsername);
      const firstName = msg.from?.first_name || 'Quý khách';
      await sendTelegramMessage(
        chatId,
        [
          `Xin chào ${firstName}! Chào mừng bạn đến với NGUYÊN AGENCY Bot chính thức.`,
          '',
          '🏛 NGUYÊN AGENCY — Premium Creative & Digital Technology Studio:',
          '• MEDIA: Branding, UI/UX Design, Video Production, Creative Campaign',
          '• TECH: Custom Website, Mobile App, SaaS Architecture, AI Integration',
          '• LAB: Digital Products, AI Workflow & Automation',
          '',
          'Hãy chọn một mục bên dưới để bắt đầu:',
        ].join('\n'),
        getMainMenuKeyboard()
      );
      return { processed: true };
    }

    if (text.startsWith('/services')) {
      await sendDynamicServicesMenu(chatId);
      return { processed: true };
    }

    if (text.startsWith('/booking')) {
      await startStep1SelectService({
        telegramUserId,
        telegramUsername,
        chatId,
        mode: 'BOOKING',
      });
      return { processed: true };
    }

    if (text.startsWith('/contact')) {
      await sendTelegramMessage(
        chatId,
        [
          '📞 THÔNG TIN LIÊN HỆ – NGUYÊN AGENCY',
          '• Hotline: 0987 654 321',
          '• Email: hello@nguyenagency.com',
          '• Địa chỉ: Tầng 18, Lim Tower 3, Quận 1, TP.HCM',
          '• Đặt dịch vụ trực tiếp trên Bot: gõ /booking',
        ].join('\n'),
        getMainMenuKeyboard()
      );
      return { processed: true };
    }

    if (text.startsWith('/mybookings')) {
      await handleMyBookingsLookup(chatId, telegramUserId);
      return { processed: true };
    }

    if (text.startsWith('/help')) {
      await sendTelegramMessage(
        chatId,
        [
          '📖 HƯỚNG DẪN SỬ DỤNG NGUYÊN AGENCY BOT',
          '',
          '/start - Mở Menu chính của NGUYÊN AGENCY',
          '/services - Xem danh sách dịch vụ & bảng giá',
          '/booking - Đặt dịch vụ hoặc yêu cầu báo giá (10 bước chuẩn hóa)',
          '/mybookings - Tra cứu trạng thái các yêu cầu bạn đã gửi',
          '/contact - Xem thông tin liên hệ trực tiếp',
          '/cancel - Hủy thao tác đang thực hiện',
          '',
          '👮 LỆNH DÀNH CHO QUẢN TRỊ VIÊN (ADMIN CONTROL CENTER):',
          '/newbookings - Xem đơn đặt dịch vụ mới (NEW)',
          '/pending - Xem các yêu cầu đang xử lý',
          '/today - Xem các yêu cầu phát sinh hôm nay',
          '/customers - Tra cứu danh sách khách hàng',
          '/quotations - Xem danh sách báo giá',
          '/projects - Xem danh sách dự án',
          '/stats - Thống kê hoạt động toàn hệ thống',
        ].join('\n'),
        getMainMenuKeyboard()
      );
      return { processed: true };
    }

    if (text.startsWith('/cancel')) {
      await resetConversation(telegramUserId, chatId, telegramUsername);
      await sendTelegramMessage(
        chatId,
        '✅ Đã hủy thao tác hiện tại và làm mới phiên trò chuyện.',
        getMainMenuKeyboard()
      );
      return { processed: true };
    }

    // Check if Admin is actively inside the 10-Step Quotation Wizard or Project Creation Wizard
    const handledByAdminWizard = await handleTelegramAdminWizardText({
      text,
      chatId,
      telegramUserId,
      telegramUsername,
    });
    if (handledByAdminWizard) {
      return { processed: true };
    }

    // Handle active multi-step state machine stored in `TelegramConversation`
    const convo = await prisma.telegramConversation.findUnique({
      where: { telegramUserId },
    });

    if (!convo || convo.currentStep === 'IDLE') {
      await sendTelegramMessage(
        chatId,
        'Xin chào! Vui lòng chọn một chức năng bên dưới hoặc gõ /booking để đặt dịch vụ:',
        getMainMenuKeyboard()
      );
      return { processed: true };
    }

    const draft = parseDraftData(convo.temporaryData);

    // State: VERIFY_PHONE to link existing customer profile
    if (convo.currentStep === 'VERIFY_PHONE') {
      const normalized = normalizePhoneNumber(text);
      if (!/^(0)[0-9]{8,10}$/.test(normalized)) {
        await sendTelegramMessage(
          chatId,
          '⚠️ Số điện thoại chưa đúng định dạng. Vui lòng nhập lại (VD: 0987654321):',
          getCancelKeyboard()
        );
        return { processed: true };
      }

      const existingCustomer = await prisma.customer.findFirst({
        where: {
          OR: [{ phone: normalized }, { phone: text }],
          deletedAt: null,
        },
      });

      if (!existingCustomer) {
        await resetConversation(telegramUserId, chatId, telegramUsername);
        await sendTelegramMessage(
          chatId,
          `Không tìm thấy hồ sơ khách hàng nào với số điện thoại ${normalized}. Bạn có thể tạo yêu cầu mới bằng /booking.`,
          getMainMenuKeyboard()
        );
        return { processed: true };
      }

      await prisma.customer.update({
        where: { id: existingCustomer.id },
        data: {
          telegramUserId,
          telegramUsername: telegramUsername || existingCustomer.telegramUsername,
        },
      });

      await resetConversation(telegramUserId, chatId, telegramUsername);
      await handleMyBookingsLookup(chatId, telegramUserId);
      return { processed: true };
    }

    // Step 1 text fallback
    if (convo.currentStep === 'STEP_1_SERVICE') {
      draft.serviceName = text;
      await setConversationStep({
        telegramUserId,
        telegramUsername,
        chatId,
        step: 'STEP_2_NAME',
        state: 'BOOKING_FLOW',
        draft,
      });

      await sendTelegramMessage(
        chatId,
        [
          `✅ Dịch vụ: ${text}`,
          '',
          '📌 BƯỚC 2/9 — Vui lòng nhập Họ và Tên của bạn:',
        ].join('\n'),
        getCancelKeyboard()
      );
      return { processed: true };
    }

    // Step 2: Full Name
    if (convo.currentStep === 'STEP_2_NAME') {
      if (text.length < 2) {
        await sendTelegramMessage(
          chatId,
          '⚠️ Họ và tên phải có ít nhất 2 ký tự. Vui lòng nhập lại:',
          getCancelKeyboard()
        );
        return { processed: true };
      }

      draft.fullName = text;
      await setConversationStep({
        telegramUserId,
        telegramUsername,
        chatId,
        step: 'STEP_3_PHONE',
        state: 'BOOKING_FLOW',
        draft,
      });

      await sendTelegramMessage(
        chatId,
        [
          `👤 Khách hàng: ${text}`,
          '',
          '📌 BƯỚC 3/9 — Vui lòng nhập Số điện thoại liên hệ của bạn:',
          '(Ví dụ: 0987654321)',
        ].join('\n'),
        getCancelKeyboard()
      );
      return { processed: true };
    }

    // Step 3: Phone (validated strictly)
    if (convo.currentStep === 'STEP_3_PHONE') {
      const normalized = normalizePhoneNumber(text);
      if (!/^(0)[0-9]{8,11}$/.test(normalized)) {
        await sendTelegramMessage(
          chatId,
          '⚠️ Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (10-11 chữ số, bắt đầu bằng 0 hoặc +84):',
          getCancelKeyboard()
        );
        return { processed: true };
      }

      draft.phone = normalized;
      await setConversationStep({
        telegramUserId,
        telegramUsername,
        chatId,
        step: 'STEP_4_EMAIL',
        state: 'BOOKING_FLOW',
        draft,
      });

      await sendTelegramMessage(
        chatId,
        [
          `📞 Số điện thoại: ${normalized}`,
          '',
          '📌 BƯỚC 4/9 — Vui lòng nhập địa chỉ Email nhận báo giá (hoặc bấm "Bỏ qua"):',
        ].join('\n'),
        {
          inline_keyboard: [
            [{ text: '⏭ Bỏ qua bước Email', callback_data: 'booking:skip_email' }],
            [{ text: '❌ Hủy thao tác', callback_data: 'booking:cancel' }],
          ],
        }
      );
      return { processed: true };
    }

    // Step 4: Email
    if (convo.currentStep === 'STEP_4_EMAIL') {
      if (text.toLowerCase() !== 'bỏ qua' && text.toLowerCase() !== 'skip') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(text)) {
          await sendTelegramMessage(
            chatId,
            '⚠️ Địa chỉ Email chưa hợp lệ. Vui lòng nhập lại đúng định dạng (VD: ten@congty.com) hoặc bấm nút "Bỏ qua bước Email":',
            {
              inline_keyboard: [
                [{ text: '⏭ Bỏ qua bước Email', callback_data: 'booking:skip_email' }],
                [{ text: '❌ Hủy thao tác', callback_data: 'booking:cancel' }],
              ],
            }
          );
          return { processed: true };
        }
        draft.email = text.toLowerCase();
      } else {
        draft.email = '';
      }

      await setConversationStep({
        telegramUserId,
        telegramUsername,
        chatId,
        step: 'STEP_5_PROJECT_TITLE',
        state: 'BOOKING_FLOW',
        draft,
      });

      await sendTelegramMessage(
        chatId,
        [
          '📌 BƯỚC 5/9 — Nhập Tên dự án hoặc Thương hiệu của bạn:',
          '(Ví dụ: Thiết kế Website Bất động sản cao cấp / Xây dựng App Đặt lịch)',
        ].join('\n'),
        getCancelKeyboard()
      );
      return { processed: true };
    }

    // Step 5: Project Title
    if (convo.currentStep === 'STEP_5_PROJECT_TITLE') {
      if (text.length < 2) {
        await sendTelegramMessage(
          chatId,
          '⚠️ Tên dự án quá ngắn. Vui lòng nhập ít nhất 2 ký tự:',
          getCancelKeyboard()
        );
        return { processed: true };
      }

      draft.projectTitle = text;
      await setConversationStep({
        telegramUserId,
        telegramUsername,
        chatId,
        step: 'STEP_6_DESCRIPTION',
        state: 'BOOKING_FLOW',
        draft,
      });

      await sendTelegramMessage(
        chatId,
        [
          `📌 Dự án: ${text}`,
          '',
          '📌 BƯỚC 6/9 — Mô tả ngắn gọn nhu cầu, tính năng mong muốn hoặc mục tiêu của dự án:',
        ].join('\n'),
        getCancelKeyboard()
      );
      return { processed: true };
    }

    // Step 6: Project Description
    if (convo.currentStep === 'STEP_6_DESCRIPTION') {
      if (text.length < 5) {
        await sendTelegramMessage(
          chatId,
          '⚠️ Vui lòng mô tả chi tiết hơn một chút (ít nhất 5 ký tự) để đội ngũ chuyên gia chuẩn bị giải pháp tốt nhất:',
          getCancelKeyboard()
        );
        return { processed: true };
      }

      draft.projectDescription = text;
      await setConversationStep({
        telegramUserId,
        telegramUsername,
        chatId,
        step: 'STEP_7_BUDGET',
        state: 'BOOKING_FLOW',
        draft,
      });

      await sendTelegramMessage(
        chatId,
        '📌 BƯỚC 7/9 — Chọn mức Ngân sách dự kiến của bạn:',
        {
          inline_keyboard: [
            [
              { text: '💰 10 – 30 triệu', callback_data: 'pick_budget:B1' },
              { text: '💰 30 – 80 triệu', callback_data: 'pick_budget:B2' },
            ],
            [
              { text: '💎 80 – 200 triệu', callback_data: 'pick_budget:B3' },
              { text: '👑 Trên 200 triệu', callback_data: 'pick_budget:B4' },
            ],
            [
              { text: '🤝 Cần tư vấn ngân sách', callback_data: 'pick_budget:B5' },
            ],
            [{ text: '❌ Hủy thao tác', callback_data: 'booking:cancel' }],
          ],
        }
      );
      return { processed: true };
    }

    // Step 7 text fallback
    if (convo.currentStep === 'STEP_7_BUDGET') {
      draft.budgetRange = text;
      await setConversationStep({
        telegramUserId,
        telegramUsername,
        chatId,
        step: 'STEP_8_TIMELINE',
        state: 'BOOKING_FLOW',
        draft,
      });

      await sendTelegramMessage(
        chatId,
        '📌 BƯỚC 8/9 — Chọn Thời gian dự kiến bắt đầu triển khai:',
        {
          inline_keyboard: [
            [
              { text: '⚡ Triển khai ngay tuần này', callback_data: 'pick_time:T1' },
              { text: '📅 Trong vòng 2 - 4 tuần tới', callback_data: 'pick_time:T2' },
            ],
            [
              { text: '🗓 Trong quý tới', callback_data: 'pick_time:T3' },
              { text: '🤝 Linh hoạt theo tư vấn', callback_data: 'pick_time:T4' },
            ],
            [{ text: '❌ Hủy thao tác', callback_data: 'booking:cancel' }],
          ],
        }
      );
      return { processed: true };
    }

    // Step 8 text fallback
    if (convo.currentStep === 'STEP_8_TIMELINE') {
      draft.preferredStartDate = text;
      await setConversationStep({
        telegramUserId,
        telegramUsername,
        chatId,
        step: 'STEP_9_CONFIRM',
        state: 'BOOKING_FLOW',
        draft,
      });

      await sendStep9ConfirmationPrompt(chatId, draft);
      return { processed: true };
    }

    // Step 9 text fallback
    if (convo.currentStep === 'STEP_9_CONFIRM') {
      await sendStep9ConfirmationPrompt(chatId, draft);
      return { processed: true };
    }
  }

  return { processed: true };
}

async function sendStep9ConfirmationPrompt(chatId: string, draft: BookingDraftData) {
  const summary = [
    '📋 BƯỚC 9/9 — XÁC NHẬN THÔNG TIN ĐẶT DỊCH VỤ',
    '────────────────────',
    `🛠 Dịch vụ: ${draft.serviceName || 'Tư vấn giải pháp'}`,
    `👤 Họ và tên: ${draft.fullName}`,
    `📞 Số điện thoại: ${draft.phone}`,
    `✉️ Email: ${draft.email || 'Chưa cung cấp'}`,
    `📌 Tên dự án: ${draft.projectTitle}`,
    `📝 Mô tả nhu cầu: ${draft.projectDescription}`,
    `💰 Ngân sách dự kiến: ${draft.budgetRange}`,
    `🗓 Thời gian bắt đầu: ${draft.preferredStartDate}`,
    '────────────────────',
    'Vui lòng kiểm tra lại thông tin và bấm "✅ Xác nhận gửi" bên dưới:',
  ].join('\n');

  await sendTelegramMessage(chatId, summary, {
    inline_keyboard: [
      [
        { text: '✅ Xác nhận gửi yêu cầu', callback_data: 'booking:submit' },
      ],
      [
        { text: '✏️ Nhập lại từ đầu', callback_data: 'booking:edit' },
        { text: '❌ Hủy yêu cầu', callback_data: 'booking:cancel' },
      ],
    ],
  });
}
