"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Compass,
  Layers,
  Briefcase,
  Cpu,
  BookOpen,
  FileSpreadsheet,
  CheckSquare,
  FileSignature,
  Receipt,
  CreditCard,
  Image as ImageIcon,
  Bell,
  UserCog,
  Settings,
  History,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
  LayoutTemplate,
  CalendarCheck,
  Send,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/app/actions/auth";

const MENU_GROUPS = [
  {
    title: "TỔNG QUAN",
    items: [
      { label: "Bảng Điều Khiển", href: "/admin", icon: LayoutDashboard },
      { label: "Mascot Trợ Lý AI", href: "/admin/mascot", icon: Bot },
      { label: "Đặt Dịch Vụ (Bookings)", href: "/admin/bookings", icon: CalendarCheck },
      { label: "Telegram & Supabase", href: "/admin/telegram", icon: Send },
      { label: "Thông Báo", href: "/admin/notifications", icon: Bell },
    ],
  },
  {
    title: "CRM & KHÁCH HÀNG",
    items: [
      { label: "Khách Hàng", href: "/admin/customers", icon: Users },
      { label: "Leads & Tiếp Nhận", href: "/admin/leads", icon: Compass },
      { label: "Báo Giá (Quotes)", href: "/admin/quotations", icon: FileSpreadsheet },
    ],
  },
  {
    title: "DỰ ÁN & VẬN HÀNH",
    items: [
      { label: "Dự Án", href: "/admin/projects", icon: Briefcase },
      { label: "Nhiệm Vụ (Tasks)", href: "/admin/tasks", icon: CheckSquare },
      { label: "Hợp Đồng", href: "/admin/contracts", icon: FileSignature },
      { label: "Hóa Đơn", href: "/admin/invoices", icon: Receipt },
      { label: "Thanh Toán", href: "/admin/payments", icon: CreditCard },
    ],
  },
  {
    title: "QUẢN TRỊ NỘI DUNG",
    items: [
      { label: "Trang Chủ (Builder)", href: "/admin/homepage", icon: LayoutTemplate },
      { label: "Dịch Vụ (24)", href: "/admin/services", icon: Layers },
      { label: "Portfolio Dự Án", href: "/admin/portfolio", icon: Briefcase },
      { label: "Phòng LAB Số", href: "/admin/lab", icon: Cpu },
      { label: "Tin Tức & Blog", href: "/admin/blog", icon: BookOpen },
      { label: "Thư Viện Media", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    title: "HỆ THỐNG",
    items: [
      { label: "Người Dùng & Quyền", href: "/admin/users", icon: UserCog },
      { label: "Cấu Hình Website", href: "/admin/settings", icon: Settings },
      { label: "Nhật Ký (Audit Log)", href: "/admin/activity-logs", icon: History },
    ],
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export default function AdminSidebarLayout({ children, user }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // If on login page, render clean container without sidebar
  if (pathname?.toLowerCase() === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 bg-[#121212] border-r border-[#292929] flex flex-col justify-between transition-all duration-300",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-[#292929]">
            <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#007BA7] to-[#FF2D95] p-[1.5px] shrink-0">
                <div className="w-full h-full bg-[#0A0A0A] rounded-[10px] flex items-center justify-center font-extrabold text-sm text-white">
                  N.
                </div>
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="font-bold tracking-wider text-xs text-white uppercase whitespace-nowrap">
                    NGUYÊN CRM
                  </span>
                  <span className="text-[9px] font-mono tracking-widest text-[#71717A] uppercase">
                    HỆ THỐNG ĐIỀU HÀNH
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-[#71717A] hover:text-white hover:bg-[#171717] transition-colors"
              title={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-[#71717A] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items List */}
          <div className="overflow-y-auto max-h-[calc(100vh-140px)] px-3 py-4 space-y-6">
            {MENU_GROUPS.map((group, idx) => (
              <div key={idx} className="space-y-1">
                {!collapsed && (
                  <span className="px-3 text-[10px] font-mono tracking-widest text-[#71717A] uppercase block mb-1.5">
                    {group.title}
                  </span>
                )}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin" || pathname === "/Admin"
                      : pathname?.toLowerCase() === item.href.toLowerCase();

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative",
                        isActive
                          ? "bg-gradient-to-r from-[#007BA7]/20 to-[#FF2D95]/10 text-white border border-[#007BA7]/40 font-semibold"
                          : "text-[#A1A1AA] hover:text-white hover:bg-[#171717]"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition-colors",
                          isActive ? "text-[#007BA7]" : "text-[#71717A] group-hover:text-white"
                        )}
                      />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* User Footer Profile */}
        <div className="p-3 border-t border-[#292929] bg-[#0A0A0A]/50">
          <div className={cn("flex items-center gap-2.5", collapsed && "justify-center")}>
            <div className="w-8 h-8 rounded-lg bg-[#202020] border border-[#292929] flex items-center justify-center font-bold text-xs text-white shrink-0">
              {user.name.charAt(0)}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-white block truncate">{user.name}</span>
                <span className="text-[10px] font-mono text-[#007BA7] block truncate">
                  {user.role}
                </span>
              </div>
            )}
            <form action={logoutUser}>
              <button
                type="submit"
                className="p-1.5 rounded-lg text-[#71717A] hover:text-red-400 hover:bg-[#171717] transition-colors"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300",
          collapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        {/* Top Navbar */}
        <header className="h-16 px-6 bg-[#121212]/80 backdrop-blur-md border-b border-[#292929] sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#171717]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono text-[#71717A] uppercase tracking-wider hidden sm:inline">
              NỀN TẢNG QUẢN TRỊ NỘI BỘ • BẢO MẬT TUYỆT ĐỐI
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-[#007BA7] px-2.5 py-1 rounded-md bg-[#007BA7]/10 border border-[#007BA7]/30">
              {user.email}
            </span>
          </div>
        </header>

        {/* Page Container */}
        <main className="p-6 md:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}

