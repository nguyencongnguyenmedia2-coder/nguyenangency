import React from "react";
import Image from "next/image";
import { Star, Quote, ShieldCheck, CheckCircle2 } from "lucide-react";
import prisma from "@/lib/prisma";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

const FALLBACK_TESTIMONIALS = [
  {
    id: "test_01",
    clientName: "Trần Minh Quân",
    clientRole: "Founder & CEO",
    company: "Nexus Luxury Group",
    rating: 5,
    metric: "+320% Doanh Thu Trực Tuyến",
    content: "NGUYÊN AGENCY đã thay đổi hoàn toàn diện mạo thương hiệu của chúng tôi. Website 3D WebGL không chỉ thu hút khách hàng thượng lưu mà còn chạy mượt mà 60 FPS trên cả iPhone lẫn Desktop. Điểm 99/100 Lighthouse là điều trước đây chưa đơn vị nào làm được cho chúng tôi.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "test_02",
    clientName: "Lê Hoàng Yến",
    clientRole: "Chief Marketing Officer",
    company: "Vanguard Tech & AI",
    rating: 5,
    metric: "Giảm 65% Chi Phí Hỗ Trợ",
    content: "Trợ lý AI Agent do phòng LAB của NGUYÊN AGENCY tích hợp giúp chúng tôi xử lý tự động hơn 1.200 cuộc trò chuyện khách hàng mỗi ngày với tỷ lệ chính xác tuyệt đối. Đội ngũ làm việc chuyên nghiệp, bàn giao đúng cam kết SLA từng ngày.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "test_03",
    clientName: "Nguyễn Đức Anh",
    clientRole: "Managing Director",
    company: "Aura Creative Studio",
    rating: 5,
    metric: "Bàn Giao Sớm Hơn 5 Ngày",
    content: "Bộ nhận diện thương hiệu độc bản và video 3D CGI mà NGUYÊN AGENCY sản xuất đã giúp dự án gọi vốn thành công vòng Series A. Quy trình 6 bước rõ ràng, minh bạch từ hợp đồng đến source code cuối cùng.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
];

export default async function TestimonialsSection({
  testimonials: initialTestimonials,
  sectionData,
}: {
  testimonials?: any[];
  sectionData?: any;
}) {
  const subtitle = sectionData?.subtitle || "07 • ĐÁNH GIÁ TỪ ĐỐI TÁC & LÃNH ĐẠO";
  const title = sectionData?.title || "ĐỐI TÁC & LÃNH ĐẠO NÓI VỀ CHÚNG TÔI";
  const description =
    sectionData?.description ||
    "Sự tín nhiệm từ các nhà sáng lập, Giám đốc điều hành và các tập đoàn đối tác là thước đo chuẩn xác nhất cho năng lực thực thi và cam kết đồng hành dài hạn của NGUYÊN AGENCY.";

  let testimonials = initialTestimonials;
  if (!testimonials || testimonials.length === 0) {
    try {
      testimonials = await prisma.testimonial.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { order: "asc" },
      });
    } catch {
      // fallback
    }
  }

  if (!testimonials || testimonials.length === 0) {
    testimonials = FALLBACK_TESTIMONIALS;
  }

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 bg-[#06070B] border-b border-[#1A1A22] relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#FF2D95]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <RevealOnScroll className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 pb-10 border-b border-[#1A1A22]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0D121D] border border-[#FF2D95]/30 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#FF2D95] animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#FF2D95] font-semibold">
                {subtitle}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-[1.1]">
              {title}
            </h2>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-2 max-w-md">
            <p className="text-sm md:text-base text-[#D4D4D8] lg:text-right leading-relaxed">
              {description}
            </p>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Đánh giá thật từ khách hàng đã nghiệm thu dự án
            </span>
          </div>
        </RevealOnScroll>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {testimonials.map((item, idx) => (
            <RevealOnScroll key={item.id} delay={idx * 0.1}>
              <div className="h-full p-7 sm:p-8 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] hover:border-white/25 flex flex-col justify-between relative group transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_50px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                <Quote className="absolute top-6 right-6 w-9 h-9 text-white/5 group-hover:text-[#00E5FF]/20 transition-colors pointer-events-none" />

                <div className="mb-7">
                  {/* Rating Stars & Metric Pill */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div className="flex items-center gap-1 text-[#FF2D95]">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    {item.metric && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25 font-bold">
                        {item.metric}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-[#E4E4E7] leading-relaxed italic">
                    &ldquo;{item.content}&rdquo;
                  </p>
                </div>

                <div className="pt-5 border-t border-white/[0.08] flex items-center gap-3.5">
                  {item.avatar ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#121622] border border-white/15 shrink-0">
                      <Image
                        src={item.avatar}
                        alt={item.clientName}
                        fill
                        sizes="48px"
                        loading="lazy"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00A3FF] to-[#FF2D95] flex items-center justify-center text-white font-mono font-bold text-sm shrink-0">
                      {item.clientName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white">{item.clientName}</h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                    </div>
                    <p className="text-xs text-[#A1A1AA] font-mono mt-0.5">
                      {item.clientRole} • {item.company}
                    </p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
