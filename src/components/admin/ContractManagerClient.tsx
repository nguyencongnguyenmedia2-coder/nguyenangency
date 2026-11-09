"use client";

import React, { useState } from "react";
import { saveContract, deleteContract } from "@/app/actions/admin-project-actions";
import { Plus, Edit2, Trash2, Search, X, AlertTriangle, FileSignature } from "lucide-react";
import { formatCurrencyVND, formatDateVN } from "@/lib/utils";

export default function ContractManagerClient({
  initialContracts,
  customers,
}: {
  initialContracts: any[];
  customers: any[];
}) {
  const [contracts, setContracts] = useState(initialContracts);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = contracts.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleOpenCreate() {
    setEditingContract(null);
    setErrorMsg("");
    setIsModalOpen(true);
  }

  function handleOpenEdit(c: any) {
    setEditingContract(c);
    setErrorMsg("");
    setIsModalOpen(true);
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    if (editingContract?.id) {
      formData.append("id", editingContract.id);
    }

    const res = await saveContract(formData);
    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      window.location.reload();
    } else {
      setErrorMsg(res.error || "Lỗi lưu hợp đồng.");
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await deleteContract(deleteTarget.id);
    setIsDeleting(false);

    if (res.success) {
      setDeleteTarget(null);
      window.location.reload();
    } else {
      alert(res.error || "Không thể xóa hợp đồng này.");
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
          <span>Tạo Hợp Đồng Mới</span>
        </button>
      </div>

      {/* Contracts Table */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#121212] border border-[#292929]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#292929] text-[#71717A] font-mono">
                <th className="py-3.5 px-4">SỐ HỢP ĐỒNG</th>
                <th className="py-3.5 px-4">TIÊU ĐỀ</th>
                <th className="py-3.5 px-4">KHÁCH HÀNG</th>
                <th className="py-3.5 px-4">GIÁ TRỊ HỢP ĐỒNG</th>
                <th className="py-3.5 px-4">NGÀY KÝ</th>
                <th className="py-3.5 px-4">TRẠNG THÁI</th>
                <th className="py-3.5 px-4 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292929]">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#171717] transition-colors">
                  <td className="py-4 px-4 font-mono text-[#007BA7] font-semibold">{c.code}</td>
                  <td className="py-4 px-4 font-bold text-white text-sm">{c.title}</td>
                  <td className="py-4 px-4 text-[#A1A1AA]">{c.customer?.name}</td>
                  <td className="py-4 px-4 font-mono text-emerald-400 font-bold text-sm">
                    {formatCurrencyVND(c.totalValue)}
                  </td>
                  <td className="py-4 px-4 font-mono text-[#71717A]">{formatDateVN(c.signedDate)}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#007BA7]/20 text-[#007BA7] border border-[#007BA7]/30">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#007BA7] text-[#A1A1AA] hover:text-white transition-colors"
                        title="Sửa hợp đồng"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(c)}
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-red-950/60 text-[#A1A1AA] hover:text-red-400 transition-colors"
                        title="Xóa/Hủy hợp đồng"
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

      {/* CREATE / EDIT CONTRACT MODAL */}
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
              {editingContract ? "Chỉnh Sửa Hợp Đồng" : "Soạn Thảo Hợp Đồng Mới"}
            </h3>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Tiêu đề hợp đồng *</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingContract?.title || ""}
                  placeholder="Hợp đồng phát triển nền tảng..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none focus:border-[#007BA7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Khách hàng đối tác *</label>
                  <select
                    name="customerId"
                    required
                    defaultValue={editingContract?.customerId || (customers[0]?.id || "")}
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
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Tổng giá trị (VNĐ) *</label>
                  <input
                    type="number"
                    name="totalValue"
                    required
                    defaultValue={editingContract?.totalValue || 0}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Trạng thái hợp đồng</label>
                <select
                  name="status"
                  defaultValue={editingContract?.status || "ACTIVE"}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                >
                  <option value="DRAFT">DRAFT (Bản thảo)</option>
                  <option value="PENDING_SIGNATURE">PENDING_SIGNATURE (Chờ ký)</option>
                  <option value="ACTIVE">ACTIVE (Đang hiệu lực)</option>
                  <option value="COMPLETED">COMPLETED (Nghiệm thu hoàn tất)</option>
                  <option value="TERMINATED">TERMINATED (Thanh lý)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Tóm tắt điều khoản thanh toán</label>
                <textarea
                  name="termsSummary"
                  rows={3}
                  defaultValue={editingContract?.termsSummary || ""}
                  placeholder="Thanh toán 3 đợt: 40% khởi động, 40% UAT, 20% bàn giao..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none resize-none"
                />
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
                  {isSubmitting ? "Đang lưu..." : "Lưu Hợp Đồng"}
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
            <h4 className="text-lg font-bold text-white uppercase">Xác Nhận Xóa Hợp Đồng</h4>
            <p className="text-xs text-[#A1A1AA]">
              Bạn có chắc chắn muốn xóa hợp đồng <strong className="text-white">{deleteTarget.title} ({deleteTarget.code})</strong>?
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

