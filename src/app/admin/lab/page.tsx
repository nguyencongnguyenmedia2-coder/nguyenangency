import React from "react";
import prisma from "@/lib/prisma";
import LabManagerClient from "@/components/admin/LabManagerClient";

export const metadata = {
  title: "Quản Trị Digital LAB – NGUYÊN CRM",
};

export default async function AdminLabPage() {
  let products: any[] = [];
  try {
    products = await prisma.labProduct.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.warn("[AdminLabPage] DB fetch fallback active:", err);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          QUẢN TRỊ DIGITAL LAB & SẢN PHẨM SỐ
        </h1>
        <p className="text-xs text-[#A1A1AA] mt-1">
          CRUD toàn diện: Thêm sản phẩm AI/SaaS mới, xuất bản trực tiếp lên trang /lab và xóa sản phẩm không còn phát triển.
        </p>
      </div>

      <LabManagerClient initialProducts={products} />
    </div>
  );
}
