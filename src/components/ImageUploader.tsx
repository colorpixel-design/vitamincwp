"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export default function ImageUploader({ value, onChange, folder = "serums" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload-local", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Network error during upload");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-3">
      {/* Upload zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="relative cursor-pointer rounded-xl border-2 border-dashed border-[#D6E0ED] hover:border-[#1E5FA3] bg-[#F9FBFD] hover:bg-[#EFF5FF] transition-all p-6 text-center group"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-[#1E5FA3] animate-spin" />
            <p className="text-sm text-[#3A5068]">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-[#EFF5FF] group-hover:bg-[#DBEAFE] flex items-center justify-center transition-colors">
              <Upload className="w-5 h-5 text-[#1E5FA3]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0C1E30]">Click to upload or drag & drop</p>
              <p className="text-xs text-[#7A93AD] mt-0.5">JPEG, PNG, WebP, AVIF — max 5MB</p>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <X className="w-3 h-3" /> {error}
        </p>
      )}

      {/* Preview */}
      {value && (
        <div className="relative inline-flex">
          <div className="w-28 h-28 rounded-xl border border-[#D6E0ED] overflow-hidden bg-[#F4F7FB] flex items-center justify-center">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-contain p-2"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
          <p className="absolute -bottom-5 left-0 right-0 text-center text-[10px] text-[#7A93AD] truncate">{value}</p>
        </div>
      )}

      {/* Or URL input */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-[#E4EAF3]" />
        <span className="text-xs text-[#7A93AD]">or paste URL</span>
        <div className="flex-1 h-px bg-[#E4EAF3]" />
      </div>
      <div className="flex gap-2 items-center">
        <ImageIcon className="w-4 h-4 text-[#7A93AD] shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="flex-1 px-3 py-2 rounded-lg border border-[#D6E0ED] text-xs text-[#0C1E30] focus:outline-none focus:border-[#1E5FA3] bg-white"
        />
      </div>
    </div>
  );
}
