"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Bot,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles,
  MessageSquare,
  Sliders,
  Users,
  Compass,
  ArrowUpRight,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { saveSiteSetting } from "@/app/actions/admin-system-actions";

interface LeadItem {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  service?: string | null;
  budget?: string | null;
  status: string;
  source?: string | null;
  notes?: string | null;
  createdAt: Date | string;
}

interface MascotConfigProps {
  initialConfig: {
    mascotEnabled: boolean;
    mascotName: string;
    mascotTitle: string;
    mascotGreeting: string;
    mascotImage: string;
    mascotAnimationEnabled: boolean;
    mascotSizeDesktop: number;
    mascotPosition: string;
  };
  recentMascotLeads: LeadItem[];
}

export default function MascotConfigClient({
  initialConfig,
  recentMascotLeads,
}: MascotConfigProps) {
  const [config, setConfig] = useState(initialConfig);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const [previewSpeechOpen, setPreviewSpeechOpen] = useState(true);

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    const fields = [
      { key: "mascotEnabled", value: config.mascotEnabled ? "true" : "false", desc: "Bật/tắt Mascot trợ lý hỗ trợ khách hàng trên toàn website" },
      { key: "mascotName", value: config.mascotName, desc: "Tên hiển thị của Mascot AI" },
      { key: "mascotTitle", value: config.mascotTitle, desc: "Chức danh của Mascot" },
      { key: "mascotGreeting", value: config.mascotGreeting, desc: "Lời chào mở đầu khi khách ghé website" },
      { key: "mascotImage", value: config.mascotImage, desc: "Đường dẫn ảnh đại bàng mascot (.webp / .png)" },
      { key: "mascotAnimationEnabled", value: config.mascotAnimationEnabled ? "true" : "false", desc: "Hiệu ứng nhấp nhô và phát sáng của Mascot" },
      { key: "mascotSizeDesktop", value: config.mascotSizeDesktop.toString(), desc: "Kích thước hiển thị Mascot trên màn hình máy tính (px)" },
      { key: "mascotPosition", value: config.mascotPosition, desc: "Vị trí cố định (bottom-right / bottom-left)" },
    ];

    try {
      for (const f of fields) {
        const fd = new FormData();
        fd.append("key", f.key);
        fd.append("value", f.value);
        fd.append("group", "MASCOT");
        fd.append("description", f.desc);
        await saveSiteSetting(fd);
      }
      setMessage({ type: "success", text: "Đã lưu cài đặt Mascot Trợ Lý AI thành công!" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Có lỗi khi lưu cài đặt. Vui lòng thử lại." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Alert Notification */}
      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 border text-sm font-medium animate-fadeIn ${
            message.type === "success"
              ? "bg-[#007BA7]/15 border-[#007BA7]/40 text-[#38BDF8]"
              : "bg-red-500/15 border-red-500/40 text-red-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Grid: Config Form & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-[#121212] border border-[#27272A] shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#27272A] mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#007BA7] to-[#FF2D95] flex items-center justify-center text-white shadow-lg">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wider">
                    Thiết Lập Mascot Trợ Lý Khách Hàng
                  </h2>
                  <p className="text-xs text-[#A1A1AA]">
                    Tùy chỉnh thông tin, trạng thái và kịch bản tương tác
                  </p>
                </div>
              </div>

              {/* Master Toggle */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.mascotEnabled}
                  onChange={(e) =>
                    setConfig({ ...config, mascotEnabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#27272A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007BA7]"></div>
              </label>
            </div>

            <div className="space-y-5">
              {/* Name & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                    Tên Hiển Thị Mascot
                  </label>
                  <input
                    type="text"
                    value={config.mascotName}
                    onChange={(e) =>
                      setConfig({ ...config, mascotName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#18181B] border border-[#27272A] rounded-xl text-white text-sm focus:outline-none focus:border-[#007BA7]"
                    placeholder="NGUYÊN AI"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                    Chức Danh / Vị Trí
                  </label>
                  <input
                    type="text"
                    value={config.mascotTitle}
                    onChange={(e) =>
                      setConfig({ ...config, mascotTitle: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#18181B] border border-[#27272A] rounded-xl text-white text-sm focus:outline-none focus:border-[#007BA7]"
                    placeholder="Trợ Lý Hỗ Trợ 24/7"
                  />
                </div>
              </div>

              {/* Greeting */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                  Lời Chào Mở Đầu (Speech Bubble & Chat Header)
                </label>
                <textarea
                  rows={3}
                  value={config.mascotGreeting}
                  onChange={(e) =>
                    setConfig({ ...config, mascotGreeting: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#18181B] border border-[#27272A] rounded-xl text-white text-sm focus:outline-none focus:border-[#007BA7]"
                  placeholder="Xin chào! 👋 Mình là trợ lý của NGUYÊN AGENCY..."
                />
                <span className="text-[11px] text-[#71717A] mt-1 block">
                  Bong bóng này sẽ tự động xuất hiện chào đón người dùng khi vào trang chủ và các trang con.
                </span>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                  Đường Dẫn Hình Ảnh Mascot (Trong suốt PNG / WebP)
                </label>
                <input
                  type="text"
                  value={config.mascotImage}
                  onChange={(e) =>
                    setConfig({ ...config, mascotImage: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#18181B] border border-[#27272A] rounded-xl text-white text-sm font-mono focus:outline-none focus:border-[#007BA7]"
                />
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] text-[#71717A]">Mặc định tối ưu:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setConfig({
                        ...config,
                        mascotImage: "/assets/mascot/mascot.webp",
                      })
                    }
                    className="text-[11px] text-[#38BDF8] hover:underline font-mono"
                  >
                    /assets/mascot/mascot.webp
                  </button>
                  <span className="text-[11px] text-[#71717A]">hoặc</span>
                  <button
                    type="button"
                    onClick={() =>
                      setConfig({
                        ...config,
                        mascotImage: "/assets/mascot/mascot.png",
                      })
                    }
                    className="text-[11px] text-[#38BDF8] hover:underline font-mono"
                  >
                    /assets/mascot/mascot.png
                  </button>
                </div>
              </div>

              {/* Animation & Size Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                    Kích Thước Desktop: {config.mascotSizeDesktop}px
                  </label>
                  <input
                    type="range"
                    min={90}
                    max={180}
                    step={5}
                    value={config.mascotSizeDesktop}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        mascotSizeDesktop: parseInt(e.target.value) || 130,
                      })
                    }
                    className="w-full accent-[#007BA7]"
                  />
                  <div className="flex justify-between text-[10px] text-[#71717A] font-mono mt-1">
                    <span>90px (Gọn)</span>
                    <span>130px (Khuyên Dùng)</span>
                    <span>180px (Lớn)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A1A1AA] mb-2">
                    Hiệu Ứng Chuyển Động
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.mascotAnimationEnabled}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          mascotAnimationEnabled: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded bg-[#18181B] border-[#27272A] text-[#007BA7] focus:ring-0"
                    />
                    <span className="text-xs text-white">
                      Floating & Glow Aura (Lượn sóng & Hào quang)
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-[#27272A] flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-95 shadow-lg transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Đang Lưu Cấu Hình...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Lưu Thay Đổi Mascot
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Preview Box (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#121212] border border-[#27272A] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A] mb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="text-xs font-mono uppercase tracking-wider text-white">
                  Xem Trước Trực Tiếp (Live Preview)
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#007BA7]/20 text-[#38BDF8] border border-[#007BA7]/30">
                {config.mascotEnabled ? "Đang Bật" : "Đang Tắt"}
              </span>
            </div>

            {/* Simulated Website Corner */}
            <div className="relative h-80 w-full rounded-xl bg-gradient-to-b from-[#0A0A0A] to-[#121212] border border-[#27272A] overflow-hidden flex flex-col justify-end p-4">
              {/* Subtle background tech grid */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    "radial-gradient(#007BA7 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />

              {/* Speech bubble preview */}
              {previewSpeechOpen && (
                <div className="absolute top-6 right-4 left-4 p-3 rounded-2xl bg-[#121212]/95 border border-[#007BA7]/40 shadow-2xl backdrop-blur-md animate-fadeIn z-10">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase text-[#38BDF8] flex items-center gap-1 font-bold">
                      <Sparkles className="w-3 h-3 text-[#FF2D95]" />
                      {config.mascotName || "NGUYÊN AI"}
                    </span>
                    <button
                      onClick={() => setPreviewSpeechOpen(false)}
                      className="text-[#71717A] hover:text-white text-xs"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-xs text-[#E4E4E7] leading-relaxed line-clamp-3">
                    {config.mascotGreeting}
                  </p>
                </div>
              )}

              {/* Mascot Floating Preview */}
              <div className="relative z-10 flex items-end justify-end">
                <div
                  className={`relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-105 ${
                    config.mascotAnimationEnabled ? "animate-bounceSlow" : ""
                  }`}
                  style={{ width: `${Math.min(config.mascotSizeDesktop, 140)}px` }}
                >
                  {/* Aura Glow */}
                  {config.mascotAnimationEnabled && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#007BA7]/40 via-[#FF2D95]/20 to-transparent blur-2xl scale-125 pointer-events-none" />
                  )}

                  <Image
                    src={config.mascotImage || "/assets/mascot/mascot.webp"}
                    alt={config.mascotName}
                    width={140}
                    height={160}
                    className="relative z-10 w-full h-auto drop-shadow-[0_12px_24px_rgba(0,123,167,0.35)] object-contain"
                    unoptimized
                  />

                  {/* Badge */}
                  <div className="mt-1 px-2.5 py-0.5 rounded-full bg-[#18181B]/90 border border-[#007BA7]/50 text-[10px] font-bold text-white shadow-lg flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>{config.mascotName}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-[#71717A]">
              <span>Góc xuất hiện: Dưới bên phải (Bottom Right)</span>
              {!previewSpeechOpen && (
                <button
                  type="button"
                  onClick={() => setPreviewSpeechOpen(true)}
                  className="text-[#38BDF8] hover:underline"
                >
                  Hiện lại lời chào
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mascot Inquiries / Leads Table */}
      <div className="p-6 rounded-2xl bg-[#121212] border border-[#27272A] shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27272A] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#007BA7]/20 border border-[#007BA7]/30 flex items-center justify-center text-[#38BDF8]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Yêu Cầu & Báo Giá Thu Thập Qua Mascot ({recentMascotLeads.length})
              </h2>
              <p className="text-xs text-[#A1A1AA]">
                Khách hàng trò chuyện và gửi thông tin tư vấn trực tiếp với Mascot Trợ Lý
              </p>
            </div>
          </div>

          <a
            href="/admin/leads"
            className="text-xs font-mono text-[#38BDF8] hover:underline flex items-center gap-1"
          >
            Xem toàn bộ Leads CRM
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {recentMascotLeads.length === 0 ? (
          <div className="text-center py-12 text-[#71717A] text-xs font-mono">
            Chưa có yêu cầu nào được gửi từ Mascot. Hãy gửi thử 1 yêu cầu tư vấn trên website để kiểm tra!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#18181B] text-[#A1A1AA] uppercase font-mono tracking-wider border-b border-[#27272A]">
                <tr>
                  <th className="py-3 px-4">Khách Hàng</th>
                  <th className="py-3 px-4">Số Điện Thoại / Email</th>
                  <th className="py-3 px-4">Dịch Vụ Quan Tâm</th>
                  <th className="py-3 px-4">Ngân Sách</th>
                  <th className="py-3 px-4">Ghi Chú</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                  <th className="py-3 px-4 text-right">Thời Gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A] text-white">
                {recentMascotLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      {lead.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#E4E4E7]">
                      <div>{lead.phone || "—"}</div>
                      {lead.email && (
                        <div className="text-[11px] text-[#A1A1AA]">{lead.email}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#38BDF8]">
                      {lead.service || "Tư vấn tổng thể"}
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-400">
                      {lead.budget || "Thỏa thuận"}
                    </td>
                    <td className="py-3 px-4 text-[#A1A1AA] max-w-xs truncate">
                      {lead.notes || "—"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#007BA7]/20 text-[#38BDF8] border border-[#007BA7]/30">
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[11px] text-[#71717A]">
                      {new Date(lead.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

