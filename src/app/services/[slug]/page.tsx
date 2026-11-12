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
  Zap,
  Target,
  Workflow,
  Code2,
  AlertCircle,
  HelpCircle,
  PhoneCall,
  Mail,
  MapPin,
  ArrowRight,
  FileCheck,
  Users,
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
import {
  OFFICIAL_24_SERVICES,
  getServiceBySlug,
  ServiceDetailData,
} from "@/data/services-data";

export const revalidate = 60;

// Pre-render all 24 official service slugs statically at build time
export async function generateStaticParams() {
  return OFFICIAL_24_SERVICES.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await params;
  const official = getServiceBySlug(resolvedParams.slug);

  if (!official) {
    return {
      title: "Dịch vụ không tồn tại – NGUYÊN AGENCY",
      description: "Dịch vụ bạn đang tìm kiếm không tồn tại hoặc đã được cập nhật.",
    };
  }

  let dbService: any = null;
  try {
    dbService = await prisma.service.findUnique({
      where: { slug: official.slug },
      select: { thumbnail: true, coverImage: true },
    });
  } catch {}

  const title = `${official.seoTitle} | NGUYÊN AGENCY`;
  const description = official.metaDescription;
  const canonicalUrl = `https://nguyenagency.online/services/${official.slug}`;
  const ogImage =
    dbService?.coverImage ||
    dbService?.thumbnail ||
    official.coverImage ||
    official.thumbnail;

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
      locale: "vi_VN",
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 675,
          alt: `${official.title} - ${official.titleVn} | NGUYÊN AGENCY`,
        },
      ],
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
  const resolvedParams = await params;
  const official = getServiceBySlug(resolvedParams.slug);

  if (!official) {
    notFound();
  }

  // Attempt to load any dynamic overrides from DB (if present)
  let dbService: any = null;
  try {
    dbService = await prisma.service.findUnique({
      where: { slug: official.slug },
      include: { category: true },
    });
  } catch (err) {
    console.warn("[ServiceDetailPage] DB lookup fallback:", err);
    dbService = null;
  }

  const isMedia = official.group === "MEDIA";
  const accentColor = isMedia ? "#FF2D95" : "#00E5FF";
  const accentBg = isMedia ? "rgba(255, 45, 149, 0.08)" : "rgba(0, 229, 255, 0.08)";
  const accentBorder = isMedia ? "rgba(255, 45, 149, 0.3)" : "rgba(0, 229, 255, 0.3)";

  const bannerImage =
    dbService?.coverImage ||
    dbService?.thumbnail ||
    official.coverImage ||
    official.thumbnail;

  // Resolve related services (3 to 4)
  const relatedServices: ServiceDetailData[] = official.relatedSlugs
    .map((slug) => getServiceBySlug(slug))
    .filter((s): s is ServiceDetailData => s !== undefined)
    .slice(0, 4);

  // If less than 3, backfill from the same group
  if (relatedServices.length < 3) {
    const extra = OFFICIAL_24_SERVICES.filter(
      (s) => s.slug !== official.slug && s.group === official.group && !relatedServices.some((r) => r.slug === s.slug)
    ).slice(0, 3 - relatedServices.length);
    relatedServices.push(...extra);
  }

  // Schema.org Structured Data: Service + BreadcrumbList + FAQPage
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${official.title} (${official.titleVn})`,
    description: official.shortDesc,
    url: `https://nguyenagency.online/services/${official.slug}`,
    provider: {
      "@type": "LocalBusiness",
      name: "NGUYÊN AGENCY",
      image: "https://nguyenagency.online/logo.png",
      telephone: "+84344979307",
      email: "admin@nguyenagency.vn",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Quảng Ngãi",
        addressRegion: "Quảng Ngãi",
        addressCountry: "VN",
      },
      url: "https://nguyenagency.online",
    },
    serviceType: official.categoryName,
    areaServed: [
      {
        "@type": "AdministrativeArea",
        name: "Quảng Ngãi",
      },
      {
        "@type": "Country",
        name: "Việt Nam",
      },
    ],
    offers: {
      "@type": "Offer",
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
      price: dbService?.startingPrice || (isMedia ? 5000000 : 15000000),
    },
  };

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang Chủ",
        item: "https://nguyenagency.online",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Dịch Vụ",
        item: "https://nguyenagency.online/services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: official.group === "MEDIA" ? "Media Sáng Tạo" : "Tech Công Nghệ",
        item: `https://nguyenagency.online/services?group=${official.group}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: official.title,
        item: `https://nguyenagency.online/services/${official.slug}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: official.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="bg-[#06070B] text-white min-h-screen relative overflow-hidden">
      <ReadingProgressBar />

      {/* Structured Data Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Subtle Ambient Glows */}
      <div
        className="absolute top-20 right-1/4 w-[500px] h-[500px] rounded-full blur-[180px] pointer-events-none opacity-15"
        style={{ backgroundColor: accentColor }}
      />
      <div
        className="absolute top-[45%] left-10 w-[450px] h-[450px] rounded-full blur-[180px] pointer-events-none opacity-10"
        style={{ backgroundColor: isMedia ? "#00E5FF" : "#FF2D95" }}
      />

      {/* =================================================================
          A. HERO SECTION
      ================================================================= */}
      <section className="relative pt-32 pb-16 md:pt-36 md:pb-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto space-y-10 relative z-10">
          {/* Top Bar: Breadcrumb + Share Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <DetailBreadcrumbs
              items={[
                { label: "Trang chủ", href: "/" },
                { label: "Dịch vụ", href: "/services" },
                {
                  label: isMedia ? "Media Sáng Tạo" : "Tech Công Nghệ",
                  href: `/services?group=${official.group}`,
                },
                { label: official.title },
              ]}
            />
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono tracking-widest text-[#A1A1AA] uppercase">
                SRV // {String(official.order).padStart(2, "0")}
              </span>
              <ShareCopyButton title={`${official.title} - ${official.titleVn}`} />
            </div>
          </div>

          {/* Editorial Split Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-widest uppercase border font-bold"
                  style={{
                    backgroundColor: accentBg,
                    borderColor: accentBorder,
                    color: accentColor,
                  }}
                >
                  {official.group === "MEDIA" ? "MEDIA SÁNG TẠO" : "TECH CÔNG NGHỆ"} • {official.categoryName}
                </span>
                <span className="text-xs font-mono text-[#A1A1AA] uppercase tracking-wider">
                  — KHU VỰC: QUẢNG NGÃI & TOÀN QUỐC
                </span>
              </div>

              {/* H1 SEO Heading */}
              <div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.06] text-white mb-2">
                  {official.title}
                </h1>
                <p className="text-lg sm:text-2xl font-bold font-mono tracking-wide" style={{ color: accentColor }}>
                  {official.titleVn}
                </p>
              </div>

              {/* Official Description */}
              <p className="text-base sm:text-lg text-[#D4D4D8] leading-relaxed max-w-3xl">
                {official.shortDesc}
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href={`/lien-he?service=${encodeURIComponent(official.title)}`}
                  className="px-7 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold text-white transition-all duration-300 flex items-center gap-2 shadow-lg hover:scale-105"
                  style={{
                    background: isMedia
                      ? "linear-gradient(135deg, #FF2D95 0%, #B0005C 100%)"
                      : "linear-gradient(135deg, #00E5FF 0%, #007BA7 100%)",
                    color: isMedia ? "#FFFFFF" : "#000000",
                  }}
                >
                  <span>NHẬN TƯ VẤN NGAY</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/du-an"
                  className="px-7 py-3.5 rounded-full bg-[#121622] border border-white/10 hover:border-white/30 text-white font-mono text-xs font-bold uppercase tracking-widest transition-all"
                >
                  XEM DỰ ÁN THỰC CHIẾN
                </Link>
              </div>
            </div>

            {/* Quick Metrics Aside */}
            <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] backdrop-blur-xl space-y-5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#71717A] block font-bold">
                THÔNG TIN DỊCH VỤ TIÊU CHUẨN
              </span>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <span className="text-xs text-[#A1A1AA]">Thời gian ước tính:</span>
                  <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
                    {isMedia ? "3 - 10 ngày làm việc" : "2 - 6 tuần bàn giao"}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <span className="text-xs text-[#A1A1AA]">Hình thức triển khai:</span>
                  <span className="text-xs font-mono font-bold text-white">May đo theo yêu cầu</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <span className="text-xs text-[#A1A1AA]">Quyền sở hữu tài sản:</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">100% Khách hàng làm chủ</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#A1A1AA]">Khu vực hỗ trợ:</span>
                  <span className="text-xs font-mono font-bold text-white">Quảng Ngãi & Online toàn quốc</span>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Image 16:9 Standard */}
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-[#121622] border border-white/10 shadow-2xl">
            <Image
              src={bannerImage}
              alt={`${official.title} - ${official.titleVn} | NGUYÊN AGENCY`}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06070B] via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-mono text-white">
                NGUYÊN AGENCY • DỊCH VỤ SỐ TIÊU CHUẨN
              </span>
              <span className="text-xs font-mono text-white/70 hidden sm:inline">
                Tỉ lệ chuẩn 16:9 HD
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          B. GIỚI THIỆU DỊCH VỤ (150–250 TỪ)
      ================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08]">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
            <Sparkles className="w-4 h-4" />
            <span>TỔNG QUAN & BẢN CHẤT DỊCH VỤ</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-snug">
            Nhu Cầu Thực Tế & Vai Trò Của {official.title} Trong Kinh Doanh
          </h2>
          <div className="p-8 sm:p-10 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] backdrop-blur-xl">
            <p className="text-base sm:text-lg text-[#E4E4E7] leading-relaxed whitespace-pre-line">
              {official.intro}
            </p>
          </div>
        </div>
      </section>

      {/* =================================================================
          C. VẤN ĐỀ KHÁCH HÀNG THƯỜNG GẶP
      ================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-amber-400 uppercase font-bold">
              <AlertCircle className="w-4 h-4" />
              <span>THÁCH THỨC DOANH NGHIỆP</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Những Trở Ngại Thực Tế Bạn Có Thể Đang Đối Mặt
            </h2>
            <p className="text-sm text-[#A1A1AA]">
              Rất nhiều doanh nghiệp tại Quảng Ngãi và các tỉnh thành thường gặp phải các vấn đề sau trước khi tìm đến Nguyên Agency:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {official.clientProblems.map((problem, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0B0D14]/80 border border-amber-500/20 flex items-start gap-4 hover:border-amber-500/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-mono font-bold text-amber-400">0{idx + 1}</span>
                </div>
                <p className="text-sm text-[#D4D4D8] leading-relaxed">
                  {problem}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================
          D. GIẢI PHÁP TỪ NGUYÊN AGENCY (150–250 TỪ)
      ================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08]">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase font-bold" style={{ color: accentColor }}>
            <Target className="w-4 h-4" />
            <span>GIẢI PHÁP TỪ NGUYÊN AGENCY</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-snug">
            Phương Án Triển Khai Thực Chiến & Tối Ưu Hiệu Quả
          </h2>
          <div className="p-8 sm:p-10 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden">
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
              style={{ backgroundColor: accentColor }}
            />
            <p className="text-base sm:text-lg text-[#E4E4E7] leading-relaxed whitespace-pre-line relative z-10">
              {official.solution}
            </p>
          </div>
        </div>
      </section>

      {/* =================================================================
          E. HẠNG MỤC TRIỂN KHAI ĐỀ XUẤT (CHUẨN TỪ PROMPT)
      ================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              <Layers className="w-4 h-4" />
              <span>HẠNG MỤC ĐỀ XUẤT</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Phạm Vi Triển Khai Tiêu Chuẩn Cho {official.title}
            </h2>
            <p className="text-sm text-[#A1A1AA]">
              Các hạng mục trọng tâm được đóng gói chuyên nghiệp, bảo đảm đầy đủ tính năng và khả năng ứng dụng thực tế:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {official.proposedItems.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#0B0D14]/90 border border-white/[0.08] flex items-center gap-3.5 hover:border-white/20 transition-all"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: accentBg, border: `1px solid ${accentBorder}` }}
                >
                  <CheckCircle2 className="w-4 h-4" style={{ color: accentColor }} />
                </div>
                <span className="text-sm font-semibold text-white">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================
          F. QUY TRÌNH THỰC HIỆN (4–6 BƯỚC RIÊNG BIỆT)
      ================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08]">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              <Workflow className="w-4 h-4" />
              <span>QUY TRÌNH LÀM VIỆC MINH BẠCH</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Quy Trình Triển Khai Chuyên Nghiệp {official.process.length} Bước
            </h2>
            <p className="text-sm text-[#A1A1AA]">
              Từng giai đoạn đều có mốc nghiệm thu rõ ràng, đảm bảo bạn luôn nắm bắt tiến độ công việc một cách chủ động:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {official.process.map((stepItem, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] hover:border-white/25 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-xs font-mono font-bold px-3 py-1 rounded-full border"
                      style={{
                        backgroundColor: accentBg,
                        borderColor: accentBorder,
                        color: accentColor,
                      }}
                    >
                      BƯỚC {stepItem.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{stepItem.name}</h3>
                  <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                    {stepItem.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================
          G. SẢN PHẨM BÀN GIAO & H. KHÁCH HÀNG PHÙ HỢP
      ================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* G. Deliverables */}
          <div className="p-8 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              <FileCheck className="w-4 h-4" />
              <span>SẢN PHẨM BÀN GIAO</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
              Tiêu Chuẩn Sản Phẩm Bàn Giao
            </h3>
            <p className="text-xs text-[#A1A1AA]">
              Cam kết bàn giao đầy đủ theo đúng thỏa thuận hợp đồng:
            </p>
            <div className="space-y-3">
              {official.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#E4E4E7]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* H. Target Audience */}
          <div className="p-8 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#FF2D95] uppercase font-bold">
              <Users className="w-4 h-4" />
              <span>ĐỐI TƯỢNG PHÙ HỢP</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
              Khách Hàng Phù Hợp Với Dịch Vụ
            </h3>
            <p className="text-xs text-[#A1A1AA]">
              Giải pháp được thiết kế tối ưu nhất cho các phân khúc:
            </p>
            <div className="space-y-3">
              {official.targetAudience.map((target, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#E4E4E7]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shrink-0 mt-2" />
                  <span>{target}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          I. CÂU HỎI THƯỜNG GẶP (FAQ 4–6 CÂU HỎI THỰC TẾ)
      ================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-3 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              <HelpCircle className="w-4 h-4" />
              <span>HỎI ĐÁP CHUYÊN SÂU</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Câu Hỏi Thường Gặp Về {official.title}
            </h2>
            <p className="text-sm text-[#A1A1AA]">
              Những thắc mắc phổ biến nhất của đối tác khi tìm hiểu về phương án triển khai dịch vụ:
            </p>
          </div>

          <DetailAccordionFAQ items={official.faqs} accentColor={accentColor} />
        </div>
      </section>

      {/* =================================================================
          J. DỊCH VỤ LIÊN QUAN (3–4 DỊCH VỤ NỘI BỘ VỚI ẢNH 16:9)
      ================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold mb-2">
                <Sparkles className="w-4 h-4" />
                <span>HỆ SINH THÁI TÍCH HỢP</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
                Dịch Vụ Liên Quan Được Khuyên Dùng
              </h2>
            </div>
            <Link
              href="/services"
              className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA] hover:text-white inline-flex items-center gap-1.5 font-bold"
            >
              <span>Xem tất cả 24 dịch vụ</span>
              <ArrowRight className="w-4 h-4 text-[#00E5FF]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedServices.map((related) => {
              const relIsMedia = related.group === "MEDIA";
              const relAccent = relIsMedia ? "#FF2D95" : "#00E5FF";

              return (
                <Link
                  key={related.id}
                  href={`/services/${related.slug}`}
                  className="group p-6 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] hover:border-white/25 transition-all flex flex-col justify-between hover:-translate-y-1.5"
                >
                  <div>
                    {/* 16:9 Aspect Ratio Thumbnail */}
                    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#121622] border border-white/10 mb-4">
                      <Image
                        src={related.thumbnail}
                        alt={related.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <span
                      className="text-[10px] font-mono uppercase tracking-widest font-bold block mb-2"
                      style={{ color: relAccent }}
                    >
                      {related.group} • {related.categoryName}
                    </span>

                    <h3 className="text-lg font-bold text-white group-hover:text-[#00E5FF] transition-colors mb-1">
                      {related.title}
                    </h3>
                    <p className="text-xs font-mono text-[#A1A1AA] mb-3">
                      {related.titleVn}
                    </p>
                    <p className="text-xs text-[#71717A] line-clamp-2 leading-relaxed">
                      {related.shortDesc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#00E5FF]">
                    <span>Tìm hiểu chi tiết</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================================
          K. FINAL CTA SECTION (EXACT REQUESTED TEXT)
      ================================================================= */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0B0D14]/90 p-8 sm:p-12 md:p-16 backdrop-blur-2xl text-center space-y-6">
            {/* Glow accent */}
            <div
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[140px] opacity-20 pointer-events-none"
              style={{ backgroundColor: accentColor }}
            />

            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121622] border border-white/10 text-xs font-mono uppercase tracking-widest text-[#00E5FF] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#FF2D95]" />
              <span>NGUYÊN AGENCY • ĐỒNG HÀNH CHUYỂN ĐỔI SỐ</span>
            </span>

            {/* Exact Required Title */}
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              Bạn đang cần giải pháp phù hợp cho doanh nghiệp?
            </h2>

            {/* Exact Required Description */}
            <p className="text-base sm:text-lg text-[#D4D4D8] leading-relaxed max-w-2xl mx-auto">
              Liên hệ Nguyên Agency để trao đổi nhu cầu và nhận tư vấn phương án triển khai phù hợp.
            </p>

            {/* Exact CTA Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/lien-he?service=${encodeURIComponent(official.title)}`}
                className="w-full sm:w-auto px-9 py-4 rounded-full text-xs font-mono font-bold uppercase tracking-widest text-white shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                style={{
                  background: isMedia
                    ? "linear-gradient(135deg, #FF2D95 0%, #B0005C 100%)"
                    : "linear-gradient(135deg, #00E5FF 0%, #007BA7 100%)",
                  color: isMedia ? "#FFFFFF" : "#000000",
                }}
              >
                <span>NHẬN TƯ VẤN NGAY</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-[#121622] border border-white/10 hover:border-white/30 text-white font-mono text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center"
              >
                <span>XEM BẢNG GIÁ DỊCH VỤ</span>
              </Link>
            </div>

            {/* Contact quick strip */}
            <div className="pt-8 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-[#A1A1AA]">
              <div className="flex items-center justify-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Hotline: 0344 979 307</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#FF2D95]" />
                <span>Email: admin@nguyenagency.vn</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Địa chỉ: Quảng Ngãi, Việt Nam</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
