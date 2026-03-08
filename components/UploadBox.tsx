"use client";
import { useCallback, useRef, useState } from "react";

interface UploadBoxProps {
  onUpload: (file: File) => void;
  videoUrl: string | null;
  fileName: string | undefined;
  onReset: () => void;
}

export default function UploadBox({ onUpload, videoUrl, fileName, onReset }: UploadBoxProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("video/")) return;
    onUpload(file);
  }, [onUpload]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (videoUrl) {
    return (
      <div className="animate-fade-up mb-8">
        <div className="relative rounded-2xl overflow-hidden bg-[#0A0A0A] shadow-2xl">
          <video
            src={videoUrl}
            className="w-full max-h-[420px] object-contain"
            controls
            playsInline
          />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
              <span className="text-[12px] text-white/80 font-medium">{fileName}</span>
            </div>
            <button
              onClick={onReset}
              className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1L11 11M11 1L1 11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up delay-300 mb-8">
      <div
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group ${
          isDragging
            ? "border-[#1A6CFF] bg-[#EBF2FF]"
            : "border-[#D8D6D1] bg-white hover:border-[#AAAAAA] hover:bg-[#FAFAFA]"
        }`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        style={{ minHeight: "260px", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        <div className="flex flex-col items-center gap-5 px-8 py-12 text-center">
          {/* Icon */}
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isDragging ? "bg-[#1A6CFF] scale-110" : "bg-[#F0EFE9] group-hover:bg-[#E8E6E0]"
          }`}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M14 4V18M14 4L9 9M14 4L19 9"
                stroke={isDragging ? "white" : "#5A5A5A"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="3" y="18" width="22" height="7" rx="2"
                stroke={isDragging ? "white" : "#5A5A5A"}
                strokeWidth="2"
              />
            </svg>
          </div>
          <div>
            <p className={`text-[16px] font-medium mb-1.5 transition-colors ${isDragging ? "text-[#1A6CFF]" : "text-[#0A0A0A]"}`}>
              {isDragging ? "Drop to upload" : "Drop your video here"}
            </p>
            <p className="text-[13px] text-[#8A8A8A]">
              or{" "}
              <span className="text-[#1A6CFF] underline underline-offset-2">browse files</span>
              {" "}· MP4, MOV, AVI, WebM supported
            </p>
          </div>

          {/* Format chips */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {["MP4", "MOV", "AVI", "WebM", "MKV"].map((fmt) => (
              <span
                key={fmt}
                className="px-2.5 py-1 text-[11px] font-medium tracking-wide text-[#8A8A8A] bg-[#F0EFE9] rounded-full"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
