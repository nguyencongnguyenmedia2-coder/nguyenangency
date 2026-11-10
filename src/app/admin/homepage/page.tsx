import React from "react";
import prisma from "@/lib/prisma";
import { ensureHomepageSections, DEFAULT_HOMEPAGE_SECTIONS } from "@/lib/homepage-init";
import HomepageBuilderClient from "@/components/admin/HomepageBuilderClient";
import { LayoutTemplate } from "lucide-react";

export const metadata = {
  title: "Quản Trị Trang Chủ (Homepage Builder) – NGUYÊN CRM",
};

export default async function AdminHomepageBuilderPage() {
  let sections: any[] = [];
  try {
    await ensureHomepageSections();

    sections = await prisma.homepageSection.findMany({
      orderBy: { order: "asc" },
    });
  } catch (err) {
    console.warn("[AdminHomepageBuilderPage] DB fetch fallback active:", err);
  }

  if (!sections || sections.length === 0) {
    sections = DEFAULT_HOMEPAGE_SECTIONS.map((sec, idx) => ({
      ...sec,
      id: `sec_${sec.sectionKey || idx}`,
    }));
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
          <LayoutTemplate className="w-7 h-7 text-[#007BA7]" />
          HOMEPAGE BUILDER (ĐIỀU KHIỂN NỘI DUNG TRANG CHỦ)
        </h1>
        <p className="text-xs text-[#A1A1AA] mt-1">
          Bật/tắt, sắp xếp thứ tự hiển thị và chỉnh sửa trực tiếp tiêu đề, mô tả, nút CTA của 10 section trên trang chủ.
        </p>
      </div>

      <HomepageBuilderClient initialSections={sections} />
    </div>
  );
}

