"use client";

import React, { useState } from "react";
import { saveProject, deleteProject } from "@/app/actions/admin-project-actions";
import { Plus, Edit2, Trash2, Search, X, AlertTriangle, Briefcase } from "lucide-react";

export default function ProjectManagerClient({
  initialProjects,
  customers,
}: {
  initialProjects: any[];
  customers: any[];
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProj, setEditingProj] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleOpenCreate() {
    setEditingProj(null);
    setErrorMsg("");
    setIsModalOpen(true);
  }

  function handleOpenEdit(proj: any) {
    setEditingProj(proj);
    setErrorMsg("");
    setIsModalOpen(true);
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    if (editingProj?.id) {
      formData.append("id", editingProj.id);
    }

    const res = await saveProject(formData);
    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      window.location.reload();
    } else {
      setErrorMsg(res.error || "Lỗi lưu dự án.");
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await deleteProject(deleteTarget.id);
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
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Tìm theo tên dự án, mã PRJ, khách hàng..."
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
          <span>Tạo Dự Án Mới</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {filtered.map((proj) => {
          const completedTasks = proj.tasks?.filter((t: any) => t.status === "COMPLETED").length || 0;
          const totalTasks = proj.tasks?.length || 0;

          return (
            <div
              key={proj.id}
              className="p-6 md:p-8 rounded-3xl bg-[#121212] border border-[#292929] space-y-6 relative group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-[#007BA7] font-semibold">{proj.code}</span>
                    <span className="text-xs text-[#71717A]">• {proj.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{proj.name}</h3>
                  <p className="text-xs text-[#A1A1AA] mt-1">
                    Khách hàng: <strong className="text-white">{proj.customer?.name}</strong> • PM: {proj.managerName}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[#71717A] uppercase block">Tiến độ</span>
                    <span className="text-2xl font-black font-mono text-gradient-brand">
                      {proj.progress}%
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-mono ${
                      proj.status === "IN_PROGRESS"
                        ? "bg-[#007BA7]/20 text-[#007BA7] border border-[#007BA7]/30"
                        : "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30"
                    }`}
                  >
                    {proj.status}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 ml-2 border-l border-[#292929] pl-3">
                    <button
                      onClick={() => handleOpenEdit(proj)}
                      className="p-2 rounded-xl bg-[#171717] hover:bg-[#007BA7] text-[#A1A1AA] hover:text-white transition-colors"
                      title="Chỉnh sửa dự án"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(proj)}
                      className="p-2 rounded-xl bg-[#171717] hover:bg-red-950/60 text-[#A1A1AA] hover:text-red-400 transition-colors"
                      title="Xóa dự án"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-[#171717] overflow-hidden border border-[#292929]">
                <div
                  className="h-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] rounded-full"
                  style={{ width: `${proj.progress}%` }}
                />
              </div>

              {/* Tasks and Deliverables Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#292929] text-xs">
                <div>
                  <h4 className="font-bold text-white uppercase font-mono mb-3">
                    Nhiệm vụ ({completedTasks}/{totalTasks})
                  </h4>
                  <div className="space-y-2">
                    {proj.tasks?.slice(0, 3).map((task: any) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-xl bg-[#171717] border border-[#292929] flex items-center justify-between"
                      >
                        <span className={task.status === "COMPLETED" ? "line-through text-[#71717A]" : "text-white"}>
                          {task.title}
                        </span>
                        <span className="text-[9px] font-mono text-[#71717A] uppercase">{task.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white uppercase font-mono mb-3">
                    Tài Liệu Bàn Giao ({proj.files?.length || 0} files)
                  </h4>
                  <div className="space-y-2">
                    {proj.files?.map((file: any) => (
                      <div
                        key={file.id}
                        className="p-3 rounded-xl bg-[#171717] border border-[#292929] flex items-center justify-between text-[#A1A1AA]"
                      >
                        <span className="text-white truncate">{file.name}</span>
                        <span className="text-[10px] font-mono text-[#71717A] shrink-0">
                          {file.fileType} • {file.fileSize}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT PROJECT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#292929] rounded-3xl w-full max-w-xl p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-[#71717A] hover:text-white hover:bg-[#171717]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white uppercase tracking-wide mb-6">
              {editingProj ? "Chỉnh Sửa Dự Án Khách Hàng" : "Khởi Tạo Dự Án Mới"}
            </h3>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Tên dự án *</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingProj?.name || ""}
                  placeholder="Nexus 3D Web Platform"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none focus:border-[#007BA7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Khách hàng đối tác *</label>
                  <select
                    name="customerId"
                    required
                    defaultValue={editingProj?.customerId || (customers[0]?.id || "")}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Loại dịch vụ</label>
                  <input
                    type="text"
                    name="category"
                    defaultValue={editingProj?.category || "Web Application & 3D WebGL"}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Tiến độ (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    name="progress"
                    defaultValue={editingProj?.progress || 0}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Trạng thái</label>
                  <select
                    name="status"
                    defaultValue={editingProj?.status || "IN_PROGRESS"}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  >
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="REVIEW">REVIEW</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="ON_HOLD">ON_HOLD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Lead Architect</label>
                  <input
                    type="text"
                    name="managerName"
                    defaultValue={editingProj?.managerName || "Nguyên Director"}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Mô tả phạm vi dự án</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingProj?.description || ""}
                  placeholder="Mục tiêu công nghệ, yêu cầu bàn giao..."
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
                  {isSubmitting ? "Đang lưu..." : "Lưu Dự Án"}
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
            <h4 className="text-lg font-bold text-white uppercase">Xác Nhận Xóa Dự Án</h4>
            <p className="text-xs text-[#A1A1AA]">
              Bạn có chắc chắn muốn xóa dự án{" "}
              <strong className="text-white">{deleteTarget.name} ({deleteTarget.code})</strong>?
              Toàn bộ nhiệm vụ và tài liệu bàn giao liên quan sẽ bị xóa theo.
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

