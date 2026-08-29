import Image from "next/image";

export default function FeaturedProduct() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-white relative overflow-hidden border-t border-[#1a1a1a]/5" id="featured-product">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24 reveal">
        {/* Image Side */}
        <div className="w-full lg:w-1/2 relative">
          <div className="relative aspect-[4/5] w-full bg-[#f8f6f2] rounded-sm overflow-hidden group shadow-sm">
            <Image
              src="/tee-black-front.png"
              alt="The Signature Heavyweight Tee in Black"
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Subtle floating badge */}
            <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded border border-[#1a1a1a]/5 shadow-sm">
              <span className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-[#1a1a1a]">Signature Fit</span>
            </div>
          </div>
        </div>

        {/* Content Side */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-[#b8976a]" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#b8976a]">The Essential</span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] text-[#1a1a1a] mb-6">
            Heavyweight <br /> Drop-Shoulder Tee
          </h2>
          
          <p className="text-lg leading-relaxed text-[#5a5a5a] mb-8 max-w-lg">
            Redefining the everyday staple. Crafted from custom-milled 280GSM organic cotton, this piece offers an impeccable structured drape with a buttery soft handfeel. Designed with a relaxed drop-shoulder silhouette and a tightened ribbed collar for a refined, modern aesthetic.
          </p>

          <ul className="flex flex-col gap-4 mb-10 w-full max-w-md">
            {[
              "100% Organic Heavyweight Cotton (280GSM)",
              "Relaxed drop-shoulder fit for effortless layering",
              "Pre-shrunk to maintain shape wear after wear",
              "Subtle tonal embroidered logo at the hem"
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-3" style={{ transitionDelay: `${i * 100}ms` }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5 text-[#b8976a]" aria-hidden="true">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-sm text-[#1a1a1a]">{feature}</span>
              </li>
            ))}
          </ul>

          <a href="#signup-section" className="inline-flex items-center justify-center gap-3 bg-[#1a1a1a] text-[#f8f6f2] px-8 py-4 text-sm font-semibold tracking-widest uppercase rounded shadow hover:bg-[#2d2d2d] hover:shadow-lg transition-all border border-[#1a1a1a] min-h-[44px]">
            <span>Explore Details</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
