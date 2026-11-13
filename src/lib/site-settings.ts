import prisma from "@/lib/prisma";

export interface PublicSiteSettings {
  brandName: string;
  brandTagline: string;
  brandDescription: string;
  contactEmail: string;
  hotline: string;
  officeAddress: string;
  zaloUrl: string;
  facebookUrl: string;
  linkedinUrl: string;
  behanceUrl: string;
  telegramBotUsername: string;
  mascotEnabled: boolean;
  mascotName: string;
  mascotTitle: string;
  mascotGreeting: string;
  mascotImage: string;
  mascotAnimationEnabled: boolean;
  mascotSizeDesktop: number;
  mascotPosition: string;
  rawMap: Record<string, string>;
}

const DEFAULT_SETTINGS_SEED = [
  {
    key: "brand_name",
    value: "NGUYÊN AGENCY",
    group: "GENERAL",
    description: "Tên thương hiệu hiển thị trên Header, Footer và SEO",
  },
  {
    key: "brand_tagline",
    value: "VƯỢT CHUẨN SỐ HÓA",
    group: "GENERAL",
    description: "Tagline thương hiệu dưới logo",
  },
  {
    key: "brand_description",
    value:
      "Premium Creative Digital Agency tiên phong kết hợp giữa nghệ thuật thị giác đương đại, công nghệ 3D Three.js và kiến trúc phần mềm tốc độ cao.",
    group: "GENERAL",
    description: "Mô tả giới thiệu ngắn về Agency ở Footer & About",
  },
  {
    key: "contact_email",
    value: "contact@nguyenagency.vn",
    group: "CONTACT",
    description: "Email nhận yêu cầu tư vấn & báo giá hiển thị trên website",
  },
  {
    key: "hotline",
    value: "+84 344 979 307",
    group: "CONTACT",
    description: "Số điện thoại Hotline tư vấn 24/7 hiển thị trên website",
  },
  {
    key: "office_address",
    value: "TP. Quảng Ngãi - TP. Hồ Chí Minh",
    group: "CONTACT",
    description: "Địa chỉ trụ sở chính hiển thị tại Footer và trang Liên hệ",
  },
  {
    key: "zalo_url",
    value: "https://zalo.me/0344979307",
    group: "SOCIAL",
    description: "Liên kết Zalo Official Account",
  },
  {
    key: "facebook_url",
    value: "https://www.facebook.com/nguyenagency07",
    group: "SOCIAL",
    description: "Liên kết Fanpage Facebook chính thức",
  },
  {
    key: "linkedin_url",
    value: "https://linkedin.com",
    group: "SOCIAL",
    description: "Liên kết hồ sơ doanh nghiệp LinkedIn",
  },
  {
    key: "behance_url",
    value: "https://behance.net",
    group: "SOCIAL",
    description: "Liên kết showcase thiết kế trên Behance",
  },
  {
    key: "mascot_enabled",
    value: "true",
    group: "MASCOT",
    description: "Bật/Tắt Mascot Trợ lý hỗ trợ khách hàng toàn website",
  },
  {
    key: "mascot_name",
    value: "NGUYÊN AI ASSISTANT",
    group: "MASCOT",
    description: "Tên hiển thị của trợ lý ảo Mascot",
  },
  {
    key: "mascot_title",
    value: "Trợ lý trực tuyến",
    group: "MASCOT",
    description: "Tiêu đề trạng thái của Mascot",
  },
  {
    key: "mascot_greeting",
    value:
      "Xin chào! 👋 Mình là trợ lý của NGUYÊN AGENCY. Bạn đang cần giải pháp truyền thông hay lập trình website?",
    group: "MASCOT",
    description: "Lời chào mở đầu khi khách hàng truy cập website",
  },
  {
    key: "mascot_image",
    value: "/assets/mascot/mascot.webp",
    group: "MASCOT",
    description: "Đường dẫn hình ảnh Mascot (PNG/WebP trong suốt)",
  },
  {
    key: "mascot_animation_enabled",
    value: "true",
    group: "MASCOT",
    description: "Bật/Tắt hiệu ứng chuyển động Floating & Glow của Mascot",
  },
  {
    key: "mascot_size_desktop",
    value: "125",
    group: "MASCOT",
    description: "Kích thước hiển thị trên Desktop (px)",
  },
  {
    key: "mascot_position",
    value: "bottom-right",
    group: "MASCOT",
    description: "Vị trí neo trên màn hình (bottom-right / bottom-left)",
  },
];

export async function ensureDefaultSiteSettings() {
  try {
    const existing = await prisma.siteSetting.findMany({
      select: { key: true },
    });
    const existingKeys = new Set(existing.map((s) => s.key));

    for (const item of DEFAULT_SETTINGS_SEED) {
      if (!existingKeys.has(item.key)) {
        await prisma.siteSetting.create({ data: item });
      }
    }
  } catch {
    // non-fatal if DB is read-only or migrating
  }
}

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  const rawMap: Record<string, string> = {};
  try {
    const rows = await prisma.siteSetting.findMany();
    for (const r of rows) {
      rawMap[r.key] = r.value;
    }
  } catch (err) {
    console.error("[getPublicSiteSettings] Failed to read siteSetting:", err);
  }

  return {
    brandName:
      rawMap["brand_name"] || rawMap["site_name"] || "NGUYÊN AGENCY",
    brandTagline:
      rawMap["brand_tagline"] || rawMap["site_tagline"] || "VƯỢT CHUẨN SỐ HÓA",
    brandDescription:
      rawMap["brand_description"] ||
      rawMap["site_description"] ||
      "Premium Creative Digital Agency tiên phong kết hợp giữa nghệ thuật thị giác đương đại, công nghệ 3D Three.js và kiến trúc phần mềm tốc độ cao.",
    contactEmail:
      rawMap["contact_email"] ||
      rawMap["site_contact_email"] ||
      rawMap["email"] ||
      "contact@nguyenagency.vn",
    hotline:
      rawMap["hotline"] ||
      rawMap["site_hotline"] ||
      rawMap["phone"] ||
      "+84 344 979 307",
    officeAddress:
      rawMap["office_address"] ||
      rawMap["site_address"] ||
      rawMap["address"] ||
      "TP. Quảng Ngãi - TP. Hồ Chí Minh",
    zaloUrl: rawMap["zalo_url"] || "https://zalo.me/0344979307",
    facebookUrl:
      !rawMap["facebook_url"] || rawMap["facebook_url"].includes("nguyenads7")
        ? "https://www.facebook.com/nguyenagency07"
        : rawMap["facebook_url"],
    linkedinUrl: rawMap["linkedin_url"] || "https://linkedin.com",
    behanceUrl: rawMap["behance_url"] || "https://behance.net",
    telegramBotUsername:
      rawMap["telegram_bot_username"] ||
      process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ||
      "nguyenangency_bot",
    mascotEnabled: rawMap["mascot_enabled"] !== "false",
    mascotName: rawMap["mascot_name"] || "NGUYÊN AI ASSISTANT",
    mascotTitle: rawMap["mascot_title"] || "Trợ lý trực tuyến",
    mascotGreeting:
      rawMap["mascot_greeting"] ||
      "Xin chào! 👋 Mình là trợ lý của NGUYÊN AGENCY. Bạn đang cần giải pháp truyền thông hay lập trình website?",
    mascotImage: rawMap["mascot_image"] || "/assets/mascot/mascot.webp",
    mascotAnimationEnabled: rawMap["mascot_animation_enabled"] !== "false",
    mascotSizeDesktop: Number(rawMap["mascot_size_desktop"]) || 125,
    mascotPosition: rawMap["mascot_position"] || "bottom-right",
    rawMap,
  };
}
