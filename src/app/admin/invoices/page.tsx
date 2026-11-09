import React from "react";
import prisma from "@/lib/prisma";
import InvoiceManagerClient from "@/components/admin/InvoiceManagerClient";

export const metadata = {
  title: "Hóa Đơn & Doanh Thu – NGUYÊN CRM",
};

export default async function AdminInvoicesPage() {
  const [invoices, customers] = await Promise.all([
    prisma.invoice.findMany({
      include: {
        customer: true,
        project: true,
        payments: true,
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
          QUẢN LÝ HÓA ĐƠN & TÀI CHÍNH (INVOICES)
        </h1>
        <p className="text-xs text-[#A1A1AA] mt-1">
          CRUD toàn diện: Xuất hóa đơn tài chính, phân biệt doanh thu thực thu/công nợ và ghi nhận thanh toán tức thời.
        </p>
      </div>

      <InvoiceManagerClient initialInvoices={invoices} customers={customers} />
    </div>
  );
}
