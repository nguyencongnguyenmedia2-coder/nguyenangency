import React from "react";
import type { Metadata } from "next";
import PortfolioPage from "@/app/portfolio/page";
import { SITE_URL, getBreadcrumbSchema } from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Dự Án Thực Tế & Case Studies Tiêu Biểu | Nguyên Agency Quảng Ngãi",
  description:
    "Tổng hợp các dự án thiết kế website 3D, nhận diện thương hiệu độc bản và ứng dụng số tiêu biểu do Nguyễn Công Nguyên & đội ngũ Nguyên Agency thực hiện tại Quảng Ngãi và toàn quốc.",
  alternates: {
    canonical: `${SITE_URL}/du-an`,
  },
  openGraph: {
    title: "Dự Án Thực Tế & Case Studies Tiêu Biểu | Nguyên Agency Quảng Ngãi",
    description:
      "Tổng hợp các dự án thiết kế website 3D, nhận diện thương hiệu độc bản và ứng dụng số tiêu biểu do Nguyễn Công Nguyên & đội ngũ Nguyên Agency thực hiện tại Quảng Ngãi và toàn quốc.",
    url: `${SITE_URL}/du-an`,
    siteName: "NGUYÊN AGENCY",
    locale: "vi_VN",
    type: "website",
  },
};

export const revalidate = 60;

export default async function DuAnPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }> | { category?: string };
}) {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Dự án thực tế", path: "/du-an" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PortfolioPage searchParams={searchParams} />
    </>
  );
}

