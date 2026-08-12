"use client";

import { useState, useEffect, useCallback } from "react";

const slides = [
  { src: "/mood1.jpg", alt: "Premium dark fabric texture — editorial fashion photography" },
  { src: "/mood2.jpg", alt: "Luxury knit sweater on dark marble — high-end apparel" },
  { src: "/mood3.jpg", alt: "Dark leather jacket — modern streetwear fashion" },
];

export default function HeroBackground() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }, []);

  // Preload images
  useEffect(() => {
    let loaded = 0;
    slides.forEach((slide) => {
      const img = new window.Image();
      img.onload = () => {
        loaded++;
        if (loaded === slides.length) setImagesLoaded(true);
      };
      img.onerror = () => {
        loaded++;
        if (loaded === slides.length) setImagesLoaded(true);
      };
      img.src = slide.src;
    });

    // Fallback: show anyway after 2s
    const fallback = setTimeout(() => setImagesLoaded(true), 2000);
    return () => clearTimeout(fallback);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (!imagesLoaded) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [imagesLoaded, nextSlide]);

  return (
    <div className="hero-bg" aria-hidden="true">
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`hero-bg-slide ${i === activeIndex ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.src})` }}
          role="img"
          aria-label={slide.alt}
        />
      ))}
      <div className="hero-bg-overlay" />
      <div className="hero-grain" />
    </div>
  );
}
