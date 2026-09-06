"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import WishlistHeart from "../components/WishlistHeart";
import { Product } from "../data/products";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addToCart } from "../store/slices/cartSlice";
import toast from "react-hot-toast";

interface ShopClientProps {
  products: Product[];
}

export default function ShopClient({ products }: ShopClientProps) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const isProductInCart = (productId: string) => cartItems.some(item => item.productId === productId);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <main className="flex-1">
      {/* Page title bar */}
      <div className="px-6 md:px-12 py-8 border-b border-[#1a1a1a]/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="font-display text-2xl md:text-3xl font-medium text-[#1a1a1a]">
            {activeCategory === "All" ? "All Products" : activeCategory}
          </h1>
          <span className="text-sm text-[#8a8a8a]">{filteredProducts.length} items</span>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="px-6 md:px-12 py-5 border-b border-[#1a1a1a]/5 overflow-x-auto hide-scrollbar">
        <div className="max-w-7xl mx-auto flex gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-5 py-2.5 rounded-full text-xs font-semibold tracking-[0.1em] uppercase transition-all duration-300 border ${activeCategory === cat
                  ? "bg-[#1a1a1a] text-[#f8f6f2] border-[#1a1a1a]"
                  : "bg-transparent text-[#1a1a1a] border-[#1a1a1a]/20 hover:border-[#1a1a1a]/50 hover:bg-[#1a1a1a]/5"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="px-6 md:px-12 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group flex flex-col" id={`product-${product.id}`}>
              {/* Product image card */}
              <div className="relative aspect-[3/4] w-full bg-[#eae7e1] overflow-hidden cursor-pointer">
                {product.badge && (
                  <div className="absolute top-3 left-3 z-10 px-2 py-1 bg-[#1a1a1a] text-[#f8f6f2] text-[10px] font-bold tracking-widest uppercase">
                    {product.badge}
                  </div>
                )}
                {product.originalPrice && (
                  <div className={`absolute ${product.badge ? 'top-10' : 'top-3'} left-3 z-10 px-2 py-1 bg-[#c0392b] text-white text-[10px] font-bold tracking-wider uppercase`}>
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </div>
                )}
                {/* Wishlist heart */}
                <div className="absolute top-3 right-3 z-10">
                  <WishlistHeart product={product} />
                </div>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

              </div>

              {/* Product info */}
              <div className="pt-4 flex flex-col gap-1.5">
                <h3 className="font-body text-sm md:text-base font-semibold text-[#1a1a1a] leading-tight line-clamp-1 group-hover:text-[#b8976a] transition-colors">
                  <Link href={`/#product-${product.id}`} className="no-underline text-inherit">
                    {product.name}
                  </Link>
                </h3>

                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm md:text-base font-medium text-[#1a1a1a]">
                    ₹ {product.price.toLocaleString("en-IN")}
                  </p>
                  {product.originalPrice && (
                    <p className="text-xs md:text-sm text-[#8a8a8a] line-through">
                      ₹ {product.originalPrice.toLocaleString("en-IN")}
                    </p>
                  )}
                </div>

                <button
                  disabled={isProductInCart(product.id)}
                  className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold tracking-[0.1em] uppercase transition-all duration-300 ${
                    isProductInCart(product.id)
                      ? "bg-[#b8976a] text-[#f8f6f2] cursor-not-allowed opacity-80"
                      : "bg-[#1a1a1a] text-[#f8f6f2] hover:bg-[#b8976a] active:scale-[0.97]"
                  }`}
                  onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    if (isProductInCart(product.id)) {
                      toast.error("Product is already in the cart");
                      return;
                    }
                    dispatch(addToCart({ 
                      product, 
                      size: product.sizes?.[0], 
                      color: product.colors?.[0] 
                    }));
                    toast.success("Product added to cart");
                  }}
                >
                  {isProductInCart(product.id) ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                      Already in Cart
                    </>
                  ) : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
