"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowUpRight, Sparkles, ShieldCheck, Cpu, Layers, Globe } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Hero3DScene = dynamic(() => import("@/components/3d/Hero3DScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-14 h-14 rounded-full border border-[#007BA7]/40 border-t-[#FF2D95] animate-spin" />
    </div>
  ),
});

const MARQUEE_ITEMS = [
  "CHIẾN LƯỢC & BỘ NHẬN DIỆN THƯƠNG HIỆU",
  "KIẾN TRÚC ĐỒ HỌA 3D WEBGL & MOTION",
  "ỨNG DỤNG DOANH NGHIỆP MAY ĐO CHUYÊN SÂU",
  "TRỢ LÝ AI & TỰ ĐỘNG HÓA DOANH NGHIỆP",
  "MARKETING HIỆU SUẤT & CHUYỂN ĐỔI CAO",
  "HỆ THỐNG THIẾT KẾ & TRẢI NGHIỆM UI/UX ĐỘC BẢN",
  "ỨNG DỤNG DI ĐỘNG CAO CẤP (IOS & ANDROID)",
  "HẠ TẦNG ĐÁM MÂY TỐC ĐỘ CAO & DEVOPS CHUẨN MỰC",
];

export default function HeroSection({ sectionData }: { sectionData?: any }) {
  const subtitle = sectionData?.subtitle || "01 • KIẾN TẠO • PHÁT TRIỂN • CHUYỂN HÓA";
  const title = sectionData?.title || "VƯỢT CHUẨN SỐ HÓA.";
  const description =
    sectionData?.description ||
    "Hệ sinh thái Sáng tạo, Công nghệ & R&D hàng đầu. Chúng tôi kiến tạo vị thế thương hiệu độc bản bằng trải nghiệm 3D tương tác, hệ thống phần mềm chuẩn Enterprise và giải pháp AI thế hệ mới.";
  const ctaText = sectionData?.ctaText || "Khám Phá Dự Án";
  const ctaLink = sectionData?.ctaLink || "/portfolio";

  const containerRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLSpanElement>(null);
  const title2Ref = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", clearProps: "transform" },
      });

      tl.fromTo(
        pillRef.current,
        { opacity: 0, y: -18 },
        { opacity: 1, y: 0, duration: 0.75, delay: 0.15 }
      )
        .fromTo(
          title1Ref.current,
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, duration: 0.95 },
          "-=0.5"
        )
        .fromTo(
          title2Ref.current,
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, duration: 0.95 },
          "-=0.7"
        )
        .fromTo(
          descRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.6"
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.55"
        )
        .fromTo(
          metricsRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.85 },
          "-=0.5"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero-section"
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#0A0A0A] bg-architectural-grid border-b border-[#1F1F23]"
    >
      {/* 3D WebGL Canvas Layer */}
      <Hero3DScene />

      {/* Atmospheric Radial Gradients & Readability Vignette */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-[#007BA7]/14 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[500px] h-[500px] bg-[#FF2D95]/12 rounded-full blur-[150px] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(10,10,10,0.18) 0%, rgba(10,10,10,0.35) 70%, rgba(10,10,10,0.75) 100%)",
        }}
      />

      {/* Top Spacer for Fixed Header */}
      <div className="h-24 md:h-28 shrink-0" />

      {/* Main Center Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col items-center justify-center text-center py-8">
        {/* Status & Tagline Pill */}
        <div
          ref={pillRef}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#121215]/90 border border-[#292929] mb-7 backdrop-blur-md shadow-[0_0_30px_rgba(0,123,167,0.12)]"
        >
          <span className="w-2 h-2 rounded-full bg-[#007BA7] animate-ping" />
          <Sparkles className="w-3.5 h-3.5 text-[#FF2D95]" />
          <span className="text-[11px] font-mono tracking-[0.22em] text-[#D4D4D8] uppercase">
            {subtitle}
          </span>
        </div>

        {/* Brand Master Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.4rem] font-black tracking-tight leading-[1.04] mb-6 max-w-5xl">
          <span ref={title1Ref} className="block text-gradient-silver drop-shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
            NGUYÊN AGENCY.
          </span>
          <span ref={title2Ref} className="block text-gradient-brand mt-1.5">
            {title}
          </span>
        </h1>

        {/* Editorial Lead Copy */}
        <p
          ref={descRef}
          className="text-sm sm:text-base md:text-lg text-[#A1A1AA] max-w-2xl font-normal leading-relaxed mb-9 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
        >
          {description}
        </p>

        {/* Primary & Secondary CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href={ctaLink}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-semibold text-xs uppercase tracking-[0.18em] transition-all duration-300 hover:shadow-[0_0_32px_rgba(255,45,149,0.45)] hover:-translate-y-0.5 flex items-center justify-center gap-2.5 group"
          >
            <span>{ctaText}</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <Link
            href="/contact"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#121214]/90 border border-[#292929] hover:border-[#007BA7] text-[#E4E4E7] hover:text-white font-semibold text-xs uppercase tracking-[0.18em] transition-all duration-300 hover:bg-[#18181C] flex items-center justify-center gap-2"
          >
            <span>Khởi Tạo Dự Án</span>
          </Link>
        </div>
      </div>

      {/* Bottom Telemetry Strip & Infinite Capability Ticker */}
      <div ref={metricsRef} className="relative z-10 w-full mt-auto">
        <div className="max-w-7xl mx-auto px-6 pb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="p-4 rounded-2xl bg-[#121214]/85 border border-[#242429] hover:border-[#007BA7]/40 transition-colors backdrop-blur-md flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#007BA7]/10 border border-[#007BA7]/25 flex items-center justify-center text-[#007BA7] shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-mono tracking-wider text-[#71717A] uppercase block">
                  HỆ SINH THÁI DỊCH VỤ
                </span>
                <span className="text-sm md:text-base font-bold text-white font-mono">
                  24 Giải Pháp Chuyên Sâu
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#121214]/85 border border-[#242429] hover:border-[#007BA7]/40 transition-colors backdrop-blur-md flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#007BA7]/10 border border-[#007BA7]/25 flex items-center justify-center text-[#38BDF8] shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-mono tracking-wider text-[#71717A] uppercase block">
                  HIỆU NĂNG ĐỒ HỌA
                </span>
                <span className="text-sm md:text-base font-bold text-[#38BDF8] font-mono">
                  60 FPS WebGL / Three.js
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#121214]/85 border border-[#242429] hover:border-[#FF2D95]/40 transition-colors backdrop-blur-md flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FF2D95]/10 border border-[#FF2D95]/25 flex items-center justify-center text-[#FF2D95] shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-mono tracking-wider text-[#71717A] uppercase block">
                  DỰ ÁN THỰC CHIẾN
                </span>
                <span className="text-sm md:text-base font-bold text-[#FF2D95] font-mono">
                  50+ Doanh Nghiệp Hàng Đầu
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#121214]/85 border border-[#242429] hover:border-emerald-500/40 transition-colors backdrop-blur-md flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-mono tracking-wider text-[#71717A] uppercase block">
                  CAM KẾT VẬN HÀNH
                </span>
                <span className="text-sm md:text-base font-bold text-emerald-400 font-mono">
                  99.9% SLA & Bảo Mật
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Architectural Capability Marquee Strip */}
        <div className="w-full border-t border-[#1F1F23] bg-[#0D0D10]/90 py-3.5 overflow-hidden">
          <div className="animate-marquee flex items-center">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
              <div key={idx} className="flex items-center shrink-0">
                <span className="text-[11px] font-mono tracking-[0.22em] text-[#71717A] uppercase px-6">
                  {item}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
