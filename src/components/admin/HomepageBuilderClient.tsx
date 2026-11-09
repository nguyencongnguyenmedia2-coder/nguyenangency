"use client";

import React, { useState } from "react";
import {
  saveHomepageSection,
  toggleHomepageSection,
  reorderHomepageSections,
  deleteHomepageSection,
} from "@/app/actions/admin-homepage-actions";
import {
  LayoutTemplate,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ExternalLink,
  Check,
  AlertTriangle,
  X,
  Sparkles,
} from "lucide-react";

interface HomepageSectionItem {
  id: string;
  sectionKey: string;
  name: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  content?: string | null;
  mediaUrl?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  order: number;
  isActive: boolean;
  updatedAt: Date | string;
}

export default function HomepageBuilderClient({
  initialSections,
}: {
  initialSections: HomepageSectionItem[];
}) {
  const [sections, setSections] = useState<HomepageSectionItem[]>(
    [...initialSections].sort((a, b) => a.order - b.order)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HomepageSectionItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<HomepageSectionItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleOpenCreate() {
    setEditingItem(null);
    setErrorMsg("");
    setIsModalOpen(true);
  }

  function handleOpenEdit(sec: HomepageSectionItem) {
    setEditingItem(sec);
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

    const res = await saveHomepageSection(formData);
    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      setSuccessMsg("Đã lưu và xuất bản thay đổi lên trang chủ!");
      setTimeout(() => {
        setSuccessMsg("");
        window.location.reload();
      }, 1000);
    } else {
      setErrorMsg(res.error || "Lỗi lưu section.");
    }
  }

  async function handleToggle(sec: HomepageSectionItem) {
    const newStatus = !sec.isActive;
    setSections((prev) =>
      prev.map((s) => (s.id === sec.id ? { ...s, isActive: newStatus } : s))
    );

    const res = await toggleHomepageSection(sec.id, newStatus);
    if (res.success) {
      setSuccessMsg(`Đã ${newStatus ? "bật" : "tắt"} hiển thị section: ${sec.name}`);
      setTimeout(() => setSuccessMsg(""), 2500);
    } else {
      alert(res.error || "Lỗi chuyển trạng thái.");
      window.location.reload();
    }
  }

  async function handleMove(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved);

    const updated = reordered.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setSections(updated);

    const res = await reorderHomepageSections(
      updated.map((item) => ({ id: item.id, order: item.order }))
    );

    if (res.success) {
      setSuccessMsg("Đã cập nhật thứ tự các section trên trang chủ!");
      setTimeout(() => setSuccessMsg(""), 2500);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await deleteHomepageSection(deleteTarget.id);
    setIsDeleting(false);

    if (res.success) {
      setDeleteTarget(null);
      window.location.reload();
    } else {
      alert(res.error || "Không thể xóa section này.");
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
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#171717] hover:bg-[#202020] text-xs font-mono text-[#007BA7] border border-[#292929] flex items-center gap-2 transition-colors"
          >
            <span>Xem Trang Chủ Thực Tế</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <span className="text-xs text-[#71717A] font-mono">
            {sections.filter((s) => s.isActive).length} / {sections.length} Section đang bật
          </span>
        </div>

        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white text-xs font-mono font-bold uppercase tracking-wider hover:shadow-glow-pink transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Section Mới</span>
        </button>
      </div>

      {/* Sections List */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#121212] border border-[#292929] space-y-4">
        {sections.map((sec, index) => (
          <div
            key={sec.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              sec.isActive
                ? "bg-[#171717] border-[#292929] hover:border-[#383838]"
                : "bg-[#141414]/50 border-[#202020] opacity-60"
            }`}
          >
            {/* Reorder and Info */}
            <div className="flex items-start md:items-center gap-4">
              {/* Order Buttons */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <button
                  onClick={() => handleMove(index, "up")}
                  disabled={index === 0}
                  className="p-1 rounded bg-[#121212] hover:bg-[#202020] text-[#A1A1AA] hover:text-white disabled:opacity-20 border border-[#292929] transition-colors"
                  title="Di chuyển lên trên"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono font-bold text-[#007BA7]">
                  #{sec.order}
                </span>
                <button
                  onClick={() => handleMove(index, "down")}
                  disabled={index === sections.length - 1}
                  className="p-1 rounded bg-[#121212] hover:bg-[#202020] text-[#A1A1AA] hover:text-white disabled:opacity-20 border border-[#292929] transition-colors"
                  title="Di chuyển xuống dưới"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Title & Details */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-bold text-white text-sm">{sec.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#007BA7]/20 text-[#007BA7] border border-[#007BA7]/30">
                    {sec.sectionKey}
                  </span>
                  {sec.isActive ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                      HIỂN THỊ
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#202020] text-[#71717A] border border-[#292929]">
                      ĐANG ẨN
                    </span>
                  )}
                </div>

                <div className="text-xs text-[#A1A1AA] line-clamp-1">
                  <strong className="text-white">{sec.title}</strong>
                  {sec.subtitle && <span className="text-[#71717A]"> — {sec.subtitle}</span>}
                </div>

                {sec.description && (
                  <p className="text-[11px] text-[#71717A] mt-1 line-clamp-1 max-w-2xl">
                    {sec.description}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => handleToggle(sec)}
                className={`p-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-colors ${
                  sec.isActive
                    ? "bg-[#121212] hover:bg-[#202020] text-emerald-400 border-emerald-500/30"
                    : "bg-[#121212] hover:bg-[#202020] text-[#71717A] border-[#292929]"
                }`}
                title={sec.isActive ? "Nhấn để ẩn khỏi trang chủ" : "Nhấn để bật hiển thị"}
              >
                {sec.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{sec.isActive ? "Bật" : "Tắt"}</span>
              </button>

              <button
                onClick={() => handleOpenEdit(sec)}
                className="p-2 rounded-xl bg-[#121212] hover:bg-[#202020] text-[#A1A1AA] hover:text-white border border-[#292929] transition-colors"
                title="Chỉnh sửa nội dung section"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setDeleteTarget(sec)}
                className="p-2 rounded-xl bg-[#121212] hover:bg-red-500/20 text-[#71717A] hover:text-red-400 border border-[#292929] transition-colors"
                title="Xóa section"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#121212] border border-[#292929] rounded-3xl p-6 md:p-8 shadow-2xl my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-[#71717A] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2 mb-2">
              <LayoutTemplate className="w-5 h-5 text-[#007BA7]" />
              {editingItem ? "Chỉnh Sửa Section Trang Chủ" : "Tạo Section Mới Cho Trang Chủ"}
            </h3>
            <p className="text-xs text-[#A1A1AA] mb-6">
              Mọi thay đổi sẽ ngay lập tức được cập nhật trực tiếp lên trang chủ NGUYÊN AGENCY.
            </p>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                    Tên Gợi Nhớ (Admin) *
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingItem?.name || ""}
                    required
                    placeholder="VD: 01. Hero Banner 3D"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                    Mã Khóa Section (Key) *
                  </label>
                  <input
                    type="text"
                    name="sectionKey"
                    defaultValue={editingItem?.sectionKey || ""}
                    required
                    placeholder="HERO, BRAND_INTRO, SERVICES_BENTO..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs font-mono focus:outline-none focus:border-[#007BA7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                  Tiêu Đề Lớn (Title) *
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingItem?.title || ""}
                  required
                  placeholder="VD: VƯỢT CHUẨN SỐ HÓA."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs font-bold focus:outline-none focus:border-[#007BA7]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                    Tiêu Đề Phụ (Subtitle / Badge)
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    defaultValue={editingItem?.subtitle || ""}
                    placeholder="VD: 01 • KIẾN TẠO. PHÁT TRIỂN."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                    Thứ Tự Sắp Xếp (Order)
                  </label>
                  <input
                    type="number"
                    name="order"
                    defaultValue={editingItem?.order ?? sections.length + 1}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                  Mô Tả Section (Description)
                </label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingItem?.description || ""}
                  placeholder="Mô tả tóm tắt nội dung section hiển thị trên website..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                    Chữ Nút Bấm (CTA Text)
                  </label>
                  <input
                    type="text"
                    name="ctaText"
                    defaultValue={editingItem?.ctaText || ""}
                    placeholder="VD: Khám Phá Thêm"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                    Đường Dẫn Đích (CTA Link)
                  </label>
                  <input
                    type="text"
                    name="ctaLink"
                    defaultValue={editingItem?.ctaLink || ""}
                    placeholder="VD: /services, /portfolio..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                  Media / Ảnh Banner URL
                </label>
                <input
                  type="text"
                  name="mediaUrl"
                  defaultValue={editingItem?.mediaUrl || ""}
                  placeholder="https://images.unsplash.com/... hoặc /images/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs font-mono focus:outline-none focus:border-[#007BA7]"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    value="true"
                    defaultChecked={editingItem ? editingItem.isActive : true}
                    className="w-4 h-4 rounded bg-[#171717] border-[#292929] text-[#007BA7] focus:ring-0"
                  />
                  <span className="text-xs text-white font-mono">Bật hiển thị section này trên trang chủ</span>
                </label>
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
                  {isSubmitting ? "Đang lưu..." : editingItem ? "Cập Nhật & Xuất Bản" : "Tạo & Xuất Bản"}
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
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">Xóa Section Trang Chủ</h3>
            </div>
            <p className="text-xs text-[#A1A1AA] mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa section <strong className="text-white">{deleteTarget.name}</strong> khỏi trang
              chủ?
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
                {isDeleting ? "Đang xóa..." : "Xóa Section"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

