import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, BRAND_INFO, getWebPageSchema, getBreadcrumbSchema } from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Chính Sách Bảo Mật – NGUYÊN AGENCY",
  description:
    "Chính sách bảo mật thông tin khách hàng, dữ liệu dự án và quyền riêng tư tại Nguyen Agency (Nguyễn Công Nguyên Media).",
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
  openGraph: {
    title: "Chính Sách Bảo Mật – NGUYÊN AGENCY",
    description:
      "Chính sách bảo mật thông tin khách hàng, dữ liệu dự án và quyền riêng tư tại Nguyen Agency.",
    url: `${SITE_URL}/privacy`,
    siteName: "NGUYÊN AGENCY",
    type: "website",
    locale: "vi_VN",
  },
};

export default function PrivacyPage() {
  const webPageSchema = getWebPageSchema({
    name: "Chính Sách Bảo Mật – NGUYÊN AGENCY",
    description:
      "Chính sách bảo mật thông tin khách hàng, dữ liệu dự án và quyền riêng tư tại Nguyen Agency.",
    url: `${SITE_URL}/privacy`,
  });
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Chính sách bảo mật", path: "/privacy" },
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
          <span className="text-xs font-mono uppercase tracking-widest text-[#007BA7]">
            PHÁP LÝ &amp; BẢO MẬT DỮ LIỆU
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Chính Sách Bảo Mật
          </h1>
          <p className="text-sm text-[#A1A1AA]">
            Áp dụng cho website chính thức {SITE_URL} thuộc {BRAND_INFO.name}.
          </p>
        </header>

        <section className="space-y-6 text-sm sm:text-base text-[#D4D4D8] leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">1. Thu thập thông tin</h2>
            <p>
              Nguyen Agency chỉ thu thập các thông tin cần thiết do khách hàng chủ động cung cấp qua biểu mẫu liên hệ, đặt lịch tư vấn hoặc yêu cầu báo giá (bao gồm họ tên, email, số điện thoại và mô tả nhu cầu dự án).
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">2. Mục đích sử dụng</h2>
            <p>
              Thông tin được sử dụng để tư vấn giải pháp, lập báo giá, triển khai hợp đồng thiết kế website, nhận diện thương hiệu, phần mềm và hỗ trợ kỹ thuật sau bàn giao.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">3. Cam kết bảo mật &amp; không chia sẻ</h2>
            <p>
              Chúng tôi không bán, trao đổi hoặc chia sẻ dữ liệu khách hàng cho bên thứ ba, ngoại trừ trường hợp có sự đồng ý của khách hàng hoặc theo yêu cầu hợp pháp của cơ quan chức năng.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">4. Liên hệ về quyền riêng tư</h2>
            <p>
              Mọi yêu cầu chỉnh sửa hoặc xóa dữ liệu cá nhân, vui lòng liên hệ qua trang{" "}
              <Link href="/contact" className="text-[#00E5FF] underline">
                Liên hệ
              </Link>{" "}
              hoặc email <span className="font-mono text-white">contact@nguyenagency.vn</span>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

