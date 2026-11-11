"use client";

import React, { useState } from "react";
import {
  saveBlogPost,
  deleteBlogPost,
  updateBlogPostStatus,
} from "@/app/actions/admin-cms-actions";
import ImageUploadField from "@/components/admin/ImageUploadField";
import AIWriterModal from "@/components/admin/AIWriterModal";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
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
        .join(", ");
    }
  } catch {
    // ignore
  }
  return "";
}

export default function BlogManagerClient({
  initialPosts,
}: {
  initialPosts: any[];
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  function handleApplyAI(aiData: any) {
    let tagsArray: string[] = [];
    if (typeof aiData.tags === "string") {
      tagsArray = aiData.tags.split(",").map((s: string) => s.trim()).filter(Boolean);
    } else if (Array.isArray(aiData.tags)) {
      tagsArray = aiData.tags;
    }

    setEditingPost((prev: any) => ({
      ...prev,
      title: aiData.title || prev?.title || "",
      readTime: aiData.readTime || prev?.readTime || "5 phút đọc",
      tagsJson: tagsArray.length > 0 ? JSON.stringify(tagsArray) : prev?.tagsJson,
      excerpt: aiData.excerpt || prev?.excerpt || "",
      content: aiData.content || prev?.content || "",
    }));
    setFormKey((k) => k + 1);
  }

  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.slug && p.slug.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  function handleOpenCreate() {
    setEditingPost(null);
    setErrorMsg("");
    setIsModalOpen(true);
  }

  function handleOpenEdit(post: any) {
    setEditingPost(post);
    setErrorMsg("");
    setIsModalOpen(true);
  }

  async function handleStatusChange(id: string, newStatus: string) {
    setStatusUpdatingId(id);
    const res = await updateBlogPostStatus(id, newStatus);
    setStatusUpdatingId(null);

    if (res.success) {
      setPosts((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } else {
      alert(res.error || "Không thể cập nhật trạng thái bài viết.");
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    if (editingPost?.id) {
      formData.append("id", editingPost.id);
    }

    const res = await saveBlogPost(formData);
    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      window.location.reload();
    } else {
      setErrorMsg(res.error || "Lỗi lưu bài viết.");
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await deleteBlogPost(deleteTarget.id);
    setIsDeleting(false);

    if (res.success) {
      setDeleteTarget(null);
      window.location.reload();
    } else {
      alert(res.error || "Không thể xóa bài viết này.");
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
            placeholder="Tìm theo tiêu đề, slug, tóm tắt..."
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
            <span>Thêm Bài Viết Mới</span>
          </button>
        </div>
      </div>

      {/* Posts Table */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#121212] border border-[#292929]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#292929] text-[#71717A] font-mono">
                <th className="py-3.5 px-4">TIÊU ĐỀ BÀI VIẾT</th>
                <th className="py-3.5 px-4">CHUYÊN MỤC</th>
                <th className="py-3.5 px-4">TÁC GIẢ</th>
                <th className="py-3.5 px-4">THỜI GIAN ĐỌC</th>
                <th className="py-3.5 px-4">TRẠNG THÁI</th>
                <th className="py-3.5 px-4 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292929]">
              {filtered.map((post) => (
                <tr key={post.id} className="hover:bg-[#171717] transition-colors">
                  <td className="py-4 px-4 font-bold text-white text-sm">
                    {post.title}
                    <span className="block text-[10px] font-mono text-[#71717A] font-normal">
                      /{post.slug}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[#007BA7] font-mono">
                    {post.category?.name || "Công nghệ & AI"}
                  </td>
                  <td className="py-4 px-4 text-[#A1A1AA]">{post.authorName}</td>
                  <td className="py-4 px-4 font-mono text-[#71717A]">
                    {post.readTime}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      <select
                        value={post.status}
                        disabled={statusUpdatingId === post.id}
                        onChange={(e) => handleStatusChange(post.id, e.target.value)}
                        className={`px-2 py-1 rounded text-[10px] font-mono font-bold border transition-colors cursor-pointer focus:outline-none ${
                          post.status === "PUBLISHED"
                            ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/40"
                            : post.status === "DRAFT"
                            ? "bg-amber-950/60 text-amber-300 border-amber-500/40"
                            : post.status === "ARCHIVED"
                            ? "bg-red-950/60 text-red-400 border-red-500/40"
                            : "bg-[#202020] text-[#71717A] border-[#292929]"
                        }`}
                      >
                        <option value="PUBLISHED">ĐÃ XUẤT BẢN</option>
                        <option value="DRAFT">BẢN NHÁP</option>
                        <option value="INACTIVE">TẠM ẨN</option>
                        <option value="ARCHIVED">LƯU TRỮ</option>
                      </select>
                      {statusUpdatingId === post.id && (
                        <Loader2 className="w-3 h-3 text-[#007BA7] animate-spin" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`/blog/${post.slug}?preview=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#007BA7] text-[#A1A1AA] hover:text-white transition-colors"
                        title="Xem trước bài viết (Preview)"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#007BA7] text-[#A1A1AA] hover:text-white transition-colors"
                        title="Xem bài viết trên website"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleCopy(`/blog/${post.slug}`, post.id)}
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#171717] text-[#A1A1AA] hover:text-white transition-colors"
                        title="Sao chép URL"
                      >
                        {copiedId === post.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleOpenEdit(post)}
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#007BA7] text-[#A1A1AA] hover:text-white transition-colors"
                        title="Chỉnh sửa bài viết"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(post)}
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-red-950/60 text-[#A1A1AA] hover:text-red-400 transition-colors"
                        title="Xóa bài viết"
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
          <div className="bg-[#121212] border border-[#292929] rounded-3xl w-full max-w-2xl p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-[#71717A] hover:text-white hover:bg-[#171717]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pr-8">
              <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                {editingPost ? "Chỉnh Sửa Bài Viết Chuyên Sâu" : "Soạn Thảo Bài Viết Mới"}
              </h3>
              <button
                type="button"
                onClick={() => setIsAIModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#007BA7]/20 to-[#FF2D95]/20 hover:from-[#007BA7]/40 hover:to-[#FF2D95]/40 border border-[#007BA7]/50 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-glow-cyan w-fit"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF2D95] animate-pulse" />
                <span>✨ AI Viết Bài Này</span>
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            <form key={formKey} onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Tiêu đề bài viết *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingPost?.title || ""}
                    placeholder="Tương lai của 3D WebGL và Three.js..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none focus:border-[#007BA7]"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Đường dẫn tĩnh (Slug tùy chỉnh)
                  </label>
                  <input
                    type="text"
                    name="slug"
                    defaultValue={editingPost?.slug || ""}
                    placeholder="de-trong-de-tu-sinh-slug"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none focus:border-[#007BA7] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Tác giả
                  </label>
                  <input
                    type="text"
                    name="authorName"
                    defaultValue={editingPost?.authorName || "NGUYÊN Creative Lab"}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Thời gian đọc
                  </label>
                  <input
                    type="text"
                    name="readTime"
                    defaultValue={editingPost?.readTime || "6 phút đọc"}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    defaultValue={editingPost?.status || "PUBLISHED"}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  >
                    <option value="PUBLISHED">ĐÃ XUẤT BẢN</option>
                    <option value="DRAFT">BẢN NHÁP</option>
                    <option value="INACTIVE">TẠM ẨN</option>
                    <option value="ARCHIVED">LƯU TRỮ</option>
                  </select>
                </div>
              </div>

              <div>
                <ImageUploadField
                  name="thumbnail"
                  label="Ảnh bìa bài viết (Cover Thumbnail)"
                  defaultValue={editingPost?.thumbnail}
                  folder="blog"
                  placeholder="https://images.unsplash.com/... hoặc tải ảnh lên"
                />
              </div>

              <div>
                <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                  Tags bài viết (Phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  name="tagsJson"
                  defaultValue={formatJsonArrayToLines(editingPost?.tagsJson)}
                  placeholder="WebGL, Three.js, Next.js, AI, Thiết Kế Số"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                  Trích dẫn tóm tắt (Excerpt) *
                </label>
                <textarea
                  name="excerpt"
                  required
                  rows={2}
                  defaultValue={editingPost?.excerpt || ""}
                  placeholder="Tóm tắt ngắn gọn nội dung và định hướng của bài viết..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[#A1A1AA] font-mono uppercase mb-1">
                  Nội dung chi tiết (Hỗ trợ Heading ##, ###, Quote &gt;, List -, Code ```)
                </label>
                <textarea
                  name="content"
                  rows={8}
                  defaultValue={editingPost?.content || ""}
                  placeholder="## 01. Kiến trúc đồ họa 3D hiện đại&#10;Phân tích chi tiết..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none resize-none font-mono"
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
                  {isSubmitting ? "Đang lưu..." : "Lưu Bài Viết"}
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
              Xác Nhận Xóa Bài Viết
            </h4>
            <p className="text-xs text-[#A1A1AA]">
              Bạn có chắc chắn muốn xóa bài viết{" "}
              <strong className="text-white">{deleteTarget.title}</strong>? Bài
              viết này sẽ lập tức biến mất khỏi trang Blog công khai.
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
        type="blog"
        title="Trợ Lý AI Soạn Thảo Bài Viết Blog / Tin Tức Chuẩn SEO"
        defaultTopic={editingPost?.title || ""}
        extraContext={{
          currentTitle: editingPost?.title || "",
          currentTags: editingPost?.tagsJson || "",
        }}
        onApply={handleApplyAI}
      />
    </div>
  );
}
