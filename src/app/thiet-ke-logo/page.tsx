import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Sparkles,
  ArrowRight,
  Palette,
  CheckCircle2,
  HelpCircle,
  Award,
  Layers,
  FileCheck,
  ShieldCheck,
  FileText,
} from "lucide-react";
import {
  SITE_URL,
  getServiceSchema,
  getBreadcrumbSchema,
  getFAQSchema,
} from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Thiết Kế Logo & Bộ Nhận Diện Thương Hiệu Độc Bản | Nguyên Agency",
  description:
    "Dịch vụ thiết kế logo và bộ nhận diện thương hiệu (Brand Guidelines) tại Quảng Ngãi và toàn quốc. Logo chuẩn phong thủy, bảo hộ độc quyền, bàn giao 100% file gốc vector.",
  alternates: {
    canonical: `${SITE_URL}/thiet-ke-logo`,
  },
  openGraph: {
    title: "Thiết Kế Logo & Bộ Nhận Diện Thương Hiệu Độc Bản | Nguyên Agency",
    description:
      "Dịch vụ thiết kế logo và bộ nhận diện thương hiệu (Brand Guidelines) tại Quảng Ngãi và toàn quốc. Logo chuẩn phong thủy, bảo hộ độc quyền, bàn giao 100% file gốc vector.",
    url: `${SITE_URL}/thiet-ke-logo`,
    siteName: "NGUYÊN AGENCY",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Thiết kế logo nhận diện thương hiệu – Nguyên Agency",
      },
    ],
  },
};

const FAQS = [
  {
    question: "Doanh nghiệp nhận được những định dạng file nào khi thiết kế logo?",
    answer:
      "Nguyên Agency bàn giao đầy đủ file gốc vector chất lượng in ấn không vỡ hạt: Adobe Illustrator (AI), EPS, PDF in ấn độ phân giải cao, file trong suốt PNG, SVG cho website và hướng dẫn tỷ lệ vàng logo.",
  },
  {
    question: "Logo có được bảo hộ quyền sở hữu trí tuệ tại Cục SHTT không?",
    answer:
      "Có. Mọi mẫu logo thiết kế tại Nguyên Agency đều là tác phẩm độc bản 100%, không sao chép từ thư viện mở và đáp ứng đầy đủ điều kiện tra cứu, đăng ký nhãn hiệu tại Cục Sở Hữu Trí Tuệ Việt Nam.",
  },
  {
    question: "Quy trình thiết kế logo diễn ra trong bao lâu?",
    answer:
      "Thời gian phác thảo ý tưởng ban đầu (3 phương án khác nhau) từ 3 đến 5 ngày làm việc. Sau khi khách hàng chọn phương án ưng ý, chúng tôi tinh chỉnh và hoàn thiện cuốn cẩm nang Brand Guidelines trong 3 - 5 ngày tiếp theo.",
  },
];

export default function ThietKeLogoPage() {
  const serviceSchema = getServiceSchema({
    name: "Thiết Kế Logo & Bộ Nhận Diện Thương Hiệu – Nguyên Agency",
    description:
      "Dịch vụ sáng tạo logo độc bản, cẩm nang thương hiệu Brand Guidelines và ấn phẩm truyền thông tại Quảng Ngãi.",
    url: "/thiet-ke-logo",
    serviceType: "Logo & Brand Identity Design",
    areaServed: "Quảng Ngãi, Việt Nam",
  });
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Thiết kế logo", path: "/thiet-ke-logo" },
  ]);
  const faqSchema = getFAQSchema(FAQS);

  return (
    <div className="pt-32 pb-24 px-6 bg-[#06070B] text-white relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-r from-[#FF2D95]/15 via-purple-500/10 to-transparent blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* Header */}
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md">
            <Palette className="w-3.5 h-3.5 text-[#FF2D95]" />
            <span className="text-[11px] font-mono tracking-widest text-[#FF2D95] uppercase font-bold">
              BRAND IDENTITY & CREATIVE
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[1.08]">
            THIẾT KẾ LOGO & <br />
            <span className="bg-gradient-to-r from-[#FF2D95] via-[#00E5FF] to-[#A855F7] bg-clip-text text-transparent">
              NHẬN DIỆN THƯƠNG HIỆU ĐỘC BẢN.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            Logo không chỉ là hình ảnh đại diện mà là linh hồn và tài sản sở hữu trí tuệ của doanh nghiệp. <strong>NGUYÊN AGENCY</strong> kiến tạo biểu tượng thị giác độc bản, chuẩn phong thủy ngành nghề và trường tồn với thời gian.
          </p>
        </div>

        {/* Deliverables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] hover:border-[#FF2D95]/50 transition-all space-y-4 backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#FF2D95]/10 border border-[#FF2D95]/30 flex items-center justify-center text-[#FF2D95]">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black uppercase text-white">Logo Độc Quyền & Phong Thủy</h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              3 phương án phác thảo ý tưởng độc đáo, nghiên cứu phong thủy màu sắc theo mệnh chủ doanh nghiệp và tỷ lệ vàng hình học.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-[#E2E8F0]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF2D95]" /> Thuyết minh ý nghĩa biểu tượng
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF2D95]" /> Cam kết khả năng bảo hộ nhãn hiệu
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] hover:border-[#00E5FF]/50 transition-all space-y-4 backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black uppercase text-white">Brand Guidelines 40+ Trang</h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Cẩm nang quy chuẩn ứng dụng thương hiệu: bảng mã màu CMYK/RGB, hệ thống font chữ Typography, khoảng cách an toàn và quy cách cấm kỵ.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-[#E2E8F0]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00E5FF]" /> Quy chuẩn in ấn & hiển thị số
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00E5FF]" /> Bàn giao file PDF hoàn thiện
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] hover:border-purple-400/50 transition-all space-y-4 backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Layers className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black uppercase text-white">Bộ Ấn Phẩm Văn Phòng & POSM</h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Ứng dụng thực tế lên danh thiếp (namecard), phong bì thư, tiêu đề thư, đồng phục nhân viên, hóa đơn và bộ avatar/cover mạng xã hội.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-[#E2E8F0]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" /> Đúng chuẩn kích thước in ấn
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" /> Bàn giao toàn bộ file thiết kế gốc
              </li>
            </ul>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-6 max-w-4xl">
          <h2 className="text-2xl font-black uppercase text-white">
            CÂU HỎI THƯỜNG GẶP VỀ THIẾT KẾ LOGO
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0D0F17]/80 border border-white/[0.08] space-y-2 backdrop-blur-xl"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-[#FF2D95] shrink-0" />
                  <h3 className="font-bold text-white text-sm sm:text-base">{faq.question}</h3>
                </div>
                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed pl-7">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-r from-[#FF2D95]/15 via-[#00E5FF]/10 to-purple-600/10 border border-white/[0.12] flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono tracking-widest text-[#FF2D95] uppercase font-bold">
              BẮT ĐẦU ĐỊNH VỊ THƯƠNG HIỆU DOANH NGHIỆP
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white">
              CẦN THIẾT KẾ LOGO ĐỘC BẢN CHO DỰ ÁN MỚI?
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8]">
              Cùng chuyên gia thiết kế tại Nguyên Agency lên ý tưởng và sở hữu bộ nhận diện thương hiệu chuyên nghiệp ngay hôm nay.
            </p>
          </div>
          <Link
            href="/lien-he"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF2D95] to-[#00E5FF] text-black font-mono text-xs font-black uppercase tracking-wider hover:shadow-[0_0_25px_rgba(255,45,149,0.5)] transition-all shrink-0 flex items-center justify-center gap-2"
          >
            <span>Nhận Tư Vấn Logo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

