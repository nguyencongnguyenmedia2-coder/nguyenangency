"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  Send,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Webhook,
  Database,
  Users,
  CalendarCheck,
  MessageSquare,
  Bell,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import {
  sendTestTelegramNotificationAction,
  setupTelegramWebhookAction,
  retryFailedTelegramNotificationAction,
  saveTelegramAdminAction,
  toggleTelegramAdminStatusAction,
} from "@/app/actions/admin-booking-actions";

interface TelegramManagerProps {
  botStatus: {
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
  };
  supabaseStatus: {
    connected: boolean;
    url: string | null;
    hasServiceRole: boolean;
    message: string;
  };
  telegramAdmins: Array<{
    id: string;
    telegramUserId: string;
    telegramUsername: string | null;
    fullName: string;
    role: string;
    isActive: boolean;
    createdAt: string;
  }>;
  telegramCustomers: Array<{
    id: string;
    code: string;
    name: string;
    phone: string | null;
    email: string;
    telegramUserId: string | null;
    telegramUsername: string | null;
    source: string;
    createdAt: string;
  }>;
  telegramBookings: Array<{
    id: string;
    bookingCode: string;
    serviceName: string;
    projectTitle: string;
    budgetRange: string | null;
    status: string;
    createdAt: string;
    customerName: string;
  }>;
  conversations: Array<{
    id: string;
    telegramUserId: string;
    telegramUsername: string | null;
    chatId: string;
    currentStep: string;
    conversationState: string;
    updatedAt: string;
  }>;
  telegramNotifications: Array<{
    id: string;
    title: string;
    message: string;
    deliveryStatus: string;
    errorLog: string | null;
    createdAt: string;
  }>;
  defaultWebhookUrl: string;
}

export default function TelegramManagerClient({
  botStatus,
  supabaseStatus,
  telegramAdmins,
  telegramCustomers,
  telegramBookings,
  conversations,
  telegramNotifications,
  defaultWebhookUrl,
}: TelegramManagerProps) {
  const [webhookInput, setWebhookInput] = useState(
    botStatus.webhookUrl || defaultWebhookUrl
  );
  const [activeTab, setActiveTab] = useState<
    "ADMINS" | "BOOKINGS" | "CUSTOMERS" | "CONVERSATIONS" | "NOTIFICATIONS"
  >("ADMINS");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleTestNotification = () => {
    setFeedback(null);
    startTransition(async () => {
      const res = await sendTestTelegramNotificationAction();
      setFeedback({
        type: res.success ? "success" : "error",
        text: res.message,
      });
    });
  };

  const handleSetupWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    startTransition(async () => {
      const res = await setupTelegramWebhookAction(webhookInput);
      setFeedback({
        type: res.success ? "success" : "error",
        text: res.message,
      });
    });
  };

  const handleRetryNotification = (id: string) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await retryFailedTelegramNotificationAction(id);
      setFeedback({
        type: res.success ? "success" : "error",
        text: res.message,
      });
    });
  };

  const handleSaveAdmin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setFeedback(null);
    startTransition(async () => {
      const res = await saveTelegramAdminAction(formData);
      setFeedback({
        type: res.success ? "success" : "error",
        text: res.message,
      });
    });
  };

  const handleToggleAdmin = (id: string, isActive: boolean) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await toggleTelegramAdminStatusAction(id, isActive);
      setFeedback({
        type: res.success ? "success" : "error",
        text: res.message,
      });
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#292929] pb-6">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-[#007BA7] block mb-1">
            TELEGRAM BOT & SUPABASE CLOUD HUB
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
            Quản Trị Telegram Bot & Đồng Bộ Dữ Liệu
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-1">
            Giám sát trạng thái Bot, Webhook, thông báo thời gian thực và phiên đặt dịch vụ 10 bước của khách hàng.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {botStatus.botUsername && (
            <a
              href={`https://t.me/${botStatus.botUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#171717] hover:bg-[#222222] text-[#38BDF8] border border-[#292929] text-xs font-mono font-bold inline-flex items-center gap-2 transition-all"
            >
              <span>@{botStatus.botUsername}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            type="button"
            disabled={isPending}
            onClick={handleTestNotification}
            className="px-5 py-2.5 rounded-xl bg-[#007BA7] hover:bg-[#008fc2] text-white text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {isPending ? "Đang gửi..." : "Test Gửi Thông Báo Telegram"}
            </span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-sm flex items-center justify-between ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-red-500/10 border-red-500/30 text-red-300"
          }`}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* System Status Cards (Telegram Bot + Supabase Cloud + Security Shield) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Telegram Bot Status */}
        <div className="p-6 rounded-3xl bg-[#121212] border border-[#292929] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#007BA7]/15 border border-[#007BA7]/40 flex items-center justify-center text-[#38BDF8]">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#A1A1AA] block">
                  TELEGRAM BOT API
                </span>
                <h3 className="text-base font-bold text-white">
                  {botStatus.botFirstName || "NGUYÊN AGENCY Bot"}
                </h3>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold border ${
                botStatus.connected
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40"
                  : "bg-red-500/15 text-red-400 border-red-500/40"
              }`}
            >
              {botStatus.connected ? "ONLINE" : "OFFLINE"}
            </span>
          </div>

          <div className="space-y-2 text-xs text-[#A1A1AA] pt-2 border-t border-[#292929]">
            <div className="flex justify-between">
              <span>Bot Username:</span>
              <span className="font-mono text-white">
                {botStatus.botUsername ? `@${botStatus.botUsername}` : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Admin Chat ID:</span>
              <span className="font-mono text-[#38BDF8]">
                {botStatus.adminChatIdMasked}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Pending Webhook Updates:</span>
              <span className="font-mono text-white">
                {botStatus.pendingUpdateCount ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Supabase Database & Storage */}
        <div className="p-6 rounded-3xl bg-[#121212] border border-[#292929] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#A1A1AA] block">
                  SUPABASE DATABASE & STORAGE
                </span>
                <h3 className="text-base font-bold text-white">
                  Single Source of Truth
                </h3>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold border ${
                supabaseStatus.connected
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40"
                  : "bg-amber-500/15 text-amber-300 border-amber-500/40"
              }`}
            >
              {supabaseStatus.connected ? "CONNECTED" : "LOCAL / STANDBY"}
            </span>
          </div>

          <div className="space-y-2 text-xs text-[#A1A1AA] pt-2 border-t border-[#292929]">
            <div className="flex justify-between">
              <span>Project Endpoint:</span>
              <span className="font-mono text-white truncate max-w-[180px]">
                {supabaseStatus.url || "Chưa cấu hình"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Storage Buckets:</span>
              <span className="font-mono text-emerald-400">
                4 Buckets (RLS Active)
              </span>
            </div>
            <div className="flex justify-between">
              <span>Trạng thái:</span>
              <span className="font-mono text-white truncate max-w-[190px]">
                {supabaseStatus.message}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Webhook & Security Configuration */}
        <div className="p-6 rounded-3xl bg-[#121212] border border-[#292929] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FF2D95]/15 border border-[#FF2D95]/40 flex items-center justify-center text-[#FF2D95]">
                <Webhook className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#A1A1AA] block">
                  WEBHOOK & IDEMPOTENCY
                </span>
                <h3 className="text-base font-bold text-white">
                  /api/telegram/webhook
                </h3>
              </div>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>

          <form onSubmit={handleSetupWebhook} className="space-y-2.5 pt-1">
            <label className="text-[11px] font-mono text-[#A1A1AA] block">
              HTTPS Webhook Endpoint:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={webhookInput}
                onChange={(e) => setWebhookInput(e.target.value)}
                placeholder="https://your-domain.com/api/telegram/webhook"
                className="flex-1 px-3 py-2 rounded-xl bg-[#171717] border border-[#292929] text-xs font-mono text-white"
              />
              <button
                type="submit"
                disabled={isPending}
                className="px-3.5 py-2 rounded-xl bg-[#007BA7] hover:bg-[#008fc2] text-white text-xs font-mono font-bold shrink-0"
              >
                Set
              </button>
            </div>
            <p className="text-[10px] text-[#71717A] font-mono">
              * Bảo vệ bằng X-Telegram-Bot-Api-Secret-Token & chống trùng lặp update_id. Token được ẩn hoàn toàn trên Server.
            </p>
          </form>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#292929] pb-4">
        {[
          {
            id: "ADMINS",
            label: `Quản trị viên Telegram (${telegramAdmins.length})`,
            icon: ShieldCheck,
          },
          {
            id: "BOOKINGS",
            label: `Booking từ Telegram (${telegramBookings.length})`,
            icon: CalendarCheck,
          },
          {
            id: "CUSTOMERS",
            label: `Khách hàng Telegram (${telegramCustomers.length})`,
            icon: Users,
          },
          {
            id: "CONVERSATIONS",
            label: `Hội thoại Bot (${conversations.length})`,
            icon: MessageSquare,
          },
          {
            id: "NOTIFICATIONS",
            label: `Lịch sử gửi thông báo (${telegramNotifications.length})`,
            icon: Bell,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                setActiveTab(
                  tab.id as
                    | "ADMINS"
                    | "BOOKINGS"
                    | "CUSTOMERS"
                    | "CONVERSATIONS"
                    | "NOTIFICATIONS"
                )
              }
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold inline-flex items-center gap-2 border transition-all ${
                isActive
                  ? "bg-[#007BA7] text-white border-[#007BA7]"
                  : "bg-[#121212] text-[#A1A1AA] hover:text-white border-[#292929]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content 0: Telegram Admins RBAC */}
      {activeTab === "ADMINS" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-6 rounded-3xl bg-[#121212] border border-[#292929] space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#007BA7] block">
                TELEGRAM RBAC (SECTION 9)
              </span>
              <h3 className="text-base font-bold text-white uppercase mt-0.5">
                Cấp Quyền Quản Trị Viên Trên Telegram
              </h3>
              <p className="text-xs text-[#A1A1AA] mt-1">
                Xác thực nghiêm ngặt theo Telegram User ID (không dùng Username làm căn cứ xác thực).
              </p>
            </div>

            <form onSubmit={handleSaveAdmin} className="space-y-3.5">
              <div>
                <label className="text-xs font-mono text-[#A1A1AA] block mb-1">
                  Telegram User ID (Số nguyên) *
                </label>
                <input
                  name="telegramUserId"
                  required
                  placeholder="VD: 8093505246"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-xs font-mono text-white"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-[#A1A1AA] block mb-1">
                  Họ và tên Quản trị viên / Nhân sự *
                </label>
                <input
                  name="fullName"
                  required
                  placeholder="VD: Trần Hoàng Nguyên"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-[#A1A1AA] block mb-1">
                    Telegram Username
                  </label>
                  <input
                    name="telegramUsername"
                    placeholder="nguyen_director"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#A1A1AA] block mb-1">
                    Vai trò (Role) *
                  </label>
                  <select
                    name="role"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-xs font-mono text-white"
                  >
                    <option value="SUPER_ADMIN">SUPER_ADMIN (Toàn quyền)</option>
                    <option value="ADMIN">ADMIN (Xác nhận, Báo giá, Dự án)</option>
                    <option value="STAFF">STAFF (Gọi KH, Cập nhật tiến độ)</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2.5 rounded-xl bg-[#007BA7] hover:bg-[#008fc2] text-white text-xs font-mono font-bold uppercase tracking-wider"
              >
                {isPending ? "Đang lưu..." : "Lưu / Cập nhật Quản trị viên"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 rounded-3xl bg-[#121212] border border-[#292929] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#292929] text-[11px] font-mono uppercase text-[#A1A1AA] bg-[#171717]">
                    <th className="py-3.5 px-5">Telegram User ID</th>
                    <th className="py-3.5 px-5">Họ tên</th>
                    <th className="py-3.5 px-5">Vai trò</th>
                    <th className="py-3.5 px-5">Trạng thái</th>
                    <th className="py-3.5 px-5">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#292929] text-xs">
                  {telegramAdmins.map((adm) => (
                    <tr key={adm.id} className="hover:bg-[#171717]/60">
                      <td className="py-4 px-5 font-mono font-bold text-[#38BDF8]">
                        {adm.telegramUserId}
                      </td>
                      <td className="py-4 px-5">
                        <div className="text-white font-semibold">{adm.fullName}</div>
                        {adm.telegramUsername && (
                          <div className="text-[11px] font-mono text-[#A1A1AA]">
                            @{adm.telegramUsername.replace(/^@/, "")}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-2.5 py-1 rounded-full bg-[#171717] border border-[#292929] font-mono text-[10px] text-[#FF2D95] font-bold">
                          {adm.role}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] ${
                            adm.isActive
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-red-500/15 text-red-400"
                          }`}
                        >
                          {adm.isActive ? "ACTIVE" : "LOCKED"}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleToggleAdmin(adm.id, !adm.isActive)}
                          className="px-3 py-1 rounded-lg bg-[#171717] hover:bg-[#292929] border border-[#292929] text-[11px] font-mono text-white"
                        >
                          {adm.isActive ? "Tạm khóa" : "Kích hoạt"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 1: Telegram Bookings */}
      {activeTab === "BOOKINGS" && (
        <div className="rounded-3xl bg-[#121212] border border-[#292929] overflow-hidden">
          {telegramBookings.length === 0 ? (
            <div className="p-10 text-center text-sm text-[#A1A1AA]">
              Chưa có yêu cầu đặt dịch vụ nào từ Telegram Bot. Hãy mở Bot và gõ /booking để trải nghiệm!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#292929] text-[11px] font-mono uppercase text-[#A1A1AA] bg-[#171717]">
                    <th className="py-3.5 px-5">Mã Booking</th>
                    <th className="py-3.5 px-5">Khách hàng</th>
                    <th className="py-3.5 px-5">Dịch vụ & Dự án</th>
                    <th className="py-3.5 px-5">Ngân sách</th>
                    <th className="py-3.5 px-5">Trạng thái</th>
                    <th className="py-3.5 px-5">Thời gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#292929] text-xs">
                  {telegramBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-[#171717]/60">
                      <td className="py-4 px-5 font-mono font-bold text-[#38BDF8]">
                        <Link
                          href={`/admin/bookings?code=${encodeURIComponent(b.bookingCode)}`}
                          className="hover:underline"
                        >
                          {b.bookingCode}
                        </Link>
                      </td>
                      <td className="py-4 px-5 text-white font-semibold">
                        {b.customerName}
                      </td>
                      <td className="py-4 px-5">
                        <div className="text-white font-bold">{b.projectTitle}</div>
                        <div className="text-[#A1A1AA]">{b.serviceName}</div>
                      </td>
                      <td className="py-4 px-5 text-[#FF2D95] font-mono">
                        {b.budgetRange || "Thỏa thuận"}
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-2.5 py-1 rounded-full bg-[#007BA7]/15 text-[#38BDF8] border border-[#007BA7]/40 font-mono text-[10px]">
                          {b.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-[#A1A1AA] font-mono">
                        {new Date(b.createdAt).toLocaleString("vi-VN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Telegram Customers */}
      {activeTab === "CUSTOMERS" && (
        <div className="rounded-3xl bg-[#121212] border border-[#292929] overflow-hidden">
          {telegramCustomers.length === 0 ? (
            <div className="p-10 text-center text-sm text-[#A1A1AA]">
              Chưa có khách hàng nào liên kết tài khoản Telegram.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#292929] text-[11px] font-mono uppercase text-[#A1A1AA] bg-[#171717]">
                    <th className="py-3.5 px-5">Mã KH</th>
                    <th className="py-3.5 px-5">Họ và tên</th>
                    <th className="py-3.5 px-5">Số điện thoại</th>
                    <th className="py-3.5 px-5">Telegram ID / Username</th>
                    <th className="py-3.5 px-5">Nguồn gốc</th>
                    <th className="py-3.5 px-5">Ngày tạo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#292929] text-xs">
                  {telegramCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-[#171717]/60">
                      <td className="py-4 px-5 font-mono text-[#007BA7] font-bold">
                        {c.code}
                      </td>
                      <td className="py-4 px-5 text-white font-semibold">
                        {c.name}
                      </td>
                      <td className="py-4 px-5 text-[#E4E4E7] font-mono">
                        {c.phone || "Chưa cập nhật"}
                      </td>
                      <td className="py-4 px-5 text-[#38BDF8] font-mono">
                        {c.telegramUsername
                          ? `@${c.telegramUsername.replace(/^@/, "")}`
                          : ""}{" "}
                        (ID: {c.telegramUserId})
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#171717] border border-[#292929] font-mono text-[10px] text-white">
                          {c.source}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-[#A1A1AA] font-mono">
                        {new Date(c.createdAt).toLocaleString("vi-VN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: Telegram 10-Step Conversations */}
      {activeTab === "CONVERSATIONS" && (
        <div className="rounded-3xl bg-[#121212] border border-[#292929] overflow-hidden">
          {conversations.length === 0 ? (
            <div className="p-10 text-center text-sm text-[#A1A1AA]">
              Chưa có phiên hội thoại Telegram nào được ghi nhận.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#292929] text-[11px] font-mono uppercase text-[#A1A1AA] bg-[#171717]">
                    <th className="py-3.5 px-5">Telegram User ID</th>
                    <th className="py-3.5 px-5">Username</th>
                    <th className="py-3.5 px-5">Chat ID</th>
                    <th className="py-3.5 px-5">Bước hiện tại (Step)</th>
                    <th className="py-3.5 px-5">Trạng thái phiên</th>
                    <th className="py-3.5 px-5">Cập nhật lúc</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#292929] text-xs">
                  {conversations.map((conv) => (
                    <tr key={conv.id} className="hover:bg-[#171717]/60">
                      <td className="py-4 px-5 font-mono text-white">
                        {conv.telegramUserId}
                      </td>
                      <td className="py-4 px-5 font-mono text-[#38BDF8]">
                        {conv.telegramUsername
                          ? `@${conv.telegramUsername}`
                          : "—"}
                      </td>
                      <td className="py-4 px-5 font-mono text-[#A1A1AA]">
                        {conv.chatId}
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-2.5 py-1 rounded-lg bg-[#0A0A0A] border border-[#292929] font-mono text-[#FF2D95]">
                          {conv.currentStep}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-mono text-white">
                        {conv.conversationState}
                      </td>
                      <td className="py-4 px-5 font-mono text-[#A1A1AA]">
                        {new Date(conv.updatedAt).toLocaleString("vi-VN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 4: Telegram Notification Logs & Retry */}
      {activeTab === "NOTIFICATIONS" && (
        <div className="space-y-3">
          {telegramNotifications.length === 0 ? (
            <div className="p-10 rounded-3xl bg-[#121212] border border-[#292929] text-center text-sm text-[#A1A1AA]">
              Chưa có lịch sử gửi thông báo Telegram nào.
            </div>
          ) : (
            telegramNotifications.map((n) => (
              <div
                key={n.id}
                className="p-5 rounded-2xl bg-[#121212] border border-[#292929] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5">
                    {n.deliveryStatus === "SENT" ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        SENT
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 text-[10px] font-mono font-bold inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        FAILED
                      </span>
                    )}
                    <span className="text-sm font-bold text-white">
                      {n.title}
                    </span>
                    <span className="text-[11px] font-mono text-[#A1A1AA]">
                      • {new Date(n.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <pre className="text-xs text-[#A1A1AA] font-sans whitespace-pre-wrap line-clamp-3 bg-[#0A0A0A] p-3 rounded-xl border border-[#292929]">
                    {n.message}
                  </pre>
                  {n.errorLog && (
                    <div className="text-xs text-red-400 font-mono">
                      ⚠️ Error Log: {n.errorLog}
                    </div>
                  )}
                </div>

                <div className="shrink-0">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleRetryNotification(n.id)}
                    className="px-4 py-2 rounded-xl bg-[#171717] hover:bg-[#007BA7] text-white border border-[#292929] text-xs font-mono font-bold inline-flex items-center gap-1.5 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Gửi lại</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

