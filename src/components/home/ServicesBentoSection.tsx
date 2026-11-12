import React from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Clock, Sparkles, ShieldCheck, Zap, Layers } from "lucide-react";
import prisma from "@/lib/prisma";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

const FALLBACK_FEATURED_SERVICES = [
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
  },
  {
    id: "svc_02",
    title: "Nhận Diện Thương Hiệu Độc Bản (Luxury Brand)",
    slug: "luxury-brand-identity",
    group: "MEDIA",
    shortDesc: "Định hình ngôn ngữ thị giác sang trọng, hệ thống Brand Guideline toàn diện và tài sản nhận diện đa nền tảng.",
    estimatedTime: "2 - 3 tuần",
    startingPrice: 30000000,
    priceLabel: "Từ 30.000.000 ₫",
    benefitsJson: JSON.stringify(["Bộ nhận diện chuẩn quốc tế", "Brand Guideline toàn diện 80+ trang", "Bàn giao file vector gốc & Font quyền"]),
    featuresJson: JSON.stringify(["Logo & Typography độc quyền", "Ấn phẩm truyền thông số", "Hồ sơ năng lực Profile"]),
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
  },
];

export default async function ServicesBentoSection({ sectionData }: { sectionData?: any }) {
  const subtitle = sectionData?.subtitle || "02 • DỊCH VỤ & NĂNG LỰC CỐT LÕI";
  const title = sectionData?.title || "GIẢI PHÁP TOÀN DIỆN CHO THƯƠNG HIỆU DẪN ĐẦU";
  const description =
    sectionData?.description ||
    "Hệ thống 24 dịch vụ tiêu chuẩn quốc tế được thiết kế chuyên biệt cho bài toán tăng trưởng doanh thu, định vị thương hiệu và chuyển đổi số vượt trội.";
  const ctaText = sectionData?.ctaText || "Khám phá tất cả 24 Dịch vụ";
  const ctaLink = sectionData?.ctaLink || "/services";

  let featuredServices: any[] = [];
  try {
    featuredServices = await prisma.service.findMany({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
      },
      take: 6,
      orderBy: [
        { isFeatured: "desc" },
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });
  } catch (err) {
    console.warn("[ServicesBentoSection] DB fetch fallback active:", err);
  }

  if (!featuredServices || featuredServices.length === 0) {
    featuredServices = FALLBACK_FEATURED_SERVICES;
  }

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 bg-[#06070B] border-b border-[#1A1A22] relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-[#00E5FF]/5 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#FF2D95]/5 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <RevealOnScroll className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 pb-10 border-b border-[#1A1A22]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0D121D] border border-[#FF2D95]/30 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#FF2D95] animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#FF2D95] font-semibold">
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
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={ctaLink}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#00A3FF]/20 to-[#FF2D95]/20 border border-white/15 hover:border-[#00E5FF]/60 text-xs font-mono uppercase tracking-widest text-white hover:text-[#00E5FF] transition-all group"
              >
                <span>{ctaText}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </RevealOnScroll>

        {/* Balanced 3-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {featuredServices.map((service, index) => {
            const isWide = index === 0 || index === 3 || index === 4;
            const isMedia = service.group === "MEDIA";
            const accentColor = isMedia ? "#FF2D95" : "#00E5FF";

            let benefits: string[] = [];
            try {
              benefits = JSON.parse(service.benefitsJson || "[]");
            } catch {
              benefits = [];
            }

            let deliverables: string[] = [];
            try {
              deliverables = JSON.parse(service.featuresJson || "[]");
            } catch {
              deliverables = [];
            }

            return (
              <RevealOnScroll
                key={service.id}
                delay={(index % 3) * 0.08}
                className={isWide ? "lg:col-span-2" : "lg:col-span-1"}
              >
                <Link
                  href={`/services/${service.slug}`}
                  className="group relative h-full rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] hover:border-white/25 p-7 sm:p-8 md:p-9 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_50px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden block"
                >
                  {/* Ambient Spotlight */}
                  <div
                    className="absolute -right-20 -top-20 w-56 h-56 rounded-full opacity-0 group-hover:opacity-15 blur-3xl transition-opacity duration-500 pointer-events-none"
                    style={{ backgroundColor: accentColor }}
                  />

                  <div>
                    {/* Top Meta Strip */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-black text-white/30">
                          0{index + 1}
                        </span>
                        <span
                          className={`text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full border font-bold ${
                            isMedia
                              ? "bg-[#FF2D95]/10 text-[#FF2D95] border-[#FF2D95]/30"
                              : "bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30"
                          }`}
                        >
                          {isMedia ? "PHÂN HỆ TRUYỀN THÔNG & 3D" : "PHÂN HỆ CÔNG NGHỆ CAO"}
                        </span>
                      </div>

                      {service.estimatedTime && (
                        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#D4D4D8] bg-[#121622] px-3 py-1 rounded-full border border-white/5">
                          <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
                          <span>{service.estimatedTime}</span>
                        </div>
                      )}
                    </div>

                    {/* Title & Description */}
                    <h3
                      className={`font-black text-white tracking-tight mb-3 group-hover:text-[#00E5FF] transition-colors leading-tight ${
                        isWide ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
                      }`}
                    >
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-6 max-w-2xl">
                      {service.shortDesc}
                    </p>

                    {/* Benefits Preview */}
                    {benefits.length > 0 && (
                      <div
                        className={`grid gap-2.5 mb-6 pt-5 border-t border-white/[0.08] ${
                          isWide ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
                        }`}
                      >
                        {benefits.slice(0, isWide ? 4 : 3).map((b, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-[#E4E4E7]">
                            <CheckCircle2
                              className="w-3.5 h-3.5 shrink-0"
                              style={{ color: accentColor }}
                            />
                            <span className="truncate">{b}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Deliverables tags */}
                    {deliverables.length > 0 && isWide && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {deliverables.slice(0, 4).map((del, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-mono text-[#A1A1AA] bg-[#121622] border border-white/5 px-2.5 py-1 rounded-lg"
                          >
                            {del}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer with Budget & Action */}
                  <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] block">
                        NGÂN SÁCH ĐẦU TƯ
                      </span>
                      <span className="text-sm sm:text-base font-mono text-white font-bold bg-gradient-to-r from-white to-[#00E5FF] bg-clip-text text-transparent">
                        {service.priceLabel || (service.startingPrice ? `Từ ${Number(service.startingPrice).toLocaleString("vi-VN")} ₫` : "Liên hệ báo giá")}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#121622] border border-white/10 group-hover:border-[#00E5FF]/60 group-hover:bg-[#00E5FF] text-xs font-mono uppercase tracking-wider text-white group-hover:text-black transition-all font-bold">
                      <span>Chi tiết</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </Link>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
