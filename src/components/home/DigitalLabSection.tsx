import React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Terminal, Cpu, Layers, Zap, Bot, Box } from "lucide-react";
import prisma from "@/lib/prisma";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

const FALLBACK_LAB_PRODUCTS = [
  {
    id: "lab_01",
    name: "NGUYÊN AI Agent & Workflow Engine",
    slug: "ai-agent-engine",
    tagline: "Kiến trúc Multi-Agent LLM tự động hóa quy trình nghiệp vụ doanh nghiệp",
    shortDesc: "Bộ giải pháp trợ lý AI tùy biến sâu, kết nối trực tiếp cơ sở dữ liệu nội bộ (RAG), tự động trả lời tư vấn khách hàng 24/7 và gửi báo cáo phân tích theo thời gian thực.",
    productStage: "PRODUCTION READY",
    version: "v2.5.0",
    pricingModel: "Enterprise License",
    featuresJson: JSON.stringify([
      "Tích hợp mô hình GPT-4o & Claude 3.5 Sonnet",
      "Vector Database RAG kết nối dữ liệu riêng",
      "Webhook Telegram, Zalo OA & CRM tự động",
      "Phân quyền bảo mật RBAC đa cấp độ",
    ]),
    techStackJson: JSON.stringify(["Next.js 14", "Python FastAPI", "PgVector", "LangChain"]),
    demoUrl: "/contact",
    ctaText: "Đăng Ký Thử Nghiệm",
    category: { name: "AI & AUTOMATION" },
  },
  {
    id: "lab_02",
    name: "3D WebGL Realtime Product Studio",
    slug: "3d-webgl-product-studio",
    tagline: "Bộ cấu hình sản phẩm 3D không gian tương tác trực tiếp trên trình duyệt",
    shortDesc: "Công nghệ render 3D thời gian thực dựa trên Three.js và WebGL, cho phép khách hàng tương tác 360 độ, đổi màu sắc, chất liệu và đặt hàng trực quan với tốc độ 60 FPS chuẩn xác.",
    productStage: "PUBLIC BETA",
    version: "v1.8.2",
    pricingModel: "SaaS / In-House Setup",
    featuresJson: JSON.stringify([
      "Tối ưu mô hình 3D nén siêu nhẹ dưới 2MB",
      "Hệ thống Shader PBR chân thực chuẩn vật lý",
      "Tương thích 100% Mobile & Safari iOS",
      "Tích hợp API giỏ hàng & thanh toán trực tiếp",
    ]),
    techStackJson: JSON.stringify(["Three.js", "React Three Fiber", "GLTF/GLB", "WebAssembly"]),
    demoUrl: "/contact",
    ctaText: "Xem Demo 3D",
    category: { name: "3D INTERACTIVE" },
  },
];

export default async function DigitalLabSection({
  products: initialProducts,
  sectionData,
}: {
  products?: any[];
  sectionData?: any;
}) {
  const subtitle = sectionData?.subtitle || "04 • NGHIÊN CỨU & PHÁT TRIỂN CÔNG NGHỆ (R&D)";
  const title = sectionData?.title || "NGUYÊN DIGITAL LAB — R&D & AI PRODUCTS";
  const description =
    sectionData?.description ||
    "Hệ sinh thái sản phẩm công nghệ độc quyền, công cụ AI Agent tự động hóa và nền tảng 3D tương tác thế hệ mới được nghiên cứu và phát triển trực tiếp bởi phòng kỹ thuật NGUYÊN LAB.";
  const ctaText = sectionData?.ctaText || "Khám phá toàn bộ Phòng LAB";
  const ctaLink = sectionData?.ctaLink || "/lab";

  let products = initialProducts;
  if (!products || products.length === 0) {
    try {
      products = await prisma.labProduct.findMany({
        where: { status: "PUBLISHED" },
        include: { category: true },
        orderBy: { order: "asc" },
      });
    } catch {
      // fallback
    }
  }

  if (!products || products.length === 0) {
    products = FALLBACK_LAB_PRODUCTS;
  }

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 bg-[#06070B] border-b border-[#1A1A22] relative overflow-hidden">
      {/* Radial Mask & Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#A855F7]/6 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <RevealOnScroll className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 pb-10 border-b border-[#1A1A22]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0D121D] border border-[#A855F7]/30 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#A855F7] animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#A855F7] font-semibold">
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#A855F7]/20 to-[#00E5FF]/20 border border-white/15 hover:border-[#A855F7]/60 text-xs font-mono uppercase tracking-widest text-white hover:text-[#A855F7] transition-all group"
            >
              <span>{ctaText}</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </RevealOnScroll>

        {/* Lab Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 sm:gap-8">
          {products.map((prod, idx) => {
            let features: string[] = [];
            try {
              features = typeof prod.featuresJson === "string" ? JSON.parse(prod.featuresJson || "[]") : prod.featuresJson || [];
            } catch {
              features = [];
            }

            let techStack: string[] = [];
            try {
              techStack = typeof prod.techStackJson === "string" ? JSON.parse(prod.techStackJson || "[]") : prod.techStackJson || [];
            } catch {
              techStack = [];
            }

            return (
              <RevealOnScroll key={prod.id} delay={idx * 0.1}>
                <div className="group h-full rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] hover:border-[#A855F7]/50 overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_50px_-15px_rgba(168,85,247,0.2)] backdrop-blur-xl">
                  {/* Terminal Header Bar */}
                  <div className="px-6 sm:px-7 py-4 bg-[#0E1017] border-b border-white/[0.08] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="ml-2 text-[11px] font-mono text-[#71717A]">
                        lab://{prod.slug}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        {prod.productStage || "READY"}
                      </span>
                      <span className="text-[11px] font-mono text-[#D4D4D8] bg-[#141824] px-2.5 py-0.5 rounded-md border border-white/10">
                        {prod.version || "v2.0"}
                      </span>
                    </div>
                  </div>

                  {/* Main Body */}
                  <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono text-[#A855F7] uppercase tracking-wider font-bold">
                          {prod.category?.name || "AI & R&D LAB"}
                        </span>
                        <span className="text-xs font-mono text-[#A1A1AA] bg-[#121622] px-2.5 py-1 rounded-md border border-white/5">
                          {prod.pricingModel || "Enterprise"}
                        </span>
                      </div>

                      <Link href={`/lab/${prod.slug}`}>
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-2 group-hover:text-[#A855F7] transition-colors leading-tight">
                          {prod.name}
                        </h3>
                      </Link>

                      <p className="text-xs font-mono text-[#E4E4E7] mb-4 font-medium">
                        {prod.tagline}
                      </p>

                      <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-6">
                        {prod.shortDesc}
                      </p>

                      {/* Key Features Terminal Box */}
                      {features.length > 0 && (
                        <div className="space-y-2 mb-6 bg-[#08090E] p-4 sm:p-5 rounded-2xl border border-white/[0.06]">
                          {features.slice(0, 4).map((f, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-2.5 text-xs text-[#E4E4E7] leading-relaxed">
                              <Terminal className="w-3.5 h-3.5 text-[#00E5FF] shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tech Stack Pills */}
                      {techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {techStack.slice(0, 5).map((t, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-[#121622] text-[#D4D4D8] border border-white/5"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between gap-4">
                      <Link
                        href={`/lab/${prod.slug}`}
                        className="text-xs font-mono uppercase tracking-widest text-white group-hover:text-[#00E5FF] flex items-center gap-1.5 transition-colors font-bold"
                      >
                        <span>Tài liệu Kỹ thuật</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href={prod.demoUrl || "/contact"}
                        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#A855F7] to-[#00A3FF] text-white font-mono text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all flex items-center gap-1.5"
                      >
                        <span>{prod.ctaText || "Trải nghiệm"}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
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
