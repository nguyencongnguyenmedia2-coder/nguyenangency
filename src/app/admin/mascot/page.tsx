import React from "react";
import prisma from "@/lib/prisma";
import { getPublicSiteSettings, ensureDefaultSiteSettings } from "@/lib/site-settings";
import MascotConfigClient from "@/components/admin/MascotConfigClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Quản Lý Mascot Trợ Lý Khách Hàng – NGUYÊN CRM",
  description: "Cấu hình trợ lý ảo đại bàng NGUYÊN AGENCY hỗ trợ khách hàng và thu thập yêu cầu báo giá 24/7.",
};

export default async function AdminMascotPage() {
  await ensureDefaultSiteSettings();
  const settings = await getPublicSiteSettings();

  let recentMascotLeads: any[] = [];
  try {
    recentMascotLeads = await prisma.lead.findMany({
      where: {
        source: "MASCOT_CHAT",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });
  } catch (err) {
    console.warn("[AdminMascotPage] Could not query mascot leads:", err);
  }

  const initialConfig = {
    mascotEnabled: settings.mascotEnabled ?? true,
    mascotName: settings.mascotName || "NGUYÊN AI",
    mascotTitle: settings.mascotTitle || "Trợ Lý Khách Hàng Cao Cấp",
    mascotGreeting:
      settings.mascotGreeting ||
      "Xin chào! 👋 Mình là trợ lý của NGUYÊN AGENCY. Bạn đang cần giải pháp truyền thông thương hiệu hay lập trình website?",
    mascotImage: settings.mascotImage || "/assets/mascot/mascot.webp",
    mascotAnimationEnabled: settings.mascotAnimationEnabled ?? true,
    mascotSizeDesktop: settings.mascotSizeDesktop || 130,
    mascotPosition: settings.mascotPosition || "bottom-right",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
          MASCOT TRỢ LÝ HỖ TRỢ KHÁCH HÀNG
        </h1>
        <p className="text-xs text-[#A1A1AA] mt-1">
          Quản lý nhận diện linh vật đại bàng NGUYÊN AGENCY, kịch bản chào đón khách hàng, tự động tiếp nhận lead và tích hợp đa kênh.
        </p>
      </div>

      <MascotConfigClient
        initialConfig={initialConfig}
        recentMascotLeads={recentMascotLeads}
      />
    </div>
  );
}

