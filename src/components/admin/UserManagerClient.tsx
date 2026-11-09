"use client";

import React, { useState } from "react";
import { saveUser, deleteUser } from "@/app/actions/admin-system-actions";
import { Plus, Edit2, Trash2, Search, X, Shield, AlertTriangle } from "lucide-react";
import { formatDateVN } from "@/lib/utils";

interface UserItem {
  id: string;
  name: string;
  email: string;
  roleName: string;
  title?: string | null;
  createdAt: Date | string;
}

export default function UserManagerClient({ initialUsers }: { initialUsers: UserItem[] }) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UserItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.title && u.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === "ALL" || u.roleName === roleFilter;
    return matchesSearch && matchesRole;
  });

  function handleOpenCreate() {
    setEditingItem(null);
    setErrorMsg("");
    setIsModalOpen(true);
  }

  function handleOpenEdit(u: UserItem) {
    setEditingItem(u);
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

    const res = await saveUser(formData);
    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      window.location.reload();
    } else {
      setErrorMsg(res.error || "Lỗi lưu tài khoản người dùng.");
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await deleteUser(deleteTarget.id);
    setIsDeleting(false);

    if (res.success) {
      setDeleteTarget(null);
      window.location.reload();
    } else {
      alert(res.error || "Không thể xóa tài khoản này.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Tìm theo tên, email, chức danh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-xs text-white focus:outline-none focus:border-[#007BA7]"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            <option value="ADMIN">ADMIN</option>
            <option value="STAFF">STAFF</option>
            <option value="CLIENT">CLIENT</option>
          </select>
        </div>

        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white text-xs font-mono font-bold uppercase tracking-wider hover:shadow-glow-pink transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Người Dùng</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#121212] border border-[#292929]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#292929] text-[#71717A] font-mono">
                <th className="py-3.5 px-4">HỌ VÀ TÊN</th>
                <th className="py-3.5 px-4">EMAIL ĐĂNG NHẬP</th>
                <th className="py-3.5 px-4">VAI TRÒ (ROLE)</th>
                <th className="py-3.5 px-4">CHỨC DANH</th>
                <th className="py-3.5 px-4">NGÀY TẠO</th>
                <th className="py-3.5 px-4 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292929]">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-[#171717] transition-colors">
                  <td className="py-4 px-4 font-bold text-white text-sm">
                    {u.name}
                  </td>
                  <td className="py-4 px-4 text-[#A1A1AA] font-mono">{u.email}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                        u.roleName === "SUPER_ADMIN"
                          ? "bg-[#FF2D95]/20 text-[#FF2D95] border border-[#FF2D95]/30"
                          : u.roleName === "ADMIN"
                          ? "bg-[#007BA7]/20 text-[#007BA7] border border-[#007BA7]/30"
                          : u.roleName === "STAFF"
                          ? "bg-purple-900/20 text-purple-400 border border-purple-500/30"
                          : "bg-[#202020] text-[#A1A1AA] border border-[#292929]"
                      }`}
                    >
                      {u.roleName}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-white">{u.title || "--"}</td>
                  <td className="py-4 px-4 font-mono text-[#71717A]">{formatDateVN(u.createdAt)}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="p-2 rounded-lg bg-[#171717] hover:bg-[#202020] text-[#A1A1AA] hover:text-white border border-[#292929] transition-colors"
                        title="Chỉnh sửa tài khoản"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(u)}
                        className="p-2 rounded-lg bg-[#171717] hover:bg-red-500/20 text-[#A1A1AA] hover:text-red-400 border border-[#292929] transition-colors"
                        title="Xóa tài khoản"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#71717A]">
                    Không tìm thấy người dùng nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
              <Shield className="w-5 h-5 text-[#007BA7]" />
              {editingItem ? "Chỉnh Sửa Tài Khoản" : "Tạo Tài Khoản Mới"}
            </h3>
            <p className="text-xs text-[#A1A1AA] mb-6">
              {editingItem
                ? `Cập nhật thông tin và vai trò cho ${editingItem.name}.`
                : "Thêm tài khoản quản trị hoặc nhân viên vào hệ thống CRM."}
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
                  Họ và Tên *
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingItem?.name || ""}
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                  Email Đăng Nhập *
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editingItem?.email || ""}
                  required
                  placeholder="name@nguyenagency.vn"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                    Vai Trò (Role) *
                  </label>
                  <select
                    name="roleName"
                    defaultValue={editingItem?.roleName || "STAFF"}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                  >
                    <option value="SUPER_ADMIN">SUPER_ADMIN (Toàn quyền)</option>
                    <option value="ADMIN">ADMIN (Quản trị viên)</option>
                    <option value="STAFF">STAFF (Nhân viên kỹ thuật)</option>
                    <option value="CLIENT">CLIENT (Khách hàng)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                    Chức Danh / Vị Trí
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingItem?.title || ""}
                    placeholder="VD: Senior 3D Designer"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                  {editingItem ? "Mật Khẩu Mới (để trống nếu không đổi)" : "Mật Khẩu *"}
                </label>
                <input
                  type="password"
                  name="password"
                  required={!editingItem}
                  placeholder={editingItem ? "••••••••" : "Tối thiểu 6 ký tự"}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                />
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
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">Xác Nhận Xóa Tài Khoản</h3>
            </div>
            <p className="text-xs text-[#A1A1AA] mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa tài khoản <strong className="text-white">{deleteTarget.email}</strong>? Hành
              động này không thể khôi phục.
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
                {isDeleting ? "Đang xóa..." : "Xóa Vĩnh Viễn"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

