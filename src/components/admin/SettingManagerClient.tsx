"use client";

import React, { useState } from "react";
import { saveSiteSetting, deleteSiteSetting } from "@/app/actions/admin-system-actions";
import { Plus, Edit2, Trash2, Search, X, Settings, Check, AlertTriangle, Save } from "lucide-react";

interface SettingItem {
  id: string;
  key: string;
  value: string;
  group: string;
  description?: string | null;
  updatedAt: Date | string;
}

export default function SettingManagerClient({ initialSettings }: { initialSettings: SettingItem[] }) {
  const [settings, setSettings] = useState<SettingItem[]>(initialSettings);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupFilter, setGroupFilter] = useState("ALL");

  const [editingItem, setEditingItem] = useState<SettingItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<SettingItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Quick edit state per row
  const [editingValues, setEditingValues] = useState<{ [id: string]: string }>(
    initialSettings.reduce((acc, s) => ({ ...acc, [s.id]: s.value }), {})
  );
  const [savingRowId, setSavingRowId] = useState<string | null>(null);

  const groups = Array.from(new Set(settings.map((s) => s.group)));

  const filtered = settings.filter((s) => {
    const matchesSearch =
      s.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      s.value.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = groupFilter === "ALL" || s.group === groupFilter;
    return matchesSearch && matchesGroup;
  });

  function handleOpenCreate() {
    setEditingItem(null);
    setErrorMsg("");
    setIsModalOpen(true);
  }

  function handleOpenEdit(s: SettingItem) {
    setEditingItem(s);
    setErrorMsg("");
    setIsModalOpen(true);
  }

  async function handleSaveModal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    if (editingItem?.id) {
      formData.append("id", editingItem.id);
    }

    const res = await saveSiteSetting(formData);
    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      window.location.reload();
    } else {
      setErrorMsg(res.error || "Lỗi lưu cấu hình.");
    }
  }

  async function handleQuickSaveRow(item: SettingItem) {
    setSavingRowId(item.id);
    setSuccessMsg("");
    const formData = new FormData();
    formData.append("id", item.id);
    formData.append("key", item.key);
    formData.append("group", item.group);
    formData.append("description", item.description || "");
    formData.append("value", editingValues[item.id] ?? item.value);

    const res = await saveSiteSetting(formData);
    setSavingRowId(null);

    if (res.success) {
      setSuccessMsg(`Đã lưu cấu hình: ${item.key}`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      alert(res.error || "Lỗi lưu cấu hình.");
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await deleteSiteSetting(deleteTarget.id);
    setIsDeleting(false);

    if (res.success) {
      setDeleteTarget(null);
      window.location.reload();
    } else {
      alert(res.error || "Không thể xóa cấu hình này.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Tìm theo khóa hoặc mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
            />
          </div>

          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-xs text-white focus:outline-none focus:border-[#007BA7]"
          >
            <option value="ALL">Tất cả nhóm</option>
            {groups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white text-xs font-mono font-bold uppercase tracking-wider hover:shadow-glow-pink transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Khóa Cấu Hình</span>
        </button>
      </div>

      {/* Settings List */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#121212] border border-[#292929]">
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#171717] border border-[#292929] hover:border-[#383838] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="md:w-1/3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#007BA7] font-bold text-xs">{item.key}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#202020] text-[#A1A1AA] border border-[#292929]">
                    {item.group}
                  </span>
                </div>
                <p className="text-[#71717A] text-[11px] mt-1 leading-relaxed">
                  {item.description || "Chưa có mô tả chi tiết."}
                </p>
              </div>

              <div className="md:w-1/2 flex items-center gap-2">
                <input
                  type="text"
                  value={editingValues[item.id] ?? item.value}
                  onChange={(e) =>
                    setEditingValues({
                      ...editingValues,
                      [item.id]: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#292929] text-white font-mono text-xs focus:outline-none focus:border-[#007BA7]"
                />
                <button
                  onClick={() => handleQuickSaveRow(item)}
                  disabled={savingRowId === item.id}
                  className="px-3.5 py-2.5 rounded-xl bg-[#007BA7]/20 hover:bg-[#007BA7]/40 text-[#007BA7] border border-[#007BA7]/30 text-xs font-mono font-bold flex items-center gap-1.5 shrink-0 transition-colors disabled:opacity-50"
                  title="Lưu giá trị"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingRowId === item.id ? "Lưu..." : "Lưu"}</span>
                </button>
              </div>

              <div className="flex items-center justify-end gap-1.5 shrink-0">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-lg bg-[#121212] hover:bg-[#202020] text-[#A1A1AA] hover:text-white border border-[#292929] transition-colors"
                  title="Chỉnh sửa chi tiết"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="p-2 rounded-lg bg-[#121212] hover:bg-red-500/20 text-[#71717A] hover:text-red-400 border border-[#292929] transition-colors"
                  title="Xóa cấu hình"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-12 text-center text-[#71717A] text-xs">
              Không tìm thấy khóa cấu hình nào phù hợp.
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
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
              <Settings className="w-5 h-5 text-[#007BA7]" />
              {editingItem ? "Chỉnh Sửa Khóa Cấu Hình" : "Thêm Cấu Hình Mới"}
            </h3>
            <p className="text-xs text-[#A1A1AA] mb-6">
              Các thiết lập này ảnh hưởng trực tiếp đến thông tin hiển thị trên website công khai.
            </p>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                  Mã Khóa (Key) *
                </label>
                <input
                  type="text"
                  name="key"
                  defaultValue={editingItem?.key || ""}
                  required
                  placeholder="VD: site_contact_email, hotline..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs font-mono focus:outline-none focus:border-[#007BA7]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                  Giá Trị (Value) *
                </label>
                <textarea
                  name="value"
                  rows={3}
                  defaultValue={editingItem?.value || ""}
                  required
                  placeholder="Giá trị của cấu hình..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs font-mono focus:outline-none focus:border-[#007BA7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                    Nhóm (Group)
                  </label>
                  <select
                    name="group"
                    defaultValue={editingItem?.group || "GENERAL"}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                  >
                    <option value="GENERAL">GENERAL</option>
                    <option value="CONTACT">CONTACT</option>
                    <option value="SEO">SEO</option>
                    <option value="SOCIAL">SOCIAL</option>
                    <option value="HOMEPAGE">HOMEPAGE</option>
                    <option value="INTEGRATIONS">INTEGRATIONS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                    Mô Tả Chức Năng
                  </label>
                  <input
                    type="text"
                    name="description"
                    defaultValue={editingItem?.description || ""}
                    placeholder="VD: Email chính nhận thông báo"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                  />
                </div>
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
                  {isSubmitting ? "Đang lưu..." : editingItem ? "Cập Nhật" : "Tạo Mới"}
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
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">Xóa Khóa Cấu Hình</h3>
            </div>
            <p className="text-xs text-[#A1A1AA] mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa khóa cấu hình <strong className="text-white">{deleteTarget.key}</strong>? Hãy
              chắc chắn các trang web công khai không phụ thuộc vào khóa này.
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
                {isDeleting ? "Đang xóa..." : "Xóa Khóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

