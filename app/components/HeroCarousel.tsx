"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const products = [
  {
    id: 0,
    src: "/tee-black-front.png",
    alt: "The Melwick premium black oversized heavyweight T-shirt",
  },
  {
    id: 1,
    src: "/tee-cream-front.png",
    alt: "The Melwick premium cream oversized heavyweight T-shirt",
  },
  {
    id: 2,
    src: "/tee-sand-front.png",
    alt: "The Melwick premium sand oversized heavyweight T-shirt",
  },
];

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % products.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(nextSlide, 4500);
    return () => clearInterval(timer);
  }, [isHovered, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();
  };

  return (
    <div
      className="relative w-full max-w-sm sm:max-w-md md:max-w-xl mx-auto h-[350px] sm:h-[450px] md:h-[600px] flex items-center justify-center group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Premium T-shirt collection"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {products.map((product, i) => {
          const offset = (i - activeIndex + products.length) % products.length;

          let positionClasses = "opacity-0 scale-[0.8] pointer-events-none";
          let zIndex = 0;

          if (offset === 0) {
            positionClasses = "translate-x-0 scale-100 opacity-100";
            zIndex = 20;
          } else if (offset === 1) {
            positionClasses = "translate-x-[25%] md:translate-x-[35%] scale-[0.85] opacity-60";
            zIndex = 10;
          } else if (offset === products.length - 1) {
            positionClasses = "-translate-x-[25%] md:-translate-x-[35%] scale-[0.85] opacity-60";
            zIndex = 10;
          }

          return (
            <div
              key={product.id}
              className={`absolute top-0 bottom-0 left-0 right-0 m-auto w-[85%] sm:w-3/4 md:w-[70%] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${positionClasses}`}
              style={{ zIndex }}
              aria-hidden={offset !== 0}
            >
              <div className="relative w-full h-full drop-shadow-2xl">
                <Image
                  src={product.src}
                  alt={product.alt}
                  fill
                  sizes="(max-width: 768px) 85vw, 60vw"
                  className="object-contain"
                  priority={i === 0}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-md rounded-full shadow flex items-center justify-center text-[#1a1a1a] opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 z-30 disabled:opacity-50"
        aria-label="Previous product"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-md rounded-full shadow flex items-center justify-center text-[#1a1a1a] opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 z-30 disabled:opacity-50"
        aria-label="Next product"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
      </button>

      {/* Pagination */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30" role="tablist">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeIndex ? "bg-[#1a1a1a] w-5" : "bg-[#1a1a1a]/30 hover:bg-[#1a1a1a]/50"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
