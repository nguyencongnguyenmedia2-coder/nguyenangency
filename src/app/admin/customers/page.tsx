import React from "react";
import prisma from "@/lib/prisma";
import CustomerManagerClient from "@/components/admin/CustomerManagerClient";

export const metadata = {
  title: "Quản Lý Khách Hàng – NGUYÊN CRM",
};

export default async function AdminCustomersPage() {
  const customers = await prisma.customer.findMany({
    include: {
      projects: true,
      contracts: true,
      invoices: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          QUẢN TRỊ KHÁCH HÀNG DOANH NGHIỆP
        </h1>
        <p className="text-xs text-[#A1A1AA] mt-1">
          Hệ thống CRUD toàn diện: Thêm mới, tra cứu, chỉnh sửa hồ sơ và kiểm soát ràng buộc dữ liệu.
        </p>
      </div>

      <CustomerManagerClient initialCustomers={customers} />
    </div>
  );
}
