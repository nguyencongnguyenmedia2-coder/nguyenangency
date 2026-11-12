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
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sparkles,
  Award,
  Users,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// 3D Cyber Wave & Particle Canvas
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

const TRUST_STATS = [
  { value: "50+", label: "Dự Án Bàn Giao", detail: "Đa ngành nghề & Quốc tế" },
  { value: "99.8%", label: "Tỷ Lệ Hài Lòng", detail: "Cam kết đúng hạn SLA" },
  { value: "100%", label: "Mã Nguồn Độc Bản", detail: "Bàn giao toàn quyền sở hữu" },
  { value: "24/7", label: "Đồng Hành Kỹ Thuật", detail: "Bảo hành 12 tháng tận tâm" },
];

const TECH_PARTNERS = [
  { name: "Next.js 14", tag: "Full-Stack Framework" },
  { name: "Three.js & WebGL", tag: "3D Engine" },
  { name: "Supabase & Postgres", tag: "Cloud Database" },
  { name: "Tailwind CSS", tag: "Modern Styling" },
  { name: "OpenAI GPT-4o", tag: "Generative AI" },
  { name: "Vercel & AWS", tag: "Edge Infrastructure" },
  { name: "Cloudflare", tag: "Global CDN & WAF" },
];

const DEFAULT_CARDS = [
  {
    title: "Thiết Kế Website 3D",
    desc: "Chuẩn SEO • Tốc độ 60 FPS",
  },
  {
    title: "Marketing & Tăng Trưởng",
    desc: "Tăng nhận diện • Bứt phá ROI",
  },
  {
    title: "Giải Pháp AI & SaaS",
    desc: "Tự động hóa • May đo doanh nghiệp",
  },
];

function parseHeroContent(raw?: string | null) {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function getEmbedYoutubeUrl(url: string): string {
  if (!url) return "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1";
  try {
    if (url.includes("youtube.com/watch")) {
      const u = new URL(url);
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube-nocookie.com/embed/${v}?autoplay=1`;
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      if (id) return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
    }
  } catch {
    // ignore
  }
  return url;
}

export default function HeroSection({ sectionData }: { sectionData?: any }) {
  const custom = parseHeroContent(sectionData?.content);

  const badgeBrand = custom.badgeBrand || "NGUYÊN AGENCY";
  const subtitle =
    sectionData?.subtitle || "Digital Creative & Tech Solutions";
  const brandHeadline = custom.brandHeadline || "NGUYÊN AGENCY";
  const title = sectionData?.title || "VƯỢT CHUẨN SỐ HOÁ";
  const description =
    sectionData?.description ||
    "Đối tác sáng tạo & công nghệ, đồng hành cùng doanh nghiệp xây dựng thương hiệu, tăng trưởng và chuyển đổi số bền vững với hệ sinh thái 24 giải pháp toàn diện.";
  const ctaText = sectionData?.ctaText || "Khám phá dịch vụ";
  const ctaLink = sectionData?.ctaLink || "/services";

  const videoBtnText = custom.videoBtnText || "Xem video giới thiệu";
  const videoUrl =
    custom.videoUrl ||
    "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1";

  let heroImage =
    sectionData?.mediaUrl && sectionData.mediaUrl.trim() !== ""
      ? sectionData.mediaUrl.trim()
      : "/images/mascot-character-transparent-v2.png";

  if (
    heroImage === "/images/mascot-character-transparent.png" ||
    heroImage === "/images/mascot-character-full.png" ||
    heroImage === "/images/mascot-character-full.jpg" ||
    heroImage === "/images/hero-mascot.jpg" ||
    (heroImage.endsWith(".jpg") && heroImage.includes("mascot"))
  ) {
    heroImage = "/images/mascot-character-transparent-v2.png";
  }

  const blendMode: "screen" | "normal" =
    custom.blendMode === "screen" ? "screen" : "normal";

  const cards =
    Array.isArray(custom.cards) && custom.cards.length === 3
      ? custom.cards
      : DEFAULT_CARDS;

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
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          delay: 0.25,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const cardIcons = [Monitor, Megaphone, Layers];

  return (
    <section
      id="hero-section"
      ref={containerRef}
      className="relative w-full min-h-[96vh] flex flex-col justify-between overflow-hidden bg-[#06070B] border-b border-[#1A1A22]"
    >
      {/* 3D WebGL Background Layer */}
      {mount3D && <Hero3DScene />}

      {/* Atmospheric Neon Gradients */}
      <div className="absolute top-1/4 left-1/6 -translate-x-1/2 w-[550px] h-[550px] bg-[#00E5FF]/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/6 translate-x-1/2 w-[600px] h-[600px] bg-[#FF2D95]/12 rounded-full blur-[180px] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 60% 40%, transparent 20%, rgba(6,7,11,0.55) 70%, rgba(6,7,11,0.98) 100%)",
        }}
      />

      {/* Top Spacer for Fixed Header */}
      <div className="h-20 sm:h-24 md:h-28 shrink-0" />

      {/* Main 2-Column Hero Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex items-center py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center w-full">
          {/* LEFT COLUMN: Typography, Cards, CTAs, Trust Metrics */}
          <div
            ref={leftColRef}
            className="lg:col-span-7 flex flex-col items-start text-left z-20"
          >
            {/* 1. Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#0D121D]/90 border border-[#00E5FF]/40 mb-5 sm:mb-6 backdrop-blur-md shadow-[0_0_25px_rgba(0,229,255,0.2)]">
              <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-[#00A3FF] to-[#FF2D95] p-0.5 flex items-center justify-center shadow-sm">
                <span className="text-[11px] font-black italic text-white leading-none">
                  N
                </span>
              </div>
              <span className="font-bold text-white text-xs tracking-wider">
                {badgeBrand}
              </span>
              <span className="text-[#52525B]">|</span>
              <span className="text-[11px] sm:text-xs text-[#A1A1AA] font-medium">
                {subtitle}
              </span>
            </div>

            {/* 2. Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl xl:text-[4.2rem] font-black tracking-tight leading-[1.08] mb-4 text-white uppercase">
              <span className="block drop-shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
                {brandHeadline}
              </span>
              <span className="relative inline-block mt-1">
                <span className="bg-gradient-to-r from-[#00E5FF] via-[#00A3FF] to-[#FF2D95] bg-clip-text text-transparent">
                  {title}
                </span>
                {/* Curved magenta brush stroke underline */}
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

            {/* 4. 3 Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full mb-7 sm:mb-8">
              {cards.map((card: { title: string; desc: string }, idx: number) => {
                const IconComp = cardIcons[idx % cardIcons.length];
                return (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-2xl bg-[#0D111A]/90 border border-white/[0.08] hover:border-[#00E5FF]/50 transition-all backdrop-blur-md flex items-center sm:items-start gap-3 group hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,229,255,0.12)]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF]/15 to-[#007BA7]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] shrink-0 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-xs sm:text-[13px] leading-tight">
                        {card.title}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-[#A1A1AA] mt-1">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 5. CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full mb-8 sm:mb-9">
              <Link
                href={ctaLink}
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#00A3FF] via-[#007BA7] to-[#FF2D95] text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_36px_rgba(255,45,149,0.55)] hover:scale-105 flex items-center justify-center gap-2 group"
              >
                <span>{ctaText}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <button
                type="button"
                onClick={() => setIsVideoOpen(true)}
                className="px-6 sm:px-7 py-3.5 sm:py-4 rounded-full bg-[#121622]/90 hover:bg-[#1A2030] border border-white/20 hover:border-[#00E5FF]/50 text-white font-semibold text-xs tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 backdrop-blur-md group"
              >
                <div className="w-5 h-5 rounded-full bg-white/10 group-hover:bg-[#00E5FF]/20 flex items-center justify-center text-white group-hover:text-[#00E5FF] transition-colors">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
                <span>{videoBtnText}</span>
              </button>

              <Link
                href="/contact"
                className="text-xs font-mono text-[#A1A1AA] hover:text-[#00E5FF] transition-colors underline-offset-4 hover:underline flex items-center gap-1.5 ml-1"
              >
                <span>Báo giá theo yêu cầu</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            {/* 6. Live Trust Metric Counter Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-5 border-t border-white/[0.08] w-full">
              {TRUST_STATS.map((stat, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight bg-gradient-to-r from-white via-white to-[#00E5FF] bg-clip-text text-transparent">
                    {stat.value}
                  </span>
                  <span className="text-xs font-bold text-[#E4E4E7] mt-0.5">
                    {stat.label}
                  </span>
                  <span className="text-[10px] text-[#71717A] mt-0.5 font-mono">
                    {stat.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: 3D Mascot Character with Floating Cyber Chips */}
          <div
            ref={rightColRef}
            className="lg:col-span-5 relative flex items-center justify-center mt-6 lg:mt-0"
          >
            <div className="relative w-full max-w-[460px] sm:max-w-[520px] lg:max-w-[560px] aspect-[1000/1040] flex items-center justify-center">
              {/* Backlight Neon Halos */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00E5FF]/20 via-[#007BA7]/15 to-[#FF2D95]/20 rounded-full blur-[100px] pointer-events-none animate-mascot-aura" />

              {/* Top-Right Cyber HUD Badge */}
              <div className="absolute -top-3 right-0 sm:right-2 z-20 px-3 py-1.5 rounded-full bg-[#0D121E]/90 border border-[#00E5FF]/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,229,255,0.25)] flex items-center gap-2 pointer-events-none animate-pulse">
                <Zap className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                  60 FPS WebGL 3D
                </span>
              </div>

              {/* Bottom-Left Cyber HUD Badge */}
              <div className="absolute bottom-4 left-0 sm:left-2 z-20 px-3 py-1.5 rounded-full bg-[#0D121E]/90 border border-[#FF2D95]/40 backdrop-blur-md shadow-[0_0_20px_rgba(255,45,149,0.25)] flex items-center gap-2 pointer-events-none">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF2D95]" />
                <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                  SLA 99.9% Uptime
                </span>
              </div>

              {/* Mascot Graphic with Clean Transparency */}
              <div className="relative z-10 w-full h-full animate-mascot-float flex items-center justify-center">
                {heroImage.startsWith("/") ? (
                  <Image
                    src={heroImage}
                    alt={title}
                    width={1000}
                    height={1040}
                    priority
                    className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,163,255,0.35)]"
                    style={{ mixBlendMode: blendMode }}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={heroImage}
                    alt={title}
                    className="w-full h-auto max-h-[540px] object-contain drop-shadow-[0_20px_50px_rgba(0,163,255,0.35)]"
                    style={{ mixBlendMode: blendMode }}
                  />
                )}
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

      {/* Tech Partners & Enterprise Standards Strip */}
      <div className="relative z-20 w-full border-t border-white/[0.05] bg-[#07080D] py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#71717A] uppercase tracking-wider shrink-0">
            <Award className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Tiêu Chuẩn Công Nghệ & Hạ Tầng:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {TECH_PARTNERS.map((tech, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0F131D] border border-white/[0.06] text-[11px] font-mono text-[#D4D4D8] hover:border-[#00E5FF]/30 transition-colors"
              >
                <span className="text-white font-bold">{tech.name}</span>
                <span className="text-[#52525B]">/</span>
                <span className="text-[10px] text-[#A1A1AA]">{tech.tag}</span>
              </div>
            ))}
          </div>
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
                  NGUYÊN AGENCY • {videoBtnText}
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
              {videoUrl.endsWith(".mp4") || videoUrl.endsWith(".webm") ? (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  className="w-full h-full"
                  src={getEmbedYoutubeUrl(videoUrl)}
                  title="NGUYÊN AGENCY Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
