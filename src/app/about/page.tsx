import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sparkles,
  Palette,
  Cpu,
  FlaskConical,
  Trophy,
  Users,
  Compass,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Về Chúng Tôi – NGUYÊN AGENCY | Beyond Digital",
  description:
    "Tìm hiểu về sứ mệnh, triết lý sáng tạo, đội ngũ chuyên gia và hệ thống công nghệ tiên tiến tại NGUYÊN AGENCY.",
};

export default function AboutPage() {
  const leadership = [
    {
      name: "Nguyên Director",
      role: "Founder & Creative Director",
      bio: "12+ năm định hình ngôn ngữ thị giác cho các thương hiệu hàng đầu, tiên phong đưa 3D WebGL vào trải nghiệm thương mại.",
      avatar: "/images/team/nguyen-director.jpg",
      tag: "Visionary & 3D Lead",
    },
    {
      name: "Minh Technical Lead",
      role: "Head of Engineering",
      bio: "Chuyên gia kiến trúc Cloud, Next.js và phân tán dữ liệu, đảm bảo SLA 99.9% và độ phản hồi 60 FPS cho hệ thống.",
      avatar: "/images/team/minh-tech-lead.jpg",
      tag: "Architecture & Scale",
    },
    {
      name: "Hà Art Director",
      role: "Lead UI/UX & Motion Designer",
      bio: "Tốt nghiệp Đại học Mỹ thuật, làm chủ các hiệu ứng GSAP Timeline, vi tương tác điện ảnh và hệ thống Design Token.",
      avatar: "/images/team/ha-art-director.jpg",
      tag: "Art & Motion",
    },
    {
      name: "Quân AI Researcher",
      role: "Director of NGUYÊN LAB",
      bio: "Nghiên cứu ứng dụng Diffusion Models, LLM fine-tuning và giải pháp tự động hóa nội dung số cho doanh nghiệp.",
      avatar: "/images/team/quan-ai-researcher.jpg",
      tag: "AI & Innovation",
    },
  ];

  const pillars = [
    {
      icon: Palette,
      title: "MEDIA",
      subtitle: "Creative & Visual Branding",
      color: "#FF2D95",
      desc: "Xây dựng bản sắc thương hiệu độc bản, bộ nhận diện toàn diện, thiết kế đồ họa cao cấp và sản xuất video 3D TVC mang phong cách điện ảnh.",
      stats: "12+ Dịch vụ Sáng tạo",
    },
    {
      icon: Cpu,
      title: "TECH",
      subtitle: "Architecture & High Speed",
      color: "#007BA7",
      desc: "Lập trình Website 3D Three.js, ứng dụng Web phức tạp, Mobile App và hệ thống ERP/CRM may đo trên nền tảng Next.js & PostgreSQL.",
      stats: "60 FPS • 99.9% Uptime",
    },
    {
      icon: FlaskConical,
      title: "LAB",
      subtitle: "Research & Generative AI",
      color: "#FFFFFF",
      desc: "Phòng thí nghiệm công nghệ chuyên nghiên cứu các công cụ AI, giải pháp SaaS thế hệ mới và các thử nghiệm tương tác không gian.",
      stats: "Proprietary AI Tools",
    },
  ];

  const milestones = [
    { year: "2021", title: "Khởi Đầu Định Mệnh", desc: "Thành lập NGUYÊN STUDIO với trọng tâm sáng tạo hình ảnh 3D và nhận diện thương hiệu." },
    { year: "2023", title: "Bước Ngoặt Công Nghệ", desc: "Tích hợp Three.js và WebGL vào sản xuất web thương mại, mở rộng mảng phát triển ứng dụng cao cấp." },
    { year: "2024", title: "Ra Mắt NGUYÊN LAB", desc: "Thành lập nhánh nghiên cứu AI và phát triển các sản phẩm số, công cụ SaaS độc quyền." },
    { year: "2026", title: "Hệ Sinh Thái Toàn Diện", desc: "Trở thành Digital Agency hàng đầu với nền tảng quản trị CRM chuyên biệt và phục vụ 50+ khách hàng lớn." },
  ];

  return (
    <div className="pt-32 pb-24 px-6 bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto space-y-28">
        {/* Hero Section */}
        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#171717] border border-[#292929]">
            <Sparkles className="w-3.5 h-3.5 text-[#007BA7]" />
            <span className="text-xs font-mono tracking-widest text-white uppercase">
              BEYOND DIGITAL • ABOUT US
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tight leading-[1.05]">
            NƠI TƯ DUY SÁNG TẠO <br />
            HỢP NHẤT <span className="text-gradient-brand">CÔNG NGHỆ ĐỈNH CAO.</span>
          </h1>

          <p className="text-base md:text-xl text-[#A1A1AA] leading-relaxed max-w-2xl font-normal">
            NGUYÊN AGENCY xóa bỏ ranh giới giữa một Digital Art Studio nghệ thuật và một Software Engineering House chuẩn mực quốc tế, kiến tạo lợi thế cạnh tranh áp đảo cho các thương hiệu dẫn đầu.
          </p>
        </div>

        {/* Narrative & Visual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 relative aspect-[16/10] rounded-3xl overflow-hidden border border-[#292929] bg-[#121212]">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80"
              alt="NGUYÊN AGENCY Workspace"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl bg-[#0A0A0A]/85 backdrop-blur-md border border-[#292929] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-[#FF2D95] uppercase block mb-1">
                  HEADQUARTERS & CREATIVE STUDIO
                </span>
                <p className="text-sm font-bold text-white">Landmark 81 Sky Tower, TP. Hồ Chí Minh</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#007BA7]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Operating Globally</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
              Chúng tôi từ chối những khuôn mẫu đại trà.
            </h2>
            <p className="text-sm text-[#A1A1AA] leading-relaxed">
              Trong kỷ nguyên số bão hòa, một website hay bộ nhận diện thông thường sẽ nhanh chóng chìm vào quên lãng. NGUYÊN AGENCY ứng dụng kỹ thuật điện ảnh không gian, tương tác 3D WebGL và tối ưu từng micro-interaction để mỗi lượt truy cập là một trải nghiệm đáng nhớ.
            </p>
            <p className="text-sm text-[#A1A1AA] leading-relaxed">
              Mọi giải pháp của chúng tôi đều được bảo đảm bằng cam kết vận hành kỹ thuật nghiêm ngặt: tốc độ tải dưới 1 giây, hoạt động chuẩn 60 FPS trên thiết bị di động và bảo mật đa lớp an toàn.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#292929]">
              <div>
                <span className="text-3xl font-black font-mono text-white">100%</span>
                <p className="text-[10px] font-mono uppercase text-[#71717A] mt-1">Độc Bản May Đo</p>
              </div>
              <div>
                <span className="text-3xl font-black font-mono text-[#007BA7]">60 FPS</span>
                <p className="text-[10px] font-mono uppercase text-[#71717A] mt-1">WebGL Siêu Mượt</p>
              </div>
              <div>
                <span className="text-3xl font-black font-mono text-[#FF2D95]">99.9%</span>
                <p className="text-[10px] font-mono uppercase text-[#71717A] mt-1">SLA Uptime</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#292929]">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#FF2D95] mb-2 block">
                CORE ARCHITECTURE
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                BA TRỤ CỘT CHIẾN LƯỢC
              </h2>
            </div>
            <p className="text-xs text-[#A1A1AA] max-w-md">
              Hệ sinh thái toàn diện bao phủ từ sáng tạo nội dung, kiến trúc phần mềm đến nghiên cứu công nghệ tiên tiến.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-8 rounded-3xl bg-[#121212] border border-[#292929] hover:border-[#007BA7]/60 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-2 hover:shadow-card-depth"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-[#171717] border border-[#292929] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" style={{ color: pillar.color }} />
                      </div>
                      <span className="text-[10px] font-mono text-[#71717A] uppercase px-3 py-1 rounded-full border border-[#292929]">
                        {pillar.stats}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white mb-2 tracking-wide">
                      {pillar.title}
                    </h3>
                    <span className="text-xs font-mono text-[#007BA7] block mb-4 uppercase">
                      {pillar.subtitle}
                    </span>
                    <p className="text-xs text-[#A1A1AA] leading-relaxed mb-6">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-[#292929]">
                    <Link
                      href={pillar.title === "LAB" ? "/lab" : `/services?group=${pillar.title}`}
                      className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-white group-hover:text-[#007BA7] transition-colors"
                    >
                      <span>Xem Giải Pháp {pillar.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leadership & Team */}
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#007BA7] mb-2 block">
              MINDS BEHIND THE CRAFT
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              ĐỘI NGŨ CHUYÊN GIA
            </h2>
            <p className="text-xs text-[#A1A1AA] mt-3">
              Những cá nhân đam mê sự hoàn mỹ, làm chủ nghệ thuật thị giác và công nghệ lập trình tương lai.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadership.map((member) => (
              <div
                key={member.name}
                className="group rounded-3xl bg-[#121212] border border-[#292929] hover:border-[#FF2D95]/50 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-[#171717]">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-mono tracking-widest uppercase bg-[#0A0A0A]/90 backdrop-blur-md px-3 py-1 rounded-full text-white border border-[#292929]">
                      {member.tag}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#FF2D95] transition-colors">
                    {member.name}
                  </h3>
                  <span className="text-xs font-mono text-[#007BA7] block mb-3">
                    {member.role}
                  </span>
                  <p className="text-xs text-[#71717A] leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones Timeline */}
        <div className="space-y-12 p-8 md:p-14 rounded-3xl bg-[#121212] border border-[#292929]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#292929]">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#007BA7] mb-2 block">
                EVOLUTION TIMELINE
              </span>
              <h2 className="text-3xl font-black uppercase tracking-tight">
                HÀNH TRÌNH CHINH PHỤC
              </h2>
            </div>
            <p className="text-xs text-[#A1A1AA] max-w-sm">
              Những cột mốc khẳng định vị thế và năng lực tiên phong của NGUYÊN AGENCY.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {milestones.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#171717] border border-[#292929] relative">
                <span className="text-4xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-[#007BA7] to-[#FF2D95] block mb-3">
                  {item.year}
                </span>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-[#71717A] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-10 md:p-16 rounded-3xl bg-gradient-to-r from-[#171717] to-[#121212] border border-[#292929] text-center max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight">
            SẴN SÀNG ĐƯA THƯƠNG HIỆU <br />
            <span className="text-gradient-brand">VƯƠN TẦM SỐ HÓA?</span>
          </h2>
          <p className="text-sm text-[#A1A1AA] max-w-xl mx-auto">
            Đặt lịch trao đổi chiến lược cùng Giám đốc Sáng tạo và Đội ngũ Kỹ thuật trưởng của NGUYÊN AGENCY ngay hôm nay.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-mono text-xs font-bold uppercase tracking-wider hover:shadow-glow-pink transition-all flex items-center gap-2"
            >
              <span>Khởi Động Dự Án Ngay</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/portfolio"
              className="px-8 py-4 rounded-full bg-[#121212] border border-[#292929] hover:border-[#007BA7] text-[#A1A1AA] hover:text-white font-mono text-xs uppercase transition-all"
            >
              <span>Xem Các Dự Án Mẫu</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
