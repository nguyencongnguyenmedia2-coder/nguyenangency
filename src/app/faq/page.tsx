import React from "react";
import prisma from "@/lib/prisma";
import FAQPageClient from "@/components/faq/FAQPageClient";

export const metadata = {
  title: "Câu Hỏi Thường Gặp (FAQ) – NGUYÊN AGENCY",
  description:
    "Giải đáp toàn bộ thắc mắc về quy trình ký kết, công nghệ 3D Three.js, chi phí và chuyển giao mã nguồn tại NGUYÊN AGENCY.",
};

export const dynamic = "force-dynamic";

export default async function FAQPage() {
  const faqs = await prisma.fAQ.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
  });

  return <FAQPageClient faqs={faqs} />;
}
