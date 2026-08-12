import Image from "next/image";
import Countdown from "./components/Countdown";
import EmailSignup from "./components/EmailSignup";
import HeroBackground from "./components/HeroBackground";
import ScrollEffects from "./components/ScrollEffects";
import {
  InstagramIcon,
  TikTokIcon,
  PinterestIcon,
  XTwitterIcon,
} from "./components/SocialIcons";

// Launch date — set to Jan 1, 2027
const LAUNCH_DATE = "2027-01-01T00:00:00";

export default function Home() {
  return (
    <>
      {/* ── Page Loader ── */}
      <div className="page-loader" aria-hidden="true">
        <div className="loader-inner">
          <Image
            src="/favicon.png"
            alt=""
            width={50}
            height={50}
            className="loader-logo"
            priority
          />
          <div className="loader-bar">
            <div className="loader-bar-fill" />
          </div>
        </div>
      </div>

      {/* ── Client-side scroll / header / reveal effects ── */}
      <ScrollEffects />

      {/* ── Header ── */}
      <header className="site-header animate-fade-in" id="site-header">
        <a href="/" className="header-logo" aria-label="The Melwick — Home">
          <div className="header-logo-mark">
            <Image
              src="/favicon.png"
              alt="The Melwick logo"
              width={32}
              height={32}
              className="header-logo-img"
              priority
            />
          </div>
          <div className="header-brand-text">
            <span className="header-brand-name">The Melwick</span>
            <span className="header-brand-tag">Est. 2026</span>
          </div>
        </a>
        <nav className="header-nav" aria-label="Primary navigation">
          <a
            href="#signup-section"
            className="header-nav-link"
            id="nav-notify"
          >
            Get Notified
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="header-nav-link header-nav-link--accent"
            id="nav-instagram"
          >
            <span className="nav-dot" aria-hidden="true" />
            Instagram
          </a>
        </nav>
      </header>

      <main>
        {/* ── Hero Section ── */}
        <section className="hero" id="hero" aria-labelledby="hero-title">
          <HeroBackground />

          <div className="hero-content">
            {/* Eyebrow text */}
            <p className="hero-eyebrow animate-fade-in delay-200" aria-hidden="true">
              <span className="eyebrow-line" />
              Coming Soon
              <span className="eyebrow-line" />
            </p>

            {/* Brand Name — pure typography, no logo image */}
            <h1 className="hero-title animate-fade-in-up delay-400" id="hero-title">
              <span className="title-the">The</span>
              <span className="title-melwick">Melwick</span>
            </h1>

            {/* Tagline */}
            <p className="hero-tagline animate-fade-in-up delay-600">
              Redefining Everyday Style
            </p>

            {/* Decorative divider */}
            <div className="hero-divider-wrap animate-fade-in delay-700" aria-hidden="true">
              <span className="hero-diamond" />
            </div>

            {/* Countdown */}
            <div className="animate-fade-in-up delay-800">
              <p className="countdown-label-top">Launching In</p>
              <Countdown targetDate={LAUNCH_DATE} />
            </div>

            {/* CTA Button in hero */}
            <div className="animate-fade-in-up delay-1000">
              <a href="#signup-section" className="hero-cta">
                <span>Join The Waitlist</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="scroll-indicator animate-fade-in delay-1400" aria-hidden="true">
            <div className="scroll-mouse">
              <div className="scroll-dot" />
            </div>
            <span className="scroll-text">Scroll</span>
          </div>
        </section>

        {/* ── Brand Story Section ── */}
        <section
          className="brand-story"
          id="brand-story"
          aria-labelledby="brand-story-heading"
        >
          {/* Ambient glow */}
          <div className="ambient-glow ambient-glow--left" aria-hidden="true" />
          <div className="ambient-glow ambient-glow--right" aria-hidden="true" />

          <div className="brand-story-inner reveal">
            <p className="section-label">Our Story</p>
            <h2 id="brand-story-heading">
              Where Heritage<br />Meets Modern Edge
            </h2>
            <div className="story-divider" aria-hidden="true" />
            <p>
              The Melwick is a premium clothing brand born at the intersection of timeless
              craftsmanship and contemporary streetwear culture. We believe that elevated
              style should be effortless — designed for those who move through the world
              with quiet confidence.
            </p>
            <p className="story-second">
              Every piece is thoughtfully constructed with
              responsibly sourced materials, clean silhouettes, and a commitment to quality
              that lasts beyond seasons.
            </p>
          </div>
        </section>

        {/* ── Email Signup Section ── */}
        <section
          className="signup-section"
          id="signup-section"
          aria-labelledby="signup-heading"
        >
          <div className="signup-glow" aria-hidden="true" />
          <div className="signup-inner reveal">
            <div className="signup-badge">
              <span className="badge-dot" />
              Early Access
            </div>
            <h2 id="signup-heading">Be The First To Know</h2>
            <p className="signup-subtitle">
              Join the inner circle for early access, exclusive drops, and
              launch-day offers. No spam — just style.
            </p>
            <EmailSignup />
            <p className="signup-privacy">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </section>

        {/* ── Social Links ── */}
        <section
          className="social-section reveal"
          id="social-section"
          aria-label="Follow us on social media"
        >
          <p className="social-label">Follow The Journey</p>
          <div className="social-links">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Follow The Melwick on Instagram"
              id="social-instagram"
            >
              <InstagramIcon />
              <span className="social-link-name">Instagram</span>
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Follow The Melwick on TikTok"
              id="social-tiktok"
            >
              <TikTokIcon />
              <span className="social-link-name">TikTok</span>
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Follow The Melwick on Pinterest"
              id="social-pinterest"
            >
              <PinterestIcon />
              <span className="social-link-name">Pinterest</span>
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Follow The Melwick on X"
              id="social-x"
            >
              <XTwitterIcon />
              <span className="social-link-name">X</span>
            </a>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="site-footer" id="site-footer">
        <div className="footer-inner">
          <Image
            src="/favicon.png"
            alt=""
            width={24}
            height={24}
            className="footer-icon"
          />
          <p className="footer-text">
            &copy; 2026 <span className="footer-brand">The Melwick</span>. All
            rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
