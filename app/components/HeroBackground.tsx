"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
  { src: "/the-melwick-mens-black-premium-tee.png", alt: "Premium oversized black heavyweight cotton T-shirt" },
  { src: "/cream_tee.png", alt: "Premium oversized cream heavyweight cotton T-shirt" },
  { src: "/the-melwick-mens-charcoal-premium-tee.png", alt: "Premium oversized charcoal heavyweight cotton T-shirt" },
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
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#f8f6f2]" aria-hidden="true">
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
      
      {/* Ivory overlay to ensure the dark text is always readable */}
      <div className="absolute inset-0 z-20 bg-[#f8f6f2]/40 pointer-events-none" />
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-[#f8f6f2]/60 via-transparent to-[#f8f6f2]/80 pointer-events-none" />
      
      {/* Radial glow directly in the center to highlight the brand name text */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[400px] bg-[#f8f6f2]/50 blur-[80px] rounded-[100%]" />
      </div>
    </div>
  );
}
