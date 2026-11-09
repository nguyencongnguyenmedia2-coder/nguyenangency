import React from "react";
import prisma from "@/lib/prisma";
import { History, ShieldAlert } from "lucide-react";
import { formatDateVN } from "@/lib/utils";

export const metadata = {
  title: "Nhật Ký Hoạt Động – NGUYÊN CRM",
};

export default async function AdminActivityLogsPage() {
  const logs = await prisma.activityLog.findMany({
    take: 30,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          NHẬT KÝ KIỂM TOÁN (AUDIT TRAIL & ACTIVITY LOGS)
        </h1>
        <p className="text-xs text-[#A1A1AA] mt-1">
          Ghi nhận toàn bộ thao tác thêm, sửa, xóa, duyệt hợp đồng và đăng nhập để đảm bảo an toàn dữ liệu.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-[#121212] border border-[#292929]">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#71717A]">
            Hệ thống đang hoạt động an toàn. Chưa ghi nhận sự cố bất thường.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#292929] text-[#71717A] font-mono">
                  <th className="py-3 px-4">THỜI GIAN</th>
                  <th className="py-3 px-4">NGƯỜI THỰC HIỆN</th>
                  <th className="py-3 px-4">HÀNH ĐỘNG</th>
                  <th className="py-3 px-4">ĐỐI TƯỢNG (ENTITY)</th>
                  <th className="py-3 px-4">CHI TIẾT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292929]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#171717] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[#71717A]">{formatDateVN(log.createdAt)}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{log.actorName}</td>
                    <td className="py-3.5 px-4 font-mono text-[#007BA7] font-semibold">{log.action}</td>
                    <td className="py-3.5 px-4 font-mono text-[#FF2D95]">{log.entity}</td>
                    <td className="py-3.5 px-4 text-[#A1A1AA]">{log.details || "--"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

