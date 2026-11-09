import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Bell, Send, CheckCircle2, AlertTriangle } from "lucide-react";
import { formatDateVN } from "@/lib/utils";

export const metadata = {
  title: "Thông Báo Hệ Thống & Telegram – NGUYÊN CRM",
};

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            NOTIFICATION CENTER (TRUNG TÂM THÔNG BÁO)
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Cảnh báo thời gian thực về Đặt dịch vụ mới, Lead, Telegram Bot Alerts và trạng thái dự án.
          </p>
        </div>
        <Link
          href="/admin/telegram"
          className="px-4 py-2.5 rounded-xl bg-[#007BA7] hover:bg-[#008fc2] text-white text-xs font-mono font-bold uppercase inline-flex items-center gap-2 self-start"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Quản lý & Retry Telegram</span>
        </Link>
      </div>

      <div className="p-8 rounded-3xl bg-[#121212] border border-[#292929] space-y-4">
        {notifications.length === 0 ? (
          <p className="text-xs text-[#71717A] text-center py-8">Chưa có thông báo nào.</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="p-5 rounded-2xl bg-[#171717] border border-[#292929] flex items-start gap-4 text-xs"
            >
              <div
                className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  n.channel === "TELEGRAM"
                    ? "bg-[#007BA7]/20 text-[#38BDF8]"
                    : "bg-[#FF2D95]/15 text-[#FF2D95]"
                }`}
              >
                {n.channel === "TELEGRAM" ? (
                  <Send className="w-4 h-4" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#0A0A0A] border border-[#292929] font-mono text-[10px] text-[#38BDF8]">
                      {n.channel}
                    </span>
                    {n.deliveryStatus === "SENT" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        SENT
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-red-400">
                        <AlertTriangle className="w-3 h-3" />
                        {n.deliveryStatus}
                      </span>
                    )}
                    <strong className="text-white text-sm">{n.title}</strong>
                  </div>
                  <span className="text-[10px] font-mono text-[#71717A]">
                    {formatDateVN(n.createdAt)}
                  </span>
                </div>
                <p className="text-[#A1A1AA] whitespace-pre-line">{n.message}</p>
                {n.errorLog && (
                  <p className="text-red-400 font-mono text-[11px]">
                    ⚠️ Error Log: {n.errorLog}
                  </p>
                )}
                {n.link && (
                  <Link
                    href={n.link}
                    className="inline-block text-[11px] font-mono text-[#007BA7] hover:underline pt-1"
                  >
                    Mở chi tiết yêu cầu →
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
