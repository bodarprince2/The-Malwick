import Image from "next/image";
import Link from "next/link";
import Countdown from "./components/Countdown";
import EmailSignup from "./components/EmailSignup";
import HeroBackground from "./components/HeroBackground";
import ScrollEffects from "./components/ScrollEffects";
import Navigation from "./components/Navigation";
import {
  InstagramIcon,
  FacebookIcon,
  XTwitterIcon,
} from "./components/SocialIcons";

// Launch date — set to Jan 1, 2027
const LAUNCH_DATE = "2027-01-01T00:00:00";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://themelwick.com/#organization",
      "name": "The Melwick",
      "alternateName": ["Melwick", "Malwick", "The Malwick", "Mel", "Male"],
      "url": "https://themelwick.com",
      "sameAs": [
        "https://www.instagram.com/themelwick/",
        "https://www.facebook.com/themelwick/",
        "https://x.com"
      ]
    },
    {
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
    }
  ]
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
      <header className="site-header fixed top-0 left-0 right-0 z-[100] px-6 py-6 md:px-12 flex items-center justify-between transition-all duration-500 bg-transparent [&.scrolled]:bg-[#f8f6f2]/95 [&.scrolled]:backdrop-blur-md [&.scrolled]:border-b [&.scrolled]:border-[#1a1a1a]/10 [&.scrolled]:py-4 animate-fade-in" id="site-header">
        <Link href="/" className="flex items-center gap-3 no-underline text-[#1a1a1a]" aria-label="The Melwick — Home">
          <span className="font-display text-2xl font-bold uppercase tracking-widest">
            The Melwick
          </span>
        </Link>
        <Navigation />
      </header>

      <main>
        {/* ── Hero Section ── */}
        <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden" id="hero" aria-labelledby="hero-title">
          <HeroBackground />

          <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto w-full">
            {/* Eyebrow text */}
            <p className="flex items-center gap-4 text-xs font-medium tracking-[0.2em] uppercase text-[#1a1a1a] mb-8 animate-fade-in delay-200" aria-hidden="true">
              <span className="w-8 h-[1px] bg-[#1a1a1a]/30" />
              Coming Soon
              <span className="w-8 h-[1px] bg-[#1a1a1a]/30" />
            </p>

            {/* Brand Name — pure typography, no logo image */}
            <h1 className="font-display flex flex-col items-center leading-none text-[#1a1a1a] animate-fade-in-up delay-400 mb-6" id="hero-title">
              <span className="text-3xl md:text-5xl lg:text-6xl italic font-light tracking-wide mb-2 opacity-80">The</span>
              <span className="text-6xl md:text-8xl lg:text-9xl font-semibold tracking-[0.05em] uppercase">Melwick</span>
            </h1>

            {/* Tagline */}
            <p className="font-display text-xl md:text-2xl lg:text-3xl italic text-[#5a5a5a] animate-fade-in-up delay-600 mb-12">
              Premium Streetwear Redefining Everyday Style
            </p>

            {/* Decorative divider */}
            <div className="flex justify-center mb-16 animate-fade-in delay-700" aria-hidden="true">
              <span className="w-2 h-2 rotate-45 bg-[#b8976a]" />
            </div>

            {/* Countdown */}
            <div className="animate-fade-in-up delay-800 mb-16 flex flex-col items-center">
              <p className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#5a5a5a] mb-6">Launching In</p>
              <Countdown targetDate={LAUNCH_DATE} />
            </div>

            {/* CTA Button in hero */}
            <div className="animate-fade-in-up delay-1000">
              <a href="#signup-section" className="inline-flex items-center gap-3 bg-[#1a1a1a] text-[#f8f6f2] px-8 py-4 text-sm font-semibold tracking-widest uppercase rounded shadow-sm hover:bg-[#2d2d2d] transition-colors border border-[#1a1a1a]">
                <span>Join The Waitlist</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </section>

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
      <footer className="bg-[#1a1a1a] text-[#f8f6f2] py-16 px-6 md:px-12 border-t border-[#f8f6f2]/10" id="site-footer">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-8">
          <div className="flex gap-8 text-sm font-medium tracking-widest uppercase text-[#f8f6f2]/70">
            <Link href="/about" className="hover:text-[#b8976a] transition-colors" prefetch={true}>About</Link>
            <Link href="/contact" className="hover:text-[#b8976a] transition-colors" prefetch={true}>Contact</Link>
            <Link href="/privacy-policy" className="hover:text-[#b8976a] transition-colors" prefetch={true}>Privacy</Link>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#f8f6f2]/10 flex justify-center text-center">
          <p className="text-xs text-[#f8f6f2]/50 tracking-wide">
            &copy; 2026 The Melwick. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
