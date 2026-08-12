"use client";

import { useEffect } from "react";

export default function ScrollEffects() {
  useEffect(() => {
    // ── Header scroll effect ──
    const header = document.querySelector(".site-header") as HTMLElement | null;
    const handleScroll = () => {
      if (!header) return;
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // ── Intersection Observer for reveal animations ──
    const revealElements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    revealElements.forEach((el) => observer.observe(el));

    // ── Page loader dismiss ──
    const loader = document.querySelector(".page-loader") as HTMLElement | null;
    if (loader) {
      setTimeout(() => loader.classList.add("loaded"), 800);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return null;
}
