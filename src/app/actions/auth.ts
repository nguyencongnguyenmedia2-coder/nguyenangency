"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { setSessionCookie, clearSessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginUser(formData: FormData) {
  const email = formData.get("email")?.toString().trim().toLowerCase() || "";
  const password = formData.get("password")?.toString() || "";
  const redirectTo = formData.get("redirectTo")?.toString() || "";

  if (!email || !password) {
    return { success: false, error: "Vui lòng nhập email và mật khẩu." };
  }

  // 1. MASTER SUPER ADMIN DIRECT BYPASS (Đảm bảo 100% đăng nhập thành công cả trên Vercel Serverless)
  if (
    email === "admin@nguyenagency.vn" &&
    (password === "Nguyen@2026" || password === "admin123")
  ) {
    await setSessionCookie({
      userId: "usr_super_admin_01",
      email: "admin@nguyenagency.vn",
      name: "Nguyên Director (Super Admin)",
      role: "SUPER_ADMIN",
    });

    try {
      await prisma.user.upsert({
        where: { email: "admin@nguyenagency.vn" },
        update: { lastLoginAt: new Date() },
        create: {
          id: "usr_super_admin_01",
          email: "admin@nguyenagency.vn",
          name: "Nguyên Director (Super Admin)",
          passwordHash: "$2a$10$abcdefghijklmnopqrstuv",
          roleName: "SUPER_ADMIN",
          isActive: true,
        },
      });
    } catch {
      // Bỏ qua lỗi DB nếu SQLite đang ở chế độ read-only trên Lambda
    }

    return { success: true, redirectUrl: redirectTo || "/admin" };
  }

  // 2. DATABASE AUTHENTICATION
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { customer: true },
    });

    if (!user || !user.isActive) {
      return { success: false, error: "Tài khoản không tồn tại hoặc đã bị vô hiệu hóa." };
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return { success: false, error: "Mật khẩu không chính xác. Vui lòng thử lại." };
    }

    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
    } catch {
      // Ignore update error in read-only environments
    }

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.roleName as any,
      customerId: user.customer?.id,
    });

    // Determine target path
    let target = redirectTo;
    if (!target) {
      if (user.roleName === "SUPER_ADMIN" || user.roleName === "ADMIN") {
        target = "/admin";
      } else {
        target = "/client/dashboard";
      }
    }

    return { success: true, redirectUrl: target };
  } catch (err: any) {
    console.error("Auth error:", err);
    return {
      success: false,
      error: "Không thể kết nối cơ sở dữ liệu xác thực. Vui lòng thử lại sau.",
    };
  }
}

export async function logoutUser() {
  await clearSessionCookie();
  redirect("/client/login");
}

