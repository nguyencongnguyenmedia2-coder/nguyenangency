import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Users, Plus, ArrowLeft, Filter, Phone, Mail, Building, Clock } from "lucide-react";

export const metadata = {
  title: "CRM Management – NGUYÊN AGENCY CMS",
};

export default async function AdminCRMPage() {
  const session = await getCurrentUser();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "ADMIN")) {
    redirect("/client/login");
  }

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  const customers = await prisma.customer.findMany({
    include: { projects: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="pt-28 pb-20 px-6 bg-[#0A0A0A] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#71717A] hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard CMS
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">
              CRM & QUẢN LÝ KHÁCH HÀNG
            </h1>
            <p className="text-xs text-[#A1A1AA] mt-1">
              Theo dõi luồng Pipeline Lead, trạng thái chăm sóc và hồ sơ đối tác doanh nghiệp.
            </p>
          </div>
        </div>

        {/* Pipeline Summary Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="p-5 rounded-2xl bg-[#121212] border border-[#292929]">
            <span className="text-[10px] font-mono text-[#71717A] uppercase block mb-1">Tổng Lead Tiếp Nhận</span>
            <span className="text-2xl font-black font-mono text-white">{leads.length}</span>
          </div>
          <div className="p-5 rounded-2xl bg-[#121212] border border-[#292929]">
            <span className="text-[10px] font-mono text-[#71717A] uppercase block mb-1">Khách Hàng Chính Thức</span>
            <span className="text-2xl font-black font-mono text-[#007BA7]">{customers.length}</span>
          </div>
          <div className="p-5 rounded-2xl bg-[#121212] border border-[#292929]">
            <span className="text-[10px] font-mono text-[#71717A] uppercase block mb-1">Khách Hàng VIP</span>
            <span className="text-2xl font-black font-mono text-[#FF2D95]">
              {customers.filter((c) => c.tier === "VIP").length}
            </span>
          </div>
          <div className="p-5 rounded-2xl bg-[#121212] border border-[#292929]">
            <span className="text-[10px] font-mono text-[#71717A] uppercase block mb-1">Tỷ Lệ Chuyển Đổi</span>
            <span className="text-2xl font-black font-mono text-emerald-400">100%</span>
          </div>
        </div>

        {/* Leads Table */}
        <div className="p-8 rounded-3xl bg-[#121212] border border-[#292929] mb-10">
          <h2 className="text-base font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#007BA7]" />
            Pipeline Leads & Cơ Hội Bán Hàng
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#292929] text-[#71717A] font-mono">
                  <th className="py-3 px-4">MÃ LEAD</th>
                  <th className="py-3 px-4">HỌ TÊN</th>
                  <th className="py-3 px-4">LIÊN HỆ</th>
                  <th className="py-3 px-4">CÔNG TY</th>
                  <th className="py-3 px-4">QUAN TÂM</th>
                  <th className="py-3 px-4">NGÂN SÁCH</th>
                  <th className="py-3 px-4">GIAI ĐOẠN</th>
                  <th className="py-3 px-4">ƯU TIÊN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292929]">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-[#171717] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[#007BA7] font-semibold">{l.code}</td>
                    <td className="py-3.5 px-4 font-medium text-white">{l.name}</td>
                    <td className="py-3.5 px-4 text-[#A1A1AA]">{l.email}</td>
                    <td className="py-3.5 px-4 text-[#A1A1AA]">{l.company || "--"}</td>
                    <td className="py-3.5 px-4 text-white">{l.serviceInterest || "--"}</td>
                    <td className="py-3.5 px-4 font-mono text-white">{l.budget || "--"}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#007BA7]/20 text-[#007BA7] border border-[#007BA7]/30">
                        {l.stage}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FF2D95]/20 text-[#FF2D95] border border-[#FF2D95]/30">
                        {l.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Existing Customers Table */}
        <div className="p-8 rounded-3xl bg-[#121212] border border-[#292929]">
          <h2 className="text-base font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#FF2D95]" />
            Danh Sách Khách Hàng Doanh Nghiệp (Customer Database)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#292929] text-[#71717A] font-mono">
                  <th className="py-3 px-4">MÃ KH</th>
                  <th className="py-3 px-4">DOANH NGHIỆP</th>
                  <th className="py-3 px-4">NGƯỜI ĐẠI DIỆN</th>
                  <th className="py-3 px-4">HẠNG KHÁCH</th>
                  <th className="py-3 px-4">SỐ DỰ ÁN</th>
                  <th className="py-3 px-4">TRẠNG THÁI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292929]">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#171717] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[#007BA7] font-semibold">{c.code}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{c.name}</td>
                    <td className="py-3.5 px-4 text-[#A1A1AA]">{c.position || "CEO"}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FF2D95]/20 text-[#FF2D95] border border-[#FF2D95]/30">
                        {c.tier}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-white">{c.projects.length} dự án</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                        {c.careStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

