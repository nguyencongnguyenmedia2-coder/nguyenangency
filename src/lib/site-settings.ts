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
    value: "+84 908 889 999",
    group: "CONTACT",
    description: "Số điện thoại Hotline tư vấn 24/7 hiển thị trên website",
  },
  {
    key: "office_address",
    value: "Landmark 81 Sky Tower, 720A Điện Biên Phủ, Phường 22, Bình Thạnh, TP. Hồ Chí Minh",
    group: "CONTACT",
    description: "Địa chỉ trụ sở chính hiển thị tại Footer và trang Liên hệ",
  },
  {
    key: "zalo_url",
    value: "https://zalo.me",
    group: "SOCIAL",
    description: "Liên kết Zalo Official Account",
  },
  {
    key: "facebook_url",
    value: "https://facebook.com",
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
      "+84 908 889 999",
    officeAddress:
      rawMap["office_address"] ||
      rawMap["site_address"] ||
      rawMap["address"] ||
      "Landmark 81 Sky Tower, 720A Điện Biên Phủ, Phường 22, Bình Thạnh, TP. Hồ Chí Minh",
    zaloUrl: rawMap["zalo_url"] || "https://zalo.me",
    facebookUrl: rawMap["facebook_url"] || "https://facebook.com",
    linkedinUrl: rawMap["linkedin_url"] || "https://linkedin.com",
    behanceUrl: rawMap["behance_url"] || "https://behance.net",
    telegramBotUsername:
      rawMap["telegram_bot_username"] ||
      process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ||
      "nguyenangency_bot",
    rawMap,
  };
}
