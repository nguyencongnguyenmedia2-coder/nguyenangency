import React from "react";
import { getCurrentUser } from "@/lib/auth";
import AdminSidebarLayout from "@/components/admin/AdminSidebarLayout";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentUser();

  const user = session
    ? {
        name: session.name,
        email: session.email,
        role: session.role,
      }
    : {
        name: "Admin",
        email: "admin@nguyenagency.vn",
        role: "ADMIN",
      };

  return <AdminSidebarLayout user={user}>{children}</AdminSidebarLayout>;
}

