import React from "react";
import Link from "next/link";
import { Palette, Cpu, FlaskConical, ArrowUpRight, CheckCircle2, ShieldCheck, Zap, Sparkles } from "lucide-react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import Magnetic from "@/components/motion/Magnetic";

export default function BrandIntroSection({ sectionData }: { sectionData?: any }) {
  const subtitle = sectionData?.subtitle || "01 • TUYÊN NGÔN THƯƠNG HIỆU & HỆ SINH THÁI";
  const title = sectionData?.title || "BA TRỤ CỘT SỨC MẠNH CỦA NGUYÊN AGENCY";
  const description =
    sectionData?.description ||
    "Chúng tôi hợp nhất nghệ thuật kể chuyện thị giác, kỹ thuật lập trình hiệu năng cao và nghiên cứu AI thực nghiệm thành một hệ sinh thái khép kín đáp ứng mọi nhu cầu mở rộng quy mô doanh nghiệp.";

  const pillars = [
    {
      id: "media",
      index: "01",
      badge: "SÁNG TẠO & THỊ GIÁC",
      title: "MEDIA",
      tagline: "Định hình bản sắc & dẫn dắt cảm xúc thương hiệu",
      color: "#FF2D95",
      accentBg: "rgba(255, 45, 149, 0.12)",
      icon: Palette,
      description:
        "Xây dựng hệ thống nhận diện thương hiệu độc bản chuẩn quốc tế, sản xuất hình ảnh/video 3D CGI chuẩn điện ảnh và chiến lược truyền thông đa điểm chạm gia tăng giá trị cảm nhận thương hiệu.",
      tags: ["Brand Identity", "Motion 3D", "TVC CGI", "Design System"],
      capabilities: [
        "Chiến lược định vị & Nhận diện thương hiệu độc bản",
        "Đồ họa chuyển động 3D CGI & TVC quảng cáo chuẩn 4K",
        "Hệ thống thiết kế UI/UX độc quyền chuẩn Design System",
        "Chiến dịch Digital Marketing hiệu suất cao (Meta, Google)",
      ],
      commitments: "Bàn giao 100% Vector & Bản quyền sở hữu",
      stats: "12+ Gói Dịch Vụ Sáng Tạo",
      href: "/services?group=MEDIA",
    },
    {
      id: "tech",
      index: "02",
      badge: "KỸ THUẬT & MỞ RỘNG",
      title: "TECH",
      tagline: "Kiến trúc phần mềm & trải nghiệm số 60 FPS siêu tốc",
      color: "#00E5FF",
      accentBg: "rgba(0, 229, 255, 0.12)",
      icon: Cpu,
      description:
        "Phát triển Website 3D WebGL tương tác không gian, ứng dụng Web/Mobile Enterprise phức tạp và hệ thống quản trị CRM/ERP may đo theo đặc thù vận hành của từng doanh nghiệp.",
      tags: ["Next.js 14", "Three.js", "PostgreSQL", "Cloud VPS"],
      capabilities: [
        "Website 3D WebGL tương tác không gian mượt mà 60 FPS",
        "Ứng dụng Web App & Nền tảng SaaS quy mô hàng triệu user",
        "Kiến trúc phần mềm CRM / ERP / CMS may đo bảo mật cao",
        "Hạ tầng Cloud VPS, Nginx, SSL Let's Encrypt sẵn sàng 99.9%",
      ],
      commitments: "Cam kết chuẩn SEO 95+ & Bảo hành 12 tháng",
      stats: "99.9% Cam Kết SLA Vận Hành",
      href: "/services?group=TECH",
    },
    {
      id: "lab",
      index: "03",
      badge: "NGHIÊN CỨU & ĐỔI MỚI AI",
      title: "LAB",
      tagline: "Sản phẩm công nghệ R&D & Tự động hóa thông minh",
      color: "#A855F7",
      accentBg: "rgba(168, 85, 247, 0.12)",
      icon: FlaskConical,
      description:
        "Phòng thí nghiệm R&D nội bộ nghiên cứu ứng dụng các mô hình AI Agent tiên tiến, nền tảng tự động hóa quy trình nghiệp vụ và các giải pháp công nghệ đón đầu tương lai số.",
      tags: ["AI Agent", "Workflow Auto", "3D Web", "R&D Tools"],
      capabilities: [
        "Trợ lý AI Agent thông minh giải quyết CSKH tự động 24/7",
        "Tự động hóa luồng làm việc doanh nghiệp với LLM & RAG",
        "Bộ công cụ 3D cấu hình sản phẩm tương tác thời gian thực",
        "Micro-SaaS nội bộ tối ưu hóa chi phí vận hành doanh nghiệp",
      ],
      commitments: "Triển khai trong 48 giờ & Tích hợp API linh hoạt",
      stats: "6+ Công Cụ AI Độc Quyền",
      href: "/lab",
    },
  ];

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 bg-[#06070B] border-b border-[#1A1A22] relative overflow-hidden">
      {/* Subtle Ambient Accent */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-[#00A3FF]/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-[#FF2D95]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Heading */}
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
          <div className="flex flex-col items-start lg:items-end gap-3 max-w-md">
            <p className="text-sm md:text-base text-[#D4D4D8] lg:text-right leading-relaxed">
              {description}
            </p>
            <span className="text-xs font-mono text-[#00E5FF] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Cam kết bảo mật thông tin dự án qua thỏa thuận NDA
            </span>
          </div>
        </RevealOnScroll>

        {/* 3 Core Pillars Architectural Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <RevealOnScroll key={pillar.id} delay={idx * 0.1}>
                <div className="group relative h-full rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] hover:border-white/25 p-7 sm:p-8 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_50px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden">
                  {/* Top Glowing Ambient Border */}
                  <div
                    className="absolute top-0 left-6 right-6 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${pillar.color}, transparent)`,
                    }}
                  />

                  {/* Corner Accent Glow */}
                  <div
                    className="absolute -right-16 -bottom-16 w-52 h-52 rounded-full opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500 pointer-events-none"
                    style={{ backgroundColor: pillar.color }}
                  />

                  <div>
                    {/* Card Header Bar */}
                    <div className="flex items-center justify-between mb-7">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-white/40">
                          /{pillar.index}
                        </span>
                        <span className="text-[10px] font-mono tracking-widest text-[#E4E4E7] uppercase bg-[#141824] border border-white/10 px-3 py-1 rounded-full font-bold">
                          {pillar.badge}
                        </span>
                      </div>
                      <Magnetic strength={0.35}>
                        <div
                          className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                          style={{
                            backgroundColor: pillar.accentBg,
                            borderColor: `${pillar.color}40`,
                          }}
                        >
                          <Icon className="w-5 h-5" style={{ color: pillar.color }} />
                        </div>
                      </Magnetic>
                    </div>

                    {/* Pillar Title & Tagline */}
                    <div className="mb-5">
                      <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-1.5">
                        {pillar.title}
                        <span style={{ color: pillar.color }}>.</span>
                      </h3>
                      <p className="text-xs font-mono text-[#D4D4D8] font-medium leading-relaxed">
                        {pillar.tagline}
                      </p>
                    </div>

                    {/* Tech & Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {pillar.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#121622] text-[#A1A1AA] border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-6">
                      {pillar.description}
                    </p>

                    {/* Capabilities Check List */}
                    <div className="space-y-2.5 mb-6 pt-5 border-t border-white/[0.08]">
                      {pillar.capabilities.map((cap, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-[#E4E4E7] leading-relaxed">
                          <CheckCircle2
                            className="w-4 h-4 shrink-0 mt-0.5"
                            style={{ color: pillar.color }}
                          />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>

                    {/* Guarantee commitment note */}
                    <div className="p-3 rounded-xl bg-[#121622]/80 border border-white/5 mb-6 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: pillar.color }} />
                      <span className="text-[11px] font-mono text-[#D4D4D8]">
                        {pillar.commitments}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between">
                    <span className="text-xs font-mono text-[#71717A] font-semibold">{pillar.stats}</span>
                    <Link
                      href={pillar.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white hover:text-[#00E5FF] transition-colors group/link"
                    >
                      <span>Khám phá {pillar.title}</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
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
