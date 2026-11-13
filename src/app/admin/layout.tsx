import React from "react";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import AdminSidebarLayout from "@/components/admin/AdminSidebarLayout";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let user = { name: "Admin", email: "admin@nguyenagency.vn", role: "ADMIN" };
  try {
    const session = await getCurrentUser();
    if (session) {
      user = { name: session.name, email: session.email, role: session.role };
    }
  } catch {
    // JWT/cookie error – use default guest profile; login page will handle auth
  }

  return <AdminSidebarLayout user={user}>{children}</AdminSidebarLayout>;
}

