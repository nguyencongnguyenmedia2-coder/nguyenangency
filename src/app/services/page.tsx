import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  Cpu,
  Palette,
  Clock,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { OFFICIAL_24_SERVICES, getServiceBySlug } from "@/data/services-data";

export const metadata = {
  title: "Hệ Sinh Thái 24 Dịch Vụ Digital – NGUYÊN AGENCY | Media & Tech Solutions",
  description:
    "Khám phá 24 dịch vụ toàn diện từ thiết kế thương hiệu, video, digital marketing đến thiết kế website, ứng dụng web và giải pháp AI tại Nguyên Agency Quảng Ngãi.",
  alternates: {
    canonical: "https://nguyenagency.online/services",
  },
  openGraph: {
    title: "Hệ Sinh Thái 24 Dịch Vụ Digital – NGUYÊN AGENCY",
    description:
      "Trọn bộ 24 dịch vụ truyền thông sáng tạo MEDIA và giải pháp công nghệ TECH cao cấp tại Quảng Ngãi & Toàn quốc.",
    url: "https://nguyenagency.online/services",
    siteName: "NGUYÊN AGENCY",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "24 Dịch Vụ Nguyên Agency",
      },
    ],
  },
};

export const revalidate = 60;

export default async function ServicesPage({
  searchParams,
}: {
  searchParams?: Promise<{ group?: string; q?: string }> | { group?: string; q?: string };
}) {
  const resolvedParams = searchParams ? await Promise.resolve(searchParams) : {};
  const activeGroup = resolvedParams?.group?.toUpperCase() || "ALL";
  const query = resolvedParams?.q?.toLowerCase().trim() || "";

  // Query database if available to get dynamic pricing or custom overrides
  let dbServices: any[] = [];
  try {
    dbServices = await prisma.service.findMany({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
      },
      include: {
        category: true,
      },
    });
  } catch (err) {
    console.warn("[ServicesPage] DB load fallback active:", err);
    dbServices = [];
  }

  // Merge official 24 services with any dynamic DB overrides (prices, overrides)
  const allServices = OFFICIAL_24_SERVICES.map((official) => {
    const dbMatch = dbServices.find(
      (s) => s.slug === official.slug || official.aliases?.includes(s.slug)
    );
    return {
      id: official.id,
      order: official.order,
      title: official.title,
      titleVn: official.titleVn,
      slug: official.slug,
      group: official.group,
      categoryName: official.categoryName,
      shortDesc: official.shortDesc,
      proposedItems: official.proposedItems,
      thumbnail: official.thumbnail || dbMatch?.thumbnail,
      priceLabel: dbMatch?.priceLabel || (official.group === "TECH" ? "Tư vấn & Báo giá" : "Báo giá theo gói"),
      startingPrice: dbMatch?.startingPrice || null,
      estimatedTime: dbMatch?.estimatedTime || (official.group === "TECH" ? "2 - 6 tuần" : "3 - 10 ngày"),
    };
  });

  // Filter by group and search query
  const filteredServices = allServices.filter((s) => {
    if (activeGroup !== "ALL" && s.group !== activeGroup) return false;
    if (query) {
      const matchTitle = s.title.toLowerCase().includes(query);
      const matchTitleVn = s.titleVn.toLowerCase().includes(query);
      const matchDesc = s.shortDesc.toLowerCase().includes(query);
      const matchKeyword = s.categoryName.toLowerCase().includes(query);
      if (!matchTitle && !matchTitleVn && !matchDesc && !matchKeyword) return false;
    }
    return true;
  });

  const totalMedia = allServices.filter((s) => s.group === "MEDIA").length;
  const totalTech = allServices.filter((s) => s.group === "TECH").length;
  const totalAll = allServices.length;

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-[#06070B] text-white relative overflow-hidden">
      {/* Ambient Lighting */}
      <div className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-[#00E5FF]/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-[550px] h-[550px] bg-[#FF2D95]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Hero Section */}
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D121D] border border-[#00E5FF]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              24 DỊCH VỤ TIÊU CHUẨN • QUẢNG NGÃI & TOÀN QUỐC
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[1.08]">
            HỆ SINH THÁI GIẢI PHÁP <br />
            <span className="bg-gradient-to-r from-[#00E5FF] via-[#00A3FF] to-[#FF2D95] bg-clip-text text-transparent">
              MEDIA & TECH CHUYÊN BIỆT.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#D4D4D8] leading-relaxed">
            Nguyên Agency cung cấp 24 dịch vụ chuẩn hóa từ truyền thông thị giác, xây dựng thương hiệu đến phát triển website, phần mềm quản lý và giải pháp AI tự động hóa cho doanh nghiệp.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="p-4 sm:p-6 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <Link
              href="/services"
              className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all whitespace-nowrap font-bold ${
                activeGroup === "ALL"
                  ? "bg-gradient-to-r from-[#00A3FF] to-[#FF2D95] text-white shadow-lg"
                  : "bg-[#121622] text-[#A1A1AA] hover:text-white border border-white/10"
              }`}
            >
              TẤT CẢ DỊCH VỤ ({totalAll})
            </Link>
            <Link
              href="/services?group=MEDIA"
              className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5 whitespace-nowrap font-bold ${
                activeGroup === "MEDIA"
                  ? "bg-[#FF2D95] text-white shadow-[0_0_20px_rgba(255,45,149,0.4)]"
                  : "bg-[#121622] text-[#A1A1AA] hover:text-white border border-white/10"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>MEDIA SÁNG TẠO ({totalMedia})</span>
            </Link>
            <Link
              href="/services?group=TECH"
              className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5 whitespace-nowrap font-bold ${
                activeGroup === "TECH"
                  ? "bg-[#00E5FF] text-black shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                  : "bg-[#121622] text-[#A1A1AA] hover:text-white border border-white/10"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>TECH CÔNG NGHỆ ({totalTech})</span>
            </Link>
          </div>

          <span className="text-xs font-mono text-[#71717A] shrink-0 font-semibold">
            Hiển thị {filteredServices.length} giải pháp tiêu chuẩn
          </span>
        </div>

        {/* Services Grid (All 16:9 aspect ratio thumbnails) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredServices.map((service, index) => {
            const isMedia = service.group === "MEDIA";
            const accentColor = isMedia ? "#FF2D95" : "#00E5FF";

            return (
              <div
                key={service.id}
                className="group p-7 sm:p-8 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] hover:border-white/25 transition-all duration-300 flex flex-col justify-between hover:-translate-y-2 hover:shadow-[0_24px_50px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden"
              >
                {/* Glow accent */}
                <div
                  className="absolute -right-20 -top-20 w-44 h-44 rounded-full opacity-0 group-hover:opacity-15 blur-3xl transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: accentColor }}
                />

                <div>
                  {/* Thumbnail 16:9 standard with lazy loading and optimized sizes */}
                  <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#121622] border border-white/10 mb-5">
                    <Image
                      src={service.thumbnail}
                      alt={service.title}
                      fill
                      priority={index < 6}
                      loading={index < 6 ? "eager" : "lazy"}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                      quality={85}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Top meta tags */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full border font-bold ${
                        isMedia
                          ? "bg-[#FF2D95]/10 text-[#FF2D95] border-[#FF2D95]/30"
                          : "bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30"
                      }`}
                    >
                      {isMedia ? "MEDIA SÁNG TẠO" : "TECH CÔNG NGHỆ"} • {service.categoryName}
                    </span>
                    <span className="text-[11px] font-mono text-[#D4D4D8] bg-[#121622] px-2.5 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#00E5FF]" />
                      {service.estimatedTime}
                    </span>
                  </div>

                  {/* Titles: English Name + Vietnamese Name */}
                  <Link href={`/services/${service.slug}`}>
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#00E5FF] transition-colors leading-snug">
                      {service.title}
                    </h3>
                  </Link>
                  <p className="text-xs font-mono text-[#00E5FF] mb-3 font-semibold">
                    {service.titleVn}
                  </p>

                  <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-6">
                    {service.shortDesc}
                  </p>

                  {/* Proposed Items Checklist */}
                  {service.proposedItems && service.proposedItems.length > 0 && (
                    <div className="space-y-2 mb-6 pt-5 border-t border-white/[0.08]">
                      <span className="text-[10px] font-mono uppercase text-[#71717A] block font-bold mb-2">
                        HẠNG MỤC ĐỀ XUẤT:
                      </span>
                      {service.proposedItems.slice(0, 4).map((item: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-[#E4E4E7]">
                          <CheckCircle2
                            className="w-3.5 h-3.5 shrink-0 mt-0.5"
                            style={{ color: accentColor }}
                          />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer with Price & Actions */}
                <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#71717A] block font-bold">
                      HÌNH THỨC TRIỂN KHAI
                    </span>
                    <span className="text-sm font-mono font-bold text-white">
                      {service.priceLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/services/${service.slug}`}
                      className="px-4 py-2 rounded-full bg-[#121622] border border-white/10 text-xs font-mono uppercase text-white hover:border-[#00E5FF] transition-colors font-bold"
                    >
                      Chi Tiết
                    </Link>
                    <Link
                      href={`/lien-he?service=${encodeURIComponent(service.title)}`}
                      className="p-2 rounded-full bg-gradient-to-r from-[#00A3FF] to-[#FF2D95] text-white hover:scale-105 transition-transform"
                      title="Nhận tư vấn ngay"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enterprise Service Guarantee Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0B0D14]/90 border border-white/[0.08] backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex items-start gap-3.5">
              <ShieldCheck className="w-6 h-6 text-[#00E5FF] shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">100% Bản Quyền Tài Sản & Mã Nguồn</h4>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Bàn giao đầy đủ file thiết kế gốc (Figma/Vector) và toàn bộ mã nguồn sạch, không giữ bản quyền ràng buộc.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Zap className="w-6 h-6 text-[#FF2D95] shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Cam Kết Hiệu Năng & Tiến Độ</h4>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Quy trình làm việc minh bạch, đúng tiến độ theo hợp đồng và cam kết tiêu chuẩn kỹ thuật tối ưu.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Sparkles className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Hỗ Trợ Đồng Hành Dài Hạn</h4>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Hỗ trợ kỹ thuật chu đáo, tư vấn chiến lược nâng cấp và bảo hành hệ thống linh hoạt cho doanh nghiệp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
