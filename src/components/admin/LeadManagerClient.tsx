"use client";

import React, { useState } from "react";
import { saveLead, deleteLead } from "@/app/actions/admin-crm-actions";
import { Plus, Edit2, Trash2, Search, Building, X, AlertTriangle } from "lucide-react";

const PIPELINE_STAGES = [
  { key: "NEW_LEAD", label: "Mới Tiếp Nhận", color: "#007BA7" },
  { key: "CONTACTED", label: "Đã Liên Hệ", color: "#3B82F6" },
  { key: "QUALIFIED", label: "Đủ Điều Kiện", color: "#8B5CF6" },
  { key: "PROPOSAL", label: "Gửi Báo Giá", color: "#EC4899" },
  { key: "NEGOTIATION", label: "Đàm Phán", color: "#F59E0B" },
  { key: "WON", label: "Thành Công (Won)", color: "#10B981" },
  { key: "LOST", label: "Thất Bại (Lost)", color: "#EF4444" },
];

export default function LeadManagerClient({ initialLeads }: { initialLeads: any[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.company && l.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  function handleOpenCreate() {
    setEditingLead(null);
    setErrorMsg("");
    setIsModalOpen(true);
  }

  function handleOpenEdit(lead: any) {
    setEditingLead(lead);
    setErrorMsg("");
    setIsModalOpen(true);
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    if (editingLead?.id) {
      formData.append("id", editingLead.id);
    }

    const res = await saveLead(formData);
    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      window.location.reload();
    } else {
      setErrorMsg(res.error || "Có lỗi xảy ra.");
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await deleteLead(deleteTarget.id);
    setIsDeleting(false);

    if (res.success) {
      setDeleteTarget(null);
      window.location.reload();
    } else {
      alert(res.error || "Không thể xóa Lead này.");
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
            placeholder="Tìm theo tên, email, công ty, mã Lead..."
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
          <span>Thêm Lead Mới</span>
        </button>
      </div>

      {/* Kanban Board with Full CRUD actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((col) => {
          const colLeads = filtered.filter((l) => l.stage === col.key);

          return (
            <div
              key={col.key}
              className="bg-[#121212] border border-[#292929] rounded-2xl p-4 flex flex-col min-w-[240px]"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#292929]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {col.label}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#171717] text-[#A1A1AA] border border-[#292929]">
                  {colLeads.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {colLeads.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-[#292929] text-center text-[11px] text-[#71717A]">
                    Trống
                  </div>
                ) : (
                  colLeads.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-[#171717] border border-[#292929] hover:border-[#007BA7]/60 transition-all text-xs space-y-2 shadow-sm relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-[#007BA7] font-semibold">
                          {item.code}
                        </span>
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1 rounded hover:bg-[#202020] text-[#71717A] hover:text-white"
                            title="Sửa Lead"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="p-1 rounded hover:bg-red-950/50 text-[#71717A] hover:text-red-400"
                            title="Xóa Lead"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <strong className="text-white block text-sm">{item.name}</strong>

                      {item.company && (
                        <p className="text-[11px] text-[#A1A1AA] flex items-center gap-1.5 truncate">
                          <Building className="w-3 h-3 text-[#71717A]" />
                          {item.company}
                        </p>
                      )}

                      <p className="text-[11px] text-[#007BA7] font-medium truncate">
                        {item.serviceInterest || "Yêu cầu chung"}
                      </p>

                      {item.budget && (
                        <div className="pt-2 border-t border-[#292929] flex items-center justify-between text-[10px] font-mono text-[#71717A]">
                          <span>Ngân sách:</span>
                          <span className="text-white">{item.budget}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT LEAD MODAL */}
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
              {editingLead ? "Chỉnh Sửa Lead Tiềm Năng" : "Thêm Lead Mới Vào Pipeline"}
            </h3>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={editingLead?.name || ""}
                    placeholder="Alex Trần"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none focus:border-[#007BA7]"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Email liên hệ *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    defaultValue={editingLead?.email || ""}
                    placeholder="alex@nexus.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none focus:border-[#007BA7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={editingLead?.phone || ""}
                    placeholder="0912 345 678"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Công ty</label>
                  <input
                    type="text"
                    name="company"
                    defaultValue={editingLead?.company || ""}
                    placeholder="Nexus FinTech Group"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Giai đoạn Pipeline</label>
                  <select
                    name="stage"
                    defaultValue={editingLead?.stage || "NEW_LEAD"}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  >
                    {PIPELINE_STAGES.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Mức độ ưu tiên</label>
                  <select
                    name="priority"
                    defaultValue={editingLead?.priority || "HIGH"}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  >
                    <option value="HIGH">HIGH (Ưu tiên cao)</option>
                    <option value="MEDIUM">MEDIUM (Bình thường)</option>
                    <option value="LOW">LOW (Thấp)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Dịch vụ quan tâm</label>
                  <input
                    type="text"
                    name="serviceInterest"
                    defaultValue={editingLead?.serviceInterest || "3D Website & Web App"}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Ngân sách dự kiến</label>
                  <input
                    type="text"
                    name="budget"
                    defaultValue={editingLead?.budget || "60.000.000 - 150.000.000 VNĐ"}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Ghi chú & Nhu cầu</label>
                <textarea
                  name="notes"
                  rows={3}
                  defaultValue={editingLead?.notes || ""}
                  placeholder="Yêu cầu chi tiết của Lead..."
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
                  {isSubmitting ? "Đang lưu..." : "Lưu Lead"}
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
            <h4 className="text-lg font-bold text-white uppercase">Xác Nhận Xóa Lead</h4>
            <p className="text-xs text-[#A1A1AA]">
              Bạn có chắc chắn muốn xóa Lead{" "}
              <strong className="text-white">{deleteTarget.name} ({deleteTarget.code})</strong>?
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

