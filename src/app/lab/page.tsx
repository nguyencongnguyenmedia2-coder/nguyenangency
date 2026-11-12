import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Sparkles,
  Terminal,
  Cpu,
  Layers,
  FlaskConical,
  ExternalLink,
  CheckCircle2,
  GitBranch,
  ShieldAlert,
  Zap,
  Bot,
  Activity,
  ArrowRight,
} from "lucide-react";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Digital LAB – NGUYÊN AGENCY | AI & SaaS R&D Engine",
  description:
    "Phòng nghiên cứu & phát triển (R&D) các giải pháp Generative AI, công cụ 3D Web tương tác và nền tảng SaaS độc quyền của NGUYÊN AGENCY.",
};

export const revalidate = 60;

interface LabProductItem {
  id: string;
  slug: string;
  name: string;
  thumbnail: string;
  tagline: string;
  description: string;
  productStage: string;
  version: string;
  category?: { name: string; slug: string } | null;
  featuresJson?: string;
  techStackJson?: string;
  demoUrl?: string | null;
  docsUrl?: string | null;
  pricingModel?: string | null;
}

const FALLBACK_LAB_PRODUCTS: LabProductItem[] = [
  {
    id: "lab-1",
    slug: "nguyen-ai-agent-engine",
    name: "NGUYÊN AI Agent Engine",
    tagline: "Hệ thống đa tác tử AI tự động hóa quy trình nghiệp vụ & CSKH",
    description: "Bộ khung kiến trúc Agentic AI kết nối LLM (Gemini, Claude, GPT-4o) với dữ liệu doanh nghiệp thông qua RAG vector database, cho phép tự động phản hồi khách hàng, phân loại lead và tạo báo giá trong 3 giây.",
    productStage: "LIVE",
    version: "v2.5.0",
    category: { name: "Generative AI", slug: "ai" },
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    featuresJson: JSON.stringify([
      "Tích hợp đa kênh: Telegram Bot, Zalo OA, Web Widget",
      "RAG Vector Database truy xuất tri thức nội bộ chuẩn xác",
      "Khả năng tự gọi Tool & API để cập nhật đơn hàng, booking",
      "Bảng điều khiển giám sát phản hồi & chi phí token thời gian thực",
    ]),
    techStackJson: JSON.stringify(["FastAPI", "Python", "LangChain", "Qdrant", "Next.js", "Docker"]),
    demoUrl: "https://t.me/nguyenangency_bot",
    docsUrl: "/contact?service=ai-agent",
    pricingModel: "Enterprise License / Cloud Managed",
  },
  {
    id: "lab-2",
    slug: "threejs-pbr-configurator-core",
    name: "Hyper3D – WebGL Realtime Engine",
    tagline: "Engine kết xuất 3D PBR thời gian thực 60 FPS trên mọi trình duyệt",
    description: "Bộ công cụ độc quyền của NGUYÊN LAB cho phép import mô hình CAD/glTF và hiển thị vật liệu chuẩn điện ảnh trực tiếp trên trình duyệt mà không cần cài đặt plugin. Tối ưu nén texture và GPU shader.",
    productStage: "LIVE",
    version: "v3.1.2",
    category: { name: "3D Web & WebGL", slug: "3d" },
    thumbnail: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
    featuresJson: JSON.stringify([
      "Hỗ trợ PBR Materials: Carbon, nhôm xước, sơn nhũ kim cương",
      "Post-processing pipeline: Bloom, Ambient Occlusion, SSR",
      "Tải nhanh siêu tốc: Nén DRACO & KTX2 Texture tối ưu dung lượng < 5MB",
      "Tương thích hoàn hảo trên iPhone Safari & Android Chrome",
    ]),
    techStackJson: JSON.stringify(["Three.js", "GLSL", "WebAudio", "TypeScript", "Vite"]),
    demoUrl: "/portfolio",
    docsUrl: "/contact?service=3d-web",
    pricingModel: "Per-Project Integration / Custom Core",
  },
  {
    id: "lab-3",
    slug: "omni-commerce-saas-platform",
    name: "OmniHub – Headless Commerce Core",
    tagline: "Nền tảng thương mại điện tử Headless hiệu năng cao cho nhãn hàng",
    description: "Kiến trúc thương mại điện tử phi máy chủ tách rời Frontend và Backend, hỗ trợ hàng triệu lượt truy cập đồng thời trong chiến dịch Mega Sale với độ trễ phản hồi trang < 100ms.",
    productStage: "BETA",
    version: "v1.4.0-rc3",
    category: { name: "SaaS Infrastructure", slug: "saas" },
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    featuresJson: JSON.stringify([
      "Tích hợp sẵn cổng VietQR Pro, VNPay, Momo & Stripe",
      "Đồng bộ kho hàng đa kênh và in hóa đơn tự động",
      "Tốc độ tải trang siêu tốc đạt điểm Core Web Vitals tuyệt đối",
      "Quản lý affiliate marketing và chương trình khách hàng thân thiết",
    ]),
    techStackJson: JSON.stringify(["Next.js 15", "Supabase", "Prisma", "Redis", "Cloudflare Workers"]),
    demoUrl: "https://example.com/omnihub",
    docsUrl: "/contact?service=saas",
    pricingModel: "SaaS Subscription / Self-Hosted",
  },
  {
    id: "lab-4",
    slug: "sentinel-telemetry-crm",
    name: "Sentinel Telemetry & Telegram Ops",
    tagline: "Bộ điều khiển CRM & vận hành tự động qua Telegram Bot",
    description: "Giải pháp quản trị toàn diện: tự động phân luồng tin nhắn khách hàng, xuất báo giá PDF có chữ ký số, thông báo thanh toán và quản lý lịch biểu đội nhóm ngay trên ứng dụng Telegram.",
    productStage: "DEVELOPING",
    version: "v0.9.0-alpha",
    category: { name: "Workflow Automation", slug: "automation" },
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    featuresJson: JSON.stringify([
      "Bắn tin tức thời khi có booking mới kèm đầy đủ thông tin",
      "Tra cứu tiến độ và thanh toán thông qua Telegram Bot",
      "Hệ thống phân quyền Role-based Access Control bảo mật cao",
      "Xuất báo cáo tài chính và hợp đồng tự động",
    ]),
    techStackJson: JSON.stringify(["Node.js", "Grammy.js", "PostgreSQL", "TailwindCSS", "Prisma"]),
    demoUrl: "https://t.me/nguyenangency_bot",
    docsUrl: "/contact?service=telegram-crm",
    pricingModel: "Included with Agency Retainer",
  },
];

export default async function LabPage({
  searchParams,
}: {
  searchParams?: Promise<{ stage?: string }> | { stage?: string };
}) {
  const resolvedParams = searchParams ? await Promise.resolve(searchParams) : {};
  const activeStage = resolvedParams?.stage || "ALL";

  let dbProducts: any[] = [];
  try {
    dbProducts = await prisma.labProduct.findMany({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
        ...(activeStage !== "ALL" ? { productStage: activeStage } : {}),
      },
      include: { category: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  } catch (err) {
    console.warn("[LabPage] DB fetch fallback active:", err);
  }

  let products = dbProducts.length > 0 ? dbProducts : FALLBACK_LAB_PRODUCTS;
  if (activeStage !== "ALL") {
    products = products.filter((p) => p.productStage === activeStage);
    if (products.length === 0) {
      products = FALLBACK_LAB_PRODUCTS.filter((p) => p.productStage === activeStage);
    }
  }

  return (
    <div className="pt-32 pb-24 px-6 bg-[#06070B] text-white relative min-h-screen">
      {/* Background Matrix Grid */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-r from-[#FF2D95]/10 via-[#00E5FF]/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* Terminal Header */}
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md">
              <FlaskConical className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span className="text-[11px] font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
                R&D ENGINE • EXPERIMENTAL LAB
              </span>
            </div>

            {/* Pink Badge AI & SaaS */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-[#FF2D95]/15 text-[#FF2D95] border border-[#FF2D95]/35 shadow-[0_0_15px_rgba(255,45,149,0.3)]">
              <Bot className="w-3.5 h-3.5" />
              AI & SaaS
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[1.08]">
            DIGITAL LAB & <br />
            <span className="bg-gradient-to-r from-[#00E5FF] via-[#FF2D95] to-[#A855F7] bg-clip-text text-transparent">
              PROPRIETARY SAAS TOOLS.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            Trung tâm thử nghiệm công nghệ của NGUYÊN AGENCY. Nơi chúng tôi tự nghiên cứu, kiểm thử và thương mại hóa các công cụ Generative AI, engine 3D WebGL và kiến trúc SaaS tối ưu vận hành số cho doanh nghiệp.
          </p>
        </div>

        {/* Live Lab Telemetry Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl">
          <div className="space-y-1 p-3">
            <div className="text-xs font-mono text-[#00E5FF] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              PRODUCTION STATUS
            </div>
            <div className="text-2xl font-black text-white font-mono">100% OPERATIONAL</div>
            <div className="text-[11px] text-white/40">Zero Downtime Cluster</div>
          </div>
          <div className="space-y-1 p-3 border-l border-white/[0.06]">
            <div className="text-xs font-mono text-[#FF2D95] flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" />
              AI INFERENCE SPEED
            </div>
            <div className="text-2xl font-black text-white font-mono">&lt; 350ms</div>
            <div className="text-[11px] text-white/40">Edge RAG Acceleration</div>
          </div>
          <div className="space-y-1 p-3 border-l border-white/[0.06]">
            <div className="text-xs font-mono text-[#A855F7] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              GPU 3D PIPELINE
            </div>
            <div className="text-2xl font-black text-white font-mono">60 FPS WEBGL</div>
            <div className="text-[11px] text-white/40">PBR Shaders Enabled</div>
          </div>
          <div className="space-y-1 p-3 border-l border-white/[0.06]">
            <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" />
              OPEN ARCHITECTURE
            </div>
            <div className="text-2xl font-black text-white font-mono">100% API-FIRST</div>
            <div className="text-[11px] text-white/40">Webhook & SDK Ready</div>
          </div>
        </div>

        {/* Stage Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-white/[0.08] no-scrollbar">
          <Link
            href="/lab"
            className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all whitespace-nowrap ${
              activeStage === "ALL"
                ? "bg-white text-black font-black shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                : "bg-white/[0.03] text-[#94A3B8] hover:text-white hover:bg-white/[0.06] border border-white/[0.08]"
            }`}
          >
            TẤT CẢ SẢN PHẨM ({products.length})
          </Link>
          <Link
            href="/lab?stage=LIVE"
            className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-2 whitespace-nowrap ${
              activeStage === "LIVE"
                ? "bg-emerald-500 text-black font-black shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                : "bg-white/[0.03] text-[#94A3B8] hover:text-white hover:bg-white/[0.06] border border-white/[0.08]"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE (THƯƠNG MẠI)</span>
          </Link>
          <Link
            href="/lab?stage=BETA"
            className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeStage === "BETA"
                ? "bg-[#00E5FF] text-black font-black shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                : "bg-white/[0.03] text-[#94A3B8] hover:text-white hover:bg-white/[0.06] border border-white/[0.08]"
            }`}
          >
            <span>PUBLIC BETA</span>
          </Link>
          <Link
            href="/lab?stage=DEVELOPING"
            className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeStage === "DEVELOPING"
                ? "bg-[#FF2D95] text-white font-black shadow-[0_0_20px_rgba(255,45,149,0.4)]"
                : "bg-white/[0.03] text-[#94A3B8] hover:text-white hover:bg-white/[0.06] border border-white/[0.08]"
            }`}
          >
            <span>IN DEVELOPMENT</span>
          </Link>
        </div>

        {/* Dynamic Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {products.map((prod) => {
            let features: string[] = [];
            let techStack: string[] = [];
            try {
              features = JSON.parse(prod.featuresJson || "[]");
              techStack = JSON.parse(prod.techStackJson || "[]");
            } catch (e) {
              // fallback
            }

            return (
              <div
                key={prod.id}
                className="group rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] hover:border-[#FF2D95]/50 overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(255,45,149,0.15)] backdrop-blur-xl relative"
              >
                {/* Visual Header */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/60">
                  <Image
                    src={prod.thumbnail}
                    alt={prod.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F17] via-transparent to-transparent opacity-90" />

                  {/* Badges Overlay */}
                  <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest uppercase bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white border border-white/[0.1]">
                      {prod.category?.name || "LAB Product"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-white/[0.08] backdrop-blur-md px-3 py-1.5 rounded-full text-white border border-white/[0.1]">
                        {prod.version}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-3 py-1.5 rounded-full font-bold uppercase ${
                          prod.productStage === "LIVE"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            : prod.productStage === "BETA"
                            ? "bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40"
                            : "bg-[#FF2D95]/20 text-[#FF2D95] border border-[#FF2D95]/40"
                        }`}
                      >
                        {prod.productStage}
                      </span>
                    </div>
                  </div>

                  {/* Tagline Pill */}
                  <div className="absolute bottom-4 left-5 right-5">
                    <div className="px-4 py-2 rounded-xl bg-black/75 backdrop-blur-md border border-white/[0.08] text-xs font-mono text-[#00E5FF]">
                      &gt; {prod.tagline}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-7 sm:p-8 flex flex-col flex-1 justify-between space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-white group-hover:text-[#FF2D95] transition-colors mb-3">
                      {prod.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-6">
                      {prod.description}
                    </p>

                    {/* Features List */}
                    {features.length > 0 && (
                      <div className="space-y-2.5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] mb-6">
                        <div className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
                          TÍNH NĂNG ĐỘC QUYỀN
                        </div>
                        {features.map((feat, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs text-[#E2E8F0]">
                            <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                            <span className="leading-snug">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tech Badges */}
                    {techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.06]">
                        {techStack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-white/[0.04] text-[#94A3B8] border border-white/[0.08]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions & Pricing Model */}
                  <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="text-xs font-mono text-white/60">
                      Mô hình: <span className="text-white font-bold">{prod.pricingModel || "Enterprise Integration"}</span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {prod.demoUrl && (
                        <a
                          href={prod.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-xs font-mono text-white transition-colors border border-white/[0.1]"
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <Link
                        href={`/contact?service=${encodeURIComponent(prod.name)}`}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#FF2D95] text-black font-mono text-xs font-black uppercase tracking-wider hover:shadow-[0_0_20px_rgba(255,45,149,0.4)] transition-all"
                      >
                        <span>Tích Hợp</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enterprise R&D Integration Banner */}
        <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-r from-purple-900/20 via-[#00E5FF]/10 to-[#FF2D95]/20 border border-white/[0.12] flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-mono tracking-widest text-[#FF2D95] uppercase font-bold">
              CUSTOM LAB ENGAGEMENT
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white">
              CẦN XÂY DỰNG MÔ HÌNH AI HOẶC SAAS RIÊNG CHO DOANH NGHIỆP?
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8]">
              Đội ngũ nghiên cứu của NGUYÊN LAB sẵn sàng hợp tác may đo riêng hạ tầng AI, hệ thống tự động hóa và các ứng dụng web đặc thù cho tổ chức của bạn.
            </p>
          </div>
          <Link
            href="/contact?service=custom-lab"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-black font-mono text-xs font-black uppercase tracking-wider hover:bg-slate-200 transition-all shrink-0 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.4)]"
          >
            <span>Liên Hệ Đặt Hàng LAB</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
