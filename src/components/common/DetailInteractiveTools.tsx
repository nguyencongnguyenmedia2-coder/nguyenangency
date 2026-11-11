"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Share2,
  Check,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Monitor,
  Tablet,
  Smartphone,
  ListTree,
  Terminal,
  Quote,
  ArrowUpRight,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ==========================================================================
   1. DYNAMIC BREADCRUMB WITH JSON-LD SCHEMA
   ========================================================================== */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function DetailBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.label,
      ...(item.href
        ? { item: `https://nguyenangency.vercel.app${item.href}` }
        : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#A1A1AA]"
      >
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-white font-medium truncate max-w-[260px] sm:max-w-md"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </>
  );
}

/* ==========================================================================
   2. GSAP HERO & SECTION REVEAL ANIMATION WRAPPER
   ========================================================================== */
export function DetailHeroReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const textItems = el.querySelectorAll("[data-hero-item]");
      const visualItem = el.querySelector("[data-hero-visual]");

      if (textItems.length > 0) {
        gsap.fromTo(
          textItems,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "transform",
          }
        );
      }

      if (visualItem) {
        gsap.fromTo(
          visualItem,
          {
            opacity: 0,
            scale: 0.97,
            clipPath: "inset(8% 4% 8% 4% round 24px)",
          },
          {
            opacity: 1,
            scale: 1,
            clipPath: "inset(0% 0% 0% 0% round 24px)",
            duration: 1.1,
            delay: 0.25,
            ease: "power3.out",
            clearProps: "clipPath,transform",
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

/* ==========================================================================
   3. SHARE & COPY LINK BUTTONS
   ========================================================================== */
export function ShareCopyButton({ title }: { title?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      if (navigator.share && title) {
        try {
          await navigator.share({ title, url });
          return;
        } catch {
          // Fallback to clipboard copy
        }
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#171717] hover:bg-[#202020] border border-[#292929] hover:border-[#007BA7] text-xs font-mono text-[#A1A1AA] hover:text-white transition-all"
      title="Chia sẻ hoặc sao chép liên kết"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400">Đã sao chép liên kết</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5 text-[#007BA7]" />
          <span>Chia sẻ bài viết</span>
        </>
      )}
    </button>
  );
}

/* ==========================================================================
   4. READING PROGRESS BAR
   ========================================================================== */
export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (docHeight > 0) {
        setProgress(Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)));
      }
    };
    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

/* ==========================================================================
   5. INTERACTIVE GALLERY + DEVICE MOCKUP SWITCHER + LIGHTBOX
   ========================================================================== */
export function InteractiveGallery({
  images,
  title,
  accentColor = "#007BA7",
  enableDevicePreview = false,
  videoUrl,
}: {
  images: string[];
  title: string;
  accentColor?: string;
  enableDevicePreview?: boolean;
  videoUrl?: string | null;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [deviceMode, setDeviceMode] = useState<"DESKTOP" | "TABLET" | "MOBILE">(
    "DESKTOP"
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight")
        setActiveIndex((prev) =>
          prev !== null ? (prev + 1) % images.length : null
        );
      if (e.key === "ArrowLeft")
        setActiveIndex((prev) =>
          prev !== null ? (prev - 1 + images.length) % images.length : null
        );
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, images.length]);

  if ((!images || images.length === 0) && !videoUrl) return null;

  const primaryImage = images[0];

  return (
    <div className="space-y-8">
      {/* Device Mockup Preview Switcher (Desktop / Tablet / Mobile) */}
      {enableDevicePreview && primaryImage && (
        <div className="p-6 md:p-10 rounded-3xl bg-[#121212] border border-[#292929] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#292929] pb-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#007BA7] block mb-1">
                XEM TRƯỚC GIAO DIỆN ĐA THIẾT BỊ
              </span>
              <h4 className="text-base font-bold text-white uppercase">
                Trải Nghiệm Đa Thiết Bị — {title}
              </h4>
            </div>
            <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-[#171717] border border-[#292929] self-start">
              <button
                type="button"
                onClick={() => setDeviceMode("DESKTOP")}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all ${
                  deviceMode === "DESKTOP"
                    ? "bg-[#007BA7] text-white font-bold"
                    : "text-[#A1A1AA] hover:text-white"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode("TABLET")}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all ${
                  deviceMode === "TABLET"
                    ? "bg-[#007BA7] text-white font-bold"
                    : "text-[#A1A1AA] hover:text-white"
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>Tablet</span>
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode("MOBILE")}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all ${
                  deviceMode === "MOBILE"
                    ? "bg-[#007BA7] text-white font-bold"
                    : "text-[#A1A1AA] hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center py-2">
            <div
              onClick={() => setActiveIndex(0)}
              className={`relative overflow-hidden rounded-2xl border border-[#292929] bg-[#0A0A0A] cursor-pointer transition-all duration-500 shadow-2xl ${
                deviceMode === "DESKTOP"
                  ? "w-full aspect-[16/9]"
                  : deviceMode === "TABLET"
                  ? "w-full max-w-2xl aspect-[4/3]"
                  : "w-full max-w-[340px] aspect-[9/16]"
              }`}
            >
              {/* Window Top Chrome */}
              <div className="h-8 px-4 bg-[#171717] border-b border-[#292929] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#292929]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#292929]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#007BA7]" />
                </div>
                <span className="text-[10px] font-mono text-[#A1A1AA] truncate">
                  KHUNG NHÌN {deviceMode} • 60 FPS
                </span>
                <Maximize2 className="w-3 h-3 text-[#A1A1AA]" />
              </div>
              <div className="relative w-full h-[calc(100%-2rem)]">
                <Image
                  src={primaryImage}
                  alt={`${title} ${deviceMode} mockup`}
                  fill
                  sizes="(max-width: 768px) 100vw, 80vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Optional Video Demo */}
      {videoUrl && (
        <div className="rounded-3xl overflow-hidden border border-[#292929] bg-[#121212] p-4">
          <div className="flex items-center justify-between px-2 pb-3 text-xs font-mono text-[#A1A1AA]">
            <span>VIDEO DEMO & TRẢI NGHIỆM CHUYỂN ĐỘNG</span>
            <span className="text-[#FF2D95]">HD STREAM</span>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#0A0A0A]">
            <video
              src={videoUrl}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Multi-Column Visual Gallery */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {images.map((imgUrl, idx) => {
            // Make every 3rd image full-width editorial span if more than 2 images
            const isFullSpan = images.length >= 3 && idx === 0;
            return (
              <div
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`${
                  isFullSpan ? "md:col-span-12 aspect-[16/9]" : "md:col-span-6 aspect-[16/10]"
                } group relative rounded-3xl overflow-hidden border border-[#292929] hover:border-[#007BA7] bg-[#121212] cursor-pointer transition-all duration-500`}
              >
                <Image
                  src={imgUrl}
                  alt={`${title} visual ${idx + 1}`}
                  fill
                  sizes={
                    isFullSpan
                      ? "100vw"
                      : "(max-width: 768px) 100vw, 50vw"
                  }
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/85 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0A0A0A]/85 border border-[#292929] text-[10px] font-mono text-[#A1A1AA]">
                  HÌNH ẢNH {String(idx + 1).padStart(2, "0")}
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs font-mono text-white truncate pr-4">
                    {title} — Frame #{idx + 1}
                  </span>
                  <span
                    className="w-9 h-9 rounded-xl bg-[#171717] border border-[#292929] group-hover:border-[#007BA7] flex items-center justify-center text-white transition-all shrink-0"
                    style={{ boxShadow: `0 0 16px ${accentColor}22` }}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-[#0A0A0A]/95 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-10"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="w-full max-w-6xl flex items-center justify-between mb-4 text-xs font-mono text-[#A1A1AA]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF2D95]" />
              <span className="text-white font-bold uppercase">{title}</span>
              <span>
                ({activeIndex + 1} / {images.length})
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="p-2.5 rounded-full bg-[#171717] hover:bg-[#292929] text-white border border-[#292929] transition-colors"
              aria-label="Đóng Lightbox"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div
            className="relative w-full max-w-6xl aspect-[16/9] rounded-3xl overflow-hidden border border-[#292929] bg-[#121212]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIndex]}
              alt={`${title} fullscreen ${activeIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex(
                      (activeIndex - 1 + images.length) % images.length
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#0A0A0A]/85 hover:bg-[#007BA7] text-white border border-[#292929] transition-all"
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((activeIndex + 1) % images.length)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#0A0A0A]/85 hover:bg-[#007BA7] text-white border border-[#292929] transition-all"
                  aria-label="Ảnh tiếp theo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div
              className="flex items-center gap-3 mt-5 overflow-x-auto max-w-full py-1"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((thumb, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`relative w-20 aspect-video rounded-xl overflow-hidden border transition-all shrink-0 ${
                    idx === activeIndex
                      ? "border-[#FF2D95] scale-105"
                      : "border-[#292929] opacity-50 hover:opacity-90"
                  }`}
                >
                  <Image
                    src={thumb}
                    alt={`Thumb ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   6. SMOOTH FAQ ACCORDION FOR DETAIL PAGES
   ========================================================================== */
export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
}

export function DetailAccordionFAQ({
  items,
  accentColor = "#007BA7",
}: {
  items: FAQItem[];
  accentColor?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-3.5">
      {items.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={faq.id || idx}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
              isOpen
                ? "bg-[#171717] border-[#007BA7]"
                : "bg-[#121212] border-[#292929] hover:border-[#3F3F46]"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3.5">
                <span
                  className="text-xs font-mono font-bold shrink-0"
                  style={{ color: isOpen ? accentColor : "#71717A" }}
                >
                  {String(idx + 1).padStart(2, "0")}.
                </span>
                <span className="text-sm md:text-base font-bold text-white leading-snug">
                  {faq.question}
                </span>
              </div>
              <div
                className={`w-8 h-8 rounded-xl border border-[#292929] bg-[#121212] flex items-center justify-center shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-white border-[#007BA7]" : "text-[#A1A1AA]"
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-6 pt-1 pl-14 text-sm text-[#A1A1AA] leading-relaxed border-t border-[#292929]/60">
                  {faq.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ==========================================================================
   7. BLOG TABLE OF CONTENTS (DESKTOP STICKY + MOBILE ACCORDION) & RICH CONTENT
   ========================================================================== */
export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function extractBlogHeadings(content: string): TocHeading[] {
  const lines = content.split("\n");
  const headings: TocHeading[] = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("### ")) {
      const text = trimmed.replace(/^###\s+/, "");
      headings.push({
        id: `section-${idx}`,
        text,
        level: 3,
      });
    } else if (trimmed.startsWith("## ")) {
      const text = trimmed.replace(/^##\s+/, "");
      headings.push({
        id: `section-${idx}`,
        text,
        level: 2,
      });
    }
  });

  // If plain text article has no markdown headings, provide default editorial sections
  if (headings.length === 0) {
    return [
      { id: "article-overview", text: "Tổng quan & Bối cảnh", level: 2 },
      { id: "article-analysis", text: "Phân tích chuyên sâu", level: 2 },
      { id: "article-takeaways", text: "Giải pháp & Ứng dụng thực tế", level: 2 },
    ];
  }

  return headings;
}

export function BlogTableOfContents({
  headings,
  mobileOnly = false,
  desktopOnly = false,
}: {
  headings: TocHeading[];
  mobileOnly?: boolean;
  desktopOnly?: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  if (headings.length === 0) return null;

  if (mobileOnly) {
    return (
      <div className="lg:hidden mb-8 rounded-2xl bg-[#121212] border border-[#292929] overflow-hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full px-5 py-4 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-white"
        >
          <span className="flex items-center gap-2">
            <ListTree className="w-4 h-4 text-[#007BA7]" />
            <span>Mục lục bài viết ({headings.length})</span>
          </span>
          <ChevronDown
            className={`w-4 h-4 text-[#A1A1AA] transition-transform ${
              mobileOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {mobileOpen && (
          <div className="px-5 pb-4 pt-2 border-t border-[#292929] space-y-2.5">
            {headings.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                onClick={() => setMobileOpen(false)}
                className={`block text-xs text-[#A1A1AA] hover:text-white transition-colors ${
                  h.level === 3 ? "pl-4" : "font-medium"
                }`}
              >
                {h.text}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (desktopOnly) {
    return (
      <div className="hidden lg:block p-6 rounded-3xl bg-[#121212] border border-[#292929] space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#007BA7]">
          <ListTree className="w-4 h-4" />
          <span>MỤC LỤC BÀI VIẾT</span>
        </div>
        <nav className="space-y-2.5 border-l border-[#292929] pl-4">
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              className={`block text-xs text-[#A1A1AA] hover:text-white transition-colors leading-relaxed ${
                h.level === 3 ? "pl-3 text-[11px]" : "font-medium"
              }`}
            >
              {h.text}
            </a>
          ))}
        </nav>
      </div>
    );
  }

  return null;
}

export function RichArticleRenderer({
  content,
  title,
}: {
  content: string;
  title: string;
}) {
  const hasExplicitHeadings =
    content.includes("## ") || content.includes("### ");

  if (!hasExplicitHeadings) {
    // Split plain text paragraphs into structured editorial sections with IDs matching default ToC
    const paragraphs = content
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);

    return (
      <div className="space-y-8 text-base md:text-[17px] text-[#E4E4E7] leading-[1.85]">
        <div id="article-overview" className="scroll-mt-32 space-y-5">
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
            01. Tổng Quan & Bối Cảnh Công Nghệ
          </h2>
          <p className="text-[#A1A1AA] leading-[1.85]">
            {paragraphs[0] || content}
          </p>
        </div>

        {paragraphs.length > 1 && (
          <div id="article-analysis" className="scroll-mt-32 space-y-5">
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight pt-4 border-t border-[#292929]">
              02. Phân Tích Chuyên Sâu
            </h2>
            {paragraphs.slice(1).map((para, idx) => (
              <p key={idx} className="text-[#A1A1AA] leading-[1.85]">
                {para}
              </p>
            ))}
          </div>
        )}

        {/* Editorial Quote Block */}
        <blockquote className="p-6 md:p-8 rounded-2xl bg-[#171717] border-l-4 border-[#007BA7] my-6">
          <Quote className="w-6 h-6 text-[#007BA7] mb-3" />
          <p className="text-white font-medium italic text-base md:text-lg leading-relaxed">
            &ldquo;Sự kết hợp giữa thẩm mỹ Luxury Dark, đồ họa tương tác thời gian thực và kiến trúc hệ thống chuẩn Enterprise là chìa khóa tạo nên lợi thế cạnh tranh bền vững cho thương hiệu số.&rdquo;
          </p>
          <footer className="mt-3 text-xs font-mono text-[#A1A1AA] uppercase">
            — NGUYÊN AGENCY R&D & Editorial Team
          </footer>
        </blockquote>

        {/* Inline Article CTA Block */}
        <div
          id="article-takeaways"
          className="scroll-mt-32 p-6 md:p-8 rounded-2xl bg-[#171717] border border-[#292929] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF2D95] block mb-1">
              ỨNG DỤNG CHO DOANH NGHIỆP CỦA BẠN
            </span>
            <h3 className="text-lg font-bold text-white">
              Cần tư vấn giải pháp cho chủ đề &ldquo;{title}&rdquo;?
            </h3>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-full bg-[#007BA7] hover:bg-[#007BA7]/90 text-white text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-2 shrink-0 transition-all"
          >
            <span>Trao Đổi Cùng Chuyên Gia</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // Rich line-by-line parser supporting H2, H3, Quote, Code, Lists, Images, Tables, Paragraphs
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`code-${idx}`}
            className="p-5 rounded-2xl bg-[#0A0A0A] border border-[#292929] overflow-x-auto font-mono text-xs text-[#38BDF8] leading-relaxed my-4"
          >
            <code>{codeBuffer.join("\n")}</code>
          </pre>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    if (!trimmed) return;

    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2
          key={idx}
          id={`section-${idx}`}
          className="scroll-mt-32 text-2xl md:text-3xl font-black text-white uppercase tracking-tight pt-6 pb-2 border-t border-[#292929]"
        >
          {trimmed.replace(/^##\s+/, "")}
        </h2>
      );
    } else if (trimmed.startsWith("### ")) {
      elements.push(
        <h3
          key={idx}
          id={`section-${idx}`}
          className="scroll-mt-32 text-xl font-bold text-white pt-4 pb-1"
        >
          {trimmed.replace(/^###\s+/, "")}
        </h3>
      );
    } else if (trimmed.startsWith("> ")) {
      elements.push(
        <blockquote
          key={idx}
          className="p-6 rounded-2xl bg-[#171717] border-l-4 border-[#007BA7] text-white italic my-4"
        >
          {trimmed.replace(/^>\s+/, "")}
        </blockquote>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      elements.push(
        <div key={idx} className="flex items-start gap-3 pl-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#007BA7] mt-2.5 shrink-0" />
          <span className="text-[#A1A1AA] leading-relaxed">
            {trimmed.replace(/^[-*]\s+/, "")}
          </span>
        </div>
      );
    } else if (/^\d+\.\s+/.test(trimmed)) {
      const match = trimmed.match(/^(\d+\.)\s+(.*)$/);
      elements.push(
        <div key={idx} className="flex items-start gap-3 pl-2">
          <span className="text-xs font-mono font-bold text-[#FF2D95] mt-1 shrink-0">
            {match?.[1]}
          </span>
          <span className="text-[#A1A1AA] leading-relaxed">{match?.[2]}</span>
        </div>
      );
    } else {
      elements.push(
        <p key={idx} className="text-[#A1A1AA] leading-[1.85]">
          {trimmed}
        </p>
      );
    }
  });

  return (
    <div className="space-y-5 text-base md:text-[17px] leading-[1.85]">
      {elements}
    </div>
  );
}
