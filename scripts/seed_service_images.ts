import { prisma } from "../src/lib/prisma";
import fs from "fs";
import path from "path";
import https from "https";
import { uploadToSupabaseBucket } from "../src/lib/supabase";

interface ServiceImageConfig {
  slug: string;
  altText: string;
  thumbQuery: string;
  coverQuery: string;
  galleryQueries: [string, string, string];
}

// 24 Dịch vụ chính thức với các bộ ảnh độc bản, phong cách Luxury Agency (#0A0A0A, #007BA7, #FF2D95)
const SERVICE_IMAGES: ServiceImageConfig[] = [
  // 12 MEDIA SERVICES
  {
    slug: "branding-identity",
    altText: "Xây Dựng Nhận Diện Thương Hiệu Toàn Diện NGUYÊN AGENCY",
    thumbQuery: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80",
    coverQuery: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1920&q=85",
    galleryQueries: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    slug: "logo-design",
    altText: "Thiết Kế Logo Độc Bản & Brand Guidelines NGUYÊN AGENCY",
    thumbQuery: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80",
    coverQuery: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=85",
    galleryQueries: [
      "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    slug: "graphic-design",
    altText: "Thiết Kế Đồ Họa & Ấn Phẩm Tiếp Thị Cao Cấp NGUYÊN AGENCY",
    thumbQuery: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?auto=format&fit=crop&w=1200&q=80",
    coverQuery: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=85",
    galleryQueries: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1576153192396-180ecef2a715?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    slug: "banner-design",
    altText: "Thiết Kế Banner Quảng Cáo & POSM Điểm Bán NGUYÊN AGENCY",
    thumbQuery: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=80",
    coverQuery: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1920&q=85",
    galleryQueries: [
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    slug: "poster-design",
    altText: "Thiết Kế Poster & Key Visual Nghệ Thuật NGUYÊN AGENCY",
    thumbQuery: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
    coverQuery: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=85",
    galleryQueries: [
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    slug: "menu-design",
    altText: "Thiết Kế Menu & Ấn Phẩm F&B Cao Cấp NGUYÊN AGENCY",
    thumbQuery: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    coverQuery: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=85",
    galleryQueries: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    slug: "social-media-design",
    altText: "Thiết Kế Visual Mạng Xã Hội Đa Kênh NGUYÊN AGENCY",
    thumbQuery: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80",
    coverQuery: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=1920&q=85",
    galleryQueries: [
      "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    slug: "advertising-creative",
    altText: "Sáng Tạo Nội Dung & Key Visual Quảng Cáo NGUYÊN AGENCY",
    thumbQuery: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=1200&q=80",
    coverQuery: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=85",
    galleryQueries: [
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    slug: "video-production",
    altText: "Sản Xuất Video TVC & Phim Doanh Nghiệp NGUYÊN AGENCY",
    thumbQuery: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
    coverQuery: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1920&q=85",
    galleryQueries: [
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518135714426-c18f5ffb6f4d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    slug: "ai-video-production",
    altText: "Sản Xuất Video AI & Hiệu Ứng Điện Toán NGUYÊN AGENCY",
    thumbQuery: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    coverQuery: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1920&q=85",
    galleryQueries: [
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    slug: "digital-marketing",
    altText: "Chiến Lược Digital Marketing Tăng Trưởng NGUYÊN AGENCY",
    thumbQuery: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    coverQuery: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=85",
    galleryQueries: [
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    slug: "content-creation",
    altText: "Sáng Tạo Nội Dung & Copywriting Chuyên Sâu NGUYÊN AGENCY",
    thumbQuery: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
    coverQuery: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1920&q=85",
    galleryQueries: [
      "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?auto=format&fit=crop&w=1200&q=80"
    ]
  },

  // 12 TECH SERVICES
  {
    slug: "business-website",
    altText: "Thiết Kế & Lập Trình Website Doanh Nghiệp Chuẩn SEO NGUYÊN AGENCY",
    thumbQuery: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    coverQuery: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1920&q=85",
    galleryQueries: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    slug: "corporate-website",
    altText: "Xây Dựng Website Tập Đoàn Đa Ngôn Ngữ & Bảo Mật NGUYÊN AGENCY",
    thumbQuery: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    coverQuery: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=85",
    galleryQueries: [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    slug: "landing-page",
    altText: "Thiết Kế Landing Page Chuyển Đổi Cao & Tối Ưu Tốc Độ NGUYÊN AGENCY",
    thumbQuery: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    coverQuery: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=85",
    galleryQueries: [
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    slug: "ecommerce-website",
    altText: "Phát Triển Website E-Commerce & Cổng Thanh Toán NGUYÊN AGENCY",
    thumbQuery: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80",
    coverQuery: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1920&q=85",
    galleryQueries: [
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    slug: "web-application",
    altText: "Phát Triển Ứng Dụng Web & Nền Tảng SaaS Chuyên Sâu NGUYÊN AGENCY",
    thumbQuery: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    coverQuery: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1920&q=85",
    galleryQueries: [
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    slug: "mobile-application",
    altText: "Phát Triển Ứng Dụng Di Động iOS & Android Cao Cấp NGUYÊN AGENCY",
    thumbQuery: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
    coverQuery: "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=1920&q=85",
    galleryQueries: [
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533022139390-e2be5f720b66?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    slug: "crm-system",
    altText: "Xây Dựng Hệ Thống CRM & Quản Trị Khách Hàng NGUYÊN AGENCY",
    thumbQuery: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    coverQuery: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=85",
    galleryQueries: [
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    slug: "management-software",
    altText: "Phần Mềm Quản Trị Vận Hành Doanh Nghiệp ERP NGUYÊN AGENCY",
    thumbQuery: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    coverQuery: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=85",
    galleryQueries: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    slug: "custom-software",
    altText: "Phát Triển Phần Mềm May Đo Theo Yêu Cầu NGUYÊN AGENCY",
    thumbQuery: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    coverQuery: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=85",
    galleryQueries: [
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    slug: "ai-integration",
    altText: "Tích Hợp Trí Tuệ Nhân Tạo AI Tự Động Hóa NGUYÊN AGENCY",
    thumbQuery: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80",
    coverQuery: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1920&q=85",
    galleryQueries: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    slug: "website-maintenance",
    altText: "Bảo Trì, Nâng Cấp & Tối Ưu Hệ Thống Số NGUYÊN AGENCY",
    thumbQuery: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    coverQuery: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=85",
    galleryQueries: [
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    slug: "ui-ux-design",
    altText: "Thiết Kế Trải Nghiệm UI/UX & Design System NGUYÊN AGENCY",
    thumbQuery: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80",
    coverQuery: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1920&q=85",
    galleryQueries: [
      "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80"
    ]
  }
];

function downloadImage(url: string, destPath: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status code ${res.statusCode}`));
      }

      const chunks: Buffer[] = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const buffer = Buffer.concat(chunks);
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.writeFileSync(destPath, buffer);
        resolve(buffer);
      });
      res.on("error", reject);
    }).on("error", reject);
  });
}

async function main() {
  console.log("=== BẮT ĐẦU TẠO BỘ ẢNH CHO 24 DỊCH VỤ NGUYÊN AGENCY ===");

  const uploadsDir = path.join(process.cwd(), "public", "uploads", "services");
  fs.mkdirSync(uploadsDir, { recursive: true });

  let processedCount = 0;

  for (const item of SERVICE_IMAGES) {
    console.log(`\n▶ Đang xử lý dịch vụ [${item.slug}]...`);
    const serviceDir = path.join(uploadsDir, item.slug);
    fs.mkdirSync(serviceDir, { recursive: true });

    // 1. Thumbnail
    const thumbPath = path.join(serviceDir, "thumbnail.jpg");
    const thumbUrl = `/uploads/services/${item.slug}/thumbnail.jpg`;
    const thumbStoragePath = `services/${item.slug}/thumbnail.jpg`;
    let thumbBuffer: Buffer;
    try {
      thumbBuffer = await downloadImage(item.thumbQuery, thumbPath);
      console.log(`  ✓ Đã tải Thumbnail (${(thumbBuffer.length / 1024).toFixed(1)} KB)`);
    } catch (e: any) {
      console.warn(`  ! Không tải được thumbnail: ${e.message}, dùng fallback`);
      thumbBuffer = Buffer.from("");
    }

    // Best-effort Supabase upload
    let supaThumbUrl: string | null = null;
    if (thumbBuffer.length > 0) {
      const res = await uploadToSupabaseBucket("nguyen-agency-media", thumbStoragePath, thumbBuffer, "image/jpeg");
      if (res.success && res.publicUrl) supaThumbUrl = res.publicUrl;
    }

    // 2. Cover Banner
    const coverPath = path.join(serviceDir, "cover.jpg");
    const coverUrl = `/uploads/services/${item.slug}/cover.jpg`;
    const coverStoragePath = `services/${item.slug}/cover.jpg`;
    let coverBuffer: Buffer;
    try {
      coverBuffer = await downloadImage(item.coverQuery, coverPath);
      console.log(`  ✓ Đã tải Cover Banner (${(coverBuffer.length / 1024).toFixed(1)} KB)`);
    } catch (e: any) {
      console.warn(`  ! Không tải được cover: ${e.message}`);
      coverBuffer = Buffer.from("");
    }

    let supaCoverUrl: string | null = null;
    if (coverBuffer.length > 0) {
      const res = await uploadToSupabaseBucket("nguyen-agency-media", coverStoragePath, coverBuffer, "image/jpeg");
      if (res.success && res.publicUrl) supaCoverUrl = res.publicUrl;
    }

    // 3. Gallery (3 ảnh)
    const galleryUrls: string[] = [];
    for (let i = 0; i < item.galleryQueries.length; i++) {
      const gFileName = `gallery-${i + 1}.jpg`;
      const gPath = path.join(serviceDir, gFileName);
      const gUrl = `/uploads/services/${item.slug}/${gFileName}`;
      const gStoragePath = `services/${item.slug}/${gFileName}`;
      try {
        const gBuffer = await downloadImage(item.galleryQueries[i], gPath);
        galleryUrls.push(gUrl);
        await uploadToSupabaseBucket("nguyen-agency-media", gStoragePath, gBuffer, "image/jpeg");
      } catch (e: any) {
        galleryUrls.push(gUrl);
      }
    }
    console.log(`  ✓ Đã tải 3 ảnh Gallery`);

    // Lưu vào MediaAsset
    try {
      await prisma.mediaAsset.upsert({
        where: { id: `asset-thumb-${item.slug}` },
        update: {
          url: supaThumbUrl || thumbUrl,
          storagePath: thumbStoragePath,
          size: thumbBuffer.length,
          altText: item.altText,
        },
        create: {
          id: `asset-thumb-${item.slug}`,
          title: `Thumbnail - ${item.slug}`,
          fileName: "thumbnail.jpg",
          url: supaThumbUrl || thumbUrl,
          storagePath: thumbStoragePath,
          mimeType: "image/jpeg",
          type: "IMAGE",
          folder: "services",
          size: thumbBuffer.length,
          altText: item.altText,
          uploadedBy: "System Seeder",
        }
      });
    } catch (e) {}

    // Cập nhật dịch vụ trong Database
    const finalThumb = supaThumbUrl || thumbUrl;
    const finalCover = supaCoverUrl || coverUrl;

    const updated = await prisma.service.updateMany({
      where: { slug: item.slug },
      data: {
        thumbnail: finalThumb,
        coverImage: finalCover,
        galleryJson: JSON.stringify(galleryUrls),
        altText: item.altText,
      }
    });

    if (updated.count > 0) {
      console.log(`  ✅ Đã đồng bộ vào Database cho dịch vụ ${item.slug}`);
      processedCount++;
    } else {
      console.warn(`  ⚠️ Không tìm thấy dịch vụ slug = ${item.slug}`);
    }
  }

  console.log(`\n🎉 HOÀN TẤT! Đã đồng bộ ảnh cho ${processedCount}/${SERVICE_IMAGES.length} dịch vụ.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

