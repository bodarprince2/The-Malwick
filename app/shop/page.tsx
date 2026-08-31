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

const products = [
  {
    id: "tee-black",
    name: "Noir Oversized Tee",
    category: "Oversized T-Shirts",
    price: 1499,
    image: "/tee-black-front.png",
  },
  {
    id: "tee-cream",
    name: "Ivory Drop Tee",
    category: "Oversized T-Shirts",
    price: 1499,
    image: "/tee-cream-front.png",
  },
  {
    id: "tee-sand",
    name: "Sand Classic Tee",
    category: "Oversized T-Shirts",
    price: 1299,
    image: "/tee-sand-front.png",
  },
  {
    id: "tee-charcoal",
    name: "Charcoal Drape Tee",
    category: "Oversized T-Shirts",
    price: 1399,
    image: "/tee-black-front.png",
  },
  {
    id: "tee-oat",
    name: "Oat Heritage Tee",
    category: "Oversized T-Shirts",
    price: 1299,
    image: "/tee-cream-front.png",
  },
  {
    id: "tee-dune",
    name: "Dune Relaxed Tee",
    category: "Oversized T-Shirts",
    price: 1399,
    image: "/tee-sand-front.png",
  },
  {
    id: "tee-obsidian",
    name: "Obsidian Core Tee",
    category: "Oversized T-Shirts",
    price: 1599,
    image: "/tee-black-front.png",
  },
];

const categories = ["All", "Oversized T-Shirts"];

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

      {/* ── Main Content ── */}
      <main className="flex-1">
        {/* Page title bar */}
        <div className="px-6 md:px-12 py-8 border-b border-[#1a1a1a]/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="font-display text-2xl md:text-3xl font-medium text-[#1a1a1a]">
              Oversized T-Shirts
            </h1>
          </div>
        </div>

        {/* Category filter pills */}
        <div className="px-6 md:px-12 py-5 border-b border-[#1a1a1a]/5 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex gap-3">
            {categories.map((cat, i) => (
              <span
                key={cat}
                className={`shrink-0 px-5 py-2.5 rounded-full text-xs font-semibold tracking-[0.1em] uppercase transition-colors cursor-pointer border ${
                  i === 0
                    ? "bg-[#1a1a1a] text-[#f8f6f2] border-[#1a1a1a]"
                    : "bg-transparent text-[#1a1a1a] border-[#1a1a1a]/20 hover:border-[#1a1a1a]/50"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div className="px-6 md:px-12 py-10">
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {products.map((product) => (
              <div key={product.id} className="group flex flex-col" id={`product-${product.id}`}>
                {/* Product image card — hover effect only, no navigation */}
                <div className="relative aspect-[3/4] w-full bg-[#eae7e1] rounded-sm overflow-hidden cursor-default">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Product info */}
                <div className="pt-3 md:pt-4 flex flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-body text-sm md:text-base font-semibold text-[#1a1a1a] leading-tight line-clamp-2">
                      <Link href="/#signup-section" className="no-underline text-[#1a1a1a] hover:text-[#b8976a] transition-colors">
                        {product.name}
                      </Link>
                    </h3>
                    {/* Wishlist heart */}
                    <WishlistHeart name={product.name} />
                  </div>
                  <p className="text-xs md:text-sm text-[#8a8a8a]">{product.category}</p>
                  <p className="text-sm md:text-base font-semibold text-[#1a1a1a] mt-1">
                    ₹ {product.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

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
