"use client";

import React, { useState } from "react";
import { saveInvoice, deleteInvoice, savePayment } from "@/app/actions/admin-project-actions";
import { Plus, Edit2, Trash2, Search, X, AlertTriangle, CreditCard, DollarSign } from "lucide-react";
import { formatCurrencyVND, formatDateVN } from "@/lib/utils";

export default function InvoiceManagerClient({
  initialInvoices,
  customers,
}: {
  initialInvoices: any[];
  customers: any[];
}) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Payment Quick Modal
  const [paymentTarget, setPaymentTarget] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");

  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = invoices.filter(
    (inv) =>
      inv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleOpenCreate() {
    setEditingInvoice(null);
    setErrorMsg("");
    setIsModalOpen(true);
  }

  function handleOpenEdit(inv: any) {
    setEditingInvoice(inv);
    setErrorMsg("");
    setIsModalOpen(true);
  }

  function handleOpenPayment(inv: any) {
    setPaymentTarget(inv);
    setPaymentAmount(inv.totalAmount);
    setErrorMsg("");
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    if (editingInvoice?.id) {
      formData.append("id", editingInvoice.id);
    }

    const res = await saveInvoice(formData);
    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      window.location.reload();
    } else {
      setErrorMsg(res.error || "Lỗi lưu hóa đơn.");
    }
  }

  async function handleSavePayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("invoiceId", paymentTarget.id);
    formData.append("amount", paymentAmount.toString());
    formData.append("method", paymentMethod);

    const res = await savePayment(formData);
    setIsSubmitting(false);

    if (res.success) {
      setPaymentTarget(null);
      window.location.reload();
    } else {
      alert(res.error || "Lỗi ghi nhận thanh toán.");
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await deleteInvoice(deleteTarget.id);
    setIsDeleting(false);

    if (res.success) {
      setDeleteTarget(null);
      window.location.reload();
    } else {
      alert(res.error || "Không thể xóa hóa đơn này.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Tìm theo số HĐ, tiêu đề, khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
          />
        </div>

        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white text-xs font-mono font-bold uppercase tracking-wider hover:shadow-glow-pink transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Xuất Hóa Đơn Mới</span>
        </button>
      </div>

      {/* Invoices Table */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#121212] border border-[#292929]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#292929] text-[#71717A] font-mono">
                <th className="py-3.5 px-4">SỐ HÓA ĐƠN</th>
                <th className="py-3.5 px-4">TIÊU ĐỀ</th>
                <th className="py-3.5 px-4">KHÁCH HÀNG</th>
                <th className="py-3.5 px-4">TỔNG TIỀN</th>
                <th className="py-3.5 px-4">HẠN THANH TOÁN</th>
                <th className="py-3.5 px-4">TRẠNG THÁI</th>
                <th className="py-3.5 px-4 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292929]">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#171717] transition-colors">
                  <td className="py-4 px-4 font-mono text-[#007BA7] font-semibold">{inv.code}</td>
                  <td className="py-4 px-4 font-bold text-white text-sm">{inv.title}</td>
                  <td className="py-4 px-4 text-[#A1A1AA]">{inv.customer?.name}</td>
                  <td className="py-4 px-4 font-mono text-emerald-400 font-bold text-sm">
                    {formatCurrencyVND(inv.totalAmount)}
                  </td>
                  <td className="py-4 px-4 font-mono text-[#71717A]">{formatDateVN(inv.dueDate)}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        inv.status === "PAID"
                          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-950/40 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {inv.status !== "PAID" && (
                        <button
                          onClick={() => handleOpenPayment(inv)}
                          className="p-1.5 rounded-lg bg-[#202020] hover:bg-emerald-900/60 text-[#A1A1AA] hover:text-emerald-400 transition-colors"
                          title="Ghi nhận thanh toán"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenEdit(inv)}
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#007BA7] text-[#A1A1AA] hover:text-white transition-colors"
                        title="Sửa hóa đơn"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(inv)}
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-red-950/60 text-[#A1A1AA] hover:text-red-400 transition-colors"
                        title="Xóa hóa đơn"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#292929] rounded-3xl w-full max-w-xl p-8 relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-[#71717A] hover:text-white hover:bg-[#171717]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white uppercase tracking-wide mb-6">
              {editingInvoice ? "Chỉnh Sửa Hóa Đơn" : "Tạo Hóa Đơn Mới"}
            </h3>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Tiêu đề đợt thu *</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingInvoice?.title || ""}
                  placeholder="Đợt 1 – Tạm ứng 40% khởi động dự án..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none focus:border-[#007BA7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Khách hàng *</label>
                  <select
                    name="customerId"
                    required
                    defaultValue={editingInvoice?.customerId || (customers[0]?.id || "")}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Số tiền trước thuế (VNĐ) *</label>
                  <input
                    type="number"
                    name="amount"
                    required
                    defaultValue={editingInvoice?.amount || 0}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Trạng thái thanh toán</label>
                <select
                  name="status"
                  defaultValue={editingInvoice?.status || "UNPAID"}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                >
                  <option value="UNPAID">UNPAID (Chưa thanh toán)</option>
                  <option value="PARTIAL">PARTIAL (Thanh toán 1 phần)</option>
                  <option value="PAID">PAID (Đã hoàn tất)</option>
                  <option value="OVERDUE">OVERDUE (Quá hạn)</option>
                  <option value="CANCELLED">CANCELLED (Hủy)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#292929] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#171717] text-[#A1A1AA] hover:text-white"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-mono uppercase font-bold"
                >
                  {isSubmitting ? "Đang lưu..." : "Lưu Hóa Đơn"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK PAYMENT RECORD MODAL */}
      {paymentTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#292929] rounded-3xl w-full max-w-md p-6 text-xs space-y-4">
            <h4 className="text-base font-bold text-white uppercase flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              Ghi Nhận Thanh Toán Thực Tế
            </h4>
            <p className="text-[#A1A1AA]">
              Hóa đơn: <strong className="text-white">{paymentTarget.code}</strong> - {paymentTarget.title}
            </p>

            <form onSubmit={handleSavePayment} className="space-y-4">
              <div>
                <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Số tiền thanh toán (VNĐ)</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Phương thức thanh toán</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                >
                  <option value="Bank Transfer">Chuyển Khoản Ngân Hàng (Vietcombank)</option>
                  <option value="Cash">Tiền Mặt</option>
                  <option value="Credit Card">Thẻ Tín Dụng / POS</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentTarget(null)}
                  className="px-4 py-2 rounded-xl bg-[#171717] text-[#A1A1AA] hover:text-white"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold"
                >
                  {isSubmitting ? "Đang xử lý..." : "Xác Nhận Đã Nhận Tiền"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#292929] rounded-3xl w-full max-w-md p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-950/50 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white uppercase">Xác Nhận Xóa Hóa Đơn</h4>
            <p className="text-xs text-[#A1A1AA]">
              Bạn có chắc chắn muốn xóa hóa đơn <strong className="text-white">{deleteTarget.code}</strong>?
            </p>
            <div className="pt-2 flex items-center justify-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 rounded-xl bg-[#171717] text-[#A1A1AA] hover:text-white"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold"
              >
                {isDeleting ? "Đang xóa..." : "Xác Nhận Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

