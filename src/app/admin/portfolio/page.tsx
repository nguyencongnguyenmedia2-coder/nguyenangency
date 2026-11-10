import React from "react";
import prisma from "@/lib/prisma";
import PortfolioManagerClient from "@/components/admin/PortfolioManagerClient";

export const metadata = {
  title: "Quản Trị Portfolio – NGUYÊN CRM",
};

export default async function AdminPortfolioPage() {
  let portfolios: any[] = [];
  let categories: any[] = [];

  try {
    const results = await Promise.all([
      prisma.portfolio.findMany({
        include: { category: true },
        orderBy: { order: "asc" },
      }),
      prisma.portfolioCategory.findMany(),
    ]);
    portfolios = results[0] || [];
    categories = results[1] || [];
  } catch (err) {
    console.warn("[AdminPortfolioPage] DB fetch fallback active:", err);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          QUẢN TRỊ DỰ ÁN & CASE STUDIES
        </h1>
        <p className="text-xs text-[#A1A1AA] mt-1">
          CRUD toàn diện: Thêm dự án, chỉnh sửa nội dung case study, cập nhật link demo và xóa/ẩn dự án khỏi website.
        </p>
      </div>

      <PortfolioManagerClient initialPortfolios={portfolios} categories={categories} />
    </div>
  );
}
