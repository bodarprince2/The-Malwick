import Image from "next/image";
import Link from "next/link";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
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
      <Header variant="solid" />

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

      <Footer />
    </div>
  );
}
