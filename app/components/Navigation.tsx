"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

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
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy-policy", label: "Privacy" },
    { href: "/#signup-section", label: "Notify" },
  ];

  // Mobile sidebar rendered via portal so that the header's
  // backdrop-filter (added on scroll) doesn't create a new
  // containing block that breaks fixed positioning.
  const mobileSidebar = (
    <>
      {/* Dark backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-[105] transition-opacity duration-400 ease-in-out md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[280px] max-w-[80vw] bg-[#f8f6f2] z-[106] flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.12)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex justify-end px-6 pt-6">
          <button
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-[#1a1a1a]/10 text-[#1a1a1a] hover:bg-[#1a1a1a]/5 transition-colors focus:outline-none"
            aria-label="Close menu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="2" y1="2" x2="14" y2="14" />
              <line x1="14" y1="2" x2="2" y2="14" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="mx-6 mt-4 mb-2 h-px bg-[#1a1a1a]/10" />

        {/* Navigation links */}
        <nav className="flex flex-col px-6 pt-4 gap-1">
          {links.map((link, index) => (
            <div
              key={link.label}
              className={`transition-all duration-500 transform ${
                isOpen ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
              }`}
              style={{ transitionDelay: `${isOpen ? index * 70 + 150 : 0}ms` }}
            >
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-3 font-display text-xl font-medium tracking-[0.08em] uppercase text-[#1a1a1a] no-underline transition-colors hover:text-[#b8976a]"
              >
                {link.label}
              </Link>
            </div>
          ))}
        </nav>

        {/* Bottom accent */}
        <div className="mt-auto px-6 pb-8">
          <div className="h-px bg-[#1a1a1a]/10 mb-4" />
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-[#8a8a8a]">
            The Melwick
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="font-body text-xs font-medium tracking-[0.14em] uppercase text-[#5a5a5a] no-underline transition-colors hover:text-[#1a1a1a]"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Nav Toggle (Hamburger) */}
      <button
        className="md:hidden p-2 -mr-2 text-[#1a1a1a] focus:outline-none z-[110] relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <div className="w-6 h-5 flex flex-col justify-between items-end">
          <span className={`block h-[2px] bg-[#1a1a1a] transition-all duration-300 ${isOpen ? 'w-6 rotate-45 translate-y-[9px]' : 'w-6'}`} />
          <span className={`block h-[2px] bg-[#1a1a1a] transition-all duration-300 ${isOpen ? 'w-0 opacity-0' : 'w-5'}`} />
          <span className={`block h-[2px] bg-[#1a1a1a] transition-all duration-300 ${isOpen ? 'w-6 -rotate-45 -translate-y-[9px]' : 'w-4'}`} />
        </div>
      </button>

      {/* Mobile Sidebar — portaled to body to avoid containing block issues */}
      {mounted && createPortal(mobileSidebar, document.body)}
    </>
  );
}

