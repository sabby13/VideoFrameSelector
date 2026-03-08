# Video Frame Extractor

A browser-native video frame extraction tool built with Next.js 14, React, TypeScript, and Tailwind CSS. Designed with an Apple-inspired minimal aesthetic.

## Features

- **Drag & Drop Upload** — Drop any video file directly onto the upload zone
- **FPS Detection** — Uses `requestVideoFrameCallback` API to detect actual video FPS
- **Frame Calculation** — Calculates total frames from FPS × duration
- **Frame Extraction** — Extract any number of frames at evenly-spaced intervals
- **Individual Download** — Download any single frame as JPEG
- **Bulk ZIP Download** — Download all extracted frames as a ZIP archive
- **Privacy First** — 100% client-side, no server uploads ever

## Project Structure

```
video-frame-extractor/
├── app/
│   ├── globals.css        # Global styles + Google Fonts import
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Main page with all state logic
├── components/
│   ├── Navbar.tsx         # Top navigation bar
│   ├── HeroSection.tsx    # Hero headline + description
│   ├── UploadBox.tsx      # Drag & drop video upload
│   ├── OutputCard.tsx     # FPS/frames stats card + extract controls
│   └── FrameGrid.tsx      # Extracted frames grid with download
├── lib/
│   └── types.ts           # Shared TypeScript interfaces
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

```bash
# Clone or copy the project folder
cd video-frame-extractor

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | Next.js 14 (App Router)             |
| Language    | TypeScript                          |
| Styling     | Tailwind CSS                        |
| Fonts       | Instrument Serif + DM Sans (Google) |
| FPS detect  | `requestVideoFrameCallback` API     |
| Frame grab  | HTML5 Canvas API                    |
| ZIP export  | JSZip + FileSaver.js                |

## How FPS Detection Works

1. A hidden `<video>` element is created with the uploaded file
2. `requestVideoFrameCallback` is used to count frames over a 1.5-second sample
3. The measured FPS is snapped to the nearest common frame rate (24, 25, 29.97, 30, 60, etc.)
4. Total frames = snapped FPS × video duration
5. Fallback: if `requestVideoFrameCallback` is not supported, assumes 30fps

## Browser Compatibility

| Browser | FPS Detection | Frame Extraction |
|---------|--------------|-----------------|
| Chrome  | ✅ Native     | ✅               |
| Edge    | ✅ Native     | ✅               |
| Firefox | ⚠️ Fallback  | ✅               |
| Safari  | ✅ Native     | ✅               |
