import React from "react";
import prisma from "@/lib/prisma";
import { ensureDefaultSiteSettings } from "@/lib/site-settings";
import SettingManagerClient from "@/components/admin/SettingManagerClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cấu Hình Hệ Thống – NGUYÊN CRM",
};

export default async function AdminSettingsPage() {
  let settings: any[] = [];
  try {
    await ensureDefaultSiteSettings();

    settings = await prisma.siteSetting.findMany({
      orderBy: [{ group: "asc" }, { key: "asc" }],
    });
  } catch (err) {
    console.warn("[AdminSettingsPage] DB fetch fallback active:", err);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          CẤU HÌNH WEBSITE & DOANH NGHIỆP (SITE SETTINGS)
        </h1>
        <p className="text-xs text-[#A1A1AA] mt-1">
          Chỉnh sửa thông tin thương hiệu, email nhận liên hệ, hotline và liên kết mạng xã hội trực tiếp.
        </p>
      </div>

      <SettingManagerClient initialSettings={settings} />
    </div>
  );
}
