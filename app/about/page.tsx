import Link from "next/link";
import Navigation from "../components/Navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about The Melwick, a premium clothing brand offering modern heritage apparel and luxury streetwear.",
  alternates: {
    canonical: "/about",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
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
      "name": "About Us",
      "item": "https://themelwick.com/about"
    }
  ]
};

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f2]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* ── Header ── */}
      <header className="w-full px-6 py-6 md:px-12 flex items-center justify-between border-b border-[#1a1a1a]/10 bg-[#f8f6f2]">
        <Link href="/" className="flex items-center gap-3 no-underline text-[#1a1a1a]" aria-label="The Melwick — Home">
          <span className="font-display text-2xl font-bold uppercase tracking-widest">
            The Melwick
          </span>
        </Link>
        <Navigation />
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 py-20 px-6 md:px-12 max-w-4xl mx-auto w-full">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-[#1a1a1a] mb-12">About The Melwick</h1>
        
        <div className="space-y-8 text-lg leading-relaxed text-[#5a5a5a]">
          <p>
            The Melwick is a premium clothing brand born at the intersection of timeless
            craftsmanship and contemporary streetwear culture. We believe that elevated
            style should be effortless — designed for those who move through the world
            with quiet confidence.
          </p>
          <p>
            Every piece of our modern heritage apparel is thoughtfully constructed with
            responsibly sourced materials, clean silhouettes, and a commitment to quality
            that lasts beyond seasons.
          </p>
          
          <h2 className="font-display text-2xl md:text-3xl font-medium text-[#1a1a1a] mt-16 mb-6">
            Our Mission
          </h2>
          <p>
            To redefine luxury everyday style by creating premium streetwear that honors classic design principles while pushing the boundaries of modern fashion.
          </p>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-[#1a1a1a] text-[#f8f6f2] py-16 px-6 md:px-12 mt-auto border-t border-[#f8f6f2]/10">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-8">
          <div className="flex gap-8 text-sm font-medium tracking-widest uppercase text-[#f8f6f2]/70">
            <Link href="/about" className="hover:text-[#b8976a] transition-colors">About</Link>
            <Link href="/contact" className="hover:text-[#b8976a] transition-colors">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-[#b8976a] transition-colors">Privacy</Link>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#f8f6f2]/10 flex justify-center text-center">
          <p className="text-xs text-[#f8f6f2]/50 tracking-wide">
            &copy; 2026 The Melwick. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
