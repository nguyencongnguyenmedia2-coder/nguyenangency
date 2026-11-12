import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Sparkles,
  ArrowRight,
  Bot,
  Cpu,
  Terminal,
  Zap,
  CheckCircle2,
  HelpCircle,
  GitBranch,
  Activity,
  Layers,
} from "lucide-react";
import {
  SITE_URL,
  getServiceSchema,
  getBreadcrumbSchema,
  getFAQSchema,
} from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "AI Automation – Giải Pháp Tự Động Hóa & Tác Tử AI Doanh Nghiệp | Nguyên Agency",
  description:
    "Giải pháp AI Automation và phần mềm tự động hóa nghiệp vụ độc quyền: AI Agent CSKH 24/7, RAG Vector Database huấn luyện trên dữ liệu doanh nghiệp và quản trị qua Telegram Bot.",
  alternates: {
    canonical: `${SITE_URL}/ai-automation`,
  },
  openGraph: {
    title: "AI Automation – Giải Pháp Tự Động Hóa & Tác Tử AI Doanh Nghiệp | Nguyên Agency",
    description:
      "Giải pháp AI Automation và phần mềm tự động hóa nghiệp vụ độc quyền: AI Agent CSKH 24/7, RAG Vector Database huấn luyện trên dữ liệu doanh nghiệp và quản trị qua Telegram Bot.",
    url: `${SITE_URL}/ai-automation`,
    siteName: "NGUYÊN AGENCY",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Giải pháp AI Automation doanh nghiệp – Nguyên Agency",
      },
    ],
  },
};

const FAQS = [
  {
    question: "Tác tử AI (AI Agent) khác gì so với Chatbot thông thường?",
    answer:
      "Chatbot thông thường chỉ trả lời theo kịch bản cứng nhắc có sẵn. AI Agent của Nguyên Agency được tích hợp mô hình ngôn ngữ lớn (LLM) và RAG Vector Database, có khả năng hiểu ngữ cảnh sâu, tự động gọi API tra cứu đơn hàng, tạo báo giá và phản hồi tự nhiên như một chuyên viên tư vấn thật.",
  },
  {
    question: "Dữ liệu nội bộ của doanh nghiệp có được bảo mật khi tích hợp AI không?",
    answer:
      "Tuyệt đối bảo mật. Cơ sở dữ liệu Vector RAG được lưu trữ trên hạ tầng máy chủ đám mây độc lập của chính doanh nghiệp. Chúng tôi cam kết bảo mật theo tiêu chuẩn mã hóa AES-256 và ký kết thỏa thuận bảo mật NDA trước khi triển khai.",
  },
  {
    question: "Doanh nghiệp tại Quảng Ngãi ứng dụng AI Automation vào khâu nào hiệu quả nhất?",
    answer:
      "Hiệu quả tức thì nhất ở 3 khâu: 1) Tự động trả lời và chốt đơn khách hàng 24/7 trên Fanpage/Zalo/Web; 2) Tự động bắn thông báo đơn hàng và báo cáo tài chính về nhóm Telegram nội bộ; 3) Quản lý và phân luồng công việc tự động giữa các phòng ban.",
  },
];

export default function AIAutomationPage() {
  const serviceSchema = getServiceSchema({
    name: "Giải Pháp AI Automation & Tự Động Hóa Doanh Nghiệp – Nguyên Agency",
    description:
      "Tích hợp tác tử AI thông minh, tự động hóa quy trình nghiệp vụ và xây dựng nền tảng SaaS riêng biệt cho doanh nghiệp.",
    url: "/ai-automation",
    serviceType: "AI & Automation Engineering",
    areaServed: "Việt Nam",
  });
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "AI Automation", path: "/ai-automation" },
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
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-r from-purple-500/15 via-[#00E5FF]/10 to-transparent blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* Header */}
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md">
            <Bot className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="text-[11px] font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              AGENTIC AI & AUTOMATION ENGINE
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[1.08]">
            AI AUTOMATION & <br />
            <span className="bg-gradient-to-r from-[#00E5FF] via-[#FF2D95] to-[#A855F7] bg-clip-text text-transparent">
              TỰ ĐỘNG HÓA DOANH NGHIỆP.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            Nâng tầm hiệu suất vận hành với các tác tử AI Agent độc quyền từ <strong>NGUYÊN LAB</strong>: Tự động hóa tư vấn CSKH đa kênh, truy xuất tri thức nội bộ với RAG Vector và giám sát toàn bộ hoạt động kinh doanh trực tiếp qua Telegram Bot.
          </p>
        </div>

        {/* 3 Core Architectures */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] hover:border-[#00E5FF]/50 transition-all space-y-4 backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
              <Bot className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black uppercase text-white">AI Agent Tư Vấn & Chốt Đơn 24/7</h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Tác tử thông minh kết nối đồng bộ trên Website, Telegram Bot, Zalo OA và Fanpage. Tự động trả lời báo giá, phân loại lead khách hàng và đặt lịch hẹn chính xác.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-[#E2E8F0]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00E5FF]" /> Tốc độ phản hồi dưới 1 giây
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00E5FF]" /> Không bao giờ bỏ sót tin nhắn của khách
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] hover:border-[#FF2D95]/50 transition-all space-y-4 backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#FF2D95]/10 border border-[#FF2D95]/30 flex items-center justify-center text-[#FF2D95]">
              <Cpu className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black uppercase text-white">RAG Vector Database Nội Bộ</h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Huấn luyện mô hình AI trên chính tài liệu quy trình, báo giá, chính sách bảo hành của công ty bạn. Trả lời chính xác 100% dữ liệu thực, triệt tiêu tình trạng 'ảo tưởng' (hallucination).
            </p>
            <ul className="space-y-2 pt-2 text-xs text-[#E2E8F0]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF2D95]" /> Dữ liệu doanh nghiệp được mã hóa riêng
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF2D95]" /> Cập nhật tri thức mới trong 30 giây
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] hover:border-purple-400/50 transition-all space-y-4 backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Terminal className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black uppercase text-white">Vận Hành Tự Động Qua Telegram Bot</h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Biến Telegram thành trung tâm điều hành di động: Nhận thông báo khách mới, duyệt báo giá, theo dõi tiến độ nhân viên và tra cứu doanh thu chỉ bằng lệnh chat.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-[#E2E8F0]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" /> Bắn tin tức thời Realtime
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" /> Phân quyền bảo mật Admin & Nhân viên
              </li>
            </ul>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-6 max-w-4xl">
          <h2 className="text-2xl font-black uppercase text-white">
            CÂU HỎI THƯỜNG GẶP VỀ AI AUTOMATION
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
              TRIỂN KHAI AI CHO DOANH NGHIỆP CỦA BẠN
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white">
              SẴN SÀNG TỰ ĐỘNG HÓA 70% CÔNG VIỆC LẶP LẠI?
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8]">
              Cùng chuyên gia kỹ thuật của Nguyên Agency xây dựng demo thử nghiệm AI Agent trên chính dữ liệu doanh nghiệp của bạn.
            </p>
          </div>
          <Link
            href="/lien-he?service=ai-automation"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#FF2D95] text-black font-mono text-xs font-black uppercase tracking-wider hover:shadow-[0_0_25px_rgba(255,45,149,0.5)] transition-all shrink-0 flex items-center justify-center gap-2"
          >
            <span>Trải Nghiệm Demo AI</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
