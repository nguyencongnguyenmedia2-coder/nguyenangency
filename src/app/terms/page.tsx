import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, BRAND_INFO, getWebPageSchema, getBreadcrumbSchema } from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Điều Khoản Sử Dụng – NGUYÊN AGENCY",
  description:
    "Điều khoản sử dụng website, quyền sở hữu trí tuệ và quy định hợp tác dịch vụ tại Nguyen Agency (Nguyễn Công Nguyên Media).",
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
  openGraph: {
    title: "Điều Khoản Sử Dụng – NGUYÊN AGENCY",
    description:
      "Điều khoản sử dụng website, quyền sở hữu trí tuệ và quy định hợp tác dịch vụ tại Nguyen Agency.",
    url: `${SITE_URL}/terms`,
    siteName: "NGUYÊN AGENCY",
    type: "website",
    locale: "vi_VN",
  },
};

export default function TermsPage() {
  const webPageSchema = getWebPageSchema({
    name: "Điều Khoản Sử Dụng – NGUYÊN AGENCY",
    description:
      "Điều khoản sử dụng website, quyền sở hữu trí tuệ và quy định hợp tác dịch vụ tại Nguyen Agency.",
    url: `${SITE_URL}/terms`,
  });
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Điều khoản sử dụng", path: "/terms" },
  ]);

  return (
    <div className="pt-32 pb-24 px-6 bg-[#0A0A0A] text-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="space-y-4 border-b border-[#292929] pb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF2D95]">
            QUY ĐỊNH &amp; HỢP TÁC
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Điều Khoản Sử Dụng
          </h1>
          <p className="text-sm text-[#A1A1AA]">
            Quy định truy cập và sử dụng dịch vụ tại {SITE_URL} ({BRAND_INFO.name}).
          </p>
        </header>

        <section className="space-y-6 text-sm sm:text-base text-[#D4D4D8] leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">1. Phạm vi áp dụng</h2>
            <p>
              Khi truy cập website {SITE_URL} hoặc gửi yêu cầu tư vấn dịch vụ, bạn đồng ý tuân thủ các điều khoản sử dụng và quy định pháp luật hiện hành tại Việt Nam.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">2. Quyền sở hữu trí tuệ</h2>
            <p>
              Toàn bộ nội dung, mã nguồn, thiết kế giao diện, hình ảnh và tài liệu công bố trên website thuộc quyền sở hữu của Nguyen Agency hoặc được cấp phép sử dụng hợp pháp. Đối với dự án khách hàng, quyền sở hữu sản phẩm và mã nguồn được bàn giao theo thỏa thuận trong hợp đồng.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">3. Báo giá và triển khai dịch vụ</h2>
            <p>
              Mọi báo giá tham khảo trên website có thể được điều chỉnh tùy theo phạm vi tính năng thực tế của từng doanh nghiệp và chỉ có hiệu lực chính thức khi được xác nhận bằng văn bản hoặc hợp đồng dịch vụ.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">4. Thông tin liên hệ</h2>
            <p>
              Nếu có câu hỏi về điều khoản sử dụng, vui lòng truy cập{" "}
              <Link href="/contact" className="text-[#00E5FF] underline">
                trang Liên hệ
              </Link>{" "}
              hoặc xem thêm{" "}
              <Link href="/privacy" className="text-[#00E5FF] underline">
                Chính sách bảo mật
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

