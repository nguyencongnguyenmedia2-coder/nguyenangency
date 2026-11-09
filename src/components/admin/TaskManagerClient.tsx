"use client";

import React, { useState } from "react";
import { saveTask, deleteTask } from "@/app/actions/admin-project-actions";
import { Plus, Edit2, Trash2, Search, X, AlertTriangle } from "lucide-react";

export default function TaskManagerClient({
  initialTasks,
  projects,
}: {
  initialTasks: any[];
  projects: any[];
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.project?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleOpenCreate() {
    setEditingTask(null);
    setErrorMsg("");
    setIsModalOpen(true);
  }

  function handleOpenEdit(t: any) {
    setEditingTask(t);
    setErrorMsg("");
    setIsModalOpen(true);
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    if (editingTask?.id) {
      formData.append("id", editingTask.id);
    }

    const res = await saveTask(formData);
    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      window.location.reload();
    } else {
      setErrorMsg(res.error || "Lỗi lưu nhiệm vụ.");
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await deleteTask(deleteTarget.id);
    setIsDeleting(false);

    if (res.success) {
      setDeleteTarget(null);
      window.location.reload();
    } else {
      alert(res.error || "Không thể xóa nhiệm vụ này.");
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
            placeholder="Tìm theo tên nhiệm vụ, dự án..."
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
          <span>Thêm Nhiệm Vụ Mới</span>
        </button>
      </div>

      {/* Tasks Table */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#121212] border border-[#292929]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#292929] text-[#71717A] font-mono">
                <th className="py-3.5 px-4">TÊN NHIỆM VỤ</th>
                <th className="py-3.5 px-4">DỰ ÁN LIÊN KẾT</th>
                <th className="py-3.5 px-4">NGƯỜI THỰC HIỆN</th>
                <th className="py-3.5 px-4">MỨC ƯU TIÊN</th>
                <th className="py-3.5 px-4">TRẠNG THÁI</th>
                <th className="py-3.5 px-4 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292929]">
              {filtered.map((task) => (
                <tr key={task.id} className="hover:bg-[#171717] transition-colors">
                  <td className="py-4 px-4 font-bold text-white text-sm">{task.title}</td>
                  <td className="py-4 px-4 text-[#A1A1AA]">{task.project?.name}</td>
                  <td className="py-4 px-4 text-white font-mono">{task.assigneeName || "Nguyên Director"}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        task.priority === "HIGH"
                          ? "bg-[#FF2D95]/20 text-[#FF2D95]"
                          : "bg-[#202020] text-[#A1A1AA]"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        task.status === "COMPLETED"
                          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30"
                          : "bg-[#007BA7]/20 text-[#007BA7] border border-[#007BA7]/30"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(task)}
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#007BA7] text-[#A1A1AA] hover:text-white transition-colors"
                        title="Chỉnh sửa nhiệm vụ"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(task)}
                        className="p-1.5 rounded-lg bg-[#202020] hover:bg-red-950/60 text-[#A1A1AA] hover:text-red-400 transition-colors"
                        title="Xóa nhiệm vụ"
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
          <div className="bg-[#121212] border border-[#292929] rounded-3xl w-full max-w-xl p-8 relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-[#71717A] hover:text-white hover:bg-[#171717]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white uppercase tracking-wide mb-6">
              {editingTask ? "Chỉnh Sửa Nhiệm Vụ" : "Giao Nhiệm Vụ Mới"}
            </h3>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Tên nhiệm vụ (Task) *</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingTask?.title || ""}
                  placeholder="Lập trình Three.js 3D Market Map..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none focus:border-[#007BA7]"
                />
              </div>

              <div>
                <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Dự án trực thuộc *</label>
                <select
                  name="projectId"
                  required
                  defaultValue={editingTask?.projectId || (projects[0]?.id || "")}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Mức ưu tiên</label>
                  <select
                    name="priority"
                    defaultValue={editingTask?.priority || "MEDIUM"}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  >
                    <option value="HIGH">HIGH (Cao)</option>
                    <option value="MEDIUM">MEDIUM (Bình thường)</option>
                    <option value="LOW">LOW (Thấp)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Trạng thái</label>
                  <select
                    name="status"
                    defaultValue={editingTask?.status || "IN_PROGRESS"}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white focus:outline-none"
                  >
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="REVIEW">REVIEW</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#A1A1AA] font-mono uppercase mb-1">Người phụ trách</label>
                  <input
                    type="text"
                    name="assigneeName"
                    defaultValue={editingTask?.assigneeName || "Nguyên Director"}
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
                  {isSubmitting ? "Đang lưu..." : "Lưu Nhiệm Vụ"}
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
            <h4 className="text-lg font-bold text-white uppercase">Xác Nhận Xóa Nhiệm Vụ</h4>
            <p className="text-xs text-[#A1A1AA]">
              Bạn có chắc chắn muốn xóa nhiệm vụ <strong className="text-white">{deleteTarget.title}</strong>?
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

