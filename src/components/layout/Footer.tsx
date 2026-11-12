"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Mail, Phone, MapPin, ShieldCheck, Clock, Send, Award, Sparkles } from "lucide-react";

interface FooterProps {
  brandName?: string;
  brandTagline?: string;
  brandDescription?: string;
  contactEmail?: string;
  hotline?: string;
  officeAddress?: string;
  zaloUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  behanceUrl?: string;
}

export default function Footer({
  brandName = "NGUYÊN AGENCY",
  brandTagline = "VƯỢT CHUẨN SỐ HÓA",
  brandDescription = "Premium Creative Digital Agency tiên phong kết hợp giữa nghệ thuật thị giác đương đại, công nghệ 3D Three.js và kiến trúc phần mềm tốc độ cao.",
  contactEmail = "contact@nguyenagency.vn",
  hotline = "+84 344 979 307",
  officeAddress = "TP. Quảng Ngãi - TP. Hồ Chí Minh",
  zaloUrl = "https://zalo.me/0344979307",
  facebookUrl = "https://www.facebook.com/nguyenads7",
  linkedinUrl = "https://linkedin.com",
  behanceUrl = "https://behance.net",
}: FooterProps) {
  const pathname = usePathname();

  const isAdminRoute = pathname?.toLowerCase().startsWith("/admin");
  if (isAdminRoute) return null;

  return (
    <footer className="bg-[#05060A] border-t border-[#1A1A22] pt-20 pb-12 relative overflow-hidden text-sm">
      {/* Subtle Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00E5FF]/5 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#FF2D95]/5 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          {/* Brand Info & Contacts (Col 1-5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Link href="/" className="flex items-start group w-fit">
              <Image
                src="/images/logo.png"
                alt="NGUYÊN AGENCY"
                width={260}
                height={87}
                loading="lazy"
                className="h-14 w-auto object-contain transition-all duration-300 group-hover:brightness-110 drop-shadow-[0_4px_20px_rgba(0,163,255,0.25)]"
              />
            </Link>

            <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-md">
              {brandDescription}
            </p>

            <div className="flex flex-col gap-4 text-xs text-[#71717A] pt-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-semibold text-white/90">{officeAddress}</span>
                  <span className="text-[11px] text-[#71717A] mt-0.5">
                    Trụ sở chính: TP. Quảng Ngãi | Văn phòng đại diện: TP. Hồ Chí Minh
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#FF2D95] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <a
                    href={`mailto:${contactEmail}`}
                    className="font-semibold text-white/90 hover:text-[#FF2D95] transition-colors font-mono"
                  >
                    {contactEmail}
                  </a>
                  <span className="text-[11px] text-[#71717A] mt-0.5">
                    Tiếp nhận yêu cầu báo giá & NDA bảo mật thông tin trong 15 phút.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <a
                    href={`tel:${hotline.replace(/\s+/g, "")}`}
                    className="font-semibold text-white/90 hover:text-emerald-400 transition-colors font-mono text-sm"
                  >
                    {hotline}
                  </a>
                  <span className="text-[11px] text-[#71717A] mt-0.5">
                    Tư vấn trực tiếp 24/7 qua Hotline, Zalo Official & Telegram Bot.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#A855F7] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-semibold text-white/90">Giờ làm việc: 08:00 - 18:00 (Thứ 2 - Thứ 7)</span>
                  <span className="text-[11px] text-[#71717A] mt-0.5">
                    Hạ tầng kỹ thuật & Giám sát Uptime hoạt động 24/7/365.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links: Ecosystem (Col 6-7) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="text-xs font-mono font-bold tracking-widest text-white uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
              Hệ Sinh Thái Dịch Vụ
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-[#A1A1AA]">
              <Link href="/thiet-ke-website-quang-ngai" className="hover:text-[#00E5FF] transition-colors">Thiết Kế Website Quảng Ngãi</Link>
              <Link href="/media-quang-ngai" className="hover:text-[#FF2D95] transition-colors">Media & TVC Quảng Ngãi</Link>
              <Link href="/digital-marketing-quang-ngai" className="hover:text-[#00E5FF] transition-colors">Digital Marketing Quảng Ngãi</Link>
              <Link href="/thiet-ke-logo" className="hover:text-[#FF2D95] transition-colors">Thiết Kế Logo & Thương Hiệu</Link>
              <Link href="/ai-automation" className="hover:text-[#A855F7] transition-colors flex items-center gap-1.5">
                <span>AI Automation & LAB</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#A855F7]/20 text-[#A855F7] font-mono font-bold">R&D</span>
              </Link>
              <Link href="/du-an" className="hover:text-white transition-colors">Hồ Sơ Năng Lực & Dự Án</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">Bảng Giá Trọn Gói Dự Án</Link>
            </div>
          </div>

          {/* Company & Legal (Col 8-9) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="text-xs font-mono font-bold tracking-widest text-white uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2D95]" />
              Doanh Nghiệp
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-[#A1A1AA]">
              <Link href="/nguyen-cong-nguyen" className="hover:text-[#00E5FF] transition-colors font-semibold">Nguyễn Công Nguyên</Link>
              <Link href="/about" className="hover:text-white transition-colors">Về NGUYÊN AGENCY</Link>
              <Link href="/du-an" className="hover:text-white transition-colors">Dự Án Đã Thực Hiện</Link>
              <Link href="/blog" className="hover:text-white transition-colors">Góc Nhìn Chuyên Môn</Link>
              <Link href="/faq" className="hover:text-white transition-colors">Câu Hỏi Thường Gặp (FAQ)</Link>
              <Link href="/lien-he" className="hover:text-white transition-colors">Liên Hệ Quảng Ngãi</Link>
              <Link href="/admin/login" className="hover:text-white transition-colors font-mono text-[11px] text-[#71717A]">
                Cổng Quản Trị CMS
              </Link>
            </div>
          </div>

          {/* Social Channels & Security (Col 10-12) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="text-xs font-mono font-bold tracking-widest text-white uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Kết Nối & Hỗ Trợ
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-[#A1A1AA]">
              <a href={zaloUrl} target="_blank" rel="noreferrer" className="hover:text-white flex items-center justify-between group">
                <span>Zalo Doanh Nghiệp</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#71717A] group-hover:text-[#00E5FF] transition-colors" />
              </a>
              <a href="https://t.me/NguyenAgencyBot" target="_blank" rel="noreferrer" className="hover:text-white flex items-center justify-between group">
                <span>Telegram Bot 24/7</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#71717A] group-hover:text-[#00E5FF] transition-colors" />
              </a>
              <a href={facebookUrl} target="_blank" rel="noreferrer" className="hover:text-white flex items-center justify-between group">
                <span>Facebook Fanpage</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#71717A] group-hover:text-[#FF2D95] transition-colors" />
              </a>
              <a href={linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-white flex items-center justify-between group">
                <span>LinkedIn Network</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#71717A] transition-colors" />
              </a>
            </div>

            {/* Security & Quality Badges */}
            <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>SSL & ISO 27001 Secure</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2.5 py-1 rounded-md border border-[#00E5FF]/20">
                <Award className="w-3.5 h-3.5 shrink-0" />
                <span>100% In-House Clean Code</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#71717A]">
          <p>© {new Date().getFullYear()} {brandName}. Bảo lưu mọi quyền. {brandTagline}.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Chính Sách Bảo Mật</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Điều Khoản Dịch Vụ</Link>
            <span className="font-mono text-[#52525B]">Made with Next.js 14 & Three.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
