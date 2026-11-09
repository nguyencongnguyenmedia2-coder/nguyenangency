"use client";

import React, { useState } from "react";
import { saveMediaAsset, deleteMediaAsset } from "@/app/actions/admin-system-actions";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { Plus, Trash2, Search, X, Copy, Check, AlertTriangle, ExternalLink, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface MediaItem {
  id: string;
  title: string;
  url: string;
  mimeType: string;
  folder?: string | null;
  createdAt: Date | string;
}

export default function MediaManagerClient({ initialAssets }: { initialAssets: MediaItem[] }) {
  const [assets, setAssets] = useState<MediaItem[]>(initialAssets);
  const [searchTerm, setSearchTerm] = useState("");
  const [folderFilter, setFolderFilter] = useState("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const folders = Array.from(new Set(assets.map((a) => a.folder || "general")));

  const filtered = assets.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = folderFilter === "ALL" || (a.folder || "general") === folderFilter;
    return matchesSearch && matchesFolder;
  });

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const res = await saveMediaAsset(formData);
    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      window.location.reload();
    } else {
      setErrorMsg(res.error || "Lỗi lưu file media.");
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await deleteMediaAsset(deleteTarget.id);
    setIsDeleting(false);

    if (res.success) {
      setDeleteTarget(null);
      window.location.reload();
    } else {
      alert(res.error || "Không thể xóa file media này.");
    }
  }

  function handleCopy(url: string, id: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
              placeholder="Tìm theo tên hoặc URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
            />
          </div>

          <select
            value={folderFilter}
            onChange={(e) => setFolderFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-xs text-white focus:outline-none focus:border-[#007BA7]"
          >
            <option value="ALL">Tất cả thư mục</option>
            {folders.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
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
          <span>Thêm Media Mới</span>
        </button>
      </div>

      {/* Grid */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#121212] border border-[#292929]">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#71717A]">
            Chưa có media nào trong danh sách.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl bg-[#171717] border border-[#292929] hover:border-[#383838] overflow-hidden p-3 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#202020] mb-2.5">
                    {item.mimeType.startsWith("image") ? (
                      <Image
                        src={item.url}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#71717A]">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <strong className="text-white text-xs block truncate" title={item.title}>
                    {item.title}
                  </strong>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#71717A] mt-1">
                    <span>{item.folder || "general"}</span>
                    <span>{item.mimeType.split("/")[1] || "file"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-[#292929]">
                  <button
                    onClick={() => handleCopy(item.url, item.id)}
                    className="p-1.5 rounded-lg bg-[#121212] hover:bg-[#202020] text-[#A1A1AA] hover:text-white border border-[#292929] transition-colors flex items-center gap-1 text-[10px] font-mono"
                    title="Sao chép URL"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-[#121212] hover:bg-[#202020] text-[#A1A1AA] hover:text-white border border-[#292929] transition-colors"
                      title="Mở xem"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-1.5 rounded-lg bg-[#121212] hover:bg-red-500/20 text-[#71717A] hover:text-red-400 border border-[#292929] transition-colors"
                      title="Xóa media"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
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
              <ImageIcon className="w-5 h-5 text-[#FF2D95]" />
              Thêm Media Vào Thư Viện
            </h3>
            <p className="text-xs text-[#A1A1AA] mb-6">
              Đồng bộ hình ảnh, banner, video preview hoặc tài liệu dùng chung cho NGUYÊN AGENCY.
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
                  Tên File / Tiêu Đề Media *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="VD: Hero 3D Preview Banner"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                />
              </div>

              <div>
                <ImageUploadField
                  name="url"
                  label="Tập tin / Đường dẫn URL *"
                  folder="media"
                  placeholder="https://... hoặc tải ảnh từ máy tính lên"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                    Loại Định Dạng (MIME Type)
                  </label>
                  <select
                    name="mimeType"
                    defaultValue="image/jpeg"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                  >
                    <option value="image/jpeg">image/jpeg</option>
                    <option value="image/png">image/png</option>
                    <option value="image/webp">image/webp</option>
                    <option value="video/mp4">video/mp4</option>
                    <option value="application/pdf">application/pdf</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                    Thư Mục (Folder)
                  </label>
                  <input
                    type="text"
                    name="folder"
                    defaultValue="general"
                    placeholder="VD: portfolio, services, lab..."
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
                  {isSubmitting ? "Đang thêm..." : "Thêm Vào Thư Viện"}
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
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">Xóa Media</h3>
            </div>
            <p className="text-xs text-[#A1A1AA] mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa media <strong className="text-white">{deleteTarget.title}</strong> khỏi thư viện?
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
                {isDeleting ? "Đang xóa..." : "Xóa Media"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

