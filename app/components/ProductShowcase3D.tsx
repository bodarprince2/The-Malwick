"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

/* ────────────────────────────────────────────────────────
 *  Scroll-driven 3D T-shirt showcase
 *
 *  Uses CSS 3D transforms (rotateY) driven by scroll position
 *  to create a premium 360° product experience.
 *
 *  The section is tall (300vh on desktop, 200vh on mobile)
 *  with the product pinned in the center via `position: sticky`.
 * ──────────────────────────────────────────────────────── */

const PRODUCTS = [
  {
    src: "/the-melwick-mens-black-premium-tee.png",
    alt: "The Melwick premium black heavyweight cotton T-shirt — front view",
    name: "Obsidian Black",
    subtitle: "Architectural Collection",
  },
  {
    src: "/the-melwick-mens-charcoal-premium-tee.png",
    alt: "The Melwick premium charcoal heavyweight cotton T-shirt — front view",
    name: "Graphite Charcoal",
    subtitle: "Essential Series",
  },
  {
    src: "/the-melwick-mens-cream-premium-tee.png",
    alt: "The Melwick premium cream heavyweight cotton T-shirt — front view",
    name: "Ivory Cream",
    subtitle: "Heritage Line",
  },
];

/* Captions that appear at different scroll progress points */
const CAPTIONS = [
  { start: 0.0, end: 0.2, text: "360° VIEW", sub: "Scroll to explore" },
  { start: 0.25, end: 0.45, text: "PREMIUM COTTON", sub: "280gsm heavyweight" },
  { start: 0.5, end: 0.7, text: "CRAFTED DETAILS", sub: "Drop-shoulder construction" },
  { start: 0.75, end: 0.95, text: "TIMELESS FIT", sub: "Oversized relaxed silhouette" },
];

export default function ProductShowcase3D() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeProduct, setActiveProduct] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const rafRef = useRef<number>(0);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  /* Smooth interpolation loop */
  const animate = useCallback(() => {
    const current = currentProgressRef.current;
    const target = targetProgressRef.current;
    const diff = target - current;

    if (Math.abs(diff) > 0.001) {
      const next = current + diff * 0.12; // Smooth easing factor
      currentProgressRef.current = next;
      setProgress(next);
    }
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    /* Start animation loop */
    rafRef.current = requestAnimationFrame(animate);

    /* Calculate scroll progress through the section */
    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollableDistance = sectionHeight - viewportHeight;

      if (scrollableDistance <= 0) return;

      // How far into the section we've scrolled
      const scrolled = -rect.top;
      const raw = Math.max(0, Math.min(1, scrolled / scrollableDistance));
      targetProgressRef.current = raw;
    };

    /* IntersectionObserver for visibility */
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(section);

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initialize

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  /* Rotation: full 360° mapped to scroll progress */
  const rotationY = progress * 360;

  /* Scale: slightly smaller at start/end for entry/exit effect */
  const distFromCenter = Math.abs(progress - 0.5);
  const scale = 0.88 + (1 - distFromCenter * 0.4) * 0.12;

  /* Background gradient shifts subtly with rotation */
  const bgHue = 30 + progress * 10; // warm shift
  const bgLightness = 96 - progress * 2;

  /* Active caption */
  const activeCaption = CAPTIONS.find(
    (c) => progress >= c.start && progress <= c.end
  );
  const captionOpacity = activeCaption
    ? (() => {
        const mid = (activeCaption.start + activeCaption.end) / 2;
        const halfRange = (activeCaption.end - activeCaption.start) / 2;
        return 1 - Math.abs(progress - mid) / halfRange;
      })()
    : 0;

  /* Progress indicator */
  const progressPercent = Math.round(progress * 100);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#f8f6f2]"
      id="product-showcase-3d"
      aria-label="360° product showcase"
      style={{ height: "300vh" }}
    >
      {/* Sticky container — stays centered in viewport */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(
            180deg,
            hsl(${bgHue}, 20%, ${bgLightness}%) 0%,
            hsl(${bgHue + 5}, 15%, ${bgLightness - 1}%) 50%,
            hsl(${bgHue}, 20%, ${bgLightness}%) 100%
          )`,
        }}
      >
        {/* Section heading — visible at start */}
        <div
          className="absolute top-[8%] md:top-[10%] left-0 right-0 text-center transition-opacity duration-700 z-20"
          style={{ opacity: progress < 0.15 ? 1 - progress * 6 : 0 }}
        >
          <p className="text-[0.65rem] md:text-xs font-semibold tracking-[0.25em] uppercase text-[#b8976a] mb-2">
            The Collection
          </p>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-medium text-[#1a1a1a]">
            Explore Every Detail
          </h2>
        </div>

        {/* Product selector pills */}
        <div
          className="absolute top-[6%] md:top-[8%] left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-30 transition-opacity duration-500"
          style={{ opacity: progress > 0.05 ? 1 : 0 }}
        >
          {PRODUCTS.map((product, i) => (
            <button
              key={i}
              onClick={() => setActiveProduct(i)}
              className={`px-3 py-1.5 md:px-4 md:py-2 text-[0.6rem] md:text-xs font-semibold tracking-[0.15em] uppercase rounded-full transition-all duration-300 border ${
                i === activeProduct
                  ? "bg-[#1a1a1a] text-[#f8f6f2] border-[#1a1a1a]"
                  : "bg-transparent text-[#5a5a5a] border-[#1a1a1a]/15 hover:border-[#1a1a1a]/40"
              }`}
              aria-label={`View ${product.name}`}
            >
              {product.name}
            </button>
          ))}
        </div>

        {/* 3D Product Container */}
        <div
          className="relative w-[280px] h-[350px] sm:w-[340px] sm:h-[430px] md:w-[420px] md:h-[530px] lg:w-[480px] lg:h-[600px]"
          style={{
            perspective: "1200px",
            perspectiveOrigin: "center center",
          }}
        >
          {PRODUCTS.map((product, i) => (
            <div
              key={product.src}
              className="absolute inset-0 transition-opacity duration-700"
              style={{
                opacity: i === activeProduct ? 1 : 0,
                pointerEvents: i === activeProduct ? "auto" : "none",
                transform: `scale(${scale}) rotateY(${rotationY}deg)`,
                transformStyle: "preserve-3d",
                willChange: isInView ? "transform" : "auto",
                transition: "opacity 0.7s ease",
              }}
            >
              {/* Front face */}
              <div
                className="absolute inset-0"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <div className="relative w-full h-full drop-shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
                  <Image
                    src={product.src}
                    alt={product.alt}
                    fill
                    sizes="(max-width: 640px) 280px, (max-width: 768px) 340px, (max-width: 1024px) 420px, 480px"
                    className="object-contain"
                    quality={90}
                    priority={i === 0}
                  />
                </div>
              </div>

              {/* Back face (mirrored image for 360° illusion) */}
              <div
                className="absolute inset-0"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="relative w-full h-full drop-shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
                  <Image
                    src={product.src}
                    alt={`${product.alt} — back view`}
                    fill
                    sizes="(max-width: 640px) 280px, (max-width: 768px) 340px, (max-width: 1024px) 420px, 480px"
                    className="object-contain scale-x-[-1]"
                    quality={85}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Subtle reflection */}
          <div
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[70%] h-8 rounded-[100%] blur-xl transition-opacity duration-300"
            style={{
              background: "radial-gradient(ellipse, rgba(0,0,0,0.08), transparent 70%)",
              opacity: isInView ? 1 : 0,
            }}
          />
        </div>

        {/* Dynamic caption */}
        <div
          className="absolute bottom-[18%] md:bottom-[15%] left-0 right-0 text-center z-20 transition-opacity duration-300 pointer-events-none"
          style={{ opacity: captionOpacity }}
        >
          {activeCaption && (
            <>
              <p className="text-lg md:text-2xl lg:text-3xl font-display font-medium text-[#1a1a1a] tracking-wide">
                {activeCaption.text}
              </p>
              <p className="text-xs md:text-sm text-[#5a5a5a] mt-1 tracking-widest uppercase">
                {activeCaption.sub}
              </p>
            </>
          )}
        </div>

        {/* Product name & subtitle — bottom */}
        <div
          className="absolute bottom-[6%] md:bottom-[8%] left-0 right-0 text-center z-20 transition-opacity duration-500"
          style={{ opacity: progress > 0.05 ? 0.7 : 0 }}
        >
          <p className="font-display text-base md:text-lg font-medium text-[#1a1a1a] tracking-wide">
            {PRODUCTS[activeProduct].name}
          </p>
          <p className="text-[0.6rem] md:text-xs text-[#8a8a8a] tracking-[0.2em] uppercase mt-1">
            {PRODUCTS[activeProduct].subtitle}
          </p>
        </div>

        {/* Scroll progress indicator */}
        <div
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2 transition-opacity duration-500"
          style={{ opacity: progress > 0.03 && progress < 0.97 ? 0.5 : 0 }}
        >
          <div className="w-[2px] h-20 md:h-32 bg-[#1a1a1a]/10 rounded-full overflow-hidden relative">
            <div
              className="absolute top-0 left-0 w-full bg-[#b8976a] rounded-full transition-[height] duration-100"
              style={{ height: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[0.5rem] md:text-[0.6rem] text-[#8a8a8a] tracking-widest font-medium">
            {progressPercent}%
          </span>
        </div>

        {/* Scroll hint at start */}
        <div
          className="absolute bottom-[2%] md:bottom-[3%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 transition-opacity duration-500"
          style={{ opacity: progress < 0.05 ? 1 : 0 }}
        >
          <span className="text-[0.55rem] md:text-[0.65rem] text-[#8a8a8a] tracking-[0.2em] uppercase">
            Scroll to rotate
          </span>
          <div className="w-5 h-8 border border-[#1a1a1a]/20 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-[#1a1a1a]/30 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
