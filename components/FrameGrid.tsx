"use client";
import { ExtractedFrame } from "@/lib/types";

interface FrameGridProps {
  frames: ExtractedFrame[];
  isExtracting: boolean;
}

function formatTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);
  if (h > 0) {
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}.${String(ms).padStart(3,"0")}`;
  }
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}.${String(ms).padStart(3,"0")}`;
}

function downloadFrame(frame: ExtractedFrame) {
  const a = document.createElement("a");
  a.href = frame.dataUrl;
  a.download = `frame_${String(frame.id).padStart(4,"0")}_${formatTimestamp(frame.timestamp).replace(/[:.]/g,"_")}.jpg`;
  a.click();
}

async function downloadAllAsZip(frames: ExtractedFrame[]) {
  // Dynamic import for client-side only
  const JSZip = (await import("jszip")).default;
  const FileSaver = await import("file-saver");
  
  const zip = new JSZip();
  const folder = zip.folder("frames")!;

  for (const frame of frames) {
    const base64 = frame.dataUrl.split(",")[1];
    const name = `frame_${String(frame.id).padStart(4,"0")}.jpg`;
    folder.file(name, base64, { base64: true });
  }

  const blob = await zip.generateAsync({ type: "blob" });
  FileSaver.saveAs(blob, `frames_${frames.length}.zip`);
}

export default function FrameGrid({ frames, isExtracting }: FrameGridProps) {
  if (frames.length === 0) return null;

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2
            className="text-xl font-medium text-[#0A0A0A] tracking-tight"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            Extracted Frames
          </h2>
          <p className="text-[13px] text-[#8A8A8A] mt-0.5">
            {frames.length} frame{frames.length !== 1 ? "s" : ""} extracted
            {isExtracting && " · processing…"}
          </p>
        </div>
        {!isExtracting && frames.length > 0 && (
          <button
            onClick={() => downloadAllAsZip(frames)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E8E6E1] bg-white text-[13px] font-medium text-[#0A0A0A] hover:bg-[#F0EFE9] active:scale-[0.98] transition-all duration-150 shadow-sm"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1V9M7 9L4 6M7 9L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 11H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Download all as ZIP
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {frames.map((frame) => (
          <div
            key={frame.id}
            className="frame-card group relative rounded-xl overflow-hidden bg-[#0A0A0A] border border-[#E8E6E1] shadow-sm hover:shadow-md transition-shadow"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={frame.dataUrl}
              alt={`Frame ${frame.id}`}
              className="w-full aspect-video object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            {/* Download button */}
            <button
              onClick={() => downloadFrame(frame)}
              className="frame-dl-btn absolute top-2 right-2 w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1V7.5M6 7.5L3.5 5M6 7.5L8.5 5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1.5 10H10.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            {/* Meta */}
            <div className="absolute bottom-0 inset-x-0 px-2.5 py-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-medium text-white/90">
                  #{String(frame.id).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-mono text-white/60">
                  {formatTimestamp(frame.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Ghost card while extracting */}
        {isExtracting && (
          <div className="rounded-xl overflow-hidden border border-[#E8E6E1] shadow-sm">
            <div className="w-full aspect-video shimmer" />
          </div>
        )}
      </div>
    </div>
  );
}
