import React from "react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import prisma from "@/lib/prisma";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

export default async function TestimonialsSection({
  testimonials: initialTestimonials,
  sectionData,
}: {
  testimonials?: any[];
  sectionData?: any;
}) {
  const subtitle = sectionData?.subtitle || "07 • ĐÁNH GIÁ TỪ ĐỐI TÁC";
  const title = sectionData?.title || "ĐỐI TÁC & LÃNH ĐẠO NÓI VỀ CHÚNG TÔI";
  const description =
    sectionData?.description ||
    "Sự tín nhiệm từ các nhà sáng lập, Giám đốc điều hành và các tập đoàn đối tác là thước đo chuẩn xác nhất cho chất lượng thực thi của NGUYÊN AGENCY.";

  const testimonials =
    initialTestimonials ||
    (await prisma.testimonial.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
    }));

  return (
    <section className="py-28 px-6 bg-[#0A0A0A] border-b border-[#1F1F23] relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <RevealOnScroll className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 pb-10 border-b border-[#1F1F23]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#FF2D95]" />
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#FF2D95]">
                {subtitle}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-[1.1]">
              {title}
            </h2>
          </div>
          <p className="text-sm text-[#A1A1AA] max-w-md leading-relaxed">
            {description}
          </p>
        </RevealOnScroll>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <RevealOnScroll key={item.id} delay={idx * 0.1}>
              <div className="h-full p-8 rounded-3xl bg-[#111114] border border-[#242429] hover:border-[#007BA7]/60 flex flex-col justify-between relative group transition-all duration-500 hover:-translate-y-1.5">
                <Quote className="absolute top-6 right-6 w-8 h-8 text-white/5 group-hover:text-[#007BA7]/20 transition-colors pointer-events-none" />

                <div className="mb-8">
                  <div className="flex items-center gap-1 mb-6 text-[#FF2D95]">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-sm md:text-[15px] text-[#D4D4D8] leading-relaxed">
                    &ldquo;{item.content}&rdquo;
                  </p>
                </div>

                <div className="pt-5 border-t border-[#242429] flex items-center gap-3.5">
                  {item.avatar ? (
                    <div className="relative w-11 h-11 rounded-full overflow-hidden bg-[#17171B] border border-[#292929] shrink-0">
                      <Image
                        src={item.avatar}
                        alt={item.clientName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#007BA7] to-[#FF2D95] flex items-center justify-center text-white font-mono font-bold text-sm shrink-0">
                      {item.clientName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.clientName}</h4>
                    <p className="text-xs text-[#71717A] font-mono">
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
