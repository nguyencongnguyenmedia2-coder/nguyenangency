import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("--- Bắt đầu Việt hóa dữ liệu Database ---");

  // 1. Cập nhật SiteSettings
  const siteSettingsUpdates: Record<string, string> = {
    brand_tagline: "VƯỢT CHUẨN SỐ HÓA",
    site_tagline: "VƯỢT CHUẨN SỐ HÓA",
  };

  for (const [key, value] of Object.entries(siteSettingsUpdates)) {
    const existing = await prisma.siteSetting.findUnique({ where: { key } });
    if (existing) {
      await prisma.siteSetting.update({
        where: { key },
        data: { value },
      });
      console.log(`[SiteSetting] Cập nhật ${key} = ${value}`);
    }
  }

  // 2. Cập nhật HomepageSections
  const sectionUpdates: Record<
    string,
    { title: string; subtitle?: string; name: string }
  > = {
    HERO: {
      name: "01. Hero Banner 3D",
      title: "VƯỢT CHUẨN SỐ HÓA.",
      subtitle: "01 • KIẾN TẠO. PHÁT TRIỂN. CHUYỂN HÓA.",
    },
    BRAND_INTRO: {
      name: "02. Giới Thiệu Thương Hiệu (Tuyên Ngôn)",
      title: "NGUYÊN AGENCY – KIẾN TRÚC SƯ KỸ THUẬT SỐ HÀNG ĐẦU",
      subtitle: "01 • TUYÊN NGÔN THƯƠNG HIỆU",
    },
    SERVICES_BENTO: {
      name: "03. Dịch Vụ Nổi Bật (MEDIA & TECH)",
      title: "GIẢI PHÁP TOÀN DIỆN.",
      subtitle: "02 • DỊCH VỤ & NĂNG LỰC CỐT LÕI",
    },
    FEATURED_PORTFOLIO: {
      name: "04. Dự Án Tiêu Biểu",
      title: "DỰ ÁN TIÊU BIỂU.",
      subtitle: "03 • HỒ SƠ NĂNG LỰC DỰ ÁN",
    },
    DIGITAL_LAB: {
      name: "05. Digital LAB (Sản Phẩm AI & Số)",
      title: "PHÒNG NGHIÊN CỨU LAB.",
      subtitle: "04 • NGHIÊN CỨU & PHÁT TRIỂN AI",
    },
    PROCESS: {
      name: "06. Quy Trình Làm Việc",
      title: "QUY TRÌNH CHUẨN MỰC.",
      subtitle: "05 • PHƯƠNG PHÁP & TIẾN TRÌNH",
    },
    TECH_STACK: {
      name: "07. Hệ Thống Công Nghệ",
      title: "CÔNG NGHỆ TIÊN TIẾN.",
      subtitle: "06 • HỆ THỐNG CÔNG NGHỆ",
    },
    TESTIMONIALS: {
      name: "08. Đánh Giá Khách Hàng",
      title: "NIỀM TIN ĐỐI TÁC.",
      subtitle: "07 • ĐÁNH GIÁ TỪ KHÁCH HÀNG",
    },
    LATEST_BLOG: {
      name: "09. Bài Viết & Nghiên Cứu Mới Nhất (Blog)",
      title: "BÀI VIẾT & NGHIÊN CỨU MỚI NHẤT.",
      subtitle: "08 • GÓC NHÌN & BÀI VIẾT CHUYÊN SÂU",
    },
    FAQ: {
      name: "10. Câu Hỏi Thường Gặp",
      title: "CÂU HỎI THƯỜNG GẶP.",
      subtitle: "09 • HỎI & ĐÁP MINH BẠCH",
    },
    CONTACT_CTA: {
      name: "11. Liên Hệ Chân Trang",
      title: "KHỞI ĐỘNG DỰ ÁN CỦA BẠN.",
      subtitle: "10 • KẾT NỐI HỢP TÁC",
    },
  };

  for (const [sectionKey, data] of Object.entries(sectionUpdates)) {
    const existing = await prisma.homepageSection.findUnique({
      where: { sectionKey },
    });
    if (existing) {
      await prisma.homepageSection.update({
        where: { sectionKey },
        data: {
          name: data.name,
          title: data.title,
          subtitle: data.subtitle,
        },
      });
      console.log(`[HomepageSection] Cập nhật ${sectionKey}: ${data.title}`);
    }
  }

  console.log("--- Hoàn tất Việt hóa Database ---");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

