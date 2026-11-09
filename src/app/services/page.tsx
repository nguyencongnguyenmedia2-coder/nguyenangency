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
  DollarSign,
  ShieldCheck,
  Search,
} from "lucide-react";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Hệ Sinh Thái Dịch Vụ – NGUYÊN AGENCY | Media & Tech Solutions",
  description:
    "Trọn bộ dịch vụ truyền thông sáng tạo MEDIA và giải pháp phần mềm công nghệ cao TECH đạt chuẩn quốc tế.",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string; q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const activeGroup = resolvedParams?.group?.toUpperCase() || "ALL";
  const query = resolvedParams?.q?.toLowerCase() || "";

  const [services, totalMedia, totalTech] = await Promise.all([
    prisma.service.findMany({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
        ...(activeGroup === "MEDIA" || activeGroup === "TECH"
          ? { group: activeGroup }
          : {}),
        ...(query
          ? {
              OR: [
                { title: { contains: query } },
                { shortDesc: { contains: query } },
              ],
            }
          : {}),
      },
      include: {
        category: true,
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    }),
    prisma.service.count({
      where: { status: "PUBLISHED", deletedAt: null, group: "MEDIA" },
    }),
    prisma.service.count({
      where: { status: "PUBLISHED", deletedAt: null, group: "TECH" },
    }),
  ]);
  const totalAll = totalMedia + totalTech;

  return (
    <div className="pt-32 pb-24 px-6 bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#171717] border border-[#292929]">
            <Sparkles className="w-3.5 h-3.5 text-[#007BA7]" />
            <span className="text-xs font-mono tracking-widest text-white uppercase">
              24 COMPREHENSIVE SOLUTIONS
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-tight">
            HỆ SINH THÁI GIẢI PHÁP <br />
            <span className="text-gradient-brand">MEDIA & TECH CHUYÊN BIỆT.</span>
          </h1>

          <p className="text-base md:text-lg text-[#A1A1AA] leading-relaxed">
            Chúng tôi cung cấp 24 giải pháp toàn diện từ truyền thông thương hiệu độc bản đến kiến trúc phần mềm tốc độ cao, được may đo hoàn hảo cho từng mục tiêu kinh doanh.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="p-6 rounded-3xl bg-[#121212] border border-[#292929] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <Link
              href="/services"
              className={`px-5 py-2.5 rounded-xl text-xs font-mono tracking-wider uppercase transition-all whitespace-nowrap ${
                activeGroup === "ALL"
                  ? "bg-white text-black font-bold shadow-lg"
                  : "bg-[#171717] text-[#A1A1AA] hover:text-white border border-[#292929]"
              }`}
            >
              TẤT CẢ ({totalAll})
            </Link>
            <Link
              href="/services?group=MEDIA"
              className={`px-5 py-2.5 rounded-xl text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeGroup === "MEDIA"
                  ? "bg-[#FF2D95] text-white font-bold shadow-glow-pink"
                  : "bg-[#171717] text-[#A1A1AA] hover:text-white border border-[#292929]"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>MEDIA SÁNG TẠO ({totalMedia})</span>
            </Link>
            <Link
              href="/services?group=TECH"
              className={`px-5 py-2.5 rounded-xl text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeGroup === "TECH"
                  ? "bg-[#007BA7] text-white font-bold shadow-glow-blue"
                  : "bg-[#171717] text-[#A1A1AA] hover:text-white border border-[#292929]"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>TECH CÔNG NGHỆ ({totalTech})</span>
            </Link>
          </div>

          <span className="text-xs font-mono text-[#71717A] shrink-0">
            Hiển thị {services.length} dịch vụ
          </span>
        </div>

        {/* Services Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => {
            let benefits: string[] = [];
            try {
              benefits = JSON.parse(service.benefitsJson || "[]");
            } catch (e) {
              benefits = [];
            }

            return (
              <div
                key={service.id}
                className="group p-8 rounded-3xl bg-[#121212] border border-[#292929] hover:border-[#007BA7]/60 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-card-depth relative overflow-hidden"
              >
                {/* Glow accent */}
                <div
                  className="absolute -right-20 -top-20 w-44 h-44 rounded-full opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500 pointer-events-none"
                  style={{
                    backgroundColor: service.group === "MEDIA" ? "#FF2D95" : "#007BA7",
                  }}
                />

                <div>
                  {service.thumbnail && (
                    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#171717] border border-[#292929] mb-5">
                      <Image
                        src={service.thumbnail}
                        alt={service.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-6">
                    <span
                      className={`text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full border ${
                        service.group === "MEDIA"
                          ? "bg-[#FF2D95]/10 border-[#FF2D95]/30 text-[#FF2D95]"
                          : "bg-[#007BA7]/10 border-[#007BA7]/30 text-[#007BA7]"
                      }`}
                    >
                      {service.group} • {service.category?.name || "Premium"}
                    </span>
                    <span className="text-xs font-mono text-[#71717A]">
                      #{String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-white transition-colors leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-xs text-[#A1A1AA] leading-relaxed mb-6 line-clamp-3">
                    {service.shortDesc}
                  </p>

                  {/* Highlights Bullet points */}
                  {benefits.length > 0 && (
                    <div className="space-y-2 mb-6 pt-4 border-t border-[#292929]">
                      {benefits.slice(0, 3).map((b, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                          <CheckCircle2
                            className="w-3.5 h-3.5 shrink-0"
                            style={{
                              color: service.group === "MEDIA" ? "#FF2D95" : "#007BA7",
                            }}
                          />
                          <span className="line-clamp-1">{b}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-[#292929] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#71717A] block uppercase">
                      Thời gian & Giá
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-mono text-white font-semibold">
                        {service.priceLabel || "Liên hệ báo giá"}
                      </span>
                      <span className="text-[10px] font-mono text-[#71717A]">
                        ({service.estimatedTime})
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/services/${service.slug}`}
                    className="p-3 rounded-xl bg-[#171717] group-hover:bg-[#007BA7] text-[#A1A1AA] group-hover:text-white transition-all shadow-sm"
                    title={`Xem chi tiết ${service.title}`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantees Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 rounded-3xl bg-[#121212] border border-[#292929]">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#007BA7]/10 text-[#007BA7] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-white text-xs block uppercase font-mono mb-1">
                BẢN QUYỀN TRỌN ĐỜI
              </strong>
              <p className="text-[11px] text-[#71717A] leading-relaxed">
                Bàn giao 100% mã nguồn, file gốc thiết kế và quyền sở hữu trí tuệ tuyệt đối.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#FF2D95]/10 text-[#FF2D95] shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-white text-xs block uppercase font-mono mb-1">
                CHUẨN HIỆU NĂNG 60 FPS
              </strong>
              <p className="text-[11px] text-[#71717A] leading-relaxed">
                Tối ưu hóa GPU, shader WebGL và tải trang siêu tốc dưới 1.2 giây trên mọi thiết bị.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#007BA7]/10 text-[#007BA7] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-white text-xs block uppercase font-mono mb-1">
                CAM KẾT ĐÚNG HẠN
              </strong>
              <p className="text-[11px] text-[#71717A] leading-relaxed">
                Quy trình phân đoạn sprint chặt chẽ, cập nhật tiến độ minh bạch qua Client Portal.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950/40 text-emerald-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-white text-xs block uppercase font-mono mb-1">
                BẢO HÀNH 12 THÁNG
              </strong>
              <p className="text-[11px] text-[#71717A] leading-relaxed">
                Hỗ trợ kỹ thuật 24/7, vá lỗi miễn phí và nâng cấp hệ thống định kỳ trọn năm đầu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
