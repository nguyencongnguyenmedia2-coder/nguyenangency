"use client";

import React, { useState } from "react";
import { saveQuotation, deleteQuotation, convertQuotationToProject } from "@/app/actions/admin-system-actions";
import { Plus, Edit2, Trash2, Search, X, AlertTriangle, FileSpreadsheet, Briefcase, CheckCircle2, ExternalLink, Copy, Check } from "lucide-react";
import { formatCurrencyVND, formatDateVN } from "@/lib/utils";

export default function QuotationManagerClient({ initialQuotations }: { initialQuotations: any[] }) {
  const [quotations, setQuotations] = useState(initialQuotations);
  const [searchTerm, setSearchTerm] = useState("");
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = quotations.filter(
    (q) =>
      q.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleOpenCreate() {
    setEditingItem(null);
    setErrorMsg("");
    setIsModalOpen(true);
  }

  function handleOpenEdit(q: any) {
    setEditingItem(q);
    setErrorMsg("");
    setIsModalOpen(true);
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    if (editingItem?.id) {
      formData.append("id", editingItem.id);
    }

    const res = await saveQuotation(formData);
    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      window.location.reload();
    } else {
      setErrorMsg(res.error || "Lỗi lưu báo giá.");
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await deleteQuotation(deleteTarget.id);
    setIsDeleting(false);

    if (res.success) {
      setDeleteTarget(null);
      window.location.reload();
    } else {
      alert(res.error || "Không thể xóa báo giá này.");
    }
  }

  async function handleConvert(q: any) {
    if (!confirm(`Xác nhận chuyển báo giá ${q.code} (${q.clientName}) thành Dự Án đang triển khai? Hệ thống sẽ tự động khởi tạo công việc và giai đoạn.`)) {
      return;
    }

    setConvertingId(q.id);
    const res = await convertQuotationToProject(q.id);
    setConvertingId(null);

    if (res.success) {
      alert(`Đã khởi tạo thành công Dự Án mới: ${res.projectCode} (${res.projectName})!`);
      window.location.reload();
    } else {
      alert(res.error || "Lỗi chuyển đổi thành dự án.");
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
            placeholder="Tìm theo mã QT, khách hàng, dịch vụ..."
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
          <span>Tạo Báo Giá Mới</span>
        </button>
      </div>

      {/* Quotations Table */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#121212] border border-[#292929]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#292929] text-[#71717A] font-mono">
                <th className="py-3.5 px-4">MÃ BÁO GIÁ</th>
                <th className="py-3.5 px-4">KHÁCH HÀNG</th>
                <th className="py-3.5 px-4">DỊCH VỤ / GÓI</th>
                <th className="py-3.5 px-4">TỔNG GIÁ TRỊ</th>
                <th className="py-3.5 px-4">NGÀY TẠO</th>
                <th className="py-3.5 px-4">TRẠNG THÁI</th>
                <th className="py-3.5 px-4 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292929]">
              {filtered.map((q) => (
                <tr key={q.id} className="hover:bg-[#171717] transition-colors">
                  <td className="py-4 px-4 font-mono text-[#007BA7] font-semibold">{q.code}</td>
                  <td className="py-4 px-4">
                    <strong className="text-white block">{q.clientName}</strong>
                    <span className="text-[10px] text-[#71717A]">{q.clientCompany || q.clientEmail}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white block font-medium">{q.serviceName}</span>
                    <span className="text-[10px] font-mono text-[#71717A]">{q.packageName || "--"}</span>
                  </td>
                  <td className="py-4 px-4 font-mono text-emerald-400 font-bold text-sm">
                    {formatCurrencyVND(q.totalAmount)}
                  </td>
                  <td className="py-4 px-4 font-mono text-[#71717A]">{formatDateVN(q.createdAt)}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        q.status === "APPROVED"
                          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30"
                          : q.status === "NEW"
                          ? "bg-[#007BA7]/20 text-[#007BA7] border border-[#007BA7]/30"
                          : "bg-[#202020] text-[#A1A1AA]"
                      }`}
                    >
                      {q.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`/quotation/${q.code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#007BA7] text-[#A1A1AA] hover:text-white transition-colors"
                        title="Xem trang báo giá khách hàng"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleCopy(`${window.location.origin}/quotation/${q.code}`, q.id)}
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#171717] text-[#A1A1AA] hover:text-white transition-colors"
                        title="Sao chép link báo giá gửi khách"
                      >
                        {copiedId === q.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleConvert(q)}
                        disabled={convertingId === q.id}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono flex items-center gap-1 transition-colors disabled:opacity-50"
                        title="Chuyển thành Dự Án khách hàng"
                      >
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>{convertingId === q.id ? "Đang chuyển..." : "Tạo Dự Án"}</span>
                      </button>
                      <button
                        onClick={() => handleOpenEdit(q)}
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#007BA7] text-[#A1A1AA] hover:text-white transition-colors"
                        title="Chỉnh sửa báo giá"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(q)}
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-red-950/60 text-[#A1A1AA] hover:text-red-400 transition-colors"
                        title="Xóa báo giá"
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
              {editingItem ? "Chỉnh Sửa Báo Giá" : "Lập Báo Giá Dự Án Mới"}
            </h3>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Tên khách hàng *</label>
                  <input
                    type="text"
                    name="clientName"
                    required
                    defaultValue={editingItem?.clientName || ""}
                    placeholder="Alex Trần"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none focus:border-[#007BA7]"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Email khách hàng *</label>
                  <input
                    type="email"
                    name="clientEmail"
                    required
                    defaultValue={editingItem?.clientEmail || ""}
                    placeholder="alex@nexus.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Tên dịch vụ đề xuất</label>
                  <input
                    type="text"
                    name="serviceName"
                    defaultValue={editingItem?.serviceName || "Digital Flagship 3D Website"}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Tổng chi phí (VNĐ) *</label>
                  <input
                    type="number"
                    name="totalAmount"
                    required
                    defaultValue={editingItem?.totalAmount || 0}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Trạng thái báo giá</label>
                <select
                  name="status"
                  defaultValue={editingItem?.status || "NEW"}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                >
                  <option value="NEW">NEW (Mới tạo)</option>
                  <option value="REVIEWING">REVIEWING (Đang xem xét)</option>
                  <option value="QUOTED">QUOTED (Đã gửi báo giá)</option>
                  <option value="NEGOTIATING">NEGOTIATING (Đàm phán)</option>
                  <option value="APPROVED">APPROVED (Khách hàng đã duyệt)</option>
                  <option value="REJECTED">REJECTED (Từ chối)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Mô tả phạm vi & yêu cầu</label>
                <textarea
                  name="requirements"
                  rows={3}
                  defaultValue={editingItem?.requirements || ""}
                  placeholder="Chi tiết các hạng mục báo giá..."
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
                  {isSubmitting ? "Đang lưu..." : "Lưu Báo Giá"}
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
            <h4 className="text-lg font-bold text-white uppercase">Xác Nhận Xóa Báo Giá</h4>
            <p className="text-xs text-[#A1A1AA]">
              Bạn có chắc chắn muốn xóa báo giá <strong className="text-white">{deleteTarget.code}</strong> cho khách hàng {deleteTarget.clientName}?
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

