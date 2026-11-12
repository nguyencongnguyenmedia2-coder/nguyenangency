import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowUpRight,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
  FileCode,
  Layers,
  Award,
  Lock,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { formatCurrencyVND } from "@/lib/utils";

export const metadata = {
  title: "Bảng Giá Dịch Vụ Minh Bạch & Chuyển Giao Trọn Gói – NGUYÊN AGENCY",
  description:
    "Bảng giá các gói dịch vụ Branding, Thiết kế 3D Website, Web Application và Phần mềm chuyển giao 100% mã nguồn, cam kết không phát sinh chi phí.",
};

export const revalidate = 60;

interface PricingPackageItem {
  id: string;
  name: string;
  packageGroup: string;
  description: string;
  price?: number | null;
  priceDisplay?: string | null;
  deliveryTime?: string | null;
  isPopular?: boolean;
  featuresJson?: string;
}

const FALLBACK_PACKAGES: PricingPackageItem[] = [
  {
    id: "pkg-1",
    name: "Brand Identity Genesis",
    packageGroup: "MEDIA & BRANDING",
    description: "Bộ nhận diện thương hiệu độc bản dành cho doanh nghiệp khởi nghiệp hoặc tái định vị chuyên nghiệp.",
    price: 15000000,
    priceDisplay: "15.000.000 VNĐ",
    deliveryTime: "7 - 10 ngày làm việc",
    isPopular: false,
    featuresJson: JSON.stringify([
      "Logo phong thủy & Brand Guidelines chi tiết 40+ trang",
      "Hệ thống màu sắc, Typography và Grids nhận diện chuẩn",
      "Bộ ấn phẩm văn phòng: Namecard, Letterhead, Phong bì",
      "Bộ nhận diện Social Media: Avatar, Banner, Story templates",
      "Bàn giao trọn gói file gốc Vector (AI, SVG, PDF, Figma)",
      "Hỗ trợ chỉnh sửa 3 vòng không phát sinh chi phí",
    ]),
  },
  {
    id: "pkg-2",
    name: "3D Web Experience Pro",
    packageGroup: "DIGITAL & 3D WEBGL",
    description: "Website cao cấp tích hợp hiệu ứng tương tác 3D WebGL thời gian thực, tối ưu chuyển đổi và định vị dẫn đầu.",
    price: 35000000,
    priceDisplay: "35.000.000 VNĐ",
    deliveryTime: "14 - 21 ngày làm việc",
    isPopular: true,
    featuresJson: JSON.stringify([
      "Thiết kế UI/UX độc bản theo phong cách Luxury Dark Tech",
      "Tích hợp hiệu ứng tương tác 3D WebGL / Three.js 60 FPS",
      "Next.js 15 Full-stack + CMS quản trị bài viết & media",
      "Tối ưu Core Web Vitals (Lighthouse 95+ điểm trên desktop)",
      "Chuẩn SEO On-page, cấu trúc Schema Rich Snippets",
      "Miễn phí 1 năm Hosting High-Performance & SSL Enterprise",
      "Bảo hành kỹ thuật 12 tháng, SLA xử lý sự cố trong 2 giờ",
    ]),
  },
  {
    id: "pkg-3",
    name: "Enterprise Web & SaaS",
    packageGroup: "TECH & SOFTWARE",
    description: "Ứng dụng web, cổng thông tin khách hàng hoặc nền tảng SaaS quy mô đa người dùng với cơ sở dữ liệu lớn.",
    price: 65000000,
    priceDisplay: "65.000.000 VNĐ",
    deliveryTime: "25 - 35 ngày làm việc",
    isPopular: false,
    featuresJson: JSON.stringify([
      "Kiến trúc Next.js + PostgreSQL / Supabase mở rộng linh hoạt",
      "Hệ thống xác thực người dùng RBAC (Admin, Staff, Client)",
      "Tích hợp thanh toán trực tuyến: VietQR Pro, VNPay, Momo",
      "Hệ thống CRM khách hàng & Dashboard phân tích trực quan",
      "Tự động hóa thông báo qua Email & Telegram Webhook",
      "Kiểm thử bảo mật (OWASP Top 10) & tối ưu hóa Database",
      "Bàn giao 100% bản quyền mã nguồn Git & tài liệu API",
    ]),
  },
  {
    id: "pkg-4",
    name: "AI & Full Transformation",
    packageGroup: "DIGITAL LAB & AI",
    description: "Giải pháp chuyển đổi số toàn diện tích hợp trợ lý ảo AI Agent, tự động hóa quy trình nghiệp vụ và hạ tầng riêng.",
    price: null,
    priceDisplay: "Từ 95.000.000 VNĐ",
    deliveryTime: "Theo Scope dự án",
    isPopular: false,
    featuresJson: JSON.stringify([
      "Bao gồm toàn bộ tính năng của gói Enterprise Web",
      "Tích hợp AI Agent đa kênh (Web, Telegram, Zalo OA)",
      "RAG Vector Database huấn luyện trên dữ liệu riêng của DN",
      "Tự động hóa quy trình nghiệp vụ (ERP / CRM may đo)",
      "Triển khai hạ tầng VPS / Cloud riêng biệt có sao lưu định kỳ",
      "Đào tạo trực tiếp 1:1 cho đội ngũ vận hành nội bộ",
      "Cam kết SLA bảo trì 24/7 và giám sát hệ thống thời gian thực",
    ]),
  },
];

const COMPARISON_ROWS = [
  {
    feature: "Thiết kế UI/UX độc bản (Không dùng theme có sẵn)",
    genesis: "Cơ bản",
    pro: "Độc quyền 3D",
    saas: "Hệ thống Design System",
    ai: "Toàn diện Đa kênh",
  },
  {
    feature: "Hiệu ứng 3D WebGL / Three.js 60 FPS",
    genesis: "—",
    pro: "Có (Tiêu chuẩn)",
    saas: "Có (Mở rộng)",
    ai: "Có (Tối đa)",
  },
  {
    feature: "Hệ thống quản trị nội dung (CMS)",
    genesis: "—",
    pro: "CMS Tiêu chuẩn",
    saas: "CMS Nâng cao + Phân quyền",
    ai: "Custom Enterprise Portal",
  },
  {
    feature: "Cổng thanh toán tự động (VietQR / VNPay)",
    genesis: "—",
    pro: "Tùy chọn thêm",
    saas: "Tích hợp sẵn",
    ai: "Tích hợp sẵn + Đối soát",
  },
  {
    feature: "Tác tử AI CSKH & Trợ lý ảo RAG",
    genesis: "—",
    pro: "—",
    saas: "Tùy chọn tích hợp",
    ai: "Bao gồm sẵn",
  },
  {
    feature: "Bàn giao 100% mã nguồn & Git Repository",
    genesis: "File gốc đồ họa",
    pro: "Bàn giao 100%",
    saas: "Bàn giao 100%",
    ai: "Bàn giao 100% + Tài liệu kiến trúc",
  },
  {
    feature: "Thời gian bảo hành kỹ thuật",
    genesis: "6 tháng",
    pro: "12 tháng",
    saas: "12 tháng",
    ai: "24 tháng cam kết SLA",
  },
];

export default async function PricingPage() {
  let dbPackages: any[] = [];
  let dbFaqs: any[] = [];

  try {
    const results = await Promise.all([
      prisma.servicePackage.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { order: "asc" },
      }),
      prisma.fAQ.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { order: "asc" },
        take: 6,
      }),
    ]);
    dbPackages = results[0] || [];
    dbFaqs = results[1] || [];
  } catch (err) {
    console.warn("[PricingPage] DB fetch fallback active:", err);
  }

  const packages = dbPackages.length > 0 ? dbPackages : FALLBACK_PACKAGES;

  const faqs =
    dbFaqs.length > 0
      ? dbFaqs.map((item) => ({ q: item.question, a: item.answer }))
      : [
          {
            q: "Quy trình thanh toán tại NGUYÊN AGENCY được chia làm mấy đợt?",
            a: "Quy trình thanh toán được chia làm 3 đợt minh bạch và rõ ràng: Đợt 1 (40%) khi ký hợp đồng và bắt đầu kickoff dự án; Đợt 2 (40%) khi nghiệm thu thiết kế UI/UX và hoàn thiện bản thử nghiệm tính năng; Đợt 3 (20%) khi nghiệm thu toàn diện, đào tạo bàn giao và chuyển quyền sở hữu toàn bộ mã nguồn.",
          },
          {
            q: "Doanh nghiệp có được bàn giao 100% mã nguồn không?",
            a: "Tuyệt đối có. NGUYÊN AGENCY tôn trọng quyền sở hữu trí tuệ của khách hàng. Chúng tôi chuyển giao toàn bộ mã nguồn trên Git, file thiết kế Figma gốc, cấu hình hạ tầng đám mây và tài liệu hướng dẫn kỹ thuật mà không giữ lại bất kỳ bản quyền ràng buộc nào.",
          },
          {
            q: "Trong quá trình thực hiện dự án có phát sinh chi phí ẩn không?",
            a: "Cam kết 100% không có chi phí ẩn. Mọi phạm vi công việc (Scope of Work), tính năng, công nghệ và chi phí dịch vụ bên thứ ba (nếu có) đều được xác định rõ ràng và cố định bằng văn bản hợp đồng trước khi triển khai.",
          },
          {
            q: "Chính sách bảo hành và hỗ trợ sau bàn giao như thế nào?",
            a: "Mọi sản phẩm bàn giao đều được bảo hành kỹ thuật 12 đến 24 tháng. Chúng tôi cam kết SLA xử lý sự cố trong vòng 2 giờ, hỗ trợ cập nhật bản vá bảo mật định kỳ và hỗ trợ kỹ thuật viên trực tiếp qua Telegram / Hotline 24/7.",
          },
        ];

  return (
    <div className="pt-32 pb-24 px-6 bg-[#06070B] text-white relative min-h-screen">
      {/* Background Gradients */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-r from-[#00E5FF]/10 via-[#FF2D95]/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="text-[11px] font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              TRANSPARENT VALUE • NO HIDDEN FEES
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[1.08]">
            BẢNG GIÁ DỊCH VỤ <br />
            <span className="bg-gradient-to-r from-[#00E5FF] via-[#FF2D95] to-[#A855F7] bg-clip-text text-transparent">
              MINH BẠCH & TOÀN DIỆN.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-2xl mx-auto">
            Các gói giải pháp chuẩn hóa với phạm vi công việc rõ ràng, cam kết tiến độ và chuyển giao 100% bản quyền mã nguồn độc lập.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => {
            let features: string[] = [];
            try {
              features = JSON.parse(pkg.featuresJson || "[]");
            } catch (e) {
              features = [];
            }

            return (
              <div
                key={pkg.id}
                className={`rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-500 relative backdrop-blur-xl ${
                  pkg.isPopular
                    ? "bg-[#0D0F17] border-2 border-[#FF2D95] shadow-[0_0_40px_rgba(255,45,149,0.25)] lg:-translate-y-3"
                    : "bg-[#0D0F17]/80 border border-white/[0.08] hover:border-white/[0.2]"
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#FF2D95] text-black font-mono text-[10px] uppercase font-black tracking-widest shadow-lg">
                    LỰA CHỌN PHỔ BIẾN NHẤT
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#00E5FF] mb-2 block font-bold">
                    {pkg.packageGroup}
                  </span>
                  <h3 className="text-xl font-black text-white mb-2">{pkg.name}</h3>
                  <p className="text-xs text-[#94A3B8] mb-6 leading-relaxed min-h-[38px]">
                    {pkg.description}
                  </p>

                  <div className="mb-6 pt-5 border-t border-white/[0.08]">
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
                      {pkg.priceDisplay || (pkg.price ? formatCurrencyVND(pkg.price) : "Liên hệ báo giá")}
                    </span>
                    <span className="text-xs text-white/50 block mt-1.5 font-mono flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
                      {pkg.deliveryTime || "Theo phạm vi dự án"}
                    </span>
                  </div>

                  <div className="space-y-3 mb-8 pt-5 border-t border-white/[0.08]">
                    {features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-[#E2E8F0]">
                        <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                        <span className="leading-snug">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/contact?package=${encodeURIComponent(pkg.name)}`}
                  className={`w-full py-3.5 rounded-full text-xs font-mono font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    pkg.isPopular
                      ? "bg-gradient-to-r from-[#00E5FF] to-[#FF2D95] text-black hover:shadow-[0_0_25px_rgba(255,45,149,0.5)]"
                      : "bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1]"
                  }`}
                >
                  <span>Chọn Gói Này</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] backdrop-blur-xl p-8 sm:p-10 space-y-6 overflow-hidden">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              SO SÁNH TÍNH NĂNG CHI TIẾT
            </span>
            <h2 className="text-2xl font-black uppercase text-white">
              BẢNG PHÂN TÍCH QUYỀN LỢI TỪNG CẤP ĐỘ.
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/[0.1] text-xs font-mono text-white/50">
                  <th className="py-4 pr-4">Hạng Mục</th>
                  <th className="py-4 px-4 text-[#94A3B8]">Brand Identity</th>
                  <th className="py-4 px-4 text-[#FF2D95] font-bold">3D Web Pro</th>
                  <th className="py-4 px-4 text-[#00E5FF]">Enterprise SaaS</th>
                  <th className="py-4 pl-4 text-purple-400">Full AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-xs">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 pr-4 font-medium text-white">{row.feature}</td>
                    <td className="py-4 px-4 text-[#94A3B8] font-mono">{row.genesis}</td>
                    <td className="py-4 px-4 text-[#FF2D95] font-mono font-bold">{row.pro}</td>
                    <td className="py-4 px-4 text-[#00E5FF] font-mono">{row.saas}</td>
                    <td className="py-4 pl-4 text-purple-300 font-mono">{row.ai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3-Stage Payment Flow */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              LỘ TRÌNH THANH TOÁN 3 ĐỢT MINH BẠCH
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white">
              TIẾN TRÌNH RÕ RÀNG – AN TÂM TUYỆT ĐỐI.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-black/40 border border-white/[0.06] space-y-3 relative">
              <div className="text-3xl font-black text-[#00E5FF] font-mono">ĐỢT 1 • 40%</div>
              <h3 className="font-bold text-white text-base">Kickoff & Thiết Kế Khung Kiến Trúc</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Ký hợp đồng dịch vụ chính thức, bảo vệ cam kết NDA và tiến hành phác thảo wireframe, moodboard và bản thiết kế UI/UX độc bản.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-black/40 border border-white/[0.06] space-y-3 relative">
              <div className="text-3xl font-black text-[#FF2D95] font-mono">ĐỢT 2 • 40%</div>
              <h3 className="font-bold text-white text-base">Phát Triển & Thử Nghiệm Staging</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Lập trình tính năng, tích hợp 3D WebGL và triển khai lên môi trường Staging bí mật để khách hàng nghiệm thu trực tiếp.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-black/40 border border-white/[0.06] space-y-3 relative">
              <div className="text-3xl font-black text-emerald-400 font-mono">ĐỢT 3 • 20%</div>
              <h3 className="font-bold text-white text-base">Bàn Giao Toàn Diện & Chuyển Giao Source</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Nghiệm thu toàn bộ sản phẩm thực tế trên Production, bàn giao 100% quyền sở hữu trí tuệ, Git Repository và bắt đầu bảo hành.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              CÂU HỎI THƯỜNG GẶP
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white">
              GIẢI ĐÁP MINH BẠCH VỀ CHI PHÍ & HỢP ĐỒNG.
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0D0F17]/80 border border-white/[0.08] space-y-2 backdrop-blur-xl"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-[#FF2D95] shrink-0" />
                  <h4 className="font-bold text-white text-sm sm:text-base">{faq.q}</h4>
                </div>
                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed pl-7">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Scope Card */}
        <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-r from-[#00E5FF]/10 via-[#FF2D95]/10 to-purple-600/10 border border-white/[0.12] flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              CUSTOM TAILORED SOLUTION
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white">
              DỰ ÁN CỦA BẠN CẦN PHẠM VI MAY ĐO ĐẶC THÙ?
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8]">
              Đặt lịch họp tư vấn kỹ thuật (Discovery Call) 45 phút hoàn toàn miễn phí. Đội ngũ chuyên gia sẽ lắng nghe và lập Báo giá chi tiết kèm Scope of Work chuẩn xác trong vòng 24h.
            </p>
          </div>
          <Link
            href="/contact?type=custom"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#FF2D95] text-black font-mono text-xs font-black uppercase tracking-wider hover:shadow-[0_0_25px_rgba(255,45,149,0.5)] transition-all shrink-0 flex items-center justify-center gap-2"
          >
            <span>Đặt Lịch Tư Vấn 1:1</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
