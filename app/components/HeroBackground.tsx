"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
  { src: "/the-melwick-mens-forest-green-tailored-coat.png", alt: "Premium modern menswear editorial photography featuring a forest green tailored coat" },
  { src: "/the-melwick-mens-ivory-cable-knit-sweater.png", alt: "Premium modern menswear editorial photography featuring an ivory cable-knit sweater" },
  { src: "/the-melwick-mens-tailored-charcoal-blazer.png", alt: "Premium modern menswear editorial photography featuring a tailored charcoal blazer" },
];

export default function HeroBackground() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#fdfbf7]" aria-hidden="true">
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0} // Only preload the first image for performance
            quality={90}
            className="object-cover object-[center_top]"
            sizes="100vw"
          />
        </div>
      ))}
      
      {/* Ivory overlay to ensure the dark text (#1a3c34) is always readable regardless of the model's dark clothing */}
      <div className="absolute inset-0 z-20 bg-[#fdfbf7]/40 pointer-events-none" />
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-[#fdfbf7]/60 via-transparent to-[#fdfbf7]/80 pointer-events-none" />
      
      {/* Radial glow directly in the center to highlight the "MELWICK" text */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[400px] bg-[#fdfbf7]/50 blur-[80px] rounded-[100%]" />
      </div>
    </div>
  );
}
