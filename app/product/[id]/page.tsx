"use client";

import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/app/data/products";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { addToCart } from "@/app/store/slices/cartSlice";
import toast from "react-hot-toast";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import WishlistHeart from "@/app/components/WishlistHeart";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return notFound();
  }

  const dispatch = useAppDispatch();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]);
  const [quantity, setQuantity] = useState(1);

  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItemId = `${product.id}${selectedSize ? `-${selectedSize}` : ''}${selectedColor ? `-${selectedColor}` : ''}`;
  const inCart = cartItems.some(item => item.id === cartItemId);

  const handleAddToCart = () => {
    if (inCart) {
      toast.error("Product is already in the cart");
      return;
    }
    dispatch(addToCart({
      product,
      size: selectedSize,
      color: selectedColor,
      quantity
    }));
    toast.success("Product added to cart");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f2]">
      <Header variant="solid" />

      <main className="flex-1 py-12 md:py-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#8a8a8a] mb-8">
          <Link href="/" className="hover:text-[#1a1a1a] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#1a1a1a] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[#1a1a1a]">{product.name}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
          {/* Image Gallery */}
          <div className="w-full md:w-1/2 relative">
            <div className="relative aspect-[3/4] w-full bg-[#eae7e1] overflow-hidden">
              {product.badge && (
                <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-[#1a1a1a] text-[#f8f6f2] text-xs font-bold tracking-widest uppercase">
                  {product.badge}
                </div>
              )}
              {product.originalPrice && (
                <div className={`absolute ${product.badge ? 'top-14' : 'top-4'} left-4 z-10 px-3 py-1.5 bg-[#c0392b] text-white text-xs font-bold tracking-wider uppercase`}>
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </div>
              )}
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2 flex flex-col pt-4 md:pt-10">
            <div className="flex items-start justify-between gap-6 mb-4">
              <h1 className="font-display text-4xl md:text-5xl font-medium text-[#1a1a1a] leading-tight">
                {product.name}
              </h1>
              <div className="pt-2">
                <WishlistHeart product={product} />
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-medium text-[#1a1a1a]">₹ {product.price.toLocaleString("en-IN")}</span>
                {product.originalPrice && (
                  <span className="text-lg text-[#8a8a8a] line-through">
                    ₹ {product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#8a8a8a] uppercase tracking-wider mt-2">MRP incl. of all taxes</p>
            </div>

            <p className="text-lg text-[#5a5a5a] mb-10 leading-relaxed border-b border-[#1a1a1a]/10 pb-8">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold tracking-widest uppercase text-[#1a1a1a]">Color</span>
                </div>
                <div className="flex gap-4">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color ? "border-[#1a1a1a] scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select ${color} color`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold tracking-widest uppercase text-[#1a1a1a]">Size</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-12 flex items-center justify-center border transition-all ${
                        selectedSize === size
                          ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                          : "bg-transparent text-[#1a1a1a] border-[#1a1a1a]/20 hover:border-[#1a1a1a]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 mt-auto">
              <div className="flex items-center border border-[#1a1a1a]/20 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-14 flex items-center justify-center text-[#1a1a1a] hover:bg-[#1a1a1a]/5 transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-14 flex items-center justify-center text-[#1a1a1a] hover:bg-[#1a1a1a]/5 transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={inCart}
                className={`flex-1 flex items-center justify-center gap-2 text-sm font-semibold tracking-widest uppercase transition-colors ${
                  inCart 
                    ? "bg-[#b8976a] text-[#f8f6f2] cursor-not-allowed opacity-80" 
                    : "bg-[#1a1a1a] text-[#f8f6f2] hover:bg-[#b8976a]"
                }`}
              >
                {inCart && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                )}
                {inCart ? "Already in Cart" : "Add to Cart"}
              </button>
            </div>
            
            <div className="mt-8 text-xs text-[#8a8a8a] space-y-2">
              <p>✓ Free shipping on orders over ₹5,000</p>
              <p>✓ 30-day hassle-free returns</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
