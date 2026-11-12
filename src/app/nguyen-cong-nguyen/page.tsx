import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Code2,
  Palette,
  Terminal,
  Cpu,
  CheckCircle2,
  Phone,
  Mail,
  Send,
  HelpCircle,
  ExternalLink,
  Layers,
} from "lucide-react";
import {
  SITE_URL,
  getPersonSchema,
  getBreadcrumbSchema,
  getFAQSchema,
} from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Nguyễn Công Nguyên – Founder & Technical Lead | Nguyên Agency",
  description:
    "Thông tin chuyên nghiệp về Nguyễn Công Nguyên – Nhà sáng lập & Giám đốc Kỹ thuật tại Nguyên Agency (Nguyên Media) tại Quảng Ngãi. Chuyên gia thiết kế website 3D, nhận diện thương hiệu và giải pháp AI.",
  alternates: {
    canonical: `${SITE_URL}/nguyen-cong-nguyen`,
  },
  openGraph: {
    title: "Nguyễn Công Nguyên – Founder & Technical Lead | Nguyên Agency",
    description:
      "Thông tin chuyên nghiệp về Nguyễn Công Nguyên – Nhà sáng lập & Giám đốc Kỹ thuật tại Nguyên Agency (Nguyên Media) tại Quảng Ngãi. Chuyên gia thiết kế website 3D, nhận diện thương hiệu và giải pháp AI.",
    url: `${SITE_URL}/nguyen-cong-nguyen`,
    siteName: "NGUYÊN AGENCY",
    locale: "vi_VN",
    type: "profile",
    images: [
      {
        url: `${SITE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Nguyễn Công Nguyên – Founder Nguyên Agency",
      },
    ],
  },
};

const FAQS = [
  {
    question: "Nguyễn Công Nguyên giữ vai trò gì tại Nguyên Agency?",
    answer:
      "Nguyễn Công Nguyên là Founder kiêm Giám đốc Kỹ thuật & Sáng tạo (Creative & Technical Lead) tại Nguyên Agency (còn được biết đến với tên gọi Nguyên Media). Anh trực tiếp định hướng kiến trúc công nghệ, phong cách thiết kế Luxury Dark Tech và giám sát chất lượng sản phẩm bàn giao.",
  },
  {
    question: "Nguyên Media và Nguyên Agency có mối quan hệ như thế nào?",
    answer:
      "Nguyên Media là tiền thân và cũng là phân nhánh dịch vụ truyền thông, quay dựng video TVC, thiết kế poster và sản xuất hình ảnh thương hiệu trực thuộc hệ sinh thái Nguyên Agency tại Quảng Ngãi.",
  },
  {
    question: "Nguyễn Công Nguyên có nhận tư vấn dự án trực tiếp tại Quảng Ngãi không?",
    answer:
      "Có. Khách hàng và doanh nghiệp tại Quảng Ngãi có thể đặt lịch hẹn tư vấn chiến lược 1:1 trực tiếp với Nguyễn Công Nguyên tại TP. Quảng Ngãi hoặc họp trực tuyến qua Google Meet / Telegram.",
  },
];

export default function NguyenCongNguyenPage() {
  const personSchema = getPersonSchema();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Nguyễn Công Nguyên", path: "/nguyen-cong-nguyen" },
  ]);
  const faqSchema = getFAQSchema(FAQS);

  return (
    <div className="pt-32 pb-24 px-6 bg-[#06070B] text-white relative min-h-screen">
      {/* Search Engine Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Background Lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-r from-[#00E5FF]/10 via-[#FF2D95]/10 to-transparent blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span className="text-[11px] font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
                FOUNDER & CREATIVE TECHNICAL LEAD
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[1.08]">
              NGUYỄN CÔNG NGUYÊN <br />
              <span className="bg-gradient-to-r from-[#00E5FF] via-[#FF2D95] to-[#A855F7] bg-clip-text text-transparent">
                NGUYÊN AGENCY • MEDIA QUẢNG NGÃI.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
              Nhà sáng lập và người định hình triết lý công nghệ tại <strong>NGUYÊN AGENCY</strong> (Nguyên Media). Với niềm đam mê kết hợp giữa nghệ thuật thị giác đương đại và kiến trúc kỹ thuật hiệu năng cao, Nguyễn Công Nguyên đồng hành cùng các doanh nghiệp tại Quảng Ngãi và toàn quốc trên hành trình chuyển đổi số và nâng tầm thương hiệu.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono bg-white/[0.04] border border-white/[0.08] text-[#E2E8F0]">
                3D WebGL & Next.js
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono bg-white/[0.04] border border-white/[0.08] text-[#E2E8F0]">
                Brand Identity
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono bg-white/[0.04] border border-white/[0.08] text-[#E2E8F0]">
                Digital Marketing
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono bg-white/[0.04] border border-white/[0.08] text-[#E2E8F0]">
                AI & SaaS Engineering
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/lien-he"
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#FF2D95] text-black font-mono text-xs font-black uppercase tracking-wider hover:shadow-[0_0_25px_rgba(255,45,149,0.5)] transition-all flex items-center gap-2"
              >
                <span>Kết Nối Trực Tiếp</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://www.facebook.com/nguyenads7"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-white border border-white/[0.1] transition-all flex items-center gap-2"
              >
                <span>Facebook Cá Nhân</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-white/[0.1] bg-[#0E121E] shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80"
                alt="Nguyễn Công Nguyên – Founder Nguyên Agency"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06070B] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-black/75 backdrop-blur-md border border-white/[0.08]">
                <div className="text-xs font-mono text-[#00E5FF] uppercase font-bold">
                  NGUYỄN CÔNG NGUYÊN
                </div>
                <div className="text-[11px] text-[#94A3B8]">
                  Founder & Creative Technical Director • NGUYÊN AGENCY
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expertise Pillars */}
        <div className="space-y-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              LĨNH VỰC CHUYÊN MÔN
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white">
              NĂNG LỰC CỐT LÕI & ĐỊNH HƯỚNG SẢN PHẨM.
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8]">
              Trực tiếp dẫn dắt quy trình thiết kế và lập trình tại NGUYÊN AGENCY với 4 trụ cột kỹ thuật:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] space-y-4 backdrop-blur-xl">
              <Code2 className="w-6 h-6 text-[#00E5FF]" />
              <h3 className="font-bold text-white text-base">Thiết Kế Website 3D & WebGL</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Nghiên cứu ứng dụng Three.js, React Three Fiber và Next.js 15 để tạo ra các website có trải nghiệm không gian 3D mượt mà đạt chuẩn 60 FPS trên cả thiết bị di động.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] space-y-4 backdrop-blur-xl">
              <Palette className="w-6 h-6 text-[#FF2D95]" />
              <h3 className="font-bold text-white text-base">Nhận Diện Thương Hiệu Độc Bản</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Sáng tạo logo, bộ quy chuẩn nhận diện thương hiệu (Brand Guidelines) và ngôn ngữ thị giác Luxury Dark Tech giúp doanh nghiệp định vị vượt trội so với đối thủ.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] space-y-4 backdrop-blur-xl">
              <Terminal className="w-6 h-6 text-[#A855F7]" />
              <h3 className="font-bold text-white text-base">Digital Marketing & Media</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Xây dựng chiến lược truyền thông đa kênh tại Quảng Ngãi: sản xuất video TVC, thiết kế ấn phẩm truyền thông, tối ưu SEO Google và chiến dịch quảng cáo hiệu quả.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] space-y-4 backdrop-blur-xl">
              <Cpu className="w-6 h-6 text-emerald-400" />
              <h3 className="font-bold text-white text-base">AI Automation & Nền Tảng SaaS</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Xây dựng các hệ thống AI Agent chăm sóc khách hàng tự động, kết nối cơ sở dữ liệu Vector RAG và tự động hóa quy trình vận hành qua Telegram Bot.
              </p>
            </div>
          </div>
        </div>

        {/* Brand Ecosystem */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              HỆ SINH THÁI THƯƠNG HIỆU
            </span>
            <h2 className="text-2xl font-black uppercase text-white">
              NGUYÊN AGENCY • NGUYÊN MEDIA • NGUYÊN LAB
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/media-quang-ngai"
              className="p-6 rounded-2xl bg-black/40 border border-white/[0.06] hover:border-[#FF2D95]/40 transition-colors space-y-2 block"
            >
              <div className="text-xs font-mono text-[#FF2D95] font-bold">MEDIA QUẢNG NGÃI</div>
              <h3 className="text-base font-bold text-white">Nguyên Media</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Chuyên sâu về chụp ảnh sự kiện, TVC doanh nghiệp, thiết kế poster, banner và truyền thông số tại Quảng Ngãi.
              </p>
            </Link>

            <Link
              href="/thiet-ke-website-quang-ngai"
              className="p-6 rounded-2xl bg-black/40 border border-white/[0.06] hover:border-[#00E5FF]/40 transition-colors space-y-2 block"
            >
              <div className="text-xs font-mono text-[#00E5FF] font-bold">DIGITAL & TECH</div>
              <h3 className="text-base font-bold text-white">Nguyên Agency</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Thiết kế website 3D WebGL doanh nghiệp, ứng dụng web chuyên sâu và chuyển giao 100% mã nguồn độc lập.
              </p>
            </Link>

            <Link
              href="/ai-automation"
              className="p-6 rounded-2xl bg-black/40 border border-white/[0.06] hover:border-purple-400/40 transition-colors space-y-2 block"
            >
              <div className="text-xs font-mono text-purple-400 font-bold">R&D & INNOVATION</div>
              <h3 className="text-base font-bold text-white">Nguyên LAB</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Trung tâm nghiên cứu tác tử AI tự động hóa và các giải pháp phần mềm SaaS độc quyền.
              </p>
            </Link>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-6 max-w-4xl">
          <h2 className="text-2xl font-black uppercase text-white">
            CÂU HỎI THƯỜNG GẶP VỀ NGUYỄN CÔNG NGUYÊN
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
              TRỰC TIẾP TRAO ĐỔI VỚI NGUYỄN CÔNG NGUYÊN
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white">
              BẮT ĐẦU DỰ ÁN CÙNG NGUYÊN AGENCY.
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8]">
              Cùng thảo luận định hướng thương hiệu, kiến trúc kỹ thuật và giải pháp tăng trưởng chuyển đổi số cho doanh nghiệp của bạn tại Quảng Ngãi.
            </p>
          </div>
          <Link
            href="/lien-he"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#FF2D95] text-black font-mono text-xs font-black uppercase tracking-wider hover:shadow-[0_0_25px_rgba(255,45,149,0.5)] transition-all shrink-0 flex items-center justify-center gap-2"
          >
            <span>Đặt Lịch Trao Đổi</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
