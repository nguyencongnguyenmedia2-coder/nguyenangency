import React from "react";
import prisma from "@/lib/prisma";
import ContractManagerClient from "@/components/admin/ContractManagerClient";

export const metadata = {
  title: "Hợp Đồng – NGUYÊN CRM",
};

export default async function AdminContractsPage() {
  const [contracts, customers] = await Promise.all([
    prisma.contract.findMany({
      include: {
        customer: true,
        project: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.customer.findMany({
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          QUẢN TRỊ HỢP ĐỒNG KINH TẾ (CONTRACTS)
        </h1>
        <p className="text-xs text-[#A1A1AA] mt-1">
          CRUD toàn diện: Tạo hợp đồng kinh tế mới, cấu hình giá trị, điều khoản và cập nhật tình trạng pháp lý.
        </p>
      </div>

      <ContractManagerClient initialContracts={contracts} customers={customers} />
    </div>
  );
}
