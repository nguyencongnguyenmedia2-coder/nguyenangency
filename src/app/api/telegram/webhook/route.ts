import { NextRequest, NextResponse } from 'next/server';
import { handleTelegramUpdate, TelegramUpdate } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const configuredSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
    const headerSecret = req.headers.get('x-telegram-bot-api-secret-token');

    if (configuredSecret && headerSecret !== configuredSecret) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized: Invalid Telegram Webhook Secret Token' },
        { status: 401 }
      );
    }

    const body = (await req.json()) as TelegramUpdate;
    const result = await handleTelegramUpdate(body);

    return NextResponse.json({
      ok: true,
      processed: result.processed,
      reason: result.reason || 'OK',
    });
  } catch (error) {
    console.error('[TelegramWebhook] Error processing update:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Internal webhook error',
      },
      { status: 200 } // Return 200 to prevent endless Telegram webhook retry storms on malformed payloads
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: '/api/telegram/webhook',
    status: 'READY',
    botConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN),
  });
}

