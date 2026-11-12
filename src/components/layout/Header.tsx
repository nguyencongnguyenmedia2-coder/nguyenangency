"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Phone, Sparkles, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Trang Chủ", href: "/" },
  { label: "Giới Thiệu", href: "/about" },
  { label: "Dịch Vụ", href: "/services" },
  { label: "Dự Án", href: "/portfolio" },
  { label: "Phòng LAB", href: "/lab", badge: "AI & 3D" },
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
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isAdminRoute) return null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-[#06070B]/90 backdrop-blur-2xl border-b border-white/[0.08] py-3 shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
          : "bg-transparent py-4 sm:py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo & Live Status */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center group shrink-0">
            <div className="relative transition-all duration-300 group-hover:scale-[1.02] group-hover:brightness-110">
              {/* Desktop logo */}
              <Image
                src="/images/logo.png"
                alt="NGUYÊN AGENCY"
                width={260}
                height={87}
                className="hidden sm:block h-12 md:h-14 w-auto object-contain drop-shadow-[0_4px_16px_rgba(0,163,255,0.25)]"
                priority
              />
              {/* Mobile logo */}
              <Image
                src="/images/logo.png"
                alt="NGUYÊN AGENCY"
                width={150}
                height={50}
                className="sm:hidden h-10 w-auto object-contain drop-shadow-md"
                priority
              />
            </div>
          </Link>

          {/* Live Availability Badge on Desktop */}
          <div className="hidden xl:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E131F]/80 border border-[#00E5FF]/25 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-[10px] font-mono font-medium text-emerald-300 tracking-wider uppercase">
              Nhận Dự Án Mới
            </span>
          </div>
        </div>

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#0E1017]/85 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all relative flex items-center gap-1.5 group",
                  isActive
                    ? "text-white bg-gradient-to-r from-[#00A3FF]/25 to-[#FF2D95]/25 border border-[#00E5FF]/40 shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                    : "text-[#A1A1AA] hover:text-white hover:bg-white/[0.05]"
                )}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-gradient-to-r from-[#00E5FF]/20 to-[#FF2D95]/20 border border-[#FF2D95]/40 text-[#FF2D95] font-mono font-bold leading-tight">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons: Hotline & Primary Quote CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="tel:0344979307"
            className="hidden xl:inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#121622]/80 hover:bg-[#181E2E] border border-white/10 hover:border-[#00E5FF]/40 text-xs font-mono text-[#D4D4D8] hover:text-white transition-all backdrop-blur-md group"
          >
            <Phone className="w-3.5 h-3.5 text-[#00E5FF] group-hover:animate-pulse" />
            <span>0344 979 307</span>
          </a>

          <Link
            href="/contact"
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#00A3FF] via-[#007BA7] to-[#FF2D95] text-white text-xs font-bold tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,45,149,0.5)] hover:scale-[1.03] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 text-white/90 animate-pulse" />
            <span>Nhận Báo Giá 2P</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-[#A1A1AA] hover:text-white bg-[#121622]/80 border border-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Fullscreen Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[68px] bottom-0 bg-[#06070B]/98 backdrop-blur-3xl border-b border-white/10 px-6 py-6 flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0E131F] border border-[#00E5FF]/25 mb-3 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-mono text-emerald-300 uppercase font-semibold">
                Sẵn sàng nhận dự án mới
              </span>
            </div>

            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-2xl text-sm font-medium flex items-center justify-between transition-all",
                  pathname === item.href
                    ? "bg-gradient-to-r from-[#00A3FF]/20 to-[#FF2D95]/20 text-white font-bold border border-[#00E5FF]/30"
                    : "text-[#D4D4D8] hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF2D95]/20 text-[#FF2D95] font-mono font-bold">
                    {item.badge}
                  </span>
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-[#71717A]" />
                )}
              </Link>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col gap-3 mt-4">
            <div className="grid grid-cols-2 gap-2.5 text-center text-xs">
              <a
                href="tel:0344979307"
                className="py-3 px-3 rounded-xl bg-[#121622] border border-white/10 text-white font-mono flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>0344 979 307</span>
              </a>
              <Link
                href="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-3 rounded-xl bg-[#121622] border border-white/10 text-white font-mono flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>24 Dịch Vụ</span>
              </Link>
            </div>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3.5 rounded-full bg-gradient-to-r from-[#00A3FF] via-[#007BA7] to-[#FF2D95] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-500/25"
            >
              <span>Nhận Báo Giá Dự Án 2 Phút</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
