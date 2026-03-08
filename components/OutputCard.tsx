"use client";
import { useState } from "react";
import { VideoMetadata } from "@/lib/types";

interface OutputCardProps {
  metadata: VideoMetadata | null;
  isDetecting: boolean;
  isExtracting: boolean;
  extractProgress: number;
  onExtract: (frameCount: number) => void;
}

function formatDuration(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = (s % 60).toFixed(1);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${sec}`;
  return `${m}:${sec.padStart(4, "0")}`;
}

function formatBytes(b: number) {
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

const FRAME_PRESETS = [10, 25, 50, 100];

export default function OutputCard({
  metadata,
  isDetecting,
  isExtracting,
  extractProgress,
  onExtract,
}: OutputCardProps) {
  const [customCount, setCustomCount] = useState<number>(10);
  const [selectedPreset, setSelectedPreset] = useState<number>(10);

  const handleExtract = () => {
    onExtract(selectedPreset);
  };

  return (
    <div className="animate-fade-up mb-8">
      <div className="rounded-2xl border border-[#E8E6E1] bg-white overflow-hidden shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E6E1] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-2 h-2 rounded-full ${isDetecting ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
            <span className="text-[13px] font-medium text-[#0A0A0A] tracking-tight">
              {isDetecting ? "Analysing video…" : "Video Analysis"}
            </span>
          </div>
          {!isDetecting && metadata && (
            <span className="text-[12px] text-[#8A8A8A] font-mono">{metadata.fileName}</span>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#E8E6E1]">
          {isDetecting ? (
            <>
              {["FPS", "Total Frames", "Duration", "Resolution"].map((label) => (
                <div key={label} className="px-6 py-5">
                  <p className="text-[11px] font-medium text-[#8A8A8A] uppercase tracking-widest mb-2">{label}</p>
                  <div className="shimmer h-7 w-20 rounded-md" />
                </div>
              ))}
            </>
          ) : metadata ? (
            <>
              <StatCell
                label="FPS"
                value={metadata.fps % 1 === 0 ? String(metadata.fps) : metadata.fps.toFixed(2)}
                highlight
              />
              <StatCell
                label="Total Frames"
                value={metadata.totalFrames.toLocaleString()}
                highlight
              />
              <StatCell
                label="Duration"
                value={formatDuration(metadata.duration)}
              />
              <StatCell
                label="Resolution"
                value={`${metadata.resolution.width}×${metadata.resolution.height}`}
              />
            </>
          ) : null}
        </div>



 {/* emojis were present here*/} 
 
        {/* File info row */}
        {metadata && !isDetecting && (
          <div className="px-6 py-4 bg-[#FAFAF8] border-t border-[#E8E6E1] flex items-center gap-6 flex-wrap">
            <InfoPill icon="" label="File size" value={formatBytes(metadata.fileSize)} />
            <InfoPill icon="" label="File" value={metadata.fileName} />
          </div>
        )}

        {/* Extract controls */}
        {metadata && !isDetecting && (
          <div className="px-6 py-5 border-t border-[#E8E6E1]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div>
                <p className="text-[12px] font-medium text-[#8A8A8A] uppercase tracking-widest mb-2.5">
                  Frames to extract
                </p>
                <div className="flex items-center gap-2">
                  {FRAME_PRESETS.map((n) => (
                    <button
                      key={n}
                      onClick={() => setSelectedPreset(n)}
                      className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                        selectedPreset === n
                          ? "bg-[#0A0A0A] text-white"
                          : "bg-[#F0EFE9] text-[#5A5A5A] hover:bg-[#E8E6E0]"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <input
                    type="number"
                    min={1}
                    max={Math.min(metadata.totalFrames, 500)}
                    value={customCount}
                    onChange={(e) => {
                      const v = parseInt(e.target.value);
                      if (!isNaN(v) && v > 0) {
                        setCustomCount(v);
                        setSelectedPreset(v);
                      }
                    }}
                    className="w-20 px-3 py-1.5 rounded-lg border border-[#E8E6E1] text-[13px] font-medium text-[#0A0A0A] bg-white focus:outline-none focus:border-[#0A0A0A] transition-colors"
                    placeholder="Custom"
                  />
                </div>
              </div>

              <div className="sm:ml-auto">
                {isExtracting ? (
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="text-[12px] text-[#8A8A8A]">Extracting frames… {extractProgress}%</div>
                    <div className="w-48 h-1.5 bg-[#E8E6E1] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0A0A0A] rounded-full transition-all duration-200"
                        style={{ width: `${extractProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleExtract}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0A0A0A] text-white text-[14px] font-medium hover:bg-[#2A2A2A] active:scale-[0.98] transition-all duration-150 shadow-sm"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="1" y="1" width="5" height="5" rx="1" fill="white"/>
                      <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.5"/>
                      <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.5"/>
                      <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.25"/>
                    </svg>
                    Extract {selectedPreset} Frames
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCell({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="px-6 py-5">
      <p className="text-[11px] font-medium text-[#8A8A8A] uppercase tracking-widest mb-1.5">{label}</p>
      <p className={`font-mono font-medium leading-none ${highlight ? "text-3xl text-[#0A0A0A]" : "text-xl text-[#2A2A2A]"}`}>
        {value}
      </p>
    </div>
  );
}

function InfoPill({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[13px]">{icon}</span>
      <span className="text-[12px] text-[#8A8A8A]">{label}:</span>
      <span className="text-[12px] font-medium text-[#0A0A0A] font-mono truncate max-w-[180px]">{value}</span>
    </div>
  );
}
