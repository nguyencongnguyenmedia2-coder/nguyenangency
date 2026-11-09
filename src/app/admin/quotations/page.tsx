import React from "react";
import prisma from "@/lib/prisma";
import QuotationManagerClient from "@/components/admin/QuotationManagerClient";

export const metadata = {
  title: "Quản Lý Báo Giá – NGUYÊN CRM",
};

export default async function AdminQuotationsPage() {
  const quotations = await prisma.quotation.findMany({
    include: {
      customer: true,
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            QUẢN LÝ BÁO GIÁ (QUOTATION SYSTEM)
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Báo giá yêu cầu từ khách hàng, tính toán chi phí, điều khoản và phê duyệt dự án.
          </p>
        </div>
      </div>

      <QuotationManagerClient initialQuotations={quotations} />
    </div>
  );
}
