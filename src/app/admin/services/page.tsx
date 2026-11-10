import React from "react";
import prisma from "@/lib/prisma";
import ServiceManagerClient from "@/components/admin/ServiceManagerClient";

export const metadata = {
  title: "Quản Trị Dịch Vụ CMS – NGUYÊN CRM",
};

export default async function AdminServicesPage() {
  let services: any[] = [];
  let categories: any[] = [];

  try {
    const results = await Promise.all([
      prisma.service.findMany({
        include: { category: true },
        orderBy: { order: "asc" },
      }),
      prisma.serviceCategory.findMany(),
    ]);
    services = results[0] || [];
    categories = results[1] || [];
  } catch (err) {
    console.warn("[AdminServicesPage] DB fetch fallback active:", err);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          QUẢN TRỊ DỊCH VỤ (24 SERVICES CMS)
        </h1>
        <p className="text-xs text-[#A1A1AA] mt-1">
          CRUD toàn diện: Thêm dịch vụ mới, sửa giá, điều chỉnh nội dung hoặc xóa/ẩn dịch vụ trên website công khai.
        </p>
      </div>

      <ServiceManagerClient initialServices={services} categories={categories} />
    </div>
  );
}
