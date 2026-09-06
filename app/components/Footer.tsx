import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-[#f8f6f2] py-16 px-6 md:px-12 border-t border-[#f8f6f2]/10" id="site-footer">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-8">
        <div className="flex flex-wrap justify-center gap-8 text-sm font-medium tracking-widest uppercase text-[#f8f6f2]/70">
          <Link href="/shop" className="hover:text-[#b8976a] transition-colors" prefetch={true}>Shop</Link>
          <Link href="/about" className="hover:text-[#b8976a] transition-colors" prefetch={true}>About</Link>
          <Link href="/contact" className="hover:text-[#b8976a] transition-colors" prefetch={true}>Contact</Link>
          <Link href="/privacy-policy" className="hover:text-[#b8976a] transition-colors" prefetch={true}>Privacy</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#f8f6f2]/10 flex justify-center text-center">
        <p className="text-xs text-[#f8f6f2]/50 tracking-wide">
          &copy; 2026 The Melwick. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
