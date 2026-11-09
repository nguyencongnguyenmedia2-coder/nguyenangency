import React from "react";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  Clock,
  Compass,
  CalendarCheck,
  Send,
  Globe,
} from "lucide-react";
import { formatCurrencyVND } from "@/lib/utils";

export const metadata = {
  title: "Dashboard – NGUYÊN CRM",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getCurrentUser();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  let totalCustomers = 0;
  let websiteCustomers = 0;
  let telegramCustomers = 0;
  let newCustomersThisMonth = 0;
  let totalBookings = 0;
  let bookingsToday = 0;
  let websiteBookings = 0;
  let telegramBookings = 0;
  let pendingBookings = 0;
  let totalLeads = 0;
  let inProgressLeads = 0;
  let totalQuotations = 0;
  let pendingQuotations = 0;
  let activeProjects = 0;
  let completedProjects = 0;
  let paidInvoices: { totalAmount: number }[] = [];
  let unpaidInvoices: { totalAmount: number }[] = [];
  let recentBookings: any[] = [];
  let recentLeads: any[] = [];

  try {
    const results = await Promise.all([
      prisma.customer.count({ where: { deletedAt: null } }),
      prisma.customer.count({ where: { source: "WEBSITE", deletedAt: null } }),
      prisma.customer.count({
        where: {
          OR: [{ source: "TELEGRAM" }, { telegramUserId: { not: null } }],
          deletedAt: null,
        },
      }),
      prisma.customer.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      prisma.serviceBooking.count(),
      prisma.serviceBooking.count({
        where: { createdAt: { gte: startOfToday } },
      }),
      prisma.serviceBooking.count({ where: { source: "WEBSITE" } }),
      prisma.serviceBooking.count({ where: { source: "TELEGRAM" } }),
      prisma.serviceBooking.count({
        where: { status: { in: ["NEW", "CONFIRMED", "CONSULTING"] } },
      }),
      prisma.lead.count(),
      prisma.lead.count({
        where: {
          stage: { in: ["NEW_LEAD", "CONTACTED", "QUALIFIED", "PROPOSAL", "NEGOTIATION"] },
        },
      }),
      prisma.quotation.count(),
      prisma.quotation.count({
        where: { status: { in: ["NEW", "REVIEWING", "NEGOTIATING"] } },
      }),
      prisma.project.count({ where: { status: "IN_PROGRESS" } }),
      prisma.project.count({ where: { status: "COMPLETED" } }),
      prisma.invoice.findMany({ where: { status: "PAID" }, select: { totalAmount: true } }),
      prisma.invoice.findMany({
        where: { status: { in: ["UNPAID", "PARTIAL", "OVERDUE"] } },
        select: { totalAmount: true },
      }),
      prisma.serviceBooking.findMany({
        take: 6,
        include: {
          customer: { select: { name: true, phone: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.lead.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    totalCustomers = results[0];
    websiteCustomers = results[1];
    telegramCustomers = results[2];
    newCustomersThisMonth = results[3];
    totalBookings = results[4];
    bookingsToday = results[5];
    websiteBookings = results[6];
    telegramBookings = results[7];
    pendingBookings = results[8];
    totalLeads = results[9];
    inProgressLeads = results[10];
    totalQuotations = results[11];
    pendingQuotations = results[12];
    activeProjects = results[13];
    completedProjects = results[14];
    paidInvoices = results[15];
    unpaidInvoices = results[16];
    recentBookings = results[17];
    recentLeads = results[18];
  } catch (error) {
    console.error("Dashboard DB fetch fallback active:", error);
  }

  const totalRevenue = paidInvoices.reduce((acc, cur) => acc + cur.totalAmount, 0);
  const totalOutstanding = unpaidInvoices.reduce((acc, cur) => acc + cur.totalAmount, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-[#121212] border border-[#292929] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#007BA7]/20 text-[#007BA7] border border-[#007BA7]/30 uppercase font-bold">
              {session?.role || "ADMIN"} CONSOLE
            </span>
            <span className="text-xs font-mono text-[#71717A]">
              SUPABASE + TELEGRAM BOT + WEBSITE + CRM
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
            TỔNG QUAN KINH DOANH & ĐIỀU HÀNH
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Đồng bộ dữ liệu duy nhất giữa Website NGUYÊN AGENCY, Telegram Bot và CRM Admin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/telegram"
            className="px-4 py-2.5 rounded-xl bg-[#171717] hover:bg-[#222222] text-[#38BDF8] border border-[#292929] text-xs font-mono uppercase font-bold tracking-wider inline-flex items-center gap-2 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram Bot Hub</span>
          </Link>
          <Link
            href="/admin/bookings"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white text-xs font-mono uppercase font-bold tracking-wider hover:shadow-glow-pink transition-all"
          >
            Quản Lý Đặt Dịch Vụ ({totalBookings})
          </Link>
        </div>
      </div>

      {/* Omnichannel Highlight Strip (Website vs Telegram Bot) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#121212] border border-[#007BA7]/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#38BDF8] block">
              BOOKING HÔM NAY
            </span>
            <span className="text-2xl font-black font-mono text-white">
              {bookingsToday}
            </span>
            <span className="text-[11px] font-mono text-[#A1A1AA] block mt-0.5">
              Tổng cộng: {totalBookings} yêu cầu
            </span>
          </div>
          <CalendarCheck className="w-8 h-8 text-[#007BA7]" />
        </div>

        <div className="p-5 rounded-2xl bg-[#121212] border border-[#292929] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block">
              NGUỒN WEBSITE
            </span>
            <span className="text-2xl font-black font-mono text-white">
              {websiteBookings} Bookings
            </span>
            <span className="text-[11px] font-mono text-[#A1A1AA] block mt-0.5">
              {websiteCustomers} khách hàng Website
            </span>
          </div>
          <Globe className="w-8 h-8 text-emerald-400" />
        </div>

        <div className="p-5 rounded-2xl bg-[#121212] border border-[#292929] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#38BDF8] block">
              NGUỒN TELEGRAM BOT
            </span>
            <span className="text-2xl font-black font-mono text-[#38BDF8]">
              {telegramBookings} Bookings
            </span>
            <span className="text-[11px] font-mono text-[#A1A1AA] block mt-0.5">
              {telegramCustomers} khách hàng Telegram
            </span>
          </div>
          <Send className="w-8 h-8 text-[#38BDF8]" />
        </div>

        <div className="p-5 rounded-2xl bg-[#121212] border border-[#FF2D95]/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF2D95] block">
              BOOKING ĐANG XỬ LÝ
            </span>
            <span className="text-2xl font-black font-mono text-[#FF2D95]">
              {pendingBookings}
            </span>
            <span className="text-[11px] font-mono text-[#A1A1AA] block mt-0.5">
              NEW / CONFIRMED / CONSULTING
            </span>
          </div>
          <Clock className="w-8 h-8 text-[#FF2D95]" />
        </div>
      </div>

      {/* 10 Core Business Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-[#171717] border border-[#292929]">
          <span className="text-[10px] font-mono text-[#71717A] uppercase block mb-1">
            01 • Tổng Khách Hàng
          </span>
          <span className="text-2xl font-black font-mono text-white">{totalCustomers}</span>
          <span className="text-[10px] font-mono text-emerald-400 block mt-1">
            +{newCustomersThisMonth} trong tháng này
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#171717] border border-[#292929]">
          <span className="text-[10px] font-mono text-[#71717A] uppercase block mb-1">
            02 • Đặt Dịch Vụ (Bookings)
          </span>
          <span className="text-2xl font-black font-mono text-[#007BA7]">{totalBookings}</span>
          <span className="text-[10px] font-mono text-[#71717A] block mt-1">
            Website ({websiteBookings}) • Telegram ({telegramBookings})
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#171717] border border-[#292929]">
          <span className="text-[10px] font-mono text-[#71717A] uppercase block mb-1">
            03 • Tổng Leads
          </span>
          <span className="text-2xl font-black font-mono text-[#FF2D95]">{totalLeads}</span>
          <span className="text-[10px] font-mono text-emerald-400 block mt-1">
            Đồng bộ tự động 100%
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#171717] border border-[#292929]">
          <span className="text-[10px] font-mono text-[#71717A] uppercase block mb-1">
            04 • Leads Active
          </span>
          <span className="text-2xl font-black font-mono text-white">{inProgressLeads}</span>
          <span className="text-[10px] font-mono text-[#007BA7] block mt-1">Trong Pipeline CRM</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#171717] border border-[#292929]">
          <span className="text-[10px] font-mono text-[#71717A] uppercase block mb-1">
            05 • Tổng Báo Giá
          </span>
          <span className="text-2xl font-black font-mono text-white">{totalQuotations}</span>
          <span className="text-[10px] font-mono text-[#71717A] block mt-1">Hệ thống tạo lập</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#171717] border border-[#292929]">
          <span className="text-[10px] font-mono text-[#71717A] uppercase block mb-1">
            06 • Báo Giá Chờ Duyệt
          </span>
          <span className="text-2xl font-black font-mono text-amber-400">{pendingQuotations}</span>
          <span className="text-[10px] font-mono text-[#71717A] block mt-1">Đang đàm phán</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#171717] border border-[#292929]">
          <span className="text-[10px] font-mono text-[#71717A] uppercase block mb-1">
            07 • Dự Án Đang Chạy
          </span>
          <span className="text-2xl font-black font-mono text-[#007BA7]">{activeProjects}</span>
          <span className="text-[10px] font-mono text-[#71717A] block mt-1">Đang tiến hành sprint</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#171717] border border-[#292929]">
          <span className="text-[10px] font-mono text-[#71717A] uppercase block mb-1">
            08 • Dự Án Hoàn Thành
          </span>
          <span className="text-2xl font-black font-mono text-emerald-400">{completedProjects}</span>
          <span className="text-[10px] font-mono text-[#71717A] block mt-1">Đã bàn giao UAT</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#171717] border border-[#292929]">
          <span className="text-[10px] font-mono text-[#71717A] uppercase block mb-1">
            09 • Thực Thu Đã Nhận
          </span>
          <span className="text-lg font-black font-mono text-emerald-400 block truncate">
            {formatCurrencyVND(totalRevenue)}
          </span>
          <span className="text-[10px] font-mono text-[#71717A] block mt-1">Đã quyết toán hóa đơn</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#171717] border border-[#292929]">
          <span className="text-[10px] font-mono text-[#71717A] uppercase block mb-1">
            10 • Công Nợ Dự Kiến
          </span>
          <span className="text-lg font-black font-mono text-amber-400 block truncate">
            {formatCurrencyVND(totalOutstanding)}
          </span>
          <span className="text-[10px] font-mono text-[#71717A] block mt-1">Chờ thanh toán đợt sau</span>
        </div>
      </div>

      {/* Two-Column Section: Recent Service Bookings & Pipeline Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Service Bookings Live Feed */}
        <div className="p-8 rounded-3xl bg-[#121212] border border-[#292929]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-[#007BA7]" />
              Yêu Cầu Đặt Dịch Vụ Mới Nhất (Website & Telegram)
            </h3>
            <Link
              href="/admin/bookings"
              className="text-xs font-mono text-[#007BA7] hover:text-white transition-colors"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="space-y-3">
            {recentBookings.length === 0 ? (
              <p className="text-xs text-[#71717A] py-4">Chưa có yêu cầu đặt dịch vụ nào.</p>
            ) : (
              recentBookings.map((b) => (
                <Link
                  key={b.id}
                  href={`/admin/bookings?code=${encodeURIComponent(b.bookingCode)}`}
                  className="p-4 rounded-2xl bg-[#171717] border border-[#292929] hover:border-[#007BA7] flex items-center justify-between gap-4 text-xs transition-all block"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[#38BDF8] font-bold">{b.bookingCode}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#0A0A0A] border border-[#292929] text-white">
                        {b.source}
                      </span>
                      <strong className="text-white">{b.customer.name}</strong>
                    </div>
                    <p className="text-[#A1A1AA] line-clamp-1">
                      Dịch vụ: <span className="text-white">{b.serviceName}</span> • Ngân sách: {b.budgetRange || "Thỏa thuận"}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded text-[10px] font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 shrink-0">
                    {b.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* CRM Pipeline Leads Live Feed */}
        <div className="p-8 rounded-3xl bg-[#121212] border border-[#292929]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#FF2D95]" />
              Leads Đang Chăm Sóc Gần Nhất
            </h3>
            <Link
              href="/admin/leads"
              className="text-xs font-mono text-[#FF2D95] hover:text-white transition-colors"
            >
              Mở Kanban
            </Link>
          </div>

          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-4 rounded-2xl bg-[#171717] border border-[#292929] flex items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[#FF2D95] font-semibold">{lead.code}</span>
                    <strong className="text-white">{lead.name}</strong>
                    <span className="text-[10px] font-mono text-[#38BDF8]">({lead.source})</span>
                  </div>
                  <p className="text-[#A1A1AA] line-clamp-1">{lead.serviceInterest || "Yêu cầu chung"}</p>
                </div>
                <span className="px-2.5 py-1 rounded text-[10px] font-mono bg-[#007BA7]/20 text-[#007BA7] border border-[#007BA7]/30 shrink-0">
                  {lead.stage}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
