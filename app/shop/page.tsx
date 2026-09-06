import Image from "next/image";
import Link from "next/link";
import Navigation from "../components/Navigation";
import WishlistHeart from "../components/WishlistHeart";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop The Melwick's premium streetwear collection. Discover heavyweight oversized tees crafted from 280GSM organic cotton.",
  alternates: {
    canonical: "/shop",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://themelwick.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Shop",
      item: "https://themelwick.com/shop",
    },
  ],
};

import { products } from "../data/products";
import ShopClient from "./ShopClient";

export default function Shop() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f2]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Header ── */}
      <header className="w-full px-6 py-6 md:px-12 flex items-center justify-between border-b border-[#1a1a1a]/10 bg-[#f8f6f2]">
        <Link
          href="/"
          className="flex items-center gap-3 no-underline text-[#1a1a1a]"
          aria-label="The Melwick — Home"
        >
          <Image
            src="/logo.png"
            alt="The Melwick Logo"
            width={69}
            height={46}
            className="h-[46px] w-auto object-contain"
            priority
          />
        </Link>
        <Navigation />
      </header>

      {/* ── Main Content via Client Component ── */}
      <ShopClient products={products} />

      {/* ── Footer ── */}
      <footer
        className="bg-[#1a1a1a] text-[#f8f6f2] py-16 px-6 md:px-12 border-t border-[#f8f6f2]/10"
        id="shop-footer"
      >
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-8">
          <div className="flex gap-8 text-sm font-medium tracking-widest uppercase text-[#f8f6f2]/70">
            <Link
              href="/about"
              className="hover:text-[#b8976a] transition-colors"
              prefetch={true}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-[#b8976a] transition-colors"
              prefetch={true}
            >
              Contact
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-[#b8976a] transition-colors"
              prefetch={true}
            >
              Privacy
            </Link>
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
