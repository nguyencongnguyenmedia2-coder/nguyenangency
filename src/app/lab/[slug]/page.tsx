import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ExternalLink,
  Terminal,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  FlaskConical,
  Workflow,
  GitBranch,
  ShieldCheck,
  Code2,
} from "lucide-react";
import prisma from "@/lib/prisma";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import {
  DetailBreadcrumbs,
  DetailHeroReveal,
  InteractiveGallery,
  DetailAccordionFAQ,
  ShareCopyButton,
  ReadingProgressBar,
} from "@/components/common/DetailInteractiveTools";

export const revalidate = 60;

function isValidHttpUrl(val?: string | null): boolean {
  if (!val) return false;
  try {
    const u = new URL(val);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function formatStageLabel(stage: string): string {
  const upper = (stage || "LIVE").toUpperCase();
  if (upper === "LIVE") return "Live";
  if (upper === "BETA") return "Beta";
  if (upper === "DEVELOPING" || upper === "R&D") return "Developing";
  if (upper === "IDEA" || upper === "CONCEPT") return "Idea";
  return stage;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await params;
  let prod: any = null;
  try {
    prod = await prisma.labProduct.findUnique({
      where: { slug: resolvedParams.slug },
      include: { category: true },
    });
  } catch {
    prod = null;
  }

  if (!prod || prod.deletedAt !== null) {
    return { title: "Sản phẩm LAB không tồn tại – NGUYÊN AGENCY" };
  }

  const title = `${prod.metaTitle || prod.name} – NGUYÊN LAB | ${
    prod.tagline || "Digital Product"
  }`;
  const description = prod.metaDescription || prod.shortDesc;
  const canonicalUrl = `https://nguyenangency.vercel.app/lab/${prod.slug}`;

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
      images: [
        {
          url: prod.thumbnail,
          width: 1200,
          height: 630,
          alt: prod.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [prod.thumbnail],
    },
  };
}

export default async function LabProductDetailPage({
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

  let prod: any = null;
  try {
    prod = await prisma.labProduct.findUnique({
      where: { slug: resolvedParams.slug },
      include: { category: true },
    });
  } catch (err) {
    console.warn("[LabProductDetailPage] DB fetch fallback active:", err);
  }

  if (
    !prod ||
    prod.deletedAt !== null ||
    (!isPreview && prod.status !== "PUBLISHED")
  ) {
    notFound();
  }

  let features: string[] = [];
  let techStack: string[] = [];
  let gallery: string[] = [];

  try {
    features = JSON.parse(prod.featuresJson || "[]");
  } catch {
    features = [];
  }
  try {
    techStack = JSON.parse(prod.techStackJson || "[]");
  } catch {
    techStack = [];
  }
  try {
    gallery = JSON.parse(prod.galleryJson || "[]");
  } catch {
    gallery = [];
  }

  const displayGallery =
    gallery.length > 0 ? gallery : prod.thumbnail ? [prod.thumbnail] : [];

  // Related Content Engine: Related LAB Products + Related Blog Articles + FAQs
  const [relatedProducts, relatedPosts, faqs] = await Promise.all([
    prisma.labProduct.findMany({
      where: {
        id: { not: prod.id },
        status: "PUBLISHED",
      },
      include: { category: true },
      orderBy: { order: "asc" },
      take: 2,
    }),
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      take: 2,
    }),
    prisma.fAQ.findMany({
      where: {
        status: "PUBLISHED",
        category: { in: ["Tech", "General"] },
      },
      orderBy: { order: "asc" },
      take: 4,
    }),
  ]);

  const hasTryUrl = isValidHttpUrl(prod.websiteUrl || prod.demoUrl);
  const hasDemoUrl = isValidHttpUrl(prod.demoUrl);
  const stageDisplay = formatStageLabel(prod.productStage);

  const howItWorksSteps = [
    {
      step: "01",
      title: "Khởi tạo Workspace & Kết nối dữ liệu",
      desc: `Đăng nhập vào ${prod.name} hoặc kết nối trực tiếp qua API khóa bảo mật của doanh nghiệp chỉ trong vài phút.`,
    },
    {
      step: "02",
      title: "Cấu hình Tham số & Pipeline Tự động",
      desc: "Tùy chỉnh mô hình xử lý, giao diện đầu ra và quy tắc tự động hóa phù hợp với quy trình vận hành thực tế.",
    },
    {
      step: "03",
      title: "Xử lý Thời gian thực & Xuất bản",
      desc: "Hệ thống vận hành trên hạ tầng GPU/Cloud tốc độ cao, kết xuất kết quả tức thì và đồng bộ hóa đa nền tảng.",
    },
  ];

  const roadmapStages = [
    {
      phase: "PHASE 01",
      stage: "Idea & R&D Architecture",
      status: "COMPLETED",
      desc: "Nghiên cứu thuật toán lõi, kiểm chứng mô hình (PoC) và thiết kế kiến trúc hệ thống tại NGUYÊN LAB.",
    },
    {
      phase: "PHASE 02",
      stage: "Developing & Internal Alpha",
      status:
        stageDisplay === "Idea"
          ? "UPCOMING"
          : stageDisplay === "Developing"
          ? "CURRENT"
          : "COMPLETED",
      desc: "Xây dựng giao diện người dùng Luxury Dark, tối ưu hiệu năng xử lý và kiểm thử bảo mật nội bộ.",
    },
    {
      phase: "PHASE 03",
      stage: "Beta Testing & Partner Sandbox",
      status:
        stageDisplay === "Beta"
          ? "CURRENT"
          : stageDisplay === "Live"
          ? "COMPLETED"
          : "UPCOMING",
      desc: "Mở quyền truy cập thử nghiệm cho các đối tác chiến lược và tinh chỉnh theo phản hồi thực tế.",
    },
    {
      phase: "PHASE 04",
      stage: `Commercial Live (${prod.version})`,
      status: stageDisplay === "Live" ? "CURRENT" : "UPCOMING",
      desc: "Phát hành thương mại chính thức với cam kết SLA 99.9% và hỗ trợ tích hợp Enterprise toàn diện.",
    },
  ];

  // SoftwareApplication JSON-LD Schema (only when valid product data exists)
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: prod.name,
    applicationCategory: prod.category?.name || "BusinessApplication",
    operatingSystem: "Web, Cloud",
    softwareVersion: prod.version,
    description: prod.shortDesc,
    image: prod.thumbnail,
    author: {
      "@type": "Organization",
      name: "NGUYÊN AGENCY",
      url: "https://nguyenangency.vercel.app",
    },
  };

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen">
      <ReadingProgressBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      {prod.status !== "PUBLISHED" && (
        <div className="bg-[#FF2D95]/20 border-b border-[#FF2D95]/40 text-white px-6 py-2.5 text-center text-xs font-mono mt-20">
          CHẾ ĐỘ XEM TRƯỚC SẢN PHẨM LAB (TRẠNG THÁI: {prod.status})
        </div>
      )}

      {/* =================================================================
          1. SAAS PRODUCT HERO SECTION
      ================================================================= */}
      <section className="relative pt-32 pb-20 md:pt-36 md:pb-28 px-6 border-b border-[#292929] bg-architectural-grid overflow-hidden">
        <div className="absolute top-20 right-1/3 w-[450px] h-[450px] bg-[#FF2D95]/12 rounded-full blur-[160px] pointer-events-none" />

        <DetailHeroReveal className="max-w-7xl mx-auto space-y-12 relative z-10">
          {/* Dynamic Breadcrumb + Share */}
          <div
            data-hero-item
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#292929]"
          >
            <DetailBreadcrumbs
              items={[
                { label: "Trang chủ", href: "/" },
                { label: "Phòng LAB", href: "/lab" },
                ...(prod.category
                  ? [
                      {
                        label: prod.category.name,
                        href: `/lab?stage=${prod.productStage}`,
                      },
                    ]
                  : []),
                { label: prod.name },
              ]}
            />
            <ShareCopyButton title={prod.name} />
          </div>

          {/* Product Identity & Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8 space-y-6">
              <div data-hero-item className="flex flex-wrap items-center gap-3">
                {/* Product Logo Badge */}
                <div className="w-11 h-11 rounded-2xl bg-[#171717] border border-[#292929] flex items-center justify-center text-[#FF2D95] font-mono font-black text-base">
                  {prod.name.charAt(0)}
                </div>

                <span className="px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-widest uppercase bg-[#121212] border border-[#292929] text-white">
                  {prod.category?.name || "NGUYÊN LAB"}
                </span>

                {/* Stage Pill: Idea | Developing | Beta | Live */}
                <span
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase flex items-center gap-2 border ${
                    stageDisplay === "Live"
                      ? "bg-[#007BA7]/15 text-[#007BA7] border-[#007BA7]/40"
                      : stageDisplay === "Beta"
                      ? "bg-[#FF2D95]/15 text-[#FF2D95] border-[#FF2D95]/40"
                      : "bg-[#171717] text-[#A1A1AA] border-[#292929]"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      stageDisplay === "Live"
                        ? "bg-[#007BA7] animate-pulse"
                        : stageDisplay === "Beta"
                        ? "bg-[#FF2D95]"
                        : "bg-[#A1A1AA]"
                    }`}
                  />
                  <span>STATUS: {stageDisplay}</span>
                </span>

                <span className="px-3 py-1.5 rounded-full text-xs font-mono bg-[#121212] border border-[#292929] text-[#A1A1AA]">
                  {prod.version}
                </span>
              </div>

              <h1
                data-hero-item
                className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.04] text-white"
              >
                {prod.name}
              </h1>

              {prod.tagline && (
                <p
                  data-hero-item
                  className="text-base md:text-xl font-mono uppercase tracking-wider text-[#007BA7]"
                >
                  {prod.tagline}
                </p>
              )}

              <p
                data-hero-item
                className="text-base md:text-lg text-[#A1A1AA] leading-relaxed max-w-3xl"
              >
                {prod.shortDesc}
              </p>

              {/* Strictly conditional Try Product / View Demo buttons */}
              <div
                data-hero-item
                className="pt-2 flex flex-wrap items-center gap-4"
              >
                {hasTryUrl && (
                  <a
                    href={(prod.websiteUrl || prod.demoUrl)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-mono text-xs font-bold uppercase tracking-[0.16em] hover:shadow-glow-pink transition-all flex items-center gap-2.5"
                  >
                    <span>{prod.ctaText || "Try Product"}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {hasDemoUrl && (
                  <a
                    href={prod.demoUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-full bg-[#121212] border border-[#292929] hover:border-[#007BA7] text-white font-mono text-xs font-bold uppercase tracking-[0.16em] transition-all flex items-center gap-2"
                  >
                    <span>View Demo</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}

                <Link
                  href={`/contact?service=${encodeURIComponent(
                    `Tích hợp ${prod.name}`
                  )}`}
                  className="px-8 py-4 rounded-full bg-[#171717] border border-[#292929] hover:border-white text-[#A1A1AA] hover:text-white font-mono text-xs font-bold uppercase tracking-[0.16em] transition-all"
                >
                  <span>Enterprise Licensing</span>
                </Link>
              </div>
            </div>

            {/* Product Telemetry Card */}
            <div
              data-hero-item
              className="lg:col-span-4 p-7 rounded-3xl bg-[#121212] border border-[#292929] space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#292929]">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#A1A1AA]">
                  PRODUCT TELEMETRY
                </span>
                <FlaskConical className="w-4 h-4 text-[#FF2D95]" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-[#A1A1AA] uppercase block mb-1">
                    RELEASE STAGE
                  </span>
                  <strong className="text-white font-mono">{stageDisplay}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#A1A1AA] uppercase block mb-1">
                    VERSION
                  </span>
                  <strong className="text-[#007BA7] font-mono">
                    {prod.version}
                  </strong>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] font-mono text-[#A1A1AA] uppercase block mb-1">
                    PRICING / LICENSING MODEL
                  </span>
                  <strong className="text-white font-mono">
                    {prod.pricingModel}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Large SaaS Product Preview Window */}
          <div
            data-hero-visual
            className="rounded-3xl overflow-hidden border border-[#292929] bg-[#121212] shadow-2xl"
          >
            <div className="h-10 px-5 bg-[#171717] border-b border-[#292929] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#292929]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#292929]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#007BA7]" />
              </div>
              <span className="text-[11px] font-mono text-[#A1A1AA]">
                {prod.name} • {prod.version} ({stageDisplay})
              </span>
              <span className="text-[10px] font-mono text-[#FF2D95]">
                NGUYÊN LAB ENGINE
              </span>
            </div>
            <div className="relative aspect-[16/9] w-full bg-[#0A0A0A]">
              <Image
                src={prod.thumbnail}
                alt={prod.name}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        </DetailHeroReveal>
      </section>

      {/* =================================================================
          2. PRODUCT OVERVIEW
      ================================================================= */}
      <section className="py-20 md:py-28 px-6 border-b border-[#292929]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <RevealOnScroll className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#007BA7] block">
              01 // PRODUCT OVERVIEW
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight">
              GIẢI QUYẾT BÀI TOÁN VẬN HÀNH & SÁNG TẠO BẰNG CÔNG NGHỆ LÕI.
            </h2>
          </RevealOnScroll>

          <RevealOnScroll
            delay={0.1}
            className="lg:col-span-7 p-8 md:p-10 rounded-3xl bg-[#121212] border border-[#292929] space-y-6"
          >
            <p className="text-base md:text-lg text-white leading-relaxed whitespace-pre-line">
              {prod.description}
            </p>
            <div className="pt-4 border-t border-[#292929] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-[#A1A1AA]">
              <div>
                <span className="text-[#007BA7] block font-bold">CLOUD-NATIVE</span>
                Kiến trúc đám mây phản hồi tức thì
              </div>
              <div>
                <span className="text-[#FF2D95] block font-bold">API-FIRST</span>
                Dễ dàng nhúng vào hệ sinh thái sẵn có
              </div>
              <div>
                <span className="text-white block font-bold">ENTERPRISE READY</span>
                Bảo mật dữ liệu và phân quyền đa tầng
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* =================================================================
          3. FEATURES BENTO GRID
      ================================================================= */}
      {features.length > 0 && (
        <section className="py-20 md:py-28 px-6 border-b border-[#292929]">
          <div className="max-w-7xl mx-auto space-y-12">
            <RevealOnScroll className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#FF2D95] mb-2 block">
                  02 // CORE CAPABILITIES
                </span>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                  TÍNH NĂNG CÔNG NGHỆ NỔI BẬT.
                </h2>
              </div>
              <span className="text-xs font-mono text-[#A1A1AA]">
                PROPRIETARY R&D MODULES
              </span>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {features.map((feat, idx) => {
                const colSpan =
                  features.length === 4
                    ? idx === 0 || idx === 3
                      ? "md:col-span-7"
                      : "md:col-span-5"
                    : "md:col-span-6";

                return (
                  <RevealOnScroll
                    key={idx}
                    delay={idx * 0.08}
                    className={`${colSpan} p-8 rounded-3xl bg-[#121212] hover:bg-[#171717] border border-[#292929] hover:border-[#FF2D95] transition-all flex flex-col justify-between space-y-6 group`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-[#171717] border border-[#292929] group-hover:border-[#FF2D95] flex items-center justify-center text-[#FF2D95]">
                        <Terminal className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono text-[#A1A1AA]">
                        MODULE // 0{idx + 1}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white leading-snug">
                        {feat}
                      </h3>
                      <p className="text-sm text-[#A1A1AA] leading-relaxed">
                        Được tối ưu hóa bởi đội ngũ kỹ sư NGUYÊN LAB nhằm mang lại tốc độ xử lý vượt trội và độ ổn định cao trong môi trường sản xuất.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#292929] text-[11px] font-mono text-[#007BA7] uppercase">
                      ACTIVE IN {prod.version}
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =================================================================
          4. INTERFACE PREVIEW (DESKTOP / MOBILE / VIDEO / GALLERY)
      ================================================================= */}
      <section className="py-20 md:py-28 px-6 border-b border-[#292929]">
        <div className="max-w-7xl mx-auto space-y-12">
          <RevealOnScroll>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#007BA7] mb-2 block">
              03 // INTERFACE PREVIEW
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              GIAO DIỆN & TRẢI NGHIỆM TƯƠNG TÁC.
            </h2>
          </RevealOnScroll>

          <InteractiveGallery
            images={displayGallery}
            title={prod.name}
            accentColor="#FF2D95"
            enableDevicePreview={true}
            videoUrl={prod.videoUrl}
          />
        </div>
      </section>

      {/* =================================================================
          5. HOW IT WORKS & TECHNOLOGY STACK
      ================================================================= */}
      <section className="py-20 md:py-28 px-6 border-b border-[#292929] bg-[#121212]/40">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* How It Works */}
          <div className="space-y-12">
            <RevealOnScroll className="max-w-2xl space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#007BA7] block">
                04 // HOW IT WORKS
              </span>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                QUY TRÌNH VẬN HÀNH SẢN PHẨM.
              </h2>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {howItWorksSteps.map((st, idx) => (
                <RevealOnScroll
                  key={st.step}
                  delay={idx * 0.1}
                  className="p-8 rounded-3xl bg-[#121212] border border-[#292929] space-y-4"
                >
                  <span className="text-3xl font-black font-mono text-[#007BA7] block">
                    {st.step}
                  </span>
                  <h3 className="text-lg font-bold text-white">{st.title}</h3>
                  <p className="text-sm text-[#A1A1AA] leading-relaxed">
                    {st.desc}
                  </p>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          {/* Technology Stack */}
          {techStack.length > 0 && (
            <RevealOnScroll className="p-8 md:p-12 rounded-3xl bg-[#121212] border border-[#292929] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#FF2D95] block mb-1">
                    05 // UNDERLYING TECHNOLOGY
                  </span>
                  <h3 className="text-2xl font-black uppercase text-white">
                    Kiến Trúc Công Nghệ Thực Tế
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#A1A1AA]">
                  VERIFIED STACK
                </span>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {techStack.map((tech, idx) => (
                  <div
                    key={idx}
                    className="px-5 py-3 rounded-2xl bg-[#171717] border border-[#292929] text-xs font-mono text-white flex items-center gap-2.5"
                  >
                    <Cpu className="w-4 h-4 text-[#007BA7]" />
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          )}
        </div>
      </section>

      {/* =================================================================
          6. PRODUCT ROADMAP
      ================================================================= */}
      <section className="py-20 md:py-28 px-6 border-b border-[#292929]">
        <div className="max-w-7xl mx-auto space-y-12">
          <RevealOnScroll>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#007BA7] mb-2 block">
              06 // PRODUCT ROADMAP
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
              LỘ TRÌNH PHÁT TRIỂN SẢN PHẨM.
            </h2>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {roadmapStages.map((rm, idx) => (
              <RevealOnScroll
                key={rm.phase}
                delay={idx * 0.08}
                className={`p-7 rounded-3xl border flex flex-col justify-between space-y-6 ${
                  rm.status === "CURRENT"
                    ? "bg-[#171717] border-[#FF2D95]"
                    : "bg-[#121212] border-[#292929]"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#A1A1AA]">
                      {rm.phase}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase ${
                        rm.status === "CURRENT"
                          ? "bg-[#FF2D95]/20 text-[#FF2D95] font-bold"
                          : rm.status === "COMPLETED"
                          ? "bg-[#007BA7]/20 text-[#007BA7]"
                          : "bg-[#171717] text-[#A1A1AA]"
                      }`}
                    >
                      {rm.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{rm.stage}</h3>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">
                    {rm.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#292929] flex items-center gap-2 text-[11px] font-mono text-[#A1A1AA]">
                  <GitBranch className="w-3.5 h-3.5 text-[#007BA7]" />
                  <span>{prod.version}</span>
                </div>
              </RevealOnScroll>
            ))}
          </div>
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
                07 // PRODUCT FAQ
              </span>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                CÂU HỎI THƯỜNG GẶP VỀ {prod.name}.
              </h2>
            </RevealOnScroll>

            <RevealOnScroll>
              <DetailAccordionFAQ items={faqs} accentColor="#FF2D95" />
            </RevealOnScroll>
          </div>
        </section>
      )}

      {/* =================================================================
          8. RELATED CONTENT ENGINE (RELATED PRODUCTS & ARTICLES)
      ================================================================= */}
      {(relatedProducts.length > 0 || relatedPosts.length > 0) && (
        <section className="py-20 md:py-28 px-6 border-b border-[#292929]">
          <div className="max-w-7xl mx-auto space-y-20">
            {/* Related LAB Products */}
            {relatedProducts.length > 0 && (
              <div className="space-y-10">
                <RevealOnScroll className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#FF2D95] mb-2 block">
                      RELATED LAB PRODUCTS
                    </span>
                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
                      CÁC SẢN PHẨM KHÁC TRONG DIGITAL LAB
                    </h2>
                  </div>
                  <Link
                    href="/lab"
                    className="text-xs font-mono text-[#A1A1AA] hover:text-white inline-flex items-center gap-1.5"
                  >
                    <span>Tất cả sản phẩm</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </RevealOnScroll>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {relatedProducts.map((rel, idx) => (
                    <RevealOnScroll key={rel.id} delay={idx * 0.1}>
                      <Link
                        href={`/lab/${rel.slug}`}
                        className="group rounded-3xl bg-[#121212] border border-[#292929] hover:border-[#FF2D95] overflow-hidden flex flex-col justify-between transition-all"
                      >
                        <div className="relative aspect-[16/9] w-full bg-[#171717] overflow-hidden">
                          <Image
                            src={rel.thumbnail}
                            alt={rel.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-7 space-y-3">
                          <div className="flex items-center justify-between text-[11px] font-mono text-[#A1A1AA]">
                            <span className="text-[#007BA7] uppercase">
                              {rel.category?.name} • {rel.version}
                            </span>
                            <span>{formatStageLabel(rel.productStage)}</span>
                          </div>
                          <h3 className="text-xl font-bold text-white group-hover:text-[#FF2D95] transition-colors">
                            {rel.name}
                          </h3>
                          <p className="text-xs text-[#A1A1AA] line-clamp-2">
                            {rel.shortDesc}
                          </p>
                        </div>
                      </Link>
                    </RevealOnScroll>
                  ))}
                </div>
              </div>
            )}

            {/* Related Blog Articles */}
            {relatedPosts.length > 0 && (
              <div className="space-y-8">
                <RevealOnScroll>
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#007BA7] mb-2 block">
                    R&D INSIGHTS
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                    BÀI VIẾT NGHIÊN CỨU LIÊN QUAN
                  </h2>
                </RevealOnScroll>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedPosts.map((post, idx) => (
                    <RevealOnScroll key={post.id} delay={idx * 0.1}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="p-7 rounded-3xl bg-[#121212] hover:bg-[#171717] border border-[#292929] hover:border-[#007BA7] transition-all flex flex-col justify-between h-full space-y-4 group"
                      >
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono uppercase text-[#007BA7]">
                            {post.category?.name || "Insights"} • {post.readTime}
                          </span>
                          <h3 className="text-lg font-bold text-white group-hover:text-[#007BA7] transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-xs text-[#A1A1AA] line-clamp-2">
                            {post.excerpt}
                          </p>
                        </div>
                        <div className="pt-3 border-t border-[#292929] flex items-center justify-between text-xs font-mono text-white">
                          <span>Đọc bài nghiên cứu</span>
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
          9. FINAL CTA: "EXPLORE OUR DIGITAL PRODUCTS."
      ================================================================= */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll className="rounded-3xl bg-[#121212] border border-[#292929] p-10 md:p-16 lg:p-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <div className="max-w-2xl space-y-4">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#007BA7] block">
                NGUYÊN DIGITAL LAB
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none text-white">
                EXPLORE OUR{" "}
                <span className="text-gradient-brand">DIGITAL PRODUCTS.</span>
              </h2>
              <p className="text-base text-[#A1A1AA] leading-relaxed">
                Khám phá thêm các công cụ AI, nền tảng SaaS tự động hóa hoặc hợp tác R&D riêng biệt cùng đội ngũ kỹ sư NGUYÊN LAB.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto shrink-0">
              <Link
                href="/lab"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-mono text-xs font-bold uppercase tracking-[0.18em] hover:shadow-glow-pink transition-all flex items-center justify-center gap-2"
              >
                <span>All LAB Products</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 rounded-full bg-[#171717] border border-[#292929] hover:border-white text-white font-mono text-xs font-bold uppercase tracking-[0.18em] transition-all flex items-center justify-center"
              >
                <span>Custom R&D Inquiry</span>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
