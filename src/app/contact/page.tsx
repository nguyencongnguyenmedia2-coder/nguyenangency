"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { submitContactForm } from "@/app/actions/contact";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ShieldCheck,
  Calendar,
  Clock,
  ArrowRight,
  MessageSquare,
  Lock,
} from "lucide-react";

const FALLBACK_SERVICES = [
  "3D Website Development",
  "Brand Identity & Creative Visual",
  "Web Application & SaaS",
  "Mobile Application",
  "AI Tools & Generative Lab",
  "ERP / Custom CRM Platform",
];

function ContactContent() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") || searchParams.get("package") || FALLBACK_SERVICES[0];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceOptions, setServiceOptions] = useState<string[]>(FALLBACK_SERVICES);
  const [selectedService, setSelectedService] = useState(initialService);
  const [selectedBudget, setSelectedBudget] = useState("30M - 80M VNĐ");

  const [responseState, setResponseState] = useState<{
    success?: boolean;
    message?: string;
    code?: string;
    error?: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok && Array.isArray(data.services) && data.services.length > 0) {
          const titles = data.services.map((s: { title: string }) => s.title);
          setServiceOptions(titles);
          const svc = searchParams.get("service") || searchParams.get("package");
          if (!svc) {
            setSelectedService(titles[0]);
          }
        }
      })
      .catch(() => {
        // Fallback to default options silently
      });
  }, [searchParams]);

  const budgetOptions = [
    "15M - 35M VNĐ",
    "35M - 70M VNĐ",
    "70M - 150M VNĐ",
    "150M - 300M VNĐ",
    "> 300M VNĐ (Enterprise)",
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseState(null);

    const formData = new FormData(e.currentTarget);
    formData.set("serviceType", selectedService);
    formData.set("budget", selectedBudget);
    formData.set("pageSource", "/contact");

    const result = await submitContactForm(formData);
    setIsSubmitting(false);
    setResponseState(result);
  }

  const botUsername =
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "nguyenangency_bot";

  return (
    <div className="pt-32 pb-24 px-6 bg-[#06070B] text-white relative min-h-screen">
      {/* Background Gradients */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-r from-[#00E5FF]/10 via-[#FF2D95]/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Header */}
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="text-[11px] font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              INITIATE COLLABORATION • UNIFIED BOOKING ENGINE
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[1.08]">
            KHỞI ĐỘNG DỰ ÁN & <br />
            <span className="bg-gradient-to-r from-[#00E5FF] via-[#FF2D95] to-[#A855F7] bg-clip-text text-transparent">
              ĐẶT DỊCH VỤ CHUYÊN GIA.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            Mọi yêu cầu đặt dịch vụ từ Website và Telegram Bot được đồng bộ thời gian thực vào CRM và thông báo tức thì tới Giám đốc Dự án của NGUYÊN AGENCY. Phản hồi trong 15 phút.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Info + Telegram Fast Track */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Telegram Bot Direct Fast Track Card */}
              <div className="p-7 rounded-3xl bg-gradient-to-br from-[#00E5FF]/15 via-[#0D0F17] to-[#FF2D95]/10 border border-[#00E5FF]/40 space-y-4 shadow-[0_10px_30px_rgba(0,229,255,0.1)] backdrop-blur-xl">
                <div className="flex items-center gap-2.5 text-[#00E5FF]">
                  <Send className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-mono uppercase tracking-wider font-black">
                    ĐẶT DỊCH VỤ NHANH QUA TELEGRAM BOT (24/7)
                  </span>
                </div>
                <p className="text-xs text-[#E2E8F0] leading-relaxed">
                  Trải nghiệm trợ lý đặt dịch vụ tự động, nhận mã theo dõi{" "}
                  <code className="text-[#00E5FF] font-mono font-bold">#NA-YYYYMMDD-XXX</code> và tra cứu tiến độ thực thi dự án tức thì bằng lệnh{" "}
                  <code className="text-[#FF2D95] font-mono font-bold">/mybookings</code>.
                </p>
                <a
                  href={`https://t.me/${botUsername}?start=contact`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#007BA7] hover:brightness-110 text-black text-xs font-mono font-black uppercase tracking-wider transition-all shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Mở Telegram Bot Ngay</span>
                </a>
              </div>

              {/* Office Locations */}
              <div className="p-6 rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] space-y-3 backdrop-blur-xl">
                <div className="flex items-center gap-3 text-[#00E5FF]">
                  <MapPin className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-mono uppercase tracking-wider font-bold">
                    VĂN PHÒNG & EXECUTIVE STUDIO
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-white font-bold block text-sm">TP. Quảng Ngãi</span>
                    <span className="text-[#94A3B8]">Trụ sở sáng tạo & Studio sản xuất hình ảnh</span>
                  </div>
                  <div className="pt-2 border-t border-white/[0.06]">
                    <span className="text-white font-bold block text-sm">TP. Hồ Chí Minh</span>
                    <span className="text-[#94A3B8]">Văn phòng đại diện & Tiếp đón đối tác doanh nghiệp</span>
                  </div>
                </div>
              </div>

              {/* Direct Communication Channels */}
              <div className="p-6 rounded-3xl bg-[#0D0F17]/80 border border-white/[0.08] space-y-4 backdrop-blur-xl">
                <div className="flex items-center gap-3 text-[#FF2D95]">
                  <Phone className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-mono uppercase tracking-wider font-bold">
                    HOTLINE TƯ VẤN TRỰC TIẾP 24/7
                  </span>
                </div>
                <div>
                  <a
                    href="tel:+84344979307"
                    className="text-2xl font-black text-white hover:text-[#00E5FF] transition-colors block font-mono"
                  >
                    +84 344 979 307
                  </a>
                  <a
                    href="mailto:contact@nguyenagency.vn"
                    className="text-xs font-mono text-[#94A3B8] hover:text-[#FF2D95] transition-colors block mt-1"
                  >
                    contact@nguyenagency.vn
                  </a>
                </div>

                {/* Direct Zalo & Facebook fast connects */}
                <div className="flex items-center gap-2 pt-2">
                  <a
                    href="https://zalo.me/0344979307"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 px-3 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:border-blue-400 text-blue-400 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Zalo Official</span>
                  </a>
                  <a
                    href="https://www.facebook.com/nguyenagency07"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook Fanpage chính thức của Nguyên Agency"
                    className="flex-1 px-3 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 hover:border-indigo-400 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Facebook Fanpage</span>
                  </a>
                </div>
              </div>
            </div>

            {/* SLA Commitment */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-3 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-white">
                <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
                <span className="text-xs font-mono font-bold uppercase">
                  CAM KẾT DỊCH VỤ (SLA) & BẢO MẬT
                </span>
              </div>
              <ul className="text-xs text-[#94A3B8] space-y-2 list-disc pl-4">
                <li>Phản hồi chính thức qua điện thoại/Zalo trong vòng 15 phút.</li>
                <li>Lập Scope of Work chi tiết & Báo giá không chi phí ẩn trong 24h.</li>
                <li>Ký kết văn bản bảo mật thông tin (NDA) trước khi trao đổi nghiệp vụ sâu.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Interactive Booking & Brief Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-12 rounded-3xl bg-[#0D0F17]/90 border border-white/[0.1] relative backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
              {responseState?.success ? (
                <div className="py-12 text-center space-y-6 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                    ĐẶT DỊCH VỤ THÀNH CÔNG!
                  </h3>
                  <p className="text-sm text-[#94A3B8] max-w-md mx-auto leading-relaxed">
                    {responseState.message}
                  </p>
                  <div className="p-5 rounded-2xl bg-black/60 border border-[#00E5FF]/40 max-w-xs mx-auto">
                    <span className="text-[10px] font-mono text-white/50 uppercase block mb-1">
                      MÃ ĐẶT DỊCH VỤ (BOOKING CODE)
                    </span>
                    <strong className="text-xl font-mono text-[#00E5FF]">
                      {responseState.code}
                    </strong>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setResponseState(null)}
                      className="px-6 py-2.5 rounded-full text-xs font-mono text-white/70 hover:text-white border border-white/[0.1] hover:bg-white/[0.05] transition-colors"
                    >
                      Gửi thêm yêu cầu khác
                    </button>
                    <a
                      href={`https://t.me/${botUsername}?start=${responseState.code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 rounded-full text-xs font-mono font-bold bg-[#00E5FF] text-black hover:brightness-110 transition-all flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Tra cứu tiến độ trên Bot</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Anti-spam Honeypot */}
                  <input
                    type="text"
                    name="websiteHoneypot"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                  />

                  {responseState?.error && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{responseState.error}</span>
                    </div>
                  )}

                  {/* 1. Service Selection */}
                  <div className="space-y-3">
                    <label className="block text-[11px] font-mono uppercase text-white/60 tracking-wider">
                      01 • DỊCH VỤ QUÝ KHÁCH QUAN TÂM *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {serviceOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setSelectedService(opt)}
                          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all text-left ${
                            selectedService === opt
                              ? "bg-gradient-to-r from-[#00E5FF] to-[#FF2D95] text-black font-black shadow-[0_0_15px_rgba(255,45,149,0.35)]"
                              : "bg-white/[0.04] text-[#94A3B8] hover:text-white hover:bg-white/[0.08] border border-white/[0.08]"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Budget Range */}
                  <div className="space-y-3 pt-1">
                    <label className="block text-[11px] font-mono uppercase text-white/60 tracking-wider">
                      02 • NGÂN SÁCH DỰ KIẾN (VNĐ) *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {budgetOptions.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setSelectedBudget(b)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                            selectedBudget === b
                              ? "bg-white text-black font-black shadow-md"
                              : "bg-white/[0.04] text-[#94A3B8] hover:text-white hover:bg-white/[0.08] border border-white/[0.08]"
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Client Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-white/60 mb-1.5">
                        HỌ VÀ TÊN *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Nguyễn Văn A"
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.1] text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#00E5FF] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-white/60 mb-1.5">
                        SỐ ĐIỆN THOẠI / ZALO *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="0987 654 321"
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.1] text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#00E5FF] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-white/60 mb-1.5">
                        EMAIL DOANH NGHIỆP
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="contact@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.1] text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#00E5FF] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-white/60 mb-1.5">
                        TÊN DOANH NGHIỆP / THƯƠNG HIỆU
                      </label>
                      <input
                        type="text"
                        name="company"
                        placeholder="Tập đoàn / Công ty ABC"
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.1] text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#00E5FF] transition-colors"
                      />
                    </div>
                  </div>

                  {/* 4. Project Title & Preferred Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-[11px] font-mono uppercase text-white/60 mb-1.5">
                        TÊN DỰ ÁN
                      </label>
                      <input
                        type="text"
                        name="projectTitle"
                        placeholder="VD: Rebranding & Web 3D"
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.1] text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#00E5FF] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-white/60 mb-1.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#00E5FF]" />
                        <span>THỜI GIAN BẮT ĐẦU</span>
                      </label>
                      <select
                        name="preferredStartDate"
                        className="w-full px-3.5 py-3 rounded-xl bg-black/40 border border-white/[0.1] text-white text-xs focus:outline-none focus:border-[#00E5FF] transition-colors"
                      >
                        <option value="Triển khai ngay tuần này" className="bg-[#0D0F17]">Triển khai ngay tuần này</option>
                        <option value="Trong vòng 2 - 4 tuần tới" className="bg-[#0D0F17]">Trong 2 - 4 tuần tới</option>
                        <option value="Trong quý tới" className="bg-[#0D0F17]">Trong quý tới</option>
                        <option value="Linh hoạt theo tư vấn" className="bg-[#0D0F17]">Linh hoạt theo tư vấn</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-white/60 mb-1.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#FF2D95]" />
                        <span>KHUNG GIỜ LIÊN HỆ</span>
                      </label>
                      <select
                        name="preferredContactTime"
                        className="w-full px-3.5 py-3 rounded-xl bg-black/40 border border-white/[0.1] text-white text-xs focus:outline-none focus:border-[#00E5FF] transition-colors"
                      >
                        <option value="Giờ hành chính (08:30 - 17:30)" className="bg-[#0D0F17]">Giờ hành chính</option>
                        <option value="Buổi sáng (09:00 - 11:30)" className="bg-[#0D0F17]">Buổi sáng (09:00 - 11:30)</option>
                        <option value="Buổi chiều (14:00 - 17:00)" className="bg-[#0D0F17]">Buổi chiều (14:00 - 17:00)</option>
                        <option value="Buổi tối (Sau 18:00)" className="bg-[#0D0F17]">Buổi tối (Sau 18:00)</option>
                      </select>
                    </div>
                  </div>

                  {/* 5. Message / Scope */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-white/60 mb-1.5">
                      MÔ TẢ BÀI TOÁN & YÊU CẦU DỰ ÁN *
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      required
                      placeholder="Mô tả mục tiêu của bạn (VD: Cần thiết kế website 3D Three.js cho thương hiệu thời trang cao cấp, tối ưu tốc độ và kết nối cổng thanh toán...)"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.1] text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#00E5FF] transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#FF2D95] text-black font-mono text-xs font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(255,45,149,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? "Đang đồng bộ CRM & gửi thông báo..."
                        : "Đặt Dịch Vụ & Nhận Báo Giá Ngay"}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-32 pb-24 px-6 bg-[#06070B] text-white relative min-h-screen">
          <div className="max-w-7xl mx-auto space-y-16 relative z-10">
            <div className="max-w-3xl space-y-6">
              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[1.08]">
                KHỞI ĐỘNG DỰ ÁN & <br />
                <span className="bg-gradient-to-r from-[#00E5FF] via-[#FF2D95] to-[#A855F7] bg-clip-text text-transparent">
                  ĐẶT DỊCH VỤ CHUYÊN GIA.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
                Đang khởi tạo hệ thống liên hệ...
              </p>
            </div>
          </div>
        </div>
      }
    >
      <ContactContent />
    </Suspense>
  );
}
