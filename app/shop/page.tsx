import Image from "next/image";
import Link from "next/link";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
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
      <Header variant="solid" />

      {/* ── Main Content via Client Component ── */}
      <ShopClient products={products} />

      <Footer />
    </div>
  );
}
