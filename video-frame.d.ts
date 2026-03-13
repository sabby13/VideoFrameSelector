// TypeScript definitions for the browser Video Frame Callback API.
// This adds metadata about each rendered video frame (time, size, frame count, etc.)
// and extends HTMLVideoElement with requestVideoFrameCallback() so code can run
// whenever a new video frame is displayed, enabling precise frame-by-frame
// processing such as video analysis, frame extraction, or synchronization.

interface VideoFrameCallbackMetadata {
  presentationTime: DOMHighResTimeStamp;
  expectedDisplayTime: DOMHighResTimeStamp;
  width: number;
  height: number;
  mediaTime: number;
  presentedFrames: number;
  processingDuration?: number;
  captureTime?: DOMHighResTimeStamp;
  receiveTime?: DOMHighResTimeStamp;
  rtpTimestamp?: number;
}

interface HTMLVideoElement {
  requestVideoFrameCallback(
    callback: (now: DOMHighResTimeStamp, metadata: VideoFrameCallbackMetadata) => void
  ): number;
  cancelVideoFrameCallback(handle: number): void;
}
