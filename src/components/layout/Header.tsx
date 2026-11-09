"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Trang Chủ", href: "/" },
  { label: "Giới Thiệu", href: "/about" },
  { label: "Dịch Vụ", href: "/services" },
  { label: "Dự Án", href: "/portfolio" },
  { label: "Phòng LAB", href: "/lab", badge: "AI & SaaS" },
  { label: "Bảng Giá", href: "/pricing" },
  { label: "Bài Viết", href: "/blog" },
  { label: "Liên Hệ", href: "/contact" },
];

export default function Header({
  brandName = "NGUYÊN AGENCY",
  brandTagline = "VƯỢT CHUẨN SỐ HÓA",
}: {
  brandName?: string;
  brandTagline?: string;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isAdminRoute = pathname?.toLowerCase().startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // If inside /admin or /Admin, public header should not render
  if (isAdminRoute) return null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-[#292929] py-3.5 shadow-2xl"
          : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Monogram & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#007BA7] to-[#FF2D95] p-[1.5px] transition-transform group-hover:scale-105 duration-300">
            <div className="w-full h-full bg-[#0A0A0A] rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-lg tracking-wider text-white">
                {brandName.charAt(0)}.
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-[0.2em] text-sm text-white group-hover:text-[#007BA7] transition-colors uppercase">
              {brandName}
            </span>
            <span className="text-[10px] tracking-widest text-[#71717A] uppercase font-mono">
              {brandTagline}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#121212]/80 px-4 py-1.5 rounded-full border border-[#292929]">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all relative flex items-center gap-1.5",
                  isActive
                    ? "text-white bg-[#202020] shadow-sm"
                    : "text-[#A1A1AA] hover:text-white hover:bg-[#171717]"
                )}
              >
                {item.label}
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#007BA7]/30 to-[#FF2D95]/30 border border-[#007BA7]/40 text-[#FF2D95] font-mono">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Button: Strictly Start a Project */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/contact"
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:shadow-glow-pink hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Khởi Tạo Dự Án</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#171717] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-[#0A0A0A]/95 backdrop-blur-2xl border-b border-[#292929] px-6 py-8 flex flex-col gap-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between",
                  pathname === item.href
                    ? "bg-[#202020] text-white font-semibold"
                    : "text-[#A1A1AA] hover:text-white hover:bg-[#171717]"
                )}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF2D95]/20 text-[#FF2D95] font-mono">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-[#292929] flex flex-col gap-3">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3.5 rounded-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-semibold text-xs uppercase tracking-wider"
            >
              Khởi Tạo Dự Án <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
