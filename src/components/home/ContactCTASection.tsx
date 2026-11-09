import React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, CheckCircle2 } from "lucide-react";
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
  };
}) {
  const subtitle = sectionData?.subtitle || "10 • KẾT NỐI HỢP TÁC";
  const title = sectionData?.title || "SẴN SÀNG KIẾN TẠO VỊ THẾ SỐ ĐỘC BẢN?";
  const description =
    sectionData?.description ||
    "Hãy biến tầm nhìn chiến lược của bạn thành một nền tảng kỹ thuật số vượt chuẩn. Đội ngũ Creative Director & Solution Architect tại NGUYÊN AGENCY sẵn sàng đồng hành cùng bạn.";
  const ctaText = sectionData?.ctaText || "Khởi Tạo Dự Án Ngay";
  const ctaLink = sectionData?.ctaLink || "/contact";
  const contactEmail = siteSettings?.contactEmail || "contact@nguyenagency.vn";
  const hotline = siteSettings?.hotline || "+84 908 889 999";

  return (
    <section className="py-28 px-6 bg-[#0A0A0A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll>
          <div className="relative rounded-[2.5rem] bg-[#111115] border border-[#27272F] p-10 sm:p-14 md:p-20 overflow-hidden text-center">
            {/* Ambient Dual Brand Spotlights */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#007BA7]/20 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FF2D95]/20 rounded-full blur-[130px] pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18181E] border border-[#2E2E38] mb-7">
                <Sparkles className="w-3.5 h-3.5 text-[#FF2D95]" />
                <span className="text-[11px] font-mono tracking-[0.22em] text-[#E4E4E7] uppercase">
                  {subtitle}
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.08] mb-6">
                {title}
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-[#A1A1AA] max-w-2xl mx-auto mb-10 leading-relaxed">
                {description}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <Link
                  href={ctaLink}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-semibold text-xs uppercase tracking-[0.18em] hover:shadow-[0_0_32px_rgba(255,45,149,0.45)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 group"
                >
                  <span>{ctaText}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                <Link
                  href="/pricing"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#16161B] border border-[#2D2D35] hover:border-[#007BA7] text-[#E4E4E7] hover:text-white font-semibold text-xs uppercase tracking-[0.18em] transition-all"
                >
                  <span>Tham Khảo Bảng Giá</span>
                </Link>
              </div>

              {/* Trust Indicators + Live Contact Info */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-8 border-t border-[#22222A] text-xs font-mono text-[#A1A1AA]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#007BA7]" />
                  <span>Hotline: {hotline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF2D95]" />
                  <span>Email: {contactEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Bàn giao toàn quyền Mã nguồn & Quản trị CMS</span>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
