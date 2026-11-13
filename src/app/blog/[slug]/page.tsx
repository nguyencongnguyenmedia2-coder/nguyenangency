import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  Clock,
  Eye,
  Tag,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { formatDateVN } from "@/lib/utils";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import {
  DetailBreadcrumbs,
  DetailHeroReveal,
  ReadingProgressBar,
  ShareCopyButton,
  extractBlogHeadings,
  BlogTableOfContents,
  RichArticleRenderer,
} from "@/components/common/DetailInteractiveTools";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await params;
  let post: any = null;
  try {
    post = await prisma.blogPost.findUnique({
      where: { slug: resolvedParams.slug },
      include: { category: true, author: true },
    });
  } catch {
    post = null;
  }

  if (!post || post.deletedAt !== null) {
    return { title: "Bài viết không tìm thấy – NGUYÊN AGENCY" };
  }

  const title = `${post.metaTitle || post.title} – NGUYÊN AGENCY Editorial`;
  const description = post.metaDescription || post.excerpt;
  const canonicalUrl =
    post.canonicalUrl || `https://nguyenagency.online/blog/${post.slug}`;
  const ogImage = post.ogImage || post.thumbnail;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description,
      url: canonicalUrl,
      siteName: "NGUYÊN AGENCY",
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.authorName || post.author?.name || "NGUYÊN Editorial"],
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostDetailPage({
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

  let post: any = null;
  try {
    post = await prisma.blogPost.findUnique({
      where: { slug: resolvedParams.slug },
      include: {
        category: true,
        author: true,
      },
    });
  } catch (err) {
    console.warn("[BlogPostDetailPage] DB fetch fallback active:", err);
  }

  if (
    !post ||
    post.deletedAt !== null ||
    (!isPreview && post.status !== "PUBLISHED")
  ) {
    notFound();
  }

  // Increment view counter in background
  try {
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });
  } catch {
    // silent catch
  }

  let tags: string[] = [];
  try {
    tags = JSON.parse(post.tagsJson || "[]");
  } catch {
    tags = [];
  }

  // Related Content Engine: Related Posts + Next Post + Related Services
  const [relatedPosts, relatedServices] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        id: { not: post.id },
        status: "PUBLISHED",
      },
      include: { category: true },
      orderBy: [{ categoryId: "asc" }, { publishedAt: "desc" }],
      take: 3,
    }),
    prisma.service.findMany({
      where: { status: "PUBLISHED" },
      include: { category: true },
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
      take: 3,
    }),
  ]);

  const nextPost = relatedPosts[0] || null;
  const headings = extractBlogHeadings(post.content);

  // Article JSON-LD Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [post.thumbnail],
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.authorName || post.author?.name || "NGUYÊN Creative Lab",
    },
    publisher: {
      "@type": "Organization",
      name: "NGUYÊN AGENCY",
      url: "https://nguyenagency.online",
    },
  };

  return (
    <article className="bg-[#0A0A0A] text-white min-h-screen">
      <ReadingProgressBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {post.status !== "PUBLISHED" && (
        <div className="bg-[#FF2D95]/20 border-b border-[#FF2D95]/40 text-white px-6 py-2.5 text-center text-xs font-mono mt-20">
          CHẾ ĐỘ XEM TRƯỚC BÀI VIẾT (TRẠNG THÁI: {post.status})
        </div>
      )}

      {/* =================================================================
          1. EDITORIAL ARTICLE HEADER & COVER
      ================================================================= */}
      <header className="relative pt-32 pb-16 md:pt-36 md:pb-24 px-6 border-b border-[#292929] bg-architectural-grid overflow-hidden">
        <div className="absolute top-16 left-1/4 w-[420px] h-[420px] bg-[#007BA7]/12 rounded-full blur-[160px] pointer-events-none" />

        <DetailHeroReveal className="max-w-7xl mx-auto space-y-10 relative z-10">
          {/* Dynamic Breadcrumb + Share */}
          <div
            data-hero-item
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#292929]"
          >
            <DetailBreadcrumbs
              items={[
                { label: "Trang chủ", href: "/" },
                { label: "Bài viết", href: "/blog" },
                ...(post.category
                  ? [{ label: post.category.name, href: "/blog" }]
                  : []),
                { label: post.title },
              ]}
            />
            <ShareCopyButton title={post.title} />
          </div>

          {/* Editorial Title & Metadata */}
          <div className="max-w-4xl space-y-6">
            <div data-hero-item className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-widest uppercase bg-[#007BA7]/15 text-[#007BA7] border border-[#007BA7]/40">
                {post.category?.name || "Insights"}
              </span>
              <span className="text-xs font-mono text-[#A1A1AA] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#007BA7]" />
                <span>
                  {post.publishedAt ? formatDateVN(post.publishedAt) : "--"}
                </span>
              </span>
              <span className="text-xs font-mono text-[#A1A1AA] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#FF2D95]" />
                <span>{post.readTime}</span>
              </span>
              <span className="text-xs font-mono text-[#A1A1AA] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#007BA7]" />
                <span>{(post.views || 0) + 1} lượt đọc</span>
              </span>
            </div>

            <h1
              data-hero-item
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-[1.08]"
            >
              {post.title}
            </h1>

            <p
              data-hero-item
              className="text-base md:text-xl text-[#A1A1AA] leading-relaxed"
            >
              {post.excerpt}
            </p>

            {/* Author Card Bar */}
            <div
              data-hero-item
              className="pt-4 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#171717] border border-[#292929] flex items-center justify-center text-white font-mono text-sm font-bold">
                  {(post.authorName || "N").charAt(0)}
                </div>
                <div>
                  <strong className="text-sm font-bold text-white block">
                    {post.authorName ||
                      post.author?.name ||
                      "NGUYÊN Creative Lab"}
                  </strong>
                  <span className="text-[11px] font-mono text-[#A1A1AA]">
                    {post.author?.title ||
                      "Editorial & Technology Research Team"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cover Visual */}
          {post.thumbnail && (
            <div
              data-hero-visual
              className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-[#292929] bg-[#121212]"
            >
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                priority
                quality={85}
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
              />
            </div>
          )}
        </DetailHeroReveal>
      </header>

      {/* =================================================================
          2. ARTICLE BODY + SIDEBAR TABLE OF CONTENTS
      ================================================================= */}
      <section className="py-16 md:py-24 px-6 border-b border-[#292929]">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Collapsible Table of Contents */}
          <BlogTableOfContents headings={headings} mobileOnly />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Desktop Sticky Table of Contents & Editorial Meta (4 Cols) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6 order-2 lg:order-1">
              <BlogTableOfContents headings={headings} desktopOnly />

              {/* Editorial Author & Share Widget */}
              <div className="p-6 rounded-3xl bg-[#121212] border border-[#292929] space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#FF2D95] block">
                  NGUYÊN EDITORIAL
                </span>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Chuyên trang nghiên cứu kiến trúc phần mềm, đồ họa 3D thời gian thực và chiến lược thương hiệu số từ đội ngũ chuyên gia NGUYÊN AGENCY.
                </p>
                <div className="pt-2">
                  <ShareCopyButton title={post.title} />
                </div>
              </div>
            </aside>

            {/* Central Article Content (8 Cols) */}
            <div className="lg:col-span-8 order-1 lg:order-2 space-y-12">
              <div className="p-8 md:p-12 rounded-3xl bg-[#121212] border border-[#292929]">
                <RichArticleRenderer
                  content={post.content}
                  title={post.title}
                />
              </div>

              {/* Tags & Social Share Footer */}
              <div className="p-6 md:p-8 rounded-3xl bg-[#121212] border border-[#292929] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-[#007BA7] mr-1" />
                  {(tags.length > 0
                    ? tags
                    : [
                        post.category?.name || "Digital Technology",
                        "NGUYÊN AGENCY",
                        "Architecture",
                      ]
                  ).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-[#171717] border border-[#292929] text-xs font-mono text-[#A1A1AA]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <ShareCopyButton title={post.title} />
              </div>

              {/* Next Article Card */}
              {nextPost && (
                <div className="p-8 rounded-3xl bg-[#171717] border border-[#292929] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#007BA7] block">
                      NEXT ARTICLE • BÀI VIẾT TIẾP THEO
                    </span>
                    <Link
                      href={`/blog/${nextPost.slug}`}
                      className="text-xl font-bold text-white hover:text-[#007BA7] transition-colors block"
                    >
                      {nextPost.title}
                    </Link>
                  </div>
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className="px-5 py-3 rounded-full bg-[#121212] border border-[#292929] hover:border-[#007BA7] text-xs font-mono text-white inline-flex items-center gap-2 shrink-0"
                  >
                    <span>Đọc tiếp</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          3. RELATED CONTENT ENGINE (RELATED POSTS & RELATED SERVICES)
      ================================================================= */}
      {(relatedPosts.length > 0 || relatedServices.length > 0) && (
        <section className="py-20 md:py-28 px-6 border-b border-[#292929]">
          <div className="max-w-7xl mx-auto space-y-20">
            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="space-y-10">
                <RevealOnScroll className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#007BA7] mb-2 block">
                      RELATED INSIGHTS
                    </span>
                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
                      BÀI VIẾT LIÊN QUAN
                    </h2>
                  </div>
                  <Link
                    href="/blog"
                    className="text-xs font-mono text-[#A1A1AA] hover:text-white inline-flex items-center gap-1.5"
                  >
                    <span>Xem tất cả bài viết</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </RevealOnScroll>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((rel, idx) => (
                    <RevealOnScroll key={rel.id} delay={idx * 0.08}>
                      <Link
                        href={`/blog/${rel.slug}`}
                        className="group rounded-3xl bg-[#121212] border border-[#292929] hover:border-[#007BA7] overflow-hidden flex flex-col justify-between h-full transition-all"
                      >
                        <div className="relative aspect-[16/9] w-full bg-[#171717] overflow-hidden">
                          <Image
                            src={rel.thumbnail}
                            alt={rel.title}
                            fill
                            loading="lazy"
                            quality={80}
                            sizes="(max-width: 768px) 100vw, 380px"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <span className="text-[10px] font-mono uppercase text-[#007BA7]">
                              {rel.category?.name || "Insights"} •{" "}
                              {rel.readTime}
                            </span>
                            <h3 className="text-base font-bold text-white group-hover:text-[#007BA7] transition-colors line-clamp-2">
                              {rel.title}
                            </h3>
                            <p className="text-xs text-[#A1A1AA] line-clamp-2">
                              {rel.excerpt}
                            </p>
                          </div>
                          <div className="pt-3 border-t border-[#292929] flex items-center justify-between text-xs font-mono text-white">
                            <span>Đọc bài viết</span>
                            <ArrowUpRight className="w-4 h-4 text-[#FF2D95]" />
                          </div>
                        </div>
                      </Link>
                    </RevealOnScroll>
                  ))}
                </div>
              </div>
            )}

            {/* Related Services */}
            {relatedServices.length > 0 && (
              <div className="space-y-8">
                <RevealOnScroll>
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#FF2D95] mb-2 block">
                    EXPLORE OUR SOLUTIONS
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                    GIẢI PHÁP DỊCH VỤ TƯƠNG ỨNG TẠI NGUYÊN AGENCY
                  </h2>
                </RevealOnScroll>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedServices.map((srv, idx) => (
                    <RevealOnScroll key={srv.id} delay={idx * 0.08}>
                      <Link
                        href={`/services/${srv.slug}`}
                        className="p-7 rounded-3xl bg-[#121212] hover:bg-[#171717] border border-[#292929] hover:border-[#007BA7] transition-all flex flex-col justify-between h-full space-y-4 group"
                      >
                        <div className="space-y-2">
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
                        <div className="pt-3 border-t border-[#292929] flex items-center justify-between text-xs font-mono text-white">
                          <span>{srv.priceLabel}</span>
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
          4. FINAL CTA SECTION
      ================================================================= */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll className="rounded-3xl bg-[#121212] border border-[#292929] p-10 md:p-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#007BA7] block">
                NGUYÊN AGENCY CONSULTING
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
                BẮT ĐẦU HIỆN THỰC HÓA DỰ ÁN CỦA BẠN.
              </h2>
              <p className="text-sm md:text-base text-[#A1A1AA] leading-relaxed">
                Liên hệ với đội ngũ chuyên gia công nghệ và sáng tạo tại NGUYÊN AGENCY để nhận tư vấn kiến trúc giải pháp toàn diện.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-mono text-xs font-bold uppercase tracking-[0.18em] hover:shadow-glow-pink transition-all inline-flex items-center gap-2 shrink-0"
            >
              <span>Tư Vấn Dự Án Ngay</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </article>
  );
}
