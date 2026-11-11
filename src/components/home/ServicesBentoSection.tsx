import React from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Clock, Sparkles } from "lucide-react";
import prisma from "@/lib/prisma";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

const FALLBACK_FEATURED_SERVICES = [
  {
    id: "svc_01",
    title: "Phát Triển Website 3D & Three.js",
    slug: "3d-website-development",
    group: "TECH",
    shortDesc: "Kiến trúc website tương tác không gian 3D WebGL đột phá, tối ưu hóa tốc độ 60 FPS chuẩn Luxury Brand.",
    estimatedTime: "3 - 5 tuần",
    startingPrice: 45000000,
    benefitsJson: JSON.stringify(["Mô hình 3D tương tác thực tế", "WebGL tối ưu 60 FPS", "Chuẩn SEO & Mobile first"]),
    featuresJson: JSON.stringify(["Three.js / React Three Fiber", "Shader hiệu ứng cao cấp", "CMS quản trị nội dung"]),
  },
  {
    id: "svc_02",
    title: "Nhận Diện Thương Hiệu Độc Bản (Luxury Brand)",
    slug: "luxury-brand-identity",
    group: "MEDIA",
    shortDesc: "Định hình ngôn ngữ thị giác sang trọng, hệ thống Brand Guideline và tài sản nhận diện đa nền tảng.",
    estimatedTime: "2 - 3 tuần",
    startingPrice: 30000000,
    benefitsJson: JSON.stringify(["Bộ nhận diện thương hiệu chuẩn quốc tế", "Brand Guideline toàn diện", "Bàn giao file vector gốc"]),
    featuresJson: JSON.stringify(["Logo & Typography độc quyền", "Ấn phẩm truyền thông số", "Hồ sơ năng lực Profile"]),
  },
  {
    id: "svc_03",
    title: "Ứng Dụng Web & Nền Tảng SaaS Doanh Nghiệp",
    slug: "saas-web-application",
    group: "TECH",
    shortDesc: "Phần mềm quản trị đám mây, tích hợp CRM tự động hóa và bảo mật đa tầng cho doanh nghiệp mở rộng quy mô.",
    estimatedTime: "4 - 8 tuần",
    startingPrice: 60000000,
    benefitsJson: JSON.stringify(["Kiến trúc Next.js Serverless", "Bảo mật chuẩn ISO", "Khả năng mở rộng hàng triệu user"]),
    featuresJson: JSON.stringify(["Hệ thống Auth & RBAC", "Dashboard báo cáo Real-time", "API Gateway đa kênh"]),
  },
  {
    id: "svc_04",
    title: "Sản Xuất TVC & Video Motion 3D CGI",
    slug: "3d-motion-tvc-production",
    group: "MEDIA",
    shortDesc: "Thước phim quảng cáo điện ảnh 3D CGI mãn nhãn, thu hút hàng triệu lượt xem và khẳng định đẳng cấp thương hiệu.",
    estimatedTime: "3 - 4 tuần",
    startingPrice: 50000000,
    benefitsJson: JSON.stringify(["Kỹ xảo 3D CGI điện ảnh", "Kịch bản viral đa kênh", "Render 4K chuẩn rạp"]),
    featuresJson: JSON.stringify(["Storyboard nghệ thuật", "Âm thanh Sound Design độc quyền", "Định dạng tối ưu TikTok & Ads"]),
  },
  {
    id: "svc_05",
    title: "Tích Hợp Trí Tuệ Nhân Tạo (Generative AI)",
    slug: "generative-ai-integration",
    group: "TECH",
    shortDesc: "Tích hợp trợ lý ảo AI LLM, tự động hóa dịch vụ khách hàng 24/7 và hệ thống gợi ý thông minh.",
    estimatedTime: "2 - 4 tuần",
    startingPrice: 40000000,
    benefitsJson: JSON.stringify(["Tự động hóa 80% tác vụ hỗ trợ", "Fine-tune dữ liệu riêng của DN", "Đa ngôn ngữ thông minh"]),
    featuresJson: JSON.stringify(["OpenAI / Claude API", "Vector Database RAG", "Bảo mật dữ liệu tuyệt đối"]),
  },
  {
    id: "svc_06",
    title: "Chiến Lược Digital Marketing & Tăng Trưởng",
    slug: "performance-digital-marketing",
    group: "MEDIA",
    shortDesc: "Tối ưu hóa phễu chuyển đổi số toàn diện, gia tăng tỷ lệ chốt đơn và doanh thu cho thương hiệu.",
    estimatedTime: "Hàng tháng",
    startingPrice: 25000000,
    benefitsJson: JSON.stringify(["Tối ưu ROAS và CPA", "Theo dõi Attribution minh bạch", "Báo cáo tự động mỗi ngày"]),
    featuresJson: JSON.stringify(["Quảng cáo Meta & Google Ads", "Content Marketing chuyển đổi", "Phân tích số liệu Conversion"]),
  },
];

export default async function ServicesBentoSection({ sectionData }: { sectionData?: any }) {
  const subtitle = sectionData?.subtitle || "02 • DỊCH VỤ & NĂNG LỰC CỐT LÕI";
  const title = sectionData?.title || "GIẢI PHÁP TOÀN DIỆN CHO THƯƠNG HIỆU DẪN ĐẦU";
  const description =
    sectionData?.description ||
    "Hệ thống 24 dịch vụ tiêu chuẩn quốc tế được thiết kế chuyên biệt cho bài toán tăng trưởng doanh thu, định vị thương hiệu và chuyển đổi số.";
  const ctaText = sectionData?.ctaText || "Khám phá tất cả 24 Dịch vụ";
  const ctaLink = sectionData?.ctaLink || "/services";

  let featuredServices: any[] = [];
  let dbError = false;
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
    console.warn("[ServicesBentoSection] DB fetch failed:", err);
    dbError = true;
    // Use fallback only when DB is completely unreachable (not when empty)
    featuredServices = FALLBACK_FEATURED_SERVICES;
  }

  // Only use fallback when DB is unreachable – NOT when Admin simply hasn't added services yet

  return (
    <section className="py-28 px-6 bg-[#0A0A0A] border-b border-[#1F1F23] relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute bottom-1/4 left-0 w-[450px] h-[450px] bg-[#FF2D95]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <RevealOnScroll className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 pb-10 border-b border-[#1F1F23]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#FF2D95]" />
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#FF2D95]">
                {subtitle}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-[1.1]">
              {title}
            </h2>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-4">
            <p className="text-sm text-[#A1A1AA] max-w-md lg:text-right leading-relaxed">
              {description}
            </p>
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#141418] border border-[#292929] hover:border-[#007BA7] text-xs font-mono uppercase tracking-widest text-white hover:text-[#38BDF8] transition-all group"
            >
              <span>{ctaText}</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </RevealOnScroll>

        {/* Balanced 3-Column Bento Grid (Row 1: 2+1, Row 2: 1+2, Row 3: 2+1) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((service, index) => {
            // Balanced spans for 6 items in 3-col grid: (2+1), (1+2), (2+1) = 9 cols total (no empty gap!)
            const isWide = index === 0 || index === 3 || index === 4;
            const isMedia = service.group === "MEDIA";
            const accentColor = isMedia ? "#FF2D95" : "#007BA7";

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
                  className="group relative h-full rounded-3xl bg-[#111114] border border-[#242429] hover:border-[#007BA7]/60 p-8 md:p-9 flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-18px_rgba(0,123,167,0.22)] overflow-hidden block"
                >
                  {/* Ambient Corner Spotlight */}
                  <div
                    className="absolute -right-20 -top-20 w-56 h-56 rounded-full opacity-0 group-hover:opacity-15 blur-3xl transition-opacity duration-500 pointer-events-none"
                    style={{ backgroundColor: accentColor }}
                  />

                  <div>
                    {/* Top Meta Strip */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-bold text-white/35">
                          0{index + 1}
                        </span>
                        <span
                          className={`text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full border ${
                            isMedia
                              ? "bg-[#FF2D95]/10 text-[#FF2D95] border-[#FF2D95]/30"
                              : "bg-[#007BA7]/10 text-[#38BDF8] border-[#007BA7]/35"
                          }`}
                        >
                          {isMedia ? "PHÂN HỆ TRUYỀN THÔNG SỐ" : "PHÂN HỆ CÔNG NGHỆ CAO"}
                        </span>
                      </div>

                      {service.estimatedTime && (
                        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#71717A] bg-[#17171B] px-3 py-1 rounded-full border border-[#242429]">
                          <Clock className="w-3 h-3 text-[#007BA7]" />
                          <span>{service.estimatedTime}</span>
                        </div>
                      )}
                    </div>

                    {/* Title & Description */}
                    <h3
                      className={`font-black text-white tracking-tight mb-3 group-hover:text-[#38BDF8] transition-colors ${
                        isWide ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
                      }`}
                    >
                      {service.title}
                    </h3>
                    <p className="text-sm text-[#A1A1AA] leading-relaxed mb-6 max-w-2xl">
                      {service.shortDesc}
                    </p>

                    {/* Benefits / Deliverables Preview */}
                    {benefits.length > 0 && (
                      <div
                        className={`grid gap-2.5 mb-7 pt-5 border-t border-[#1F1F23] ${
                          isWide ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
                        }`}
                      >
                        {benefits.slice(0, isWide ? 4 : 3).map((b, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-[#D4D4D8]">
                            <CheckCircle2
                              className="w-3.5 h-3.5 shrink-0"
                              style={{ color: accentColor }}
                            />
                            <span className="truncate">{b}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {deliverables.length > 0 && isWide && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {deliverables.slice(0, 4).map((del, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-mono text-[#A1A1AA] bg-[#18181C] border border-[#27272D] px-2.5 py-1 rounded-lg"
                          >
                            {del}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="pt-5 border-t border-[#242429] flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] block">
                        NGÂN SÁCH DỰ KIẾN
                      </span>
                      <span className="text-sm font-mono text-white font-bold">
                        {service.priceLabel || "Liên hệ báo giá"}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#18181C] border border-[#292929] group-hover:border-[#007BA7] group-hover:bg-[#007BA7] text-xs font-mono uppercase tracking-wider text-[#D4D4D8] group-hover:text-white transition-all">
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
