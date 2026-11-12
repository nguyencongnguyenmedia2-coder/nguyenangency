import React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, CheckCircle2, Phone, Mail, MessageCircle, Send, ShieldCheck } from "lucide-react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

export default function ContactCTASection({
  sectionData,
  siteSettings,
}: {
  sectionData?: any;
  siteSettings?: {
    contactEmail?: string;
    hotline?: string;
    officeAddress?: string;
    zaloUrl?: string;
  };
}) {
  const subtitle = sectionData?.subtitle || "10 • KẾT NỐI & KHỞI TẠO DỰ ÁN";
  const title = sectionData?.title || "SẴN SÀNG KIẾN TẠO VỊ THẾ SỐ ĐỘC BẢN?";
  const description =
    sectionData?.description ||
    "Hãy biến tầm nhìn chiến lược của bạn thành một nền tảng kỹ thuật số vượt chuẩn. Đội ngũ Solution Architect & Creative Director tại NGUYÊN AGENCY sẵn sàng đồng hành cùng doanh nghiệp từ bản thảo đầu tiên đến khi vận hành bứt phá.";
  const ctaText = sectionData?.ctaText || "Khởi Tạo Dự Án & Báo Giá";
  const ctaLink = sectionData?.ctaLink || "/contact";
  const contactEmail = siteSettings?.contactEmail || "contact@nguyenagency.vn";
  const hotline = siteSettings?.hotline || "+84 344 979 307";
  const zaloUrl = siteSettings?.zaloUrl || "https://zalo.me/0344979307";

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 bg-[#06070B] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll>
          <div className="relative rounded-[2.5rem] bg-[#0B0D14]/95 border border-white/[0.08] p-8 sm:p-14 md:p-20 overflow-hidden text-center backdrop-blur-2xl shadow-[0_32px_80px_rgba(0,0,0,0.8)]">
            {/* Ambient Dual Brand Spotlights */}
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#00E5FF]/15 rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-[#FF2D95]/15 rounded-full blur-[160px] pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121622] border border-[#00E5FF]/30 mb-7 shadow-[0_0_20px_rgba(0,229,255,0.15)]">
                <Sparkles className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
                <span className="text-[11px] font-mono tracking-[0.22em] text-[#00E5FF] uppercase font-bold">
                  {subtitle}
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.08] mb-6">
                {title}
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-[#D4D4D8] max-w-2xl mx-auto mb-10 leading-relaxed">
                {description}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <Link
                  href={ctaLink}
                  className="w-full sm:w-auto px-9 py-4 rounded-full bg-gradient-to-r from-[#00A3FF] via-[#007BA7] to-[#FF2D95] text-white font-bold text-xs uppercase tracking-[0.18em] hover:shadow-[0_0_36px_rgba(255,45,149,0.55)] hover:scale-105 transition-all flex items-center justify-center gap-2.5 group"
                >
                  <span>{ctaText}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                <Link
                  href="/pricing"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#121622] border border-white/15 hover:border-[#00E5FF]/50 text-white font-bold text-xs uppercase tracking-[0.18em] transition-all hover:bg-white/[0.05]"
                >
                  <span>Tham Khảo Bảng Giá</span>
                </Link>

                <a
                  href={zaloUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-4 rounded-full bg-[#0088CC]/20 border border-[#0088CC]/40 hover:bg-[#0088CC]/35 text-[#38BDF8] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat Zalo Trực Tiếp</span>
                </a>
              </div>

              {/* Trust Indicators + Response Commitment */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-white/[0.08] text-xs font-mono text-[#D4D4D8]">
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4 text-[#00E5FF] shrink-0" />
                  <span>Hotline: <strong className="text-white">{hotline}</strong></span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4 text-[#FF2D95] shrink-0" />
                  <span>Email: <strong className="text-white">{contactEmail}</strong></span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Phản hồi & Báo giá trong <strong>15 phút</strong></span>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
