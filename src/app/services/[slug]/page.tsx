import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Layers,
  ShieldCheck,
  Cpu,
  Sparkles,
  Terminal,
  Compass,
  Zap,
  Target,
  Workflow,
  Code2,
  Award,
} from "lucide-react";
import prisma from "@/lib/prisma";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import {
  DetailBreadcrumbs,
  DetailHeroReveal,
  DetailAccordionFAQ,
  ShareCopyButton,
  ReadingProgressBar,
} from "@/components/common/DetailInteractiveTools";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await params;
  let service: any = null;
  try {
    service = await prisma.service.findUnique({
      where: { slug: resolvedParams.slug },
      include: { category: true },
    });
  } catch {
    service = null;
  }

  if (!service || service.deletedAt !== null) {
    return { title: "Dịch vụ không tồn tại – NGUYÊN AGENCY" };
  }

  const title = `${service.metaTitle || service.title} – NGUYÊN AGENCY | ${
    service.category?.name || service.group
  }`;
  const description = service.metaDescription || service.shortDesc;
  const canonicalUrl = `https://nguyenagency.vn/services/${service.slug}`;
  const ogImage =
    service.thumbnail ||
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "NGUYÊN AGENCY",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: service.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ServiceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }> | { slug: string };
  searchParams?: Promise<{ preview?: string }> | { preview?: string };
}) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const isPreview = resolvedSearchParams?.preview === "true";

  let service: any = null;
  try {
    service = await prisma.service.findUnique({
      where: { slug: resolvedParams.slug },
      include: { category: true },
    });
  } catch (err) {
    console.warn("[ServiceDetailPage] DB fetch fallback active:", err);
  }

  if (
    !service ||
    service.deletedAt !== null ||
    (!isPreview && service.status !== "PUBLISHED")
  ) {
    notFound();
  }

  let benefits: string[] = [];
  let features: any[] = [];
  let customProcess: any[] = [];

  try {
    benefits = JSON.parse(service.benefitsJson || "[]");
  } catch {
    benefits = [];
  }
  try {
    features = JSON.parse(service.featuresJson || "[]");
  } catch {
    features = [];
  }
  try {
    customProcess = JSON.parse(service.processJson || "[]");
  } catch {
    customProcess = [];
  }

  // Related Content Engine + Pricing Packages + FAQs from CRM Database
  const [relatedServices, servicePackages, relatedPortfolios, faqs] =
    await Promise.all([
      prisma.service.findMany({
        where: {
          group: service.group,
          id: { not: service.id },
          status: "PUBLISHED",
        },
        include: { category: true },
        orderBy: { order: "asc" },
        take: 3,
      }),
      prisma.servicePackage.findMany({
        where: {
          status: "PUBLISHED",
          ...(service.categoryId ? { categoryId: service.categoryId } : {}),
        },
        orderBy: { order: "asc" },
      }),
      prisma.portfolio.findMany({
        where: {
          status: "PUBLISHED",
        },
        include: { category: true },
        orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
        take: 2,
      }),
      prisma.fAQ.findMany({
        where: {
          status: "PUBLISHED",
          category: { in: ["Services", "Process", "General", "Tech"] },
        },
        orderBy: { order: "asc" },
        take: 5,
      }),
    ]);

  // 6-Stage Standard Agency Pipeline merged with CRM process steps if configured
  const sixStageProcess = [
    {
      step: "01",
      code: "DISCOVER",
      title: customProcess[0]?.name || customProcess[0]?.title || "Discover & Audit",
      desc:
        customProcess[0]?.desc ||
        "Nghiên cứu chuyên sâu mô hình kinh doanh, chân dung khách hàng mục tiêu, hệ sinh thái đối thủ và xác định bài toán cốt lõi cần giải quyết.",
    },
    {
      step: "02",
      code: "STRATEGY",
      title: customProcess[1]?.name || customProcess[1]?.title || "Strategy & Architecture",
      desc:
        customProcess[1]?.desc ||
        "Xây dựng chiến lược định vị, kiến trúc thông tin (IA), luồng trải nghiệm người dùng và lộ trình công nghệ tối ưu.",
    },
    {
      step: "03",
      code: "DESIGN",
      title: customProcess[2]?.name || customProcess[2]?.title || "Design & Interactive Prototype",
      desc:
        customProcess[2]?.desc ||
        "Thiết kế ngôn ngữ thị giác Luxury Dark độc bản, Design System đa thiết bị và nguyên mẫu tương tác chuyển động cao cấp.",
    },
    {
      step: "04",
      code: "DEVELOP",
      title: customProcess[3]?.name || customProcess[3]?.title || "Develop & Engineering",
      desc:
        customProcess[3]?.desc ||
        "Triển khai mã nguồn chuẩn Clean Architecture, tích hợp hiệu ứng GSAP/WebGL mượt mà ở 60 FPS hoặc hoàn thiện hồ sơ sản xuất chất lượng cao.",
    },
    {
      step: "05",
      code: "LAUNCH",
      title: customProcess[4]?.name || customProcess[4]?.title || "Launch & Quality Assurance",
      desc:
        customProcess[4]?.desc ||
        "Kiểm thử toàn diện trên mọi thiết bị (Cross-device QA), kiểm định bảo mật, tối ưu Core Web Vitals và phát hành chính thức.",
    },
    {
      step: "06",
      code: "OPTIMIZE",
      title: customProcess[5]?.name || customProcess[5]?.title || "Optimize & Scale",
      desc:
        customProcess[5]?.desc ||
        "Chuyển giao 100% tài sản số, đào tạo đội ngũ vận hành CMS và đồng hành đo lường, tối ưu hóa tăng trưởng dài hạn.",
    },
  ];

  const isMedia = service.group === "MEDIA";
  const accentHex = isMedia ? "#FF2D95" : "#007BA7";
  const heroCover =
    service.coverImage ||
    service.thumbnail ||
    (isMedia
      ? "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=85"
      : "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=85");

  const galleryList: string[] = [];
  try {
    const parsed = JSON.parse(service.galleryJson || "[]");
    if (Array.isArray(parsed)) {
      galleryList.push(
        ...parsed.filter((u) => typeof u === "string" && u.trim() !== "")
      );
    }
  } catch {}

  // Service Schema.org JSON-LD
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.shortDesc,
    provider: {
      "@type": "Organization",
      name: "NGUYÊN AGENCY",
      url: "https://nguyenagency.vn",
    },
    serviceType: service.category?.name || service.group,
    areaServed: "VN",
    ...(service.startingPrice
      ? {
          offers: {
            "@type": "Offer",
            price: service.startingPrice,
            priceCurrency: "VND",
          },
        }
      : {}),
  };

  const bentoIcons = [Layers, Cpu, Sparkles, ShieldCheck, Terminal, Zap];

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen">
      <ReadingProgressBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Draft Preview Banner for Admin */}
      {service.status !== "PUBLISHED" && (
        <div className="bg-[#FF2D95]/20 border-b border-[#FF2D95]/40 text-white px-6 py-2.5 text-center text-xs font-mono mt-20">
          CHẾ ĐỘ XEM TRƯỚC CMS (TRẠNG THÁI: {service.status}) — Chỉ quản trị viên mới nhìn thấy bản xem trước này.
        </div>
      )}

      {/* =================================================================
          1. HERO SECTION
      ================================================================= */}
      <section className="relative pt-32 pb-20 md:pt-36 md:pb-28 px-6 border-b border-[#292929] bg-architectural-grid overflow-hidden">
        <div
          className="absolute top-20 right-1/4 w-[420px] h-[420px] rounded-full blur-[160px] pointer-events-none opacity-20"
          style={{ backgroundColor: accentHex }}
        />

        <DetailHeroReveal className="max-w-7xl mx-auto space-y-12 relative z-10">
          {/* Top Bar: Dynamic Breadcrumb + Index Graphic */}
          <div
            data-hero-item
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#292929]"
          >
            <DetailBreadcrumbs
              items={[
                { label: "Trang chủ", href: "/" },
                { label: "Dịch vụ", href: "/services" },
                ...(service.category
                  ? [
                      {
                        label: service.category.name,
                        href: `/services?group=${service.group}`,
                      },
                    ]
                  : []),
                { label: service.title },
              ]}
            />
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono tracking-[0.2em] text-[#A1A1AA] uppercase">
                SRV // {String(service.order || 1).padStart(2, "0")}
              </span>
              <ShareCopyButton title={service.title} />
            </div>
          </div>

          {/* Editorial Split Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8 space-y-6">
              <div data-hero-item className="flex flex-wrap items-center gap-3">
                <span
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-widest uppercase border ${
                    isMedia
                      ? "bg-[#FF2D95]/10 border-[#FF2D95]/40 text-[#FF2D95]"
                      : "bg-[#007BA7]/10 border-[#007BA7]/40 text-[#007BA7]"
                  }`}
                >
                  {service.group} • {service.category?.name || "Premium Solution"}
                </span>
                {service.tagline && (
                  <span className="text-xs font-mono text-[#A1A1AA] uppercase tracking-wider">
                    — {service.tagline}
                  </span>
                )}
              </div>

              <h1
                data-hero-item
                className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.04] text-white"
              >
                {service.title}
              </h1>

              <p
                data-hero-item
                className="text-base md:text-xl text-[#A1A1AA] leading-relaxed max-w-3xl"
              >
                {service.shortDesc}
              </p>

              {/* Primary & Secondary CTAs */}
              <div
                data-hero-item
                className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
              >
                <Link
                  href={`/contact?service=${encodeURIComponent(service.title)}`}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-mono text-xs font-bold uppercase tracking-[0.16em] hover:shadow-glow-pink transition-all flex items-center justify-center gap-2.5 group"
                >
                  <span>Khởi Tạo Dự Án</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                <a
                  href="#pricing-section"
                  className="px-8 py-4 rounded-full bg-[#121212] border border-[#292929] hover:border-[#007BA7] text-white font-mono text-xs font-bold uppercase tracking-[0.16em] transition-all flex items-center justify-center gap-2"
                >
                  <span>Nhận Báo Giá</span>
                </a>
              </div>
            </div>

            {/* Key Telemetry Spec Box */}
            <div
              data-hero-item
              className="lg:col-span-4 p-6 md:p-7 rounded-3xl bg-[#121212] border border-[#292929] space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#292929]">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#A1A1AA]">
                  SERVICE SPECIFICATIONS
                </span>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: accentHex }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-mono text-[#A1A1AA] uppercase block mb-1">
                    THỜI GIAN DỰ KIẾN
                  </span>
                  <strong className="text-sm font-mono font-bold text-white">
                    {service.estimatedTime}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#A1A1AA] uppercase block mb-1">
                    NGÂN SÁCH ĐẦU TƯ
                  </span>
                  <strong className="text-sm font-mono font-bold text-[#007BA7]">
                    {service.priceLabel || "Theo phạm vi"}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#A1A1AA] uppercase block mb-1">
                    BÀN GIAO BẢN QUYỀN
                  </span>
                  <strong className="text-sm font-mono font-bold text-white">
                    100% Ownership
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#A1A1AA] uppercase block mb-1">
                    TIÊU CHUẨN CAM KẾT
                  </span>
                  <strong className="text-sm font-mono font-bold text-[#FF2D95]">
                    Enterprise SLA
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Large Hero Visual with Clip-Path Reveal */}
          <div
            data-hero-visual
            className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-3xl overflow-hidden border border-[#292929] bg-[#121212]"
          >
            <Image
              src={heroCover}
              alt={service.altText || service.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
              <div className="px-4 py-2 rounded-2xl bg-[#0A0A0A]/85 backdrop-blur-md border border-[#292929] text-xs font-mono text-[#A1A1AA]">
                NGUYÊN AGENCY • {service.group} ARCHITECTURE DIVISION
              </div>
              <div className="px-4 py-2 rounded-2xl bg-[#0A0A0A]/85 backdrop-blur-md border border-[#292929] text-xs font-mono text-white">
                {service.category?.name}
              </div>
            </div>
          </div>
        </DetailHeroReveal>
      </section>

      {/* =================================================================
          2. OVERVIEW SECTION (PROBLEM -> SOLUTION -> VALUE)
      ================================================================= */}
      <section className="py-20 md:py-28 px-6 border-b border-[#292929]">
        <div className="max-w-7xl mx-auto space-y-16">
          <RevealOnScroll className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#007BA7] block">
                01 // SERVICE OVERVIEW
              </span>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight">
                KIẾN TẠO LỢI THẾ CẠNH TRANH ĐỘC BẢN.
              </h2>
              <p className="text-sm font-mono text-[#A1A1AA]">
                Giải pháp được thiết kế riêng cho các thương hiệu hướng tới vị thế dẫn đầu thị trường.
              </p>
            </div>

            <div className="lg:col-span-7 p-8 md:p-10 rounded-3xl bg-[#121212] border border-[#292929] space-y-6">
              <p className="text-base md:text-lg text-white leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
              <div className="pt-4 border-t border-[#292929] flex flex-wrap items-center gap-6 text-xs font-mono text-[#A1A1AA]">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#007BA7]" />
                  Thiết kế độc bản 100%
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF2D95]" />
                  Tối ưu chuyển đổi & trải nghiệm
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#007BA7]" />
                  Đồng bộ nhận diện đa kênh
                </span>
              </div>
            </div>
          </RevealOnScroll>

          {/* Problem / Solution / Value Bento Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RevealOnScroll
              delay={0.05}
              className="p-8 rounded-3xl bg-[#121212] border border-[#292929] flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-[#171717] border border-[#292929] flex items-center justify-center text-[#A1A1AA]">
                  <Target className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#A1A1AA] block">
                  THE CHALLENGE • BÀI TOÁN KHÁCH HÀNG
                </span>
                <h3 className="text-xl font-bold text-white">
                  Sự bão hòa thị giác & giới hạn công nghệ cũ
                </h3>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">
                  Các giải pháp đại trà hoặc mẫu dựng sẵn khiến thương hiệu mờ nhạt, tốc độ phản hồi chậm và không thể truyền tải hết đẳng cấp sản phẩm tới phân khúc khách hàng cao cấp.
                </p>
              </div>
              <div className="pt-4 border-t border-[#292929] text-[11px] font-mono text-[#A1A1AA]">
                DIAGNOSIS // MARKET BOTTLENECK
              </div>
            </RevealOnScroll>

            <RevealOnScroll
              delay={0.15}
              className="p-8 rounded-3xl bg-[#171717] border border-[#007BA7]/50 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-[#007BA7]/15 border border-[#007BA7]/40 flex items-center justify-center text-[#007BA7]">
                  <Workflow className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#007BA7] block">
                  OUR SOLUTION • GIẢI PHÁP NGUYÊN AGENCY
                </span>
                <h3 className="text-xl font-bold text-white">
                  May đo kiến trúc {service.title} chuẩn quốc tế
                </h3>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">
                  Kết hợp tư duy Creative Direction sắc bén và nền tảng kỹ thuật hiện đại để xây dựng giải pháp {service.title.toLowerCase()} mang tính biểu tượng, mượt mà và có chiều sâu.
                </p>
              </div>
              <div className="pt-4 border-t border-[#292929] text-[11px] font-mono text-[#007BA7]">
                EXECUTION // BESPOKE ARCHITECTURE
              </div>
            </RevealOnScroll>

            <RevealOnScroll
              delay={0.25}
              className="p-8 rounded-3xl bg-[#121212] border border-[#292929] flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-[#FF2D95]/15 border border-[#FF2D95]/40 flex items-center justify-center text-[#FF2D95]">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF2D95] block">
                  THE IMPACT • GIÁ TRỊ MANG LẠI
                </span>
                <h3 className="text-xl font-bold text-white">
                  Tăng trưởng chuyển đổi & tài sản số bền vững
                </h3>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">
                  Nâng tầm định vị thương hiệu ngay từ điểm chạm đầu tiên, tối ưu hóa tỷ lệ chuyển đổi khách hàng tiềm năng và sẵn sàng mở rộng quy mô dài hạn.
                </p>
              </div>
              <div className="pt-4 border-t border-[#292929] text-[11px] font-mono text-[#FF2D95]">
                OUTCOME // MEASURABLE ROI
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* =================================================================
          3. SERVICES INCLUDED (BENTO GRID)
      ================================================================= */}
      {features.length > 0 && (
        <section className="py-20 md:py-28 px-6 border-b border-[#292929]">
          <div className="max-w-7xl mx-auto space-y-12">
            <RevealOnScroll className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#FF2D95] mb-2 block">
                  02 // SERVICES INCLUDED
                </span>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                  HẠNG MỤC BÀN GIAO CHI TIẾT.
                </h2>
              </div>
              <p className="text-sm text-[#A1A1AA] max-w-md">
                Mọi hạng mục trong gói dịch vụ {service.title} đều được quy chuẩn hóa chất lượng và nghiệm thu minh bạch.
              </p>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {features.map((item, idx) => {
                const IconComponent = bentoIcons[idx % bentoIcons.length];
                const itemTitle =
                  typeof item === "string"
                    ? item
                    : item.title || item.name || "Hạng mục triển khai";
                const itemDesc =
                  typeof item === "string"
                    ? `Triển khai chuyên sâu hạng mục "${item}" theo tiêu chuẩn kỹ thuật và thẩm mỹ của NGUYÊN AGENCY, đảm bảo khả năng vận hành thực tế tối ưu.`
                    : item.desc || item.description || "";
                const itemBenefit =
                  typeof item === "object" && item.benefit
                    ? item.benefit
                    : benefits[idx % Math.max(1, benefits.length)] ||
                      "Chuẩn hóa chất lượng & hiệu năng";

                const colSpan =
                  features.length === 4
                    ? idx === 0 || idx === 3
                      ? "md:col-span-7"
                      : "md:col-span-5"
                    : "md:col-span-4";

                return (
                  <RevealOnScroll
                    key={idx}
                    delay={idx * 0.08}
                    className={`${colSpan} p-8 rounded-3xl bg-[#121212] hover:bg-[#171717] border border-[#292929] hover:border-[#007BA7] transition-all duration-300 flex flex-col justify-between space-y-6 group`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-[#171717] border border-[#292929] group-hover:border-[#007BA7] flex items-center justify-center text-[#007BA7] transition-colors">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-mono text-[#A1A1AA]">
                           DELIVERABLE #{String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white leading-snug">
                        {itemTitle}
                      </h3>

                      <p className="text-sm text-[#A1A1AA] leading-relaxed">
                        {itemDesc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#292929] flex items-center gap-2 text-xs font-mono text-white">
                      <CheckCircle2 className="w-4 h-4 text-[#FF2D95] shrink-0" />
                      <span className="truncate">{itemBenefit}</span>
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =================================================================
          4. PROCESS (01 DISCOVER -> 06 OPTIMIZE)
      ================================================================= */}
      <section className="py-20 md:py-28 px-6 border-b border-[#292929] bg-[#121212]/40">
        <div className="max-w-7xl mx-auto space-y-14">
          <RevealOnScroll className="max-w-3xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#007BA7] block">
              03 // EXECUTION PROCESS
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              QUY TRÌNH 6 GIAI ĐOẠN CHUẨN MỰC.
            </h2>
            <p className="text-sm md:text-base text-[#A1A1AA] leading-relaxed">
              Từ khảo sát chiến lược đến tối ưu hóa sau phát hành, mọi giai đoạn đều được theo dõi trực tiếp qua hệ thống quản trị dự án của NGUYÊN AGENCY.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sixStageProcess.map((stage, idx) => (
              <RevealOnScroll
                key={stage.step}
                delay={idx * 0.08}
                className="p-8 rounded-3xl bg-[#121212] border border-[#292929] hover:border-[#007BA7] transition-all flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-black font-mono text-white group-hover:text-[#007BA7] transition-colors">
                      {stage.step}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#171717] border border-[#292929] text-[10px] font-mono tracking-widest uppercase text-[#A1A1AA]">
                      {stage.code}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {stage.title}
                  </h3>
                  <p className="text-sm text-[#A1A1AA] leading-relaxed">
                    {stage.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#292929] flex items-center justify-between text-[11px] font-mono text-[#A1A1AA]">
                  <span>STAGE {stage.step} / 06</span>
                  <span className="text-[#007BA7]">VERIFIED GATEWAY</span>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================
          5. BENEFITS & METHODOLOGY
      ================================================================= */}
      <section className="py-20 md:py-28 px-6 border-b border-[#292929]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <RevealOnScroll className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#FF2D95] block">
              04 // KEY BENEFITS & DIFFERENTIATORS
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight">
              VÌ SAO ĐỐI TÁC CHỌN NGUYÊN AGENCY?
            </h2>
            <p className="text-sm md:text-base text-[#A1A1AA] leading-relaxed">
              Chúng tôi không chỉ bàn giao một sản phẩm hoàn thiện, mà kiến tạo một hệ thống có khả năng mở rộng, bảo mật và mang đậm dấu ấn thương hiệu.
            </p>

            <div className="p-6 rounded-3xl bg-[#121212] border border-[#292929] space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#007BA7]">
                <Code2 className="w-4 h-4" />
                <span>CÔNG NGHỆ & PHƯƠNG PHÁP ÁP DỤNG</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {(isMedia
                  ? [
                      "Brand Strategy",
                      "3D Motion Cinema",
                      "Design Systems",
                      "Figma Tokens",
                      "Generative Visual AI",
                    ]
                  : [
                      "Next.js App Router",
                      "Three.js / WebGL",
                      "GSAP ScrollTrigger",
                      "TypeScript",
                      "Prisma & PostgreSQL",
                    ]
                ).map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-xl bg-[#171717] border border-[#292929] text-xs font-mono text-white"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          <div className="lg:col-span-7 space-y-4">
            {(benefits.length > 0
              ? benefits
              : [
                  "Kiến trúc độc bản được may đo 100% theo mục tiêu tăng trưởng của doanh nghiệp",
                  "Hiệu năng tối ưu vượt trội, tương thích hoàn hảo trên cả Desktop, Tablet và Mobile",
                  "Bàn giao toàn bộ hồ sơ thiết kế, mã nguồn gốc và tài liệu hướng dẫn vận hành",
                ]
            ).map((benefit, idx) => (
              <RevealOnScroll
                key={idx}
                delay={idx * 0.08}
                className="p-6 md:p-7 rounded-3xl bg-[#121212] border border-[#292929] flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#171717] border border-[#292929] flex items-center justify-center text-[#007BA7] font-mono text-xs font-bold shrink-0">
                  0{idx + 1}
                </div>
                <div className="space-y-1">
                  <h3 className="text-base md:text-lg font-bold text-white">
                    {benefit}
                  </h3>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">
                    Cam kết bằng hợp đồng pháp lý và tiêu chuẩn SLA xuyên suốt quá trình triển khai cũng như giai đoạn bảo hành 12 tháng.
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================
          5. VISUAL ARCHIVE & CASE SAMPLES (FROM SUPABASE & DATABASE)
      ================================================================= */}
      {galleryList.length > 0 && (
        <section className="py-20 md:py-28 px-6 border-b border-[#292929] bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto space-y-12">
            <RevealOnScroll className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#007BA7] mb-2 block">
                  VISUAL ARCHIVE & CASE SAMPLES
                </span>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                  HÌNH ẢNH THỰC TẾ & BỘ SẢN PHẨM MẪU
                </h2>
              </div>
              <span className="text-xs font-mono text-[#A1A1AA]">
                {galleryList.length} TÁC PHẨM ĐỘC BẢN • NGUYÊN AGENCY
              </span>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {galleryList.map((gUrl, gIdx) => (
                <RevealOnScroll key={gIdx} delay={gIdx * 0.1}>
                  <div className="group relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#292929] hover:border-[#FF2D95]/60 transition-all duration-500 bg-[#121212]">
                    <Image
                      src={gUrl}
                      alt={`${service.title} - Mẫu thực tế ${gIdx + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-white/90 bg-[#0A0A0A]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#292929]">
                        Tác Phẩm #{String(gIdx + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] font-mono text-[#007BA7] uppercase tracking-wider">
                        {service.group}
                      </span>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =================================================================
          6. PRICING & PACKAGES (FROM CRM DATABASE)
      ================================================================= */}
      <section
        id="pricing-section"
        className="py-20 md:py-28 px-6 border-b border-[#292929] scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          <RevealOnScroll className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#007BA7] mb-2 block">
                05 // INVESTMENT & PACKAGES
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                CẤU TRÚC GÓI ĐẦU TƯ DỊCH VỤ.
              </h2>
            </div>
            <Link
              href="/pricing"
              className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA] hover:text-white inline-flex items-center gap-2"
            >
              <span>Xem toàn bộ bảng giá hệ sinh thái</span>
              <ArrowUpRight className="w-4 h-4 text-[#007BA7]" />
            </Link>
          </RevealOnScroll>

          {servicePackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {servicePackages.map((pkg, idx) => {
                let pkgFeatures: string[] = [];
                try {
                  pkgFeatures = JSON.parse(pkg.featuresJson || "[]");
                } catch {
                  pkgFeatures = [];
                }

                return (
                  <RevealOnScroll
                    key={pkg.id}
                    delay={idx * 0.1}
                    className={`p-8 md:p-10 rounded-3xl flex flex-col justify-between space-y-8 border ${
                      pkg.isPopular
                        ? "bg-[#171717] border-[#007BA7]"
                        : "bg-[#121212] border-[#292929]"
                    }`}
                  >
                    <div className="space-y-5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA]">
                          {pkg.packageGroup}
                        </span>
                        {pkg.isPopular && (
                          <span className="px-3 py-1 rounded-full bg-[#007BA7]/20 border border-[#007BA7]/50 text-[#007BA7] text-[10px] font-mono uppercase font-bold">
                            RECOMMENDED
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl font-black text-white uppercase">
                        {pkg.name}
                      </h3>

                      <div className="pb-5 border-b border-[#292929]">
                        <span className="text-3xl font-black font-mono text-white block">
                          {pkg.priceDisplay}
                        </span>
                        <span className="text-xs font-mono text-[#A1A1AA] mt-1 block">
                          Thời gian bàn giao: {pkg.deliveryTime}
                        </span>
                      </div>

                      <p className="text-sm text-[#A1A1AA] leading-relaxed">
                        {pkg.description}
                      </p>

                      {pkgFeatures.length > 0 && (
                        <div className="space-y-2.5 pt-2">
                          {pkgFeatures.map((feat, fIdx) => (
                            <div
                              key={fIdx}
                              className="flex items-start gap-2.5 text-xs text-white"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#007BA7] shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/contact?service=${encodeURIComponent(
                        service.title
                      )}&package=${encodeURIComponent(pkg.name)}`}
                      className={`w-full py-4 rounded-full font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                        pkg.isPopular
                          ? "bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white hover:shadow-glow-pink"
                          : "bg-[#171717] hover:bg-[#292929] text-white border border-[#292929]"
                      }`}
                    >
                      <span>{pkg.ctaText || "Yêu Cầu Báo Giá Gói Này"}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </RevealOnScroll>
                );
              })}
            </div>
          ) : (
            <RevealOnScroll className="p-8 md:p-12 rounded-3xl bg-[#121212] border border-[#292929] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-mono text-[#007BA7] uppercase block">
                  CUSTOM QUOTATION • BÁO GIÁ THEO YÊU CẦU
                </span>
                <h3 className="text-2xl font-black text-white uppercase">
                  {service.priceLabel || "Báo giá may đo theo quy mô dự án"}
                </h3>
                <p className="text-sm text-[#A1A1AA] max-w-2xl">
                  Chi phí đầu tư chính xác cho dịch vụ {service.title} được xác định dựa trên phạm vi tính năng, thời gian triển khai ({service.estimatedTime}) và yêu cầu tích hợp riêng của doanh nghiệp.
                </p>
              </div>
              <Link
                href={`/contact?service=${encodeURIComponent(service.title)}`}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-mono text-xs font-bold uppercase tracking-wider shrink-0"
              >
                Nhận Báo Giá Chi Tiết
              </Link>
            </RevealOnScroll>
          )}
        </div>
      </section>

      {/* =================================================================
          7. FAQ ACCORDION
      ================================================================= */}
      {faqs.length > 0 && (
        <section className="py-20 md:py-28 px-6 border-b border-[#292929]">
          <div className="max-w-5xl mx-auto space-y-12">
            <RevealOnScroll className="text-center space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#FF2D95] block">
                06 // FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                GIẢI ĐÁP THẮC MẮC VỀ DỊCH VỤ.
              </h2>
            </RevealOnScroll>

            <RevealOnScroll>
              <DetailAccordionFAQ items={faqs} accentColor={accentHex} />
            </RevealOnScroll>
          </div>
        </section>
      )}

      {/* =================================================================
          8. RELATED CONTENT ENGINE (RELATED SERVICES & PORTFOLIO)
      ================================================================= */}
      {(relatedServices.length > 0 || relatedPortfolios.length > 0) && (
        <section className="py-20 md:py-28 px-6 border-b border-[#292929]">
          <div className="max-w-7xl mx-auto space-y-20">
            {/* Related Services */}
            {relatedServices.length > 0 && (
              <div className="space-y-10">
                <RevealOnScroll className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#007BA7] mb-2 block">
                      RELATED CAPABILITIES
                    </span>
                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
                      DỊCH VỤ LIÊN QUAN TRONG NHÓM {service.group}
                    </h2>
                  </div>
                  <Link
                    href={`/services?group=${service.group}`}
                    className="text-xs font-mono text-[#A1A1AA] hover:text-white inline-flex items-center gap-1.5"
                  >
                    <span>Xem tất cả dịch vụ {service.group}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </RevealOnScroll>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedServices.map((rel, idx) => (
                    <RevealOnScroll key={rel.id} delay={idx * 0.08}>
                      <Link
                        href={`/services/${rel.slug}`}
                        className="p-8 rounded-3xl bg-[#121212] hover:bg-[#171717] border border-[#292929] hover:border-[#007BA7] transition-all group flex flex-col justify-between h-full space-y-6"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-[10px] font-mono text-[#A1A1AA] uppercase">
                            <span>{rel.category?.name || rel.group}</span>
                            <span>{rel.estimatedTime}</span>
                          </div>
                          <h3 className="text-xl font-bold text-white group-hover:text-[#007BA7] transition-colors">
                            {rel.title}
                          </h3>
                          <p className="text-xs text-[#A1A1AA] leading-relaxed line-clamp-3">
                            {rel.shortDesc}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-[#292929] flex items-center justify-between text-xs font-mono text-white">
                          <span>{rel.priceLabel}</span>
                          <ArrowUpRight className="w-4 h-4 text-[#007BA7] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                      </Link>
                    </RevealOnScroll>
                  ))}
                </div>
              </div>
            )}

            {/* Related Portfolio Case Studies */}
            {relatedPortfolios.length > 0 && (
              <div className="space-y-10">
                <RevealOnScroll className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#FF2D95] mb-2 block">
                      PROVEN TRACK RECORD
                    </span>
                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
                      DỰ ÁN THỰC CHIẾN TIÊU BIỂU
                    </h2>
                  </div>
                  <Link
                    href="/portfolio"
                    className="text-xs font-mono text-[#A1A1AA] hover:text-white inline-flex items-center gap-1.5"
                  >
                    <span>Khám phá toàn bộ Portfolio</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </RevealOnScroll>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {relatedPortfolios.map((proj, idx) => (
                    <RevealOnScroll key={proj.id} delay={idx * 0.1}>
                      <Link
                        href={`/portfolio/${proj.slug}`}
                        className="group rounded-3xl bg-[#121212] border border-[#292929] hover:border-[#007BA7] overflow-hidden flex flex-col justify-between transition-all"
                      >
                        <div className="relative aspect-[16/9] w-full bg-[#171717] overflow-hidden">
                          <Image
                            src={proj.thumbnail}
                            alt={proj.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-7 space-y-3">
                          <div className="flex items-center justify-between text-[11px] font-mono text-[#A1A1AA]">
                            <span className="text-[#FF2D95] uppercase">
                              {proj.clientName}
                            </span>
                            <span>{proj.year}</span>
                          </div>
                          <h3 className="text-xl font-bold text-white group-hover:text-[#007BA7] transition-colors">
                            {proj.title}
                          </h3>
                          <p className="text-xs text-[#A1A1AA] line-clamp-2">
                            {proj.shortDesc}
                          </p>
                        </div>
                      </Link>
                    </RevealOnScroll>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* =================================================================
          9. FINAL CTA SECTION
      ================================================================= */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll className="relative rounded-3xl overflow-hidden border border-[#292929] bg-[#121212] p-10 md:p-16 lg:p-20">
            <div className="relative z-10 max-w-3xl space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171717] border border-[#292929] text-[11px] font-mono uppercase tracking-widest text-[#007BA7]">
                <Sparkles className="w-3.5 h-3.5 text-[#FF2D95]" />
                <span>SẴN SÀNG BỨT PHÁ THƯƠNG HIỆU?</span>
              </span>

              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[1.06] text-white">
                CÙNG KIẾN TẠO NHỮNG ĐIỀU{" "}
                <span className="text-gradient-brand">PHI THƯỜNG.</span>
              </h2>

              <p className="text-base md:text-lg text-[#A1A1AA] leading-relaxed max-w-2xl">
                Kết nối trực tiếp với đội ngũ Creative Director và Principal Architect tại NGUYÊN AGENCY để hoạch định giải pháp {service.title} đột phá cho doanh nghiệp của bạn.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href={`/contact?service=${encodeURIComponent(service.title)}`}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-mono text-xs font-bold uppercase tracking-[0.18em] hover:shadow-glow-pink transition-all flex items-center justify-center gap-2"
                >
                  <span>Khởi Tạo Dự Án</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="px-8 py-4 rounded-full bg-[#171717] border border-[#292929] hover:border-white text-white font-mono text-xs font-bold uppercase tracking-[0.18em] transition-all flex items-center justify-center"
                >
                  <span>Khám Phá Bảng Giá Dịch Vụ</span>
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
