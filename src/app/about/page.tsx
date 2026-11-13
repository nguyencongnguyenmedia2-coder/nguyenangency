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
  Award,
  Clock,
  Phone,
  Mail,
  Target,
} from "lucide-react";

export const metadata = {
  title: "Về Chúng Tôi – NGUYÊN AGENCY | Beyond Digital",
  description:
    "Tìm hiểu về sứ mệnh, triết lý sáng tạo, đội ngũ chuyên gia và hệ thống công nghệ tiên tiến tại NGUYÊN AGENCY.",
  alternates: {
    canonical: "https://nguyenagency.online/about",
  },
  openGraph: {
    title: "Về Chúng Tôi – NGUYÊN AGENCY | Beyond Digital",
    description:
      "Tìm hiểu về sứ mệnh, triết lý sáng tạo, đội ngũ chuyên gia và hệ thống công nghệ tiên tiến tại NGUYÊN AGENCY.",
    url: "https://nguyenagency.online/about",
    siteName: "NGUYÊN AGENCY",
    type: "website",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Về Chúng Tôi – NGUYÊN AGENCY | Beyond Digital",
    description:
      "Tìm hiểu về sứ mệnh, triết lý sáng tạo, đội ngũ chuyên gia và hệ thống công nghệ tiên tiến tại NGUYÊN AGENCY.",
  },
};

export default function AboutPage() {
  const leadership = [
    {
      name: "Nguyên Director",
      role: "Founder & Creative Director",
      bio: "12+ năm định hình ngôn ngữ thị giác cho các thương hiệu hàng đầu, tiên phong đưa 3D WebGL và nghệ thuật điện ảnh vào các dự án số thương mại quy mô lớn.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      tag: "Visionary & 3D Lead",
    },
    {
      name: "Minh Technical Lead",
      role: "Head of Engineering",
      bio: "Chuyên gia kiến trúc Cloud, Next.js và phân tán dữ liệu thời gian thực, đảm bảo chuẩn SLA 99.9% và độ phản hồi 60 FPS cho hệ thống doanh nghiệp.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      tag: "Architecture & Scale",
    },
    {
      name: "Hà Art Director",
      role: "Lead UI/UX & Motion Designer",
      bio: "Thạc sĩ Mỹ thuật ứng dụng, làm chủ các hiệu ứng GSAP Timeline, vi tương tác điện ảnh và kiến trúc Design Token đồng bộ đa nền tảng.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
      tag: "Art & Motion",
    },
    {
      name: "Quân AI Researcher",
      role: "Director of NGUYÊN LAB",
      bio: "Nghiên cứu sinh chuyên sâu về Diffusion Models, LLM fine-tuning, RAG và giải pháp tự động hóa nội dung số cho các doanh nghiệp mở rộng quy mô.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      tag: "AI & Innovation",
    },
  ];

  const pillars = [
    {
      icon: Palette,
      title: "MEDIA",
      subtitle: "Sáng Tạo & Nhận Diện Thị Giác",
      color: "#FF2D95",
      desc: "Xây dựng bản sắc thương hiệu độc bản, bộ nhận diện toàn diện chuẩn quốc tế, thiết kế đồ họa cao cấp và sản xuất video 3D CGI TVC mang phong cách điện ảnh khác biệt.",
      stats: "12+ Gói Dịch Vụ Sáng Tạo",
      tags: ["Brand Identity", "3D Motion CGI", "Design System"],
    },
    {
      icon: Cpu,
      title: "TECH",
      subtitle: "Kiến Trúc Phần Mềm & Web Siêu Tốc",
      color: "#00E5FF",
      desc: "Lập trình Website 3D Three.js, ứng dụng Web phức tạp, Mobile App và hệ thống ERP/CRM may đo trên nền tảng Next.js Serverless & PostgreSQL Cloud bảo mật đa tầng.",
      stats: "60 FPS • SLA 99.9%",
      tags: ["Next.js 14", "Three.js", "PostgreSQL", "Cloud VPS"],
    },
    {
      icon: FlaskConical,
      title: "LAB",
      subtitle: "Nghiên Cứu & Tự Động Hóa AI",
      color: "#A855F7",
      desc: "Phòng thí nghiệm công nghệ chuyên nghiên cứu các công cụ AI Agent tự động hóa, giải pháp SaaS thế hệ mới và các thử nghiệm tương tác không gian đón đầu tương lai số.",
      stats: "6+ Sản Phẩm AI Độc Quyền",
      tags: ["AI Agent RAG", "Workflow Auto", "3D Configurator"],
    },
  ];

  const milestones = [
    { year: "2021", title: "Khởi Đầu Định Mệnh", desc: "Thành lập NGUYÊN STUDIO với trọng tâm sáng tạo hình ảnh 3D và định hình nhận diện thương hiệu cho các khách hàng chọn lọc." },
    { year: "2023", title: "Bước Ngoặt Công Nghệ", desc: "Tiên phong tích hợp Three.js và WebGL vào sản xuất web thương mại, mở rộng mảng phát triển ứng dụng cao cấp đa thiết bị." },
    { year: "2024", title: "Ra Mắt NGUYÊN LAB", desc: "Thành lập nhánh nghiên cứu AI và phát triển các sản phẩm số, công cụ SaaS độc quyền hỗ trợ tối ưu hóa vận hành doanh nghiệp." },
    { year: "2026", title: "Hệ Sinh Thái Toàn Diện", desc: "Trở thành Digital Agency hàng đầu với nền tảng quản trị CMS & Telegram Bot riêng biệt, đồng hành cùng 50+ đối tác chiến lược." },
  ];

  const commitments = [
    { title: "100% Độc Bản May Đo", desc: "Không sử dụng theme mẫu đại trà, mọi thiết kế và dòng mã đều được chế tác riêng cho từng bài toán kinh doanh." },
    { title: "Bàn Giao Toàn Bộ Bản Quyền", desc: "Chuyển giao 100% mã nguồn (Source Code) và file thiết kế gốc (Figma Vector) thuộc toàn quyền sở hữu của khách hàng." },
    { title: "Bảo Mật Tiêu Chuẩn Doanh Nghiệp", desc: "Ký kết thỏa thuận bảo mật NDA trước khi triển khai, hạ tầng Cloud VPS riêng biệt đạt chuẩn ISO & SSL Let's Encrypt." },
    { title: "Bảo Hành Miễn Phí 12 Tháng", desc: "Đội ngũ kỹ thuật túc trực 24/7 xử lý sự cố trong vòng 2 giờ, sao lưu dữ liệu tự động định kỳ an toàn tuyệt đối." },
  ];

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-[#06070B] text-white relative overflow-hidden">
      {/* Subtle Ambient Lighting */}
      <div className="absolute top-1/4 left-0 w-[550px] h-[550px] bg-[#00E5FF]/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[550px] h-[550px] bg-[#FF2D95]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-28 relative z-10">
        {/* Hero Section */}
        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D121D] border border-[#00E5FF]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              BEYOND DIGITAL • VỀ NGUYÊN AGENCY
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight leading-[1.05]">
            NƠI TƯ DUY SÁNG TẠO <br />
            HỢP NHẤT <span className="bg-gradient-to-r from-[#00E5FF] via-[#00A3FF] to-[#FF2D95] bg-clip-text text-transparent">CÔNG NGHỆ ĐỈNH CAO.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#D4D4D8] leading-relaxed max-w-2xl font-normal">
            NGUYÊN AGENCY xóa bỏ ranh giới giữa một Digital Art Studio nghệ thuật và một Software Engineering House chuẩn mực quốc tế, kiến tạo lợi thế cạnh tranh áp đảo cho các thương hiệu dẫn đầu.
          </p>
        </div>

        {/* Narrative & Visual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 relative aspect-[16/9] rounded-3xl overflow-hidden border border-white/[0.08] bg-[#0E121E] shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80"
              alt="NGUYÊN AGENCY Workspace"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06070B] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 p-5 sm:p-6 rounded-2xl bg-[#08090E]/90 backdrop-blur-md border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#FF2D95] uppercase block mb-1 font-bold">
                  HEADQUARTERS & CREATIVE STUDIO
                </span>
                <p className="text-sm font-bold text-white">TP. Quảng Ngãi & TP. Hồ Chí Minh</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#00E5FF]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Operating Globally • 24/7</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-snug">
              Chúng tôi từ chối những khuôn mẫu đại trà.
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
              Trong kỷ nguyên số bão hòa, một website hay bộ nhận diện thông thường sẽ nhanh chóng chìm vào quên lãng. NGUYÊN AGENCY ứng dụng kỹ thuật điện ảnh không gian, tương tác 3D WebGL và tối ưu từng micro-interaction để mỗi lượt truy cập là một trải nghiệm đáng nhớ và kích hoạt hành vi mua hàng.
            </p>
            <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
              Mọi giải pháp của chúng tôi đều được bảo đảm bằng cam kết vận hành kỹ thuật nghiêm ngặt: tốc độ tải dưới 1.2 giây, hoạt động chuẩn 60 FPS trên thiết bị di động và bảo mật đa lớp an toàn.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/[0.08]">
              <div>
                <span className="text-2xl sm:text-3xl font-black font-mono text-white">100%</span>
                <p className="text-[10px] font-mono uppercase text-[#71717A] mt-1 font-bold">Độc Bản May Đo</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black font-mono text-[#00E5FF]">60 FPS</span>
                <p className="text-[10px] font-mono uppercase text-[#71717A] mt-1 font-bold">WebGL Siêu Mượt</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black font-mono text-[#FF2D95]">99.9%</span>
                <p className="text-[10px] font-mono uppercase text-[#71717A] mt-1 font-bold">SLA Uptime</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#FF2D95] mb-2 block font-bold">
                CORE ARCHITECTURE
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                BA TRỤ CỘT CHIẾN LƯỢC
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md">
              Hệ sinh thái toàn diện bao phủ từ sáng tạo nội dung, kiến trúc phần mềm đến nghiên cứu công nghệ tiên tiến.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-7 sm:p-8 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] hover:border-white/25 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-2 hover:shadow-[0_24px_50px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden"
                >
                  <div
                    className="absolute top-0 left-6 right-6 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${pillar.color}, transparent)`,
                    }}
                  />

                  <div>
                    <div className="flex items-center justify-between mb-7">
                      <div
                        className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform"
                        style={{
                          backgroundColor: `${pillar.color}15`,
                          borderColor: `${pillar.color}40`,
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: pillar.color }} />
                      </div>
                      <span className="text-[10px] font-mono text-[#D4D4D8] uppercase px-3 py-1 rounded-full bg-[#121622] border border-white/10 font-bold">
                        {pillar.stats}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white mb-1 tracking-wide">
                      {pillar.title}
                    </h3>
                    <span className="text-xs font-mono text-[#00E5FF] block mb-4 uppercase font-semibold">
                      {pillar.subtitle}
                    </span>
                    <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-6">
                      {pillar.desc}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {pillar.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#121622] text-[#A1A1AA] border border-white/5">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-5 border-t border-white/[0.08]">
                    <Link
                      href={pillar.title === "LAB" ? "/lab" : `/services?group=${pillar.title}`}
                      className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-white group-hover:text-[#00E5FF] transition-colors"
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

        {/* 4 Core Commitments */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] backdrop-blur-xl">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#00E5FF] font-bold block mb-2">
              GUARANTEED EXCELLENCE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
              CAM KẾT CHẤT LƯỢNG NGUYÊN AGENCY
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {commitments.map((c, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#121622]/80 border border-white/5 flex flex-col justify-between">
                <div>
                  <ShieldCheck className="w-6 h-6 text-[#00E5FF] mb-3" />
                  <h4 className="text-sm font-bold text-white mb-2">{c.title}</h4>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership & Team */}
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#00E5FF] mb-2 block font-bold">
              MINDS BEHIND THE CRAFT
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              ĐỘI NGŨ CHUYÊN GIA
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-3">
              Những cá nhân làm chủ công nghệ lập trình tương lai, nghệ thuật thị giác và tư duy tăng trưởng thực chiến.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {leadership.map((member) => (
              <div
                key={member.name}
                className="group rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] hover:border-[#00E5FF]/40 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-xl backdrop-blur-xl"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-[#121622]">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D14] via-transparent to-transparent opacity-85" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] font-mono tracking-widest text-[#00E5FF] uppercase bg-[#06070B]/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 font-bold inline-block mb-1">
                      {member.tag}
                    </span>
                    <h3 className="text-lg font-bold text-white">{member.name}</h3>
                    <p className="text-xs text-[#D4D4D8] font-mono">{member.role}</p>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-[#A1A1AA] leading-relaxed mb-4">
                    {member.bio}
                  </p>
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#71717A]">
                    <span>Kinh nghiệm 8+ năm</span>
                    <span className="text-emerald-400">● Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones Timeline */}
        <div className="space-y-12">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#FF2D95] mb-2 block font-bold">
              THE JOURNEY
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              HÀNH TRÌNH PHÁT TRIỂN
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] relative group hover:border-[#00E5FF]/40 transition-colors">
                <span className="text-3xl sm:text-4xl font-black font-mono text-white/30 group-hover:text-[#00E5FF] transition-colors block mb-3">
                  {m.year}
                </span>
                <h4 className="text-base font-bold text-white mb-2">{m.title}</h4>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-[#00A3FF]/15 via-[#007BA7]/10 to-[#FF2D95]/15 border border-white/10 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            SẴN SÀNG ĐỒNG HÀNH CÙNG NGUYÊN AGENCY?
          </h2>
          <p className="text-xs sm:text-sm text-[#D4D4D8] max-w-xl mx-auto leading-relaxed">
            Đặt lịch trao đổi trực tiếp cùng Solution Architect để nhận phân tích kiến trúc công nghệ và báo giá chi tiết trong vòng 24 giờ.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#00A3FF] via-[#007BA7] to-[#FF2D95] text-white font-bold text-xs uppercase tracking-wider hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Khởi Tạo Dự Án Ngay</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/services"
              className="px-7 py-3.5 rounded-full bg-[#121622] border border-white/10 text-white font-mono text-xs uppercase tracking-wider hover:bg-white/10 transition-colors"
            >
              <span>Khám Phá 24 Dịch Vụ</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
