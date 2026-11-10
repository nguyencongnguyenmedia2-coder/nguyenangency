"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";

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

  // If inside /admin or /Admin, public footer should not render
  const isAdminRoute = pathname?.toLowerCase().startsWith("/admin");
  if (isAdminRoute) return null;

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#292929] pt-20 pb-12 relative overflow-hidden">
      {/* Subtle Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#007BA7]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF2D95]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#007BA7] to-[#FF2D95] p-[1.5px]">
                <div className="w-full h-full bg-[#0A0A0A] rounded-[10px] flex items-center justify-center">
                  <span className="font-extrabold text-xl text-white">
                    {brandName.charAt(0)}.
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold tracking-[0.25em] text-base text-white uppercase">
                  {brandName}
                </span>
                <span className="text-[11px] tracking-widest text-[#71717A] uppercase font-mono">
                  {brandTagline}
                </span>
              </div>
            </Link>

            <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-sm">
              {brandDescription}
            </p>

            <div className="flex flex-col gap-4 text-xs text-[#71717A] pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#007BA7] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-semibold text-white/90">{officeAddress}</span>
                  <span className="text-[11px] text-[#71717A] mt-0.5">
                    Tiếp đón đối tác theo lịch hẹn trước tại Executive Studio Suite.
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#FF2D95] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <a
                    href={`mailto:${contactEmail}`}
                    className="font-semibold text-white/90 hover:text-[#FF2D95] transition-colors font-mono"
                  >
                    {contactEmail}
                  </a>
                  <span className="text-[11px] text-[#71717A] mt-0.5">
                    Phản hồi email chuyên nghiệp kèm NDA bảo mật thông tin.
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <a
                    href={`tel:${hotline.replace(/\s+/g, "")}`}
                    className="font-semibold text-white/90 hover:text-emerald-400 transition-colors font-mono text-sm"
                  >
                    {hotline}
                  </a>
                  <span className="text-[11px] text-[#71717A] mt-0.5">
                    Hỗ trợ trao đổi trực tiếp qua Telegram, Zalo Official & WhatsApp.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-mono tracking-widest text-white uppercase">Hệ Sinh Thái</h4>
            <div className="flex flex-col gap-2.5 text-sm text-[#A1A1AA]">
              <Link href="/services?group=MEDIA" className="hover:text-[#007BA7] transition-colors">Dịch Vụ Sáng Tạo & Media</Link>
              <Link href="/services?group=TECH" className="hover:text-[#007BA7] transition-colors">Công Nghệ & Phần Mềm</Link>
              <Link href="/lab" className="hover:text-[#FF2D95] transition-colors flex items-center gap-1.5">
                <span>Phòng Nghiên Cứu LAB</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FF2D95]/20 text-[#FF2D95] font-mono">AI</span>
              </Link>
              <Link href="/portfolio" className="hover:text-white transition-colors">Dự Án Tiêu Biểu</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">Bảng Giá Trọn Gói</Link>
            </div>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-mono tracking-widest text-white uppercase">Doanh Nghiệp</h4>
            <div className="flex flex-col gap-2.5 text-sm text-[#A1A1AA]">
              <Link href="/about" className="hover:text-white transition-colors">Về Chúng Tôi</Link>
              <Link href="/blog" className="hover:text-white transition-colors">Góc Nhìn & Bài Viết</Link>
              <Link href="/faq" className="hover:text-white transition-colors">Câu Hỏi Thường Gặp</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Liên Hệ Hợp Tác</Link>
            </div>
          </div>

          {/* Business & Social */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-mono tracking-widest text-white uppercase">Kết Nối Mạng Xã Hội</h4>
            <div className="flex flex-col gap-2.5 text-sm text-[#A1A1AA]">
              <a href={zaloUrl} target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                Zalo Doanh Nghiệp <ArrowUpRight className="w-3.5 h-3.5 text-[#71717A]" />
              </a>
              <a href={facebookUrl} target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                Facebook Fanpage <ArrowUpRight className="w-3.5 h-3.5 text-[#71717A]" />
              </a>
              <a href={linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                LinkedIn Network <ArrowUpRight className="w-3.5 h-3.5 text-[#71717A]" />
              </a>
              <a href={behanceUrl} target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                Behance Portfolio <ArrowUpRight className="w-3.5 h-3.5 text-[#71717A]" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#292929] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#71717A]">
          <p>© {new Date().getFullYear()} {brandName}. Bảo lưu mọi quyền. {brandTagline}.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Chính Sách Bảo Mật</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Điều Khoản Dịch Vụ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
