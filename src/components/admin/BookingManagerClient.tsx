"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  MessageSquare,
  FileText,
  Briefcase,
  Send,
  Phone,
  Mail,
  Building2,
  Clock,
  Sparkles,
  X,
  ExternalLink,
} from "lucide-react";
import {
  updateServiceBookingStatus,
  createBookingFromAdmin,
  convertBookingToQuotation,
  convertBookingToProject,
} from "@/app/actions/admin-booking-actions";

interface BookingRecord {
  id: string;
  bookingCode: string;
  customerId: string;
  serviceId: string | null;
  serviceName: string;
  source: string;
  projectTitle: string;
  projectDescription: string;
  budgetRange: string | null;
  preferredStartDate: string | null;
  preferredContactTime: string | null;
  customerNotes: string | null;
  pageSource: string | null;
  status: string;
  assignedTo: string | null;
  createdAt: string;
  customer: {
    id: string;
    code: string;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    telegramUserId: string | null;
    telegramUsername: string | null;
  };
}

interface ServiceOption {
  id: string;
  title: string;
  group: string;
  priceLabel: string;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; dotColor: string }
> = {
  NEW: {
    label: "Mới tiếp nhận",
    badgeClass: "bg-[#007BA7]/15 text-[#38BDF8] border-[#007BA7]/40",
    dotColor: "#38BDF8",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
    dotColor: "#34D399",
  },
  CONSULTING: {
    label: "Đang tư vấn",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/40",
    dotColor: "#FBBF24",
  },
  QUOTATION_SENT: {
    label: "Đã gửi báo giá",
    badgeClass: "bg-[#FF2D95]/15 text-[#FF2D95] border-[#FF2D95]/40",
    dotColor: "#FF2D95",
  },
  IN_PROGRESS: {
    label: "Đang triển khai",
    badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/40",
    dotColor: "#C084FC",
  },
  COMPLETED: {
    label: "Hoàn thành",
    badgeClass: "bg-green-500/20 text-green-300 border-green-500/40",
    dotColor: "#4ADE80",
  },
  CANCELLED: {
    label: "Đã hủy",
    badgeClass: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
    dotColor: "#71717A",
  },
};

export default function BookingManagerClient({
  initialBookings,
  services,
  staffUsers,
  initialCodeFilter = "",
}: {
  initialBookings: BookingRecord[];
  services: ServiceOption[];
  staffUsers: Array<{ id: string; name: string; roleName: string }>;
  initialCodeFilter?: string;
}) {
  const [searchQuery, setSearchQuery] = useState(initialCodeFilter);
  const [sourceFilter, setSourceFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(
    initialBookings[0] || null
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredBookings = initialBookings.filter((b) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.bookingCode.toLowerCase().includes(q) ||
      b.projectTitle.toLowerCase().includes(q) ||
      b.serviceName.toLowerCase().includes(q) ||
      b.customer.name.toLowerCase().includes(q) ||
      (b.customer.phone && b.customer.phone.includes(q)) ||
      b.customer.email.toLowerCase().includes(q);

    const matchesSource = sourceFilter === "ALL" || b.source === sourceFilter;
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;

    return matchesSearch && matchesSource && matchesStatus;
  });

  const handleStatusChange = (
    bookingId: string,
    newStatus: string,
    assignedTo?: string,
    customerNotes?: string
  ) => {
    setFeedbackMsg(null);
    startTransition(async () => {
      const res = await updateServiceBookingStatus({
        bookingId,
        status: newStatus,
        assignedTo,
        customerNotes,
      });
      if (res.success) {
        setFeedbackMsg({
          type: "success",
          text: `Đã cập nhật trạng thái sang "${STATUS_CONFIG[newStatus]?.label || newStatus}" và đồng bộ thông báo Telegram.`,
        });
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking({
            ...selectedBooking,
            status: newStatus,
            ...(assignedTo !== undefined ? { assignedTo } : {}),
            ...(customerNotes !== undefined ? { customerNotes } : {}),
          });
        }
      } else {
        setFeedbackMsg({
          type: "error",
          text: res.error || "Cập nhật thất bại.",
        });
      }
    });
  };

  const handleConvertQuotation = (bookingId: string) => {
    setFeedbackMsg(null);
    startTransition(async () => {
      const res = await convertBookingToQuotation(bookingId);
      if (res.success) {
        setFeedbackMsg({
          type: "success",
          text: `Đã khởi tạo báo giá ${res.quotationCode} thành công!`,
        });
      } else {
        setFeedbackMsg({
          type: "error",
          text: res.error || "Không thể tạo báo giá.",
        });
      }
    });
  };

  const handleConvertProject = (bookingId: string) => {
    setFeedbackMsg(null);
    startTransition(async () => {
      const res = await convertBookingToProject(bookingId);
      if (res.success) {
        setFeedbackMsg({
          type: "success",
          text: `Đã chuyển thành dự án triển khai ${res.projectCode} thành công!`,
        });
      } else {
        setFeedbackMsg({
          type: "error",
          text: res.error || "Không thể chuyển thành dự án.",
        });
      }
    });
  };

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createBookingFromAdmin(formData);
      if (res.success) {
        setShowCreateModal(false);
        setFeedbackMsg({
          type: "success",
          text: `Đã tạo yêu cầu đặt dịch vụ ${res.bookingCode} và gửi thông báo Telegram!`,
        });
      } else {
        setFeedbackMsg({
          type: "error",
          text: res.error || "Lỗi tạo đặt dịch vụ.",
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Header & Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#292929] pb-6">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-[#007BA7] block mb-1">
            UNIFIED BOOKING & LEAD ENGINE
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
            Quản Lý Đặt Dịch Vụ (Service Bookings)
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-1">
            Đồng bộ thời gian thực từ Website Forms, Telegram Bot 10-Step Flow và CRM Admin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/telegram"
            className="px-4 py-2.5 rounded-xl bg-[#171717] hover:bg-[#222222] text-white border border-[#292929] text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-all"
          >
            <Send className="w-3.5 h-3.5 text-[#007BA7]" />
            <span>Cấu hình Telegram Bot</span>
          </Link>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-xl bg-[#007BA7] hover:bg-[#008fc2] text-white text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Đặt Dịch Vụ Mới</span>
          </button>
        </div>
      </div>

      {/* Quick KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#121212] border border-[#292929]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#A1A1AA]">
            TỔNG ĐẶT DỊCH VỤ
          </span>
          <div className="text-2xl font-black text-white mt-1">
            {initialBookings.length}
          </div>
          <span className="text-[11px] text-[#007BA7] font-mono">
            100% Unified Database
          </span>
        </div>
        <div className="p-5 rounded-2xl bg-[#121212] border border-[#292929]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#A1A1AA]">
            TỪ WEBSITE
          </span>
          <div className="text-2xl font-black text-white mt-1">
            {initialBookings.filter((b) => b.source === "WEBSITE").length}
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">
            Contact & Detail Forms
          </span>
        </div>
        <div className="p-5 rounded-2xl bg-[#121212] border border-[#292929]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#A1A1AA]">
            TỪ TELEGRAM BOT
          </span>
          <div className="text-2xl font-black text-[#38BDF8] mt-1">
            {initialBookings.filter((b) => b.source === "TELEGRAM").length}
          </div>
          <span className="text-[11px] text-[#38BDF8] font-mono">
            10-Step Interactive Flow
          </span>
        </div>
        <div className="p-5 rounded-2xl bg-[#121212] border border-[#292929]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#A1A1AA]">
            CHỜ XÁC NHẬN (NEW)
          </span>
          <div className="text-2xl font-black text-[#FF2D95] mt-1">
            {initialBookings.filter((b) => b.status === "NEW").length}
          </div>
          <span className="text-[11px] text-[#FF2D95] font-mono">
            Cần phản hồi trong 15p
          </span>
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl border text-sm flex items-center justify-between ${
            feedbackMsg.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-red-500/10 border-red-500/30 text-red-300"
          }`}
        >
          <span>{feedbackMsg.text}</span>
          <button
            type="button"
            onClick={() => setFeedbackMsg(null)}
            className="text-xs opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A1A1AA] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã #NA-YYYYMMDD-XXX, tên KH, SĐT, email hoặc tên dự án..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#121212] border border-[#292929] text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-[#007BA7]"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#121212] border border-[#292929]">
            <Filter className="w-3.5 h-3.5 text-[#007BA7]" />
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-transparent text-xs font-mono text-white focus:outline-none"
            >
              <option value="ALL" className="bg-[#121212]">
                Tất cả nguồn (ALL)
              </option>
              <option value="WEBSITE" className="bg-[#121212]">
                Nguồn: WEBSITE
              </option>
              <option value="TELEGRAM" className="bg-[#121212]">
                Nguồn: TELEGRAM BOT
              </option>
              <option value="ADMIN" className="bg-[#121212]">
                Nguồn: CRM ADMIN
              </option>
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#121212] border border-[#292929]">
            <CalendarCheck className="w-3.5 h-3.5 text-[#FF2D95]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-mono text-white focus:outline-none"
            >
              <option value="ALL" className="bg-[#121212]">
                Tất cả trạng thái
              </option>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key} className="bg-[#121212]">
                  {cfg.label} ({key})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Split View: Booking List + Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List */}
        <div className="lg:col-span-7 space-y-3">
          {filteredBookings.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#121212] border border-[#292929] text-center space-y-3">
              <CalendarCheck className="w-10 h-10 text-[#007BA7] mx-auto opacity-60" />
              <h3 className="text-base font-bold text-white">
                Chưa có yêu cầu đặt dịch vụ nào khớp bộ lọc
              </h3>
              <p className="text-xs text-[#A1A1AA]">
                Các yêu cầu từ Website và Telegram Bot sẽ tự động xuất hiện tại đây theo thời gian thực.
              </p>
            </div>
          ) : (
            filteredBookings.map((b) => {
              const st = STATUS_CONFIG[b.status] || STATUS_CONFIG.NEW;
              const isSelected = selectedBooking?.id === b.id;

              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#171717] border-[#007BA7] shadow-lg"
                      : "bg-[#121212] border-[#292929] hover:border-[#3F3F46]"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-lg bg-[#0A0A0A] border border-[#292929] text-xs font-mono font-bold text-[#38BDF8]">
                        {b.bookingCode}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                          b.source === "TELEGRAM"
                            ? "bg-[#007BA7]/20 text-[#38BDF8] border-[#007BA7]/40"
                            : b.source === "WEBSITE"
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                            : "bg-purple-500/15 text-purple-300 border-purple-500/30"
                        }`}
                      >
                        {b.source}
                      </span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold border ${st.badgeClass}`}
                    >
                      {st.label}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">
                    {b.projectTitle}
                  </h3>
                  <p className="text-xs text-[#007BA7] font-mono mb-3">
                    🛠 {b.serviceName} • Ngân sách: {b.budgetRange || "Thỏa thuận"}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#292929] text-xs text-[#A1A1AA]">
                    <div className="flex items-center gap-3">
                      <span className="text-white font-semibold">
                        👤 {b.customer.name}
                      </span>
                      <span>📞 {b.customer.phone || "Chưa có SĐT"}</span>
                      {b.customer.telegramUsername && (
                        <span className="text-[#38BDF8] font-mono">
                          @{b.customer.telegramUsername.replace(/^@/, "")}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[11px]">
                      {new Date(b.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Detail & Actions Panel */}
        <div className="lg:col-span-5">
          {selectedBooking ? (
            <div className="p-6 rounded-3xl bg-[#121212] border border-[#292929] sticky top-6 space-y-6">
              <div className="flex items-start justify-between gap-3 border-b border-[#292929] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-[#38BDF8]">
                      {selectedBooking.bookingCode}
                    </span>
                    <span className="text-[11px] font-mono text-[#A1A1AA]">
                      • Nguồn: {selectedBooking.source}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-white">
                    {selectedBooking.projectTitle}
                  </h2>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                    (STATUS_CONFIG[selectedBooking.status] || STATUS_CONFIG.NEW)
                      .badgeClass
                  }`}
                >
                  {
                    (STATUS_CONFIG[selectedBooking.status] || STATUS_CONFIG.NEW)
                      .label
                  }
                </span>
              </div>

              {/* Customer Info Box */}
              <div className="p-4 rounded-2xl bg-[#171717] border border-[#292929] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#007BA7]">
                    HỒ SƠ KHÁCH HÀNG ({selectedBooking.customer.code})
                  </span>
                  <Link
                    href="/admin/customers"
                    className="text-[11px] font-mono text-[#38BDF8] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Mở CRM</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <div className="text-sm font-bold text-white">
                  {selectedBooking.customer.name}
                </div>
                <div className="grid grid-cols-1 gap-1.5 text-xs text-[#A1A1AA]">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#007BA7]" />
                    <span>{selectedBooking.customer.phone || "Chưa cập nhật"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#007BA7]" />
                    <span>{selectedBooking.customer.email}</span>
                  </div>
                  {selectedBooking.customer.company && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-[#007BA7]" />
                      <span>{selectedBooking.customer.company}</span>
                    </div>
                  )}
                  {(selectedBooking.customer.telegramUsername ||
                    selectedBooking.customer.telegramUserId) && (
                    <div className="flex items-center gap-2 text-[#38BDF8] font-mono">
                      <Send className="w-3.5 h-3.5" />
                      <span>
                        Telegram:{" "}
                        {selectedBooking.customer.telegramUsername
                          ? `@${selectedBooking.customer.telegramUsername.replace(/^@/, "")}`
                          : `ID ${selectedBooking.customer.telegramUserId}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-[11px] font-mono uppercase text-[#A1A1AA] block">
                    Dịch vụ đăng ký:
                  </span>
                  <span className="text-white font-semibold">
                    {selectedBooking.serviceName}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#171717] border border-[#292929]">
                    <span className="text-[10px] font-mono uppercase text-[#A1A1AA] block">
                      Ngân sách dự kiến
                    </span>
                    <span className="text-xs font-bold text-[#FF2D95]">
                      {selectedBooking.budgetRange || "Thỏa thuận"}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#171717] border border-[#292929]">
                    <span className="text-[10px] font-mono uppercase text-[#A1A1AA] block">
                      Thời gian bắt đầu
                    </span>
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#007BA7]" />
                      {selectedBooking.preferredStartDate || "Linh hoạt"}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-mono uppercase text-[#A1A1AA] block mb-1">
                    Mô tả chi tiết nhu cầu:
                  </span>
                  <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-[#292929] text-xs text-[#E4E4E7] whitespace-pre-line leading-relaxed">
                    {selectedBooking.projectDescription}
                  </div>
                </div>
              </div>

              {/* Status & Staff Assignment Controls */}
              <div className="space-y-3 pt-3 border-t border-[#292929]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#007BA7] block">
                  CẬP NHẬT TRẠNG THÁI & PHÂN CÔNG XỬ LÝ
                </span>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "CONFIRMED", label: "✅ Xác nhận" },
                    { key: "CONSULTING", label: "💬 Đang tư vấn" },
                    { key: "QUOTATION_SENT", label: "📄 Đã báo giá" },
                    { key: "IN_PROGRESS", label: "🚀 Triển khai" },
                    { key: "COMPLETED", label: "🏆 Hoàn thành" },
                    { key: "CANCELLED", label: "❌ Hủy yêu cầu" },
                  ].map((btn) => (
                    <button
                      key={btn.key}
                      type="button"
                      disabled={isPending || selectedBooking.status === btn.key}
                      onClick={() =>
                        handleStatusChange(selectedBooking.id, btn.key)
                      }
                      className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                        selectedBooking.status === btn.key
                          ? "bg-[#007BA7] text-white border-[#007BA7]"
                          : "bg-[#171717] hover:bg-[#222222] text-[#E4E4E7] border-[#292929]"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="text-[11px] font-mono uppercase text-[#A1A1AA] block mb-1">
                    Nhân sự phụ trách:
                  </label>
                  <select
                    value={selectedBooking.assignedTo || ""}
                    onChange={(e) =>
                      handleStatusChange(
                        selectedBooking.id,
                        selectedBooking.status,
                        e.target.value
                      )
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-xs text-white focus:outline-none focus:border-[#007BA7]"
                  >
                    <option value="">-- Chọn chuyên gia phụ trách --</option>
                    {staffUsers.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name} ({u.roleName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* One-Click Workflow Conversions */}
              <div className="space-y-2.5 pt-3 border-t border-[#292929]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF2D95] block">
                  CHUYỂN ĐỔI QUY TRÌNH TỰ ĐỘNG
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleConvertQuotation(selectedBooking.id)}
                    className="px-4 py-2.5 rounded-xl bg-[#171717] hover:bg-[#FF2D95]/20 text-white border border-[#292929] hover:border-[#FF2D95] text-xs font-mono font-bold inline-flex items-center justify-center gap-2 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#FF2D95]" />
                    <span>Tạo Báo Giá (Quote)</span>
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleConvertProject(selectedBooking.id)}
                    className="px-4 py-2.5 rounded-xl bg-[#007BA7] hover:bg-[#008fc2] text-white text-xs font-mono font-bold inline-flex items-center justify-center gap-2 transition-all"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Chuyển Thành Dự Án</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-[#121212] border border-[#292929] text-center text-sm text-[#A1A1AA]">
              Chọn một yêu cầu đặt dịch vụ bên trái để xem chi tiết và xử lý.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create New Booking from CRM Admin */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl bg-[#121212] border border-[#292929] p-6 md:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#292929] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#007BA7] block">
                  CRM DIRECT ENTRY
                </span>
                <h3 className="text-lg font-black text-white uppercase">
                  Tạo Yêu Cầu Đặt Dịch Vụ Mới
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-xl bg-[#171717] text-[#A1A1AA] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-[#A1A1AA] block mb-1">
                    Họ và tên khách hàng *
                  </label>
                  <input
                    name="fullName"
                    required
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#A1A1AA] block mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    name="phone"
                    required
                    placeholder="0987654321"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-[#A1A1AA] block mb-1">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="client@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#A1A1AA] block mb-1">
                    Công ty / Thương hiệu
                  </label>
                  <input
                    name="companyName"
                    placeholder="Tập đoàn ABC"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-[#A1A1AA] block mb-1">
                  Dịch vụ quan tâm *
                </label>
                <select
                  name="serviceId"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-sm text-white"
                >
                  <option value="">-- Tư vấn giải pháp tổng thể --</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      [{s.group}] {s.title} ({s.priceLabel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-[#A1A1AA] block mb-1">
                    Tên dự án *
                  </label>
                  <input
                    name="projectTitle"
                    required
                    placeholder="Thiết kế Website Luxury"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#A1A1AA] block mb-1">
                    Ngân sách dự kiến
                  </label>
                  <input
                    name="budgetRange"
                    placeholder="50 - 150 triệu VNĐ"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-[#A1A1AA] block mb-1">
                  Mô tả chi tiết yêu cầu *
                </label>
                <textarea
                  name="projectDescription"
                  required
                  rows={4}
                  placeholder="Ghi chú phạm vi công việc, tính năng mong muốn..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-sm text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#171717] text-xs font-mono text-[#A1A1AA]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-xl bg-[#007BA7] hover:bg-[#008fc2] text-white text-xs font-mono font-bold uppercase"
                >
                  {isPending ? "Đang lưu..." : "Lưu & Gửi Thông Báo Telegram"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

