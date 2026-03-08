"use client";
import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import UploadBox from "@/components/UploadBox";
import OutputCard from "@/components/OutputCard";
import FrameGrid from "@/components/FrameGrid";
import { VideoMetadata, ExtractedFrame } from "@/lib/types";

export default function Home() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractProgress, setExtractProgress] = useState(0);
  const [frames, setFrames] = useState<ExtractedFrame[]>([]);

  const handleVideoUpload = useCallback((file: File) => {
    // Clean up previous
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setFrames([]);
    setMetadata(null);
    setExtractProgress(0);

    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(url);
    setIsDetecting(true);

    const video = document.createElement("video");
    video.src = url;
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      const duration = video.duration;
      // Detect FPS via requestVideoFrameCallback or fallback
      detectFPS(video, duration, file);
    };
  }, [videoUrl]);

  const detectFPS = (video: HTMLVideoElement, duration: number, file: File) => {
    let frameCount = 0;
    let startTime: number | null = null;
    const sampleDuration = 1.5; // sample 1.5 seconds

    if ("requestVideoFrameCallback" in video) {
      video.currentTime = 0;
      video.muted = true;
      video.playbackRate = 1;

      const countFrames = (now: number, meta: VideoFrameCallbackMetadata) => {
        if (startTime === null) startTime = meta.mediaTime;
        frameCount++;
        const elapsed = meta.mediaTime - (startTime ?? 0);

        if (elapsed < sampleDuration && meta.mediaTime < duration - 0.1) {
          video.requestVideoFrameCallback(countFrames);
        } else {
          const fps = elapsed > 0 ? Math.round(frameCount / elapsed) : 30;
          const snappedFps = snapToCommonFPS(fps);
          const totalFrames = Math.round(snappedFps * duration);
          video.pause();

          setMetadata({
            fps: snappedFps,
            totalFrames,
            duration,
            resolution: { width: video.videoWidth, height: video.videoHeight },
            fileName: file.name,
            fileSize: file.size,
          });
          setIsDetecting(false);
        }
      };

      video.play().then(() => {
        video.requestVideoFrameCallback(countFrames);
      });
    } else {
      // Fallback: assume 30fps
       const w = video.videoWidth;
      const h = video.videoHeight;
      setTimeout(() => {
        const fps = 30;
        const totalFrames = Math.round(fps * duration);
        setMetadata({
          fps,
          totalFrames,
          duration,
          resolution: { width: w, height: h },
          fileName: file.name,
          fileSize: file.size,
        });
        setIsDetecting(false);
      }, 800);
    }
  };

  const snapToCommonFPS = (fps: number): number => {
    const common = [23.976, 24, 25, 29.97, 30, 48, 50, 59.94, 60, 120];
    return common.reduce((prev, curr) =>
      Math.abs(curr - fps) < Math.abs(prev - fps) ? curr : prev
    );
  };

  const handleExtract = useCallback(async (frameCount: number) => {
    if (!videoUrl || !metadata) return;
    setIsExtracting(true);
    setFrames([]);
    setExtractProgress(0);

    const video = document.createElement("video");
    video.src = videoUrl;
    video.preload = "auto";
    video.muted = true;
    video.crossOrigin = "anonymous";

    await new Promise<void>((res) => {
      video.onloadeddata = () => res();
      video.load();
    });

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;

    const interval = metadata.duration / (frameCount + 1);
    const extracted: ExtractedFrame[] = [];

    for (let i = 1; i <= frameCount; i++) {
      const time = interval * i;
      await seekVideo(video, time);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      extracted.push({ id: i, timestamp: time, dataUrl });
      setExtractProgress(Math.round((i / frameCount) * 100));
      setFrames([...extracted]);
    }

    setIsExtracting(false);
  }, [videoUrl, metadata]);

  const seekVideo = (video: HTMLVideoElement, time: number): Promise<void> => {
    return new Promise((resolve) => {
      video.currentTime = time;
      video.onseeked = () => resolve();
    });
  };

  const handleReset = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoFile(null);
    setVideoUrl(null);
    setMetadata(null);
    setFrames([]);
    setExtractProgress(0);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 pb-32">
        <HeroSection hasVideo={!!videoFile} />
        <UploadBox
          onUpload={handleVideoUpload}
          videoUrl={videoUrl}
          fileName={videoFile?.name}
          onReset={handleReset}
        />
        {(isDetecting || metadata) && (
          <OutputCard
            metadata={metadata}
            isDetecting={isDetecting}
            isExtracting={isExtracting}
            extractProgress={extractProgress}
            onExtract={handleExtract}
          />
        )}
        {frames.length > 0 && (
          <FrameGrid frames={frames} isExtracting={isExtracting} />
        )}
      </main>
    </div>
  );
}
