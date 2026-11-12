import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  Trophy,
  Layers,
  Cpu,
  BarChart3,
  ShieldCheck,
  Zap,
  ArrowRight,
  Monitor,
} from "lucide-react";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Portfolio & Case Studies Tiêu Biểu – NGUYÊN AGENCY",
  description:
    "Bộ sưu tập các dự án kỹ thuật số, nhận diện thương hiệu độc bản và ứng dụng Web 3D tiêu biểu do NGUYÊN AGENCY thực hiện với số liệu tăng trưởng thực tế.",
};

export const revalidate = 60;

interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  category?: { name: string; slug: string } | null;
  thumbnail: string;
  shortDesc: string;
  year: number | string;
  liveUrl?: string | null;
  technologiesJson?: string;
  resultsJson?: string;
}

const FALLBACK_PORTFOLIOS: PortfolioItem[] = [
  {
    id: "fb-1",
    slug: "apex-hypercar-3d-configurator",
    title: "Apex Motors – 3D WebGL Realtime Car Configurator",
    clientName: "Apex Motors Vietnam",
    category: { name: "3D WebGL & Interactive", slug: "3d-webgl" },
    thumbnail: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
    shortDesc: "Trải nghiệm cấu hình siêu xe 3D tương tác thời gian thực trên trình duyệt với 60 FPS mượt mà, kết xuất vật liệu PBR tùy biến sơn, mâm và nội thất.",
    year: 2026,
    liveUrl: "https://example.com/demo-car",
    technologiesJson: JSON.stringify(["Three.js", "WebGL", "Next.js 15", "GLSL Shaders", "TailwindCSS"]),
    resultsJson: JSON.stringify(["+320% Thời gian tương tác", "60 FPS Ổn định", "Lighthouse 99/100"]),
  },
  {
    id: "fb-2",
    slug: "lumina-ai-enterprise-platform",
    title: "Lumina AI – Nền Tảng Điều Hành Tác Tử Tự Động",
    clientName: "Lumina Corporation",
    category: { name: "Web App & SaaS", slug: "saas" },
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    shortDesc: "Kiến trúc SaaS đa người dùng phục vụ tự động hóa quy trình nghiệp vụ với AI Agents, dashboard phân tích dữ liệu luồng lớn và API Gateway.",
    year: 2025,
    liveUrl: "https://example.com/lumina",
    technologiesJson: JSON.stringify(["Next.js", "TypeScript", "PostgreSQL", "TailwindCSS", "FastAPI"]),
    resultsJson: JSON.stringify(["120k+ Requests/phút", "Giảm 65% chi phí vận hành", "SLA 99.99%"]),
  },
  {
    id: "fb-3",
    slug: "vesper-residence-virtual-tour",
    title: "Vesper Luxury Residence – Không Gian Bất Động Sản Metaverse",
    clientName: "Vesper Group",
    category: { name: "3D WebGL & Interactive", slug: "3d-webgl" },
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    shortDesc: "Virtual tour 360 độ tương tác không gian kiến trúc cao cấp, cho phép khách VIP trải nghiệm ánh sáng theo giờ và view toàn cảnh bờ sông.",
    year: 2025,
    liveUrl: "https://example.com/vesper",
    technologiesJson: JSON.stringify(["React Three Fiber", "WebAudio API", "Next.js", "GSAP"]),
    resultsJson: JSON.stringify(["2.4x Tỷ lệ chốt cọc VIP", "15,000+ Lượt tham quan/tháng"]),
  },
  {
    id: "fb-4",
    slug: "nexo-global-fintech-hub",
    title: "Nexo Global – Cổng Thanh Toán & Quản Trị Tài Chính Xuyên Biên Giới",
    clientName: "Nexo Financial Ltd",
    category: { name: "Web App & SaaS", slug: "saas" },
    thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
    shortDesc: "Giao diện quản lý dòng tiền thời gian thực với biểu đồ tài chính cấp tổ chức, mã hóa đầu cuối và tuân thủ PCI-DSS Level 1.",
    year: 2025,
    liveUrl: "https://example.com/nexo",
    technologiesJson: JSON.stringify(["Next.js", "Chart.js", "WebSockets", "Prisma", "Redis"]),
    resultsJson: JSON.stringify(["$45M+ Giao dịch xử lý", "Độ trễ < 80ms"]),
  },
  {
    id: "fb-5",
    slug: "aura-haute-couture-brand-system",
    title: "Aura Haute Couture – Hệ Thống Nhận Diện Thương Hiệu Độc Bản",
    clientName: "Aura Paris Fashion House",
    category: { name: "Brand Identity", slug: "branding" },
    thumbnail: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    shortDesc: "Tái định vị toàn diện thương hiệu thời trang cao cấp: hệ thống Typography độc bản, bao bì dập nổi kim loại và bộ nhận diện số hóa toàn cầu.",
    year: 2024,
    liveUrl: null,
    technologiesJson: JSON.stringify(["Design System", "Art Direction", "Packaging", "Brand Guidelines"]),
    resultsJson: JSON.stringify(["+180% Giá trị thương hiệu", "Top 10 Thiết kế Sáng tạo 2024"]),
  },
  {
    id: "fb-6",
    slug: "zenith-cloud-ops-dashboard",
    title: "Zenith Cloud – Hệ Thống Giám Sát Hạ Tầng Đa Đám Mây",
    clientName: "Zenith Cloud Solutions",
    category: { name: "Web App & SaaS", slug: "saas" },
    thumbnail: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80",
    shortDesc: "Bảng điều khiển phân tích số liệu máy chủ thời gian thực, cảnh báo bất thường sử dụng mô hình học máy và phân tích tải thông minh.",
    year: 2024,
    liveUrl: "https://example.com/zenith",
    technologiesJson: JSON.stringify(["Next.js", "TailwindCSS", "Kafka", "Grafana API", "Docker"]),
    resultsJson: JSON.stringify(["Giảm 90% False Alarms", "99.999% High Availability"]),
  },
];

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }> | { category?: string };
}) {
  const resolvedParams = searchParams ? await Promise.resolve(searchParams) : {};
  const activeCategory = resolvedParams?.category || "ALL";

  let dbCategories: any[] = [];
  let dbPortfolios: any[] = [];

  try {
    const results = await Promise.all([
      prisma.portfolioCategory.findMany({
        orderBy: { order: "asc" },
      }),
      prisma.portfolio.findMany({
        where: {
          status: "PUBLISHED",
          deletedAt: null,
          ...(activeCategory !== "ALL"
            ? { category: { slug: activeCategory } }
            : {}),
        },
        include: { category: true },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      }),
    ]);
    dbCategories = results[0] || [];
    dbPortfolios = results[1] || [];
  } catch (err) {
    console.warn("[PortfolioPage] DB fetch fallback active:", err);
  }

  // Categories list
  const categories =
    dbCategories.length > 0
      ? dbCategories
      : [
          { id: "c1", name: "3D WebGL & Interactive", slug: "3d-webgl" },
          { id: "c2", name: "Web App & SaaS", slug: "saas" },
          { id: "c3", name: "Brand Identity", slug: "branding" },
        ];

  // Portfolio list with fallback
  let displayPortfolios = dbPortfolios.length > 0 ? dbPortfolios : FALLBACK_PORTFOLIOS;
  if (activeCategory !== "ALL") {
    displayPortfolios = displayPortfolios.filter(
      (item) => item.category?.slug === activeCategory
    );
    if (displayPortfolios.length === 0) {
      displayPortfolios = FALLBACK_PORTFOLIOS.filter(
        (item) => item.category?.slug === activeCategory
      );
    }
  }

  return (
    <div className="pt-32 pb-24 px-6 bg-[#06070B] text-white relative min-h-screen">
      {/* Background Gradients */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-r from-[#00E5FF]/10 via-[#FF2D95]/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* Header */}
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md">
            <Trophy className="w-3.5 h-3.5 text-[#FF2D95]" />
            <span className="text-[11px] font-mono tracking-widest text-[#FF2D95] uppercase font-bold">
              PROVEN DIGITAL IMPACT • CASE STUDIES
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[1.08]">
            DỰ ÁN TIÊU BIỂU & <br />
            <span className="bg-gradient-to-r from-[#00E5FF] via-[#FF2D95] to-[#A855F7] bg-clip-text text-transparent">
              CASE STUDIES ĐỘC BẢN.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            Mỗi công trình là một bài toán kỹ thuật & thẩm mỹ được giải quyết triệt để. Chúng tôi kết hợp trải nghiệm 3D WebGL đột phá, kiến trúc đám mây kiên cố và chiến lược thương hiệu để mang lại tăng trưởng đo lường được cho đối tác.
          </p>
        </div>

        {/* Real Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl">
          <div className="space-y-1 p-3">
            <div className="text-3xl font-black text-white font-mono flex items-center gap-1">
              50<span className="text-[#00E5FF]">+</span>
            </div>
            <div className="text-xs font-mono text-[#94A3B8] uppercase">Dự án hoàn thành</div>
            <div className="text-[11px] text-white/40">Từ Brand đến Enterprise Web</div>
          </div>
          <div className="space-y-1 p-3 border-l border-white/[0.06]">
            <div className="text-3xl font-black text-white font-mono flex items-center gap-1">
              99.8<span className="text-[#FF2D95]">%</span>
            </div>
            <div className="text-xs font-mono text-[#94A3B8] uppercase">Khách hàng hài lòng</div>
            <div className="text-[11px] text-white/40">Đánh giá 5 sao về chất lượng</div>
          </div>
          <div className="space-y-1 p-3 border-l border-white/[0.06]">
            <div className="text-3xl font-black text-white font-mono flex items-center gap-1">
              3.4<span className="text-[#A855F7]">x</span>
            </div>
            <div className="text-xs font-mono text-[#94A3B8] uppercase">Tăng trưởng chuyển đổi</div>
            <div className="text-[11px] text-white/40">Trung bình sau khi tái thiết kế</div>
          </div>
          <div className="space-y-1 p-3 border-l border-white/[0.06]">
            <div className="text-3xl font-black text-white font-mono flex items-center gap-1">
              100<span className="text-[#00E5FF]">%</span>
            </div>
            <div className="text-xs font-mono text-[#94A3B8] uppercase">Đúng tiến độ cam kết</div>
            <div className="text-[11px] text-white/40">Phạt chậm tiến độ theo hợp đồng</div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-white/[0.08] no-scrollbar">
          <Link
            href="/portfolio"
            className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all whitespace-nowrap ${
              activeCategory === "ALL"
                ? "bg-white text-black font-black shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                : "bg-white/[0.03] text-[#94A3B8] hover:text-white hover:bg-white/[0.06] border border-white/[0.08]"
            }`}
          >
            TẤT CẢ DỰ ÁN ({displayPortfolios.length})
          </Link>
          {categories.map((cat: any) => (
            <Link
              key={cat.id || cat.slug}
              href={`/portfolio?category=${cat.slug}`}
              className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all whitespace-nowrap ${
                activeCategory === cat.slug
                  ? "bg-gradient-to-r from-[#00E5FF] to-[#FF2D95] text-white font-black shadow-[0_0_20px_rgba(255,45,149,0.35)]"
                  : "bg-white/[0.03] text-[#94A3B8] hover:text-white hover:bg-white/[0.06] border border-white/[0.08]"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {displayPortfolios.map((item) => {
            let techStack: string[] = [];
            let results: string[] = [];
            try {
              techStack = JSON.parse(item.technologiesJson || "[]");
              results = JSON.parse(item.resultsJson || "[]");
            } catch (e) {
              // fallback
            }

            return (
              <div
                key={item.id}
                className="group rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] hover:border-white/[0.2] overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl relative"
              >
                {/* Browser Mockup Top Bar */}
                <div className="px-5 py-3.5 bg-black/40 border-b border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-3 text-[11px] text-white/50 tracking-wider hidden sm:inline">
                      https://nguyenagency.com/cases/{item.slug}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase font-bold text-[#00E5FF]">
                      {item.year}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/[0.06] text-[10px] text-white/70">
                      {item.category?.name || "Digital Works"}
                    </span>
                  </div>
                </div>

                {/* Visual Thumbnail */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F17] via-transparent to-transparent opacity-80" />

                  {/* Impact Floating Chips */}
                  {results.length > 0 && (
                    <div className="absolute bottom-4 left-5 right-5 flex flex-wrap gap-2">
                      {results.slice(0, 2).map((res, i) => (
                        <span
                          key={i}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-black/75 backdrop-blur-md text-[#00E5FF] border border-[#00E5FF]/30 flex items-center gap-1.5 shadow-lg"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#FF2D95]" />
                          <span>{res}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-7 sm:p-8 flex flex-col flex-1 justify-between space-y-6">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#00E5FF] tracking-wider uppercase mb-2">
                      <span>Khách hàng: {item.clientName}</span>
                      <span className="text-white/40">Verified Case</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#00E5FF] transition-colors leading-snug mb-3">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed line-clamp-3">
                      {item.shortDesc}
                    </p>

                    {/* Tech Badges */}
                    {techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-white/[0.06]">
                        {techStack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-white/[0.04] text-[#E2E8F0] border border-white/[0.08]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                    <Link
                      href={`/portfolio/${item.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-white group-hover:text-[#FF2D95] transition-colors"
                    >
                      <span>Xem Toàn Bộ Case Study</span>
                      <ArrowUpRight className="w-4 h-4 text-[#FF2D95] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>

                    {item.liveUrl && (
                      <a
                        href={item.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-white/70 hover:text-white transition-colors border border-white/[0.08]"
                        title="Trải nghiệm trang web trực tiếp"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Workflow & Delivery Quality Assurance */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] backdrop-blur-xl space-y-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              TIÊU CHUẨN XUẤT XƯỞNG
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white">
              NGUYÊN TẮC BÀN GIAO KHÔNG THỎA HIỆP.
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Mỗi dự án tại NGUYÊN AGENCY trước khi bàn giao đều phải vượt qua bài kiểm tra nghiêm ngặt gồm 4 tiêu chuẩn vàng:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-3">
              <Zap className="w-5 h-5 text-[#00E5FF]" />
              <h3 className="font-bold text-white text-sm">Lighthouse Score &gt; 95</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Tối ưu Core Web Vitals, nén ảnh AVIF/WebP, tải mã nguồn bất đồng bộ và hỗ trợ SEO On-page hoàn hảo.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-3">
              <Monitor className="w-5 h-5 text-[#FF2D95]" />
              <h3 className="font-bold text-white text-sm">Responsive 100% Mọi Màn Hình</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Tương thích mượt mà từ iPhone màn hình nhỏ đến màn hình cong siêu rộng 4K/8K không vỡ layout.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-3">
              <ShieldCheck className="w-5 h-5 text-[#A855F7]" />
              <h3 className="font-bold text-white text-sm">Bảo Mật Cấp Doanh Nghiệp</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Mã hóa SSL/TLS, ngăn chặn SQL Injection, XSS, bảo vệ CSRF và tuân thủ các quy định bảo vệ dữ liệu.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-3">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">Bàn Giao 100% Bản Quyền</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Bàn giao trọn gói Git Repository, file thiết kế Figma gốc, tài liệu triển khai và hướng dẫn vận hành.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-r from-[#00E5FF]/10 via-[#FF2D95]/10 to-purple-600/10 border border-white/[0.12] flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-[10px] font-mono text-[#00E5FF] uppercase">
              <Sparkles className="w-3 h-3 text-[#FF2D95]" />
              READY TO BUILD SOMETHING EXTRAORDINARY?
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white">
              BẠN ĐÃ SẴN SÀNG KIẾN TẠO DỰ ÁN TIẾP THEO?
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8]">
              Cùng chuyên gia của NGUYÊN AGENCY đánh giá bối cảnh, phác thảo kiến trúc và nhận báo giá chi tiết trong vòng 24 giờ làm việc.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#FF2D95] text-white font-mono text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_25px_rgba(255,45,149,0.5)] transition-all flex items-center justify-center gap-2"
            >
              <span>Khởi Tạo Dự Án Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
