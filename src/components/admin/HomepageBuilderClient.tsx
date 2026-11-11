"use client";

import React, { useState } from "react";
import {
  saveHomepageSection,
  toggleHomepageSection,
  reorderHomepageSections,
  deleteHomepageSection,
} from "@/app/actions/admin-homepage-actions";
import AIWriterModal from "@/components/admin/AIWriterModal";
import ImageUploadField from "@/components/admin/ImageUploadField";
import {
  LayoutTemplate,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ExternalLink,
  Check,
  AlertTriangle,
  X,
  Sparkles,
  Image as ImageIcon,
  Layers,
  Play,
} from "lucide-react";

interface HomepageSectionItem {
  id: string;
  sectionKey: string;
  name: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  content?: string | null;
  mediaUrl?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  order: number;
  isActive: boolean;
  updatedAt: Date | string;
}

const DEFAULT_HERO_CARDS = [
  {
    title: "Thiết kế Website",
    desc: "Chuẩn SEO - Hiệu quả",
  },
  {
    title: "Marketing Online",
    desc: "Tăng nhận diện - Thu hút khách",
  },
  {
    title: "Giải pháp AI & Automation",
    desc: "Tối ưu vận hành - Bứt phá hiệu suất",
  },
];

function parseJsonContent(raw?: string | null): any {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export default function HomepageBuilderClient({
  initialSections,
}: {
  initialSections: HomepageSectionItem[];
}) {
  const [sections, setSections] = useState<HomepageSectionItem[]>(
    [...initialSections].sort((a, b) => a.order - b.order)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HomepageSectionItem | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<HomepageSectionItem | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  // Track current sectionKey in modal to toggle Hero-specific fields
  const [activeKey, setActiveKey] = useState<string>("");

  function handleApplyAI(aiData: any) {
    setEditingItem((prev: any) => ({
      ...prev,
      name: aiData.name || prev?.name || "",
      title: aiData.title || prev?.title || "",
      subtitle: aiData.subtitle || prev?.subtitle || "",
      description: aiData.description || prev?.description || "",
      ctaText: aiData.ctaText || prev?.ctaText || "",
      ctaLink: aiData.ctaLink || prev?.ctaLink || "",
    }));
    setFormKey((k) => k + 1);
  }

  function handleOpenCreate() {
    setEditingItem(null);
    setActiveKey("");
    setErrorMsg("");
    setFormKey((k) => k + 1);
    setIsModalOpen(true);
  }

  function handleOpenEdit(sec: HomepageSectionItem) {
    setEditingItem(sec);
    setActiveKey(sec.sectionKey || "");
    setErrorMsg("");
    setFormKey((k) => k + 1);
    setIsModalOpen(true);
  }

  function handleQuickEditHero() {
    const heroSec = sections.find((s) => s.sectionKey === "HERO");
    if (heroSec) {
      handleOpenEdit(heroSec);
    } else {
      setEditingItem({
        id: "",
        sectionKey: "HERO",
        name: "01. Hero Banner & Mascot",
        title: "VƯỢT CHUẨN SỐ HOÁ.",
        subtitle: "01 • KIẾN TẠO. PHÁT TRIỂN. CHUYỂN HÓA.",
        description:
          "Đối tác sáng tạo & công nghệ, đồng hành cùng doanh nghiệp xây dựng thương hiệu, tăng trưởng và chuyển đổi số bền vững.",
        mediaUrl: "/images/mascot-character-transparent-v2.png",
        ctaText: "XEM DỰ ÁN",
        ctaLink: "/portfolio",
        order: 1,
        isActive: true,
        updatedAt: new Date(),
      });
      setActiveKey("HERO");
      setErrorMsg("");
      setFormKey((k) => k + 1);
      setIsModalOpen(true);
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    if (editingItem?.id) {
      formData.append("id", editingItem.id);
    }

    const secKey = formData.get("sectionKey")?.toString().trim() || "";

    // Nếu là HERO section, đóng gói các trường mở rộng (Huy hiệu, Dòng 1, 3 Thẻ Dịch Vụ, Video, Blend Mode) vào JSON `content`
    if (secKey === "HERO") {
      const existingContent = parseJsonContent(editingItem?.content);
      const badgeBrand =
        formData.get("hero_badgeBrand")?.toString().trim() || "NGUYÊN AGENCY";
      const brandHeadline =
        formData.get("hero_brandHeadline")?.toString().trim() || "NGUYÊN AGENCY";
      const blendMode =
        formData.get("hero_blendMode")?.toString() === "normal"
          ? "normal"
          : "screen";
      const videoBtnText =
        formData.get("hero_videoBtnText")?.toString().trim() ||
        "Xem video giới thiệu";
      const videoUrl =
        formData.get("hero_videoUrl")?.toString().trim() ||
        "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1";

      const cards = [
        {
          title:
            formData.get("card_0_title")?.toString().trim() ||
            DEFAULT_HERO_CARDS[0].title,
          desc:
            formData.get("card_0_desc")?.toString().trim() ||
            DEFAULT_HERO_CARDS[0].desc,
        },
        {
          title:
            formData.get("card_1_title")?.toString().trim() ||
            DEFAULT_HERO_CARDS[1].title,
          desc:
            formData.get("card_1_desc")?.toString().trim() ||
            DEFAULT_HERO_CARDS[1].desc,
        },
        {
          title:
            formData.get("card_2_title")?.toString().trim() ||
            DEFAULT_HERO_CARDS[2].title,
          desc:
            formData.get("card_2_desc")?.toString().trim() ||
            DEFAULT_HERO_CARDS[2].desc,
        },
      ];

      const heroContentObj = {
        ...existingContent,
        badgeBrand,
        brandHeadline,
        blendMode,
        videoBtnText,
        videoUrl,
        cards,
      };

      formData.set("content", JSON.stringify(heroContentObj));
    }

    const res = await saveHomepageSection(formData);
    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      setSuccessMsg("Đã lưu và xuất bản thay đổi lên trang chủ!");
      setTimeout(() => {
        setSuccessMsg("");
        window.location.reload();
      }, 900);
    } else {
      setErrorMsg(res.error || "Lỗi lưu section.");
    }
  }

  async function handleToggle(sec: HomepageSectionItem) {
    const newStatus = !sec.isActive;
    setSections((prev) =>
      prev.map((s) => (s.id === sec.id ? { ...s, isActive: newStatus } : s))
    );

    const res = await toggleHomepageSection(sec.id, newStatus);
    if (res.success) {
      setSuccessMsg(
        `Đã ${newStatus ? "bật" : "tắt"} hiển thị section: ${sec.name}`
      );
      setTimeout(() => setSuccessMsg(""), 2500);
    } else {
      setSections((prev) =>
        prev.map((s) => (s.id === sec.id ? { ...s, isActive: !newStatus } : s))
      );
      alert(res.error || "Không thể đổi trạng thái");
    }
  }

  async function handleMove(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const updated = reordered.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setSections(updated);

    const res = await reorderHomepageSections(
      updated.map((item) => ({ id: item.id, order: item.order }))
    );

    if (res.success) {
      setSuccessMsg("Đã cập nhật thứ tự các section trên trang chủ!");
      setTimeout(() => setSuccessMsg(""), 2500);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await deleteHomepageSection(deleteTarget.id);
    setIsDeleting(false);

    if (res.success) {
      setDeleteTarget(null);
      window.location.reload();
    } else {
      alert(res.error || "Không thể xóa section này.");
    }
  }

  // Parse current Hero custom content for modal defaults
  const heroCustom = parseJsonContent(editingItem?.content);
  const heroCards =
    Array.isArray(heroCustom.cards) && heroCustom.cards.length === 3
      ? heroCustom.cards
      : DEFAULT_HERO_CARDS;
  const isHeroModal =
    activeKey === "HERO" || editingItem?.sectionKey === "HERO";

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#171717] hover:bg-[#202020] text-xs font-mono text-[#007BA7] border border-[#292929] flex items-center gap-2 transition-colors"
          >
            <span>Xem Trang Chủ Thực Tế</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={handleQuickEditHero}
            className="px-4 py-2.5 rounded-xl bg-[#007BA7]/20 hover:bg-[#007BA7]/35 border border-[#007BA7]/50 text-[#38BDF8] text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-glow-cyan"
          >
            <ImageIcon className="w-4 h-4 text-[#00E5FF]" />
            <span>Sửa Ảnh Mascot & Chữ Banner Đầu (Hero)</span>
          </button>

          <span className="text-xs text-[#71717A] font-mono">
            {sections.filter((s) => s.isActive).length} / {sections.length}{" "}
            Section đang bật
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-full lg:w-auto">
          <button
            onClick={() => {
              handleOpenCreate();
              setIsAIModalOpen(true);
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#007BA7]/30 to-[#FF2D95]/30 hover:from-[#007BA7] hover:to-[#FF2D95] border border-[#007BA7]/50 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-glow-cyan shrink-0"
          >
            <Sparkles className="w-4 h-4 text-[#FF2D95] animate-pulse" />
            <span>AI Soạn Section</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white text-xs font-mono font-bold uppercase tracking-wider hover:shadow-glow-pink transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Section Mới</span>
          </button>
        </div>
      </div>

      {/* Sections List */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#121212] border border-[#292929] space-y-4">
        {sections.map((sec, index) => {
          const previewImg =
            sec.mediaUrl ||
            (sec.sectionKey === "HERO"
              ? "/images/mascot-character-transparent-v2.png"
              : null);

          return (
            <div
              key={sec.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                sec.isActive
                  ? "bg-[#171717] border-[#292929] hover:border-[#383838]"
                  : "bg-[#141414]/50 border-[#202020] opacity-60"
              }`}
            >
              {/* Reorder, Thumbnail & Info */}
              <div className="flex items-start md:items-center gap-4">
                {/* Order Buttons */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleMove(index, "up")}
                    disabled={index === 0}
                    className="p-1 rounded bg-[#121212] hover:bg-[#202020] text-[#A1A1AA] hover:text-white disabled:opacity-20 border border-[#292929] transition-colors"
                    title="Di chuyển lên trên"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono font-bold text-[#007BA7]">
                    #{sec.order}
                  </span>
                  <button
                    onClick={() => handleMove(index, "down")}
                    disabled={index === sections.length - 1}
                    className="p-1 rounded bg-[#121212] hover:bg-[#202020] text-[#A1A1AA] hover:text-white disabled:opacity-20 border border-[#292929] transition-colors"
                    title="Di chuyển xuống dưới"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Thumbnail Preview */}
                {previewImg && (
                  <div className="w-16 h-16 rounded-xl bg-[#0A0A0D] border border-[#292929] overflow-hidden flex items-center justify-center shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewImg}
                      alt={sec.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                {/* Details */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {sec.name}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#202020] border border-[#292929] text-[10px] font-mono text-[#007BA7]">
                      {sec.sectionKey}
                    </span>
                    {!sec.isActive && (
                      <span className="px-2 py-0.5 rounded bg-red-950/50 border border-red-500/30 text-[10px] font-mono text-red-400">
                        ĐANG ẨN
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-[#D4D4D8]">
                    {sec.title}
                  </p>
                  {sec.subtitle && (
                    <p className="text-[11px] font-mono text-[#71717A]">
                      {sec.subtitle}
                    </p>
                  )}
                  {sec.description && (
                    <p className="text-xs text-[#A1A1AA] line-clamp-1 max-w-2xl">
                      {sec.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => handleToggle(sec)}
                  className={`px-3 py-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
                    sec.isActive
                      ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/50"
                      : "bg-[#202020] border-[#292929] text-[#71717A] hover:text-white"
                  }`}
                >
                  {sec.isActive ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Đang hiện</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Đang ẩn</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleOpenEdit(sec)}
                  className="px-3.5 py-2 rounded-xl bg-[#007BA7]/20 hover:bg-[#007BA7] text-[#38BDF8] hover:text-white border border-[#007BA7]/40 transition-colors flex items-center gap-1.5 text-xs font-mono font-bold"
                  title="Chỉnh sửa Ảnh & Nội dung Section"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Sửa Ảnh & Text</span>
                </button>

                <button
                  onClick={() => setDeleteTarget(sec)}
                  className="p-2 rounded-xl bg-[#202020] hover:bg-red-950/60 text-[#A1A1AA] hover:text-red-400 border border-[#292929] transition-colors"
                  title="Xóa Section"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#121212] border border-[#292929] rounded-3xl p-6 md:p-8 shadow-2xl my-8 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-[#71717A] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2 pr-8">
              <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-[#007BA7]" />
                {editingItem
                  ? `Chỉnh Sửa: ${editingItem.name}`
                  : "Tạo Section Mới Cho Trang Chủ"}
              </h3>
              <button
                type="button"
                onClick={() => setIsAIModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#007BA7]/20 to-[#FF2D95]/20 hover:from-[#007BA7]/40 hover:to-[#FF2D95]/40 border border-[#007BA7]/50 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-glow-cyan w-fit"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF2D95] animate-pulse" />
                <span>✨ AI Viết Section Này</span>
              </button>
            </div>
            <p className="text-xs text-[#A1A1AA] mb-6">
              Bạn có thể tải ảnh mới từ máy tính và chỉnh sửa toàn bộ câu chữ hiển thị trực tiếp trên trang chủ.
            </p>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form key={formKey} onSubmit={handleSave} className="space-y-5">
              {/* Row 1: Name & Key */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                    Tên Gợi Nhớ (Admin) *
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingItem?.name || ""}
                    required
                    placeholder="VD: 01. Hero Banner 3D"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                    Mã Khóa Section (Key) *
                  </label>
                  <select
                    name="sectionKey"
                    value={activeKey}
                    onChange={(e) => setActiveKey(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs font-mono focus:outline-none focus:border-[#007BA7]"
                  >
                    <option value="HERO">HERO (Banner Đầu & Mascot)</option>
                    <option value="BRAND_INTRO">BRAND_INTRO (3 Trụ Cột)</option>
                    <option value="SERVICES_BENTO">SERVICES_BENTO (Dịch Vụ)</option>
                    <option value="FEATURED_PORTFOLIO">FEATURED_PORTFOLIO (Dự Án)</option>
                    <option value="DIGITAL_LAB">DIGITAL_LAB (Phòng LAB)</option>
                    <option value="PROCESS">PROCESS (Quy Trình)</option>
                    <option value="TECH_STACK">TECH_STACK (Công Nghệ)</option>
                    <option value="TESTIMONIALS">TESTIMONIALS (Đánh Giá)</option>
                    <option value="LATEST_BLOG">LATEST_BLOG (Tin Tức)</option>
                    <option value="FAQ">FAQ (Hỏi Đáp)</option>
                    <option value="CONTACT_CTA">CONTACT_CTA (Liên Hệ Cuối Trang)</option>
                    <option value="CUSTOM_SECTION">CUSTOM_SECTION (Tùy Chỉnh Mở Rộng)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase tracking-wider">
                    Thứ Tự Sắp Xếp (Order)
                  </label>
                  <input
                    type="number"
                    name="order"
                    defaultValue={editingItem?.order ?? sections.length + 1}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                  />
                </div>
              </div>

              {/* BLOCK 1: IMAGE UPLOAD & MASCOT CONFIG */}
              <div className="p-4 rounded-2xl bg-[#0D0D11] border border-[#252530] space-y-4">
                <div className="flex items-center justify-between border-b border-[#1E1E28] pb-2.5">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#00E5FF]" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      {isHeroModal
                        ? "1. HÌNH ẢNH MASCOT CỘT PHẢI / BANNER"
                        : "1. HÌNH ẢNH / MEDIA CỦA SECTION"}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#71717A]">
                    Hỗ trợ tải ảnh PNG, JPG, WEBP trực tiếp từ máy tính
                  </span>
                </div>

                <ImageUploadField
                  name="mediaUrl"
                  label={
                    isHeroModal
                      ? "Tải ảnh Mascot mới lên hoặc dán đường dẫn URL ảnh"
                      : "Tải ảnh minh họa cho Section hoặc dán URL"
                  }
                  defaultValue={
                    editingItem?.mediaUrl ||
                    (isHeroModal
                      ? "/images/mascot-character-transparent-v2.png"
                      : "")
                  }
                  folder="homepage"
                  placeholder="/images/mascot-character-transparent-v2.png hoặc tải file từ máy..."
                />

                {isHeroModal && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1E1E28]">
                    <div>
                      <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase">
                        Chế Độ Xử Lý Nền Ảnh Mascot
                      </label>
                      <select
                        name="hero_blendMode"
                        defaultValue={heroCustom.blendMode || "normal"}
                        className="w-full px-3 py-2 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                      >
                        <option value="normal">
                          Chuẩn sắc nét (Normal - Khuyên dùng cho ảnh PNG trong suốt)
                        </option>
                        <option value="screen">
                          Tự động hòa trộn nền đen (Screen Blend)
                        </option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <p className="text-[11px] text-[#71717A] leading-relaxed">
                        💡 Mẹo: Ảnh Mascot mặc định đã được tách nền trong suốt 100% không viền đen. Bạn cũng có thể chọn{" "}
                        <strong className="text-[#00E5FF]">Screen Blend</strong>{" "}
                        nếu tải lên ảnh có nền đen thuần.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* BLOCK 2: TEXT & TYPOGRAPHY */}
              <div className="p-4 rounded-2xl bg-[#0D0D11] border border-[#252530] space-y-4">
                <div className="flex items-center gap-2 border-b border-[#1E1E28] pb-2.5">
                  <Edit2 className="w-4 h-4 text-[#FF2D95]" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    2. NỘI DUNG VĂN BẢN & TIÊU ĐỀ HIỂN THỊ
                  </span>
                </div>

                {isHeroModal ? (
                  <>
                    {/* Hero Badge Pill Text */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase">
                          Chữ Thương Hiệu Ở Huy Hiệu (Badge Trái)
                        </label>
                        <input
                          type="text"
                          name="hero_badgeBrand"
                          defaultValue={
                            heroCustom.badgeBrand || "NGUYÊN AGENCY"
                          }
                          placeholder="NGUYÊN AGENCY"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs font-bold focus:outline-none focus:border-[#007BA7]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase">
                          Chữ Khẩu Hiệu Ở Huy Hiệu (Badge Phải)
                        </label>
                        <input
                          type="text"
                          name="subtitle"
                          defaultValue={
                            editingItem?.subtitle ||
                            "01 • KIẾN TẠO. PHÁT TRIỂN. CHUYỂN HÓA."
                          }
                          placeholder="VD: Digital Creative & Tech Solutions"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                        />
                      </div>
                    </div>

                    {/* Hero Main Title Line 1 & Line 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase">
                          Tiêu Đề Lớn - Dòng 1 (Chữ Trắng) *
                        </label>
                        <input
                          type="text"
                          name="hero_brandHeadline"
                          defaultValue={
                            heroCustom.brandHeadline || "NGUYÊN AGENCY"
                          }
                          placeholder="NGUYÊN AGENCY"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs font-black uppercase focus:outline-none focus:border-[#007BA7]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase">
                          Tiêu Đề Lớn - Dòng 2 (Chữ Gradient Xanh-Hồng) *
                        </label>
                        <input
                          type="text"
                          name="title"
                          required
                          defaultValue={
                            editingItem?.title || "VƯỢT CHUẨN SỐ HOÁ."
                          }
                          placeholder="VƯỢT CHUẨN SỐ HOÁ."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-[#00E5FF] text-xs font-black uppercase focus:outline-none focus:border-[#007BA7]"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase">
                        Tiêu Đề Chính (Title) *
                      </label>
                      <input
                        type="text"
                        name="title"
                        defaultValue={editingItem?.title || ""}
                        required
                        placeholder="VD: BA TRỤ CỘT SỨC MẠNH..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs font-bold focus:outline-none focus:border-[#007BA7]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase">
                        Tiêu Đề Phụ (Subtitle / Badge)
                      </label>
                      <input
                        type="text"
                        name="subtitle"
                        defaultValue={editingItem?.subtitle || ""}
                        placeholder="VD: 01 • TUYÊN NGÔN THƯƠNG HIỆU"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase">
                    Đoạn Văn Mô Tả (Description)
                  </label>
                  <textarea
                    name="description"
                    rows={2}
                    defaultValue={editingItem?.description || ""}
                    placeholder="Đối tác sáng tạo & công nghệ, đồng hành cùng doanh nghiệp..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                  />
                </div>
              </div>

              {/* BLOCK 3: 3 FEATURE CARDS (ONLY FOR HERO) */}
              {isHeroModal && (
                <div className="p-4 rounded-2xl bg-[#0D0D11] border border-[#252530] space-y-3">
                  <div className="flex items-center gap-2 border-b border-[#1E1E28] pb-2.5">
                    <Layers className="w-4 h-4 text-[#00E5FF]" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      3. BA Ô DỊCH VỤ NỔI BẬT TRÊN BANNER (3 FEATURE CARDS)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {heroCards.map(
                      (card: { title: string; desc: string }, idx: number) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-[#15151C] border border-[#262632] space-y-2"
                        >
                          <span className="text-[10px] font-mono text-[#00E5FF] uppercase font-bold block">
                            Ô Dịch Vụ Số {idx + 1}
                          </span>
                          <div>
                            <label className="block text-[10px] text-[#A1A1AA] mb-0.5">
                              Tiêu đề ô {idx + 1}
                            </label>
                            <input
                              type="text"
                              name={`card_${idx}_title`}
                              defaultValue={card.title}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-[#0D0D11] border border-[#292929] text-white text-xs font-bold focus:outline-none focus:border-[#007BA7]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-[#A1A1AA] mb-0.5">
                              Mô tả ngắn ô {idx + 1}
                            </label>
                            <input
                              type="text"
                              name={`card_${idx}_desc`}
                              defaultValue={card.desc}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-[#0D0D11] border border-[#292929] text-[#D4D4D8] text-[11px] focus:outline-none focus:border-[#007BA7]"
                            />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* BLOCK 4: CTA BUTTONS & VIDEO */}
              <div className="p-4 rounded-2xl bg-[#0D0D11] border border-[#252530] space-y-4">
                <div className="flex items-center gap-2 border-b border-[#1E1E28] pb-2.5">
                  <Play className="w-4 h-4 text-[#00E5FF]" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    4. NÚT BẤM ĐIỀU HƯỚNG (CTA) & VIDEO GIỚI THIỆU
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase">
                      Chữ Nút Bấm Chính (CTA 1)
                    </label>
                    <input
                      type="text"
                      name="ctaText"
                      defaultValue={editingItem?.ctaText || "Khám phá dịch vụ"}
                      placeholder="VD: Khám phá dịch vụ, XEM DỰ ÁN..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase">
                      Đường Dẫn Đích (CTA 1 Link)
                    </label>
                    <input
                      type="text"
                      name="ctaLink"
                      defaultValue={editingItem?.ctaLink || "/services"}
                      placeholder="VD: /services, /portfolio, /contact..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs font-mono focus:outline-none focus:border-[#007BA7]"
                    />
                  </div>
                </div>

                {isHeroModal && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1E1E28]">
                    <div>
                      <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase">
                        Chữ Nút Bấm Phụ (Nút Video)
                      </label>
                      <input
                        type="text"
                        name="hero_videoBtnText"
                        defaultValue={
                          heroCustom.videoBtnText || "Xem video giới thiệu"
                        }
                        placeholder="Xem video giới thiệu"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1 uppercase">
                        Link Video Giới Thiệu (Youtube hoặc .mp4)
                      </label>
                      <input
                        type="text"
                        name="hero_videoUrl"
                        defaultValue={
                          heroCustom.videoUrl ||
                          "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        }
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs font-mono focus:outline-none focus:border-[#007BA7]"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    value="true"
                    defaultChecked={editingItem ? editingItem.isActive : true}
                    className="w-4 h-4 rounded bg-[#171717] border-[#292929] text-[#007BA7] focus:ring-0"
                  />
                  <span className="text-xs text-white font-mono">
                    Bật hiển thị section này trên trang chủ
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#292929]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-mono text-[#A1A1AA] hover:text-white transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white text-xs font-mono font-bold uppercase tracking-wider hover:shadow-glow-pink transition-all disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Đang lưu..."
                    : editingItem
                    ? "Lưu Thay Đổi & Xuất Bản"
                    : "Tạo & Xuất Bản"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#121212] border border-[#292929] rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                Xóa Section Trang Chủ
              </h3>
            </div>
            <p className="text-xs text-[#A1A1AA] mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa section{" "}
              <strong className="text-white">{deleteTarget.name}</strong> khỏi
              trang chủ?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-[#A1A1AA] hover:text-white transition-colors"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {isDeleting ? "Đang xóa..." : "Xóa Section"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI WRITER MODAL */}
      <AIWriterModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        type="homepage"
        title="Trợ Lý AI Soạn Thảo Section Trang Chủ"
        defaultTopic={editingItem?.title || editingItem?.name || ""}
        extraContext={{
          currentTitle: editingItem?.title || "",
          currentKey: editingItem?.sectionKey || "",
        }}
        onApply={handleApplyAI}
      />
    </div>
  );
}
