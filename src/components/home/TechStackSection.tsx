import React from "react";
import { Box, Code2, Database, Sparkles, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

export default function TechStackSection({ sectionData }: { sectionData?: any }) {
  const subtitle = sectionData?.subtitle || "06 • HỆ THỐNG CÔNG NGHỆ & TIÊU CHUẨN";
  const title = sectionData?.title || "NỀN TẢNG CÔNG NGHỆ HIỆU NĂNG CAO";
  const description =
    sectionData?.description ||
    "Làm chủ những công nghệ tân tiến nhất thế giới để đảm bảo trải nghiệm 3D 60 FPS mượt mà, kiến trúc bảo mật cấp doanh nghiệp và khả năng chịu tải hàng triệu người dùng đồng thời.";

  const tiers = [
    {
      index: "01",
      category: "ĐỒ HỌA 3D & MOTION",
      icon: Box,
      color: "#FF2D95",
      badge: "60 FPS WEBGL",
      skills: [
        "Three.js / React Three Fiber",
        "WebGL 2.0 & Custom Shaders",
        "GSAP & ScrollTrigger Timeline",
        "Lenis Smooth Scrolling",
        "Framer Motion Micro-interactions",
        "Blender 3D Asset Pipeline",
      ],
    },
    {
      index: "02",
      category: "FRONTEND TIÊN TIẾN",
      icon: Code2,
      color: "#00E5FF",
      badge: "SPEED 95+",
      skills: [
        "Next.js 14 App Router (RSC)",
        "React 18 Server Components",
        "TypeScript Strict Mode 100%",
        "Tailwind CSS Luxury System",
        "SSR / SSG / ISR Caching",
        "Google Core Web Vitals 95+",
      ],
    },
    {
      index: "03",
      category: "BACKEND & ĐÁM MÂY",
      icon: Database,
      color: "#00A3FF",
      badge: "SLA 99.9%",
      skills: [
        "Supabase & PostgreSQL Cloud",
        "Prisma ORM Type-Safe Query",
        "Next.js Server Actions & API",
        "Role-Based Access Control (RBAC)",
        "Ubuntu Linux VPS & Nginx SSL",
        "Docker Containerization & Backup",
      ],
    },
    {
      index: "04",
      category: "AI & TỰ ĐỘNG HÓA",
      icon: Sparkles,
      color: "#A855F7",
      badge: "NEXT-GEN AI",
      skills: [
        "Multi-Agent LLM Architecture",
        "Vector Database RAG Systems",
        "Telegram & Zalo OA Bot API",
        "Tự Động Hóa Chăm Sóc Khách Hàng",
        "Python FastAPI Microservices",
        "Giám Sát Vận Hành Thời Gian Thực",
      ],
    },
  ];

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 bg-[#06070B] border-b border-[#1A1A22] relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-[#00E5FF]/5 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <RevealOnScroll className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 pb-10 border-b border-[#1A1A22]">
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
          <div className="flex flex-col items-start lg:items-end gap-2 max-w-md">
            <p className="text-sm md:text-base text-[#D4D4D8] lg:text-right leading-relaxed">
              {description}
            </p>
            <span className="text-xs font-mono text-[#00E5FF] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Tối ưu hóa tải trang dưới 1.2s trên mọi kết nối di động
            </span>
          </div>
        </RevealOnScroll>

        {/* 4 Tech Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {tiers.map((tier, idx) => {
            const Icon = tier.icon;
            return (
              <RevealOnScroll key={tier.category} delay={idx * 0.08}>
                <div className="h-full p-7 sm:p-8 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] hover:border-white/25 transition-all duration-500 flex flex-col justify-between group hover:-translate-y-2 hover:shadow-[0_24px_50px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden">
                  {/* Top glowing bar */}
                  <div
                    className="absolute top-0 left-6 right-6 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${tier.color}, transparent)`,
                    }}
                  />

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-white/40">
                          /{tier.index}
                        </span>
                        <span className="text-[10px] font-mono tracking-widest text-[#D4D4D8] uppercase bg-[#141824] border border-white/10 px-2.5 py-0.5 rounded-full font-bold">
                          {tier.badge}
                        </span>
                      </div>
                      <div
                        className="w-11 h-11 rounded-2xl border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                        style={{
                          backgroundColor: `${tier.color}15`,
                          borderColor: `${tier.color}40`,
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: tier.color }} />
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white mb-6 group-hover:text-[#00E5FF] transition-colors leading-snug">
                      {tier.category}
                    </h3>

                    {/* Skill points */}
                    <div className="space-y-2.5 mb-6">
                      {tier.skills.map((skill, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2 text-xs text-[#E4E4E7] leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: tier.color }} />
                          <span>{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider font-bold">
                      TIÊU CHUẨN
                    </span>
                    <span className="text-xs font-mono text-[#00E5FF] font-semibold">
                      Enterprise Grade
                    </span>
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
