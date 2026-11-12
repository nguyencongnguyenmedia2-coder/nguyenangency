"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ExternalLink, Sparkles, TrendingUp, Zap, ShieldCheck } from "lucide-react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  clientName: string;
  year: string;
  shortDesc: string;
  thumbnail: string;
  liveUrl?: string | null;
  technologiesJson: string;
  resultsJson?: string | null;
  category: {
    name: string;
  };
}

export default function FeaturedPortfolioSection({
  portfolios,
  sectionData,
}: {
  portfolios: PortfolioItem[];
  sectionData?: any;
}) {
  const subtitle = sectionData?.subtitle || "03 • HỒ SƠ NĂNG LỰC & DỰ ÁN THỰC CHIẾN";
  const title = sectionData?.title || "DỰ ÁN TIÊU BIỂU & CASE STUDIES";
  const description =
    sectionData?.description ||
    "Mỗi dự án tại NGUYÊN AGENCY là một tác phẩm kỹ thuật số được may đo độc bản, kết hợp tính thẩm mỹ đương đại với hiệu quả chuyển đổi và tăng trưởng vượt bậc.";
  const ctaText = sectionData?.ctaText || "Xem Tất Cả Dự Án";
  const ctaLink = sectionData?.ctaLink || "/portfolio";

  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  const categories = [
    "ALL",
    ...Array.from(new Set(portfolios.map((p) => p.category?.name).filter(Boolean))),
  ];

  const filteredPortfolios =
    activeFilter === "ALL"
      ? portfolios
      : portfolios.filter((p) => p.category?.name === activeFilter);

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 bg-[#06070B] border-b border-[#1A1A22] relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/3 right-0 w-[550px] h-[550px] bg-[#00E5FF]/5 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-[#FF2D95]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <RevealOnScroll className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8 pb-10 border-b border-[#1A1A22]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0D121D] border border-[#00E5FF]/30 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#00E5FF] font-semibold">
                {subtitle}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-[1.1]">
              {title}
            </h2>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-4">
            <p className="text-sm md:text-base text-[#D4D4D8] max-w-md lg:text-right leading-relaxed">
              {description}
            </p>
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#00A3FF]/20 to-[#FF2D95]/20 border border-white/15 hover:border-[#00E5FF]/60 text-xs font-mono uppercase tracking-widest text-white hover:text-[#00E5FF] transition-all group"
            >
              <span>{ctaText}</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </RevealOnScroll>

        {/* Category Filter Pills */}
        {categories.length > 2 && (
          <RevealOnScroll className="flex flex-wrap items-center gap-2 mb-12">
            {categories.map((cat) => {
              const active = activeFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                    active
                      ? "bg-gradient-to-r from-[#00A3FF] to-[#FF2D95] text-white font-bold shadow-[0_0_20px_rgba(0,229,255,0.35)]"
                      : "bg-[#0E131F] border border-white/10 text-[#A1A1AA] hover:text-white hover:border-[#00E5FF]/40"
                  }`}
                >
                  {cat === "ALL" ? "Tất cả lĩnh vực" : cat}
                </button>
              );
            })}
          </RevealOnScroll>
        )}

        {/* Featured Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-8">
          {filteredPortfolios.map((item, idx) => {
            const isHeroCard = idx === 0 && activeFilter === "ALL";
            let techStack: string[] = [];
            try {
              techStack = JSON.parse(item.technologiesJson || "[]");
            } catch {
              techStack = [];
            }

            let results: string[] = [];
            try {
              results = JSON.parse(item.resultsJson || "[]");
            } catch {
              results = [];
            }

            if (isHeroCard) {
              return (
                <RevealOnScroll key={item.id} className="lg:col-span-12">
                  <div className="group relative rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] hover:border-white/25 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all duration-500 hover:shadow-[0_28px_60px_-20px_rgba(0,163,255,0.25)] backdrop-blur-xl">
                    {/* Left Visual Showcase */}
                    <Link
                      href={`/portfolio/${item.slug}`}
                      className="lg:col-span-7 relative min-h-[320px] sm:min-h-[400px] lg:min-h-[460px] overflow-hidden bg-[#121622] block"
                    >
                      {/* Browser Mockup Top Bar */}
                      <div className="absolute top-0 inset-x-0 z-20 px-4 py-2.5 bg-[#08090E]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                        </div>
                        <span className="text-[10px] font-mono text-[#71717A]">
                          https://{item.slug}.nguyenagency.online
                        </span>
                        <div className="w-10" />
                      </div>

                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        loading="lazy"
                        quality={80}
                        className="object-cover pt-8 transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D14] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0B0D14]/90" />

                      <div className="absolute bottom-5 left-5 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase bg-[#06070B]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white border border-[#00E5FF]/40 font-bold">
                          <Sparkles className="w-3 h-3 text-[#00E5FF]" />
                          DỰ ÁN TRỌNG ĐIỂM
                        </span>
                        <span className="text-[10px] font-mono tracking-widest uppercase bg-gradient-to-r from-[#00A3FF] to-[#FF2D95] px-3.5 py-1.5 rounded-full text-white font-bold">
                          {item.category?.name}
                        </span>
                      </div>
                    </Link>

                    {/* Right Case Study Details */}
                    <div className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-mono text-[#00E5FF] tracking-widest uppercase font-bold">
                            KHÁCH HÀNG: {item.clientName}
                          </span>
                          <span className="text-xs font-mono text-[#E4E4E7] bg-[#121622] px-3 py-1 rounded-full border border-white/10">
                            {item.year}
                          </span>
                        </div>

                        <Link href={`/portfolio/${item.slug}`}>
                          <h3 className="text-2xl md:text-3xl font-black text-white mb-4 group-hover:text-[#00E5FF] transition-colors leading-tight">
                            {item.title}
                          </h3>
                        </Link>

                        <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-6">
                          {item.shortDesc}
                        </p>

                        {/* Impact Results */}
                        {results.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6 p-4 rounded-2xl bg-[#121622]/90 border border-white/[0.08]">
                            {results.slice(0, 2).map((res, rIdx) => (
                              <div key={rIdx} className="text-xs text-[#E4E4E7] flex items-start gap-2">
                                <TrendingUp className="w-3.5 h-3.5 text-[#00E5FF] mt-0.5 shrink-0" />
                                <span className="font-medium">{res}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-1.5 mb-8">
                          {techStack.slice(0, 5).map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#121622] text-[#D4D4D8] border border-white/5"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between gap-4">
                        <Link
                          href={`/portfolio/${item.slug}`}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#00A3FF] to-[#FF2D95] text-white text-xs font-mono uppercase tracking-wider font-bold hover:shadow-[0_0_24px_rgba(0,229,255,0.4)] transition-all"
                        >
                          <span>Xem Case Study Chi Tiết</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>

                        {item.liveUrl && (
                          <a
                            href={item.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#D4D4D8] hover:text-[#00E5FF] transition-colors"
                          >
                            <span>Xem Trực Tiếp</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              );
            }

            return (
              <RevealOnScroll
                key={item.id}
                delay={(idx % 2) * 0.1}
                className="lg:col-span-6"
              >
                <div className="group h-full rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] hover:border-white/25 overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_50px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                  {/* Visual Preview */}
                  <Link
                    href={`/portfolio/${item.slug}`}
                    className="relative aspect-[16/9] w-full overflow-hidden bg-[#121622] block"
                  >
                    {/* Browser Mockup Top Bar */}
                    <div className="absolute top-0 inset-x-0 z-20 px-3.5 py-2 bg-[#08090E]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500/80" />
                        <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                        <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                      </div>
                      <span className="text-[9px] font-mono text-[#71717A] truncate max-w-[200px]">
                        {item.title}
                      </span>
                      <div className="w-8" />
                    </div>

                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      loading="lazy"
                      quality={80}
                      className="object-cover pt-6 transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D14] via-transparent to-transparent opacity-90" />
                    <div className="absolute bottom-4 left-4">
                      <span className="text-[10px] font-mono tracking-widest uppercase bg-[#06070B]/90 backdrop-blur-md px-3 py-1 rounded-full text-white border border-[#00E5FF]/30 font-bold">
                        {item.category?.name}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className="text-xs font-mono text-[#D4D4D8] bg-[#06070B]/90 px-2.5 py-1 rounded-full border border-white/10">
                        {item.year}
                      </span>
                    </div>
                  </Link>

                  {/* Content Details */}
                  <div className="p-7 md:p-8 flex flex-col flex-1 justify-between">
                    <div>
                      <span className="text-xs font-mono text-[#00E5FF] tracking-wider uppercase mb-2 block font-bold">
                        {item.clientName}
                      </span>
                      <Link href={`/portfolio/${item.slug}`}>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-[#00E5FF] transition-colors leading-snug">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-xs sm:text-sm text-[#A1A1AA] line-clamp-2 leading-relaxed mb-6">
                        {item.shortDesc}
                      </p>
                    </div>

                    <div>
                      {/* Tech Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {techStack.slice(0, 4).map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-[#121622] text-[#A1A1AA] border border-white/5"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                        <Link
                          href={`/portfolio/${item.slug}`}
                          className="text-xs font-mono uppercase tracking-wider text-white group-hover:text-[#00E5FF] flex items-center gap-1.5 transition-colors font-bold"
                        >
                          <span>Xem Case Study</span>
                          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>

                        {item.liveUrl && (
                          <a
                            href={item.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-[#A1A1AA] hover:text-[#FF2D95] transition-colors inline-flex items-center gap-1 font-mono"
                          >
                            <span>Trực Tiếp</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
