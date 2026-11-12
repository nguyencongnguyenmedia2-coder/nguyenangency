import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  Cpu,
  Palette,
  Clock,
  DollarSign,
  ShieldCheck,
  Search,
  Zap,
  Layers,
  ArrowRight,
} from "lucide-react";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Hệ Sinh Thái 24 Dịch Vụ – NGUYÊN AGENCY | Media & Tech Solutions",
  description:
    "Trọn bộ 24 dịch vụ truyền thông sáng tạo MEDIA và giải pháp phần mềm công nghệ cao TECH đạt chuẩn quốc tế.",
};

export const revalidate = 60;

const FALLBACK_ALL_SERVICES = [
  {
    id: "svc_01",
    title: "Phát Triển Website 3D & Three.js",
    slug: "3d-website-development",
    group: "TECH",
    shortDesc: "Kiến trúc website tương tác không gian 3D WebGL đột phá, tối ưu hóa tốc độ 60 FPS chuẩn Luxury Brand toàn cầu.",
    estimatedTime: "3 - 5 tuần",
    startingPrice: 45000000,
    priceLabel: "Từ 45.000.000 ₫",
    benefitsJson: JSON.stringify(["Mô hình 3D tương tác thực tế", "WebGL tối ưu 60 FPS", "Chuẩn SEO 95+ & Mobile First", "Bàn giao 100% mã nguồn"]),
    featuresJson: JSON.stringify(["Three.js / React Three Fiber", "Custom Shaders & Ánh sáng", "CMS Quản trị nội dung độc quyền"]),
    category: { name: "3D & Interactive" },
  },
  {
    id: "svc_02",
    title: "Nhận Diện Thương Hiệu Độc Bản (Luxury Brand)",
    slug: "luxury-brand-identity",
    group: "MEDIA",
    shortDesc: "Định hình ngôn ngữ thị giác sang trọng, hệ thống Brand Guideline và tài sản nhận diện đa nền tảng.",
    estimatedTime: "2 - 3 tuần",
    startingPrice: 30000000,
    priceLabel: "Từ 30.000.000 ₫",
    benefitsJson: JSON.stringify(["Bộ nhận diện chuẩn quốc tế", "Brand Guideline toàn diện 80+ trang", "Bàn giao file vector gốc & Font quyền"]),
    featuresJson: JSON.stringify(["Logo & Typography độc quyền", "Ấn phẩm truyền thông số", "Hồ sơ năng lực Profile"]),
    category: { name: "Branding & Visual" },
  },
  {
    id: "svc_03",
    title: "Ứng Dụng Web & Nền Tảng SaaS Doanh Nghiệp",
    slug: "saas-web-application",
    group: "TECH",
    shortDesc: "Phần mềm quản trị đám mây, tích hợp CRM tự động hóa và bảo mật đa tầng cho doanh nghiệp mở rộng quy mô triệu user.",
    estimatedTime: "4 - 8 tuần",
    startingPrice: 60000000,
    priceLabel: "Từ 60.000.000 ₫",
    benefitsJson: JSON.stringify(["Kiến trúc Next.js Serverless", "Bảo mật chuẩn ISO & OWASP", "Khả năng mở rộng hàng triệu user"]),
    featuresJson: JSON.stringify(["Hệ thống Auth & RBAC", "Dashboard báo cáo Real-time", "API Gateway đa kênh"]),
    category: { name: "Web & Software" },
  },
  {
    id: "svc_04",
    title: "Sản Xuất TVC & Video Motion 3D CGI",
    slug: "3d-motion-tvc-production",
    group: "MEDIA",
    shortDesc: "Thước phim quảng cáo điện ảnh 3D CGI mãn nhãn, thu hút hàng triệu lượt xem và khẳng định vị thế dẫn đầu ngành.",
    estimatedTime: "3 - 4 tuần",
    startingPrice: 50000000,
    priceLabel: "Từ 50.000.000 ₫",
    benefitsJson: JSON.stringify(["Kỹ xảo 3D CGI điện ảnh", "Kịch bản viral đa nền tảng", "Render 4K chuẩn rạp phim"]),
    featuresJson: JSON.stringify(["Storyboard nghệ thuật", "Âm thanh Sound Design độc quyền", "Định dạng tối ưu TikTok & Ads"]),
    category: { name: "CGI & Motion" },
  },
  {
    id: "svc_05",
    title: "Tích Hợp Trí Tuệ Nhân Tạo (Generative AI)",
    slug: "generative-ai-integration",
    group: "TECH",
    shortDesc: "Tích hợp trợ lý ảo AI LLM, tự động hóa dịch vụ khách hàng 24/7 và hệ thống gợi ý thông minh chuyển đổi cao.",
    estimatedTime: "2 - 4 tuần",
    startingPrice: 40000000,
    priceLabel: "Từ 40.000.000 ₫",
    benefitsJson: JSON.stringify(["Tự động hóa 80% tác vụ hỗ trợ", "Fine-tune dữ liệu riêng của DN", "Đa ngôn ngữ thông minh"]),
    featuresJson: JSON.stringify(["OpenAI / Claude API", "Vector Database RAG", "Bảo mật dữ liệu tuyệt đối"]),
    category: { name: "AI & Innovation" },
  },
  {
    id: "svc_06",
    title: "Chiến Lược Digital Marketing & Tăng Trưởng",
    slug: "performance-digital-marketing",
    group: "MEDIA",
    shortDesc: "Tối ưu hóa phễu chuyển đổi số toàn diện, gia tăng tỷ lệ chốt đơn và doanh thu cho thương hiệu bền vững.",
    estimatedTime: "Theo chiến dịch",
    startingPrice: 25000000,
    priceLabel: "Từ 25.000.000 ₫",
    benefitsJson: JSON.stringify(["Tối ưu ROAS và CPA đo lường", "Theo dõi Attribution minh bạch", "Báo cáo tự động mỗi ngày"]),
    featuresJson: JSON.stringify(["Quảng cáo Meta & Google Ads", "Content Marketing chuyển đổi", "Phân tích số liệu Conversion"]),
    category: { name: "Growth & Performance" },
  },
];

export default async function ServicesPage({
  searchParams,
}: {
  searchParams?: Promise<{ group?: string; q?: string }> | { group?: string; q?: string };
}) {
  const resolvedParams = searchParams ? await Promise.resolve(searchParams) : {};
  const activeGroup = resolvedParams?.group?.toUpperCase() || "ALL";
  const query = resolvedParams?.q?.toLowerCase() || "";

  let services: any[] = [];
  let totalMedia = 0;
  let totalTech = 0;

  try {
    const results = await Promise.all([
      prisma.service.findMany({
        where: {
          status: "PUBLISHED",
          deletedAt: null,
          ...(activeGroup === "MEDIA" || activeGroup === "TECH"
            ? { group: activeGroup }
            : {}),
          ...(query
            ? {
                OR: [
                  { title: { contains: query } },
                  { shortDesc: { contains: query } },
                ],
              }
            : {}),
        },
        include: {
          category: true,
        },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      }),
      prisma.service.count({
        where: { status: "PUBLISHED", deletedAt: null, group: "MEDIA" },
      }),
      prisma.service.count({
        where: { status: "PUBLISHED", deletedAt: null, group: "TECH" },
      }),
    ]);

    services = results[0] || [];
    totalMedia = results[1] || 0;
    totalTech = results[2] || 0;
  } catch (err) {
    console.warn("[ServicesPage] DB load fallback active:", err);
  }

  if (!services || services.length === 0) {
    services = FALLBACK_ALL_SERVICES.filter((s) => {
      if (activeGroup !== "ALL" && s.group !== activeGroup) return false;
      if (query && !s.title.toLowerCase().includes(query) && !s.shortDesc.toLowerCase().includes(query)) return false;
      return true;
    });
    totalMedia = FALLBACK_ALL_SERVICES.filter((s) => s.group === "MEDIA").length;
    totalTech = FALLBACK_ALL_SERVICES.filter((s) => s.group === "TECH").length;
  }

  const totalAll = totalMedia + totalTech;

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-[#06070B] text-white relative overflow-hidden">
      {/* Subtle Ambient Lighting */}
      <div className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-[#00E5FF]/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-[550px] h-[550px] bg-[#FF2D95]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Hero Section */}
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D121D] border border-[#00E5FF]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              24 COMPREHENSIVE SOLUTIONS • ECOSYSTEM
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[1.08]">
            HỆ SINH THÁI GIẢI PHÁP <br />
            <span className="bg-gradient-to-r from-[#00E5FF] via-[#00A3FF] to-[#FF2D95] bg-clip-text text-transparent">MEDIA & TECH CHUYÊN BIỆT.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#D4D4D8] leading-relaxed">
            Chúng tôi cung cấp 24 giải pháp toàn diện từ truyền thông thương hiệu độc bản đến kiến trúc phần mềm tốc độ cao, được may đo hoàn hảo cho từng mục tiêu kinh doanh và chuyển đổi số bứt phá.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="p-4 sm:p-6 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <Link
              href="/services"
              className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all whitespace-nowrap font-bold ${
                activeGroup === "ALL"
                  ? "bg-gradient-to-r from-[#00A3FF] to-[#FF2D95] text-white shadow-lg"
                  : "bg-[#121622] text-[#A1A1AA] hover:text-white border border-white/10"
              }`}
            >
              TẤT CẢ DỊCH VỤ ({totalAll})
            </Link>
            <Link
              href="/services?group=MEDIA"
              className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5 whitespace-nowrap font-bold ${
                activeGroup === "MEDIA"
                  ? "bg-[#FF2D95] text-white shadow-[0_0_20px_rgba(255,45,149,0.4)]"
                  : "bg-[#121622] text-[#A1A1AA] hover:text-white border border-white/10"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>MEDIA SÁNG TẠO ({totalMedia})</span>
            </Link>
            <Link
              href="/services?group=TECH"
              className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5 whitespace-nowrap font-bold ${
                activeGroup === "TECH"
                  ? "bg-[#00E5FF] text-black shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                  : "bg-[#121622] text-[#A1A1AA] hover:text-white border border-white/10"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>TECH CÔNG NGHỆ ({totalTech})</span>
            </Link>
          </div>

          <span className="text-xs font-mono text-[#71717A] shrink-0 font-semibold">
            Hiển thị {services.length} giải pháp tiêu chuẩn
          </span>
        </div>

        {/* Services Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {services.map((service, idx) => {
            const isMedia = service.group === "MEDIA";
            const accentColor = isMedia ? "#FF2D95" : "#00E5FF";

            let benefits: string[] = [];
            try {
              benefits = typeof service.benefitsJson === "string" ? JSON.parse(service.benefitsJson || "[]") : service.benefitsJson || [];
            } catch {
              benefits = [];
            }

            return (
              <div
                key={service.id}
                className="group p-7 sm:p-8 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] hover:border-white/25 transition-all duration-300 flex flex-col justify-between hover:-translate-y-2 hover:shadow-[0_24px_50px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden"
              >
                {/* Glow accent */}
                <div
                  className="absolute -right-20 -top-20 w-44 h-44 rounded-full opacity-0 group-hover:opacity-15 blur-3xl transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: accentColor }}
                />

                <div>
                  {service.thumbnail && (
                    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#121622] border border-white/10 mb-5">
                      <Image
                        src={service.thumbnail}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Top meta tags */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full border font-bold ${
                        isMedia
                          ? "bg-[#FF2D95]/10 text-[#FF2D95] border-[#FF2D95]/30"
                          : "bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30"
                      }`}
                    >
                      {isMedia ? "MEDIA SÁNG TẠO" : "TECH CÔNG NGHỆ"}
                    </span>
                    {service.estimatedTime && (
                      <span className="text-[11px] font-mono text-[#D4D4D8] bg-[#121622] px-2.5 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#00E5FF]" />
                        {service.estimatedTime}
                      </span>
                    )}
                  </div>

                  <Link href={`/services/${service.slug}`}>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-[#00E5FF] transition-colors leading-snug">
                      {service.title}
                    </h3>
                  </Link>

                  <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-6">
                    {service.shortDesc}
                  </p>

                  {/* Deliverables Checklist */}
                  {benefits.length > 0 && (
                    <div className="space-y-2 mb-6 pt-5 border-t border-white/[0.08]">
                      {benefits.slice(0, 4).map((b: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-[#E4E4E7]">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: accentColor }} />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer with Price & Actions */}
                <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#71717A] block font-bold">
                      NGÂN SÁCH ĐẦU TƯ
                    </span>
                    <span className="text-sm sm:text-base font-mono font-bold text-white">
                      {service.priceLabel || (service.startingPrice ? `Từ ${Number(service.startingPrice).toLocaleString("vi-VN")} ₫` : "Liên hệ báo giá")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/services/${service.slug}`}
                      className="px-4 py-2 rounded-full bg-[#121622] border border-white/10 text-xs font-mono uppercase text-white hover:border-[#00E5FF] transition-colors font-bold"
                    >
                      Chi Tiết
                    </Link>
                    <Link
                      href={`/contact?service=${encodeURIComponent(service.title)}`}
                      className="p-2 rounded-full bg-gradient-to-r from-[#00A3FF] to-[#FF2D95] text-white hover:scale-105 transition-transform"
                      title="Báo giá ngay"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enterprise Service Guarantee Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex items-start gap-3.5">
              <ShieldCheck className="w-6 h-6 text-[#00E5FF] shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">100% Bản Quyền Mã Nguồn</h4>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Bàn giao toàn bộ source code sạch và tài sản thiết kế vector Figma, không giữ lại bản quyền ràng buộc.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Zap className="w-6 h-6 text-[#FF2D95] shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Cam Kết SLA & Tốc Độ 60 FPS</h4>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Hiệu năng WebGL mượt mà, điểm Google Core Web Vitals 95+ và hạ tầng Cloud Uptime đạt chuẩn 99.9%.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Sparkles className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Bảo Hành Kỹ Thuật 12 Tháng</h4>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Bảo hành toàn diện miễn phí trong 1 năm đầu, hỗ trợ kỹ thuật khẩn cấp 24/7 qua Hotline & Bot Telegram.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
