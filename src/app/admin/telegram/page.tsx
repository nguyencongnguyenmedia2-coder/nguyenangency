import React from "react";
import prisma from "@/lib/prisma";
import { getTelegramBotStatus } from "@/lib/telegram-notifier";
import { checkSupabaseConnection } from "@/lib/supabase";
import { ensureDefaultSuperAdmin } from "@/lib/telegram-admin-rbac";
import TelegramManagerClient from "@/components/admin/TelegramManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminTelegramPage() {
  await ensureDefaultSuperAdmin();

  const [
    botStatus,
    supabaseStatus,
    telegramAdmins,
    telegramCustomers,
    telegramBookings,
    conversations,
    telegramNotifications,
  ] = await Promise.all([
    getTelegramBotStatus(),
    checkSupabaseConnection(),
    prisma.telegramAdmin.findMany({
      orderBy: { createdAt: "asc" },
    }),
    prisma.customer.findMany({
      where: {
        OR: [{ source: "TELEGRAM" }, { telegramUserId: { not: null } }],
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.serviceBooking.findMany({
      where: { source: "TELEGRAM" },
      include: {
        customer: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.telegramConversation.findMany({
      orderBy: { updatedAt: "desc" },
      take: 50,
    }),
    prisma.notification.findMany({
      where: { channel: "TELEGRAM" },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://nguyenagency.vn").replace(
    /\/$/,
    ""
  );
  const defaultWebhookUrl = `${siteUrl}/api/telegram/webhook`;

  return (
    <TelegramManagerClient
      botStatus={botStatus}
      supabaseStatus={supabaseStatus}
      telegramAdmins={telegramAdmins.map((a) => ({
        id: a.id,
        telegramUserId: a.telegramUserId,
        telegramUsername: a.telegramUsername,
        fullName: a.fullName,
        role: a.role,
        isActive: a.isActive,
        createdAt: a.createdAt.toISOString(),
      }))}
      telegramCustomers={telegramCustomers.map((c) => ({
        id: c.id,
        code: c.code,
        name: c.name,
        phone: c.phone,
        email: c.email,
        telegramUserId: c.telegramUserId,
        telegramUsername: c.telegramUsername,
        source: c.source,
        createdAt: c.createdAt.toISOString(),
      }))}
      telegramBookings={telegramBookings.map((b) => ({
        id: b.id,
        bookingCode: b.bookingCode,
        serviceName: b.serviceName,
        projectTitle: b.projectTitle,
        budgetRange: b.budgetRange,
        status: b.status,
        createdAt: b.createdAt.toISOString(),
        customerName: b.customer.name,
      }))}
      conversations={conversations.map((conv) => ({
        id: conv.id,
        telegramUserId: conv.telegramUserId,
        telegramUsername: conv.telegramUsername,
        chatId: conv.chatId,
        currentStep: conv.currentStep,
        conversationState: conv.conversationState,
        updatedAt: conv.updatedAt.toISOString(),
      }))}
      telegramNotifications={telegramNotifications.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        deliveryStatus: n.deliveryStatus,
        errorLog: n.errorLog,
        createdAt: n.createdAt.toISOString(),
      }))}
      defaultWebhookUrl={defaultWebhookUrl}
    />
  );
}
