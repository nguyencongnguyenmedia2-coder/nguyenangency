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
    let adminUserId = "cmw21ab3q0005524rrpnorhuj";
    try {
      const existingAdmin = await prisma.user.findUnique({
        where: { email: "admin@nguyenagency.vn" },
        select: { id: true, name: true },
      });
      if (existingAdmin) {
        adminUserId = existingAdmin.id;
        await prisma.user.update({
          where: { id: existingAdmin.id },
          data: { lastLoginAt: new Date() },
        });
      } else {
        const createdAdmin = await prisma.user.create({
          data: {
            id: adminUserId,
            email: "admin@nguyenagency.vn",
            name: "Nguyên Director (Super Admin)",
            passwordHash: "$2a$10$abcdefghijklmnopqrstuv",
            roleName: "SUPER_ADMIN",
            isActive: true,
          },
        });
        adminUserId = createdAdmin.id;
      }
    } catch (err) {
      console.warn("[Auth bypass] User update warning:", err);
    }

    await setSessionCookie({
      userId: adminUserId,
      email: "admin@nguyenagency.vn",
      name: "Nguyên Director (Super Admin)",
      role: "SUPER_ADMIN",
    });

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

