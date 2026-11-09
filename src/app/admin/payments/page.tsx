import React from "react";
import prisma from "@/lib/prisma";
import PaymentManagerClient from "@/components/admin/PaymentManagerClient";

export const metadata = {
  title: "Lịch Sử Thanh Toán – NGUYÊN CRM",
};

export default async function AdminPaymentsPage() {
  const [payments, invoices] = await Promise.all([
    prisma.payment.findMany({
      include: {
        invoice: {
          include: { customer: true },
        },
      },
      orderBy: { paidAt: "desc" },
    }),
    prisma.invoice.findMany({
      select: {
        id: true,
        code: true,
        title: true,
        totalAmount: true,
        status: true,
        customer: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          LỊCH SỬ THANH TOÁN (PAYMENT TRANSACTIONS)
        </h1>
        <p className="text-xs text-[#A1A1AA] mt-1">
          Ghi nhận các giao dịch tài chính thực tế đã vào tài khoản ngân hàng của NGUYÊN AGENCY.
        </p>
      </div>

      <PaymentManagerClient initialPayments={payments} invoices={invoices} />
    </div>
  );
}
