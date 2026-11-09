import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logoutUser } from "@/app/actions/auth";
import {
  FolderGit2,
  FileText,
  DollarSign,
  Download,
  Clock,
  CheckCircle2,
  MessageSquare,
  LogOut,
  Send,
  User,
  Shield,
  Layers,
} from "lucide-react";
import { formatCurrencyVND, formatDateVN } from "@/lib/utils";

export const metadata = {
  title: "Client Portal – NGUYÊN AGENCY",
  description: "Cổng quản lý dự án, báo giá, tiến độ và tài liệu bàn giao dành riêng cho khách hàng.",
};

export default async function ClientDashboardPage() {
  const session = await getCurrentUser();
  if (!session) {
    redirect("/client/login");
  }

  // Fetch client customer profile and associated projects
  const customer = await prisma.customer.findFirst({
    where: { email: session.email },
    include: {
      projects: {
        include: {
          tasks: { orderBy: { order: "asc" } },
          files: { orderBy: { createdAt: "desc" } },
        },
      },
      quotations: { orderBy: { createdAt: "desc" } },
      contracts: { orderBy: { createdAt: "desc" } },
      invoices: { orderBy: { createdAt: "desc" } },
    },
  });

  const activeProject = customer?.projects[0];

  let discussions: any[] = [];
  try {
    discussions = JSON.parse(activeProject?.discussionJson || "[]");
  } catch (e) {
    discussions = [];
  }

  return (
    <div className="pt-28 pb-20 px-6 bg-[#0A0A0A] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Top Portal Banner */}
        <div className="p-8 rounded-3xl bg-[#121212] border border-[#292929] mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#007BA7] to-[#FF2D95] p-[1.5px]">
              <div className="w-full h-full bg-[#171717] rounded-[14px] flex items-center justify-center font-bold text-white text-xl">
                {session.name.charAt(0)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#007BA7]/20 text-[#007BA7] border border-[#007BA7]/40">
                  CLIENT PORTAL
                </span>
                <span className="text-xs font-mono text-[#71717A]">MÃ KH: {customer?.code || "CUS-2026"}</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">{session.name}</h1>
              <p className="text-xs text-[#A1A1AA]">{customer?.company || session.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {session.role === "SUPER_ADMIN" || session.role === "ADMIN" ? (
              <Link
                href="/admin"
                className="px-4 py-2 rounded-xl bg-[#171717] hover:bg-[#202020] border border-[#292929] text-xs font-mono text-[#007BA7] flex items-center gap-2 transition-all"
              >
                <Shield className="w-4 h-4" /> Mở Admin CMS
              </Link>
            ) : null}

            <form action={logoutUser}>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#171717] hover:bg-red-950/40 border border-[#292929] hover:border-red-500/40 text-xs font-mono text-[#A1A1AA] hover:text-red-300 flex items-center gap-2 transition-all"
              >
                <LogOut className="w-4 h-4" /> Đăng Xuất
              </button>
            </form>
          </div>
        </div>

        {/* Active Project Highlight */}
        {activeProject ? (
          <div className="space-y-8">
            <div className="p-8 rounded-3xl bg-[#121212] border border-[#292929]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-mono text-[#007BA7] block mb-1">DỰ ÁN ĐANG THỰC HIỆN</span>
                  <h2 className="text-2xl font-bold text-white">{activeProject.name}</h2>
                  <p className="text-xs text-[#71717A] mt-1">Lead Architect: {activeProject.managerName}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-[#A1A1AA] block">Tiến độ tổng thể</span>
                  <span className="text-3xl font-black font-mono text-gradient-brand">
                    {activeProject.progress}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 rounded-full bg-[#171717] border border-[#292929] overflow-hidden mb-8">
                <div
                  className="h-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] rounded-full transition-all duration-1000"
                  style={{ width: `${activeProject.progress}%` }}
                />
              </div>

              {/* Tasks List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#007BA7]" />
                    Hạng Mục & Nhiệm Vụ (Sprint Tasks)
                  </h3>
                  <div className="space-y-2.5">
                    {activeProject.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3.5 rounded-xl bg-[#171717] border border-[#292929] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 ${
                              task.status === "COMPLETED" ? "text-emerald-400" : "text-[#71717A]"
                            }`}
                          />
                          <span className={task.status === "COMPLETED" ? "line-through text-[#71717A]" : "text-white"}>
                            {task.title}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            task.status === "COMPLETED"
                              ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30"
                              : task.status === "IN_PROGRESS"
                              ? "bg-[#007BA7]/20 text-[#007BA7] border border-[#007BA7]/40"
                              : "bg-[#202020] text-[#71717A]"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deliverable Files */}
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                    <Download className="w-4 h-4 text-[#FF2D95]" />
                    File Bàn Giao & Tài Nguyên (Deliverables)
                  </h3>
                  <div className="space-y-2.5">
                    {activeProject.files.map((file) => (
                      <div
                        key={file.id}
                        className="p-3.5 rounded-xl bg-[#171717] border border-[#292929] flex items-center justify-between text-xs hover:border-[#007BA7] transition-all"
                      >
                        <div>
                          <strong className="text-white block">{file.name}</strong>
                          <span className="text-[10px] font-mono text-[#71717A]">
                            {file.fileType} • {file.fileSize} • Phiên bản {file.version}
                          </span>
                        </div>
                        <a
                          href={file.fileUrl}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-[#202020] hover:bg-[#007BA7] text-white transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Discussion & Revision Request Area */}
            <div className="p-8 rounded-3xl bg-[#121212] border border-[#292929]">
              <h3 className="text-sm font-mono uppercase tracking-wider text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#007BA7]" />
                Trao Đổi Trực Tiếp & Yêu Cầu Chỉnh Sửa (Revisions)
              </h3>

              <div className="space-y-4 mb-6">
                {discussions.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                      msg.role === "CLIENT"
                        ? "bg-[#171717] border-[#292929] ml-8"
                        : "bg-[#007BA7]/10 border-[#007BA7]/30 mr-8"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <strong className={msg.role === "CLIENT" ? "text-white" : "text-[#007BA7]"}>
                        {msg.author}
                      </strong>
                      <span className="text-[10px] font-mono text-[#71717A]">{msg.time}</span>
                    </div>
                    <p className="text-[#A1A1AA]">{msg.message}</p>
                  </div>
                ))}
              </div>

              {/* Quick feedback input */}
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Nhập yêu cầu phản hồi hoặc góp ý thêm cho dự án..."
                  className="flex-1 px-4 py-3 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                />
                <button
                  type="button"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white text-xs font-mono uppercase font-semibold flex items-center gap-1.5 hover:shadow-glow-pink transition-all"
                >
                  <span>Gửi</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Financial Overview: Quotations, Contracts, Invoices */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-[#121212] border border-[#292929]">
                <span className="text-[10px] font-mono text-[#71717A] uppercase block mb-1">Báo Giá Gần Nhất</span>
                <h4 className="text-base font-bold text-white mb-2">
                  {customer?.quotations[0]?.code || "QT-2026-0001"}
                </h4>
                <p className="text-xl font-black font-mono text-white mb-2">
                  {formatCurrencyVND(customer?.quotations[0]?.totalAmount || 162000000)}
                </p>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                  {customer?.quotations[0]?.status || "APPROVED"}
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-[#121212] border border-[#292929]">
                <span className="text-[10px] font-mono text-[#71717A] uppercase block mb-1">Hợp Đồng Ký Kết</span>
                <h4 className="text-base font-bold text-white mb-2">
                  {customer?.contracts[0]?.code || "CTR-2026-001"}
                </h4>
                <p className="text-xs text-[#A1A1AA] mb-4 line-clamp-2">
                  {customer?.contracts[0]?.title}
                </p>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#007BA7]/20 text-[#007BA7] border border-[#007BA7]/40">
                  {customer?.contracts[0]?.status || "ACTIVE"}
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-[#121212] border border-[#292929]">
                <span className="text-[10px] font-mono text-[#71717A] uppercase block mb-1">Hóa Đơn & Thanh Toán</span>
                <h4 className="text-base font-bold text-white mb-2">
                  {customer?.invoices[0]?.code || "INV-2026-001"}
                </h4>
                <p className="text-xl font-black font-mono text-emerald-400 mb-2">
                  {formatCurrencyVND(customer?.invoices[0]?.totalAmount || 69984000)}
                </p>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                  {customer?.invoices[0]?.status || "PAID"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-16 rounded-3xl bg-[#121212] border border-[#292929] text-center">
            <h3 className="text-xl font-bold text-white mb-2">Chưa có dự án nào đang kích hoạt</h3>
            <p className="text-sm text-[#A1A1AA] max-w-md mx-auto mb-6">
              Bạn có thể bắt đầu bằng việc yêu cầu báo giá hoặc trao đổi với đội ngũ tư vấn của NGUYÊN AGENCY.
            </p>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white text-xs font-mono uppercase font-semibold"
            >
              Gửi Yêu Cầu Dự Án Mới
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

