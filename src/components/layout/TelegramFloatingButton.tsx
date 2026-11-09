"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Send } from "lucide-react";

export default function TelegramFloatingButton() {
  const pathname = usePathname();

  if (pathname?.toLowerCase().startsWith("/admin")) {
    return null;
  }

  const botUsername =
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "nguyenangency_bot";

  return (
    <a
      href={`https://t.me/${botUsername}?start=website`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Tư vấn & Đặt dịch vụ qua Telegram Bot"
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 px-4 py-3 rounded-full bg-[#121212]/90 backdrop-blur-md border border-[#007BA7] hover:border-[#FF2D95] text-white shadow-2xl transition-all duration-300 hover:scale-105"
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#007BA7] text-white">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#007BA7] opacity-40" />
        <Send className="w-4 h-4 relative z-10" />
      </span>
      <div className="hidden sm:flex flex-col pr-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#38BDF8] leading-none mb-0.5">
          TELEGRAM BOT 24/7
        </span>
        <span className="text-xs font-bold text-white leading-tight">
          Đặt dịch vụ & Báo giá
        </span>
      </div>
    </a>
  );
}

