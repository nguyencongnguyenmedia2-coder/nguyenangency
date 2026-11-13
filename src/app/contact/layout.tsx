import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên Hệ & Khởi Tạo Dự Án – NGUYÊN AGENCY",
  description:
    "Liên hệ đội ngũ chuyên gia Nguyen Agency để nhận tư vấn giải pháp thiết kế website, nhận diện thương hiệu, Digital Marketing và phần mềm doanh nghiệp.",
  alternates: {
    canonical: "https://nguyenagency.online/contact",
  },
  openGraph: {
    title: "Liên Hệ & Khởi Tạo Dự Án – NGUYÊN AGENCY",
    description:
      "Liên hệ đội ngũ chuyên gia Nguyen Agency để nhận tư vấn giải pháp thiết kế website, nhận diện thương hiệu, Digital Marketing và phần mềm doanh nghiệp.",
    url: "https://nguyenagency.online/contact",
    siteName: "NGUYÊN AGENCY",
    type: "website",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Liên Hệ & Khởi Tạo Dự Án – NGUYÊN AGENCY",
    description:
      "Liên hệ đội ngũ chuyên gia Nguyen Agency để nhận tư vấn giải pháp thiết kế website, nhận diện thương hiệu, Digital Marketing và phần mềm doanh nghiệp.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

