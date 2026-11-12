import React from "react";
import { Search, Compass, Paintbrush, Code2, Rocket, LineChart, CheckCircle2, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

const PROCESS_STEPS = [
  {
    step: "01",
    phase: "GIAI ĐOẠN I • KHẢO SÁT & ĐỀ BÀI",
    title: "Thấu Hiểu & Lập Bản Đồ Nhu Cầu",
    icon: Search,
    color: "#00E5FF",
    duration: "2 - 4 ngày làm việc",
    deliverable: "Thỏa Thuận NDA & Tài Liệu Yêu Cầu Kỹ Thuật (SRS)",
    desc: "Khảo sát chuyên sâu mô hình kinh doanh, phỏng vấn chân dung khách hàng mục tiêu, phân tích đối thủ cạnh tranh và xác định các chỉ số KPI chuyển đổi cốt lõi.",
    milestones: ["Ký kết thỏa thuận bảo mật NDA", "Bản phân tích đối thủ & thị trường", "Xác định Scope & Timeline chuẩn"],
  },
  {
    step: "02",
    phase: "GIAI ĐOẠN II • CHIẾN LƯỢC & KIẾN TRÚC",
    title: "Kiến Trúc Thông Tin & Wireframe",
    icon: Compass,
    color: "#00A3FF",
    duration: "3 - 5 ngày làm việc",
    deliverable: "Bản Thiết Kế Kiến Trúc Hệ Thống & Wireframe Figma",
    desc: "Xây dựng sơ đồ cấu trúc trang (Sitemap), hành trình trải nghiệm người dùng (UX User Journey), lựa chọn Tech Stack tối ưu và thiết lập tài liệu khung dự án.",
    milestones: ["Sơ đồ kiến trúc thông tin (IA)", "Wireframe UX trải nghiệm đa thiết bị", "Đặc tả kỹ thuật Database & API"],
  },
  {
    step: "03",
    phase: "GIAI ĐOẠN III • THIẾT KẾ ĐỘC BẢN",
    title: "Thiết Kế UI/UX & Không Gian 3D",
    icon: Paintbrush,
    color: "#FF2D95",
    duration: "1 - 2 tuần làm việc",
    deliverable: "Hệ Thống Design System & Tài Sản 3D WebGL",
    desc: "Chế tác giao diện đồ họa độc quyền theo phong cách Luxury Dark, dựng mô hình 3D tương tác chân thực và hoàn thiện Prototype chuyển động sinh động trên Figma.",
    milestones: ["Design System hoàn chỉnh (Colors, Typo, Components)", "Mô hình 3D tối ưu hóa dung lượng Web", "Bàn giao Prototype để duyệt tương tác"],
  },
  {
    step: "04",
    phase: "GIAI ĐOẠN IV • LẬP TRÌNH FULL-STACK",
    title: "Lập Trình Tốc Độ Cao & AI Engine",
    icon: Code2,
    color: "#00E5FF",
    duration: "2 - 4 tuần làm việc",
    deliverable: "Mã Nguồn Chuẩn Hóa Clean Code & API Gateway",
    desc: "Hiện thực hóa mã nguồn trên nền tảng Next.js 14 Serverless, Three.js 60 FPS, kết nối cơ sở dữ liệu Supabase PostgreSQL và tích hợp trợ lý AI thông minh.",
    milestones: ["Tối ưu hiệu năng tải trang 60 FPS", "Hệ thống CMS Admin quản trị trực quan", "Bảo mật đa tầng chống tấn công mạng"],
  },
  {
    step: "05",
    phase: "GIAI ĐOẠN V • KIỂM THỬ & TRIỂN KHAI",
    title: "Kiểm Thử Hiệu Năng & Khởi Chạy",
    icon: Rocket,
    color: "#A855F7",
    duration: "3 - 5 ngày làm việc",
    deliverable: "Chứng Nhận 95+ Lighthouse & Bàn Giao VPS",
    desc: "Kiểm thử xuyên suốt trên 20+ dòng thiết bị di động, kiểm tra bảo mật OWASP, tối ưu điểm Google Core Web Vitals và thiết lập hạ tầng Cloud VPS Nginx SSL hoàn tất.",
    milestones: ["Audit điểm số SEO & Tốc độ đạt 95+", "Cấu hình tên miền & Chứng chỉ SSL miễn phí", "Bàn giao 100% Source Code & Hướng dẫn"],
  },
  {
    step: "06",
    phase: "GIAI ĐOẠN VI • ĐỒNG HÀNH 24/7",
    title: "Bảo Hành Tận Tâm & Tối Ưu Tăng Trưởng",
    icon: LineChart,
    color: "#10B981",
    duration: "12 tháng bảo hành miễn phí",
    deliverable: "Cam Kết Vận Hành SLA 99.9% & Báo Cáo Định Kỳ",
    desc: "Giám sát thời gian hoạt động Uptime 24/7, sao lưu dữ liệu tự động hàng tuần, hỗ trợ kỹ thuật tức thì và liên tục tư vấn chiến lược nâng cấp tính năng mới.",
    milestones: ["Bảo hành lỗi kỹ thuật 12 tháng 100%", "Hỗ trợ khẩn cấp qua Hotline & Telegram", "Backup dữ liệu định kỳ trên Cloud an toàn"],
  },
];

export default function ProcessSection({ sectionData }: { sectionData?: any }) {
  const subtitle = sectionData?.subtitle || "05 • PHƯƠNG PHÁP & TIẾN TRÌNH THỰC HIỆN";
  const title = sectionData?.title || "QUY TRÌNH 6 BƯỚC CHUẨN KỸ THUẬT QUỐC TẾ";
  const description =
    sectionData?.description ||
    "Mọi dự án tại NGUYÊN AGENCY được vận hành theo quy trình kỹ thuật nghiêm ngặt, minh bạch tuyệt đối từng mốc tiến độ và cam kết bàn giao đúng hạn với chất lượng vượt chuẩn.";

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 bg-[#06070B] border-b border-[#1A1A22] relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-[#00A3FF]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <RevealOnScroll className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 pb-10 border-b border-[#1A1A22]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0D121D] border border-[#00E5FF]/30 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#00E5FF] font-semibold">
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
              Cam kết tiến độ bàn giao kèm điều khoản phạt hợp đồng rõ ràng
            </span>
          </div>
        </RevealOnScroll>

        {/* 6 Steps Bento Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {PROCESS_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <RevealOnScroll key={step.step} delay={(idx % 3) * 0.08}>
                <div className="group h-full p-7 sm:p-8 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] hover:border-white/25 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_50px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col justify-between relative overflow-hidden">
                  {/* Subtle top indicator line */}
                  <div
                    className="absolute top-0 left-6 right-6 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${step.color}, transparent)`,
                    }}
                  />

                  <div>
                    {/* Header Strip with Step Number, Phase & Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-[#71717A] uppercase block mb-1 font-bold">
                          {step.phase}
                        </span>
                        <span className="text-3xl sm:text-4xl font-black font-mono text-white/90">
                          {step.step}
                        </span>
                      </div>
                      <div
                        className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                        style={{
                          backgroundColor: `${step.color}15`,
                          borderColor: `${step.color}40`,
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: step.color }} />
                      </div>
                    </div>

                    {/* Step Title & Timeline Badge */}
                    <div className="mb-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#121622] border border-white/10 text-[10px] font-mono text-[#00E5FF] mb-2 font-bold">
                        <Clock className="w-3 h-3" />
                        <span>{step.duration}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#00E5FF] transition-colors leading-snug">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-6">
                      {step.desc}
                    </p>

                    {/* Milestones list */}
                    <div className="space-y-2 mb-6 pt-5 border-t border-white/[0.08]">
                      {step.milestones.map((m, mIdx) => (
                        <div key={mIdx} className="flex items-start gap-2 text-xs text-[#E4E4E7]">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: step.color }} />
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer Deliverables */}
                  <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] font-bold">
                      BÀN GIAO:
                    </span>
                    <span className="text-xs font-mono text-[#D4D4D8] font-bold text-right truncate">
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
