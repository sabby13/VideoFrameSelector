import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Video Frame Extractor",
  description: "Extract frames from any video with precision. Built for creators, researchers, and developers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
