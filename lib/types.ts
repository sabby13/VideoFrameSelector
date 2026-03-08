export interface VideoMetadata {
  fps: number;
  totalFrames: number;
  duration: number;
  resolution: { width: number; height: number };
  fileName: string;
  fileSize: number;
}

export interface ExtractedFrame {
  id: number;
  timestamp: number;
  dataUrl: string;
}
