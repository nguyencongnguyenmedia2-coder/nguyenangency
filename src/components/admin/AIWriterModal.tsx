"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Bot,
  Key,
  Check,
  AlertCircle,
  Loader2,
  X,
  ChevronDown,
  ChevronUp,
  Sliders,
  Send,
  Zap,
} from "lucide-react";
import {
  generateCMSContent,
  getAIStatus,
  saveAIKey,
  type AIContentType,
  type AITone,
} from "@/app/actions/admin-ai-actions";

interface AIWriterModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: AIContentType;
  title: string;
  defaultTopic?: string;
  extraContext?: Record<string, string>;
  onApply: (data: any) => void;
}

export default function AIWriterModal({
  isOpen,
  onClose,
  type,
  title,
  defaultTopic = "",
  extraContext,
  onApply,
}: AIWriterModalProps) {
  const [topic, setTopic] = useState(defaultTopic);
  const [tone, setTone] = useState<AITone>("LUXURY");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [providerUsed, setProviderUsed] = useState<string>("");
  const [notice, setNotice] = useState<string>("");

  // Settings
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const [keyMasked, setKeyMasked] = useState("");
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [keySaveMsg, setKeySaveMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (defaultTopic && !topic) {
        setTopic(defaultTopic);
      }
      loadStatus();
    }
  }, [isOpen, defaultTopic]);

  async function loadStatus() {
    try {
      const status = await getAIStatus();
      setHasKey(status.hasGeminiKey);
      setKeyMasked(status.geminiKeyMasked || "");
    } catch {
      // ignore
    }
  }

  async function handleSaveKey() {
    if (!apiKeyInput.trim()) return;
    setIsSavingKey(true);
    setKeySaveMsg("");
    const res = await saveAIKey("GEMINI_API_KEY", apiKeyInput.trim());
    setIsSavingKey(false);
    if (res.success) {
      setKeySaveMsg("Đã lưu khóa Gemini API thành công!");
      setHasKey(true);
      setApiKeyInput("");
      await loadStatus();
      setTimeout(() => setKeySaveMsg(""), 3000);
    } else {
      setKeySaveMsg(res.error || "Lỗi lưu key");
    }
  }

  async function handleGenerate() {
    if (!topic.trim()) {
      setErrorMsg("Vui lòng nhập chủ đề hoặc từ khóa trước!");
      return;
    }
    setErrorMsg("");
    setIsGenerating(true);
    setGeneratedData(null);

    const res = await generateCMSContent({
      type,
      topic: topic.trim(),
      tone,
      extraContext,
    });

    setIsGenerating(false);

    if (res.success && res.data) {
      setGeneratedData(res.data);
      setProviderUsed(res.provider || "");
      setNotice(res.notice || "");
    } else {
      setErrorMsg(res.error || "Không thể sinh nội dung. Vui lòng thử lại!");
    }
  }

  function handleApplyClick() {
    if (!generatedData) return;
    onApply(generatedData);
    onClose();
  }

  if (!isOpen) return null;

  const placeholders: Record<AIContentType, string> = {
    portfolio: "VD: Sàn giao dịch tài sản số 3D thời gian thực Nexus Global...",
    service: "VD: Thiết kế hệ thống 3D WebGL và CGI nhận diện thương hiệu...",
    lab: "VD: Module Shaders WebGPU khử răng cưa và ánh sáng thời gian thực...",
    blog: "VD: Xu hướng thiết kế 3D Web & WebGPU tác động đến Luxury Brands 2026...",
    homepage: "VD: Section giới thiệu năng lực công nghệ và đội ngũ sáng tạo...",
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0D0D0D] border border-[#292929] rounded-3xl w-full max-w-2xl p-6 sm:p-8 relative shadow-2xl space-y-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#202020] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#007BA7] to-[#FF2D95] p-0.5 shadow-glow-cyan flex items-center justify-center">
              <div className="w-full h-full bg-[#121212] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#FF2D95] animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  AI CONTENT ASSISTANT
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#007BA7]/20 text-[#007BA7] border border-[#007BA7]/40 font-semibold">
                  NGUYÊN STUDIO
                </span>
              </div>
              <p className="text-xs text-[#A1A1AA]">{title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#71717A] hover:text-white hover:bg-[#171717] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1 text-xs">
          {/* API Key Accordion */}
          <div className="rounded-2xl bg-[#141414] border border-[#252525] p-3.5">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowKeyConfig(!showKeyConfig)}
            >
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#007BA7]" />
                <span className="font-mono text-[11px] text-[#E4E4E7] font-semibold">
                  Cấu hình Google Gemini API Key
                </span>
                {hasKey ? (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-mono">
                    <Check className="w-3 h-3" /> Đã kết nối ({keyMasked})
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30 font-mono">
                    Chưa kết nối (Đang dùng Engine nội bộ)
                  </span>
                )}
              </div>
              <button
                type="button"
                className="text-[#71717A] hover:text-white transition-colors"
              >
                {showKeyConfig ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>

            {showKeyConfig && (
              <div className="mt-3 pt-3 border-t border-[#202020] space-y-2.5">
                <p className="text-[11px] text-[#A1A1AA]">
                  Nhập Google Gemini API Key (miễn phí tại{" "}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#007BA7] hover:underline"
                  >
                    Google AI Studio
                  </a>
                  ) để sử dụng model AI Gemini 1.5 Flash cao cấp:
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="AIzaSy..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[#0D0D0D] border border-[#292929] text-white font-mono text-xs focus:outline-none focus:border-[#007BA7]"
                  />
                  <button
                    type="button"
                    onClick={handleSaveKey}
                    disabled={isSavingKey || !apiKeyInput.trim()}
                    className="px-4 py-2 rounded-xl bg-[#007BA7] hover:bg-[#007BA7]/80 disabled:opacity-50 text-white font-mono text-xs font-bold transition-all"
                  >
                    {isSavingKey ? "Đang lưu..." : "Lưu Key"}
                  </button>
                </div>
                {keySaveMsg && (
                  <p className="text-[10px] font-mono text-emerald-400">
                    {keySaveMsg}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Input Topic & Tone */}
          <div className="space-y-3">
            <div>
              <label className="block text-[#A1A1AA] font-mono uppercase text-[11px] mb-1.5 font-bold">
                Chủ đề / Ý tưởng / Từ khóa cốt lõi *
              </label>
              <textarea
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={placeholders[type]}
                className="w-full px-4 py-3 rounded-2xl bg-[#141414] border border-[#292929] text-white text-xs focus:outline-none focus:border-[#007BA7] resize-none"
              />
            </div>

            {/* Tone Selector */}
            <div>
              <label className="block text-[#A1A1AA] font-mono uppercase text-[11px] mb-1.5 flex items-center gap-1.5 font-bold">
                <Sliders className="w-3.5 h-3.5 text-[#007BA7]" />
                <span>Phong cách & Tone giọng AI</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "LUXURY", label: "Luxury & Thượng Lưu", desc: "Độc bản, sang trọng" },
                  { id: "TECH", label: "Công Nghệ Cao", desc: "3D, WebGL, 60fps" },
                  { id: "COMMERCIAL", label: "Chuyển Đổi Cao", desc: "Nhấn mạnh ROI & uy quyền" },
                  { id: "CREATIVE", label: "Sáng Tạo Phá Cách", desc: "Mới lạ, giàu cảm xúc" },
                ].map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setTone(t.id as AITone)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      tone === t.id
                        ? "bg-[#007BA7]/15 border-[#007BA7] text-white shadow-glow-cyan"
                        : "bg-[#141414] border-[#252525] text-[#A1A1AA] hover:border-[#383838]"
                    }`}
                  >
                    <div className="font-bold text-[11px] text-white">
                      {t.label}
                    </div>
                    <div className="text-[9px] text-[#71717A] mt-0.5">
                      {t.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Action Generate Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#007BA7] via-[#9333EA] to-[#FF2D95] hover:opacity-95 text-white font-mono uppercase font-bold text-xs tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-glow-pink"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI Đang Soạn Thảo & Chuẩn Hóa Dữ Liệu...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-white" />
                  <span>Khởi Tạo Nội Dung Chuẩn Luxury Agency</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Result Preview */}
          {generatedData && (
            <div className="p-4 rounded-2xl bg-[#090909] border border-[#252525] space-y-3 mt-4">
              <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-emerald-400 font-bold uppercase text-[11px]">
                    Nội dung đã được AI sinh hoàn tất ({providerUsed})
                  </span>
                </div>
                <span className="text-[10px] text-[#71717A] font-mono">
                  Sẵn sàng áp dụng
                </span>
              </div>

              {notice && (
                <p className="text-[10px] text-amber-300 bg-amber-950/30 p-2 rounded-lg border border-amber-500/20">
                  ℹ️ {notice}
                </p>
              )}

              {/* Quick Preview Fields */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {generatedData.title && (
                  <div>
                    <span className="text-[10px] text-[#71717A] font-mono uppercase block">
                      Tiêu đề:
                    </span>
                    <p className="text-white font-bold">{generatedData.title}</p>
                  </div>
                )}
                {generatedData.name && (
                  <div>
                    <span className="text-[10px] text-[#71717A] font-mono uppercase block">
                      Tên:
                    </span>
                    <p className="text-white font-bold">{generatedData.name}</p>
                  </div>
                )}
                {generatedData.tagline && (
                  <div>
                    <span className="text-[10px] text-[#71717A] font-mono uppercase block">
                      Tagline:
                    </span>
                    <p className="text-[#007BA7] italic">{generatedData.tagline}</p>
                  </div>
                )}
                {generatedData.shortDesc && (
                  <div>
                    <span className="text-[10px] text-[#71717A] font-mono uppercase block">
                      Mô tả ngắn:
                    </span>
                    <p className="text-[#D4D4D8]">{generatedData.shortDesc}</p>
                  </div>
                )}
                {generatedData.objective && (
                  <div>
                    <span className="text-[10px] text-[#71717A] font-mono uppercase block">
                      Mục tiêu (Objective):
                    </span>
                    <p className="text-[#A1A1AA]">{generatedData.objective}</p>
                  </div>
                )}
                {generatedData.challenge && (
                  <div>
                    <span className="text-[10px] text-[#71717A] font-mono uppercase block">
                      Thách thức (Challenge):
                    </span>
                    <p className="text-[#A1A1AA]">{generatedData.challenge}</p>
                  </div>
                )}
                {generatedData.solution && (
                  <div>
                    <span className="text-[10px] text-[#71717A] font-mono uppercase block">
                      Giải pháp (Solution):
                    </span>
                    <p className="text-[#A1A1AA]">{generatedData.solution}</p>
                  </div>
                )}
                {generatedData.description && (
                  <div>
                    <span className="text-[10px] text-[#71717A] font-mono uppercase block">
                      Mô tả chi tiết:
                    </span>
                    <p className="text-[#A1A1AA] line-clamp-3">
                      {generatedData.description}
                    </p>
                  </div>
                )}
                {generatedData.content && (
                  <div>
                    <span className="text-[10px] text-[#71717A] font-mono uppercase block">
                      Nội dung Markdown ({generatedData.content.length} ký tự):
                    </span>
                    <pre className="text-[10px] text-[#A1A1AA] bg-[#121212] p-2 rounded-lg whitespace-pre-wrap font-mono max-h-24 overflow-y-auto">
                      {generatedData.content}
                    </pre>
                  </div>
                )}
              </div>

              {/* Apply Button */}
              <div className="pt-2 border-t border-[#1E1E1E] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setGeneratedData(null)}
                  className="px-4 py-2 rounded-xl bg-[#171717] hover:bg-[#202020] text-[#A1A1AA] hover:text-white font-mono text-[11px]"
                >
                  Thử Tạo Lại
                </button>
                <button
                  type="button"
                  onClick={handleApplyClick}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#007BA7] to-[#FF2D95] hover:opacity-90 text-white font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-glow-cyan"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Áp Dụng Vào Form Ngay</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
