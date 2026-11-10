"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ArrowUpRight,
  ChevronDown,
  Bot,
  User,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Zap,
} from "lucide-react";

interface MascotProps {
  settings?: {
    mascotEnabled?: boolean;
    mascotName?: string;
    mascotTitle?: string;
    mascotGreeting?: string;
    mascotImage?: string;
    mascotAnimationEnabled?: boolean;
    mascotSizeDesktop?: number;
    mascotPosition?: string;
  };
}

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  quickReplies?: string[];
  showLeadForm?: boolean;
}

function parseInlineSpans(text: string): React.ReactNode[] {
  // Regex matches bold **text** or code `code`
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold text-white tracking-wide">
          {boldText}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      const codeText = part.slice(1, -1);
      return (
        <span
          key={index}
          className="inline-flex items-center px-2 py-0.5 my-0.5 rounded-md bg-[#007BA7]/20 border border-[#007BA7]/40 text-[#38BDF8] font-mono text-[11px] font-bold shadow-sm select-all"
        >
          {codeText}
        </span>
      );
    }
    // Clean any stray asterisks or backticks just in case
    const cleanText = part.replace(/\*\*/g, "").replace(/`/g, "");
    return <span key={index}>{cleanText}</span>;
  });
}

function renderSuccessConfirmationCard(text: string) {
  // Extract info
  const leadMatch = text.match(/LEAD-[A-Za-z0-9_-]+/);
  const bookingMatch = text.match(/NA-[A-Za-z0-9_-]+/);
  const nameMatch = text.match(/Cảm ơn\s+\*\*?([^*!\n]+)\*\*?!/i);
  const serviceMatch = text.match(/dịch vụ\s+\*\*?([^*.\n]+)\*\*?/i);

  const customerName = nameMatch ? nameMatch[1].trim() : "Quý khách";
  const serviceName = serviceMatch ? serviceMatch[1].trim() : "Dịch vụ NGUYÊN AGENCY";
  const leadCode = leadMatch ? leadMatch[0] : "";
  const bookingCode = bookingMatch ? bookingMatch[0] : "";

  return (
    <div className="space-y-3.5">
      {/* Header Banner */}
      <div className="flex items-center gap-3 pb-3 border-b border-[#2A2A38]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/25 to-[#007BA7]/20 border border-emerald-500/40 flex items-center justify-center text-lg shadow-inner shrink-0">
          🎉
        </div>
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <span>Tiếp Nhận Thành Công</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="text-[11px] text-[#A1A1AA] mt-0.5">
            Hồ sơ tư vấn đã chuyển đến chuyên viên phụ trách
          </div>
        </div>
      </div>

      {/* Greeting info */}
      <p className="text-xs text-[#E4E4E7] leading-relaxed">
        Cảm ơn <span className="font-bold text-white">{customerName}</span>! Hồ sơ của bạn đã được chuyển đến chuyên viên phụ trách dịch vụ{" "}
        <span className="font-semibold text-[#38BDF8]">{serviceName}</span>.
      </p>

      {/* Codes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {leadCode && (
          <div className="p-2.5 rounded-xl bg-[#0D0D12] border border-[#2A2A38] hover:border-[#007BA7]/50 transition-colors flex flex-col">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#71717A] mb-1">
              Mã Lead CRM
            </span>
            <span className="font-mono text-xs font-bold text-[#38BDF8] tracking-wider select-all">
              {leadCode}
            </span>
          </div>
        )}
        {bookingCode && (
          <div className="p-2.5 rounded-xl bg-[#0D0D12] border border-[#2A2A38] hover:border-[#FF2D95]/50 transition-colors flex flex-col">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#71717A] mb-1">
              Mã Đặt Lịch
            </span>
            <span className="font-mono text-xs font-bold text-[#FF2D95] tracking-wider select-all">
              {bookingCode}
            </span>
          </div>
        )}
      </div>

      {/* SLA / Commitment Note */}
      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-2.5 text-[11px] text-emerald-300">
        <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
        <span className="leading-relaxed">
          Đội ngũ chuyên gia NGUYÊN AGENCY sẽ liên hệ với bạn trong vòng <strong className="text-white font-bold">15 - 30 phút</strong>.
        </span>
      </div>

      <div className="text-[11px] text-[#A1A1AA] pt-0.5 flex items-center justify-between">
        <span>Chúc bạn một ngày tràn đầy năng lượng!</span>
        <span className="text-sm">🦅</span>
      </div>
    </div>
  );
}

function renderBotMessageContent(text: string) {
  if (
    text.includes("TIẾP NHẬN YÊU CẦU THÀNH CÔNG") ||
    (text.includes("Mã Lead CRM") && text.includes("Mã Đặt Lịch"))
  ) {
    return renderSuccessConfirmationCard(text);
  }

  const lines = text.split("\n");

  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Bullet point lines
        if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
          const content = trimmed.replace(/^[•\-]\s*/, "");
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-0.5 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#007BA7] shrink-0 mt-1.5 shadow-[0_0_8px_rgba(0,123,167,0.8)]" />
              <div className="flex-1 text-xs text-[#E4E4E7] leading-relaxed">
                {parseInlineSpans(content)}
              </div>
            </div>
          );
        }

        // Title / Header line (begins with emoji or ends with colon)
        const isHeader =
          /^[🎨📢💻⚡🧪💰💬✨🦅🎉]/.test(trimmed) && trimmed.endsWith(":");
        if (isHeader) {
          return (
            <div
              key={idx}
              className="text-xs font-bold text-white tracking-wide pb-1.5 mb-1 border-b border-white/10 flex items-center gap-1.5"
            >
              {parseInlineSpans(trimmed)}
            </div>
          );
        }

        // Standard text line
        return (
          <div key={idx} className="text-xs text-[#E4E4E7] leading-relaxed">
            {parseInlineSpans(trimmed)}
          </div>
        );
      })}
    </div>
  );
}

const KNOWLEDGE_RESPONSES: Record<string, { reply: string; link?: { text: string; href: string } }> = {
  branding: {
    reply:
      "🎨 Dịch Vụ Thiết Kế Thương Hiệu Độc Bản (Luxury Branding):\n" +
      "• Định hình bản sắc thị giác, logo vector độc quyền, bộ quy chuẩn Brand Guidelines 120+ trang.\n" +
      "• Thiết kế ấn phẩm POSM, bao bì sang trọng, profile doanh nghiệp.\n" +
      "• Thời gian hoàn thành: 2 - 3 tuần.\n" +
      "• Ngân sách đầu tư từ: 30.000.000 VNĐ.",
    link: { text: "Xem chi tiết dịch vụ Branding", href: "/services/luxury-brand-identity" },
  },
  marketing: {
    reply:
      "📢 Dịch Vụ Truyền Thông & Digital Marketing:\n" +
      "• Chiến lược truyền thông đa kênh, sản xuất Video Motion 3D CGI, TVC điện ảnh.\n" +
      "• Tối ưu phễu chuyển đổi quảng cáo Meta Ads, Google Ads và tăng trưởng doanh thu.\n" +
      "• Báo cáo Attribution tự động mỗi ngày minh bạch 100%.",
    link: { text: "Xem các giải pháp Media & Ads", href: "/services?group=MEDIA" },
  },
  web3d: {
    reply:
      "💻 Thiết Kế & Lập Trình Website 3D Three.js (Flagship):\n" +
      "• Tiên phong ứng dụng WebGL / Three.js tạo không gian 3D tương tác chân thực chuẩn Luxury Brand.\n" +
      "• Tối ưu hiệu năng 60 FPS mượt mà trên cả máy tính lẫn điện thoại.\n" +
      "• Bàn giao 100% mã nguồn, chuẩn SEO quốc tế và tốc độ tải trang dưới 1.2s.",
    link: { text: "Khám phá dịch vụ Web 3D", href: "/services/3d-website-development" },
  },
  saas: {
    reply:
      "⚡ Lập Trình Web App & Hệ Thống SaaS Doanh Nghiệp:\n" +
      "• Kiến trúc Next.js Serverless cao cấp, cơ sở dữ liệu phân tán bảo mật chuẩn ISO.\n" +
      "• Tích hợp CRM nội bộ, quản trị đơn hàng, xuất hóa đơn tự động và phân quyền RBAC.\n" +
      "• Khả năng chịu tải hàng triệu người dùng đồng thời.",
    link: { text: "Xem nền tảng Web App & SaaS", href: "/services/saas-web-application" },
  },
  lab: {
    reply:
      "🧪 Phòng Nghiên Cứu NGUYÊN LAB (AI & Công Cụ Số):\n" +
      "• Nghiên cứu và thương mại hóa các mô hình Generative AI, Fine-tune LLM chuyên biệt.\n" +
      "• Trợ lý AI tự động hóa chăm sóc khách hàng 24/7.\n" +
      "• Các sản phẩm phần mềm SaaS độc quyền do đội ngũ kỹ sư NGUYÊN LAB phát triển.",
    link: { text: "Ghé thăm phòng LAB số", href: "/lab" },
  },
  pricing: {
    reply:
      "💰 Bảng Giá & Quy Trình Đầu Tư Minh Bạch:\n" +
      "• Dịch vụ Branding: từ 30M VNĐ.\n" +
      "• Dịch vụ Website 3D / Web App: từ 45M - 60M VNĐ.\n" +
      "• Thanh toán 3 đợt linh hoạt (40% - 40% - 20%). Bàn giao 100% mã nguồn và bảo hành kỹ thuật 12 tháng.\n" +
      "Bạn có muốn điền biểu mẫu để nhận báo giá chi tiết trong vòng 24 giờ không?",
    link: { text: "Xem bảng giá chi tiết", href: "/pricing" },
  },
  consultant: {
    reply:
      "💬 Kết Nối Trực Tiếp Với Đội Ngũ Chuyên Gia:\n" +
      "• Hotline tư vấn 24/7: +84 344 979 307 (Hỗ trợ Zalo Official & WhatsApp)\n" +
      "• Email liên hệ: contact@nguyenagency.vn (Phản hồi kèm NDA bảo mật)\n" +
      "• Địa chỉ: TP. Quảng Ngãi - TP. Hồ Chí Minh (Tiếp đón tại Executive Studio Suite theo lịch hẹn)\n" +
      "• Zalo: https://zalo.me/0344979307\n" +
      "• Facebook Fanpage: https://www.facebook.com/nguyenads7\n" +
      "Hoặc bạn có thể gửi yêu cầu báo giá ngay trong ô bên dưới để chuyên viên liên hệ trong 15 phút!",
    link: { text: "Trang liên hệ chính thức", href: "/contact" },
  },
};

export default function MascotSupportAssistant({ settings }: MascotProps) {
  const pathname = usePathname();

  // Hide on admin portal to not interfere with CRM screens
  const isAdmin = pathname?.toLowerCase().startsWith("/admin");

  const isEnabled = settings?.mascotEnabled !== false;
  const mascotName = settings?.mascotName || "NGUYÊN AI ASSISTANT";
  const mascotTitle = settings?.mascotTitle || "Trợ lý trực tuyến";
  const mascotGreeting =
    settings?.mascotGreeting ||
    "Xin chào! 👋 Mình là trợ lý NGUYÊN AGENCY. Bạn đang cần giải pháp truyền thông hay lập trình website?";
  const mascotImage = settings?.mascotImage || "/assets/mascot/mascot.webp";
  const isAnimationEnabled = settings?.mascotAnimationEnabled !== false;
  const mascotSize = settings?.mascotSizeDesktop || 120;

  const [isOpen, setIsOpen] = useState(false);
  const [showWelcomeBubble, setShowWelcomeBubble] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  // Chat message state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // In-chat consultation form state
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formService, setFormService] = useState("Thiết kế Website 3D Three.js");
  const [formBudget, setFormBudget] = useState("50M - 100M VNĐ");
  const [formNote, setFormNote] = useState("");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formFeedback, setFormFeedback] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize initial message
  useEffect(() => {
    setMessages([
      {
        id: "msg_init_1",
        sender: "bot",
        text:
          "Xin chào! Mình là " +
          mascotName +
          " – Trợ lý đại bàng số của NGUYÊN AGENCY. 🦅\n\n" +
          "Mình có thể giải đáp chi tiết về 24 dịch vụ MEDIA & TECH, công nghệ Three.js, bảng giá đầu tư hoặc tiếp nhận yêu cầu báo giá cho bạn.",
        time: "Vừa xong",
      },
    ]);
  }, [mascotName]);

  // Show welcome bubble after 2 seconds
  useEffect(() => {
    if (isAdmin || !isEnabled) return;
    const timer = setTimeout(() => {
      if (!hasInteracted && !isOpen) {
        setShowWelcomeBubble(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAdmin, isEnabled, hasInteracted, isOpen]);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen, showForm]);

  if (isAdmin || !isEnabled) {
    return null;
  }

  function handleOpenChat() {
    setIsOpen(true);
    setShowWelcomeBubble(false);
    setHasInteracted(true);
    setUnreadCount(0);
  }

  function handleCloseChat() {
    setIsOpen(false);
  }

  function triggerBotReply(userText: string) {
    const textLower = userText.toLowerCase();
    let matchedKey: string | null = null;

    if (textLower.includes("thương hiệu") || textLower.includes("brand") || textLower.includes("logo")) {
      matchedKey = "branding";
    } else if (textLower.includes("marketing") || textLower.includes("quảng cáo") || textLower.includes("media") || textLower.includes("tvc")) {
      matchedKey = "marketing";
    } else if (textLower.includes("3d") || textLower.includes("web") || textLower.includes("three")) {
      matchedKey = "web3d";
    } else if (textLower.includes("saas") || textLower.includes("app") || textLower.includes("phần mềm") || textLower.includes("crm")) {
      matchedKey = "saas";
    } else if (textLower.includes("lab") || textLower.includes("ai") || textLower.includes("nghiên cứu")) {
      matchedKey = "lab";
    } else if (textLower.includes("giá") || textLower.includes("chi phí") || textLower.includes("ngân sách") || textLower.includes("price")) {
      matchedKey = "pricing";
    } else if (textLower.includes("liên hệ") || textLower.includes("tư vấn") || textLower.includes("gặp") || textLower.includes("hotline") || textLower.includes("số điện thoại")) {
      matchedKey = "consultant";
    }

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      if (matchedKey && KNOWLEDGE_RESPONSES[matchedKey]) {
        const item = KNOWLEDGE_RESPONSES[matchedKey];
        setMessages((prev) => [
          ...prev,
          {
            id: `msg_bot_${Date.now()}`,
            sender: "bot",
            text: item.reply,
            time: "Bây giờ",
          },
        ]);
      } else {
        // Default smart reply
        setMessages((prev) => [
          ...prev,
          {
            id: `msg_bot_${Date.now()}`,
            sender: "bot",
            text:
              "Cảm ơn câu hỏi của bạn! Với yêu cầu này, chuyên gia giải pháp của NGUYÊN AGENCY sẽ tư vấn chi tiết cho bạn.\n\n" +
              "Bạn có thể chọn nhanh các chủ đề bên dưới hoặc để lại thông tin để nhận phản hồi trong 15 phút nhé!",
            time: "Bây giờ",
          },
        ]);
      }
    }, 850);
  }

  function handleSendUserMessage(textToSend?: string) {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const newMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: "user",
      text,
      time: "Vừa xong",
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");
    triggerBotReply(text);
  }

  async function handleSubmitConsultationForm(e: React.FormEvent) {
    e.preventDefault();
    if (!formEmail && !formPhone) {
      setFormFeedback("Vui lòng cung cấp ít nhất Email hoặc Số điện thoại để chúng mình liên hệ nhé!");
      return;
    }

    setIsSubmittingForm(true);
    setFormFeedback("");

    try {
      const res = await fetch("/api/mascot/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName || "Khách Hàng Mascot Chat",
          phone: formPhone,
          email: formEmail,
          serviceInterest: formService,
          budget: formBudget,
          message: formNote || "Khách hàng yêu cầu tư vấn trực tiếp qua Mascot Chatbot.",
          chatHistory: messages.map((m) => ({ role: m.sender, content: m.text })),
        }),
      });

      const data = await res.json();
      setIsSubmittingForm(false);

      if (data.ok) {
        setFormSubmitted(true);
        setMessages((prev) => [
          ...prev,
          {
            id: `msg_confirm_${Date.now()}`,
            sender: "bot",
            text:
              `🎉 TIẾP NHẬN YÊU CẦU THÀNH CÔNG!\n\n` +
              `Cảm ơn ${formName || "quý khách"}! Hồ sơ tư vấn của bạn đã được chuyển đến chuyên viên phụ trách dịch vụ ${formService}.\n\n` +
              `• Mã Lead CRM: \`${data.leadCode}\`\n` +
              `• Mã Đặt Lịch: \`${data.bookingCode}\`\n\n` +
              `Đội ngũ NGUYÊN AGENCY sẽ liên hệ với bạn trong vòng 15 - 30 phút theo thông tin bạn đã gửi. Chúc bạn một ngày tràn đầy năng lượng! 🦅`,
            time: "Vừa xong",
          },
        ]);
        setShowForm(false);
      } else {
        setFormFeedback(data.error || "Gửi thất bại, vui lòng thử lại sau.");
      }
    } catch {
      setIsSubmittingForm(false);
      setFormFeedback("Không thể kết nối máy chủ, vui lòng thử lại.");
    }
  }

  const QUICK_TOPICS = [
    { label: "🎨 Thiết Kế Thương Hiệu", action: () => handleSendUserMessage("Tư vấn dịch vụ Thiết kế thương hiệu") },
    { label: "💻 Website 3D Three.js", action: () => handleSendUserMessage("Tư vấn thiết kế Website 3D Three.js") },
    { label: "⚡ Web App & SaaS", action: () => handleSendUserMessage("Tư vấn phần mềm Web Application & SaaS") },
    { label: "📢 Media & Ads Marketing", action: () => handleSendUserMessage("Tư vấn giải pháp Media và Digital Marketing") },
    { label: "💰 Bảng Giá Dịch Vụ", action: () => handleSendUserMessage("Bảng giá các gói dịch vụ là bao nhiêu?") },
    { label: "🧪 Trải Nghiệm Digital LAB", action: () => handleSendUserMessage("Giới thiệu về các sản phẩm AI của phòng LAB") },
    { label: "📑 Đặt Dịch Vụ / Báo Giá", action: () => setShowForm(true) },
    { label: "📞 Gặp Chuyên Viên Tư Vấn", action: () => handleSendUserMessage("Tôi muốn liên hệ gặp nhân viên tư vấn") },
  ];

  return (
    <>
      <style jsx global>{`
        @keyframes mascotHoverBob {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-9px) rotate(1.8deg);
          }
        }
        @keyframes mascotAuraPulse {
          0%, 100% {
            transform: scale(0.95);
            opacity: 0.35;
          }
          50% {
            transform: scale(1.18);
            opacity: 0.75;
          }
        }
        .mascot-animated {
          animation: mascotHoverBob 3.6s ease-in-out infinite;
        }
        .mascot-glow {
          animation: mascotAuraPulse 3.2s ease-in-out infinite;
        }
      `}</style>

      {/* Floating Mascot Container */}
      <aside
        aria-label="Trợ lý khách hàng NGUYÊN AI"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end select-none pointer-events-auto"
      >
        {/* Welcome Speech Bubble */}
        {showWelcomeBubble && !isOpen && (
          <div className="relative mb-3 max-w-[280px] sm:max-w-[320px] p-4 rounded-2xl bg-[#121215]/95 backdrop-blur-xl border border-[#007BA7]/50 shadow-[0_16px_36px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* Close bubble button */}
            <button
              onClick={() => setShowWelcomeBubble(false)}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#1e1e24] border border-[#2e2e38] text-white/70 hover:text-white flex items-center justify-center text-xs shadow-md transition-colors"
              title="Đóng thông báo"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-start gap-2.5">
              <span className="text-xl">🦅</span>
              <div>
                <p className="text-xs text-white leading-relaxed font-sans">{mascotGreeting}</p>
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    onClick={handleOpenChat}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white text-[11px] font-mono font-bold uppercase tracking-wider shadow-sm hover:brightness-110 transition-all flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Nhắn tin ngay</span>
                  </button>
                  <button
                    onClick={() => setShowWelcomeBubble(false)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#1c1c22] text-[#A1A1AA] hover:text-white text-[11px] font-mono transition-colors"
                  >
                    Để sau
                  </button>
                </div>
              </div>
            </div>

            {/* Bubble arrow pointing to mascot */}
            <div className="absolute -bottom-2 right-12 w-4 h-4 bg-[#121215] border-r border-b border-[#007BA7]/50 rotate-45 transform" />
          </div>
        )}

        {/* Mascot Avatar Button */}
        {!isOpen && (
          <div className="relative group cursor-pointer" onClick={handleOpenChat}>
            {/* Ambient Multi-layer Glow */}
            {isAnimationEnabled && (
              <div
                className="mascot-glow absolute -inset-3 rounded-full blur-2xl pointer-events-none opacity-50 transition-opacity group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle, rgba(0, 123, 167, 0.6) 0%, rgba(255, 45, 149, 0.35) 45%, transparent 70%)",
                }}
              />
            )}

            {/* Online Green Indicator Dot */}
            <div className="absolute top-2 right-3 z-20 flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 border border-[#0A0A0A]" />
            </div>

            {/* Unread Message Pill Badge */}
            {unreadCount > 0 && (
              <div className="absolute -top-1 left-2 z-20 px-2 py-0.5 rounded-full bg-[#FF2D95] text-white text-[10px] font-mono font-bold shadow-lg animate-pulse">
                Hỗ trợ 24/7
              </div>
            )}

            {/* Mascot Image with Interactive Float/Hover */}
            <div
              className={`relative transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-2 group-active:scale-95 ${
                isAnimationEnabled ? "mascot-animated" : ""
              }`}
              style={{
                width: `${mascotSize}px`,
                maxWidth: "140px",
                minWidth: "75px",
              }}
            >
              <Image
                src={mascotImage}
                alt="NGUYÊN AGENCY Mascot Assistant"
                width={280}
                height={290}
                priority
                className="w-full h-auto drop-shadow-[0_12px_24px_rgba(0,123,167,0.4)] pointer-events-none"
              />
            </div>

            {/* Bottom Floating Tag Label */}
            <div className="mt-1 px-3 py-1 rounded-full bg-[#121215]/90 border border-[#2a2a35] text-white shadow-xl flex items-center justify-center gap-1.5 backdrop-blur-md group-hover:border-[#007BA7] transition-all">
              <Sparkles className="w-3 h-3 text-[#38BDF8]" />
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-white/90">
                NGUYÊN AI
              </span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* INTERACTIVE CHAT WINDOW (DRAWER) */}
        {/* ======================================================== */}
        {isOpen && (
          <div
            className="w-[360px] sm:w-[410px] max-w-[calc(100vw-32px)] h-[580px] max-h-[82vh] rounded-3xl bg-[#0F0F13]/95 backdrop-blur-2xl border border-[#2a2a35] shadow-[0_24px_64px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="p-4 bg-[#14141A] border-b border-[#24242E] flex items-center justify-between relative">
              {/* Accent top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#007BA7] via-[#FF2D95] to-[#38BDF8]" />

              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#007BA7] to-[#FF2D95] p-[1.5px] shrink-0">
                  <div className="w-full h-full bg-[#0A0A0A] rounded-[14px] overflow-hidden flex items-center justify-center">
                    <Image
                      src={mascotImage}
                      alt="Avatar"
                      width={44}
                      height={44}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#14141A]" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold font-mono tracking-wider text-white uppercase">
                      {mascotName}
                    </h3>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#007BA7]/20 text-[#38BDF8] border border-[#007BA7]/30">
                      AI 24/7
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A1A1AA] flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{mascotTitle} • Phản hồi tức thì</span>
                  </p>
                </div>
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="p-2 rounded-xl bg-[#1c1c24] hover:bg-[#252530] text-[#38BDF8] text-xs font-mono transition-colors flex items-center gap-1"
                  title="Nhận báo giá nhanh"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline">Báo giá</span>
                </button>
                <button
                  onClick={handleCloseChat}
                  className="p-2 rounded-xl bg-[#1c1c24] hover:bg-[#252530] text-[#A1A1AA] hover:text-white transition-colors"
                  title="Thu nhỏ cửa sổ"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {messages.map((msg) => {
                const isBot = msg.sender === "bot";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isBot ? "" : "flex-row-reverse"}`}
                  >
                    {isBot && (
                      <div className="w-7 h-7 rounded-full bg-[#181820] border border-[#2d2d38] overflow-hidden shrink-0 mt-0.5">
                        <Image
                          src={mascotImage}
                          alt="Mascot"
                          width={28}
                          height={28}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}

                    <div
                      className={`max-w-[88%] rounded-2xl p-4 leading-relaxed shadow-lg transition-all ${
                        isBot
                          ? "bg-[#14141D] border border-[#262638] text-[#E4E4E7] rounded-tl-sm hover:border-[#007BA7]/40 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
                          : "bg-gradient-to-r from-[#007BA7] to-[#005f82] text-white ml-auto rounded-tr-sm shadow-md"
                      }`}
                    >
                      {isBot ? (
                        renderBotMessageContent(msg.text)
                      ) : (
                        <div className="text-xs leading-relaxed font-sans">{msg.text}</div>
                      )}
                      <span className="text-[9px] font-mono text-white/40 block mt-2 text-right">
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Bot typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-[#71717A] text-xs p-2">
                  <div className="w-6 h-6 rounded-full bg-[#181820] flex items-center justify-center">
                    <Bot className="w-3 h-3 text-[#38BDF8]" />
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#007BA7] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#007BA7] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#007BA7] animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-[10px] font-mono">NGUYÊN AI đang soạn tin...</span>
                </div>
              )}

              {/* Embedded In-Chat Quote Request Form */}
              {showForm && (
                <div className="p-4 rounded-2xl bg-[#14141C] border border-[#007BA7]/60 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-[#242430]">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#FF2D95]" />
                      <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        ĐẶT DỊCH VỤ & NHẬN BÁO GIÁ
                      </span>
                    </div>
                    <button
                      onClick={() => setShowForm(false)}
                      className="text-[#71717A] hover:text-white text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {formFeedback && (
                    <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-[11px]">
                      {formFeedback}
                    </div>
                  )}

                  <form onSubmit={handleSubmitConsultationForm} className="space-y-2.5">
                    <div>
                      <label className="block text-[10px] font-mono text-[#A1A1AA] uppercase mb-1">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="VD: Nguyễn Văn A"
                        className="w-full px-3 py-2 rounded-xl bg-[#1b1b24] border border-[#2e2e3d] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-mono text-[#A1A1AA] uppercase mb-1">
                          Số điện thoại *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                          placeholder="0344xxxxxx"
                          className="w-full px-3 py-2 rounded-xl bg-[#1b1b24] border border-[#2e2e3d] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-[#A1A1AA] uppercase mb-1">
                          Email nhận báo giá *
                        </label>
                        <input
                          type="email"
                          required
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="w-full px-3 py-2 rounded-xl bg-[#1b1b24] border border-[#2e2e3d] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-mono text-[#A1A1AA] uppercase mb-1">
                          Dịch vụ quan tâm
                        </label>
                        <select
                          value={formService}
                          onChange={(e) => setFormService(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-xl bg-[#1b1b24] border border-[#2e2e3d] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                        >
                          <option value="Thiết kế Website 3D Three.js">Website 3D Three.js</option>
                          <option value="Nhận diện thương hiệu Luxury">Branding Thương Hiệu</option>
                          <option value="Web Application & SaaS">Web App & SaaS</option>
                          <option value="Sản xuất TVC & Video 3D CGI">TVC / Video 3D CGI</option>
                          <option value="Tích hợp AI & NGUYÊN LAB">Tích hợp Trí tuệ AI</option>
                          <option value="Marketing Tăng Trưởng Doanh Thu">Digital Marketing</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-[#A1A1AA] uppercase mb-1">
                          Ngân sách dự kiến
                        </label>
                        <select
                          value={formBudget}
                          onChange={(e) => setFormBudget(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-xl bg-[#1b1b24] border border-[#2e2e3d] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                        >
                          <option value="20M - 50M VNĐ">20M - 50M VNĐ</option>
                          <option value="50M - 100M VNĐ">50M - 100M VNĐ</option>
                          <option value="100M - 200M VNĐ">100M - 200M VNĐ</option>
                          <option value="> 200M VNĐ (Enterprise)">&gt; 200M VNĐ (Enterprise)</option>
                          <option value="Thỏa thuận theo giải pháp">Thỏa thuận</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-[#A1A1AA] uppercase mb-1">
                        Mô tả yêu cầu ngắn
                      </label>
                      <textarea
                        rows={2}
                        value={formNote}
                        onChange={(e) => setFormNote(e.target.value)}
                        placeholder="Mô tả bài toán của bạn..."
                        className="w-full px-3 py-1.5 rounded-xl bg-[#1b1b24] border border-[#2e2e3d] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingForm}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmittingForm ? "Đang gửi CRM..." : "Gửi Ngay Cho Chuyên Gia"}</span>
                    </button>
                  </form>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="px-3 py-2 bg-[#121217] border-t border-[#1e1e28] overflow-x-auto">
              <div className="flex items-center gap-1.5 pb-1">
                {QUICK_TOPICS.map((topic, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={topic.action}
                    className="px-2.5 py-1 rounded-full bg-[#191922] hover:bg-[#222230] hover:text-[#38BDF8] text-[10px] font-mono whitespace-nowrap text-[#A1A1AA] border border-[#292938] transition-colors shrink-0"
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 bg-[#14141A] border-t border-[#24242E] flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendUserMessage();
                  }
                }}
                placeholder="Hỏi về dịch vụ, Three.js, báo giá..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#1a1a23] border border-[#2a2a38] text-white text-xs focus:outline-none focus:border-[#007BA7] placeholder:text-[#666675]"
              />
              <button
                type="button"
                onClick={() => handleSendUserMessage()}
                disabled={!inputValue.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white disabled:opacity-40 hover:brightness-110 transition-all shadow-md shrink-0"
                title="Gửi tin nhắn"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
