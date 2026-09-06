"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Track mount state for portal rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const links = [
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const mobileMenu = (
    <>
      <div
        className={`fixed inset-0 bg-[#f8f6f2] z-[105] flex flex-col transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Close button - Top Right */}
        <div className="absolute top-6 right-6 md:right-12 z-[110]">
          <button
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#1a1a1a] hover:bg-[#1a1a1a]/5 transition-colors focus:outline-none"
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        {/* Navigation links - Centered full screen */}
        <nav className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
          {links.map((link, index) => {
            const isActive = pathname === link.href;
            return (
              <div
                key={link.label}
                className={`transition-all duration-700 transform ${
                  isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${isOpen ? index * 100 + 100 : 0}ms` }}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block font-display text-4xl sm:text-5xl font-medium tracking-[0.1em] uppercase transition-colors hover:text-[#b8976a] ${
                    isActive ? "text-[#1a1a1a]" : "text-[#1a1a1a]/70"
                  }`}
                >
                  {link.label}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Bottom accent */}
        <div className="px-6 pb-12 flex flex-col items-center">
          <div className="w-12 h-px bg-[#1a1a1a]/20 mb-8" />
          <p className="font-body text-xs tracking-[0.2em] uppercase text-[#1a1a1a]/50">
            The Melwick
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Nav - Absolutely centered in the Header */}
      <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8 lg:gap-12" aria-label="Primary navigation">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`relative font-body text-xs font-medium tracking-[0.14em] uppercase no-underline transition-colors hover:text-[#1a1a1a] ${
                isActive ? "text-[#1a1a1a] font-semibold" : "text-[#5a5a5a]"
              }`}
            >
              {link.label}
              {isActive && (
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#b8976a] rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Mobile Nav Toggle (Hamburger) */}
      <div className="md:hidden flex items-center border-l border-[#1a1a1a]/20 pl-4">
        <button
          className="p-1 text-[#1a1a1a] focus:outline-none relative z-[110]"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <line x1="4" y1="8" x2="20" y2="8" />
            <line x1="4" y1="16" x2="20" y2="16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu - Portaled */}
      {mounted && createPortal(mobileMenu, document.body)}
    </>
  );
}
