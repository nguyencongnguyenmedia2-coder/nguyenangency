import React from "react";
import { Box, Code2, Database, Sparkles } from "lucide-react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

export default function TechStackSection({ sectionData }: { sectionData?: any }) {
  const subtitle = sectionData?.subtitle || "06 • HỆ THỐNG CÔNG NGHỆ TIÊN TIẾN";
  const title = sectionData?.title || "NỀN TẢNG CÔNG NGHỆ HIỆU NĂNG CAO";
  const description =
    sectionData?.description ||
    "Làm chủ những công nghệ tân tiến nhất để đảm bảo chuyển động 3D 60 FPS mượt mà, kiến trúc bảo mật và khả năng chịu tải hàng triệu người dùng.";

  const tiers = [
    {
      index: "01",
      category: "ĐỒ HỌA 3D & CHUYỂN ĐỘNG",
      icon: Box,
      color: "#FF2D95",
      skills: [
        "Three.js / React Three Fiber",
        "WebGL 2.0 & Custom Shaders",
        "GSAP & ScrollTrigger",
        "Lenis Smooth Scrolling",
        "Framer Motion",
        "Blender 3D Pipeline",
      ],
    },
    {
      index: "02",
      category: "FRONTEND HIỆN ĐẠI",
      icon: Code2,
      color: "#38BDF8",
      skills: [
        "Next.js 14 App Router",
        "React 18 Server Components",
        "TypeScript Strict Mode",
        "Tailwind CSS Design System",
        "SSR / ISR Optimization",
        "Core Web Vitals 99+",
      ],
    },
    {
      index: "03",
      category: "ĐÁM MÂY & HỆ THỐNG NỀN TẢNG",
      icon: Database,
      color: "#007BA7",
      skills: [
        "PostgreSQL Architecture",
        "Prisma ORM Type-Safe",
        "Next.js Server Actions & REST",
        "Role-Based Access Control",
        "Docker & Edge CDN",
        "Automated Backup & SLA",
      ],
    },
    {
      index: "04",
      category: "AI & PHÒNG THÍ NGHIỆM TỰ ĐỘNG",
      icon: Sparkles,
      color: "#10B981",
      skills: [
        "Multi-Agent LLM Workflows",
        "RAG & Vector Databases",
        "Generative Media Pipelines",
        "Automated CRM Intelligence",
        "Python & FastAPI Microservices",
        "Realtime Data Telemetry",
      ],
    },
  ];

  return (
    <section className="py-28 px-6 bg-[#0A0A0A] border-b border-[#1F1F23] relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <RevealOnScroll className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 pb-10 border-b border-[#1F1F23]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#38BDF8]">
                {subtitle}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-[1.1]">
              {title}
            </h2>
          </div>
          <p className="text-sm text-[#A1A1AA] max-w-md leading-relaxed">
            {description}
          </p>
        </RevealOnScroll>

        {/* 4 Tech Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, idx) => {
            const Icon = tier.icon;
            return (
              <RevealOnScroll key={tier.category} delay={idx * 0.08}>
                <div className="h-full p-7 rounded-3xl bg-[#111114] border border-[#242429] hover:border-[#007BA7]/60 transition-all duration-500 flex flex-col justify-between group hover:-translate-y-1.5">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-[#17171B] border border-[#292929] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" style={{ color: tier.color }} />
                      </div>
                      <span className="text-xs font-mono text-white/30 font-bold">
                        /{tier.index}
                      </span>
                    </div>

                    <h3
                      className="text-xs font-mono font-bold tracking-widest uppercase mb-5"
                      style={{ color: tier.color }}
                    >
                      {tier.category}
                    </h3>

                    <div className="space-y-2">
                      {tier.skills.map((skill, sIdx) => (
                        <div
                          key={sIdx}
                          className="px-3.5 py-2.5 rounded-xl bg-[#16161A] border border-[#242429] group-hover:border-[#2E2E36] text-xs font-mono text-[#E4E4E7] flex items-center justify-between transition-colors"
                        >
                          <span>{skill}</span>
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: tier.color }}
                          />
                        </div>
                      ))}
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
