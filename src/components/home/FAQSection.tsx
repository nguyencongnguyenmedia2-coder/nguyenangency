"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowUpRight, HelpCircle } from "lucide-react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQSection({
  faqs,
  sectionData,
}: {
  faqs: FAQItem[];
  sectionData?: any;
}) {
  const subtitle = sectionData?.subtitle || "09 • HỎI & ĐÁP MINH BẠCH";
  const title = sectionData?.title || "CÂU HỎI THƯỜNG GẶP (FAQ)";
  const description =
    sectionData?.description ||
    "Giải đáp chi tiết về quy trình làm việc, bản quyền bàn giao, bảo mật thông tin và cam kết vận hành tại NGUYÊN AGENCY.";

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-28 px-6 bg-[#0A0A0A] border-b border-[#1F1F23] relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Sticky Column */}
        <RevealOnScroll className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2.5 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#007BA7]" />
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#007BA7]">
                {subtitle}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-[1.1] mb-5">
              {title}
            </h2>
            <p className="text-sm text-[#A1A1AA] leading-relaxed mb-8">
              {description}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#111114] border border-[#242429]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#007BA7]/15 border border-[#007BA7]/30 flex items-center justify-center text-[#38BDF8]">
                <HelpCircle className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-white">Cần tư vấn chuyên sâu hơn?</span>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed mb-5">
              Đội ngũ Solution Architect của chúng tôi luôn sẵn sàng giải đáp trực tiếp bài toán riêng của doanh nghiệp bạn.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#38BDF8] hover:text-white transition-colors font-semibold"
            >
              <span>Đặt lịch tư vấn 1-1</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </RevealOnScroll>

        {/* Right Accordion List */}
        <div className="lg:col-span-7 space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <RevealOnScroll key={faq.id} delay={index * 0.05}>
                <div
                  className={`rounded-2xl border transition-colors duration-300 overflow-hidden ${
                    isOpen
                      ? "bg-[#141418] border-[#007BA7]/60"
                      : "bg-[#111114] border-[#242429] hover:border-[#2F2F37]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-xs font-mono text-[#71717A]">
                        0{index + 1}
                      </span>
                      <span className="text-sm sm:text-base font-bold text-white">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#FF2D95]" : "text-[#007BA7]"
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-sm text-[#A1A1AA] leading-relaxed border-t border-[#242429]/60">
                      {faq.answer}
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
