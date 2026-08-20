import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with The Melwick. We are here to answer your questions about our premium streetwear and upcoming launches.",
  alternates: {
    canonical: "/contact",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://themelwick.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Contact Us",
          "item": "https://themelwick.com/contact"
        }
      ]
    },
    {
      "@type": "Organization",
      "@id": "https://themelwick.com/#organization",
      "name": "The Melwick",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "themelwick@gmail.com",
        "contactType": "customer support"
      }
    }
  ]
};

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* ── Header ── */}
      <header className="w-full px-6 py-6 md:px-12 flex items-center justify-between border-b border-[#1a3c34]/10 bg-[#fdfbf7]">
        <Link href="/" className="flex items-center gap-3 no-underline text-[#1a3c34]" aria-label="The Melwick — Home">
          <div className="flex items-center justify-center w-10 h-10 border border-[#1a3c34]/10 rounded bg-[#fdfbf7] transition-transform duration-300 hover:scale-105">
            <Image
              src="/favicon.png"
              alt="The Melwick logo"
              width={24}
              height={24}
              className="w-6 h-6 object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-semibold tracking-[0.12em] uppercase leading-tight text-[#1a3c34]">The Melwick</span>
            <span className="font-body text-[0.55rem] font-normal tracking-[0.2em] uppercase text-[#4a5c54] leading-none">Est. 2026</span>
          </div>
        </Link>
        <nav className="flex items-center gap-8" aria-label="Primary navigation">
          <Link
            href="/#signup-section"
            className="font-body text-xs font-medium tracking-[0.14em] uppercase text-[#4a5c54] no-underline transition-colors hover:text-[#1a3c34]"
          >
            Get Notified
          </Link>
        </nav>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 py-20 px-6 md:px-12 max-w-4xl mx-auto w-full">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-[#1a3c34] mb-12">Contact Us</h1>
        
        <div className="space-y-8 text-lg leading-relaxed text-[#4a5c54]">
          <p>
            Have a question about our upcoming launch, sizing, or press inquiries? 
            We'd love to hear from you.
          </p>
          
          <h2 className="font-display text-2xl md:text-3xl font-medium text-[#1a3c34] mt-16 mb-6">
            Customer Support
          </h2>
          <p>
            Email us directly at:<br />
            <a href="mailto:themelwick@gmail.com" className="text-[#1a3c34] font-medium underline hover:text-[#c4a977] transition-colors">themelwick@gmail.com</a>
          </p>

          <h2 className="font-display text-2xl md:text-3xl font-medium text-[#1a3c34] mt-16 mb-6">
            Social Media
          </h2>
          <p>
            Connect with us on our social platforms for the latest updates on our premium streetwear collections.
          </p>
          <ul className="space-y-4 text-[#1a3c34] font-medium mt-6">
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#c4a977] transition-colors underline">Instagram</a></li>
            <li><a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#c4a977] transition-colors underline">TikTok</a></li>
            <li><a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#c4a977] transition-colors underline">Pinterest</a></li>
            <li><a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#c4a977] transition-colors underline">X (Twitter)</a></li>
          </ul>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-[#1a3c34] text-[#fdfbf7] py-16 px-6 md:px-12 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col items-center md:flex-row justify-between gap-8">
          <div className="flex flex-col items-center md:items-start">
            <Image
              src="/favicon.png"
              alt=""
              width={24}
              height={24}
              className="w-6 h-6 object-contain mb-4 filter invert opacity-80"
            />
            <p className="font-display text-xl font-semibold tracking-widest uppercase mb-1 text-[#c4a977]">
              The Melwick
            </p>
            <p className="text-xs text-[#fdfbf7]/50 tracking-wider">Est. 2026</p>
          </div>
          
          <div className="flex gap-8 text-sm font-medium tracking-widest uppercase text-[#fdfbf7]/70">
            <Link href="/about" className="hover:text-[#c4a977] transition-colors">About</Link>
            <Link href="/contact" className="hover:text-[#c4a977] transition-colors">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-[#c4a977] transition-colors">Privacy</Link>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#fdfbf7]/10 flex justify-center text-center">
          <p className="text-xs text-[#fdfbf7]/40 tracking-wide">
            &copy; 2026 The Melwick. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
