import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowUpRight, HelpCircle, Sparkles, ShieldCheck, Zap } from "lucide-react";
import prisma from "@/lib/prisma";
import { formatCurrencyVND } from "@/lib/utils";

export const metadata = {
  title: "Bảng Giá Dịch Vụ Minh Bạch – NGUYÊN AGENCY",
  description:
    "Bảng giá các gói dịch vụ Branding, Thiết kế 3D Website, Web Application và Phần mềm chuyển giao mã nguồn trọn gói.",
};

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  let packages: any[] = [];
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
    packages = results[0] || [];
    dbFaqs = results[1] || [];
  } catch (err) {
    console.warn("[PricingPage] DB fetch fallback active:", err);
  }

  const faqs =
    dbFaqs.length > 0
      ? dbFaqs.map((item) => ({ q: item.question, a: item.answer }))
      : [
          {
            q: "Quy trình thanh toán tại NGUYÊN AGENCY được chia làm mấy đợt?",
            a: "Thông thường quy trình thanh toán được chia làm 3 đợt minh bạch: 40% khi ký hợp đồng và kickoff dự án, 40% khi nghiệm thu thiết kế UI/UX & bản thử nghiệm tính năng, và 20% khi nghiệm thu hoàn tất và bàn giao toàn bộ mã nguồn.",
          },
          {
            q: "Khách hàng có được bàn giao 100% mã nguồn không?",
            a: "Tuyệt đối có. NGUYÊN AGENCY cam kết chuyển giao toàn bộ mã nguồn, tài liệu hướng dẫn kỹ thuật, tài khoản dịch vụ đám mây và toàn quyền sở hữu trí tuệ cho khách hàng mà không giữ lại bất kỳ bản quyền ràng buộc nào.",
          },
          {
            q: "Nếu dự án cần tính năng may đo riêng thì báo giá thế nào?",
            a: "Đối với các hệ thống phức tạp, NGUYÊN AGENCY sẽ tiến hành buổi tư vấn kỹ thuật (Discovery Call) 45 phút hoàn toàn miễn phí, sau đó lập Báo giá chi tiết kèm Scope of Work chuẩn xác trong vòng 24h.",
          },
          {
            q: "Chính sách bảo hành và hỗ trợ sau bàn giao?",
            a: "Mọi dự án đều đi kèm cam kết bảo hành kỹ thuật 12 tháng, SLA xử lý sự cố trong vòng 2 giờ và hỗ trợ cập nhật bảo mật định kỳ miễn phí.",
          },
        ];

  return (
    <div className="pt-32 pb-24 px-6 bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#171717] border border-[#292929]">
            <Sparkles className="w-3.5 h-3.5 text-[#007BA7]" />
            <span className="text-xs font-mono tracking-widest text-white uppercase">
              TRANSPARENT VALUE • NO HIDDEN FEES
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-tight">
            BẢNG GIÁ DỊCH VỤ <br />
            <span className="text-gradient-brand">MINH BẠCH & TOÀN DIỆN.</span>
          </h1>

          <p className="text-base text-[#A1A1AA] leading-relaxed max-w-2xl mx-auto">
            Các gói giải pháp chuẩn hóa với phạm vi công việc rõ ràng, cam kết tiến độ và chuyển giao 100% bản quyền mã nguồn.
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
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${pkg.isPopular
                  ? "bg-[#171717] border-2 border-[#007BA7] shadow-glow-blue -translate-y-2"
                  : "bg-[#121212] border border-[#292929] hover:border-[#383838]"
                  }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-mono text-[10px] uppercase font-bold tracking-widest shadow-lg">
                    LỰA CHỌN PHỔ BIẾN
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#71717A] mb-2 block">
                    {pkg.packageGroup}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                  <p className="text-xs text-[#A1A1AA] mb-6 leading-relaxed min-h-[36px]">
                    {pkg.description}
                  </p>

                  <div className="mb-6 pt-4 border-t border-[#292929]">
                    <span className="text-3xl font-black text-white font-mono">
                      {pkg.priceDisplay || (pkg.price ? formatCurrencyVND(pkg.price) : "Liên hệ báo giá")}
                    </span>
                    <span className="text-xs text-[#71717A] block mt-1 font-mono">
                      Thời gian: {pkg.deliveryTime || "Theo phạm vi dự án"}
                    </span>
                  </div>

                  <div className="space-y-3 mb-8 pt-4 border-t border-[#292929]">
                    {features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-[#E4E4E7]">
                        <CheckCircle2 className="w-4 h-4 text-[#007BA7] shrink-0 mt-0.5" />
                        <span className="leading-snug">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/contact?package=${encodeURIComponent(pkg.name)}`}
                  className={`w-full py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${pkg.isPopular
                    ? "bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white hover:shadow-glow-pink"
                    : "bg-[#171717] hover:bg-[#202020] text-white border border-[#292929]"
                    }`}
                >
                  <span>Chọn Gói Này</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Custom Solution Card */}
        <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-r from-[#171717] to-[#121212] border border-[#292929] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#FF2D95] font-bold">
              ENTERPRISE & BESPOKE ARCHITECTURE
            </span>
            <h2 className="text-3xl font-black uppercase text-white leading-tight">
              Yêu cầu giải pháp tùy chỉnh riêng biệt?
            </h2>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Dành cho các dự án Web 3D immersive quy mô lớn, sàn giao dịch, nền tảng SaaS hoặc ứng dụng AI doanh nghiệp cần Scope of Work chuyên sâu.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-8 py-4 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-all shrink-0 flex items-center gap-2 shadow-xl"
          >
            <span>Yêu Cầu Báo Giá May Đo</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Pricing FAQs */}
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#007BA7] mb-2 block">
              QUESTIONS & ANSWERS
            </span>
            <h2 className="text-3xl font-black uppercase text-white">
              CÂU HỎI VỀ BẢNG GIÁ & HỢP TÁC
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-[#121212] border border-[#292929] space-y-3">
                <h3 className="text-base font-bold text-white flex items-start gap-2.5">
                  <HelpCircle className="w-4 h-4 text-[#007BA7] shrink-0 mt-1" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed pl-6.5 text-justify">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
