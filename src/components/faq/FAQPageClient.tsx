"use client";

import React, { useState } from "react";
import { ChevronDown, Search, Sparkles, HelpCircle } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQPageClient({ faqs }: { faqs: FAQItem[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const categories = ["ALL", ...Array.from(new Set(faqs.map((f) => f.category)))];

  const filtered = faqs.filter((f) => {
    const matchesSearch =
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-32 pb-24 px-6 bg-[#0A0A0A] text-white">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#171717] border border-[#292929]">
            <HelpCircle className="w-3.5 h-3.5 text-[#007BA7]" />
            <span className="text-xs font-mono tracking-widest text-white uppercase">
              KNOWLEDGE BASE & FAQ
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-tight">
            CÂU HỎI THƯỜNG GẶP <br />
            <span className="text-gradient-brand">& GIẢI ĐÁP TOÀN DIỆN.</span>
          </h1>

          <p className="text-base text-[#A1A1AA] leading-relaxed">
            Mọi thắc mắc của Quý khách về quy trình thực thi, công nghệ Three.js, chi phí đầu tư và chuyển giao mã nguồn.
          </p>
        </div>

        {/* Search & Categories Bar */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#71717A] absolute left-4 top-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm câu hỏi theo từ khóa (Three.js, bàn giao mã nguồn, bảo hành, thanh toán...)"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#121212] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
            />
          </div>

          {categories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-white text-black font-bold shadow-md"
                      : "bg-[#171717] text-[#A1A1AA] hover:text-white border border-[#292929]"
                  }`}
                >
                  {cat === "ALL" ? "TẤT CẢ" : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filtered.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-3xl bg-[#121212] border border-[#292929] hover:border-[#383838] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-[#171717] transition-colors"
                >
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#007BA7] block mb-1">
                      {faq.category}
                    </span>
                    <span className="text-base font-bold text-white tracking-wide">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#71717A] shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#FF2D95]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-xs md:text-sm text-[#A1A1AA] leading-relaxed border-t border-[#292929]/50 pt-4 text-justify">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-16 text-center text-[#71717A] text-xs">
              Không tìm thấy câu hỏi phù hợp với từ khóa "{searchTerm}".
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="p-8 md:p-12 rounded-3xl bg-[#121212] border border-[#292929] text-center space-y-4">
          <h3 className="text-xl font-bold uppercase text-white">
            Vẫn Còn Thắc Mắc Chưa Được Giải Đáp?
          </h3>
          <p className="text-xs text-[#A1A1AA] max-w-md mx-auto">
            Chuyên gia tư vấn của NGUYÊN AGENCY luôn sẵn sàng lắng nghe và giải đáp chi tiết cho riêng mô hình kinh doanh của bạn.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-mono text-xs font-bold uppercase tracking-wider hover:shadow-glow-pink transition-all"
            >
              Liên Hệ Trực Tiếp Ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

