import { NextResponse } from "next/server";
import { OFFICIAL_24_SERVICES } from "@/data/services-data";
import { BRAND_INFO, SITE_URL } from "@/lib/seo-schemas";

export const revalidate = 3600;

export async function GET() {
  const prioritySlugs = [
    "business-website",
    "corporate-website",
    "branding-identity",
    "ui-ux-design",
    "content-creation",
    "logo-design",
    "landing-page",
    "e-commerce-website",
    "digital-marketing",
    "ai-integration",
  ];

  const orderedServices = [
    ...prioritySlugs
      .map((slug) => OFFICIAL_24_SERVICES.find((s) => s.slug === slug))
      .filter((s): s is NonNullable<typeof s> => Boolean(s)),
    ...OFFICIAL_24_SERVICES.filter((s) => !prioritySlugs.includes(s.slug)),
  ];

  const serviceLines = orderedServices
    .map((s) => {
      const audience = s.targetAudience.slice(0, 2).join("; ");
      const benefits = s.proposedItems.slice(0, 3).join("; ");
      return [
        `### ${s.title} (${s.titleVn})`,
        `- **Lĩnh vực:** ${s.group === "MEDIA" ? "Media & Sáng tạo" : "Công nghệ & Phần mềm"} (${s.categoryName})`,
        `- **Mô tả ngắn:** ${s.shortDesc}`,
        `- **Đối tượng phù hợp:** ${audience}`,
        `- **Hạng mục / Lợi ích chính:** ${benefits}`,
        `- **URL chi tiết:** ${SITE_URL}/services/${s.slug}`,
      ].join("\n");
    })
    .join("\n\n");

  const markdown = `# ${BRAND_INFO.name}

> ${BRAND_INFO.name} (${BRAND_INFO.alternateName.join(", ")}) là đơn vị cung cấp giải pháp thiết kế website, xây dựng bộ nhận diện thương hiệu, truyền thông số (Digital Marketing) và phát triển phần mềm / AI tại Quảng Ngãi và toàn quốc (Việt Nam).

## Thông tin thương hiệu

- **Tên thương hiệu:** ${BRAND_INFO.name}
- **Người sáng lập:** ${BRAND_INFO.founder}
- **Website chính thức:** ${SITE_URL}
- **Thông điệp:** ${BRAND_INFO.slogan}
- **Thị trường phục vụ:** Quảng Ngãi và toàn quốc (Việt Nam)
- **Ngôn ngữ chính:** Tiếng Việt (vi-VN)
- **Lĩnh vực chuyên môn:** Thiết kế website doanh nghiệp & kinh doanh, thiết kế thương hiệu & logo, Digital Marketing, sản xuất media/video, phát triển phần mềm và tích hợp AI Automation.
- **Liên hệ:** Email: ${BRAND_INFO.email} | Hotline/Zalo: ${BRAND_INFO.hotline}

## Các đường dẫn quan trọng

- [Trang chủ](${SITE_URL}/): Tổng quan hệ sinh thái giải pháp Media & Tech của Nguyen Agency.
- [Giới thiệu Nguyen Agency](${SITE_URL}/about): Tầm nhìn, năng lực và đội ngũ thực hiện.
- [Hồ sơ Founder Nguyễn Công Nguyên](${SITE_URL}/nguyen-cong-nguyen): Thông tin chuyên môn của người sáng lập.
- [Danh mục 24 Dịch vụ](${SITE_URL}/services): Tổng hợp toàn bộ dịch vụ thiết kế web, branding, marketing và phần mềm.
- [Dự án & Portfolio](${SITE_URL}/portfolio): Các dự án và case study đã triển khai.
- [Trang Dự án (Tiếng Việt)](${SITE_URL}/du-an): Danh mục dự án thực tế theo ngành nghề.
- [Digital LAB](${SITE_URL}/lab): Các công cụ AI và sản phẩm phần mềm thử nghiệm.
- [Bảng giá tham khảo](${SITE_URL}/pricing): Thông tin các gói giải pháp dịch vụ.
- [Blog & Kiến thức](${SITE_URL}/blog): Bài viết chuyên môn về thiết kế web, SEO, branding và công nghệ.
- [Câu hỏi thường gặp (FAQ)](${SITE_URL}/faq): Giải đáp thắc mắc về quy trình và triển khai.
- [Liên hệ](${SITE_URL}/lien-he): Gửi yêu cầu tư vấn và nhận báo giá trực tiếp.
- [Tài liệu chi tiết đầy đủ (llms-full.txt)](${SITE_URL}/llms-full.txt): Tổng hợp chi tiết toàn bộ dịch vụ, quy trình và câu hỏi thường gặp.

## Danh mục dịch vụ chính thức (${orderedServices.length} dịch vụ)

${serviceLines}
`;

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}

