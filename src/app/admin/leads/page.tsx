import React from "react";
import prisma from "@/lib/prisma";
import LeadManagerClient from "@/components/admin/LeadManagerClient";

export const metadata = {
  title: "Quản Lý Leads & Pipeline – NGUYÊN CRM",
};

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          PIPELINE LEADS & QUẢN LÝ TIẾP NHẬN
        </h1>
        <p className="text-xs text-[#A1A1AA] mt-1">
          CRUD toàn diện: Thêm Lead thủ công, phân bổ giai đoạn, chuyển đổi và xóa Lead có ghi nhận Audit Log.
        </p>
      </div>

      <LeadManagerClient initialLeads={leads} />
    </div>
  );
}
