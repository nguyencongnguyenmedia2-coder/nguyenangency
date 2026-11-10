import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Sparkles,
  Terminal,
  Cpu,
  Layers,
  FlaskConical,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Digital LAB – NGUYÊN AGENCY | R&D & AI Products",
  description:
    "Trung tâm nghiên cứu sản phẩm số, công nghệ Generative AI, 3D Web Tools và nền tảng SaaS của NGUYÊN LAB.",
};

export const dynamic = "force-dynamic";

export default async function LabPage({
  searchParams,
}: {
  searchParams?: Promise<{ stage?: string }> | { stage?: string };
}) {
  const resolvedParams = searchParams ? await Promise.resolve(searchParams) : {};
  const activeStage = resolvedParams?.stage || "ALL";

  let products: any[] = [];
  try {
    products = await prisma.labProduct.findMany({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
        ...(activeStage !== "ALL" ? { productStage: activeStage } : {}),
      },
      include: { category: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  } catch (err) {
    console.warn("[LabPage] DB fetch fallback active:", err);
  }

  return (
    <div className="pt-32 pb-24 px-6 bg-[#0A0A0A] text-white relative">
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Terminal Header */}
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#171717] border border-[#FF2D95]/30">
            <FlaskConical className="w-3.5 h-3.5 text-[#FF2D95]" />
            <span className="text-xs font-mono tracking-widest text-[#FF2D95] uppercase">
              R&D ENGINE • EXPERIMENTAL TECH
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-tight">
            DIGITAL LAB & <br />
            <span className="text-gradient-brand">PROPRIETARY SAAS TOOLS.</span>
          </h1>

          <p className="text-base md:text-lg text-[#A1A1AA] leading-relaxed">
            Nơi đội ngũ kỹ sư NGUYÊN LAB biến các ý tưởng tiên phong thành sản phẩm thực tế: từ công cụ Generative 3D AI đến nền tảng SaaS tối ưu vận hành số hóa.
          </p>
        </div>

        {/* Stage Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-[#292929]">
          <Link
            href="/lab"
            className={`px-5 py-2.5 rounded-xl text-xs font-mono tracking-wider uppercase transition-all whitespace-nowrap ${
              activeStage === "ALL"
                ? "bg-white text-black font-bold shadow-lg"
                : "bg-[#121212] text-[#A1A1AA] hover:text-white border border-[#292929]"
            }`}
          >
            TẤT CẢ SẢN PHẨM
          </Link>
          <Link
            href="/lab?stage=LIVE"
            className={`px-5 py-2.5 rounded-xl text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeStage === "LIVE"
                ? "bg-emerald-600 text-white font-bold"
                : "bg-[#121212] text-[#A1A1AA] hover:text-white border border-[#292929]"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE (THƯƠNG MẠI)</span>
          </Link>
          <Link
            href="/lab?stage=BETA"
            className={`px-5 py-2.5 rounded-xl text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeStage === "BETA"
                ? "bg-[#007BA7] text-white font-bold shadow-glow-blue"
                : "bg-[#121212] text-[#A1A1AA] hover:text-white border border-[#292929]"
            }`}
          >
            <span>BETA TESTING</span>
          </Link>
          <Link
            href="/lab?stage=DEVELOPING"
            className={`px-5 py-2.5 rounded-xl text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeStage === "DEVELOPING"
                ? "bg-[#FF2D95] text-white font-bold shadow-glow-pink"
                : "bg-[#121212] text-[#A1A1AA] hover:text-white border border-[#292929]"
            }`}
          >
            <span>IN DEVELOPMENT</span>
          </Link>
        </div>

        {/* Dynamic Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {products.map((prod) => {
            let features: string[] = [];
            let techStack: string[] = [];
            try {
              features = JSON.parse(prod.featuresJson || "[]");
              techStack = JSON.parse(prod.techStackJson || "[]");
            } catch (e) {
              // fallback
            }

            return (
              <div
                key={prod.id}
                className="group rounded-3xl bg-[#121212] border border-[#292929] hover:border-[#FF2D95]/60 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-glow-pink"
              >
                {/* Visual Header */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#171717]">
                  <Image
                    src={prod.thumbnail}
                    alt={prod.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-90" />
                  <div className="absolute top-5 left-5 flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-widest uppercase bg-[#0A0A0A]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white border border-[#292929]">
                      {prod.category?.name}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-3 py-1.5 rounded-full font-bold ${
                        prod.productStage === "LIVE"
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/40"
                          : prod.productStage === "BETA"
                          ? "bg-[#007BA7]/80 text-white border border-[#007BA7]"
                          : "bg-[#202020] text-[#A1A1AA] border border-[#292929]"
                      }`}
                    >
                      STAGE: {prod.productStage}
                    </span>
                  </div>
                  <div className="absolute top-5 right-5">
                    <span className="text-xs font-mono text-[#A1A1AA] bg-[#0A0A0A]/90 px-3 py-1.5 rounded-full border border-[#292929]">
                      {prod.version}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1 justify-between space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-white mb-1 group-hover:text-[#FF2D95] transition-colors">
                      {prod.name}
                    </h3>
                    <p className="text-xs font-mono text-[#007BA7] mb-3 uppercase tracking-wider">
                      {prod.tagline}
                    </p>
                    <p className="text-sm text-[#A1A1AA] leading-relaxed mb-6">
                      {prod.description}
                    </p>

                    {/* Terminal Feature Preview */}
                    {features.length > 0 && (
                      <div className="space-y-2 mb-6 bg-[#0A0A0A]/80 p-4 rounded-2xl border border-[#292929]">
                        <span className="text-[10px] font-mono text-[#71717A] uppercase block mb-1">
                          Core Capabilities:
                        </span>
                        {features.slice(0, 3).map((f, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-[#E4E4E7]">
                            <Terminal className="w-3.5 h-3.5 text-[#FF2D95] shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tech Badges */}
                    {techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-[#292929]">
                        {techStack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-[#171717] text-[#71717A] border border-[#292929]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-[#292929] flex items-center justify-between">
                    <Link
                      href={`/lab/${prod.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-white group-hover:text-[#FF2D95] transition-colors"
                    >
                      <span>Khám Phá Chi Tiết</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>

                    {prod.demoUrl && (
                      <a
                        href={prod.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-[#171717] hover:bg-[#202020] text-xs font-mono text-[#007BA7] hover:text-white border border-[#292929] flex items-center gap-1.5 transition-colors"
                      >
                        <span>Trải Nghiệm Live</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Collaboration Callout */}
        <div className="p-10 md:p-14 rounded-3xl bg-[#121212] border border-[#292929] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-black uppercase text-white">
              Cần Giải Pháp AI Hoặc SaaS May Đo?
            </h3>
            <p className="text-xs text-[#A1A1AA] max-w-xl">
              NGUYÊN LAB nhận chuyển giao công nghệ, fine-tune mô hình AI độc quyền và phát triển nền tảng quản trị nội bộ bảo mật cao.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-mono text-xs font-bold uppercase tracking-wider hover:shadow-glow-pink transition-all shrink-0"
          >
            Hợp Tác R&D Cùng NGUYÊN LAB
          </Link>
        </div>
      </div>
    </div>
  );
}
