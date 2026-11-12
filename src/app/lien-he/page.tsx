import React from "react";
import type { Metadata } from "next";
import ContactPage from "@/app/contact/page";
import {
  SITE_URL,
  getLocalBusinessSchema,
  getBreadcrumbSchema,
} from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Liên Hệ Nguyên Agency | Nguyễn Công Nguyên Media Quảng Ngãi",
  description:
    "Thông tin liên hệ chính thức Nguyên Agency – Nguyễn Công Nguyên Media tại TP. Quảng Ngãi. Hotline 24/7: 0344 979 307. Đặt lịch tư vấn thiết kế website, logo, media và AI.",
  alternates: {
    canonical: `${SITE_URL}/lien-he`,
  },
  openGraph: {
    title: "Liên Hệ Nguyên Agency | Nguyễn Công Nguyên Media Quảng Ngãi",
    description:
      "Thông tin liên hệ chính thức Nguyên Agency – Nguyễn Công Nguyên Media tại TP. Quảng Ngãi. Hotline 24/7: 0344 979 307. Đặt lịch tư vấn thiết kế website, logo, media và AI.",
    url: `${SITE_URL}/lien-he`,
    siteName: "NGUYÊN AGENCY",
    locale: "vi_VN",
    type: "website",
  },
};

export default function LienHePage() {
  const localBusinessSchema = getLocalBusinessSchema();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Liên hệ", path: "/lien-he" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ContactPage />
    </>
  );
}
