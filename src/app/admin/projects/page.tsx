import React from "react";
import prisma from "@/lib/prisma";
import ProjectManagerClient from "@/components/admin/ProjectManagerClient";

export const metadata = {
  title: "Quản Lý Dự Án – NGUYÊN CRM",
};

export default async function AdminProjectsPage() {
  let projects: any[] = [];
  let customers: any[] = [];

  try {
    const results = await Promise.all([
      prisma.project.findMany({
        include: {
          customer: true,
          tasks: true,
          files: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.customer.findMany({
        select: { id: true, name: true, code: true },
        orderBy: { name: "asc" },
      }),
    ]);
    projects = results[0] || [];
    customers = results[1] || [];
  } catch (err) {
    console.warn("[AdminProjectsPage] DB fetch fallback active:", err);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          QUẢN TRỊ DỰ ÁN & VẬN HÀNH (PROJECTS)
        </h1>
        <p className="text-xs text-[#A1A1AA] mt-1">
          CRUD toàn diện: Tạo dự án mới, cập nhật tiến độ sprint, phân bổ khách hàng và xóa dự án với kiểm soát dữ liệu.
        </p>
      </div>

      <ProjectManagerClient initialProjects={projects} customers={customers} />
    </div>
  );
}
