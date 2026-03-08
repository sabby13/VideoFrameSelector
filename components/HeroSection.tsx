"use client";

interface HeroSectionProps {
  hasVideo: boolean;
}

export default function HeroSection({ hasVideo }: HeroSectionProps) {
  return (
    <section className={`transition-all duration-700 ease-out ${hasVideo ? "pt-10 pb-8" : "pt-24 pb-16"}`}>
      <div className="max-w-3xl">
        {/* Badge */}
        <div className="animate-fade-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E8E6E1] bg-white mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[12px] font-medium text-[#8A8A8A] tracking-wide uppercase">
            Browser-native · No upload required
          </span>
        </div>

        {/* Main heading */}
        <h1
          className={`animate-fade-up delay-100 font-display leading-[1.08] tracking-tight text-[#0A0A0A] transition-all duration-500 ${
            hasVideo ? "text-4xl md:text-5xl mb-4" : "text-5xl md:text-7xl mb-6"
          }`}
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Video Frame
          <br />
          <em className="not-italic text-[#8A8A8A]">Extractor</em>
        </h1>

        {!hasVideo && (
          <p className="animate-fade-up delay-200 text-[17px] text-[#5A5A5A] leading-relaxed max-w-xl font-light">
            Extract individual frames from any video file. Detect FPS, calculate total frames,
            and download high-quality stills — all processed privately in your browser.
          </p>
        )}
      </div>
    </section>
  );
}
