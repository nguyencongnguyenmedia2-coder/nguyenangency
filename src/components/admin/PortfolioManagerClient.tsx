"use client";

import React, { useState } from "react";
import {
  savePortfolio,
  deletePortfolio,
  updatePortfolioStatus,
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
        .map((item) => (typeof item === "string" ? item : ""))
        .filter(Boolean)
        .join("\n");
    }
  } catch {
    // ignore
  }
  return "";
}

export default function PortfolioManagerClient({
  initialPortfolios,
  categories,
}: {
  initialPortfolios: any[];
  categories: any[];
}) {
  const [portfolios, setPortfolios] = useState(initialPortfolios);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleStatusChange(id: string, newStatus: string) {
    setStatusUpdatingId(id);
    setPortfolios((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
    const res = await updatePortfolioStatus(id, newStatus);
    setStatusUpdatingId(null);
    if (!res.success) {
      alert(res.error || "Không thể cập nhật trạng thái");
      window.location.reload();
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  function handleApplyAI(aiData: any) {
    setEditingItem((prev: any) => ({
      ...prev,
      title: aiData.title || prev?.title || "",
      clientName: aiData.clientName || prev?.clientName || "",
      year: aiData.year || prev?.year || "2026",
      shortDesc: aiData.shortDesc || prev?.shortDesc || "",
      objective: aiData.objective || prev?.objective || "",
      challenge: aiData.challenge || prev?.challenge || "",
      solution: aiData.solution || prev?.solution || "",
      technologiesJson: aiData.technologies
        ? JSON.stringify(aiData.technologies)
        : prev?.technologiesJson,
      resultsJson: aiData.results
        ? JSON.stringify(aiData.results)
        : prev?.resultsJson,
    }));
    setFormKey((k) => k + 1);
  }

  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = portfolios.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.shortDesc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleOpenCreate() {
    setEditingItem(null);
    setErrorMsg("");
    setIsModalOpen(true);
  }

  function handleOpenEdit(item: any) {
    setEditingItem(item);
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

    const res = await savePortfolio(formData);
    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      window.location.reload();
    } else {
      setErrorMsg(res.error || "Lỗi lưu portfolio.");
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await deletePortfolio(deleteTarget.id);
    setIsDeleting(false);

    if (res.success) {
      setDeleteTarget(null);
      window.location.reload();
    } else {
      alert(res.error || "Không thể xóa dự án này.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Tìm theo tên dự án, đối tác..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
          />
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
            <span>Thêm Dự Án Mới</span>
          </button>
        </div>
      </div>

      {/* Portfolio Table */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#121212] border border-[#292929]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#292929] text-[#71717A] font-mono">
                <th className="py-3 px-4">TÊN DỰ ÁN</th>
                <th className="py-3 px-4">ĐỐI TÁC KHÁCH HÀNG</th>
                <th className="py-3 px-4">DANH MỤC</th>
                <th className="py-3 px-4">NĂM</th>
                <th className="py-3 px-4">NỔI BẬT</th>
                <th className="py-3 px-4">TRẠNG THÁI</th>
                <th className="py-3 px-4 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292929]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#171717] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white text-sm">
                    {p.title}
                    <span className="block text-[10px] font-mono text-[#71717A] font-normal">
                      /{p.slug}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#007BA7] font-semibold">
                    {p.clientName}
                  </td>
                  <td className="py-3.5 px-4 text-[#A1A1AA]">
                    {p.category?.name || "Web App"}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#71717A]">
                    {p.year}
                  </td>
                  <td className="py-3.5 px-4">
                    {p.isFeatured ? (
                      <CheckCircle2 className="w-4 h-4 text-[#007BA7]" />
                    ) : (
                      <span className="text-[#71717A]">--</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <select
                        value={p.status}
                        disabled={statusUpdatingId === p.id}
                        onChange={(e) => handleStatusChange(p.id, e.target.value)}
                        className={`px-2 py-1 rounded text-[10px] font-mono font-bold border transition-colors cursor-pointer focus:outline-none ${
                          p.status === "PUBLISHED"
                            ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/40"
                            : p.status === "DRAFT"
                            ? "bg-amber-950/60 text-amber-300 border-amber-500/40"
                            : p.status === "ARCHIVED"
                            ? "bg-red-950/60 text-red-400 border-red-500/40"
                            : "bg-[#202020] text-[#71717A] border-[#292929]"
                        }`}
                      >
                        <option value="PUBLISHED">PUBLISHED</option>
                        <option value="DRAFT">DRAFT</option>
                        <option value="INACTIVE">INACTIVE</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                      {statusUpdatingId === p.id && (
                        <Loader2 className="w-3 h-3 text-[#007BA7] animate-spin" />
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`/portfolio/${p.slug}?preview=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#007BA7] text-[#A1A1AA] hover:text-white transition-colors"
                        title="Xem trước Case Study (Preview)"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`/portfolio/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#007BA7] text-[#A1A1AA] hover:text-white transition-colors"
                        title="Xem trên website"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleCopy(`/portfolio/${p.slug}`, p.id)}
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#171717] text-[#A1A1AA] hover:text-white transition-colors"
                        title="Sao chép URL"
                      >
                        {copiedId === p.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#007BA7] text-[#A1A1AA] hover:text-white transition-colors"
                        title="Chỉnh sửa case study"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-red-950/60 text-[#A1A1AA] hover:text-red-400 transition-colors"
                        title="Xóa dự án"
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

      {/* MODAL CREATE / EDIT */}
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
                {editingItem
                  ? "Chỉnh Sửa Case Study Chi Tiết"
                  : "Thêm Dự Án Portfolio Mới"}
              </h3>
              <button
                type="button"
                onClick={() => setIsAIModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#007BA7]/20 to-[#FF2D95]/20 hover:from-[#007BA7]/40 hover:to-[#FF2D95]/40 border border-[#007BA7]/50 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-glow-cyan w-fit"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF2D95] animate-pulse" />
                <span>✨ AI Viết Case Study Này</span>
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
                    Tên dự án *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingItem?.title || ""}
                    placeholder="Nexus Global 3D Trading"
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
                    defaultValue={editingItem?.slug || ""}
                    placeholder="Tự sinh nếu bỏ trống (vd: nexus-3d-trading)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white font-mono text-xs focus:outline-none focus:border-[#007BA7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Tên khách hàng / Đối tác *
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    required
                    defaultValue={editingItem?.clientName || ""}
                    placeholder="Nexus FinTech Group"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Năm hoàn thành
                  </label>
                  <input
                    type="text"
                    name="year"
                    defaultValue={editingItem?.year || "2026"}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Danh mục
                  </label>
                  <select
                    name="categoryId"
                    defaultValue={
                      editingItem?.categoryId || categories[0]?.id || ""
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Trạng thái xuất bản
                  </label>
                  <select
                    name="status"
                    defaultValue={editingItem?.status || "PUBLISHED"}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  >
                    <option value="PUBLISHED">PUBLISHED (Hiển thị website)</option>
                    <option value="DRAFT">DRAFT (Bản nháp)</option>
                    <option value="INACTIVE">INACTIVE (Tạm ẩn)</option>
                    <option value="ARCHIVED">ARCHIVED (Lưu trữ)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Vị trí Featured
                  </label>
                  <select
                    name="isFeatured"
                    defaultValue={editingItem?.isFeatured ? "true" : "false"}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  >
                    <option value="false">Không</option>
                    <option value="true">
                      Hiển thị ở Showcase Trang Chủ
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    URL Website Trực Tuyến (Live Project)
                  </label>
                  <input
                    type="url"
                    name="liveUrl"
                    defaultValue={editingItem?.liveUrl || ""}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <ImageUploadField
                  name="thumbnail"
                  label="Ảnh Cover Thumbnail (Upload file hoặc nhập URL)"
                  defaultValue={editingItem?.thumbnail || ""}
                  folder="portfolio"
                  placeholder="https://images.unsplash.com/... hoặc chọn upload"
                />
              </div>

              <div>
                <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                  Mô tả ngắn (Hero Lead)
                </label>
                <textarea
                  name="shortDesc"
                  rows={2}
                  defaultValue={editingItem?.shortDesc || ""}
                  placeholder="Tóm tắt điểm nhấn của dự án..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    01. Objective (Mục tiêu)
                  </label>
                  <textarea
                    name="objective"
                    rows={3}
                    defaultValue={editingItem?.objective || ""}
                    placeholder="Mục tiêu dự án..."
                    className="w-full px-3 py-2 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    02. Challenge (Thách thức)
                  </label>
                  <textarea
                    name="challenge"
                    rows={3}
                    defaultValue={editingItem?.challenge || ""}
                    placeholder="Thách thức kỹ thuật / thị giác..."
                    className="w-full px-3 py-2 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    03. Solution (Giải pháp)
                  </label>
                  <textarea
                    name="solution"
                    rows={3}
                    defaultValue={editingItem?.solution || ""}
                    placeholder="Giải pháp triển khai..."
                    className="w-full px-3 py-2 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Tech Stack (Mỗi dòng 1 công nghệ)
                  </label>
                  <textarea
                    name="technologiesJson"
                    rows={3}
                    defaultValue={formatJsonArrayToLines(
                      editingItem?.technologiesJson
                    )}
                    placeholder="Next.js&#10;Three.js&#10;PostgreSQL"
                    className="w-full px-3 py-2 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Kết quả thực tế (Mỗi dòng 1 chỉ số)
                  </label>
                  <textarea
                    name="resultsJson"
                    rows={3}
                    defaultValue={formatJsonArrayToLines(
                      editingItem?.resultsJson
                    )}
                    placeholder="Tăng 180% thời gian on-site&#10;Đạt chuẩn 60 FPS"
                    className="w-full px-3 py-2 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Gallery URLs (Mỗi dòng 1 URL)
                  </label>
                  <textarea
                    name="galleryJson"
                    rows={3}
                    defaultValue={formatJsonArrayToLines(
                      editingItem?.galleryJson
                    )}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none resize-none"
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
                  {isSubmitting ? "Đang lưu..." : "Lưu Case Study"}
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
              Xác Nhận Xóa Dự Án
            </h4>
            <p className="text-xs text-[#A1A1AA]">
              Bạn có chắc chắn muốn xóa dự án{" "}
              <strong className="text-white">{deleteTarget.title}</strong>? Dự
              án này sẽ lập tức biến mất khỏi trang Portfolio công khai.
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
        type="portfolio"
        title="Trợ Lý AI Soạn Thảo Case Study Dự Án"
        defaultTopic={editingItem?.title || ""}
        extraContext={{
          currentTitle: editingItem?.title || "",
          currentClient: editingItem?.clientName || "",
        }}
        onApply={handleApplyAI}
      />
    </div>
  );
}
