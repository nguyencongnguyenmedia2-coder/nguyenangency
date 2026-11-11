import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ExternalLink,
  CheckCircle2,
  Layers,
  Cpu,
  Trophy,
  Sparkles,
  Calendar,
  Target,
  AlertCircle,
  Lightbulb,
  Clock,
  Building2,
} from "lucide-react";
import prisma from "@/lib/prisma";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import {
  DetailBreadcrumbs,
  DetailHeroReveal,
  InteractiveGallery,
  ShareCopyButton,
  ReadingProgressBar,
} from "@/components/common/DetailInteractiveTools";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await params;
  let item: any = null;
  try {
    item = await prisma.portfolio.findUnique({
      where: { slug: resolvedParams.slug },
      include: { category: true },
    });
  } catch {
    item = null;
  }

  if (!item || item.deletedAt !== null) {
    return { title: "Dự án không tồn tại – NGUYÊN AGENCY" };
  }

  const title = `${item.metaTitle || item.title} – Case Study | NGUYÊN AGENCY`;
  const description = item.metaDescription || item.shortDesc;
  const canonicalUrl = `https://nguyenangency.vercel.app/portfolio/${item.slug}`;

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
      type: "article",
      images: [
        {
          url: item.thumbnail,
          width: 1200,
          height: 630,
          alt: item.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [item.thumbnail],
    },
  };
}

export default async function PortfolioDetailPage({
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

  let item: any = null;
  try {
    item = await prisma.portfolio.findUnique({
      where: { slug: resolvedParams.slug },
      include: { category: true },
    });
  } catch (err) {
    console.warn("[PortfolioDetailPage] DB fetch fallback active:", err);
  }

  if (
    !item ||
    item.deletedAt !== null ||
    (!isPreview && item.status !== "PUBLISHED")
  ) {
    notFound();
  }

  let techStack: string[] = [];
  let results: string[] = [];
  let gallery: string[] = [];
  let processPhases: any[] = [];

  try {
    techStack = JSON.parse(item.technologiesJson || "[]");
  } catch {
    techStack = [];
  }
  try {
    results = JSON.parse(item.resultsJson || "[]");
  } catch {
    results = [];
  }
  try {
    gallery = JSON.parse(item.galleryJson || "[]");
  } catch {
    gallery = [];
  }
  try {
    processPhases = JSON.parse(item.processJson || "[]");
  } catch {
    processPhases = [];
  }

  // Ensure thumbnail is available in gallery if gallery is empty
  const displayGallery =
    gallery.length > 0 ? gallery : item.thumbnail ? [item.thumbnail] : [];

  // Related Content Engine: Next / Related Projects + Related Services
  const isMediaCase =
    item.category?.slug?.includes("brand") ||
    item.category?.name?.toLowerCase().includes("brand");

  const [otherProjects, relatedServices] = await Promise.all([
    prisma.portfolio.findMany({
      where: {
        id: { not: item.id },
        status: "PUBLISHED",
      },
      include: { category: true },
      orderBy: [{ categoryId: "asc" }, { order: "asc" }],
      take: 3,
    }),
    prisma.service.findMany({
      where: {
        status: "PUBLISHED",
        group: isMediaCase ? "MEDIA" : "TECH",
      },
      include: { category: true },
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
      take: 3,
    }),
  ]);

  const nextProject = otherProjects[0] || null;
  const hasValidLiveUrl =
    Boolean(item.liveUrl) &&
    (item.liveUrl!.startsWith("http://") ||
      item.liveUrl!.startsWith("https://"));

  const timelineSummary =
    processPhases.length > 0
      ? processPhases.map((p: any) => p.duration).filter(Boolean).join(" + ") ||
        `${processPhases.length} Giai đoạn`
      : "Theo lộ trình Sprint";

  // CreativeWork JSON-LD Schema
  const caseStudySchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: item.title,
    description: item.shortDesc,
    image: item.thumbnail,
    dateCreated: item.year,
    creator: {
      "@type": "Organization",
      name: "NGUYÊN AGENCY",
      url: "https://nguyenangency.vercel.app",
    },
    ...(hasValidLiveUrl ? { url: item.liveUrl } : {}),
  };

  return (
    <article className="bg-[#0A0A0A] text-white min-h-screen">
      <ReadingProgressBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudySchema) }}
      />

      {item.status !== "PUBLISHED" && (
        <div className="bg-[#FF2D95]/20 border-b border-[#FF2D95]/40 text-white px-6 py-2.5 text-center text-xs font-mono mt-20">
          CHẾ ĐỘ XEM TRƯỚC CASE STUDY (TRẠNG THÁI: {item.status})
        </div>
      )}

      {/* =================================================================
          1. EDITORIAL CASE STUDY HERO
      ================================================================= */}
      <section className="relative pt-32 pb-20 md:pt-36 md:pb-24 px-6 border-b border-[#292929] bg-architectural-grid overflow-hidden">
        <div className="absolute top-16 left-1/3 w-[460px] h-[460px] bg-[#007BA7]/15 rounded-full blur-[160px] pointer-events-none" />

        <DetailHeroReveal className="max-w-7xl mx-auto space-y-12 relative z-10">
          {/* Dynamic Breadcrumb + Share */}
          <div
            data-hero-item
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#292929]"
          >
            <DetailBreadcrumbs
              items={[
                { label: "Trang chủ", href: "/" },
                { label: "Dự án", href: "/portfolio" },
                ...(item.category
                  ? [
                      {
                        label: item.category.name,
                        href: `/portfolio?category=${item.category.slug}`,
                      },
                    ]
                  : []),
                { label: item.title },
              ]}
            />
            <ShareCopyButton title={item.title} />
          </div>

          {/* Editorial Title & Live Link */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8 space-y-6">
              <div data-hero-item className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-widest uppercase bg-[#FF2D95]/10 border border-[#FF2D95]/40 text-[#FF2D95]">
                  {item.category?.name || "Case Study"}
                </span>
                <span className="px-3.5 py-1.5 rounded-full text-[11px] font-mono uppercase bg-[#121212] border border-[#292929] text-[#A1A1AA] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#007BA7]" />
                  <span>{item.year}</span>
                </span>
                {item.clientName && (
                  <span className="px-3.5 py-1.5 rounded-full text-[11px] font-mono uppercase bg-[#121212] border border-[#292929] text-white flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#FF2D95]" />
                    <span>{item.clientName}</span>
                  </span>
                )}
              </div>

              <h1
                data-hero-item
                className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.05] text-white"
              >
                {item.title}
              </h1>

              <p
                data-hero-item
                className="text-base md:text-xl text-[#A1A1AA] leading-relaxed max-w-3xl"
              >
                {item.shortDesc}
              </p>
            </div>

            <div
              data-hero-item
              className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3.5 lg:items-end"
            >
              {hasValidLiveUrl && (
                <a
                  href={item.liveUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto lg:w-full px-8 py-4 rounded-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-mono text-xs font-bold uppercase tracking-[0.16em] hover:shadow-glow-pink transition-all flex items-center justify-center gap-2.5"
                >
                  <span>Visit Live Project</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <Link
                href={`/contact?project=${encodeURIComponent(item.title)}`}
                className="w-full sm:w-auto lg:w-full px-8 py-4 rounded-full bg-[#121212] border border-[#292929] hover:border-[#007BA7] text-white font-mono text-xs font-bold uppercase tracking-[0.16em] transition-all flex items-center justify-center gap-2"
              >
                <span>Request Similar Solution</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Full-Width Cover Image */}
          <div
            data-hero-visual
            className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-3xl overflow-hidden border border-[#292929] bg-[#121212]"
          >
            <Image
              src={item.thumbnail}
              alt={item.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
              <div className="px-4 py-2 rounded-2xl bg-[#0A0A0A]/85 border border-[#292929] text-xs font-mono text-white">
                CLIENT: {item.clientName}
              </div>
              <div className="px-4 py-2 rounded-2xl bg-[#0A0A0A]/85 border border-[#292929] text-xs font-mono text-[#007BA7]">
                ROLE: END-TO-END STRATEGY, DESIGN & ENGINEERING
              </div>
            </div>
          </div>
        </DetailHeroReveal>
      </section>

      {/* =================================================================
          2. PROJECT DETAILS DOSSIER (6 SPECS)
      ================================================================= */}
      <section className="py-12 px-6 border-b border-[#292929] bg-[#121212]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#A1A1AA] block">
              CLIENT / PARTNER
            </span>
            <strong className="text-sm font-bold text-white block">
              {item.clientName}
            </strong>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#A1A1AA] block">
              INDUSTRY / CATEGORY
            </span>
            <strong className="text-sm font-bold text-[#007BA7] block">
              {item.category?.name || "Digital Platform"}
            </strong>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#A1A1AA] block">
              AGENCY SERVICES
            </span>
            <strong className="text-sm font-bold text-white block">
              Strategy, UI/UX & Dev
            </strong>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#A1A1AA] block">
              TIMELINE
            </span>
            <strong className="text-sm font-bold text-[#FF2D95] font-mono block">
              {timelineSummary}
            </strong>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#A1A1AA] block">
              RELEASE YEAR
            </span>
            <strong className="text-sm font-bold text-white font-mono block">
              {item.year}
            </strong>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#A1A1AA] block">
              PROJECT SCOPE
            </span>
            <strong className="text-sm font-bold text-white block">
              Full-cycle Production
            </strong>
          </div>
        </div>
      </section>

      {/* =================================================================
          3. VERIFIED RESULTS (ONLY IF CONFIGURED IN CRM)
      ================================================================= */}
      {results.length > 0 && (
        <section className="py-20 px-6 border-b border-[#292929]">
          <div className="max-w-7xl mx-auto space-y-10">
            <RevealOnScroll className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#FF2D95] mb-2 block">
                  MEASURABLE IMPACT
                </span>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                  KẾT QUẢ THỰC TẾ ĐƯỢC GHI NHẬN.
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#A1A1AA]">
                <Trophy className="w-4 h-4 text-[#FF2D95]" />
                <span>Dữ liệu xác thực từ dự án {item.clientName}</span>
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.map((res, idx) => (
                <RevealOnScroll
                  key={idx}
                  delay={idx * 0.1}
                  className="p-8 rounded-3xl bg-[#121212] border border-[#292929] flex flex-col justify-between space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#A1A1AA]">
                      METRIC // 0{idx + 1}
                    </span>
                    <Sparkles className="w-4 h-4 text-[#007BA7]" />
                  </div>
                  <p className="text-2xl md:text-3xl font-black text-white leading-snug">
                    {res}
                  </p>
                  <div className="pt-4 border-t border-[#292929] text-[11px] font-mono text-[#007BA7] uppercase">
                    VERIFIED CASE OUTCOME
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =================================================================
          4. EDITORIAL NARRATIVE: OVERVIEW, CHALLENGE & SOLUTION
      ================================================================= */}
      <section className="py-20 md:py-28 px-6 border-b border-[#292929]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Sticky Column: Project Tech Stack & Scope Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="p-8 rounded-3xl bg-[#121212] border border-[#292929] space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#007BA7] block mb-1">
                  TECHNOLOGY ARSENAL
                </span>
                <h3 className="text-lg font-bold text-white uppercase">
                  Công Nghệ Triển Khai
                </h3>
              </div>

              {techStack.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-2 rounded-xl bg-[#171717] border border-[#292929] text-xs font-mono text-white flex items-center gap-2"
                    >
                      <Cpu className="w-3.5 h-3.5 text-[#007BA7]" />
                      <span>{tech}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#A1A1AA]">
                  Kiến trúc công nghệ hiện đại chuẩn hóa theo yêu cầu của đối tác {item.clientName}.
                </p>
              )}

              {/* Execution Phases if present in CRM */}
              {processPhases.length > 0 && (
                <div className="pt-6 border-t border-[#292929] space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#FF2D95] block">
                    EXECUTION MILESTONES
                  </span>
                  {processPhases.map((phase: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#171717] border border-[#292929] flex items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="text-[10px] font-mono text-[#A1A1AA] block">
                          {phase.phase || `Phase 0${idx + 1}`}
                        </span>
                        <strong className="text-white">{phase.title}</strong>
                      </div>
                      {phase.duration && (
                        <span className="font-mono text-[#007BA7] shrink-0">
                          {phase.duration}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Main Editorial Narrative */}
          <div className="lg:col-span-8 space-y-10">
            {/* 01. Project Overview */}
            <RevealOnScroll className="p-8 md:p-12 rounded-3xl bg-[#121212] border border-[#292929] space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#007BA7]/15 border border-[#007BA7]/40 flex items-center justify-center text-[#007BA7]">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#007BA7] block">
                    01 // PROJECT OVERVIEW & OBJECTIVE
                  </span>
                  <h2 className="text-2xl font-black uppercase text-white">
                    Bối Cảnh & Mục Tiêu Chiến Lược
                  </h2>
                </div>
              </div>
              <p className="text-base md:text-lg text-white leading-relaxed whitespace-pre-line">
                {item.objective || item.shortDesc}
              </p>
            </RevealOnScroll>

            {/* 02. The Challenge */}
            {item.challenge && (
              <RevealOnScroll className="p-8 md:p-12 rounded-3xl bg-[#121212] border border-[#292929] space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FF2D95]/15 border border-[#FF2D95]/40 flex items-center justify-center text-[#FF2D95]">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF2D95] block">
                      02 // THE CHALLENGE
                    </span>
                    <h2 className="text-2xl font-black uppercase text-white">
                      Bài Toán Thị Giác & Kỹ Thuật
                    </h2>
                  </div>
                </div>
                <p className="text-base md:text-lg text-[#A1A1AA] leading-relaxed whitespace-pre-line">
                  {item.challenge}
                </p>
              </RevealOnScroll>
            )}

            {/* 03. The Solution */}
            {item.solution && (
              <RevealOnScroll className="p-8 md:p-12 rounded-3xl bg-[#171717] border border-[#007BA7]/50 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#007BA7]/15 border border-[#007BA7]/40 flex items-center justify-center text-[#007BA7]">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#007BA7] block">
                      03 // THE SOLUTION
                    </span>
                    <h2 className="text-2xl font-black uppercase text-white">
                      Giải Pháp Sáng Tạo & Kiến Trúc Công Nghệ
                    </h2>
                  </div>
                </div>
                <p className="text-base md:text-lg text-white leading-relaxed whitespace-pre-line">
                  {item.solution}
                </p>
              </RevealOnScroll>
            )}
          </div>
        </div>
      </section>

      {/* =================================================================
          5. VISUAL GALLERY (FULL-WIDTH, MULTI-COLUMN, MOCKUPS & LIGHTBOX)
      ================================================================= */}
      <section className="py-20 md:py-28 px-6 border-b border-[#292929]">
        <div className="max-w-7xl mx-auto space-y-12">
          <RevealOnScroll className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#007BA7] mb-2 block">
                04 // VISUAL SHOWCASE & INTERFACE GALLERY
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                TRẢI NGHIỆM THỊ GIÁC ĐA NỀN TẢNG.
              </h2>
            </div>
            <p className="text-xs font-mono text-[#A1A1AA]">
              Nhấn vào bất kỳ hình ảnh nào để mở chế độ xem toàn màn hình (Lightbox).
            </p>
          </RevealOnScroll>

          <InteractiveGallery
            images={displayGallery}
            title={item.title}
            accentColor="#007BA7"
            enableDevicePreview={true}
            videoUrl={item.videoPreview}
          />
        </div>
      </section>

      {/* =================================================================
          6. NEXT PROJECT & RELATED CONTENT ENGINE
      ================================================================= */}
      {(nextProject || relatedServices.length > 0) && (
        <section className="py-20 md:py-28 px-6 border-b border-[#292929]">
          <div className="max-w-7xl mx-auto space-y-20">
            {/* Next Project Spotlight */}
            {nextProject && (
              <RevealOnScroll className="space-y-8">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#FF2D95]">
                    NEXT CASE STUDY
                  </span>
                  <Link
                    href="/portfolio"
                    className="text-xs font-mono text-[#A1A1AA] hover:text-white inline-flex items-center gap-1.5"
                  >
                    <span>Tất cả dự án</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

                <Link
                  href={`/portfolio/${nextProject.slug}`}
                  className="group grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 md:p-10 rounded-3xl bg-[#121212] border border-[#292929] hover:border-[#007BA7] transition-all items-center"
                >
                  <div className="lg:col-span-7 relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#171717]">
                    <Image
                      src={nextProject.thumbnail}
                      alt={nextProject.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="lg:col-span-5 space-y-4">
                    <span className="px-3 py-1 rounded-full bg-[#171717] border border-[#292929] text-[10px] font-mono uppercase text-[#007BA7]">
                      {nextProject.category?.name} • {nextProject.year}
                    </span>
                    <h3 className="text-2xl md:text-4xl font-black uppercase text-white group-hover:text-[#007BA7] transition-colors">
                      {nextProject.title}
                    </h3>
                    <p className="text-sm text-[#A1A1AA] leading-relaxed line-clamp-3">
                      {nextProject.shortDesc}
                    </p>
                    <div className="pt-4 inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-white group-hover:text-[#FF2D95] transition-colors">
                      <span>Explore Next Case Study</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </RevealOnScroll>
            )}

            {/* Related Services */}
            {relatedServices.length > 0 && (
              <div className="space-y-8">
                <RevealOnScroll>
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#007BA7] mb-2 block">
                    RELATED CAPABILITIES
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                    DỊCH VỤ ĐƯỢC ÁP DỤNG TRONG DỰ ÁN NÀY
                  </h2>
                </RevealOnScroll>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedServices.map((srv, idx) => (
                    <RevealOnScroll key={srv.id} delay={idx * 0.08}>
                      <Link
                        href={`/services/${srv.slug}`}
                        className="p-7 rounded-3xl bg-[#121212] hover:bg-[#171717] border border-[#292929] hover:border-[#007BA7] transition-all flex flex-col justify-between h-full space-y-6 group"
                      >
                        <div className="space-y-3">
                          <span className="text-[10px] font-mono uppercase text-[#007BA7]">
                            {srv.group} • {srv.estimatedTime}
                          </span>
                          <h3 className="text-lg font-bold text-white group-hover:text-[#007BA7] transition-colors">
                            {srv.title}
                          </h3>
                          <p className="text-xs text-[#A1A1AA] line-clamp-2">
                            {srv.shortDesc}
                          </p>
                        </div>
                        <div className="pt-4 border-t border-[#292929] flex items-center justify-between text-xs font-mono text-white">
                          <span>Khám phá dịch vụ</span>
                          <ArrowUpRight className="w-4 h-4 text-[#007BA7]" />
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
          7. FINAL CTA: "HAVE A PROJECT IN MIND?"
      ================================================================= */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll className="rounded-3xl bg-[#121212] border border-[#292929] p-10 md:p-16 lg:p-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <div className="max-w-2xl space-y-4">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#FF2D95] block">
                COLLABORATE WITH NGUYÊN AGENCY
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none text-white">
                HAVE A PROJECT{" "}
                <span className="text-gradient-brand">IN MIND?</span>
              </h2>
              <p className="text-base text-[#A1A1AA] leading-relaxed">
                Hãy chia sẻ bài toán thương hiệu hoặc sản phẩm công nghệ của bạn. Đội ngũ NGUYÊN AGENCY sẽ phản hồi cùng đề xuất kiến trúc giải pháp trong vòng 24 giờ.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto shrink-0">
              <Link
                href={`/contact?project=${encodeURIComponent(item.title)}`}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-mono text-xs font-bold uppercase tracking-[0.18em] hover:shadow-glow-pink transition-all flex items-center justify-center gap-2"
              >
                <span>Start a Conversation</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                className="px-8 py-4 rounded-full bg-[#171717] border border-[#292929] hover:border-white text-white font-mono text-xs font-bold uppercase tracking-[0.18em] transition-all flex items-center justify-center"
              >
                <span>Explore Services</span>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </article>
  );
}
