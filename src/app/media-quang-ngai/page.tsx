import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Sparkles,
  ArrowRight,
  Camera,
  Film,
  Palette,
  CheckCircle2,
  HelpCircle,
  Clock,
  ShieldCheck,
  Send,
  Phone,
} from "lucide-react";
import {
  SITE_URL,
  getServiceSchema,
  getBreadcrumbSchema,
  getFAQSchema,
} from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Media Quảng Ngãi – Dịch Vụ Quay Phim, Chụp Ảnh & Thiết Kế | Nguyên Media",
  description:
    "Dịch vụ Media tại Quảng Ngãi do Nguyễn Công Nguyên Media & Nguyên Agency thực hiện: Quay phim TVC, chụp ảnh sự kiện doanh nghiệp, thiết kế poster, banner quảng cáo trọn gói chuyên nghiệp.",
  alternates: {
    canonical: `${SITE_URL}/media-quang-ngai`,
  },
  openGraph: {
    title: "Media Quảng Ngãi – Dịch Vụ Quay Phim, Chụp Ảnh & Thiết Kế | Nguyên Media",
    description:
      "Dịch vụ Media tại Quảng Ngãi do Nguyễn Công Nguyên Media & Nguyên Agency thực hiện: Quay phim TVC, chụp ảnh sự kiện doanh nghiệp, thiết kế poster, banner quảng cáo trọn gói chuyên nghiệp.",
    url: `${SITE_URL}/media-quang-ngai`,
    siteName: "NGUYÊN AGENCY",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Dịch vụ Media Quảng Ngãi – Nguyễn Công Nguyên Media",
      },
    ],
  },
};

const FAQS = [
  {
    question: "Nguyên Media cung cấp những dịch vụ Media nào tại Quảng Ngãi?",
    answer:
      "Nguyên Media (trực thuộc Nguyên Agency) cung cấp dịch vụ sản xuất media trọn gói tại TP. Quảng Ngãi và các khu vực lân cận: quay dựng video giới thiệu doanh nghiệp, TVC quảng cáo, chụp ảnh sự kiện, chụp ảnh profile lãnh đạo, thiết kế poster, banner, standee và bộ ấn phẩm truyền thông số.",
  },
  {
    question: "Thời gian bàn giao sản phẩm media là bao lâu?",
    answer:
      "Đối với thiết kế poster, banner sự kiện: bàn giao trong 24h - 48h. Đối với gói chụp ảnh sự kiện: xử lý màu và bàn giao toàn bộ file nét trong 24h. Đối với video TVC, phóng sự: hoàn thiện bản dựng nháp từ 3 - 5 ngày làm việc.",
  },
  {
    question: "Khách hàng có nhận được file gốc chất lượng cao không?",
    answer:
      "Có. Toàn bộ hình ảnh gốc chuẩn RAW/JPEG độ phân giải cao và video 4K đều được lưu trữ trên Cloud dung lượng cao và chuyển giao toàn quyền sử dụng cho khách hàng.",
  },
];

export default function MediaQuangNgaiPage() {
  const serviceSchema = getServiceSchema({
    name: "Dịch Vụ Media Quảng Ngãi – Nguyễn Công Nguyên Media",
    description:
      "Dịch vụ sản xuất media, quay phim TVC, chụp ảnh sự kiện và thiết kế poster chuyên nghiệp tại Quảng Ngãi.",
    url: "/media-quang-ngai",
    serviceType: "Media Production & Graphic Design",
    areaServed: "Quảng Ngãi",
  });
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Media Quảng Ngãi", path: "/media-quang-ngai" },
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
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-r from-[#FF2D95]/15 via-[#00E5FF]/10 to-transparent blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* Header */}
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#FF2D95]" />
            <span className="text-[11px] font-mono tracking-widest text-[#FF2D95] uppercase font-bold">
              NGUYỄN CÔNG NGUYÊN MEDIA • QUẢNG NGÃI
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[1.08]">
            DỊCH VỤ MEDIA QUẢNG NGÃI & <br />
            <span className="bg-gradient-to-r from-[#FF2D95] via-[#00E5FF] to-[#A855F7] bg-clip-text text-transparent">
              SẢN XUẤT HÌNH ẢNH DOANH NGHIỆP.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            <strong>Nguyễn Công Nguyên Media</strong> (Nguyên Media) chuyên cung cấp giải pháp sáng tạo nội dung thị giác trọn gói tại Quảng Ngãi: từ quay dựng video giới thiệu doanh nghiệp, chụp ảnh sự kiện – hội nghị, đến thiết kế poster, banner quảng cáo chuẩn nhận diện thương hiệu cao cấp.
          </p>
        </div>

        {/* Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] hover:border-[#FF2D95]/50 transition-all duration-300 space-y-5 backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#FF2D95]/10 border border-[#FF2D95]/30 flex items-center justify-center text-[#FF2D95]">
              <Film className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black uppercase text-white">Quay Dựng Video & TVC Doanh Nghiệp</h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Sản xuất video giới thiệu năng lực công ty, phóng sự doanh nghiệp, clip viral TikTok/Reels với kịch bản bài bản, thiết bị quay 4K và chỉnh màu điện ảnh chuyên nghiệp.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-[#E2E8F0]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF2D95]" />
                Kịch bản phân cảnh sáng tạo
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF2D95]" />
                Hậu kỳ kỹ xảo & âm thanh độc quyền
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF2D95]" />
                Tối ưu tỷ lệ 16:9 và 9:16 đa nền tảng
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] hover:border-[#00E5FF]/50 transition-all duration-300 space-y-5 backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
              <Camera className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black uppercase text-white">Chụp Ảnh Sự Kiện & Doanh Nhân</h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Dịch vụ nhiếp ảnh chuyên nghiệp phục vụ lễ khai trương, hội nghị khách đồng hành, tiệc kỷ niệm, chụp ảnh sản phẩm catalog và bộ ảnh Profile lãnh đạo chuẩn uy tín.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-[#E2E8F0]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00E5FF]" />
                Giao ảnh nóng trong sự kiện để làm PR
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00E5FF]" />
                Retouch màu da và bối cảnh tỉ mỉ
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00E5FF]" />
                Lưu trữ Cloud bảo mật 12 tháng
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] hover:border-purple-400/50 transition-all duration-300 space-y-5 backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Palette className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black uppercase text-white">Thiết Kế Poster & Ấn Phẩm Quảng Cáo</h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Thiết kế poster sự kiện tại Quảng Ngãi, backdrop sân khấu, standee, voucher, catalogue và hệ thống banner chạy chiến dịch quảng cáo Facebook/Google thu hút thị giác cao.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-[#E2E8F0]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                Đúng quy chuẩn in ấn offset & kỹ thuật số
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                Thiết kế nhanh trong 24 giờ
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                Bàn giao đầy đủ file gốc AI, PSD, PDF
              </li>
            </ul>
          </div>
        </div>

        {/* Local Advantage in Quang Ngai */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono tracking-widest text-[#FF2D95] uppercase font-bold">
              LỢI THẾ CỦA CHÚNG TÔI TẠI QUẢNG NGÃI
            </span>
            <h2 className="text-2xl font-black uppercase text-white">
              TẠI SAO DOANH NGHIỆP LỰA CHỌN NGUYÊN MEDIA?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
              <div className="text-lg font-bold text-[#FF2D95]">Trực Tiếp Tại Địa Phương</div>
              <p className="text-xs text-[#94A3B8]">
                Đội ngũ túc trực tại TP. Quảng Ngãi, sẵn sàng có mặt ghi hình sự kiện nhanh chóng chỉ sau 30 phút liên hệ.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
              <div className="text-lg font-bold text-[#00E5FF]">Thiết Bị Điện Ảnh 4K</div>
              <p className="text-xs text-[#94A3B8]">
                Trang bị máy quay Sony FX series, hệ thống ánh sáng chuyên dụng và mic thu âm chống ồn trường quay.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
              <div className="text-lg font-bold text-purple-400">Tư Duy Thẩm Mỹ Độc Bản</div>
              <p className="text-xs text-[#94A3B8]">
                Được dẫn dắt trực tiếp bởi Founder Nguyễn Công Nguyên, đảm bảo mỗi khung hình đều sang trọng và khác biệt.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
              <div className="text-lg font-bold text-emerald-400">Báo Giá Minh Bạch</div>
              <p className="text-xs text-[#94A3B8]">
                Hợp đồng rõ ràng, không phát sinh chi phí di chuyển hay chỉnh sửa trong phạm vi đã cam kết.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-6 max-w-4xl">
          <h2 className="text-2xl font-black uppercase text-white">
            CÂU HỎI THƯỜNG GẶP VỀ DỊCH VỤ MEDIA
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

        {/* Contact Banner */}
        <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-r from-[#FF2D95]/15 via-[#00E5FF]/10 to-purple-600/10 border border-white/[0.12] flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono tracking-widest text-[#FF2D95] uppercase font-bold">
              ĐẶT LỊCH SẢN XUẤT MEDIA TẠI QUẢNG NGÃI
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white">
              BẠN ĐANG CẦN EKIP QUAY PHIM, CHỤP ẢNH SỰ KIỆN?
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8]">
              Liên hệ trực tiếp với Nguyễn Công Nguyên Media để nhận báo giá chi tiết và lên lịch thực hiện ngay hôm nay.
            </p>
          </div>
          <Link
            href="/lien-he"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF2D95] to-[#00E5FF] text-black font-mono text-xs font-black uppercase tracking-wider hover:shadow-[0_0_25px_rgba(255,45,149,0.5)] transition-all shrink-0 flex items-center justify-center gap-2"
          >
            <span>Nhận Báo Giá Media</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

