"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react";

interface ImageUploadFieldProps {
  name: string;
  label?: string;
  defaultValue?: string | null;
  folder?: string;
  placeholder?: string;
  onChangeUrl?: (url: string) => void;
}

export default function ImageUploadField({
  name,
  label = "Hình ảnh / Thumbnail",
  defaultValue = "",
  folder = "general",
  placeholder = "https://images.unsplash.com/... hoặc /uploads/...",
  onChangeUrl,
}: ImageUploadFieldProps) {
  const [url, setUrl] = useState<string>(defaultValue || "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function updateValue(nextUrl: string) {
    setUrl(nextUrl);
    if (onChangeUrl) onChangeUrl(nextUrl);
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      fd.append("title", file.name);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setUploadError(data.error || "Tải ảnh thất bại.");
      } else {
        updateValue(data.url);
        setUploadSuccess(
          data.supabaseSynced
            ? "Đã tải lên & đồng bộ Supabase Storage!"
            : "Đã tải ảnh lên thành công!"
        );
        setTimeout(() => setUploadSuccess(""), 3500);
      }
    } catch (err: any) {
      setUploadError(err?.message || "Lỗi kết nối khi tải ảnh.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-[#A1A1AA] font-mono uppercase text-[11px]">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-2.5 py-1 rounded-lg bg-[#007BA7]/20 hover:bg-[#007BA7]/35 border border-[#007BA7]/40 text-[#38BDF8] font-mono text-[10px] uppercase flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Đang tải...</span>
              </>
            ) : (
              <>
                <Upload className="w-3 h-3" />
                <span>{url ? "Thay ảnh" : "Upload file"}</span>
              </>
            )}
          </button>
          {url && (
            <button
              type="button"
              onClick={() => updateValue("")}
              className="px-2 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-400 font-mono text-[10px] uppercase flex items-center gap-1 transition-colors"
              title="Xóa ảnh"
            >
              <X className="w-3 h-3" />
              <span>Xóa</span>
            </button>
          )}
        </div>
      </div>

      <input
        type="text"
        name={name}
        value={url}
        onChange={(e) => updateValue(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#292929] text-white text-xs font-mono focus:outline-none focus:border-[#007BA7]"
      />

      {uploadError && (
        <p className="text-[11px] text-red-400 font-mono">{uploadError}</p>
      )}
      {uploadSuccess && (
        <p className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>{uploadSuccess}</span>
        </p>
      )}

      {url && (
        <div className="relative flex items-center gap-3 p-2.5 rounded-xl bg-[#171717] border border-[#292929]">
          <div className="relative w-20 h-12 rounded-lg overflow-hidden bg-[#0A0A0A] border border-[#292929] shrink-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <ImageIcon className="w-4 h-4 text-[#71717A] absolute -z-10" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-mono text-emerald-400 uppercase block">
              Preview Ảnh Hiện Tại
            </span>
            <span className="text-[11px] font-mono text-[#A1A1AA] truncate block">
              {url}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
