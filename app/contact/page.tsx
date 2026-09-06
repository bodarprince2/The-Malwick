import Image from "next/image";
import Link from "next/link";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with The Melwick. We are here to answer your questions about our premium streetwear and upcoming launches.",
  alternates: {
    canonical: "/contact",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
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
          "name": "Contact Us",
          "item": "https://themelwick.com/contact"
        }
      ]
    },
    {
      "@type": "Organization",
      "@id": "https://themelwick.com/#organization",
      "name": "The Melwick",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "themelwick@gmail.com",
        "contactType": "customer support"
      }
    }
  ]
};

export default function Contact() {
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
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-[#1a1a1a] mb-12">Contact Us</h1>
        
        <div className="space-y-8 text-lg leading-relaxed text-[#5a5a5a]">
          <p>
            Have a question about our upcoming launch, sizing, or press inquiries? 
            We&apos;d love to hear from you.
          </p>
          
          <h2 className="font-display text-2xl md:text-3xl font-medium text-[#1a1a1a] mt-16 mb-6">
            Customer Support
          </h2>
          <p>
            Email us directly at:<br />
            <a href="mailto:themelwick@gmail.com" className="text-[#1a1a1a] font-medium underline hover:text-[#b8976a] transition-colors">themelwick@gmail.com</a>
          </p>

          <h2 className="font-display text-2xl md:text-3xl font-medium text-[#1a1a1a] mt-16 mb-6">
            Social Media
          </h2>
          <p>
            Connect with us on our social platforms for the latest updates on our premium streetwear collections.
          </p>
          <ul className="space-y-4 text-[#1a1a1a] font-medium mt-6">
            <li><a href="https://www.instagram.com/themelwick/" target="_blank" rel="noopener noreferrer" className="hover:text-[#b8976a] transition-colors underline">Instagram</a></li>
            <li><a href="https://www.facebook.com/themelwick/" target="_blank" rel="noopener noreferrer" className="hover:text-[#b8976a] transition-colors underline">Facebook</a></li>
            <li><a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#b8976a] transition-colors underline">X (Twitter)</a></li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
