import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock, Calendar, Sparkles } from "lucide-react";
import prisma from "@/lib/prisma";
import { formatDateVN } from "@/lib/utils";

export const metadata = {
  title: "Blog & Insights – NGUYÊN AGENCY",
  description: "Góc nhìn chuyên sâu về nghệ thuật thị giác, thiết kế 3D WebGL và kiến trúc hệ thống hiện đại.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
    },
    include: {
      category: true,
      author: true,
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="pt-32 pb-24 px-6 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#007BA7] mb-3 block">
            KNOWLEDGE & RESEARCH
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-6">
            INSIGHTS & <span className="text-gradient-brand">PERSPECTIVES.</span>
          </h1>
          <p className="text-base text-[#A1A1AA] leading-relaxed">
            Những chia sẻ thực chiến về thiết kế tương tác, tối ưu hóa Three.js, kiến trúc Next.js và ứng dụng AI trong môi trường sản xuất thực tế.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="py-24 text-center text-[#71717A] text-sm">
            Hiện chưa có bài viết mới được xuất bản. Vui lòng quay lại sau!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group rounded-3xl bg-[#121212] border border-[#292929] hover:border-[#007BA7]/60 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#171717]">
                  <Image
                    src={post.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-mono tracking-widest uppercase bg-[#0A0A0A]/90 px-3 py-1 rounded-full text-white border border-[#292929]">
                      {post.category?.name || "Insights"}
                    </span>
                  </div>
                </div>

                <div className="p-7 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-xs font-mono text-[#71717A] mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {post.publishedAt ? formatDateVN(post.publishedAt) : "--"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#007BA7] transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#A1A1AA] line-clamp-3 leading-relaxed mb-6">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#292929] flex items-center justify-between">
                    <span className="text-xs font-mono text-[#71717A]">
                      {post.authorName || post.author?.name || "NGUYÊN Editorial"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-[#FF2D95] group-hover:translate-x-1 transition-transform">
                      <span>Đọc tiếp</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
