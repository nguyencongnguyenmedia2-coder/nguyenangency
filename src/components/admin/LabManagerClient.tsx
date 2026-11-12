"use client";

import React, { useState } from "react";
import {
  saveLabProduct,
  deleteLabProduct,
  updateLabProductStatus,
} from "@/app/actions/admin-cms-actions";
import ImageUploadField from "@/components/admin/ImageUploadField";
import AIWriterModal from "@/components/admin/AIWriterModal";
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Cpu,
  X,
  AlertTriangle,
  Copy,
  Check,
  Eye,
  Loader2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

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

export default function LabManagerClient({
  initialProducts,
}: {
  initialProducts: any[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [editingProd, setEditingProd] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  function handleApplyAI(aiData: any) {
    setEditingProd((prev: any) => ({
      ...prev,
      name: aiData.name || prev?.name || "",
      productStage: aiData.productStage || prev?.productStage || "BETA",
      version: aiData.version || prev?.version || "v1.0",
      shortDesc: aiData.shortDesc || prev?.shortDesc || "",
      description: aiData.description || prev?.description || "",
      featuresJson: aiData.features
        ? JSON.stringify(aiData.features)
        : prev?.featuresJson,
      techStackJson: aiData.techStack
        ? JSON.stringify(aiData.techStack)
        : prev?.techStackJson,
      demoUrl: aiData.demoUrl || prev?.demoUrl || "",
    }));
    setFormKey((k) => k + 1);
  }

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleStatusChange(id: string, newStatus: string) {
    setStatusUpdatingId(id);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
    const res = await updateLabProductStatus(id, newStatus);
    setStatusUpdatingId(null);
    if (!res.success) {
      alert(res.error || "Không thể cập nhật trạng thái");
      window.location.reload();
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    if (editingProd?.id) {
      formData.append("id", editingProd.id);
    }

    const res = await saveLabProduct(formData);
    setIsSubmitting(false);

    if (res.success) {
      setEditingProd(null);
      window.location.reload();
    } else {
      setErrorMsg(res.error || "Lỗi lưu sản phẩm LAB.");
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await deleteLabProduct(deleteTarget.id);
    setIsDeleting(false);

    if (res.success) {
      setDeleteTarget(null);
      window.location.reload();
    } else {
      alert(res.error || "Không thể xóa sản phẩm này.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Create / Edit Product Form */}
        <div className="lg:col-span-5">
          <div className="p-8 rounded-3xl bg-[#121212] border border-[#292929]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#FF2D95]" />
                <span>
                  {editingProd
                    ? `Chỉnh Sửa: ${editingProd.name}`
                    : "Thêm Sản Phẩm Mới Vào LAB"}
                </span>
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAIModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#007BA7]/20 to-[#FF2D95]/20 hover:from-[#007BA7]/40 hover:to-[#FF2D95]/40 border border-[#007BA7]/50 text-white text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all shadow-glow-cyan"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FF2D95] animate-pulse" />
                  <span>✨ AI Soạn Thảo</span>
                </button>
                {editingProd && (
                  <button
                    type="button"
                    onClick={() => setEditingProd(null)}
                    className="text-xs font-mono text-[#A1A1AA] hover:text-white px-2 py-1 rounded bg-[#171717]"
                  >
                    Hủy sửa
                  </button>
                )}
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            <form
              key={`${editingProd?.id || "new"}-${formKey}`}
              onSubmit={handleSave}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={editingProd?.name || ""}
                    placeholder="VD: Nova Motion AI"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none focus:border-[#FF2D95]"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Đường dẫn Slug (URL)
                  </label>
                  <input
                    type="text"
                    name="slug"
                    defaultValue={editingProd?.slug || ""}
                    placeholder="Tự sinh nếu bỏ trống (vd: nova-motion-ai)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white font-mono text-xs focus:outline-none focus:border-[#FF2D95]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                  Tagline định vị
                </label>
                <input
                  type="text"
                  name="tagline"
                  defaultValue={editingProd?.tagline || ""}
                  placeholder="VD: Next-Gen Motion Synthesis"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none focus:border-[#FF2D95]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Trạng thái Stage
                  </label>
                  <select
                    name="productStage"
                    defaultValue={editingProd?.productStage || "LIVE"}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  >
                    <option value="LIVE">Live</option>
                    <option value="BETA">Beta</option>
                    <option value="DEVELOPING">Developing</option>
                    <option value="IDEA">Idea</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Phiên bản
                  </label>
                  <input
                    type="text"
                    name="version"
                    defaultValue={editingProd?.version || "v1.0"}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Xuất bản
                  </label>
                  <select
                    name="status"
                    defaultValue={editingProd?.status || "PUBLISHED"}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Mô hình giá
                  </label>
                  <input
                    type="text"
                    name="pricingModel"
                    defaultValue={
                      editingProd?.pricingModel || "Freemium / SaaS"
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white"
                  />
                </div>
                <div>
                  <ImageUploadField
                    name="thumbnail"
                    label="Ảnh Thumbnail Sản Phẩm (Chuẩn tỉ lệ 16:9 • VD: 1920x1080)"
                    defaultValue={editingProd?.thumbnail || ""}
                    folder="lab"
                    placeholder="https://images.unsplash.com/... hoặc chọn upload"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Link Demo (View Demo)
                  </label>
                  <input
                    type="url"
                    name="demoUrl"
                    defaultValue={editingProd?.demoUrl || ""}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Link Sản Phẩm (Try Product)
                  </label>
                  <input
                    type="url"
                    name="websiteUrl"
                    defaultValue={editingProd?.websiteUrl || ""}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                  Mô tả ngắn *
                </label>
                <textarea
                  name="shortDesc"
                  required
                  rows={2}
                  defaultValue={editingProd?.shortDesc || ""}
                  placeholder="Tóm tắt công nghệ và giá trị cốt lõi của sản phẩm..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                  Mô tả kiến trúc chi tiết
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingProd?.description || ""}
                  placeholder="Chi tiết kiến trúc và bài toán sản phẩm giải quyết..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Tính năng (Mỗi dòng 1 mục)
                  </label>
                  <textarea
                    name="featuresJson"
                    rows={3}
                    defaultValue={formatJsonArrayToLines(
                      editingProd?.featuresJson
                    )}
                    placeholder="Chuyển đổi Text sang 3D&#10;Xuất file 4K 60fps"
                    className="w-full px-3 py-2 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Tech Stack (Mỗi dòng 1 mục)
                  </label>
                  <textarea
                    name="techStackJson"
                    rows={3}
                    defaultValue={formatJsonArrayToLines(
                      editingProd?.techStackJson
                    )}
                    placeholder="Next.js&#10;WebGPU&#10;Three.js"
                    className="w-full px-3 py-2 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-mono uppercase font-bold tracking-wider hover:shadow-glow-pink transition-all"
              >
                {isSubmitting
                  ? "Đang lưu..."
                  : editingProd
                  ? "Cập Nhật Sản Phẩm LAB"
                  : "Xuất Bản Lên /lab"}
              </button>
            </form>
          </div>
        </div>

        {/* Products List & Actions */}
        <div className="lg:col-span-7">
          <div className="p-8 rounded-3xl bg-[#121212] border border-[#292929]">
            <h2 className="text-base font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#007BA7]" />
              <span>
                Sản Phẩm Đang Hiển Thị Trên Website ({products.length})
              </span>
            </h2>

            <div className="space-y-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl bg-[#171717] border border-[#292929] flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white text-sm">
                        {p.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#007BA7]/20 text-[#007BA7] border border-[#007BA7]/30">
                        {p.productStage}
                      </span>
                      <span className="text-[10px] font-mono text-[#71717A]">
                        {p.version}
                      </span>
                      <select
                        value={p.status}
                        disabled={statusUpdatingId === p.id}
                        onChange={(e) => handleStatusChange(p.id, e.target.value)}
                        className={`ml-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors cursor-pointer focus:outline-none ${
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
                    <p className="text-xs text-[#A1A1AA] line-clamp-1">
                      {p.shortDesc}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link
                      href={`/lab/${p.slug}?preview=true`}
                      target="_blank"
                      className="p-2 rounded-lg bg-[#202020] hover:bg-[#007BA7] text-[#A1A1AA] hover:text-white transition-colors"
                      title="Xem trước trang chi tiết (Preview)"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/lab/${p.slug}`}
                      target="_blank"
                      className="p-2 rounded-lg bg-[#202020] hover:bg-[#007BA7] text-[#A1A1AA] hover:text-white transition-colors"
                      title="Xem trang sản phẩm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleCopy(`/lab/${p.slug}`, p.id)}
                      className="p-2 rounded-lg bg-[#202020] hover:bg-[#171717] text-[#A1A1AA] hover:text-white transition-colors"
                      title="Sao chép URL"
                    >
                      {copiedId === p.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => setEditingProd(p)}
                      className="p-2 rounded-lg bg-[#202020] hover:bg-[#007BA7] text-[#A1A1AA] hover:text-white transition-colors"
                      title="Chỉnh sửa sản phẩm"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(p)}
                      className="p-2 rounded-lg bg-[#202020] hover:bg-red-950/60 text-[#A1A1AA] hover:text-red-400 transition-colors"
                      title="Xóa sản phẩm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRM */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#292929] rounded-3xl w-full max-w-md p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-950/50 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white uppercase">
              Xác Nhận Xóa Sản Phẩm LAB
            </h4>
            <p className="text-xs text-[#A1A1AA]">
              Bạn có chắc chắn muốn xóa sản phẩm{" "}
              <strong className="text-white">{deleteTarget.name}</strong>? Sản
              phẩm này sẽ lập tức biến mất khỏi trang /lab công khai.
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
        type="lab"
        title="Trợ Lý AI Soạn Thảo Sản Phẩm Thử Nghiệm LAB"
        defaultTopic={editingProd?.name || ""}
        extraContext={{
          currentName: editingProd?.name || "",
          currentStage: editingProd?.productStage || "BETA",
        }}
        onApply={handleApplyAI}
      />
    </div>
  );
}
