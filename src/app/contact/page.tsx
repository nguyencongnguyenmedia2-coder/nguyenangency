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
  const [selectedBudget, setSelectedBudget] = useState("50M - 100M VNĐ");

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
    "10M - 30M VNĐ",
    "30M - 80M VNĐ",
    "80M - 200M VNĐ",
    "200M - 500M VNĐ",
    "> 500M VNĐ (Enterprise)",
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
    <div className="pt-32 pb-24 px-6 bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#171717] border border-[#292929]">
            <Sparkles className="w-3.5 h-3.5 text-[#007BA7]" />
            <span className="text-xs font-mono tracking-widest text-white uppercase">
              INITIATE COLLABORATION • UNIFIED BOOKING ENGINE
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-tight">
            KHỞI ĐỘNG DỰ ÁN & <br />
            <span className="text-gradient-brand">ĐẶT DỊCH VỤ CHUYÊN GIA.</span>
          </h1>

          <p className="text-base md:text-lg text-[#A1A1AA] leading-relaxed">
            Mọi yêu cầu đặt dịch vụ từ Website và Telegram Bot được đồng bộ thời gian thực vào hệ thống CRM & thông báo tức thì tới đội ngũ Giám đốc Dự án của NGUYÊN AGENCY.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Info + Telegram Fast Track */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Telegram Bot Direct Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#007BA7]/20 to-[#121212] border border-[#007BA7]/50 space-y-3">
                <div className="flex items-center gap-2.5 text-[#38BDF8]">
                  <Send className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-mono uppercase tracking-wider font-bold">
                    ĐẶT DỊCH VỤ QUA TELEGRAM BOT (24/7)
                  </span>
                </div>
                <p className="text-xs text-[#E4E4E7] leading-relaxed">
                  Trải nghiệm trợ lý đặt dịch vụ tự động 10 bước, nhận mã theo dõi{" "}
                  <code className="text-[#38BDF8]">#NA-YYYYMMDD-XXX</code> và kiểm tra tiến độ dự án bằng lệnh{" "}
                  <code className="text-[#FF2D95]">/mybookings</code>.
                </p>
                <a
                  href={`https://t.me/${botUsername}?start=contact`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#007BA7] hover:bg-[#008fc2] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Mở Telegram Bot Ngay</span>
                </a>
              </div>

              <div className="p-6 rounded-3xl bg-[#121212] border border-[#292929] space-y-3">
                <div className="flex items-center gap-3 text-[#007BA7]">
                  <MapPin className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-mono uppercase tracking-wider font-bold">
                    TRỤ SỞ CHÍNH
                  </span>
                </div>
                <p className="text-sm font-bold text-white">
                  TP. Quảng Ngãi - TP. Hồ Chí Minh
                </p>
                <p className="text-xs text-[#71717A]">
                  Tiếp đón đối tác theo lịch hẹn trước tại Executive Studio Suite.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#121212] border border-[#292929] space-y-3">
                <div className="flex items-center gap-3 text-[#FF2D95]">
                  <Mail className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-mono uppercase tracking-wider font-bold">
                    EMAIL LIÊN HỆ
                  </span>
                </div>
                <a
                  href="mailto:contact@nguyenagency.vn"
                  className="text-sm font-bold text-white hover:text-[#FF2D95] transition-colors block font-mono"
                >
                  contact@nguyenagency.vn
                </a>
                <p className="text-xs text-[#71717A]">
                  Phản hồi email chuyên nghiệp kèm NDA bảo mật thông tin.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#121212] border border-[#292929] space-y-3">
                <div className="flex items-center gap-3 text-emerald-400">
                  <Phone className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-mono uppercase tracking-wider font-bold">
                    HOTLINE TƯ VẤN 24/7
                  </span>
                </div>
                <a
                  href="tel:+84344979307"
                  className="text-lg font-black text-white hover:text-emerald-400 transition-colors block font-mono"
                >
                  +84 344 979 307
                </a>
                <p className="text-xs text-[#71717A]">
                  Hỗ trợ trao đổi trực tiếp qua Telegram, Zalo Official & WhatsApp.
                </p>

                {/* Direct Zalo & Facebook fast connects */}
                <div className="flex items-center gap-2 pt-2">
                  <a
                    href="https://zalo.me/0344979307"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 px-3 py-2 rounded-xl bg-[#0068FF]/15 border border-[#0068FF]/30 hover:border-[#0068FF] text-[#38BDF8] text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Zalo Official</span>
                  </a>
                  <a
                    href="https://www.facebook.com/nguyenads7"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 px-3 py-2 rounded-xl bg-[#1877F2]/15 border border-[#1877F2]/30 hover:border-[#1877F2] text-[#60A5FA] text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Facebook Fanpage</span>
                  </a>
                </div>
              </div>
            </div>

            {/* SLA Commitment */}
            <div className="p-6 rounded-3xl bg-[#171717] border border-[#292929] space-y-3">
              <div className="flex items-center gap-2 text-white">
                <ShieldCheck className="w-4 h-4 text-[#007BA7]" />
                <span className="text-xs font-mono font-bold uppercase">
                  CAM KẾT DỊCH VỤ (SLA)
                </span>
              </div>
              <ul className="text-xs text-[#A1A1AA] space-y-1.5 list-disc pl-4">
                <li>Thông báo thời gian thực tới Giám đốc Dự án ngay khi gửi yêu cầu.</li>
                <li>Lập Scope of Work và Báo giá chi tiết miễn phí.</li>
                <li>Ký thỏa thuận bảo mật NDA trước khi tiếp cận dữ liệu.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Interactive Booking & Brief Form */}
          <div className="lg:col-span-7">
            <div className="p-8 md:p-12 rounded-3xl bg-[#121212] border border-[#292929] relative">
              {responseState?.success ? (
                <div className="py-12 text-center space-y-6 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                    ĐẶT DỊCH VỤ THÀNH CÔNG!
                  </h3>
                  <p className="text-sm text-[#A1A1AA] max-w-md mx-auto leading-relaxed">
                    {responseState.message}
                  </p>
                  <div className="p-5 rounded-2xl bg-[#171717] border border-[#007BA7]/40 max-w-xs mx-auto">
                    <span className="text-[10px] font-mono text-[#71717A] uppercase block mb-1">
                      MÃ ĐẶT DỊCH VỤ (BOOKING CODE)
                    </span>
                    <strong className="text-xl font-mono text-[#38BDF8]">
                      {responseState.code}
                    </strong>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setResponseState(null)}
                      className="px-6 py-2.5 rounded-full text-xs font-mono text-[#A1A1AA] hover:text-white border border-[#292929] transition-colors"
                    >
                      Gửi thêm yêu cầu khác
                    </button>
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
                    <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{responseState.error}</span>
                    </div>
                  )}

                  {/* 1. Service Selection */}
                  <div className="space-y-3">
                    <label className="block text-[11px] font-mono uppercase text-[#A1A1AA] tracking-wider">
                      01 • DỊCH VỤ QUÝ KHÁCH QUAN TÂM *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {serviceOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setSelectedService(opt)}
                          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all text-left ${selectedService === opt
                              ? "bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-bold shadow-glow-pink"
                              : "bg-[#171717] text-[#A1A1AA] hover:text-white border border-[#292929]"
                            }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Budget Range */}
                  <div className="space-y-3 pt-1">
                    <label className="block text-[11px] font-mono uppercase text-[#A1A1AA] tracking-wider">
                      02 • NGÂN SÁCH DỰ KIẾN (VNĐ) *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {budgetOptions.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setSelectedBudget(b)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${selectedBudget === b
                              ? "bg-white text-black font-bold shadow-md"
                              : "bg-[#171717] text-[#71717A] hover:text-white border border-[#292929]"
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
                      <label className="block text-[11px] font-mono uppercase text-[#A1A1AA] mb-1">
                        HỌ VÀ TÊN *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Nguyễn Văn A"
                        className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#A1A1AA] mb-1">
                        SỐ ĐIỆN THOẠI / ZALO *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="0987 654 321"
                        className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#A1A1AA] mb-1">
                        EMAIL DOANH NGHIỆP
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="contact@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#A1A1AA] mb-1">
                        TÊN DOANH NGHIỆP / THƯƠNG HIỆU
                      </label>
                      <input
                        type="text"
                        name="company"
                        placeholder="Tập đoàn / Công ty ABC"
                        className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                      />
                    </div>
                  </div>

                  {/* 4. Project Title & Preferred Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-[11px] font-mono uppercase text-[#A1A1AA] mb-1">
                        TÊN DỰ ÁN
                      </label>
                      <input
                        type="text"
                        name="projectTitle"
                        placeholder="VD: Rebranding & Web 3D"
                        className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#A1A1AA] mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#007BA7]" />
                        <span>THỜI GIAN BẮT ĐẦU</span>
                      </label>
                      <select
                        name="preferredStartDate"
                        className="w-full px-3.5 py-3 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                      >
                        <option value="Triển khai ngay tuần này">Triển khai ngay tuần này</option>
                        <option value="Trong vòng 2 - 4 tuần tới">Trong 2 - 4 tuần tới</option>
                        <option value="Trong quý tới">Trong quý tới</option>
                        <option value="Linh hoạt theo tư vấn">Linh hoạt theo tư vấn</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#A1A1AA] mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#FF2D95]" />
                        <span>KHUNG GIỜ LIÊN HỆ</span>
                      </label>
                      <select
                        name="preferredContactTime"
                        className="w-full px-3.5 py-3 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                      >
                        <option value="Giờ hành chính (08:30 - 17:30)">Giờ hành chính</option>
                        <option value="Buổi sáng (09:00 - 11:30)">Buổi sáng (09:00 - 11:30)</option>
                        <option value="Buổi chiều (14:00 - 17:00)">Buổi chiều (14:00 - 17:00)</option>
                        <option value="Buổi tối (Sau 18:00)">Buổi tối (Sau 18:00)</option>
                      </select>
                    </div>
                  </div>

                  {/* 5. Message / Scope */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#A1A1AA] mb-1">
                      MÔ TẢ BÀI TOÁN & YÊU CẦU DỰ ÁN *
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      required
                      placeholder="Mô tả mục tiêu của bạn (VD: Cần thiết kế website 3D Three.js cho thương hiệu thời trang cao cấp, tối ưu tốc độ và kết nối thanh toán...)"
                      className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-mono text-xs font-bold uppercase tracking-widest hover:shadow-glow-pink transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? "Đang đồng bộ & gửi thông báo..."
                        : "Đặt Dịch Vụ & Nhận Báo Giá"}
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
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-zinc-400 font-mono text-xs uppercase tracking-widest">
          Đang khởi tạo hệ thống liên hệ...
        </div>
      }
    >
      <ContactContent />
    </Suspense>
  );
}
