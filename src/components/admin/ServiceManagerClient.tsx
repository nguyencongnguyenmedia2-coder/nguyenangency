"use client";

import React, { useState } from "react";
import {
  saveService,
  deleteService,
  updateServiceStatus,
} from "@/app/actions/admin-cms-actions";
import ImageUploadField from "@/components/admin/ImageUploadField";
import AIWriterModal from "@/components/admin/AIWriterModal";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  X,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  Eye,
  Loader2,
  Sparkles,
} from "lucide-react";

function formatJsonArrayToLines(jsonStr?: string): string {
  if (!jsonStr) return "";
  try {
    const arr = JSON.parse(jsonStr);
    if (Array.isArray(arr)) {
      return arr
        .map((item) =>
          typeof item === "string" ? item : item.title || item.name || ""
        )
        .filter(Boolean)
        .join("\n");
    }
  } catch {
    // ignore
  }
  return "";
}

export default function ServiceManagerClient({
  initialServices,
  categories,
}: {
  initialServices: any[];
  categories: any[];
}) {
  const [services, setServices] = useState(initialServices);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGroup, setFilterGroup] = useState("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleStatusChange(id: string, newStatus: string) {
    setStatusUpdatingId(id);
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    const res = await updateServiceStatus(id, newStatus);
    setStatusUpdatingId(null);
    if (!res.success) {
      alert(res.error || "Không thể cập nhật trạng thái");
      window.location.reload();
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  function handleApplyAI(aiData: any) {
    setEditingService((prev: any) => ({
      ...prev,
      title: aiData.title || prev?.title || "",
      tagline: aiData.tagline || prev?.tagline || "",
      shortDesc: aiData.shortDesc || prev?.shortDesc || "",
      description: aiData.description || prev?.description || "",
      featuresJson: aiData.features
        ? JSON.stringify(aiData.features)
        : prev?.featuresJson,
      benefitsJson: aiData.benefits
        ? JSON.stringify(aiData.benefits)
        : prev?.benefitsJson,
      estimatedTime: aiData.estimatedTime || prev?.estimatedTime || "2 - 4 tuần",
      priceLabel: aiData.priceLabel || prev?.priceLabel || "Từ 35.000.000 VNĐ",
    }));
    setFormKey((k) => k + 1);
  }

  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const filtered = services.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.shortDesc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = filterGroup === "ALL" || s.group === filterGroup;
    return matchesSearch && matchesGroup;
  });

  function parseGallery(jsonStr?: string): string[] {
    if (!jsonStr) return [];
    try {
      const parsed = JSON.parse(jsonStr);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function handleOpenCreate() {
    setEditingService(null);
    setGalleryImages([]);
    setErrorMsg("");
    setIsModalOpen(true);
  }

  function handleOpenEdit(service: any) {
    setEditingService(service);
    setGalleryImages(parseGallery(service.galleryJson));
    setErrorMsg("");
    setIsModalOpen(true);
  }

  function addGalleryImage(url: string) {
    if (!url.trim()) return;
    setGalleryImages((prev) => [...prev, url.trim()]);
  }

  function removeGalleryImage(index: number) {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    if (editingService?.id) {
      formData.append("id", editingService.id);
    }

    const currentThumb = formData.get("thumbnail")?.toString().trim();
    const currentStatus = formData.get("status")?.toString();

    if (currentStatus === "PUBLISHED" && (!currentThumb || currentThumb === "")) {
      setIsSubmitting(false);
      setErrorMsg("Dịch vụ xuất bản bắt buộc phải có ảnh đại diện (Thumbnail). Vui lòng tải lên hoặc dán URL ảnh trước khi lưu.");
      return;
    }

    formData.set("galleryJson", JSON.stringify(galleryImages));

    const res = await saveService(formData);
    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      window.location.reload();
    } else {
      setErrorMsg(res.error || "Lỗi lưu dịch vụ.");
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await deleteService(deleteTarget.id);
    setIsDeleting(false);

    if (res.success) {
      setDeleteTarget(null);
      window.location.reload();
    } else {
      alert(res.error || "Không thể xóa dịch vụ này.");
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
              placeholder="Tìm theo tên dịch vụ, mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
            />
          </div>

          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none"
          >
            <option value="ALL">Tất Cả Nhóm</option>
            <option value="MEDIA">Nhóm MEDIA</option>
            <option value="TECH">Nhóm TECH</option>
          </select>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => {
              handleOpenCreate();
              setIsAIModalOpen(true);
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#007BA7]/30 to-[#FF2D95]/30 hover:from-[#007BA7] hover:to-[#FF2D95] border border-[#007BA7]/50 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-glow-cyan shrink-0"
          >
            <Sparkles className="w-4 h-4 text-[#FF2D95] animate-pulse" />
            <span>AI Soạn Thảo</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white text-xs font-mono font-bold uppercase tracking-wider hover:shadow-glow-pink transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Dịch Vụ Mới</span>
          </button>
        </div>
      </div>

      {/* Services Table */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#121212] border border-[#292929]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#292929] text-[#71717A] font-mono">
                <th className="py-3 px-4">HÌNH ẢNH</th>
                <th className="py-3 px-4">TÊN DỊCH VỤ</th>
                <th className="py-3 px-4">NHÓM</th>
                <th className="py-3 px-4">THỜI GIAN</th>
                <th className="py-3 px-4">GIÁ THAM KHẢO</th>
                <th className="py-3 px-4">TRẠNG THÁI</th>
                <th className="py-3 px-4">NỔI BẬT</th>
                <th className="py-3 px-4 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292929]">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#171717] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="relative w-12 h-8 rounded-lg overflow-hidden bg-[#171717] border border-[#292929] shrink-0">
                        {s.thumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={s.thumbnail}
                            alt={s.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] text-[#71717A] font-mono">
                            N/A
                          </div>
                        )}
                      </div>
                      <div>
                        {s.thumbnail ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                            ✓ Có ảnh
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-red-950/60 text-red-400 border border-red-500/30">
                            <AlertTriangle className="w-2.5 h-2.5" /> Thiếu ảnh
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white text-sm">
                    {s.title}
                    <span className="block text-[10px] font-mono text-[#71717A] font-normal">
                      /{s.slug}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        s.group === "MEDIA"
                          ? "bg-[#FF2D95]/20 text-[#FF2D95]"
                          : "bg-[#007BA7]/20 text-[#007BA7]"
                      }`}
                    >
                      {s.group}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#A1A1AA]">
                    {s.estimatedTime}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-white">
                    {s.priceLabel}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <select
                        value={s.status}
                        disabled={statusUpdatingId === s.id}
                        onChange={(e) => handleStatusChange(s.id, e.target.value)}
                        className={`px-2 py-1 rounded text-[10px] font-mono font-bold border transition-colors cursor-pointer focus:outline-none ${
                          s.status === "PUBLISHED"
                            ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/40"
                            : s.status === "DRAFT"
                            ? "bg-amber-950/60 text-amber-300 border-amber-500/40"
                            : s.status === "ARCHIVED"
                            ? "bg-red-950/60 text-red-400 border-red-500/40"
                            : "bg-[#202020] text-[#71717A] border-[#292929]"
                        }`}
                      >
                        <option value="PUBLISHED">PUBLISHED</option>
                        <option value="DRAFT">DRAFT</option>
                        <option value="INACTIVE">INACTIVE</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                      {statusUpdatingId === s.id && (
                        <Loader2 className="w-3 h-3 text-[#007BA7] animate-spin" />
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {s.isFeatured ? (
                      <CheckCircle2 className="w-4 h-4 text-[#007BA7]" />
                    ) : (
                      <span className="text-[#71717A]">--</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`/services/${s.slug}?preview=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#007BA7] text-[#A1A1AA] hover:text-white transition-colors"
                        title="Xem trước trang chi tiết (Preview)"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`/services/${s.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#007BA7] text-[#A1A1AA] hover:text-white transition-colors"
                        title="Xem trên website"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleCopy(`/services/${s.slug}`, s.id)}
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#171717] text-[#A1A1AA] hover:text-white transition-colors"
                        title="Sao chép URL"
                      >
                        {copiedId === s.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#007BA7] text-[#A1A1AA] hover:text-white transition-colors"
                        title="Chỉnh sửa dịch vụ"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(s)}
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-red-950/60 text-[#A1A1AA] hover:text-red-400 transition-colors"
                        title="Xóa dịch vụ"
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

      {/* CREATE / EDIT SERVICE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#292929] rounded-3xl w-full max-w-2xl p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-[#71717A] hover:text-white hover:bg-[#171717]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pr-8">
              <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                {editingService
                  ? "Chỉnh Sửa Trang Chi Tiết Dịch Vụ CMS"
                  : "Thêm Dịch Vụ Mới Vào Website"}
              </h3>
              <button
                type="button"
                onClick={() => setIsAIModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#007BA7]/20 to-[#FF2D95]/20 hover:from-[#007BA7]/40 hover:to-[#FF2D95]/40 border border-[#007BA7]/50 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-glow-cyan w-fit"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF2D95] animate-pulse" />
                <span>✨ AI Viết Dịch Vụ Này</span>
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            <form key={formKey} onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Tên dịch vụ *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingService?.title || ""}
                    placeholder="VD: 3D Holographic Web"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none focus:border-[#007BA7]"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Đường dẫn Slug (URL)
                  </label>
                  <input
                    type="text"
                    name="slug"
                    defaultValue={editingService?.slug || ""}
                    placeholder="Tự sinh nếu bỏ trống (vd: 3d-holographic-web)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white font-mono text-xs focus:outline-none focus:border-[#007BA7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Nhóm lĩnh vực
                  </label>
                  <select
                    name="group"
                    defaultValue={editingService?.group || "MEDIA"}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  >
                    <option value="MEDIA">MEDIA & SÁNG TẠO</option>
                    <option value="TECH">TECH & PHẦN MỀM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Tagline định vị
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    defaultValue={editingService?.tagline || ""}
                    placeholder="VD: Định vị vị thế khác biệt của thương hiệu"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Section Hình ảnh & Media */}
              <div className="p-4 rounded-2xl bg-[#0F0F0F] border border-[#292929] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#007BA7] uppercase tracking-wider font-bold">
                    HỆ THỐNG HÌNH ẢNH DỊCH VỤ (SUPABASE STORAGE)
                  </span>
                  <span className="text-[10px] font-mono text-[#71717A]">
                    Chuẩn Luxury Agency • Bucket: nguyen-agency-media
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <ImageUploadField
                      name="thumbnail"
                      label="1. Ảnh Đại Diện Thumbnail * (Bắt buộc khi xuất bản)"
                      defaultValue={editingService?.thumbnail || ""}
                      folder="services"
                      placeholder="https://... hoặc tải file lên"
                    />
                  </div>
                  <div>
                    <ImageUploadField
                      name="coverImage"
                      label="2. Ảnh Bìa Banner Lớn (Hero Cover)"
                      defaultValue={editingService?.coverImage || ""}
                      folder="services"
                      placeholder="https://... hoặc tải file lên"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase text-[11px] mb-1">
                    Mô Tả ALT Hình Ảnh (Chuẩn SEO & Tiếp cận)
                  </label>
                  <input
                    type="text"
                    name="altText"
                    defaultValue={editingService?.altText || ""}
                    placeholder="VD: Thiết Kế Bộ Nhận Diện Thương Hiệu Độc Bản NGUYÊN AGENCY"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs font-mono focus:outline-none focus:border-[#007BA7]"
                  />
                </div>

                {/* Thư viện ảnh chi tiết (Gallery) */}
                <div className="pt-2 border-t border-[#202020] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[#A1A1AA] font-mono uppercase text-[11px]">
                      3. Thư Viện Ảnh Bổ Sung ({galleryImages.length} ảnh)
                    </label>
                  </div>

                  {galleryImages.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {galleryImages.map((gUrl, idx) => (
                        <div
                          key={idx}
                          className="group relative aspect-video rounded-lg overflow-hidden bg-[#171717] border border-[#292929]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={gUrl}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(idx)}
                            className="absolute top-1 right-1 p-1 rounded-md bg-black/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Xóa ảnh này"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      id="newGalleryInput"
                      type="text"
                      placeholder="Dán link ảnh bổ sung hoặc tải lên..."
                      className="flex-1 px-3 py-1.5 rounded-lg bg-[#171717] border border-[#292929] text-white text-xs font-mono focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById("newGalleryInput") as HTMLInputElement;
                        if (input && input.value) {
                          addGalleryImage(input.value);
                          input.value = "";
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#202020] hover:bg-[#007BA7] text-white text-xs font-mono uppercase transition-colors"
                    >
                      + Thêm Ảnh
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Thời gian triển khai
                  </label>
                  <input
                    type="text"
                    name="estimatedTime"
                    defaultValue={editingService?.estimatedTime || "2 - 4 tuần"}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Giá tham khảo hiển thị
                  </label>
                  <input
                    type="text"
                    name="priceLabel"
                    defaultValue={
                      editingService?.priceLabel || "Từ 35.000.000 VNĐ"
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Trạng thái hiển thị
                  </label>
                  <select
                    name="status"
                    defaultValue={editingService?.status || "PUBLISHED"}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  >
                    <option value="PUBLISHED">PUBLISHED (Xuất bản lên website)</option>
                    <option value="DRAFT">DRAFT (Bản nháp nội bộ)</option>
                    <option value="INACTIVE">INACTIVE (Tạm ngừng)</option>
                    <option value="ARCHIVED">ARCHIVED (Lưu trữ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Vị trí nổi bật
                  </label>
                  <select
                    name="isFeatured"
                    defaultValue={editingService?.isFeatured ? "true" : "false"}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  >
                    <option value="false">Bình thường</option>
                    <option value="true">
                      Hiển thị ở Bento Grid Trang Chủ
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                  Mô tả ngắn (Hero Lead) *
                </label>
                <textarea
                  name="shortDesc"
                  required
                  rows={2}
                  defaultValue={editingService?.shortDesc || ""}
                  placeholder="Mô tả tóm tắt dịch vụ..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                  Nội dung Overview chi tiết
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingService?.description || ""}
                  placeholder="Chi tiết quy trình, công nghệ ứng dụng..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Hạng mục bàn giao (Mỗi dòng 1 mục)
                  </label>
                  <textarea
                    name="featuresJson"
                    rows={3}
                    defaultValue={formatJsonArrayToLines(
                      editingService?.featuresJson
                    )}
                    placeholder="Nghiên cứu thị trường&#10;Thiết kế 3 concept độc bản"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Lợi ích nổi bật (Mỗi dòng 1 mục)
                  </label>
                  <textarea
                    name="benefitsJson"
                    rows={3}
                    defaultValue={formatJsonArrayToLines(
                      editingService?.benefitsJson
                    )}
                    placeholder="Tăng 300% nhận diện thương hiệu&#10;Bàn giao 100% file gốc"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    name="metaTitle"
                    defaultValue={editingService?.metaTitle || ""}
                    placeholder="Tùy chọn tiêu đề SEO..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    SEO Meta Description
                  </label>
                  <input
                    type="text"
                    name="metaDescription"
                    defaultValue={editingService?.metaDescription || ""}
                    placeholder="Tùy chọn mô tả SEO..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  />
                </div>
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
                  {isSubmitting ? "Đang lưu..." : "Lưu Dịch Vụ"}
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
            <h4 className="text-lg font-bold text-white uppercase">
              Xác Nhận Xóa Dịch Vụ
            </h4>
            <p className="text-xs text-[#A1A1AA]">
              Bạn có chắc chắn muốn xóa dịch vụ{" "}
              <strong className="text-white">{deleteTarget.title}</strong>? Dịch
              vụ này sẽ lập tức biến mất khỏi trang web công khai.
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
      {/* AI WRITER MODAL */}
      <AIWriterModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        type="service"
        title="Trợ Lý AI Soạn Thảo Nội Dung Dịch Vụ"
        defaultTopic={editingService?.title || ""}
        extraContext={{
          currentTitle: editingService?.title || "",
          currentGroup: editingService?.group || "MEDIA",
        }}
        onApply={handleApplyAI}
      />
    </div>
  );
}
