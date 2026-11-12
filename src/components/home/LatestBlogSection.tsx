import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Calendar, Clock, BookOpen } from "lucide-react";
import { formatDateVN } from "@/lib/utils";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

interface LatestBlogSectionProps {
  posts: any[];
  sectionData?: any;
}

export default function LatestBlogSection({
  posts,
  sectionData,
}: LatestBlogSectionProps) {
  if (!posts || posts.length === 0) return null;

  const subtitle = sectionData?.subtitle || "08 • GÓC NHÌN & BÀI VIẾT CHUYÊN SÂU";
  const title = sectionData?.title || "BÀI VIẾT & NGHIÊN CỨU MỚI NHẤT.";
  const description =
    sectionData?.description ||
    "Góc nhìn chuyên sâu về kiến trúc phần mềm, đồ họa 3D WebGL thời gian thực, AI ứng dụng và chiến lược thương hiệu số từ đội ngũ chuyên gia NGUYÊN AGENCY.";
  const ctaText = sectionData?.ctaText || "Xem Tất Cả Bài Viết";
  const ctaLink = sectionData?.ctaLink || "/blog";

  return (
    <section className="py-28 px-6 bg-[#0A0A0A] border-b border-[#1F1F23] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#007BA7] block mb-3">
              {subtitle}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              {title}
            </h2>
            {description && (
              <p className="text-sm text-[#A1A1AA] max-w-2xl mt-3 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <Link
            href={ctaLink}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#171717] hover:bg-[#202020] text-white border border-[#292929] hover:border-[#007BA7] text-xs font-mono uppercase tracking-wider transition-all shrink-0"
          >
            <span>{ctaText}</span>
            <ArrowUpRight className="w-4 h-4 text-[#007BA7]" />
          </Link>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, idx) => {
            const cover =
              post.thumbnail ||
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80";

            return (
              <RevealOnScroll key={post.id} delay={idx * 0.08}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group h-full rounded-3xl bg-[#121212] border border-[#292929] hover:border-[#007BA7] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5"
                >
                  <div>
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#171717] border-b border-[#292929]">
                      <Image
                        src={cover}
                        alt={post.title}
                        fill
                        loading="lazy"
                        quality={80}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3.5 left-3.5">
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-[#0A0A0A]/85 backdrop-blur-md text-[#38BDF8] border border-[#007BA7]/40">
                          {post.category?.name || "Chuyên Sâu"}
                        </span>
                      </div>
                    </div>

                    <div className="p-7 space-y-3.5">
                      <div className="flex items-center gap-4 text-[11px] font-mono text-[#71717A]">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#007BA7]" />
                          {post.publishedAt
                            ? formatDateVN(post.publishedAt)
                            : "--"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#FF2D95]" />
                          {post.readTime || "5 phút đọc"}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-[#38BDF8] transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-xs text-[#A1A1AA] leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-7 pb-6 pt-4 border-t border-[#1F1F23] flex items-center justify-between text-xs font-mono">
                    <span className="text-[#71717A] flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#007BA7]" />
                      <span>{post.authorName || "NGUYÊN Editorial"}</span>
                    </span>
                    <span className="text-white group-hover:text-[#007BA7] inline-flex items-center gap-1 font-semibold uppercase tracking-wider">
                      <span>Đọc bài</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
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
