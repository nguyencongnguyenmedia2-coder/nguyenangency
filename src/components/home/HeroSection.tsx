"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Monitor,
  Megaphone,
  Layers,
  Play,
  X,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// 3D Cyber Wave & Particle Canvas (Chim bay đã được xóa 100%)
const Hero3DScene = dynamic(() => import("@/components/3d/Hero3DScene"), {
  ssr: false,
  loading: () => null,
});

const MARQUEE_ITEMS = [
  "THIẾT KẾ WEBSITE CHUẨN SEO",
  "MARKETING ONLINE & HIỆU SUẤT",
  "GIẢI PHÁP AI & AUTOMATION",
  "ĐỒ HỌA 3D WEBGL TƯƠNG TÁC",
  "BỘ NHẬN DIỆN THƯƠNG HIỆU ĐỘC BẢN",
  "HẠ TẦNG CLOUD TỐC ĐỘ CAO",
  "ỨNG DỤNG DOANH NGHIỆP MAY ĐO",
  "TĂNG TRƯỞNG & CHUYỂN ĐỔI SỐ BỀN VỮNG",
];

export default function HeroSection({ sectionData }: { sectionData?: any }) {
  const subtitle =
    sectionData?.subtitle || "Digital Creative & Tech Solutions";
  const title = sectionData?.title || "VƯỢT CHUẨN SỐ HOÁ";
  const description =
    sectionData?.description ||
    "Đối tác sáng tạo & công nghệ, đồng hành cùng doanh nghiệp xây dựng thương hiệu, tăng trưởng và chuyển đổi số bền vững.";
  const ctaText = sectionData?.ctaText || "Khám phá dịch vụ";
  const ctaLink = sectionData?.ctaLink || "/services";

  const [mount3D, setMount3D] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = (window as any).requestIdleCallback(
        () => setMount3D(true),
        { timeout: 1000 }
      );
      return () => (window as any).cancelIdleCallback(id);
    } else {
      const timer = setTimeout(() => setMount3D(true), 350);
      return () => clearTimeout(timer);
    }
  }, []);

  const containerRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftColRef.current,
        { opacity: 0, x: -35 },
        { opacity: 1, x: 0, duration: 0.9, ease: "power3.out", delay: 0.1 }
      );
      gsap.fromTo(
        rightColRef.current,
        { opacity: 0, scale: 0.92, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: "power3.out", delay: 0.25 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero-section"
      ref={containerRef}
      className="relative w-full min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#050508] border-b border-[#1A1A22]"
    >
      {/* 3D WebGL Background Layer (Clean particle wave, no birds) */}
      {mount3D && <Hero3DScene />}

      {/* Atmospheric Neon Gradients */}
      <div className="absolute top-1/4 left-1/6 -translate-x-1/2 w-[520px] h-[520px] bg-[#00E5FF]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/6 translate-x-1/2 w-[550px] h-[550px] bg-[#FF2D95]/12 rounded-full blur-[170px] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 60% 40%, transparent 20%, rgba(5,5,8,0.5) 70%, rgba(5,5,8,0.95) 100%)",
        }}
      />

      {/* Top Spacer for Fixed Header */}
      <div className="h-20 sm:h-24 md:h-28 shrink-0" />

      {/* Main 2-Column Hero Content Grid (Matching Image 3) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex items-center py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center w-full">
          {/* LEFT COLUMN: Typography, Cards, CTAs */}
          <div
            ref={leftColRef}
            className="lg:col-span-7 flex flex-col items-start text-left z-20"
          >
            {/* 1. Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#0D1117]/90 border border-[#00E5FF]/40 mb-5 sm:mb-6 backdrop-blur-md shadow-[0_0_25px_rgba(0,229,255,0.2)]">
              <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-[#00A3FF] to-[#FF2D95] p-0.5 flex items-center justify-center shadow-sm">
                <span className="text-[11px] font-black italic text-white leading-none">
                  N
                </span>
              </div>
              <span className="font-bold text-white text-xs tracking-wider">
                NGUYÊN AGENCY
              </span>
              <span className="text-[#52525B]">|</span>
              <span className="text-[11px] sm:text-xs text-[#A1A1AA] font-medium">
                {subtitle}
              </span>
            </div>

            {/* 2. Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl xl:text-[4.2rem] font-black tracking-tight leading-[1.08] mb-4 text-white uppercase">
              <span className="block drop-shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
                NGUYÊN AGENCY
              </span>
              <span className="relative inline-block mt-1">
                <span className="bg-gradient-to-r from-[#00E5FF] via-[#00A3FF] to-[#FF2D95] bg-clip-text text-transparent">
                  {title}
                </span>
                {/* Curved magenta brush stroke underline under SỐ HOÁ */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 sm:h-4 text-[#FF2D95] opacity-90 pointer-events-none"
                  viewBox="0 0 300 20"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 5,14 Q 150,2 295,12"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* 3. Subtitle Paragraph */}
            <p className="text-xs sm:text-sm md:text-base text-[#D4D4D8] max-w-xl font-normal leading-relaxed mb-6 sm:mb-7 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              {description}
            </p>

            {/* 4. 3 Feature Cards (Website, Marketing, AI & Automation) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full mb-7 sm:mb-8">
              {/* Card 1: Thiết kế Website */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-[#0F131C]/85 border border-[#1E293B] hover:border-[#00E5FF]/50 transition-all backdrop-blur-md flex items-center sm:items-start gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] shrink-0 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs sm:text-[13px] leading-tight">
                    Thiết kế Website
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-[#A1A1AA] mt-0.5">
                    Chuẩn SEO - Hiệu quả
                  </p>
                </div>
              </div>

              {/* Card 2: Marketing Online */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-[#0F131C]/85 border border-[#1E293B] hover:border-[#00E5FF]/50 transition-all backdrop-blur-md flex items-center sm:items-start gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] shrink-0 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs sm:text-[13px] leading-tight">
                    Marketing Online
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-[#A1A1AA] mt-0.5">
                    Tăng nhận diện - Thu hút khách
                  </p>
                </div>
              </div>

              {/* Card 3: Giải pháp AI & Automation */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-[#0F131C]/85 border border-[#1E293B] hover:border-[#00E5FF]/50 transition-all backdrop-blur-md flex items-center sm:items-start gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] shrink-0 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs sm:text-[13px] leading-tight">
                    Giải pháp AI & Automation
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-[#A1A1AA] mt-0.5">
                    Tối ưu vận hành - Bứt phá hiệu suất
                  </p>
                </div>
              </div>
            </div>

            {/* 5. CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full">
              <Link
                href={ctaLink}
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#00A3FF] via-[#007BA7] to-[#FF2D95] text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_32px_rgba(255,45,149,0.5)] hover:scale-105 flex items-center justify-center gap-2 group"
              >
                <span>{ctaText}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <button
                type="button"
                onClick={() => setIsVideoOpen(true)}
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#121217]/90 hover:bg-[#1A1A22] border border-white/20 hover:border-white/40 text-white font-semibold text-xs tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 backdrop-blur-md"
              >
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
                <span>Xem video giới thiệu</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: 3D Mascot Character with Full Hologram HUD Panels & Pedestal */}
          <div
            ref={rightColRef}
            className="lg:col-span-5 relative flex items-center justify-center mt-6 lg:mt-0"
          >
            {/* Mascot Container with Floating Animation */}
            <div className="relative w-full max-w-[460px] sm:max-w-[520px] lg:max-w-[560px] aspect-[984/1024] flex items-center justify-center">
              {/* Backlight Neon Halos */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00E5FF]/20 via-[#007BA7]/15 to-[#FF2D95]/20 rounded-full blur-[90px] pointer-events-none animate-mascot-aura" />

              {/* Full High-res Mascot with Holographic HUD Panels & Laser Pedestal - NO BLACK BACKGROUND */}
              <div className="relative z-10 w-full h-full animate-mascot-float flex items-center justify-center">
                <Image
                  src="/images/mascot-character-transparent.png"
                  alt="NGUYÊN AGENCY AI Mascot & Hologram Solutions"
                  width={984}
                  height={1024}
                  priority
                  className="w-full h-auto object-contain drop-shadow-[0_20px_60px_rgba(0,163,255,0.45)]"
                  style={{ mixBlendMode: "screen" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Architectural Capability Marquee Strip */}
      <div className="relative z-20 w-full border-t border-[#1F1F26] bg-[#0A0A0E]/95 py-3 overflow-hidden">
        <div className="animate-marquee flex items-center">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <div key={idx} className="flex items-center shrink-0">
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#8E8E93] uppercase px-6">
                {item}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#FF2D95]" />
            </div>
          ))}
        </div>
      </div>

      {/* Video Intro Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-[#0D0D12] border border-[#26262F] rounded-3xl p-6 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-[#202028] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#00E5FF] animate-ping" />
                <h3 className="text-white font-bold font-mono text-sm uppercase">
                  NGUYÊN AGENCY • Brand Showcase Video
                </h3>
              </div>
              <button
                onClick={() => setIsVideoOpen(false)}
                className="p-1.5 rounded-xl text-[#71717A] hover:text-white hover:bg-[#1A1A22] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[#222]">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="NGUYÊN AGENCY Reel"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
