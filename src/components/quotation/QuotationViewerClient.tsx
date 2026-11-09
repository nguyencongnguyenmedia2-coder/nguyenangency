"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  approveQuotationByCode,
  requestRevisionByCode,
} from "@/app/actions/client-quotation-actions";
import {
  CheckCircle2,
  Clock,
  Send,
  FileText,
  ShieldCheck,
  Printer,
  Building2,
  Calendar,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { formatCurrencyVND, formatDateVN } from "@/lib/utils";
import {
  DetailBreadcrumbs,
  ShareCopyButton,
} from "@/components/common/DetailInteractiveTools";

interface QuotationProps {
  quotation: {
    id: string;
    code: string;
    clientName: string;
    clientEmail: string;
    clientPhone?: string | null;
    clientCompany?: string | null;
    serviceGroup?: string;
    serviceName: string;
    packageName?: string | null;
    selectedFeaturesJson?: string;
    requirements?: string | null;
    budgetRange?: string | null;
    desiredTimeline?: string | null;
    subtotal?: number;
    taxAmount?: number;
    totalAmount: number;
    status: string;
    createdAt: Date | string;
    validUntil?: Date | string | null;
    items?: {
      id: string;
      title: string;
      description?: string | null;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }[];
  };
}

export default function QuotationViewerClient({ quotation }: QuotationProps) {
  const [status, setStatus] = useState(quotation.status);
  const [isApproving, setIsApproving] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [successNotice, setSuccessNotice] = useState("");

  let selectedFeatures: string[] = [];
  try {
    selectedFeatures = JSON.parse(quotation.selectedFeaturesJson || "[]");
  } catch {
    selectedFeatures = [];
  }

  async function handleApprove() {
    if (
      !confirm(
        "Quý khách xác nhận đồng ý với báo giá và phạm vi triển khai này?"
      )
    )
      return;
    setIsApproving(true);
    const res = await approveQuotationByCode(quotation.code);
    setIsApproving(false);

    if (res.success) {
      setStatus("APPROVED");
      setSuccessNotice(
        "Cảm ơn Quý khách! Báo giá đã được phê duyệt. Ban điều hành NGUYÊN AGENCY sẽ liên hệ ngay để ký kết hợp đồng và khởi động dự án."
      );
    } else {
      alert(res.error || "Có lỗi xảy ra khi phê duyệt.");
    }
  }

  async function handleSendFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setIsSendingFeedback(true);
    const res = await requestRevisionByCode(quotation.code, feedbackText);
    setIsSendingFeedback(false);

    if (res.success) {
      setStatus("REVISION");
      setIsFeedbackOpen(false);
      setSuccessNotice(
        "Đã gửi yêu cầu điều chỉnh thành công! Đội ngũ tư vấn sẽ phản hồi trong vòng 24h làm việc."
      );
    } else {
      alert(res.error || "Lỗi gửi yêu cầu.");
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Top Bar: Breadcrumb & Utility Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#292929]">
          <DetailBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Client Portal", href: "/client/dashboard" },
              { label: `Quotation #${quotation.code}` },
            ]}
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#121212] hover:bg-[#171717] border border-[#292929] hover:border-[#007BA7] text-xs font-mono text-[#A1A1AA] hover:text-white transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-[#007BA7]" />
              <span>In / Xuất PDF</span>
            </button>
            <ShareCopyButton title={`Báo giá #${quotation.code}`} />
          </div>
        </div>

        {/* Executive Proposal Header */}
        <div className="p-8 md:p-12 rounded-3xl bg-[#121212] border border-[#292929] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="text-xs font-mono tracking-[0.25em] text-[#007BA7] uppercase block">
              NGUYÊN AGENCY • OFFICIAL DIGITAL PROPOSAL
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
              HỒ SƠ BÁO GIÁ DỰ ÁN
            </h1>
            <p className="text-xs font-mono text-[#A1A1AA]">
              MÃ XÁC THỰC HỆ THỐNG:{" "}
              <strong className="text-white">{quotation.code}</strong>
            </p>
          </div>

          <div className="flex flex-col md:items-end gap-2">
            <span
              className={`px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider uppercase inline-flex items-center gap-2 border ${
                status === "APPROVED"
                  ? "bg-[#007BA7]/20 text-[#007BA7] border-[#007BA7]/50"
                  : status === "REVISION"
                  ? "bg-[#FF2D95]/20 text-[#FF2D95] border-[#FF2D95]/50"
                  : "bg-[#171717] text-white border-[#292929]"
              }`}
            >
              {status === "APPROVED" ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#007BA7]" />
                  <span>ĐÃ PHÊ DUYỆT</span>
                </>
              ) : status === "REVISION" ? (
                <>
                  <Clock className="w-4 h-4 text-[#FF2D95]" />
                  <span>ĐANG ĐIỀU CHỈNH</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-[#007BA7]" />
                  <span>CHỜ XÁC NHẬN</span>
                </>
              )}
            </span>
            <span className="text-[11px] font-mono text-[#A1A1AA]">
              Ngày phát hành: {formatDateVN(quotation.createdAt)}
            </span>
          </div>
        </div>

        {/* Success Alert */}
        {successNotice && (
          <div className="p-6 rounded-3xl bg-[#121212] border border-[#007BA7] text-white text-sm flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#007BA7] shrink-0 mt-0.5" />
            <p className="leading-relaxed">{successNotice}</p>
          </div>
        )}

        {/* Client & Validity Dossier */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl bg-[#121212] border border-[#292929] space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#007BA7]">
              <Building2 className="w-4 h-4" />
              <span>THÔNG TIN ĐỐI TÁC / KHÁCH HÀNG</span>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="text-xl font-bold text-white">
                {quotation.clientName}
              </div>
              {quotation.clientCompany && (
                <div className="text-[#A1A1AA] font-medium">
                  {quotation.clientCompany}
                </div>
              )}
              <div className="text-xs font-mono text-[#007BA7] pt-1">
                {quotation.clientEmail}
                {quotation.clientPhone ? ` • ${quotation.clientPhone}` : ""}
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#121212] border border-[#292929] space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#FF2D95]">
              <Calendar className="w-4 h-4" />
              <span>THỜI HẠN & ĐƠN VỊ THỰC HIỆN</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#A1A1AA] block mb-1">Ngày lập hồ sơ</span>
                <strong className="text-white font-mono">
                  {formatDateVN(quotation.createdAt)}
                </strong>
              </div>
              <div>
                <span className="text-[#A1A1AA] block mb-1">Hiệu lực báo giá</span>
                <strong className="text-white font-mono">
                  {quotation.validUntil
                    ? formatDateVN(quotation.validUntil)
                    : "30 ngày tiêu chuẩn"}
                </strong>
              </div>
              {quotation.desiredTimeline && (
                <div>
                  <span className="text-[#A1A1AA] block mb-1">
                    Tiến độ dự kiến
                  </span>
                  <strong className="text-[#007BA7] font-mono">
                    {quotation.desiredTimeline}
                  </strong>
                </div>
              )}
              <div>
                <span className="text-[#A1A1AA] block mb-1">Đơn vị phát hành</span>
                <strong className="text-white font-mono">NGUYÊN AGENCY</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Scope of Work & Itemized Breakdown */}
        <div className="p-8 md:p-12 rounded-3xl bg-[#121212] border border-[#292929] space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#292929]">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#007BA7] block mb-1">
                01 // SCOPE OF WORK & DELIVERABLES
              </span>
              <h2 className="text-2xl font-black uppercase text-white">
                {quotation.serviceName}
              </h2>
            </div>
            {quotation.packageName && (
              <span className="px-4 py-1.5 rounded-full text-xs font-mono text-[#FF2D95] bg-[#FF2D95]/10 border border-[#FF2D95]/40">
                {quotation.packageName}
              </span>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-[#171717] border border-[#292929] space-y-4">
            <span className="text-[11px] font-mono uppercase text-[#A1A1AA] block">
              YÊU CẦU & PHẠM VI KỸ THUẬT:
            </span>
            <p className="text-sm md:text-base text-white leading-relaxed whitespace-pre-line">
              {quotation.requirements ||
                "Cung cấp toàn diện dịch vụ thiết kế sáng tạo, lập trình và chuyển giao công nghệ chuẩn mực theo tiêu chuẩn quốc tế của NGUYÊN AGENCY."}
            </p>
          </div>

          {/* Selected Features if any */}
          {selectedFeatures.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase text-[#A1A1AA] block">
                HẠNG MỤC BAO GỒM:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#171717] border border-[#292929] flex items-center gap-3 text-xs text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#007BA7] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Itemized Pricing Table if items exist */}
          {quotation.items && quotation.items.length > 0 && (
            <div className="overflow-x-auto pt-4">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#292929] text-[#A1A1AA] font-mono uppercase">
                    <th className="py-3 px-4">Hạng mục</th>
                    <th className="py-3 px-4 text-center">SL</th>
                    <th className="py-3 px-4 text-right">Đơn giá</th>
                    <th className="py-3 px-4 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#292929]">
                  {quotation.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 px-4">
                        <strong className="text-white block">{item.title}</strong>
                        {item.description && (
                          <span className="text-[#A1A1AA] text-[11px]">
                            {item.description}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center font-mono text-white">
                        {item.quantity}
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-[#A1A1AA]">
                        {formatCurrencyVND(item.unitPrice)}
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-white">
                        {formatCurrencyVND(item.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Financial Summary */}
          <div className="pt-6 border-t border-[#292929] flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1 text-xs text-[#A1A1AA]">
              <span className="font-mono uppercase text-white block">
                CAM KẾT BẢN QUYỀN & BẢO HÀNH
              </span>
              <p>
                Đã bao gồm 100% quyền sở hữu mã nguồn/thiết kế và bảo hành kỹ thuật 12 tháng.
              </p>
            </div>

            <div className="space-y-2 md:text-right">
              {Boolean(quotation.subtotal && quotation.subtotal > 0) && (
                <div className="text-xs font-mono text-[#A1A1AA]">
                  Chi phí gốc:{" "}
                  <span className="text-white">
                    {formatCurrencyVND(quotation.subtotal!)}
                  </span>
                </div>
              )}
              {Boolean(quotation.taxAmount && quotation.taxAmount > 0) && (
                <div className="text-xs font-mono text-[#A1A1AA]">
                  Thuế VAT:{" "}
                  <span className="text-white">
                    {formatCurrencyVND(quotation.taxAmount!)}
                  </span>
                </div>
              )}
              <div>
                <span className="text-[10px] font-mono uppercase text-[#A1A1AA] block">
                  TỔNG GIÁ TRỊ ĐẦU TƯ DỰ ÁN
                </span>
                <span className="text-3xl md:text-4xl font-black font-mono text-[#007BA7]">
                  {formatCurrencyVND(quotation.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Decision Bar */}
        <div className="p-8 rounded-3xl bg-[#121212] border border-[#292929] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-xs text-[#A1A1AA]">
            {status === "APPROVED"
              ? "Báo giá này đã được phê duyệt. Hồ sơ hợp đồng điện tử đang được chuẩn bị."
              : "Quý khách vui lòng kiểm tra phạm vi công việc và xác nhận phê duyệt để khởi động dự án."}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {status !== "APPROVED" ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsFeedbackOpen(true)}
                  className="flex-1 sm:flex-initial px-6 py-3.5 rounded-full bg-[#171717] hover:bg-[#292929] text-xs font-mono text-white border border-[#292929] transition-colors"
                >
                  Yêu Cầu Điều Chỉnh
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="flex-1 sm:flex-initial px-8 py-3.5 rounded-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-mono font-bold text-xs uppercase tracking-wider hover:shadow-glow-pink transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isApproving ? "Đang xử lý..." : "Phê Duyệt Báo Giá"}
                  </span>
                </button>
              </>
            ) : (
              <Link
                href="/client/dashboard"
                className="px-6 py-3.5 rounded-full bg-[#171717] border border-[#292929] hover:border-[#007BA7] text-xs font-mono text-white inline-flex items-center gap-2"
              >
                <span>Mở Client Portal</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Revision Feedback Modal */}
        {isFeedbackOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-[#121212] border border-[#292929] rounded-3xl p-8 shadow-2xl">
              <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-2">
                Đề Xuất Điều Chỉnh Báo Giá
              </h3>
              <p className="text-xs text-[#A1A1AA] mb-4">
                Vui lòng gửi các hạng mục cần tinh chỉnh về tính năng, ngân sách hoặc tiến độ.
              </p>

              <form onSubmit={handleSendFeedback} className="space-y-4">
                <textarea
                  rows={4}
                  required
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="VD: Chúng tôi muốn tối ưu giai đoạn 1, hoặc bổ sung thêm tính năng..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                />

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFeedbackOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-mono text-[#A1A1AA] hover:text-white"
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingFeedback}
                    className="px-6 py-2.5 rounded-xl bg-[#007BA7] hover:bg-[#007BA7]/85 text-white text-xs font-mono font-bold flex items-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {isSendingFeedback ? "Đang gửi..." : "Gửi Đề Xuất"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
