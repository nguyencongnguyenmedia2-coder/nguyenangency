"use client";

import React, { useState } from "react";
import { savePayment, deletePayment } from "@/app/actions/admin-project-actions";
import { Plus, Trash2, Search, X, CreditCard, AlertTriangle } from "lucide-react";
import { formatCurrencyVND, formatDateVN } from "@/lib/utils";

interface PaymentItem {
  id: string;
  amount: number;
  method: string;
  notes?: string | null;
  paidAt: Date | string;
  invoice: {
    id: string;
    code: string;
    title: string;
    totalAmount: number;
    customer: {
      id: string;
      name: string;
    };
  };
}

interface InvoiceOption {
  id: string;
  code: string;
  title: string;
  totalAmount: number;
  status: string;
  customer: {
    name: string;
  };
}

export default function PaymentManagerClient({
  initialPayments,
  invoices,
}: {
  initialPayments: PaymentItem[];
  invoices: InvoiceOption[];
}) {
  const [payments, setPayments] = useState<PaymentItem[]>(initialPayments);
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<PaymentItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = payments.filter((p) => {
    const matchesSearch =
      p.invoice.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.notes && p.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMethod = methodFilter === "ALL" || p.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const res = await savePayment(formData);
    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      window.location.reload();
    } else {
      setErrorMsg(res.error || "Lỗi ghi nhận thanh toán.");
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await deletePayment(deleteTarget.id);
    setIsDeleting(false);

    if (res.success) {
      setDeleteTarget(null);
      window.location.reload();
    } else {
      alert(res.error || "Không thể hủy thanh toán này.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Tìm theo mã hóa đơn, khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
            />
          </div>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-xs text-white focus:outline-none focus:border-[#007BA7]"
          >
            <option value="ALL">Tất cả phương thức</option>
            <option value="Bank Transfer">Chuyển khoản (Bank Transfer)</option>
            <option value="Cash">Tiền mặt (Cash)</option>
            <option value="Credit Card">Thẻ tín dụng (Credit Card)</option>
            <option value="Momo / VNPAY">Ví điện tử / QR Code</option>
          </select>
        </div>

        <button
          onClick={() => {
            setErrorMsg("");
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white text-xs font-mono font-bold uppercase tracking-wider hover:shadow-glow-pink transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Ghi Nhận Thanh Toán</span>
        </button>
      </div>

      {/* Table */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#121212] border border-[#292929]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#292929] text-[#71717A] font-mono">
                <th className="py-3.5 px-4">HÓA ĐƠN LIÊN KẾT</th>
                <th className="py-3.5 px-4">KHÁCH HÀNG</th>
                <th className="py-3.5 px-4">SỐ TIỀN</th>
                <th className="py-3.5 px-4">PHƯƠNG THỨC</th>
                <th className="py-3.5 px-4">NGÀY GIAO DỊCH</th>
                <th className="py-3.5 px-4">GHI CHÚ</th>
                <th className="py-3.5 px-4 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292929]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#171717] transition-colors">
                  <td className="py-4 px-4 font-mono text-[#007BA7] font-semibold">{p.invoice.code}</td>
                  <td className="py-4 px-4 font-bold text-white">{p.invoice.customer.name}</td>
                  <td className="py-4 px-4 font-mono text-emerald-400 font-bold text-sm">
                    {formatCurrencyVND(p.amount)}
                  </td>
                  <td className="py-4 px-4 font-mono text-white">{p.method}</td>
                  <td className="py-4 px-4 font-mono text-[#71717A]">{formatDateVN(p.paidAt)}</td>
                  <td className="py-4 px-4 text-[#A1A1AA]">{p.notes || "--"}</td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => setDeleteTarget(p)}
                      className="p-2 rounded-lg bg-[#171717] hover:bg-red-500/20 text-[#71717A] hover:text-red-400 border border-[#292929] transition-colors"
                      title="Hủy ghi nhận giao dịch"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#71717A]">
                    Không tìm thấy giao dịch thanh toán nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#121212] border border-[#292929] rounded-3xl p-6 md:p-8 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-[#71717A] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              Ghi Nhận Thanh Toán Mới
            </h3>
            <p className="text-xs text-[#A1A1AA] mb-6">
              Xác nhận tiền về tài khoản ngân hàng và cập nhật tự động trạng thái hóa đơn.
            </p>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                  Chọn Hóa Đơn *
                </label>
                <select
                  name="invoiceId"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                >
                  <option value="">-- Chọn hóa đơn cần thanh toán --</option>
                  {invoices.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.code} - {inv.title} ({inv.customer.name}) - {formatCurrencyVND(inv.totalAmount)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                    Số Tiền Thanh Toán (VNĐ) *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    min="1000"
                    step="1000"
                    required
                    placeholder="VD: 50000000"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                    Phương Thức *
                  </label>
                  <select
                    name="method"
                    defaultValue="Bank Transfer"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                  >
                    <option value="Bank Transfer">Chuyển khoản (Bank Transfer)</option>
                    <option value="Cash">Tiền mặt (Cash)</option>
                    <option value="Credit Card">Thẻ tín dụng (Credit Card)</option>
                    <option value="Momo / VNPAY">Ví điện tử / QR Code</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                  Ghi Chú Giao Dịch
                </label>
                <input
                  type="text"
                  name="notes"
                  placeholder="VD: Khách chuyển đợt 1 qua Vietcombank"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#292929]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-[#A1A1AA] hover:text-white transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white text-xs font-mono font-bold uppercase tracking-wider hover:shadow-glow-pink transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Đang ghi nhận..." : "Xác Nhận Thu Tiền"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#121212] border border-[#292929] rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">Hủy Giao Dịch Thanh Toán</h3>
            </div>
            <p className="text-xs text-[#A1A1AA] mb-6 leading-relaxed">
              Bạn có chắc chắn muốn hủy giao dịch <strong className="text-white">{formatCurrencyVND(deleteTarget.amount)}</strong>{" "}
              của hóa đơn <strong className="text-[#007BA7]">{deleteTarget.invoice.code}</strong>? Trạng thái hóa đơn sẽ tự động được tính toán lại.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-[#A1A1AA] hover:text-white transition-colors"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {isDeleting ? "Đang xử lý..." : "Xác Nhận Hủy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

