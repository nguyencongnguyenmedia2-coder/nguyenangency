import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OFFICIAL_24_SERVICES } from "@/data/services-data";
import { BRAND_INFO, SITE_URL } from "@/lib/seo-schemas";

export const revalidate = 3600;

export async function GET() {
  let portfolios: { title: string; slug: string; clientName: string; shortDesc: string; year: string }[] = [];
  let faqs: { question: string; answer: string }[] = [];
  let blogPosts: { title: string; slug: string; excerpt: string | null }[] = [];

  try {
    const [pRows, fRows, bRows] = await Promise.all([
      prisma.portfolio.findMany({
        where: { status: "PUBLISHED", deletedAt: null },
        select: { title: true, slug: true, clientName: true, shortDesc: true, year: true },
        orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
        take: 12,
      }),
      prisma.fAQ.findMany({
        where: { status: "PUBLISHED" },
        select: { question: true, answer: true },
        orderBy: { order: "asc" },
        take: 15,
      }),
      prisma.blogPost.findMany({
        where: { status: "PUBLISHED", deletedAt: null },
        select: { title: true, slug: true, excerpt: true },
        orderBy: { publishedAt: "desc" },
        take: 12,
      }),
    ]);
    portfolios = pRows;
    faqs = fRows;
    blogPosts = bRows;
  } catch {
    // Graceful fallback if DB is unavailable
  }

  const mediaServices = OFFICIAL_24_SERVICES.filter((s) => s.group === "MEDIA");
  const techServices = OFFICIAL_24_SERVICES.filter((s) => s.group === "TECH");

  const detailedServicesMd = OFFICIAL_24_SERVICES.map((s, idx) => {
    const num = String(idx + 1).padStart(2, "0");
    const items = s.proposedItems.map((i) => `  - ${i}`).join("\n");
    const deliverables = s.deliverables.map((d) => `  - ${d}`).join("\n");
    const audience = s.targetAudience.map((a) => `  - ${a}`).join("\n");
    const processSteps = s.process
      .map((p) => `  ${p.step}. **${p.name}:** ${p.desc}`)
      .join("\n");
    const serviceFaqs = s.faqs
      .map((f) => `  - **Q:** ${f.question}\n    **A:** ${f.answer}`)
      .join("\n");

    return `### ${num}. ${s.title} — ${s.titleVn}
- **URL chính thức:** ${SITE_URL}/services/${s.slug}
- **Phân hệ:** ${s.group} (${s.categoryName})
- **Từ khóa trọng tâm:** ${s.primaryKeyword}
- **Mô tả tóm tắt:** ${s.shortDesc}

**Giới thiệu nhu cầu & bối cảnh:**
${s.intro}

**Giải pháp của ${BRAND_INFO.name}:**
${s.solution}

**Hạng mục đề xuất:**
${items}

**Sản phẩm bàn giao:**
${deliverables}

**Đối tượng khách hàng phù hợp:**
${audience}

**Quy trình triển khai:**
${processSteps}

**Câu hỏi thường gặp:**
${serviceFaqs}`;
  }).join("\n\n---\n\n");

  const portfolioMd =
    portfolios.length > 0
      ? portfolios
          .map(
            (p) =>
              `- **${p.title}** (${p.year}, Khách hàng: ${p.clientName}): ${p.shortDesc} — [${SITE_URL}/portfolio/${p.slug}](${SITE_URL}/portfolio/${p.slug})`
          )
          .join("\n")
      : `- Xem danh sách dự án công khai tại: ${SITE_URL}/portfolio và ${SITE_URL}/du-an`;

  const blogMd =
    blogPosts.length > 0
      ? blogPosts
          .map(
            (b) =>
              `- **${b.title}**: ${b.excerpt || "Bài viết chuyên môn tại Nguyen Agency."} — [${SITE_URL}/blog/${b.slug}](${SITE_URL}/blog/${b.slug})`
          )
          .join("\n")
      : `- Xem các bài viết chuyên sâu tại: ${SITE_URL}/blog`;

  const faqMd =
    faqs.length > 0
      ? faqs.map((f) => `- **${f.question}**\n  ${f.answer}`).join("\n\n")
      : `- Xem danh sách câu hỏi thường gặp đầy đủ tại: ${SITE_URL}/faq`;

  const markdown = `# ${BRAND_INFO.name} — TÀI LIỆU TỔNG QUAN HỆ THỐNG (LLMS FULL)

Tài liệu này tổng hợp thông tin công khai từ website chính thức ${SITE_URL} nhằm hỗ trợ các công cụ tìm kiếm và hệ thống AI hiểu đúng về thương hiệu, dịch vụ, quy trình và năng lực thực tế của ${BRAND_INFO.name}.

---

## 1. Tổng quan Nguyen Agency
- **Thương hiệu:** ${BRAND_INFO.name} (${BRAND_INFO.alternateName.join(" / ")})
- **Website chính thức:** ${SITE_URL}
- **Thông điệp:** ${BRAND_INFO.slogan}
- **Người sáng lập:** ${BRAND_INFO.founder} (${SITE_URL}/nguyen-cong-nguyen)
- **Khu vực phục vụ:** Quảng Ngãi và toàn quốc (Việt Nam)
- **Ngôn ngữ chính:** Tiếng Việt (vi-VN)

## 2. Giới thiệu thương hiệu
${BRAND_INFO.name} hoạt động theo mô hình kết hợp giữa truyền thông sáng tạo (Media & Branding) và kỹ thuật phần mềm (Web, App & AI). Mục tiêu cốt lõi là giúp doanh nghiệp xây dựng nền tảng số rõ ràng, tối ưu trải nghiệm người dùng, chuẩn hóa nhận diện thương hiệu và tối ưu hiệu quả vận hành kinh doanh.
- Trang giới thiệu: ${SITE_URL}/about
- Hồ sơ người sáng lập: ${SITE_URL}/nguyen-cong-nguyen

## 3. Danh mục dịch vụ tổng quan (24 Dịch vụ)
### Phân hệ Media & Sáng tạo (${mediaServices.length} dịch vụ)
${mediaServices.map((s) => `- [${s.title} (${s.titleVn})](${SITE_URL}/services/${s.slug}): ${s.shortDesc}`).join("\n")}

### Phân hệ Công nghệ & Phần mềm (${techServices.length} dịch vụ)
${techServices.map((s) => `- [${s.title} (${s.titleVn})](${SITE_URL}/services/${s.slug}): ${s.shortDesc}`).join("\n")}

## 4. Mô tả chi tiết từng dịch vụ

${detailedServicesMd}

---

## 5. Quy trình triển khai dự án tiêu chuẩn
1. **Tiếp nhận & Khảo sát nhu cầu:** Làm rõ mục tiêu kinh doanh, đối tượng khách hàng và phạm vi công việc.
2. **Đề xuất giải pháp & Báo giá minh bạch:** Thống nhất hạng mục bàn giao, công nghệ áp dụng và lộ trình thực hiện.
3. **Thiết kế & Phát triển:** Triển khai giao diện UI/UX, nhận diện hoặc lập trình hệ thống theo chuẩn responsive và tối ưu tốc độ.
4. **Kiểm thử & Tối ưu SEO kỹ thuật:** Kiểm tra tương thích đa thiết bị, metadata, schema và hiệu năng trước khi phát hành.
5. **Bàn giao & Hỗ trợ vận hành:** Hướng dẫn quản trị, bàn giao tài nguyên và hỗ trợ kỹ thuật sau triển khai.

## 6. Công nghệ sử dụng được công bố
- **Frontend & Web Framework:** Next.js (App Router, SSR/SSG), React, TypeScript, Tailwind CSS.
- **Đồ họa & Tương tác 3D:** Three.js / WebGL, GSAP, Framer Motion.
- **Backend & Cơ sở dữ liệu:** Node.js, Prisma ORM, PostgreSQL.
- **Hạ tầng triển khai:** Ubuntu VPS, Nginx Reverse Proxy, PM2, HTTPS/SSL.
- **Tối ưu hình ảnh & Hiệu năng:** Sharp, chuẩn WebP/AVIF, HTTP Caching.

## 7. Dự án và Portfolio thực tế
${portfolioMd}

## 8. Bài viết & Kiến thức chuyên môn
${blogMd}

## 9. Câu hỏi thường gặp (FAQ)
${faqMd}

## 10. Thông tin liên hệ & Đường dẫn nguồn chính thức
- **Email:** ${BRAND_INFO.email}
- **Hotline / Zalo:** ${BRAND_INFO.hotline}
- **Khu vực:** ${BRAND_INFO.address.street}, ${BRAND_INFO.address.locality}, Việt Nam
- **Trang liên hệ:** ${SITE_URL}/lien-he (và ${SITE_URL}/contact)
- **Facebook chính thức:** ${BRAND_INFO.officialFacebook}
- **Sitemap XML:** ${SITE_URL}/sitemap.xml
- **Robots.txt:** ${SITE_URL}/robots.txt
- **Tóm tắt dịch vụ (llms.txt):** ${SITE_URL}/llms.txt
`;

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}

