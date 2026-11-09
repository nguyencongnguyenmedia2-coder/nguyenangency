import React from "react";
import Link from "next/link";
import { Palette, Cpu, FlaskConical, ArrowUpRight, CheckCircle2 } from "lucide-react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import Magnetic from "@/components/motion/Magnetic";

export default function BrandIntroSection({ sectionData }: { sectionData?: any }) {
  const subtitle = sectionData?.subtitle || "01 • TUYÊN NGÔN THƯƠNG HIỆU";
  const title = sectionData?.title || "BA TRỤ CỘT SỨC MẠNH CỦA NGUYÊN AGENCY";
  const description =
    sectionData?.description ||
    "Chúng tôi hợp nhất nghệ thuật kể chuyện thị giác, kỹ thuật lập trình hiệu năng cao và nghiên cứu AI thực nghiệm thành một hệ sinh thái khép kín.";

  const pillars = [
    {
      id: "media",
      index: "01",
      badge: "SÁNG TẠO & THỊ GIÁC",
      title: "MEDIA",
      tagline: "Định hình bản sắc & dẫn dắt cảm xúc thương hiệu",
      color: "#FF2D95",
      icon: Palette,
      description:
        "Xây dựng hệ thống nhận diện thương hiệu độc bản, sản xuất hình ảnh/video chuẩn điện ảnh và chiến lược truyền thông đa điểm chạm.",
      capabilities: [
        "Chiến lược & Nhận diện thương hiệu",
        "Đồ họa chuyển động 3D & TVC quảng cáo",
        "Hệ thống thiết kế UI/UX độc bản",
        "Marketing kỹ thuật số hiệu suất cao",
      ],
      stats: "12+ Dịch Vụ Sáng Tạo",
      href: "/services?group=MEDIA",
    },
    {
      id: "tech",
      index: "02",
      badge: "KỸ THUẬT & MỞ RỘNG",
      title: "TECH",
      tagline: "Kiến trúc phần mềm & trải nghiệm số siêu tốc",
      color: "#007BA7",
      icon: Cpu,
      description:
        "Phát triển Website 3D WebGL, Web Application phức tạp, ứng dụng di động đa nền tảng và hệ thống quản trị CRM/ERP may đo cho doanh nghiệp.",
      capabilities: [
        "Nền tảng Next.js, WebGL & Three.js",
        "Ứng dụng Web & Mobile Enterprise",
        "Kiến trúc CRM / ERP / CMS may đo",
        "Hạ tầng đám mây sẵn sàng 99.9%",
      ],
      stats: "99.9% Cam Kết SLA",
      href: "/services?group=TECH",
    },
    {
      id: "lab",
      index: "03",
      badge: "NGHIÊN CỨU & ĐỔI MỚI AI",
      title: "LAB",
      tagline: "Nghiên cứu sản phẩm số & tự động hóa thông minh",
      color: "#38BDF8",
      icon: FlaskConical,
      description:
        "Phòng thí nghiệm R&D phát triển các công cụ AI Agent, nền tảng SaaS tự động hóa quy trình và giải pháp công nghệ tương lai.",
      capabilities: [
        "Trợ lý AI & Quy trình tự động hóa LLM",
        "Sản phẩm SaaS vi mô & Công cụ nội bộ",
        "Bộ cấu hình 3D sản phẩm thời gian thực",
        "Dữ liệu thông minh & Tự động hóa",
      ],
      stats: "Công Cụ AI Độc Quyền",
      href: "/lab",
    },
  ];

  return (
    <section className="py-28 px-6 bg-[#0A0A0A] border-b border-[#1F1F23] relative overflow-hidden">
      {/* Subtle Ambient Accent */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-[#007BA7]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Heading */}
        <RevealOnScroll className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 pb-10 border-b border-[#1F1F23]">
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
          <p className="text-sm md:text-base text-[#A1A1AA] max-w-md leading-relaxed">
            {description}
          </p>
        </RevealOnScroll>

        {/* 3 Core Pillars Architectural Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <RevealOnScroll key={pillar.id} delay={idx * 0.1}>
                <div className="group relative h-full rounded-3xl bg-[#111114] border border-[#242429] hover:border-[#007BA7]/60 p-8 md:p-9 flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-18px_rgba(0,123,167,0.2)] overflow-hidden">
                  {/* Top Highlight Line */}
                  <div
                    className="absolute top-0 left-8 right-8 h-[1px] opacity-40 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${pillar.color}, transparent)`,
                    }}
                  />

                  {/* Subtle Corner Radial Glow */}
                  <div
                    className="absolute -right-20 -bottom-20 w-56 h-56 rounded-full opacity-0 group-hover:opacity-15 blur-3xl transition-opacity duration-500 pointer-events-none"
                    style={{ backgroundColor: pillar.color }}
                  />

                  <div>
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-bold text-white/40">
                          /{pillar.index}
                        </span>
                        <span className="text-[10px] font-mono tracking-widest text-[#A1A1AA] uppercase bg-[#18181C] border border-[#292929] px-3 py-1 rounded-full">
                          {pillar.badge}
                        </span>
                      </div>
                      <Magnetic strength={0.35}>
                        <div className="w-12 h-12 rounded-2xl bg-[#17171B] border border-[#292929] group-hover:border-white/20 flex items-center justify-center transition-colors">
                          <Icon className="w-5 h-5" style={{ color: pillar.color }} />
                        </div>
                      </Magnetic>
                    </div>

                    {/* Pillar Title & Tagline */}
                    <div className="mb-5">
                      <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-1.5">
                        {pillar.title}
                        <span style={{ color: pillar.color }}>.</span>
                      </h3>
                      <p className="text-xs font-mono text-[#D4D4D8]">{pillar.tagline}</p>
                    </div>

                    <p className="text-sm text-[#A1A1AA] leading-relaxed mb-7">
                      {pillar.description}
                    </p>

                    {/* Capabilities List */}
                    <div className="space-y-2.5 mb-8 pt-6 border-t border-[#1F1F23]">
                      {pillar.capabilities.map((cap, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-xs text-[#D4D4D8]">
                          <CheckCircle2
                            className="w-3.5 h-3.5 shrink-0"
                            style={{ color: pillar.color }}
                          />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-5 border-t border-[#242429] flex items-center justify-between">
                    <span className="text-xs font-mono text-[#71717A]">{pillar.stats}</span>
                    <Link
                      href={pillar.href}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white group-hover:text-[#38BDF8] transition-colors"
                    >
                      <span>Khám phá {pillar.title}</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
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
