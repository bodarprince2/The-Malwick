import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ScrollEffects from "./components/ScrollEffects";
import Navigation from "./components/Navigation";
import HeroCarousel from "./components/HeroCarousel";
import dynamic from "next/dynamic";
import ActivityTracker from "./components/ActivityTracker";
import Header from "./components/Header";
import Footer from "./components/Footer";

const Countdown = dynamic(() => import("./components/Countdown"));
const EmailSignup = dynamic(() => import("./components/EmailSignup"));
const FeaturedProduct = dynamic(() => import("./components/FeaturedProduct"));
const FAQ = dynamic(() => import("./components/FAQ"));
import {
  InstagramIcon,
  FacebookIcon,
  XTwitterIcon,
} from "./components/SocialIcons";

// Launch date — set to Dec 1, 2026
const LAUNCH_DATE = "2026-12-01T00:00:00";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://themelwick.com/#website",
  "url": "https://themelwick.com",
  "name": "The Melwick",
  "description": "Premium clothing brand redefining everyday style. Discover our modern heritage apparel and luxury streetwear.",
  "publisher": {
    "@id": "https://themelwick.com/#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://themelwick.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── Page Loader ── */}
      <div className="page-loader fixed inset-0 z-[9999] bg-[#f8f6f2] flex items-center justify-center transition-all duration-800 ease-out aria-hidden:opacity-0 aria-hidden:pointer-events-none [&.loaded]:opacity-0 [&.loaded]:pointer-events-none" aria-hidden="true">
        <div className="flex flex-col items-center gap-6">
          <div className="w-32 h-[1px] bg-[#1a1a1a]/10 overflow-hidden">
            <div className="h-full bg-[#1a1a1a] w-full animate-[loaderFill_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]" />
          </div>
        </div>
      </div>

      {/* ── Client-side scroll / header / reveal effects ── */}
      <ScrollEffects />

      {/* ── Header ── */}
      <Header variant="transparent" />

      <main>
        {/* ── Hero Section ── */}
        <section className="relative min-h-[100svh] flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 pt-28 pb-16 lg:py-0 overflow-hidden" id="hero" aria-labelledby="hero-title">
          {/* Left Column: Content */}
          <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-[40%] xl:w-[45%] max-w-2xl mx-auto lg:mx-0 lg:pl-12 xl:pl-24 mb-12 lg:mb-0">
            {/* Eyebrow text */}
            <p className="flex items-center justify-center lg:justify-start gap-4 text-[0.65rem] md:text-xs font-semibold tracking-[0.2em] uppercase text-[#1a1a1a] mb-4 md:mb-6 animate-fade-in delay-200" aria-hidden="true">
              <span className="hidden lg:block w-8 h-[1px] bg-[#1a1a1a]/30" />
              Premium Streetwear
            </p>

            {/* Brand Name */}
            <h1 className="font-display flex flex-col items-center lg:items-start leading-none text-[#1a1a1a] animate-fade-in-up delay-400 mb-6 md:mb-8" id="hero-title">
              <span className="text-4xl md:text-5xl italic font-light tracking-wide mb-1 md:mb-2 text-[#8b6d45]">The</span>
              <span className="text-5xl md:text-7xl xl:text-8xl font-semibold tracking-[0.05em] uppercase">Melwick</span>
            </h1>

            {/* Tagline */}
            <p className="text-sm md:text-base lg:text-lg text-[#5a5a5a] animate-fade-in-up delay-500 mb-10 max-w-md">
              Redefining Everyday Style.<br />
              Crafted for Timeless Confidence.
            </p>

            {/* Launch Date */}
            <div className="animate-fade-in-up delay-600 mb-8 flex flex-col items-center lg:items-start w-full">
              <p className="text-[0.65rem] md:text-xs font-semibold tracking-[0.2em] uppercase text-[#8a8a8a] mb-4">Launching On</p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-display text-5xl md:text-6xl font-semibold text-[#1a1a1a]">1</span>
                <span className="font-display text-xl md:text-2xl italic font-light text-[#b8976a] leading-none -ml-0.5">st</span>
                <span className="font-display text-3xl md:text-4xl font-medium tracking-[0.06em] text-[#1a1a1a] leading-none ml-1">December</span>
              </div>
              <div className="w-full max-w-xs md:max-w-sm lg:max-w-none border-t border-[#1a1a1a]/10 pt-6">
                <Countdown targetDate={LAUNCH_DATE} />
              </div>
            </div>

            {/* CTA Button in hero */}
            <div className="animate-fade-in-up delay-800 w-full lg:w-auto mt-2">
              <Link href="/shop" className="w-full lg:w-auto inline-flex items-center justify-center gap-3 bg-[#1a1a1a] text-[#f8f6f2] px-8 py-4 text-sm font-semibold tracking-widest uppercase rounded shadow hover:bg-[#2d2d2d] hover:shadow-lg transition-all border border-[#1a1a1a] min-h-[44px]">
                <span>Pre-Shop Now</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Column: Carousel */}
          <div className="relative z-10 w-full lg:w-[60%] xl:w-[55%] animate-fade-in delay-1000 mt-8 lg:mt-0">
            <HeroCarousel />
          </div>
        </section>

        {/* ── Featured Product ── */}
        <FeaturedProduct />

        {/* ── Brand Story Section ── */}
        <section
          className="py-32 px-6 md:px-12 bg-[#f8f6f2]"
          id="brand-story"
          aria-labelledby="brand-story-heading"
        >
          <div className="max-w-7xl mx-auto reveal grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Editorial Layout with Image */}
            <div className="relative h-[600px] w-full rounded-sm overflow-hidden shadow-sm">
              <Image
                src="/the-melwick-brand-story.png"
                alt="Premium menswear lifestyle editorial"
                fill
                loading="lazy"
                quality={80}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col items-start max-w-xl">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#b8976a] mb-6">Our Story</p>
              <h2 id="brand-story-heading" className="font-display text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-[#1a1a1a] mb-8">
                Where Heritage<br />Meets Modern Edge
              </h2>
              <div className="w-12 h-[1px] bg-[#b8976a] mb-8" aria-hidden="true" />
              <p className="text-lg leading-relaxed text-[#5a5a5a] mb-8">
                The Melwick is a premium clothing brand offering modern heritage apparel, born at the intersection of timeless
                craftsmanship and contemporary streetwear culture. We believe that elevated
                style should be effortless — designed for those who move through the world
                with quiet confidence.
              </p>
              <p className="text-lg leading-relaxed text-[#5a5a5a]">
                Every piece is thoughtfully constructed with
                responsibly sourced materials, clean silhouettes, and a commitment to quality
                that lasts beyond seasons.
              </p>
            </div>
          </div>
        </section>

        {/* ── Email Signup Section ── */}
        <section
          className="py-32 px-6 bg-[#f0ede6] text-center relative overflow-hidden border-y border-[#1a1a1a]/5"
          id="signup-section"
          aria-labelledby="signup-heading"
        >
          <div className="max-w-3xl mx-auto reveal relative z-10">
            <div className="inline-flex items-center gap-2 border border-[#1a1a1a]/20 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] animate-pulse" />
              <span className="text-[0.65rem] font-semibold tracking-widest uppercase text-[#1a1a1a]">Early Access</span>
            </div>
            <h2 id="signup-heading" className="font-display text-4xl md:text-5xl font-medium text-[#1a1a1a] mb-6">Be The First To Know</h2>
            <p className="text-lg text-[#5a5a5a] mb-12 max-w-lg mx-auto">
              Join the inner circle for early access, exclusive drops, and
              launch-day offers. No spam — just style.
            </p>
            <EmailSignup />
            <p className="text-xs text-[#8a8a8a] mt-12">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </section>

        {/* ── FAQ Section ── */}
        <FAQ />

        {/* ── Social Links ── */}
        <section
          className="py-24 px-6 text-center bg-[#f8f6f2] reveal"
          id="social-section"
          aria-label="Follow us on social media"
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#5a5a5a] mb-10">Follow The Journey</p>
          <div className="flex justify-center gap-8">
            <a
              href="https://www.instagram.com/themelwick/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1a1a1a] hover:text-[#b8976a] transition-colors p-3 bg-[#f0ede6] rounded-full flex items-center justify-center w-12 h-12"
              aria-label="Follow The Melwick on Instagram"
              id="social-instagram"
            >
              <InstagramIcon />
            </a>

            <a
              href="https://www.facebook.com/themelwick/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1a1a1a] hover:text-[#b8976a] transition-colors p-3 bg-[#f0ede6] rounded-full flex items-center justify-center w-12 h-12"
              aria-label="Follow The Melwick on Facebook"
              id="social-facebook"
            >
              <FacebookIcon />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1a1a1a] hover:text-[#b8976a] transition-colors p-3 bg-[#f0ede6] rounded-full flex items-center justify-center w-12 h-12"
              aria-label="Follow The Melwick on X"
              id="social-x"
            >
              <XTwitterIcon />
            </a>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <Footer />
    </>
  );
}
