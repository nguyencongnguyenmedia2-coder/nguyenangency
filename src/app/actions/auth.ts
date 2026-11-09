"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { setSessionCookie, clearSessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginUser(formData: FormData) {
  const email = formData.get("email")?.toString().trim() || "";
  const password = formData.get("password")?.toString() || "";
  const redirectTo = formData.get("redirectTo")?.toString() || "";

  if (!email || !password) {
    return { success: false, error: "Vui lòng nhập email và mật khẩu." };
  }

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

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

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
}

export async function logoutUser() {
  await clearSessionCookie();
  redirect("/client/login");
}

