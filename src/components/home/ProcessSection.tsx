import React from "react";
import { Search, Compass, Paintbrush, Code2, Rocket, LineChart } from "lucide-react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

const PROCESS_STEPS = [
  {
    step: "01",
    phase: "GIAI ĐOẠN I • KHẢO SÁT",
    title: "Thấu Hiểu & Khảo Sát",
    icon: Search,
    color: "#38BDF8",
    deliverable: "Tài Liệu Đề Bài & Báo Cáo Kiểm Tra",
    desc: "Khảo sát chuyên sâu mô hình kinh doanh, phân tích hành vi khách hàng mục tiêu và xác định lợi thế cạnh tranh cốt lõi trên thị trường.",
  },
  {
    step: "02",
    phase: "GIAI ĐOẠN II • KIẾN TRÚC",
    title: "Chiến Lược & Kiến Trúc",
    icon: Compass,
    color: "#007BA7",
    deliverable: "Bản Thiết Kế Hệ Thống & Wireframe",
    desc: "Định hình ngôn ngữ thị giác, sơ đồ kiến trúc thông tin (IA), lựa chọn tech stack tối ưu và lộ trình triển khai chi tiết.",
  },
  {
    step: "03",
    phase: "GIAI ĐOẠN III • SÁNG TẠO",
    title: "Thiết Kế UI/UX & 3D",
    icon: Paintbrush,
    color: "#FF2D95",
    deliverable: "Hệ Thống Thiết Kế UI/UX & Tài Sản 3D",
    desc: "Chế tác giao diện độc bản chuẩn Luxury Dark, mô hình hóa vật thể 3D WebGL và kịch bản chuyển động mượt mà.",
  },
  {
    step: "04",
    phase: "GIAI ĐOẠN IV • LẬP TRÌNH",
    title: "Lập Trình & Tích Hợp",
    icon: Code2,
    color: "#007BA7",
    deliverable: "Mã Nguồn Chuẩn Hóa & API Toàn Diện",
    desc: "Phát triển trên nền tảng Next.js 14, Three.js, GSAP và Prisma ORM. Đảm bảo tốc độ phản hồi tức thì và bảo mật đa tầng.",
  },
  {
    step: "05",
    phase: "GIAI ĐOẠN V • VẬN HÀNH",
    title: "Kiểm Thử & Vận Hành",
    icon: Rocket,
    color: "#FF2D95",
    deliverable: "60 FPS & Triển Khai Thực Tế",
    desc: "Kiểm thử hiệu năng đa thiết bị, tối ưu điểm Core Web Vitals / SEO, triển khai hạ tầng Cloud CDN và bàn giao CMS quản trị.",
  },
  {
    step: "06",
    phase: "GIAI ĐOẠN VI • TĂNG TRƯỞNG",
    title: "Đồng Hành & Tối Ưu",
    icon: LineChart,
    color: "#10B981",
    deliverable: "Cam Kết SLA 99.9% & Phân Tích",
    desc: "Giám sát vận hành thời gian thực, phân tích dữ liệu chuyển đổi, bảo trì định kỳ và nâng cấp tính năng mở rộng.",
  },
];

export default function ProcessSection({ sectionData }: { sectionData?: any }) {
  const subtitle = sectionData?.subtitle || "05 • PHƯƠNG PHÁP & TIẾN TRÌNH";
  const title = sectionData?.title || "QUY TRÌNH 6 BƯỚC CHUẨN QUỐC TẾ";
  const description =
    sectionData?.description ||
    "Mọi dự án tại NGUYÊN AGENCY đều được vận hành theo quy trình khép kín, minh bạch tiến độ và cam kết chất lượng đầu ra ở mức cao nhất.";

  return (
    <section className="py-28 px-6 bg-[#0A0A0A] border-b border-[#1F1F23] relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <RevealOnScroll className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 pb-10 border-b border-[#1F1F23]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#007BA7]" />
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#007BA7]">
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

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROCESS_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <RevealOnScroll key={step.step} delay={(idx % 3) * 0.08}>
                <div className="group h-full p-8 rounded-3xl bg-[#111114] border border-[#242429] hover:border-[#007BA7]/55 transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between relative overflow-hidden">
                  <div>
                    <div className="flex items-center justify-between mb-7">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-[#71717A] uppercase block mb-1">
                          {step.phase}
                        </span>
                        <span className="text-3xl font-black font-mono text-gradient-silver">
                          {step.step}
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-[#17171B] border border-[#292929] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" style={{ color: step.color }} />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#38BDF8] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#A1A1AA] leading-relaxed mb-6">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#1F1F23] flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A]">
                      BÀN GIAO:
                    </span>
                    <span className="text-xs font-mono text-[#D4D4D8] font-medium">
                      {step.deliverable}
                    </span>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
