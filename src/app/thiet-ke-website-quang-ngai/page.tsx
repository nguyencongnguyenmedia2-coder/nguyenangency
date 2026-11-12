import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  Sparkles,
  ArrowRight,
  Code2,
  CheckCircle2,
  HelpCircle,
  Zap,
  ShieldCheck,
  Smartphone,
  Cpu,
  Layers,
  Monitor,
} from "lucide-react";
import {
  SITE_URL,
  getServiceSchema,
  getBreadcrumbSchema,
  getFAQSchema,
} from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Thiết Kế Website Quảng Ngãi – Chuẩn SEO, 3D WebGL Độc Bản | Nguyên Agency",
  description:
    "Dịch vụ thiết kế website tại Quảng Ngãi chuyên nghiệp: Website doanh nghiệp chuẩn SEO, Website 3D WebGL mượt mà, bàn giao 100% mã nguồn, bảo hành kỹ thuật 12 tháng tại địa phương.",
  alternates: {
    canonical: `${SITE_URL}/thiet-ke-website-quang-ngai`,
  },
  openGraph: {
    title: "Thiết Kế Website Quảng Ngãi – Chuẩn SEO, 3D WebGL Độc Bản | Nguyên Agency",
    description:
      "Dịch vụ thiết kế website tại Quảng Ngãi chuyên nghiệp: Website doanh nghiệp chuẩn SEO, Website 3D WebGL mượt mà, bàn giao 100% mã nguồn, bảo hành kỹ thuật 12 tháng tại địa phương.",
    url: `${SITE_URL}/thiet-ke-website-quang-ngai`,
    siteName: "NGUYÊN AGENCY",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Thiết kế website Quảng Ngãi – Nguyên Agency",
      },
    ],
  },
};

const FAQS = [
  {
    question: "Chi phí thiết kế website tại Quảng Ngãi là bao nhiêu?",
    answer:
      "Tại Nguyên Agency, chi phí được công khai minh bạch: Gói Website Doanh Nghiệp Tiêu Chuẩn từ 15.000.000 VNĐ, Gói Website 3D WebGL Cao Cấp từ 35.000.000 VNĐ. Cam kết không phát sinh bất kỳ phụ phí nào.",
  },
  {
    question: "Doanh nghiệp có được sở hữu toàn bộ mã nguồn website không?",
    answer:
      "Cam kết 100% có. Chúng tôi bàn giao toàn bộ mã nguồn Git, tài liệu kỹ thuật, quyền quản trị tên miền và tài khoản lưu trữ máy chủ cho khách hàng mà không giữ lại bất kỳ bản quyền ràng buộc nào.",
  },
  {
    question: "Website có được tối ưu chuẩn SEO để lên top Google không?",
    answer:
      "Mọi website do Nguyên Agency lập trình đều tối ưu cấu trúc thẻ Schema Rich Snippets, tốc độ tải trang đạt 95+ điểm Google Core Web Vitals, chuẩn SEO On-page và tích hợp Sitemap tự động.",
  },
  {
    question: "Chế độ bảo hành website tại Quảng Ngãi như thế nào?",
    answer:
      "Bảo hành kỹ thuật miễn phí 12 đến 24 tháng. Hỗ trợ xử lý sự cố trong vòng 2 giờ và có nhân sự hỗ trợ trực tiếp tại TP. Quảng Ngãi.",
  },
];

export default function ThietKeWebsiteQuangNgaiPage() {
  const serviceSchema = getServiceSchema({
    name: "Dịch Vụ Thiết Kế Website Quảng Ngãi – Nguyên Agency",
    description:
      "Dịch vụ thiết kế website doanh nghiệp, trang 3D WebGL và ứng dụng web chuyên nghiệp tại Quảng Ngãi.",
    url: "/thiet-ke-website-quang-ngai",
    serviceType: "Web Design and Development",
    areaServed: "Quảng Ngãi",
  });
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Thiết kế website Quảng Ngãi", path: "/thiet-ke-website-quang-ngai" },
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
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-r from-[#00E5FF]/15 via-[#FF2D95]/10 to-transparent blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* Header */}
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md">
            <Code2 className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="text-[11px] font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              WEB DEVELOPMENT • QUẢNG NGÃI
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[1.08]">
            THIẾT KẾ WEBSITE QUẢNG NGÃI & <br />
            <span className="bg-gradient-to-r from-[#00E5FF] via-[#FF2D95] to-[#A855F7] bg-clip-text text-transparent">
              CÔNG NGHỆ 3D WEBGL DẪN ĐẦU.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            <strong>NGUYÊN AGENCY</strong> mang đến chuẩn mực thiết kế website thế hệ mới cho doanh nghiệp tại Quảng Ngãi: Tốc độ tải trang siêu tốc, giao diện Luxury Dark Tech độc bản, tích hợp tương tác 3D WebGL thời gian thực và chuyển giao 100% bản quyền mã nguồn.
          </p>
        </div>

        {/* 4 Core Standards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-7 rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] hover:border-[#00E5FF]/50 transition-all space-y-3 backdrop-blur-xl">
            <Zap className="w-6 h-6 text-[#00E5FF]" />
            <h2 className="text-lg font-black uppercase text-white">Tốc Độ Tải Dưới 1.5 Giây</h2>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Xây dựng trên nền tảng Next.js 15 và Server Components hiện đại, đạt 95+ điểm Google Core Web Vitals giúp giữ chân khách hàng tối đa.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] hover:border-[#FF2D95]/50 transition-all space-y-3 backdrop-blur-xl">
            <Monitor className="w-6 h-6 text-[#FF2D95]" />
            <h2 className="text-lg font-black uppercase text-white">Hiệu Ứng 3D WebGL 60 FPS</h2>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Tích hợp Three.js render mô hình sản phẩm 3D tương tác chân thực ngay trên trình duyệt mà không cần cài đặt thêm phần mềm.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] hover:border-purple-400/50 transition-all space-y-3 backdrop-blur-xl">
            <Smartphone className="w-6 h-6 text-purple-400" />
            <h2 className="text-lg font-black uppercase text-white">Responsive 100% Thiết Bị</h2>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Tương thích hoàn hảo từ màn hình iPhone, Android đến máy tính bảng và màn hình siêu rộng 4K, đảm bảo giao diện luôn chuẩn nét.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] hover:border-emerald-400/50 transition-all space-y-3 backdrop-blur-xl">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="text-lg font-black uppercase text-white">Bàn Giao 100% Mã Nguồn</h2>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Doanh nghiệp toàn quyền sở hữu Git Repository và cơ sở dữ liệu độc lập, không bị phụ thuộc vào bất kỳ nền tảng thuê bao nào.
            </p>
          </div>
        </div>

        {/* Pricing Quick Bridge */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              BẢNG GIÁ DỊCH VỤ THIẾT KẾ WEB
            </span>
            <h2 className="text-2xl font-black uppercase text-white">
              CÁC GÓI THIẾT KẾ WEBSITE DOANH NGHIỆP PHỔ BIẾN
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-black/40 border border-white/[0.06] space-y-4">
              <span className="text-xs font-mono text-[#94A3B8]">GÓI CƠ BẢN</span>
              <h3 className="text-xl font-bold text-white">Website Doanh Nghiệp Chuẩn SEO</h3>
              <div className="text-2xl font-black text-white font-mono">15.000.000 VNĐ</div>
              <p className="text-xs text-[#94A3B8]">
                Dành cho công ty giới thiệu dịch vụ, hồ sơ năng lực, chuẩn SEO Google và CMS quản trị bài viết.
              </p>
              <Link
                href="/lien-he?package=web-standard"
                className="block text-center py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-mono font-bold text-white transition-colors"
              >
                Chọn Gói Này
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D0F17] border-2 border-[#FF2D95] space-y-4 shadow-[0_0_30px_rgba(255,45,149,0.25)] relative">
              <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#FF2D95] text-black font-mono text-[9px] font-black uppercase">
                PHỔ BIẾN NHẤT
              </div>
              <span className="text-xs font-mono text-[#FF2D95]">GÓI CAO CẤP</span>
              <h3 className="text-xl font-bold text-white">Website 3D WebGL Độc Bản</h3>
              <div className="text-2xl font-black text-white font-mono">35.000.000 VNĐ</div>
              <p className="text-xs text-[#94A3B8]">
                Tích hợp hiệu ứng không gian 3D tương tác, phong cách Luxury Dark Tech định vị vị thế dẫn đầu ngành.
              </p>
              <Link
                href="/lien-he?package=web-3d"
                className="block text-center py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#FF2D95] text-black font-mono text-xs font-black uppercase transition-all"
              >
                Chọn Gói 3D Pro
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-white/[0.06] space-y-4">
              <span className="text-xs font-mono text-[#00E5FF]">GÓI ENTERPRISE</span>
              <h3 className="text-xl font-bold text-white">Web App & E-Commerce</h3>
              <div className="text-2xl font-black text-white font-mono">65.000.000 VNĐ</div>
              <p className="text-xs text-[#94A3B8]">
                Hệ thống cổng thanh toán VietQR/VNPay tự động, phân quyền tài khoản khách hàng và quản lý đơn hàng.
              </p>
              <Link
                href="/lien-he?package=web-app"
                className="block text-center py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-mono font-bold text-white transition-colors"
              >
                Chọn Gói Enterprise
              </Link>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-6 max-w-4xl">
          <h2 className="text-2xl font-black uppercase text-white">
            CÂU HỎI THƯỜNG GẶP VỀ THIẾT KẾ WEB
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0D0F17]/80 border border-white/[0.08] space-y-2 backdrop-blur-xl"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-[#00E5FF] shrink-0" />
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
        <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-r from-[#00E5FF]/10 via-[#FF2D95]/10 to-purple-600/10 border border-white/[0.12] flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              TƯ VẤN THIẾT KẾ WEBSITE TẠI QUẢNG NGÃI
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white">
              SỞ HỮU WEBSITE ĐỘC BẢN CHO DOANH NGHIỆP BẠN.
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8]">
              Nhận bản phác thảo giao diện Wireframe và báo giá chi tiết hoàn toàn miễn phí từ Giám đốc Kỹ thuật Nguyễn Công Nguyên.
            </p>
          </div>
          <Link
            href="/lien-he"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#FF2D95] text-black font-mono text-xs font-black uppercase tracking-wider hover:shadow-[0_0_25px_rgba(255,45,149,0.5)] transition-all shrink-0 flex items-center justify-center gap-2"
          >
            <span>Bắt Đầu Dự Án Web</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
