import React from "react";
import prisma from "@/lib/prisma";
import FAQPageClient from "@/components/faq/FAQPageClient";
import { getFAQSchema, getBreadcrumbSchema } from "@/lib/seo-schemas";

export const metadata = {
  title: "Câu Hỏi Thường Gặp (FAQ) – NGUYÊN AGENCY",
  description:
    "Giải đáp toàn bộ thắc mắc về quy trình ký kết, công nghệ 3D Three.js, chi phí và chuyển giao mã nguồn tại NGUYÊN AGENCY.",
  alternates: {
    canonical: "https://nguyenagency.online/faq",
  },
  openGraph: {
    title: "Câu Hỏi Thường Gặp (FAQ) – NGUYÊN AGENCY",
    description:
      "Giải đáp toàn bộ thắc mắc về quy trình ký kết, công nghệ 3D Three.js, chi phí và chuyển giao mã nguồn tại NGUYÊN AGENCY.",
    url: "https://nguyenagency.online/faq",
    siteName: "NGUYÊN AGENCY",
    type: "website",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Câu Hỏi Thường Gặp (FAQ) – NGUYÊN AGENCY",
    description:
      "Giải đáp toàn bộ thắc mắc về quy trình ký kết, công nghệ 3D Three.js, chi phí và chuyển giao mã nguồn tại NGUYÊN AGENCY.",
  },
};

export const revalidate = 60;

export default async function FAQPage() {
  let faqs: any[] = [];
  try {
    faqs = await prisma.fAQ.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
    });
  } catch (err) {
    console.warn("[FAQPage] DB fetch fallback active:", err);
  }

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Câu hỏi thường gặp (FAQ)", path: "/faq" },
  ]);
  const faqSchema =
    faqs.length > 0
      ? getFAQSchema(
          faqs.map((f) => ({
            question: f.question,
            answer: f.answer,
          }))
        )
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <FAQPageClient faqs={faqs} />
    </>
  );
}
