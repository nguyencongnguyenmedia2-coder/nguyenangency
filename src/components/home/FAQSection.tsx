"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowUpRight, HelpCircle, ShieldCheck, Phone } from "lucide-react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FALLBACK_FAQS: FAQItem[] = [
  {
    id: "faq_01",
    category: "BẢN QUYỀN & MÃ NGUỒN",
    question: "Doanh nghiệp có được sở hữu 100% mã nguồn và bản quyền thiết kế không?",
    answer: "Có, 100%. NGUYÊN AGENCY cam kết chuyển giao toàn bộ quyền sở hữu trí tuệ, toàn bộ mã nguồn (Source Code Clean) trên Git repository riêng của doanh nghiệp cùng file thiết kế gốc (Figma Vector). Không có bất kỳ chi phí ẩn hay phí duy trì bản quyền bắt buộc nào.",
  },
  {
    id: "faq_02",
    category: "TIẾN ĐỘ & BÀN GIAO",
    question: "Thời gian triển khai một dự án Website 3D hoặc Nền tảng SaaS là bao lâu?",
    answer: "Thời gian trung bình từ 2 đến 4 tuần đối với Website doanh nghiệp tiêu chuẩn / Website 3D WebGL, và 4 đến 8 tuần đối với hệ thống phần mềm SaaS / CRM may đo. Tiến độ được quy định bằng văn bản hợp đồng với các mốc nghiệm thu chi tiết từng giai đoạn.",
  },
  {
    id: "faq_03",
    category: "THANH TOÁN & HỢP ĐỒNG",
    question: "Quy trình thanh toán và ký kết hợp đồng diễn ra như thế nào?",
    answer: "Quy trình thanh toán được chia làm 3 đợt linh hoạt: Đợt 1 (40% sau khi ký hợp đồng và thỏa thuận bảo mật NDA), Đợt 2 (30% sau khi duyệt xong toàn bộ Prototype UI/UX & Bản dựng 3D), Đợt 3 (30% sau khi hoàn tất kiểm thử, bàn giao mã nguồn và nghiệm thu toàn diện). Xuất hóa đơn VAT điện tử đầy đủ.",
  },
  {
    id: "faq_04",
    category: "BẢO HÀNH & BẢO TRÌ",
    question: "Chính sách bảo hành và hỗ trợ kỹ thuật sau khi bàn giao như thế nào?",
    answer: "Chúng tôi áp dụng chính sách Bảo Hành Miễn Phí 12 Tháng cho toàn bộ các lỗi kỹ thuật phát sinh. Hỗ trợ khẩn cấp 24/7 qua Hotline, Zalo OA và Bot Telegram riêng biệt. Sau 12 tháng, doanh nghiệp có thể tùy chọn ký hợp đồng bảo trì nâng cấp định kỳ theo nhu cầu.",
  },
  {
    id: "faq_05",
    category: "TỐC ĐỘ & SEO",
    question: "Website có hiệu ứng 3D chuyển động thì có bị nặng hoặc ảnh hưởng tới SEO không?",
    answer: "Hoàn toàn không. Kiến trúc Next.js 14 Server-Side Rendering kết hợp Three.js Lazy Loading cho phép phần nội dung chữ và thẻ SEO tải tức thì trong 0.8 giây, trong khi canvas 3D chạy mượt mà 60 FPS trên luồng WebGL riêng biệt, đảm bảo điểm Google Core Web Vitals luôn đạt mức 90 - 100 điểm xanh.",
  },
];

export default function FAQSection({
  faqs: initialFaqs,
  sectionData,
}: {
  faqs?: FAQItem[];
  sectionData?: any;
}) {
  const subtitle = sectionData?.subtitle || "09 • HỎI & ĐÁP MINH BẠCH";
  const title = sectionData?.title || "CÂU HỎI THƯỜNG GẶP (FAQ)";
  const description =
    sectionData?.description ||
    "Giải đáp chi tiết và minh bạch về quyền sở hữu mã nguồn, tiến độ cam kết, hình thức thanh toán và chính sách bảo hành trọn vẹn tại NGUYÊN AGENCY.";

  const faqs = initialFaqs && initialFaqs.length > 0 ? initialFaqs : FALLBACK_FAQS;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 bg-[#06070B] border-b border-[#1A1A22] relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/3 left-0 w-[450px] h-[450px] bg-[#00E5FF]/5 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-14">
        {/* Left Sticky Column */}
        <RevealOnScroll className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0D121D] border border-[#00E5FF]/30 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#00E5FF] font-semibold">
                {subtitle}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-[1.1] mb-5">
              {title}
            </h2>
            <p className="text-sm md:text-base text-[#D4D4D8] leading-relaxed mb-8">
              {description}
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-white">Bạn có câu hỏi riêng cho dự án?</span>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed mb-5">
              Đội ngũ Kỹ sư & Solution Architect luôn sẵn sàng giải đáp trực tiếp và tư vấn kiến trúc công nghệ miễn phí cho doanh nghiệp của bạn.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#00A3FF] to-[#FF2D95] text-white text-xs font-mono uppercase tracking-wider font-bold shadow-md shadow-pink-500/20"
              >
                <span>Nhận Tư Vấn 1-1</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="tel:0344979307"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-[#121622] border border-white/10 text-xs font-mono text-[#D4D4D8] hover:text-white"
              >
                <Phone className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>0344 979 307</span>
              </a>
            </div>
          </div>
        </RevealOnScroll>

        {/* Right Accordion List */}
        <div className="lg:col-span-7 space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <RevealOnScroll key={faq.id} delay={index * 0.05}>
                <div
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "bg-[#0E121E] border-[#00E5FF]/40 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
                      : "bg-[#0B0D14]/80 border-white/[0.08] hover:border-white/20"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-xs font-mono font-bold text-[#00E5FF]/80">
                        0{index + 1}
                      </span>
                      <span className="text-sm sm:text-base font-bold text-white leading-snug">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#FF2D95]" : "text-[#00E5FF]"
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-[#A1A1AA] leading-relaxed border-t border-white/[0.06] animate-in fade-in duration-300">
                      <p className="mt-3 text-[#D4D4D8]">{faq.answer}</p>
                    </div>
                  )}
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
