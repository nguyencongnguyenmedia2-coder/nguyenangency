import prisma from "@/lib/prisma";

export const DEFAULT_HOMEPAGE_SECTIONS = [
  {
    sectionKey: "HERO",
    name: "01. Hero Banner 3D",
    title: "VƯỢT CHUẨN SỐ HÓA.",
    subtitle: "01 • KIẾN TẠO. PHÁT TRIỂN. CHUYỂN HÓA.",
    description: "Hệ sinh thái sáng tạo kỹ thuật số và công nghệ cao cấp.",
    ctaText: "Xem Dự Án",
    ctaLink: "/portfolio",
    order: 1,
    isActive: true,
  },
  {
    sectionKey: "BRAND_INTRO",
    name: "02. Giới Thiệu Thương Hiệu (Tuyên Ngôn)",
    title: "NGUYÊN AGENCY – KIẾN TRÚC SƯ KỸ THUẬT SỐ HÀNG ĐẦU",
    subtitle: "01 • TUYÊN NGÔN THƯƠNG HIỆU",
    description:
      "Chúng tôi phá vỡ ranh giới giữa sáng tạo thị giác và công nghệ lập trình tiên tiến để định hình tương lai số cho các thương hiệu hàng đầu.",
    ctaText: "Về Chúng Tôi",
    ctaLink: "/about",
    order: 2,
    isActive: true,
  },
  {
    sectionKey: "SERVICES_BENTO",
    name: "03. Dịch Vụ Nổi Bật (MEDIA & TECH)",
    title: "GIẢI PHÁP TOÀN DIỆN.",
    subtitle: "02 • DỊCH VỤ & NĂNG LỰC CỐT LÕI",
    description: "Cung cấp hệ sinh thái 24 giải pháp toàn diện từ thương hiệu tới kiến trúc phần mềm cao cấp.",
    ctaText: "Tất cả 24 Dịch vụ",
    ctaLink: "/services",
    order: 3,
    isActive: true,
  },
  {
    sectionKey: "FEATURED_PORTFOLIO",
    name: "04. Dự Án Tiêu Biểu",
    title: "DỰ ÁN TIÊU BIỂU.",
    subtitle: "03 • HỒ SƠ NĂNG LỰC DỰ ÁN",
    description: "Các dự án tiêu biểu mang đậm dấu ấn sáng tạo và năng lực kỹ thuật đỉnh cao.",
    ctaText: "Xem Toàn Bộ Dự Án",
    ctaLink: "/portfolio",
    order: 4,
    isActive: true,
  },
  {
    sectionKey: "DIGITAL_LAB",
    name: "05. Digital LAB (Sản Phẩm AI & Số)",
    title: "PHÒNG NGHIÊN CỨU LAB.",
    subtitle: "04 • NGHIÊN CỨU & PHÁT TRIỂN AI",
    description:
      "Hệ sinh thái sản phẩm công nghệ độc quyền, công cụ AI và nền tảng SaaS thế hệ mới được nghiên cứu và phát triển trực tiếp bởi đội ngũ kỹ sư NGUYÊN LAB.",
    ctaText: "Khám Phá LAB",
    ctaLink: "/lab",
    order: 5,
    isActive: true,
  },
  {
    sectionKey: "PROCESS",
    name: "06. Quy Trình Làm Việc",
    title: "QUY TRÌNH CHUẨN MỰC.",
    subtitle: "05 • PHƯƠNG PHÁP & TIẾN TRÌNH",
    description: "Quy trình 5 giai đoạn chuẩn hóa mang lại chất lượng và sự an tâm tuyệt đối.",
    ctaText: "Khám Phá Quy Trình",
    ctaLink: "/about",
    order: 6,
    isActive: true,
  },
  {
    sectionKey: "TECH_STACK",
    name: "07. Hệ Thống Công Nghệ",
    title: "CÔNG NGHỆ TIÊN TIẾN.",
    subtitle: "06 • HỆ THỐNG CÔNG NGHỆ",
    description: "Làm chủ những công nghệ tân tiến nhất thế giới hiện nay từ Three.js, WebGL tới Distributed Cloud.",
    ctaText: "Xem Công Nghệ",
    ctaLink: "/services",
    order: 7,
    isActive: true,
  },
  {
    sectionKey: "TESTIMONIALS",
    name: "08. Đánh Giá Khách Hàng",
    title: "NIỀM TIN ĐỐI TÁC.",
    subtitle: "07 • ĐÁNH GIÁ TỪ KHÁCH HÀNG",
    description: "Phản hồi từ các đối tác và tập đoàn hàng đầu đã đồng hành cùng NGUYÊN AGENCY.",
    ctaText: "Xem Đánh Giá",
    ctaLink: "/about",
    order: 8,
    isActive: true,
  },
  {
    sectionKey: "LATEST_BLOG",
    name: "09. Bài Viết & Nghiên Cứu Mới Nhất (Blog)",
    title: "BÀI VIẾT & NGHIÊN CỨU MỚI NHẤT.",
    subtitle: "08 • GÓC NHÌN & BÀI VIẾT CHUYÊN SÂU",
    description:
      "Góc nhìn chuyên sâu về kiến trúc phần mềm, đồ họa 3D WebGL thời gian thực, AI ứng dụng và chiến lược thương hiệu số từ đội ngũ chuyên gia NGUYÊN AGENCY.",
    ctaText: "Xem Tất Cả Bài Viết",
    ctaLink: "/blog",
    order: 9,
    isActive: true,
  },
  {
    sectionKey: "FAQ",
    name: "10. Câu Hỏi Thường Gặp",
    title: "CÂU HỎI THƯỜNG GẶP.",
    subtitle: "09 • HỎI & ĐÁP MINH BẠCH",
    description: "Giải đáp tất cả thắc mắc về quy trình, báo giá và dịch vụ kỹ thuật của NGUYÊN AGENCY.",
    ctaText: "Xem Tất Cả FAQ",
    ctaLink: "/faq",
    order: 10,
    isActive: true,
  },
  {
    sectionKey: "CONTACT_CTA",
    name: "11. Liên Hệ Chân Trang",
    title: "KHỞI ĐỘNG DỰ ÁN CỦA BẠN.",
    subtitle: "10 • KẾT NỐI HỢP TÁC",
    description: "Sẵn sàng đưa thương hiệu và sản phẩm của bạn vươn tầm số hóa đỉnh cao?",
    ctaText: "Bắt Đầu Dự Án Ngay",
    ctaLink: "/contact",
    order: 11,
    isActive: true,
  },
];

export async function ensureHomepageSections() {
  const count = await prisma.homepageSection.count();
  if (count === 0) {
    for (const sec of DEFAULT_HOMEPAGE_SECTIONS) {
      await prisma.homepageSection.create({
        data: sec,
      });
    }
    return;
  }

  // Ensure LATEST_BLOG section exists if database was seeded before it was added
  const hasLatestBlog = await prisma.homepageSection.findUnique({
    where: { sectionKey: "LATEST_BLOG" },
  });
  if (!hasLatestBlog) {
    const blogDef = DEFAULT_HOMEPAGE_SECTIONS.find(
      (s) => s.sectionKey === "LATEST_BLOG"
    );
    if (blogDef) {
      await prisma.homepageSection.create({ data: blogDef });
    }
  }
}
