import React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Terminal, Cpu, Layers } from "lucide-react";
import prisma from "@/lib/prisma";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

export default async function DigitalLabSection({
  products: initialProducts,
  sectionData,
}: {
  products?: any[];
  sectionData?: any;
}) {
  const subtitle = sectionData?.subtitle || "04 • NGHIÊN CỨU & PHÁT TRIỂN AI";
  const title = sectionData?.title || "NGUYÊN DIGITAL LAB — R&D & AI PRODUCTS";
  const description =
    sectionData?.description ||
    "Hệ sinh thái sản phẩm công nghệ độc quyền, công cụ AI Agent và nền tảng SaaS thế hệ mới được nghiên cứu và phát triển trực tiếp bởi đội ngũ kỹ sư NGUYÊN LAB.";
  const ctaText = sectionData?.ctaText || "Khám phá toàn bộ Phòng LAB";
  const ctaLink = sectionData?.ctaLink || "/lab";

  const products =
    initialProducts ||
    (await prisma.labProduct.findMany({
      where: { status: "PUBLISHED" },
      include: { category: true },
      orderBy: { order: "asc" },
    }));

  return (
    <section className="py-28 px-6 bg-[#0A0A0A] bg-dot-matrix border-b border-[#1F1F23] relative overflow-hidden">
      {/* Radial Mask & Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#FF2D95]/6 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <RevealOnScroll className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 pb-10 border-b border-[#1F1F23]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF2D95]/10 border border-[#FF2D95]/30 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#FF2D95]" />
              <span className="text-[11px] font-mono tracking-[0.22em] text-[#FF2D95] uppercase">
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

        {/* Lab Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          {products.map((prod, idx) => {
            let features: string[] = [];
            try {
              features = JSON.parse(prod.featuresJson || "[]");
            } catch {
              features = [];
            }

            let techStack: string[] = [];
            try {
              techStack = JSON.parse(prod.techStackJson || "[]");
            } catch {
              techStack = [];
            }

            return (
              <RevealOnScroll key={prod.id} delay={idx * 0.1}>
                <div className="group h-full rounded-3xl bg-[#111114]/95 border border-[#242429] hover:border-[#FF2D95]/55 overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-18px_rgba(255,45,149,0.2)]">
                  {/* Terminal Header Bar */}
                  <div className="px-7 py-4 bg-[#16161B] border-b border-[#242429] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF2D95]/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#007BA7]/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                      <span className="ml-2 text-[11px] font-mono text-[#71717A]">
                        nguyen-lab://{prod.slug}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {prod.productStage}
                      </span>
                      <span className="text-[11px] font-mono text-[#A1A1AA] bg-[#1E1E24] px-2.5 py-0.5 rounded-md border border-[#2D2D35]">
                        {prod.version}
                      </span>
                    </div>
                  </div>

                  {/* Main Body */}
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider">
                          {prod.category?.name || "AI & TỰ ĐỘNG HÓA"}
                        </span>
                        <span className="text-xs font-mono text-[#A1A1AA]">
                          {prod.pricingModel}
                        </span>
                      </div>

                      <Link href={`/lab/${prod.slug}`}>
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-2 group-hover:text-[#FF2D95] transition-colors">
                          {prod.name}
                        </h3>
                      </Link>

                      <p className="text-xs font-mono text-[#D4D4D8] mb-4">
                        {prod.tagline}
                      </p>

                      <p className="text-sm text-[#A1A1AA] leading-relaxed mb-6">
                        {prod.shortDesc}
                      </p>

                      {/* Key Features Terminal Box */}
                      {features.length > 0 && (
                        <div className="space-y-2.5 mb-6 bg-[#0C0C0E] p-5 rounded-2xl border border-[#222228]">
                          {features.slice(0, 3).map((f, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-2.5 text-xs text-[#D4D4D8]">
                              <Terminal className="w-3.5 h-3.5 text-[#FF2D95] shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tech Stack Pills */}
                      {techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {techStack.slice(0, 4).map((t, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-[#17171B] text-[#71717A] border border-[#27272D]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-5 border-t border-[#242429] flex items-center justify-between gap-4">
                      <Link
                        href={`/lab/${prod.slug}`}
                        className="text-xs font-mono uppercase tracking-widest text-white group-hover:text-[#38BDF8] flex items-center gap-1.5 transition-colors font-semibold"
                      >
                        <span>Kiến trúc & Tài liệu</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>

                      {prod.demoUrl && (
                        <a
                          href={prod.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-mono text-xs font-semibold uppercase tracking-wider hover:opacity-95 transition-opacity flex items-center gap-1.5"
                        >
                          <span>{prod.ctaText || "Trải nghiệm"}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
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
