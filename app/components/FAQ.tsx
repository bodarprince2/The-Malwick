"use client";

import { useState } from "react";

const faqs = [
  {
    question: "When does The Melwick officially launch?",
    answer:
      "We're launching on 1st December 2026. Sign up for early access to be the first to shop our debut collection and receive exclusive launch-day offers.",
  },
  {
    question: "What kind of clothing does The Melwick offer?",
    answer:
      "The Melwick specializes in premium streetwear and modern heritage apparel — think heavyweight oversized tees, drop-shoulder silhouettes, and elevated basics crafted from the finest organic cotton.",
  },
  {
    question: "What materials do you use?",
    answer:
      "We use custom-milled 280GSM organic cotton for our signature tees. Every piece is pre-shrunk, responsibly sourced, and designed to maintain its shape and softness wash after wash.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes! At launch we will ship across India and select international destinations. Join the waitlist to receive shipping updates and region-specific launch details.",
  },
  {
    question: "How can I stay updated before launch?",
    answer:
      "Enter your email in our waitlist signup section to receive early access, exclusive drops, and launch-day discounts. You can also follow us on Instagram and Facebook for behind-the-scenes content.",
  },
  {
    question: "What is your return & exchange policy?",
    answer:
      "We want you to love every piece. Full return and exchange details will be available at launch, but we're committed to a hassle-free process — no questions asked within 15 days of delivery.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className="py-24 md:py-32 px-6 md:px-12 bg-[#f8f6f2] border-t border-[#1a1a1a]/5"
      id="faq-section"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-3xl mx-auto reveal">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#b8976a] mb-4">
            Got Questions?
          </p>
          <h2
            id="faq-heading"
            className="font-display text-4xl md:text-5xl font-medium text-[#1a1a1a] mb-4"
          >
            Frequently Asked Questions
          </h2>
          <div className="w-12 h-[1px] bg-[#b8976a] mx-auto" aria-hidden="true" />
        </div>

        {/* FAQ items */}
        <div className="flex flex-col">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border-b border-[#1a1a1a]/10"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between gap-4 py-6 text-left focus:outline-none group"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                >
                  <span className="font-display text-lg md:text-xl font-medium text-[#1a1a1a] group-hover:text-[#b8976a] transition-colors">
                    {faq.question}
                  </span>
                  <span
                    className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-[#1a1a1a]/10 transition-all duration-300 ${
                      isOpen ? "bg-[#1a1a1a] border-[#1a1a1a]" : "bg-transparent"
                    }`}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      className={`transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        d="M3 5.5L7 9.5L11 5.5"
                        stroke={isOpen ? "#f8f6f2" : "#1a1a1a"}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  className={`overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen ? "max-h-60 opacity-100 pb-6" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-[#5a5a5a] text-base leading-relaxed pr-12">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
