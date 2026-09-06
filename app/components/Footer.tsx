import Link from "next/link";
import { InstagramIcon, FacebookIcon, XTwitterIcon } from "./SocialIcons";

export default function Footer() {
  return (
    <footer className="bg-[#121212] text-[#f8f6f2] pt-24 pb-12 px-6 md:px-12 border-t border-[#f8f6f2]/10" id="site-footer">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col items-start max-w-sm lg:pr-8">
            <Link href="/" className="inline-block mb-6" aria-label="The Melwick — Home">
              <span className="font-display text-2xl tracking-[0.1em] uppercase text-[#f8f6f2]">
                The Melwick
              </span>
            </Link>
            <p className="text-[#f8f6f2]/60 text-sm leading-relaxed mb-8">
              Thoughtfully designed essentials for modern living. Redefining everyday style with premium craftsmanship.
            </p>
          </div>

          {/* Column 2: Shop */}
          <div className="flex flex-col items-start">
            <h3 className="font-body text-[10px] font-semibold tracking-[0.2em] uppercase text-[#f8f6f2]/40 mb-6">
              Shop
            </h3>
            <div className="flex flex-col gap-4 text-sm tracking-wide text-[#f8f6f2]/80">
              <Link href="/shop" className="hover:text-[#b8976a] transition-colors w-fit">All Products</Link>
              <Link href="/cart" className="hover:text-[#b8976a] transition-colors w-fit">Your Cart</Link>
              <Link href="/wishlist" className="hover:text-[#b8976a] transition-colors w-fit">Wishlist</Link>
            </div>
          </div>

          {/* Column 3: Information */}
          <div className="flex flex-col items-start">
            <h3 className="font-body text-[10px] font-semibold tracking-[0.2em] uppercase text-[#f8f6f2]/40 mb-6">
              Information
            </h3>
            <div className="flex flex-col gap-4 text-sm tracking-wide text-[#f8f6f2]/80">
              <Link href="/about" className="hover:text-[#b8976a] transition-colors w-fit">About Us</Link>
              <Link href="/contact" className="hover:text-[#b8976a] transition-colors w-fit">Contact</Link>
              <Link href="/privacy-policy" className="hover:text-[#b8976a] transition-colors w-fit">Privacy Policy</Link>
            </div>
          </div>

          {/* Column 4: Connect */}
          <div className="flex flex-col items-start">
            <h3 className="font-body text-[10px] font-semibold tracking-[0.2em] uppercase text-[#f8f6f2]/40 mb-6">
              Connect
            </h3>
            <div className="flex flex-col gap-4 text-sm tracking-wide text-[#f8f6f2]/80 mb-8">
              <a href="https://www.instagram.com/themelwick/" target="_blank" rel="noopener noreferrer" className="hover:text-[#b8976a] transition-colors w-fit">Instagram</a>
              <a href="https://www.facebook.com/themelwick/" target="_blank" rel="noopener noreferrer" className="hover:text-[#b8976a] transition-colors w-fit">Facebook</a>
              <Link href="/contact" className="hover:text-[#b8976a] transition-colors w-fit">Email Us</Link>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#f8f6f2]/10 gap-4">
          <p className="text-xs text-[#f8f6f2]/50 tracking-wide order-2 md:order-1">
            &copy; {new Date().getFullYear()} The Melwick. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-[#f8f6f2]/50 tracking-wide order-1 md:order-2">
            <Link href="/privacy-policy" className="hover:text-[#f8f6f2] transition-colors">Privacy Policy</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
