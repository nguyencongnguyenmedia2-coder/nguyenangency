import React from "react";
import prisma from "@/lib/prisma";
import UserManagerClient from "@/components/admin/UserManagerClient";

export const metadata = {
  title: "Người Dùng & Phân Quyền – NGUYÊN CRM",
};

export default async function AdminUsersPage() {
  let users: any[] = [];
  try {
    users = await prisma.user.findMany({
      include: { role: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.warn("[AdminUsersPage] DB fetch fallback active:", err);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          NGƯỜI DÙNG & PHÂN QUYỀN HỆ THỐNG
        </h1>
        <p className="text-xs text-[#A1A1AA] mt-1">
          Quản lý tài khoản Super Admin, Quản trị viên, Nhân viên kỹ thuật và Khách hàng Client Portal.
        </p>
      </div>

      <UserManagerClient initialUsers={users} />
    </div>
  );
}
