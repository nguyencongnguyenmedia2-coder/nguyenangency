import React from "react";
import prisma from "@/lib/prisma";
import BlogManagerClient from "@/components/admin/BlogManagerClient";

export const metadata = {
  title: "Quản Trị Blog – NGUYÊN CRM",
};

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          QUẢN TRỊ NỘI DUNG (EDITORIAL & BLOG)
        </h1>
        <p className="text-xs text-[#A1A1AA] mt-1">
          CRUD toàn diện: Soạn thảo bài viết, biên tập nội dung, xuất bản trực tiếp lên website và gỡ bài viết an toàn.
        </p>
      </div>

      <BlogManagerClient initialPosts={posts} />
    </div>
  );
}
