import Link from "next/link";
import Navigation from "../components/Navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for The Melwick. Learn how we collect, use, and protect your data.",
  alternates: {
    canonical: "/privacy-policy",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f2]">
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
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-[#1a1a1a] mb-12">Privacy Policy</h1>
        
        <div className="space-y-8 text-lg leading-relaxed text-[#5a5a5a]">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#b8976a]">
            Last updated: January 1, 2026
          </p>
          <p>
            At The Melwick, accessible from themelwick.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by The Melwick and how we use it.
          </p>
          
          <h2 className="font-display text-2xl md:text-3xl font-medium text-[#1a1a1a] mt-16 mb-6">
            1. Information We Collect
          </h2>
          <p>
            When you sign up for our waitlist, we collect your email address in order to provide you with updates regarding our launch, exclusive drops, and early access.
          </p>

          <h2 className="font-display text-2xl md:text-3xl font-medium text-[#1a1a1a] mt-16 mb-6">
            2. How We Use Your Information
          </h2>
          <p>
            We use the information we collect in various ways, including to:
          </p>
          <ul className="list-disc pl-6 space-y-3">
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
            <li>Send you emails</li>
          </ul>

          <h2 className="font-display text-2xl md:text-3xl font-medium text-[#1a1a1a] mt-16 mb-6">
            3. Contact Us
          </h2>
          <p>
            If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at <a href="mailto:themelwick@gmail.com" className="text-[#1a1a1a] font-medium underline hover:text-[#b8976a] transition-colors">themelwick@gmail.com</a>.
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
