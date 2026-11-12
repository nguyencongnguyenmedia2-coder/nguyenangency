import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  BarChart3,
  Share2,
  CheckCircle2,
  HelpCircle,
  Megaphone,
  Search,
} from "lucide-react";
import {
  SITE_URL,
  getServiceSchema,
  getBreadcrumbSchema,
  getFAQSchema,
} from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Dịch Vụ Digital Marketing Quảng Ngãi – Tăng Trưởng Thực Chiến | Nguyên Agency",
  description:
    "Dịch vụ Digital Marketing tại Quảng Ngãi trọn gói: Chạy quảng cáo Facebook Ads, Google Ads, TikTok Ads, SEO tổng thể địa phương và chăm sóc Fanpage đa kênh hiệu quả.",
  alternates: {
    canonical: `${SITE_URL}/digital-marketing-quang-ngai`,
  },
  openGraph: {
    title: "Dịch Vụ Digital Marketing Quảng Ngãi – Tăng Trưởng Thực Chiến | Nguyên Agency",
    description:
      "Dịch vụ Digital Marketing tại Quảng Ngãi trọn gói: Chạy quảng cáo Facebook Ads, Google Ads, TikTok Ads, SEO tổng thể địa phương và chăm sóc Fanpage đa kênh hiệu quả.",
    url: `${SITE_URL}/digital-marketing-quang-ngai`,
    siteName: "NGUYÊN AGENCY",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Dịch vụ Digital Marketing Quảng Ngãi – Nguyên Agency",
      },
    ],
  },
};

const FAQS = [
  {
    question: "Doanh nghiệp tại Quảng Ngãi nên bắt đầu với kênh marketing nào?",
    answer:
      "Tùy vào ngành nghề: Với dịch vụ ăn uống, bán lẻ, thẩm mỹ, xây dựng thì Facebook Ads & TikTok kết hợp Zalo OA là nhanh nhất. Với doanh nghiệp B2B, xuất khẩu, du lịch và dịch vụ kỹ thuật thì Google Tìm kiếm (SEO & Google Ads) sẽ mang lại lead khách hàng tiềm năng chất lượng cao nhất.",
  },
  {
    question: "Nguyên Agency có cam kết số lượng số điện thoại/tin nhắn khi chạy quảng cáo không?",
    answer:
      "Chúng tôi cam kết bằng chỉ số KPI rõ ràng trong hợp đồng: chi phí trên mỗi tin nhắn (Cost Per Message), lượt hiển thị đúng tệp khách hàng tại Quảng Ngãi/miền Trung và báo cáo minh bạch dữ liệu chuyển đổi hàng tuần.",
  },
  {
    question: "Dịch vụ SEO Google tại Quảng Ngãi mất bao lâu để lên trang 1?",
    answer:
      "Đối với các từ khóa địa phương có tiền tố 'Quảng Ngãi' (VD: thiết kế website Quảng Ngãi, xây dựng Quảng Ngãi), thời gian trung bình từ 2 đến 4 tháng để đạt trang 1 Google với phương pháp SEO mũ trắng bền vững.",
  },
];

export default function DigitalMarketingQuangNgaiPage() {
  const serviceSchema = getServiceSchema({
    name: "Dịch Vụ Digital Marketing Quảng Ngãi – Nguyên Agency",
    description:
      "Giải pháp tiếp thị số, chạy quảng cáo và SEO Google tổng thể cho doanh nghiệp tại Quảng Ngãi.",
    url: "/digital-marketing-quang-ngai",
    serviceType: "Digital Marketing Services",
    areaServed: "Quảng Ngãi",
  });
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Digital Marketing Quảng Ngãi", path: "/digital-marketing-quang-ngai" },
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
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-r from-[#00E5FF]/10 via-[#FF2D95]/10 to-transparent blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* Hero Header */}
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md">
            <TrendingUp className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="text-[11px] font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              PERFORMANCE MARKETING • QUẢNG NGÃI
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[1.08]">
            DIGITAL MARKETING <br />
            <span className="bg-gradient-to-r from-[#00E5FF] via-[#FF2D95] to-[#A855F7] bg-clip-text text-transparent">
              QUẢNG NGÃI THỰC CHIẾN.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            Giải pháp tiếp thị kỹ thuật số đo lường hiệu quả chuyển đổi thực tế: Chạy quảng cáo đa nền tảng tối ưu chi phí, xây dựng kênh Fanpage & TikTok chuẩn chỉnh và đưa website lên top Google bền vững tại khu vực Quảng Ngãi và Miền Trung.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-7 rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] hover:border-[#00E5FF]/50 transition-all space-y-4 backdrop-blur-xl">
            <Megaphone className="w-6 h-6 text-[#00E5FF]" />
            <h2 className="text-lg font-black uppercase text-white">Quảng Cáo Facebook & TikTok Ads</h2>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Target chuẩn tệp khách hàng tại TP. Quảng Ngãi và các huyện. Thiết lập phễu chuyển đổi ra tin nhắn và số điện thoại mua hàng ngay.
            </p>
            <ul className="space-y-1.5 text-xs text-[#E2E8F0] pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF]" /> Thử nghiệm A/B Testing
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF]" /> Tối ưu chi phí mỗi tin nhắn
              </li>
            </ul>
          </div>

          <div className="p-7 rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] hover:border-[#FF2D95]/50 transition-all space-y-4 backdrop-blur-xl">
            <Search className="w-6 h-6 text-[#FF2D95]" />
            <h2 className="text-lg font-black uppercase text-white">SEO Google Địa Phương (Local SEO)</h2>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Đưa từ khóa dịch vụ của bạn lên Top tìm kiếm Google và xác minh Google Maps (Google Business Profile) chuẩn chỉ tăng khách vãng lai.
            </p>
            <ul className="space-y-1.5 text-xs text-[#E2E8F0] pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF2D95]" /> Lên Top từ khóa địa phương
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF2D95]" /> Tối ưu Google Maps hiển thị
              </li>
            </ul>
          </div>

          <div className="p-7 rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] hover:border-purple-400/50 transition-all space-y-4 backdrop-blur-xl">
            <Share2 className="w-6 h-6 text-purple-400" />
            <h2 className="text-lg font-black uppercase text-white">Chăm Sóc & Quản Trị Fanpage</h2>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Lên lịch đăng bài định kỳ với nội dung bắt trend, thiết kế hình ảnh poster chỉn chu, trả lời comment/inbox chuyên nghiệp giữ chân khách.
            </p>
            <ul className="space-y-1.5 text-xs text-[#E2E8F0] pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> 15 - 25 bài đăng/tháng
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Thiết kế đồ họa đồng bộ
              </li>
            </ul>
          </div>

          <div className="p-7 rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] hover:border-emerald-400/50 transition-all space-y-4 backdrop-blur-xl">
            <Target className="w-6 h-6 text-emerald-400" />
            <h2 className="text-lg font-black uppercase text-white">Chiến Lược Marketing Tổng Thể</h2>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Tư vấn kế hoạch ngân sách marketing theo từng quý cho doanh nghiệp vừa và nhỏ, tránh lãng phí ngân sách vào các kênh không hiệu quả.
            </p>
            <ul className="space-y-1.5 text-xs text-[#E2E8F0] pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Lộ trình 30-60-90 ngày
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Báo cáo ROI minh bạch
              </li>
            </ul>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-6 max-w-4xl">
          <h2 className="text-2xl font-black uppercase text-white">
            CÂU HỎI THƯỜNG GẶP VỀ DIGITAL MARKETING
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
              TĂNG TRƯỞNG DOANH SỐ TẠI QUẢNG NGÃI
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white">
              BẮT ĐẦU CHIẾN DỊCH DIGITAL MARKETING NGAY.
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8]">
              Nhận phân tích miễn phí thị trường và đề xuất ngân sách quảng cáo tối ưu cho ngành hàng của bạn trong vòng 24h.
            </p>
          </div>
          <Link
            href="/lien-he"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#FF2D95] text-black font-mono text-xs font-black uppercase tracking-wider hover:shadow-[0_0_25px_rgba(255,45,149,0.5)] transition-all shrink-0 flex items-center justify-center gap-2"
          >
            <span>Nhận Kế Hoạch Marketing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

