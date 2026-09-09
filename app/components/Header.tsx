"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Navigation from "./Navigation";
import { useAppSelector } from "../store/hooks";

interface HeaderProps {
  variant?: "transparent" | "solid";
}

export default function Header({ variant = "solid" }: HeaderProps) {
  const cartTotalQuantity = useAppSelector((state) => state.cart.totalQuantity);
  const wishlistItems = useAppSelector((state) => state.wishlist.items.length);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const headerClass = variant === "transparent"
    ? "site-header fixed top-0 left-0 right-0 z-[100] px-4 md:px-12 py-1.5 md:py-3 flex items-center justify-between transition-all duration-500 bg-transparent [&.scrolled]:bg-[#f8f6f2]/95 [&.scrolled]:backdrop-blur-md [&.scrolled]:border-b [&.scrolled]:border-[#1a1a1a]/10 [&.scrolled]:py-1 md:[&.scrolled]:py-2 animate-fade-in"
    : "w-full px-4 md:px-12 py-1.5 md:py-3 flex items-center justify-between border-b border-[#1a1a1a]/10 bg-[#f8f6f2] z-[100] relative";

  return (
    <header className={headerClass} id="site-header">
      <Link href="/" className="flex items-center gap-3 no-underline text-[#1a1a1a] z-[101] py-1" aria-label="The Melwick — Home">
        <Image
          src="/logo.png"
          alt="The Melwick Logo"
          width={84}
          height={56}
          className="h-[44px] md:h-[56px] w-auto object-contain"
          priority
        />
      </Link>

      <div className="flex items-center gap-4 md:gap-6 z-[101]">

        {/* Cart and Wishlist Icons */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/wishlist" className="relative text-[#1a1a1a] hover:text-[#b8976a] transition-colors" aria-label="Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {mounted && wishlistItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#1a1a1a] text-[#f8f6f2] text-[9px] font-medium tracking-wide w-4 h-4 rounded-full flex items-center justify-center scale-in ring-2 ring-[#f8f6f2]">
                {wishlistItems}
              </span>
            )}
          </Link>

          <Link href="/cart" className="relative text-[#1a1a1a] hover:text-[#b8976a] transition-colors" aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {mounted && cartTotalQuantity > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#1a1a1a] text-[#f8f6f2] text-[9px] font-medium tracking-wide w-4 h-4 rounded-full flex items-center justify-center scale-in ring-2 ring-[#f8f6f2]">
                {cartTotalQuantity}
              </span>
            )}
          </Link>
        </div>

        {/* Navigation handles Desktop links (absolutely centered) and Mobile toggle (inline here) */}
        <Navigation />
      </div>
    </header>
  );
}
