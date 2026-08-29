"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

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
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy-policy", label: "Privacy" },
    { href: "/#signup-section", label: "Notify" },
  ];

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

      {/* Mobile Nav Toggle */}
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

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-[#f8f6f2] z-[105] flex flex-col items-center justify-center transition-all duration-500 ease-in-out md:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <nav className="flex flex-col items-center gap-10 text-center">
          {links.map((link, index) => (
            <div 
              key={link.label}
              className={`transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              style={{ transitionDelay: `${isOpen ? index * 100 + 100 : 0}ms` }}
            >
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-display text-4xl font-medium tracking-[0.1em] uppercase text-[#1a1a1a] no-underline transition-colors hover:text-[#b8976a]"
              >
                {link.label}
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
