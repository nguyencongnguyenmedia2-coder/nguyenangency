"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/actions/auth";
import { Lock, Mail, ArrowRight, Shield, User, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const result = await loginUser(formData);

    if (result.success && result.redirectUrl) {
      router.push(result.redirectUrl);
      router.refresh();
    } else {
      setIsSubmitting(false);
      setErrorMessage(result.error || "Đăng nhập thất bại.");
    }
  }

  function fillDemo(type: "client" | "admin") {
    const emailInput = document.getElementById("login-email") as HTMLInputElement;
    const passInput = document.getElementById("login-password") as HTMLInputElement;
    if (type === "client") {
      emailInput.value = "client@nexus.com";
      passInput.value = "Nguyen@2026";
    } else {
      emailInput.value = "admin@nguyenagency.vn";
      passInput.value = "Nguyen@2026";
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-[#0A0A0A] relative">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-r from-[#007BA7]/15 to-[#FF2D95]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md p-8 md:p-10 rounded-3xl bg-[#121212] border border-[#292929] relative z-10 shadow-card-depth">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#007BA7] to-[#FF2D95] p-[1.5px] mx-auto mb-4">
            <div className="w-full h-full bg-[#0A0A0A] rounded-[14px] flex items-center justify-center">
              <span className="font-extrabold text-xl text-white">N.</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Cổng Thông Tin NGUYÊN
          </h1>
          <p className="text-xs text-[#71717A] mt-1 font-mono uppercase tracking-wider">
            Client Portal & CMS Access
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center gap-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#A1A1AA] uppercase tracking-wider mb-2">
              Email đăng nhập
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3.5" />
              <input
                id="login-email"
                type="email"
                name="email"
                required
                placeholder="client@nexus.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#171717] border border-[#292929] text-white text-sm focus:outline-none focus:border-[#007BA7] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#A1A1AA] uppercase tracking-wider mb-2">
              Mật khẩu bảo mật
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3.5" />
              <input
                id="login-password"
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#171717] border border-[#292929] text-white text-sm focus:outline-none focus:border-[#007BA7] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-mono text-xs font-semibold uppercase tracking-wider hover:shadow-glow-pink hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            <span>{isSubmitting ? "Đang xác thực..." : "Đăng Nhập"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Pills */}
        <div className="mt-8 pt-6 border-t border-[#292929]">
          <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider block text-center mb-3">
            Tài khoản mẫu thử nghiệm (1-Click Fill)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemo("client")}
              className="px-3 py-2 rounded-lg bg-[#171717] hover:bg-[#202020] border border-[#292929] text-[11px] text-[#A1A1AA] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-[#007BA7]" />
              <span>Khách Hàng</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo("admin")}
              className="px-3 py-2 rounded-lg bg-[#171717] hover:bg-[#202020] border border-[#292929] text-[11px] text-[#A1A1AA] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[#FF2D95]" />
              <span>Admin CMS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

