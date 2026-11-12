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
  Compass,
  Palette,
  Check,
  Flame,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import prisma from "@/lib/prisma";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import {
  DetailBreadcrumbs,
  DetailHeroReveal,
  DetailAccordionFAQ,
  ShareCopyButton,
  ReadingProgressBar,
  InteractiveGallery,
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
  const folder = official.slug === "e-commerce-website" ? "ecommerce-website" : official.slug;

  const bannerImage =
    official.coverImage ||
    official.thumbnail ||
    dbService?.coverImage ||
    dbService?.thumbnail;

  // Resolve gallery images
  let galleryList: string[] = [];
  try {
    if (dbService?.galleryJson) {
      const parsed = JSON.parse(dbService.galleryJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        galleryList = parsed.filter((u) => typeof u === "string" && u.trim() !== "");
      }
    }
  } catch {}

  if (galleryList.length === 0) {
    galleryList = [
      bannerImage,
      official.thumbnail,
      official.coverImage || official.thumbnail,
    ].filter(Boolean);
  }

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
    <div className="bg-[#06070B] text-white min-h-screen relative overflow-hidden selection:bg-[#00E5FF]/30 selection:text-white">
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
        className="absolute top-16 right-1/4 w-[600px] h-[600px] rounded-full blur-[200px] pointer-events-none opacity-20"
        style={{ backgroundColor: accentColor }}
      />
      <div
        className="absolute top-[40%] left-[-100px] w-[500px] h-[500px] rounded-full blur-[220px] pointer-events-none opacity-10"
        style={{ backgroundColor: isMedia ? "#00E5FF" : "#FF2D95" }}
      />
      <div
        className="absolute bottom-[20%] right-[-100px] w-[500px] h-[500px] rounded-full blur-[220px] pointer-events-none opacity-10"
        style={{ backgroundColor: accentColor }}
      />

      {/* =================================================================
          A. HERO SECTION (LUXURY EDITORIAL SPLIT + 16:9 HERO BANNER)
      ================================================================= */}
      <section className="relative pt-32 pb-16 md:pt-36 md:pb-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto space-y-10 relative z-10">
          {/* Top Bar: Breadcrumbs + SRV Index Tag + Share */}
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
              <span className="text-xs font-mono tracking-widest text-[#A1A1AA] uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: accentColor }} />
                SRV // {String(official.order).padStart(2, "0")}
              </span>
              <ShareCopyButton title={`${official.title} - ${official.titleVn}`} />
            </div>
          </div>

          {/* Editorial Split Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 space-y-6">
              {/* Category Pill with Live Pulse */}
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase border font-bold flex items-center gap-2"
                  style={{
                    backgroundColor: accentBg,
                    borderColor: accentBorder,
                    color: accentColor,
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {official.group === "MEDIA" ? "MEDIA SÁNG TẠO" : "TECH CÔNG NGHỆ"} • {official.categoryName}
                  </span>
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
                <p
                  className="text-lg sm:text-2xl font-bold font-mono tracking-wide flex items-center gap-2"
                  style={{ color: accentColor }}
                >
                  <span>{official.titleVn}</span>
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
                  className="px-8 py-4 rounded-full text-xs font-mono uppercase tracking-widest font-bold text-white transition-all duration-300 flex items-center gap-2 shadow-2xl hover:scale-105"
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
                  className="px-8 py-4 rounded-full bg-[#121622] border border-white/10 hover:border-white/30 text-white font-mono text-xs font-bold uppercase tracking-widest transition-all hover:bg-white/5"
                >
                  XEM DỰ ÁN THỰC CHIẾN
                </Link>
              </div>
            </div>

            {/* Quick Metrics Aside Card */}
            <div className="lg:col-span-4 p-7 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] backdrop-blur-xl space-y-6 shadow-xl relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-10 pointer-events-none"
                style={{ backgroundColor: accentColor }}
              />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#71717A] block font-bold">
                TIÊU CHUẨN DỊCH VỤ DOANH NGHIỆP
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

              <div className="pt-2">
                <a
                  href="#tu-van"
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-center block text-white/90 hover:text-white transition-colors"
                >
                  Nhận báo giá dự toán ↓
                </a>
              </div>
            </div>
          </div>

          {/* Banner Image 16:9 Standard with Luxury Glass Framing */}
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-[#121622] border border-white/15 shadow-2xl group">
            <Image
              src={bannerImage}
              alt={`${official.title} - ${official.titleVn} | NGUYÊN AGENCY`}
              fill
              priority
              quality={85}
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06070B] via-transparent to-transparent opacity-75" />
            
            {/* Overlay Capsule */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-mono text-white font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                  NGUYÊN AGENCY • {official.title}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white/80 hidden sm:inline">
                  Tỉ lệ chuẩn 16:9 HD
                </span>
              </div>
              <span className="text-xs font-mono text-white/60">
                Hình ảnh thực tế dự án
              </span>
            </div>
          </div>

          {/* Quick-Nav Anchor Bar */}
          <div className="py-3 px-4 rounded-2xl bg-[#0B0D14]/90 border border-white/[0.08] backdrop-blur-xl overflow-x-auto flex items-center gap-3 text-xs font-mono text-[#A1A1AA]">
            <span className="text-[#71717A] uppercase tracking-wider font-bold shrink-0">ĐIỀU HƯỚNG NHANH:</span>
            <a href="#tong-quan" className="hover:text-white whitespace-nowrap transition-colors">01. Tổng quan</a>
            <span className="text-white/20">•</span>
            <a href="#thach-thuc-giai-phap" className="hover:text-white whitespace-nowrap transition-colors">02. Thách thức & Giải pháp</a>
            <span className="text-white/20">•</span>
            <a href="#hang-muc" className="hover:text-white whitespace-nowrap transition-colors">03. Hạng mục</a>
            <span className="text-white/20">•</span>
            <a href="#quy-trinh" className="hover:text-white whitespace-nowrap transition-colors">04. Quy trình</a>
            <span className="text-white/20">•</span>
            <a href="#thu-vien-anh" className="hover:text-white whitespace-nowrap transition-colors">05. Thư viện ảnh</a>
            <span className="text-white/20">•</span>
            <a href="#ban-giao-doi-tuong" className="hover:text-white whitespace-nowrap transition-colors">06. Bàn giao & Đối tượng</a>
            <span className="text-white/20">•</span>
            <a href="#faq" className="hover:text-white whitespace-nowrap transition-colors">07. FAQ</a>
          </div>
        </div>
      </section>

      {/* =================================================================
          B. GIỚI THIỆU DỊCH VỤ (150–250 TỪ)
      ================================================================= */}
      <section id="tong-quan" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] scroll-mt-28">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
            <Compass className="w-4 h-4" />
            <span>TỔNG QUAN & BẢN CHẤT DỊCH VỤ</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-snug">
            Nhu Cầu Thực Tế & Vai Trò Của {official.title} Trong Kinh Doanh
          </h2>
          <div className="p-8 sm:p-10 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden">
            <div
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-10 pointer-events-none"
              style={{ backgroundColor: accentColor }}
            />
            <p className="text-base sm:text-lg text-[#E4E4E7] leading-relaxed whitespace-pre-line relative z-10">
              {official.intro}
            </p>
          </div>
        </div>
      </section>

      {/* =================================================================
          C & D. BENTO COMPARISON: THÁCH THỨC vs GIẢI PHÁP THỰC CHIẾN
      ================================================================= */}
      <section id="thach-thuc-giai-phap" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] scroll-mt-28">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase font-bold" style={{ color: accentColor }}>
              <Target className="w-4 h-4" />
              <span>BÀI TOÁN & PHƯƠNG ÁN XỬ LÝ</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Thách Thức Thực Tế & Lời Giải Từ Nguyên Agency
            </h2>
            <p className="text-sm text-[#A1A1AA]">
              So sánh đối chiếu giữa những trở ngại bạn thường gặp và giải pháp triển khai thực chiến của chúng tôi:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* C. Customer Problems Column */}
            <div className="lg:col-span-5 p-8 rounded-3xl bg-[#0B0D14]/90 border border-amber-500/25 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-amber-400 uppercase font-bold mb-4">
                  <AlertCircle className="w-4 h-4" />
                  <span>THÁCH THỨC BẠN ĐANG ĐỐI MẶT</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-6">
                  Những Rủi Ro Doanh Nghiệp Thường Gặp
                </h3>
                <div className="space-y-4">
                  {official.clientProblems.map((problem, idx) => (
                    <div key={idx} className="flex items-start gap-3.5">
                      <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[11px] font-mono font-bold text-amber-400">0{idx + 1}</span>
                      </div>
                      <p className="text-sm text-[#D4D4D8] leading-relaxed">
                        {problem}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-amber-500/20 text-xs font-mono text-amber-400/80">
                ⚠ Thiệt hại: Lãng phí ngân sách và giảm sút cơ hội chốt đơn.
              </div>
            </div>

            {/* D. Agency Solution Column */}
            <div
              className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-[#0B0D14]/90 border flex flex-col justify-between relative overflow-hidden"
              style={{ borderColor: accentBorder }}
            >
              <div
                className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[140px] opacity-15 pointer-events-none"
                style={{ backgroundColor: accentColor }}
              />

              <div className="relative z-10 space-y-5">
                <div
                  className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-widest font-bold"
                  style={{
                    backgroundColor: accentBg,
                    color: accentColor,
                    border: `1px solid ${accentBorder}`,
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>PHƯƠNG ÁN TRIỂN KHAI NGUYÊN AGENCY</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                  Giải Pháp Thực Chiến & Tối Ưu Hiệu Quả Đầu Tư
                </h3>

                <p className="text-sm sm:text-base text-[#E4E4E7] leading-relaxed whitespace-pre-line">
                  {official.solution}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/[0.08] relative z-10 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  Cam kết trung thực, không hứa hẹn phi thực tế
                </span>
                <Link
                  href={`/lien-he?service=${encodeURIComponent(official.title)}`}
                  className="text-xs font-mono text-white inline-flex items-center gap-1 hover:underline"
                >
                  <span>Nhận tư vấn phương án này</span>
                  <ArrowRight className="w-3.5 h-3.5" style={{ color: accentColor }} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          E. HẠNG MỤC TRIỂN KHAI ĐỀ XUẤT (CHUẨN TỪ PROMPT)
      ================================================================= */}
      <section id="hang-muc" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] scroll-mt-28">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              <Layers className="w-4 h-4" />
              <span>HẠNG MỤC ĐỀ XUẤT TIÊU CHUẨN</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Phạm Vi Triển Khai Cho {official.title}
            </h2>
            <p className="text-sm text-[#A1A1AA]">
              Các hạng mục trọng tâm được đóng gói chuyên nghiệp, bảo đảm đầy đủ tính năng và khả năng ứng dụng thực tế:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {official.proposedItems.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0B0D14]/90 border border-white/[0.08] hover:border-white/25 transition-all flex items-start gap-4 group"
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: accentBg, border: `1px solid ${accentBorder}` }}
                >
                  <CheckCircle2 className="w-4 h-4" style={{ color: accentColor }} />
                </div>
                <div>
                  <span className="text-xs font-mono text-[#71717A] uppercase block mb-1">
                    HẠNG MỤC 0{idx + 1}
                  </span>
                  <span className="text-sm font-bold text-white group-hover:text-white leading-snug">
                    {item}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================
          F. QUY TRÌNH THỰC HIỆN (4–6 BƯỚC RIÊNG BIỆT)
      ================================================================= */}
      <section id="quy-trinh" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] scroll-mt-28">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              <Workflow className="w-4 h-4" />
              <span>QUY TRÌNH LÀM VIỆC MINH BẠCH</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Lộ Trình Triển Khai Chuyên Nghiệp {official.process.length} Bước
            </h2>
            <p className="text-sm text-[#A1A1AA]">
              Từng giai đoạn đều có mốc nghiệm thu rõ ràng, đảm bảo bạn luôn nắm bắt tiến độ công việc một cách chủ động:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {official.process.map((stepItem, idx) => (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] hover:border-white/25 transition-all flex flex-col justify-between hover:-translate-y-1 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-xs font-mono font-bold px-3 py-1 rounded-full border group-hover:scale-105 transition-transform"
                      style={{
                        backgroundColor: accentBg,
                        borderColor: accentBorder,
                        color: accentColor,
                      }}
                    >
                      BƯỚC {stepItem.step}
                    </span>
                    <span className="text-[10px] font-mono text-[#71717A]">
                      GIAI ĐOẠN 0{idx + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white">
                    {stepItem.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                    {stepItem.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#71717A]">
                  <span>Nghiệm thu mốc {stepItem.step}</span>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================
          THƯ VIỆN HÌNH ẢNH & THIẾT BỊ MOCKUP TƯƠNG TÁC (INTERACTIVE GALLERY)
      ================================================================= */}
      <section id="thu-vien-anh" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] scroll-mt-28">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              <Palette className="w-4 h-4" />
              <span>THƯ VIỆN ẤN PHẨM & DỰ ÁN THỰC CHIẾN</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Visual Showcase & Trải Nghiệm Đa Màn Hình
            </h2>
            <p className="text-sm text-[#A1A1AA]">
              Khám phá hệ thống hình ảnh, giao diện và ấn phẩm đã thực hiện với chế độ chuyển đổi mockup thiết bị:
            </p>
          </div>

          <InteractiveGallery
            images={galleryList}
            title={`${official.title} - ${official.titleVn}`}
            accentColor={accentColor}
            enableDevicePreview={true}
          />
        </div>
      </section>

      {/* =================================================================
          G & H. SẢN PHẨM BÀN GIAO & ĐỐI TƯỢNG PHÙ HỢP
      ================================================================= */}
      <section id="ban-giao-doi-tuong" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] scroll-mt-28">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* G. Deliverables */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold mb-3">
                <FileCheck className="w-4 h-4" />
                <span>SẢN PHẨM BÀN GIAO</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-2">
                Tiêu Chuẩn Sản Phẩm Bàn Giao
              </h3>
              <p className="text-xs text-[#A1A1AA] mb-6">
                Cam kết bàn giao 100% đầy đủ theo đúng thỏa thuận hợp đồng:
              </p>
              <div className="space-y-3.5">
                {official.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#E4E4E7]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.06] text-xs font-mono text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Bàn giao file vector / mã nguồn sạch, không mã hóa</span>
            </div>
          </div>

          {/* H. Target Audience */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#FF2D95] uppercase font-bold mb-3">
                <Users className="w-4 h-4" />
                <span>ĐỐI TƯỢNG PHÙ HỢP</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-2">
                Khách Hàng Phù Hợp Với Dịch Vụ
              </h3>
              <p className="text-xs text-[#A1A1AA] mb-6">
                Giải pháp được thiết kế tối ưu nhất cho các phân khúc:
              </p>
              <div className="space-y-3.5">
                {official.targetAudience.map((target, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#E4E4E7]">
                    <div
                      className="w-2 h-2 rounded-full shrink-0 mt-2"
                      style={{ backgroundColor: accentColor }}
                    />
                    <span>{target}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.06] text-xs font-mono text-[#A1A1AA] flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
              <span>Tư vấn phương án linh hoạt theo ngân sách của bạn</span>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          CAM KẾT CHẤT LƯỢNG & SLA DOANH NGHIỆP
      ================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08]">
        <div className="max-w-5xl mx-auto">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="flex items-start gap-3.5">
                <ShieldCheck className="w-6 h-6 text-[#00E5FF] shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">100% Quyền Sở Hữu Tài Sản</h4>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">
                    Khách hàng sở hữu hoàn toàn bản quyền thiết kế, file gốc và mã nguồn, không ràng buộc chi phí ngầm.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Zap className="w-6 h-6 text-[#FF2D95] shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Tiến Độ & Kỹ Thuật Chuẩn Mực</h4>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">
                    Mốc bàn giao đúng hẹn theo hợp đồng, tối ưu hóa hiệu năng, SEO và tính tiện dụng trên mọi thiết bị.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Sparkles className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Bảo Hành & Đồng Hành Dài Hạn</h4>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">
                    Hỗ trợ kỹ thuật sau bàn giao, hướng dẫn quản trị chu đáo và sẵn sàng nâng cấp mở rộng theo nhu cầu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          I. CÂU HỎI THƯỜNG GẶP (FAQ 4–6 CÂU HỎI THỰC TẾ)
      ================================================================= */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] scroll-mt-28">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-3 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              <HelpCircle className="w-4 h-4" />
              <span>HỎI ĐÁP CHUYÊN SÂU</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Giải Đáp Thắc Mắc Thường Gặp Về {official.title}
            </h2>
            <p className="text-sm text-[#A1A1AA]">
              Những thắc mắc phổ biến nhất của các chủ doanh nghiệp khi tìm hiểu về phương án triển khai dịch vụ:
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
                Dịch Vụ Liên Quan Được Khuyên Dùng Cùng {official.title}
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
                        loading="lazy"
                        quality={80}
                        sizes="(max-width: 768px) 100vw, 380px"
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
      <section id="tu-van" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 scroll-mt-28">
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
