"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ExternalLink, Layers, Sparkles } from "lucide-react";
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
  const subtitle = sectionData?.subtitle || "03 • HỒ SƠ NĂNG LỰC DỰ ÁN";
  const title = sectionData?.title || "DỰ ÁN TIÊU BIỂU & CASE STUDIES";
  const description =
    sectionData?.description ||
    "Mỗi dự án là một tác phẩm kỹ thuật số được đo ni đóng giày, kết hợp thẩm mỹ đương đại với hiệu suất vận hành thực tế.";
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
    <section className="py-28 px-6 bg-[#0A0A0A] border-b border-[#1F1F23] relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#007BA7]/6 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <RevealOnScroll className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8 pb-10 border-b border-[#1F1F23]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#007BA7]" />
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#007BA7]">
                {subtitle}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-[1.1]">
              {title}
            </h2>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-4">
            <p className="text-sm text-[#A1A1AA] max-w-md lg:text-right leading-relaxed">
              {description}
            </p>
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#141418] border border-[#292929] hover:border-[#FF2D95] text-xs font-mono uppercase tracking-widest text-white hover:text-[#FF2D95] transition-all group"
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
                      ? "bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-semibold shadow-[0_0_20px_rgba(0,123,167,0.35)]"
                      : "bg-[#121215] border border-[#242429] text-[#A1A1AA] hover:text-white hover:border-[#007BA7]/50"
                  }`}
                >
                  {cat === "ALL" ? "Tất cả lĩnh vực" : cat}
                </button>
              );
            })}
          </RevealOnScroll>
        )}

        {/* Featured Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
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
                  <div className="group relative rounded-3xl bg-[#111114] border border-[#242429] hover:border-[#007BA7]/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all duration-500 hover:shadow-[0_28px_60px_-20px_rgba(0,123,167,0.25)]">
                    {/* Left Visual Showcase */}
                    <Link
                      href={`/portfolio/${item.slug}`}
                      className="lg:col-span-7 relative min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] overflow-hidden bg-[#17171B] block"
                    >
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#111114]/90" />

                      <div className="absolute top-5 left-5 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase bg-[#0A0A0A]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white border border-[#292929]">
                          <Sparkles className="w-3 h-3 text-[#FF2D95]" />
                          DỰ ÁN TIÊU BIỂU TRỌNG ĐIỂM
                        </span>
                        <span className="text-[10px] font-mono tracking-widest uppercase bg-[#007BA7]/90 backdrop-blur-md px-3 py-1.5 rounded-full text-white">
                          {item.category?.name}
                        </span>
                      </div>
                    </Link>

                    {/* Right Case Study Details */}
                    <div className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-mono text-[#38BDF8] tracking-widest uppercase font-semibold">
                            {item.clientName}
                          </span>
                          <span className="text-xs font-mono text-[#71717A] bg-[#18181C] px-3 py-1 rounded-full border border-[#27272D]">
                            {item.year}
                          </span>
                        </div>

                        <Link href={`/portfolio/${item.slug}`}>
                          <h3 className="text-2xl md:text-3xl font-black text-white mb-4 group-hover:text-[#38BDF8] transition-colors leading-tight">
                            {item.title}
                          </h3>
                        </Link>

                        <p className="text-sm text-[#A1A1AA] leading-relaxed mb-6">
                          {item.shortDesc}
                        </p>

                        {/* Impact Results if available */}
                        {results.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6 p-4 rounded-2xl bg-[#16161A] border border-[#242429]">
                            {results.slice(0, 2).map((res, rIdx) => (
                              <div key={rIdx} className="text-xs text-[#E4E4E7] flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FF2D95] mt-1.5 shrink-0" />
                                <span>{res}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-1.5 mb-8">
                          {techStack.slice(0, 5).map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#17171B] text-[#A1A1AA] border border-[#27272D]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-5 border-t border-[#242429] flex items-center justify-between gap-4">
                        <Link
                          href={`/portfolio/${item.slug}`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white text-xs font-mono uppercase tracking-wider font-semibold hover:opacity-95 transition-opacity"
                        >
                          <span>Phân tích Case Study</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>

                        {item.liveUrl && (
                          <a
                            href={item.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#A1A1AA] hover:text-white transition-colors"
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
                <div className="group h-full rounded-3xl bg-[#111114] border border-[#242429] hover:border-[#007BA7]/60 overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-18px_rgba(0,123,167,0.22)]">
                  {/* Visual Preview */}
                  <Link
                    href={`/portfolio/${item.slug}`}
                    className="relative aspect-[16/10] w-full overflow-hidden bg-[#17171B] block"
                  >
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-transparent to-transparent opacity-85" />
                    <div className="absolute top-4 left-4">
                      <span className="text-[10px] font-mono tracking-widest uppercase bg-[#0A0A0A]/85 backdrop-blur-md px-3 py-1 rounded-full text-white border border-[#292929]">
                        {item.category?.name}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="text-xs font-mono text-[#A1A1AA] bg-[#0A0A0A]/85 px-2.5 py-1 rounded-full border border-[#292929]">
                        {item.year}
                      </span>
                    </div>
                  </Link>

                  {/* Content Details */}
                  <div className="p-7 md:p-8 flex flex-col flex-1 justify-between">
                    <div>
                      <span className="text-xs font-mono text-[#38BDF8] tracking-wider uppercase mb-2 block font-semibold">
                        {item.clientName}
                      </span>
                      <Link href={`/portfolio/${item.slug}`}>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-[#38BDF8] transition-colors leading-snug">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-[#A1A1AA] line-clamp-2 leading-relaxed mb-6">
                        {item.shortDesc}
                      </p>
                    </div>

                    <div>
                      {/* Tech Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {techStack.slice(0, 4).map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-[#17171B] text-[#A1A1AA] border border-[#27272D]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-[#242429] flex items-center justify-between">
                        <Link
                          href={`/portfolio/${item.slug}`}
                          className="text-xs font-mono uppercase tracking-wider text-white group-hover:text-[#38BDF8] flex items-center gap-1.5 transition-colors font-semibold"
                        >
                          <span>Xem Case Study</span>
                          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>

                        {item.liveUrl && (
                          <a
                            href={item.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-[#71717A] hover:text-[#FF2D95] transition-colors inline-flex items-center gap-1 font-mono"
                            title="Mở link thực tế"
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
