import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Sparkles, Trophy, CheckCircle2 } from "lucide-react";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Portfolio & Case Studies – NGUYÊN AGENCY | Selected Works",
  description:
    "Bộ sưu tập các dự án kỹ thuật số, nhận diện thương hiệu độc bản và ứng dụng Web 3D tiêu biểu do NGUYÊN AGENCY thực hiện.",
};

export const dynamic = "force-dynamic";

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }> | { category?: string };
}) {
  const resolvedParams = searchParams ? await Promise.resolve(searchParams) : {};
  const activeCategory = resolvedParams?.category || "ALL";

  let categories: any[] = [];
  let portfolios: any[] = [];

  try {
    const results = await Promise.all([
      prisma.portfolioCategory.findMany({
        orderBy: { order: "asc" },
      }),
      prisma.portfolio.findMany({
        where: {
          status: "PUBLISHED",
          deletedAt: null,
          ...(activeCategory !== "ALL"
            ? { category: { slug: activeCategory } }
            : {}),
        },
        include: { category: true },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      }),
    ]);
    categories = results[0] || [];
    portfolios = results[1] || [];
  } catch (err) {
    console.warn("[PortfolioPage] DB fetch fallback active:", err);
  }

  return (
    <div className="pt-32 pb-24 px-6 bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#171717] border border-[#292929]">
            <Trophy className="w-3.5 h-3.5 text-[#FF2D95]" />
            <span className="text-xs font-mono tracking-widest text-white uppercase">
              PROVEN DIGITAL IMPACT
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-tight">
            SELECTED WORKS & <br />
            <span className="text-gradient-brand">CASE STUDIES TIÊU BIỂU.</span>
          </h1>

          <p className="text-base md:text-lg text-[#A1A1AA] leading-relaxed">
            Mỗi case study là một công trình kết hợp giữa nghệ thuật thị giác đương đại và năng lực kỹ thuật đỉnh cao, mang lại kết quả tăng trưởng đo lường được cho các đối tác chiến lược.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-[#292929]">
          <Link
            href="/portfolio"
            className={`px-5 py-2.5 rounded-xl text-xs font-mono tracking-wider uppercase transition-all whitespace-nowrap ${
              activeCategory === "ALL"
                ? "bg-white text-black font-bold shadow-lg"
                : "bg-[#121212] text-[#A1A1AA] hover:text-white border border-[#292929]"
            }`}
          >
            TẤT CẢ DỰ ÁN
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/portfolio?category=${cat.slug}`}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono tracking-wider uppercase transition-all whitespace-nowrap ${
                activeCategory === cat.slug
                  ? "bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-bold shadow-glow-pink"
                  : "bg-[#121212] text-[#A1A1AA] hover:text-white border border-[#292929]"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolios.map((item) => {
            let techStack: string[] = [];
            let results: string[] = [];
            try {
              techStack = JSON.parse(item.technologiesJson || "[]");
              results = JSON.parse(item.resultsJson || "[]");
            } catch (e) {
              // fallback
            }

            return (
              <div
                key={item.id}
                className="group rounded-3xl bg-[#121212] border border-[#292929] hover:border-[#007BA7]/60 overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-card-depth"
              >
                {/* Visual Thumbnail */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#171717]">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-80" />

                  {/* Badges Overlay */}
                  <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                    <span className="px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase bg-[#0A0A0A]/85 backdrop-blur-md text-white border border-[#292929]">
                      {item.category?.name || "Digital Experience"}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold text-white bg-[#0A0A0A]/85 backdrop-blur-md border border-[#292929]">
                      {item.year}
                    </span>
                  </div>

                  {/* Impact Metric Floating Tag */}
                  {results.length > 0 && (
                    <div className="absolute bottom-5 left-5">
                      <span className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#FF2D95]/90 text-white shadow-lg backdrop-blur-md flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{results[0]}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-1 justify-between space-y-6">
                  <div>
                    <span className="text-xs font-mono text-[#007BA7] tracking-wider uppercase block mb-1">
                      Khách hàng: {item.clientName}
                    </span>
                    <h3 className="text-2xl font-black text-white group-hover:text-white transition-colors leading-snug mb-3">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#A1A1AA] leading-relaxed line-clamp-3">
                      {item.shortDesc}
                    </p>

                    {/* Tech Badges */}
                    {techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#292929]">
                        {techStack.slice(0, 4).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-[#171717] text-[#A1A1AA] border border-[#292929]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#292929] flex items-center justify-between">
                    <Link
                      href={`/portfolio/${item.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-white group-hover:text-[#007BA7] transition-colors"
                    >
                      <span>Khám Phá Case Study</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>

                    {item.liveUrl && (
                      <a
                        href={item.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-[#171717] hover:bg-[#202020] text-[#71717A] hover:text-white transition-colors"
                        title="Trải nghiệm trang web thực tế"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-r from-[#171717] to-[#121212] border border-[#292929] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black uppercase text-white mb-2">
              Bạn có bài toán kỹ thuật số tương tự?
            </h3>
            <p className="text-xs text-[#A1A1AA] max-w-xl">
              Cùng chuyên gia của NGUYÊN AGENCY đánh giá bối cảnh và lên kế hoạch thực thi dự án đột phá tiếp theo cho doanh nghiệp bạn.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-mono text-xs font-bold uppercase tracking-wider hover:shadow-glow-pink transition-all shrink-0"
          >
            Nhận Tư Vấn Dự Án
          </Link>
        </div>
      </div>
    </div>
  );
}
