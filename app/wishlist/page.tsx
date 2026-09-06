"use client";

import Link from "next/link";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { removeFromWishlist } from "@/app/store/slices/wishlistSlice";
import { addToCart } from "@/app/store/slices/cartSlice";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useEffect, useState } from "react";
import { products } from "@/app/data/products";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f2]">
      <Header variant="solid" />

      <main className="flex-1 py-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-12 border-b border-[#1a1a1a]/10 pb-6">
          <h1 className="font-display text-4xl md:text-5xl font-medium text-[#1a1a1a]">Your Wishlist</h1>
          <span className="text-[#8a8a8a]">{wishlistItems.length} items</span>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#8a8a8a] mb-6">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <h2 className="text-2xl font-display text-[#1a1a1a] mb-4">Your wishlist is empty</h2>
            <p className="text-[#5a5a5a] mb-8">Save items you love and buy them later.</p>
            <Link
              href="/shop"
              className="bg-[#1a1a1a] text-[#f8f6f2] px-8 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#b8976a] transition-colors"
            >
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {wishlistItems.map((item) => (
              <div key={item.id} className="group flex flex-col relative">
                {/* Remove button */}
                <button
                  onClick={() => dispatch(removeFromWishlist(item.id))}
                  className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/80 rounded-full hover:bg-white text-[#1a1a1a] hover:text-red-500 transition-all shadow-sm"
                  aria-label="Remove from wishlist"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>

                <div className="relative aspect-[3/4] w-full bg-[#eae7e1] overflow-hidden">
                  <Image
                    src={item.image || products.find(p => p.id === item.id)?.image || "/logo.png"}
                    alt={item.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                <div className="pt-4 flex flex-col gap-2">
                  <h3 className="font-body text-base font-semibold text-[#1a1a1a] leading-tight line-clamp-1">
                    <Link href={`/product/${item.id}`} className="hover:text-[#b8976a] transition-colors">
                      {item.name}
                    </Link>
                  </h3>
                  <p className="text-sm font-medium text-[#1a1a1a]">₹ {item.price.toLocaleString("en-IN")}</p>
                  
                  <button
                    onClick={() => {
                      const fullProduct = products.find(p => p.id === item.id);
                      if (fullProduct) {
                        dispatch(addToCart({ 
                          product: fullProduct, 
                          size: fullProduct.sizes?.[0]
                        }));
                        toast.success("Product added to cart");
                      } else {
                        toast.error("Product details not found");
                      }
                    }}
                    className="mt-3 w-full bg-white border border-[#1a1a1a] text-[#1a1a1a] py-2.5 text-xs font-semibold tracking-widest uppercase hover:bg-[#1a1a1a] hover:text-white transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
