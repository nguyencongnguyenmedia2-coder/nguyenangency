"use client";

import React, { useState } from "react";
import { saveCustomer, deleteCustomer } from "@/app/actions/admin-crm-actions";
import { Plus, Edit2, Trash2, Search, Mail, Phone, Building, X, AlertTriangle } from "lucide-react";
import { formatDateVN } from "@/lib/utils";

interface CustomerProps {
  initialCustomers: any[];
}

export default function CustomerManagerClient({ initialCustomers }: CustomerProps) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Delete Confirm Modal State
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTier = filterTier === "ALL" || c.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  function handleOpenCreate() {
    setEditingCustomer(null);
    setErrorMsg("");
    setIsModalOpen(true);
  }

  function handleOpenEdit(customer: any) {
    setEditingCustomer(customer);
    setErrorMsg("");
    setIsModalOpen(true);
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    if (editingCustomer?.id) {
      formData.append("id", editingCustomer.id);
    }

    const res = await saveCustomer(formData);
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
    const res = await deleteCustomer(deleteTarget.id);
    setIsDeleting(false);

    if (res.success) {
      setDeleteTarget(null);
      window.location.reload();
    } else {
      alert(res.error || "Không thể xóa khách hàng này.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Tìm theo tên, email, công ty, mã KH..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
            />
          </div>

          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none"
          >
            <option value="ALL">Tất Cả Phân Hạng</option>
            <option value="VIP">VIP</option>
            <option value="ENTERPRISE">ENTERPRISE</option>
            <option value="SMB">SMB</option>
            <option value="STARTUP">STARTUP</option>
          </select>
        </div>

        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white text-xs font-mono font-bold uppercase tracking-wider hover:shadow-glow-pink transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Khách Hàng</span>
        </button>
      </div>

      {/* Customer Data Table */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#121212] border border-[#292929]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#292929] text-[#71717A] font-mono">
                <th className="py-3.5 px-4">MÃ KH</th>
                <th className="py-3.5 px-4">TÊN KHÁCH HÀNG</th>
                <th className="py-3.5 px-4">LIÊN HỆ & EMAIL</th>
                <th className="py-3.5 px-4">PHÂN HẠNG</th>
                <th className="py-3.5 px-4">DỰ ÁN</th>
                <th className="py-3.5 px-4">TRẠNG THÁI</th>
                <th className="py-3.5 px-4 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292929]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#71717A]">
                    Không tìm thấy khách hàng phù hợp.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[#171717] transition-colors">
                    <td className="py-4 px-4 font-mono text-[#007BA7] font-semibold">{c.code}</td>
                    <td className="py-4 px-4">
                      <strong className="text-white block text-sm">{c.name}</strong>
                      <span className="text-[10px] text-[#71717A]">{c.company || "--"}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-white">
                        <Mail className="w-3 h-3 text-[#FF2D95]" /> {c.email}
                      </div>
                      {c.phone && (
                        <div className="flex items-center gap-1.5 text-[#71717A] mt-0.5">
                          <Phone className="w-3 h-3 text-[#007BA7]" /> {c.phone}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          c.tier === "VIP"
                            ? "bg-[#FF2D95]/20 text-[#FF2D95] border border-[#FF2D95]/30 font-bold"
                            : "bg-[#007BA7]/20 text-[#007BA7] border border-[#007BA7]/30"
                        }`}
                      >
                        {c.tier}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-white">
                      {c.projects?.length || 0} dự án
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                        {c.careStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#007BA7] text-[#A1A1AA] hover:text-white transition-colors"
                          title="Chỉnh sửa thông tin"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(c)}
                          className="p-1.5 rounded-lg bg-[#202020] hover:bg-red-950/60 text-[#A1A1AA] hover:text-red-400 transition-colors"
                          title="Xóa khách hàng"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
              {editingCustomer ? "Chỉnh Sửa Hồ Sơ Khách Hàng" : "Thêm Khách Hàng Doanh Nghiệp Mới"}
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
                    defaultValue={editingCustomer?.name || ""}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none focus:border-[#007BA7]"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    defaultValue={editingCustomer?.email || ""}
                    placeholder="alex@company.com"
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
                    defaultValue={editingCustomer?.phone || ""}
                    placeholder="0912 345 678"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Công ty / Tổ chức</label>
                  <input
                    type="text"
                    name="company"
                    defaultValue={editingCustomer?.company || ""}
                    placeholder="Nexus FinTech"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Phân hạng (Tier)</label>
                  <select
                    name="tier"
                    defaultValue={editingCustomer?.tier || "ENTERPRISE"}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  >
                    <option value="VIP">VIP</option>
                    <option value="ENTERPRISE">ENTERPRISE</option>
                    <option value="SMB">SMB</option>
                    <option value="STARTUP">STARTUP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Trạng thái chăm sóc</label>
                  <select
                    name="careStatus"
                    defaultValue={editingCustomer?.careStatus || "ACTIVE"}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="FOLLOW_UP">FOLLOW_UP</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Địa chỉ trụ sở</label>
                <input
                  type="text"
                  name="address"
                  defaultValue={editingCustomer?.address || ""}
                  placeholder="Landmark 81, TP. Hồ Chí Minh"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Ghi chú nghiệp vụ</label>
                <textarea
                  name="notes"
                  rows={3}
                  defaultValue={editingCustomer?.notes || ""}
                  placeholder="Chi tiết yêu cầu, lưu ý đối tác..."
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
                  {isSubmitting ? "Đang lưu..." : "Lưu Thay Đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#292929] rounded-3xl w-full max-w-md p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-950/50 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white uppercase">Xác Nhận Xóa Khách Hàng</h4>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Bạn có chắc chắn muốn xóa khách hàng{" "}
              <strong className="text-white">{deleteTarget.name} ({deleteTarget.code})</strong>?
              Thao tác này chỉ thực hiện được khi khách hàng chưa phát sinh hóa đơn hoặc hợp đồng.
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

