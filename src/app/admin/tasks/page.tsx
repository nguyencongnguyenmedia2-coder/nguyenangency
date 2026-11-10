import React from "react";
import prisma from "@/lib/prisma";
import TaskManagerClient from "@/components/admin/TaskManagerClient";

export const metadata = {
  title: "Nhiệm Vụ – NGUYÊN CRM",
};

export default async function AdminTasksPage() {
  let tasks: any[] = [];
  let projects: any[] = [];

  try {
    const results = await Promise.all([
      prisma.projectTask.findMany({
        include: { project: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.project.findMany({
        select: { id: true, name: true, code: true },
        orderBy: { name: "asc" },
      }),
    ]);
    tasks = results[0] || [];
    projects = results[1] || [];
  } catch (err) {
    console.warn("[AdminTasksPage] DB fetch fallback active:", err);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          QUẢN TRỊ NHIỆM VỤ (TASK MANAGEMENT)
        </h1>
        <p className="text-xs text-[#A1A1AA] mt-1">
          CRUD toàn diện: Giao nhiệm vụ sprint mới, chỉnh sửa mức độ ưu tiên, cập nhật trạng thái và xóa đầu việc.
        </p>
      </div>

      <TaskManagerClient initialTasks={tasks} projects={projects} />
    </div>
  );
}
