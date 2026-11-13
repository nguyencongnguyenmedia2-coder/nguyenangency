import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Clock,
  Calendar,
  Sparkles,
  BookOpen,
  ArrowRight,
  Send,
  User,
  Tag,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { formatDateVN } from "@/lib/utils";

export const metadata = {
  title: "Bài Viết & Góc Nhìn Chuyên Gia – NGUYÊN AGENCY",
  description:
    "Góc nhìn chuyên sâu về nghệ thuật thị giác đương đại, tối ưu hóa 3D WebGL, kiến trúc Next.js và ứng dụng AI Agent trong sản xuất phần mềm thực tế.",
  alternates: {
    canonical: "https://nguyenagency.online/blog",
  },
  openGraph: {
    title: "Bài Viết & Góc Nhìn Chuyên Gia – NGUYÊN AGENCY",
    description:
      "Góc nhìn chuyên sâu về nghệ thuật thị giác đương đại, tối ưu hóa 3D WebGL, kiến trúc Next.js và ứng dụng AI Agent trong sản xuất phần mềm thực tế.",
    url: "https://nguyenagency.online/blog",
    siteName: "NGUYÊN AGENCY",
    type: "website",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Bài Viết & Góc Nhìn Chuyên Gia – NGUYÊN AGENCY",
    description:
      "Góc nhìn chuyên sâu về nghệ thuật thị giác đương đại, tối ưu hóa 3D WebGL, kiến trúc Next.js và ứng dụng AI Agent trong sản xuất phần mềm thực tế.",
  },
};

export const revalidate = 60;

interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  category?: { name: string; slug: string } | null;
  authorName?: string | null;
  publishedAt?: string | Date | null;
  readTime: string;
}

const FALLBACK_POSTS: BlogPostItem[] = [
  {
    id: "post-1",
    slug: "toi-uu-hoa-threejs-webgl-60fps-tren-mobile",
    title: "Nghệ Thuật Tối Ưu Hóa Three.js & WebGL Đạt Chuẩn 60 FPS Mượt Mà Trên Mọi Thiết Bị Di Động",
    excerpt: "Phân tích chi tiết kỹ thuật nén mô hình 3D bằng DRACO & KTX2, kỹ thuật Draw Call Batching và xử lý Shader GLSL giúp website 3D tải dưới 1.5 giây mà không làm nóng thiết bị.",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    category: { name: "3D & WebGL Engineering", slug: "3d-webgl" },
    authorName: "Nguyễn Công Nguyên",
    publishedAt: "2026-03-10",
    readTime: "7 phút đọc",
  },
  {
    id: "post-2",
    slug: "kien-truc-multi-agent-ai-rag-trong-doanh-nghiep",
    title: "Kiến Trúc Multi-Agent AI & Vector RAG: Cách Chúng Tôi Xây Dựng Hệ Thống CSKH Phản Hồi Dưới 1 Giây",
    excerpt: "Khám phá cách phối hợp giữa LangChain, mô hình Gemini Flash và Qdrant Vector DB để vận hành hệ thống trợ lý ảo thông minh cho doanh nghiệp với tỷ lệ phản hồi chính xác 99.2%.",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80",
    category: { name: "AI & Automation", slug: "ai" },
    authorName: "Đội Ngũ NGUYÊN LAB",
    publishedAt: "2026-03-05",
    readTime: "9 phút đọc",
  },
  {
    id: "post-3",
    slug: "nextjs-15-app-router-server-actions-production",
    title: "Next.js 15 App Router & Server Actions: Đúc Kết Sau Khi Triển Khai 40+ Dự Án Production",
    excerpt: "Những cạm bẫy thường gặp khi xử lý Cache Tag, Connection Pooler PostgreSQL và bí quyết cấu trúc mã nguồn để đạt điểm số Google Lighthouse 100/100 tuyệt đối.",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    category: { name: "System Architecture", slug: "architecture" },
    authorName: "Kỹ Sư Trưởng NGUYÊN AGENCY",
    publishedAt: "2026-02-28",
    readTime: "6 phút đọc",
  },
  {
    id: "post-4",
    slug: "dinh-vi-thuong-hieu-cao-cap-luxury-dark-tech",
    title: "Triết Lý Thiết Kế Luxury Dark Tech: Khi Công Nghệ Giao Thoa Cùng Sự Xa Xỉ",
    excerpt: "Tại sao các tập đoàn hàng đầu thế giới đang chuyển dịch mạnh mẽ sang giao diện tối mờ ảo (Dark Tech), tính tương phản vi mô và micro-interactions tinh xảo.",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    category: { name: "Brand & Creative", slug: "branding" },
    authorName: "Creative Director",
    publishedAt: "2026-02-20",
    readTime: "5 phút đọc",
  },
  {
    id: "post-5",
    slug: "bao-mat-ung-dung-web-owasp-top-10-thuc-te",
    title: "Phòng Vệ Chiều Sâu Cho Web Application: Triển Khai Thực Chiến OWASP Top 10",
    excerpt: "Chiến lược bảo mật đa lớp: CSRF Protection, Rate Limiting với Upstash Redis, Content Security Policy (CSP) chặt chẽ và phòng chống tấn công DDoS hiệu quả.",
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    category: { name: "Cyber Security", slug: "security" },
    authorName: "Đội Kỹ Thuật Bảo Mật",
    publishedAt: "2026-02-14",
    readTime: "8 phút đọc",
  },
  {
    id: "post-6",
    slug: "chuyen-doi-so-doanh-nghiep-voi-telegram-bot-ops",
    title: "Vận Hành Doanh Nghiệp Tự Động Hóa 100% Qua Telegram Bot: Case Study Thực Tế",
    excerpt: "Cách NGUYÊN AGENCY kết nối toàn bộ luồng Booking, Báo Giá, Quản Trị Khách Hàng CRM và Giám Sát Máy Chủ trực tiếp thông qua một Bot Telegram duy nhất.",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    category: { name: "Workflow Automation", slug: "automation" },
    authorName: "Nguyễn Công Nguyên",
    publishedAt: "2026-02-01",
    readTime: "6 phút đọc",
  },
];

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }> | { category?: string };
}) {
  const resolvedParams = searchParams ? await Promise.resolve(searchParams) : {};
  const activeCategory = resolvedParams?.category || "ALL";

  let dbPosts: any[] = [];
  let dbCategories: any[] = [];

  try {
    const results = await Promise.all([
      prisma.blogPost.findMany({
        where: {
          status: "PUBLISHED",
          deletedAt: null,
          ...(activeCategory !== "ALL"
            ? { category: { slug: activeCategory } }
            : {}),
        },
        include: {
          category: true,
          author: true,
        },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      }),
      prisma.blogCategory.findMany({
        orderBy: { createdAt: "asc" },
      }),
    ]);
    dbPosts = results[0] || [];
    dbCategories = results[1] || [];
  } catch (err) {
    console.warn("[BlogPage] DB fetch fallback active:", err);
  }

  const categories =
    dbCategories.length > 0
      ? dbCategories
      : [
          { id: "c1", name: "3D & WebGL Engineering", slug: "3d-webgl" },
          { id: "c2", name: "AI & Automation", slug: "ai" },
          { id: "c3", name: "System Architecture", slug: "architecture" },
          { id: "c4", name: "Brand & Creative", slug: "branding" },
        ];

  let posts = dbPosts.length > 0 ? dbPosts : FALLBACK_POSTS;
  if (activeCategory !== "ALL") {
    posts = posts.filter((p) => p.category?.slug === activeCategory);
    if (posts.length === 0) {
      posts = FALLBACK_POSTS.filter((p) => p.category?.slug === activeCategory);
    }
  }

  const featuredPost = posts[0] || FALLBACK_POSTS[0];
  const regularPosts = posts.slice(1);

  return (
    <div className="pt-32 pb-24 px-6 bg-[#06070B] text-white relative min-h-screen">
      {/* Background Gradients */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-r from-[#00E5FF]/10 via-[#FF2D95]/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* Header */}
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md">
            <BookOpen className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="text-[11px] font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              KNOWLEDGE BASE • ENGINEERING & DESIGN INSIGHTS
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[1.08]">
            BÀI VIẾT & <br />
            <span className="bg-gradient-to-r from-[#00E5FF] via-[#FF2D95] to-[#A855F7] bg-clip-text text-transparent">
              GÓC NHÌN CHUYÊN GIA.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            Những chia sẻ thực chiến từ đội ngũ sáng lập và kỹ sư tại NGUYÊN AGENCY về thiết kế tương tác 3D WebGL, tối ưu kiến trúc Next.js và ứng dụng AI Agent trong sản xuất thực tế.
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-white/[0.08] no-scrollbar">
          <Link
            href="/blog"
            className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all whitespace-nowrap ${
              activeCategory === "ALL"
                ? "bg-white text-black font-black shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                : "bg-white/[0.03] text-[#94A3B8] hover:text-white hover:bg-white/[0.06] border border-white/[0.08]"
            }`}
          >
            TẤT CẢ CHỦ ĐỀ
          </Link>
          {categories.map((cat: any) => (
            <Link
              key={cat.id || cat.slug}
              href={`/blog?category=${cat.slug}`}
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

        {/* Featured Big Article Spotlight */}
        {featuredPost && (
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group block rounded-3xl bg-[#0D0F17]/90 border border-white/[0.1] hover:border-white/[0.25] overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 relative aspect-[16/9] lg:aspect-auto min-h-[300px] overflow-hidden bg-black/60">
                <Image
                  src={featuredPost.thumbnail}
                  alt={featuredPost.title}
                  fill
                  priority
                  quality={85}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0D0F17] via-transparent to-transparent opacity-90" />
                <div className="absolute top-6 left-6">
                  <span className="px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-widest uppercase bg-gradient-to-r from-[#00E5FF] to-[#FF2D95] text-black font-black shadow-lg">
                    FEATURED INSIGHT
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-xs font-mono text-white/50">
                    <span className="text-[#00E5FF] font-bold">
                      {featuredPost.category?.name || "Deep Tech"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-[#00E5FF] transition-colors leading-snug">
                    {featuredPost.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed line-clamp-4">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#00E5FF] to-[#FF2D95] p-0.5">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold text-white">
                        NA
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {featuredPost.authorName || "Nguyễn Công Nguyên"}
                      </div>
                      <div className="text-[10px] font-mono text-white/40">
                        {featuredPost.publishedAt ? formatDateVN(featuredPost.publishedAt) : "2026"}
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#FF2D95] group-hover:translate-x-1 transition-transform">
                    <span>Đọc Toàn Bài</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Articles Grid */}
        {regularPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] hover:border-white/[0.2] overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/60">
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    loading="lazy"
                    quality={80}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F17] via-transparent to-transparent opacity-80" />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-mono tracking-widest uppercase bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-white border border-white/[0.1]">
                      {post.category?.name || "Articles"}
                    </span>
                  </div>
                </div>

                <div className="p-7 flex flex-col flex-1 justify-between space-y-6">
                  <div>
                    <div className="flex items-center gap-3 text-xs font-mono text-white/40 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.publishedAt ? formatDateVN(post.publishedAt) : "--"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#00E5FF] transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-[#94A3B8] line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                    <span className="text-white/50">{post.authorName || "NGUYÊN Agency"}</span>
                    <span className="inline-flex items-center gap-1 text-[#FF2D95] font-bold group-hover:translate-x-1 transition-transform">
                      <span>Đọc tiếp</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Newsletter & Tech Radar Box */}
        <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-r from-[#00E5FF]/10 via-[#FF2D95]/10 to-purple-600/10 border border-white/[0.12] flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              NGUYÊN TECH RADAR DISPATCH
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white">
              CẬP NHẬT GÓC NHÌN CÔNG NGHỆ MỚI NHẤT.
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8]">
              Nhận bản tin tuyển chọn hàng tháng về kiến trúc phần mềm, bí quyết thiết kế 3D WebGL và tối ưu hóa chuyển đổi số trực tiếp qua Telegram hoặc Email.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <a
              href="https://t.me/nguyenangency_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#FF2D95] text-black font-mono text-xs font-black uppercase tracking-wider hover:shadow-[0_0_25px_rgba(255,45,149,0.5)] transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Tham Gia Kênh Telegram</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
