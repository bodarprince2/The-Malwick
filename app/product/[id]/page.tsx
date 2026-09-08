"use client";

import { useState, use, useRef, useEffect, useCallback, useMemo, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProductImages } from "@/app/data/products";
import type { Product } from "@/app/data/products";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { addToCart } from "@/app/store/slices/cartSlice";
import toast from "react-hot-toast";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import WishlistHeart from "@/app/components/WishlistHeart";

// Memoized Accordion — won't re-render when parent state (size, qty) changes
const Accordion = memo(function Accordion({ title, content }: { title: string; content: string }) {
  return (
    <details className="group border-b border-[#1a1a1a]/10 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-center justify-between py-5 text-sm font-semibold tracking-widest uppercase text-[#1a1a1a]">
        {title}
        <span className="ml-6 flex-shrink-0 transition duration-300 group-open:-rotate-180">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </span>
      </summary>
      <div className="pb-6 text-sm text-[#5a5a5a] leading-relaxed pr-4">
        {content}
      </div>
    </details>
  );
});

// Cached outside render — no re-allocation on each call
const VIEW_LABELS: Record<string, string> = {
  front: "Front",
  back: "Back",
  left: "Left",
  right: "Right",
  "three-quarter-front": "¾ Front",
  "three-quarter-back": "¾ Back",
};

/** Derive a human-readable view label from the image filename */
function getViewLabel(src: string, index: number): string {
  const name = src.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "";
  return VIEW_LABELS[name] ?? `View ${index + 1}`;
}

/** Memoized horizontal scroll gallery — won't re-render on size/qty changes */
const ProductGallery = memo(function ProductGallery({ images, productName, badge, originalPrice, price }: {
  images: string[];
  productName: string;
  badge?: string;
  originalPrice?: number;
  price: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const rafRef = useRef<number | null>(null);

  // Memoize discount percentage to avoid recalculating during scrolls
  const discountPct = useMemo(() => {
    if (!originalPrice) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }, [originalPrice, price]);

  // Debounced scroll handler using rAF — prevents layout thrashing
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || images.length <= 1) return;

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const itemWidth = el.scrollWidth / images.length;
        const newIndex = Math.round(el.scrollLeft / itemWidth);
        setActiveIndex(Math.max(0, Math.min(newIndex, images.length - 1)));
      });
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [images.length]);

  const scrollToIndex = useCallback((idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const itemWidth = el.scrollWidth / images.length;
    el.scrollTo({ left: itemWidth * idx, behavior: "smooth" });
  }, [images.length]);

  return (
    <div className="w-full">
      {/* Scroll container — CSS class handles GPU compositing + scrollbar hiding */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto hide-scrollbar gallery-scroll"
        style={{
          cursor: images.length > 1 ? "grab" : "default",
        }}
        id="product-gallery-scroll"
      >
        {images.map((src, idx) => (
          <div
            key={src}
            className="relative flex-none bg-[#eae7e1] overflow-hidden"
            style={{
              scrollSnapAlign: "start",
              width: images.length === 1 ? "100%" : "calc(80vw - 3rem)",
              maxWidth: images.length === 1 ? "100%" : "460px",
              aspectRatio: "4/5",
            }}
          >
            {/* Badges on first image only */}
            {idx === 0 && badge && (
              <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-[#1a1a1a] text-[#f8f6f2] text-xs font-bold tracking-widest uppercase">
                {badge}
              </div>
            )}
            {idx === 0 && originalPrice && (
              <div className={`absolute ${badge ? 'top-14' : 'top-4'} left-4 z-10 px-3 py-1.5 bg-[#c0392b] text-white text-xs font-bold tracking-wider uppercase`}>
                {discountPct}% OFF
              </div>
            )}

            <Image
              src={src}
              alt={`${productName} — ${getViewLabel(src, idx)}`}
              fill
              className="object-cover object-center"
              priority={idx === 0}
              loading={idx === 0 ? "eager" : "lazy"}
              sizes="(max-width: 1024px) 80vw, 460px"
            />

            {/* View label chip */}
            {images.length > 1 && (
              <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-[#1a1a1a]/60 backdrop-blur-sm text-[#f8f6f2] text-[10px] font-semibold tracking-widest uppercase rounded-sm">
                {getViewLabel(src, idx)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dot indicators (only when multi-image) */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4" role="tablist" aria-label="Product view selector">
          {images.map((_, idx) => (
            <button
              key={idx}
              role="tab"
              aria-selected={activeIndex === idx}
              aria-label={`View ${idx + 1}`}
              onClick={() => scrollToIndex(idx)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: activeIndex === idx ? "20px" : "6px",
                height: "6px",
                backgroundColor: activeIndex === idx ? "#1a1a1a" : "#1a1a1a40",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
});

/** Memoized related product card — avoids re-rendering all 4 when one hovers */
const RelatedProductCard = memo(function RelatedProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] w-full bg-[#eae7e1] overflow-hidden mb-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          loading="lazy"
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <h3 className="text-sm font-semibold text-[#1a1a1a] mb-1 group-hover:text-[#b8976a] transition-colors">{product.name}</h3>
      <p className="text-sm text-[#8a8a8a]">₹ {product.price.toLocaleString("en-IN")}</p>
    </Link>
  );
});

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return notFound();
  }

  const dispatch = useAppDispatch();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]);
  const [quantity, setQuantity] = useState(1);

  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItemId = `${product.id}${selectedSize ? `-${selectedSize}` : ''}`;
  const inCart = cartItems.some(item => item.id === cartItemId);

  const handleAddToCart = () => {
    if (inCart) {
      toast.error("Product is already in the cart");
      return;
    }
    dispatch(addToCart({
      product,
      size: selectedSize,
      quantity
    }));
    toast.success("Product added to cart");
  };

  // Memoize product images — no recalc when size/qty state changes
  const productImages = useMemo(() => getProductImages(product), [product]);

  // Memoize related products — stable reference across re-renders
  const relatedProducts = useMemo(
    () => products.filter(p => p.id !== product.id).slice(0, 4),
    [product.id]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f2] selection:bg-[#b8976a] selection:text-white">
      <Header variant="solid" />

      <main className="flex-1 w-full">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-8 md:pt-12 pb-24">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] md:text-xs font-semibold tracking-widest uppercase text-[#8a8a8a] mb-8 md:mb-16">
            <Link href="/" className="hover:text-[#1a1a1a] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#1a1a1a] transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-[#1a1a1a]">{product.name}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">

            {/* LEFT: Product Image Gallery */}
            <div className="w-full lg:w-[55%] relative">
              <ProductGallery
                images={productImages}
                productName={product.name}
                badge={product.badge}
                originalPrice={product.originalPrice}
                price={product.price}
              />
            </div>

            {/* RIGHT: Product Information */}
            <div className="w-full lg:w-[45%] flex flex-col pt-4 lg:pt-10 lg:sticky lg:top-24">

              <div className="flex justify-between items-start mb-2">
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#8a8a8a]">
                  {product.category}
                </div>
                <div className="pt-1">
                  <WishlistHeart product={product} />
                </div>
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-[#1a1a1a] leading-[1.1] mb-6">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-8">
                <span className="text-xl md:text-2xl font-medium text-[#1a1a1a]">₹ {product.price.toLocaleString("en-IN")}</span>
                {product.originalPrice && (
                  <span className="text-sm md:text-base text-[#8a8a8a] line-through">
                    ₹ {product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              <p className="text-base text-[#5a5a5a] leading-relaxed mb-12 border-b border-[#1a1a1a]/10 pb-12">
                {product.description}
              </p>

              {/* Purchase Area */}
              <div className="mb-16">
                {/* Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold tracking-widest uppercase text-[#1a1a1a]">Size</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[3rem] px-4 h-12 flex items-center justify-center border text-xs tracking-wider transition-all ${selectedSize === size
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

                {/* Quantity & Add to Cart */}
                <div className="flex flex-row gap-3 sm:gap-4">
                  <div className="flex items-center border border-[#1a1a1a]/20 bg-transparent h-14 w-[110px] sm:w-[128px] shrink-0">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 sm:w-12 h-full flex items-center justify-center text-[#1a1a1a] hover:bg-[#1a1a1a]/5 transition-colors"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center text-sm font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 sm:w-12 h-full flex items-center justify-center text-[#1a1a1a] hover:bg-[#1a1a1a]/5 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {inCart ? (
                    <Link
                      href="/cart"
                      className="group relative overflow-hidden flex-1 h-14 flex items-center justify-center bg-[#b8976a] text-[#f8f6f2] text-xs font-semibold tracking-widest uppercase transition-colors duration-300"
                    >
                      <span className="inline-flex items-center justify-center transition-transform duration-300 ease-out md:group-hover:-translate-x-3 motion-reduce:transition-none motion-reduce:transform-none">
                        View Cart
                      </span>
                      <span className="absolute right-4 md:right-6 opacity-0 transition-all duration-300 ease-out md:group-hover:opacity-100 md:group-hover:translate-x-0 translate-x-3 hidden md:block motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:transform-none">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </span>
                    </Link>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      className="group relative overflow-hidden flex-1 h-14 flex items-center justify-center bg-[#1a1a1a] text-[#f8f6f2] hover:bg-[#b8976a] text-xs font-semibold tracking-widest uppercase transition-colors duration-300"
                    >
                      <span className="inline-flex items-center justify-center transition-transform duration-300 ease-out md:group-hover:-translate-x-3 motion-reduce:transition-none motion-reduce:transform-none">
                        Add to Cart
                      </span>
                      <span className="absolute right-4 md:right-6 opacity-0 transition-all duration-300 ease-out md:group-hover:opacity-100 md:group-hover:translate-x-0 translate-x-3 hidden md:block motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:transform-none">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* MADE IN INDIA Block */}
              <div className="py-8 border-y border-[#1a1a1a]/10 mb-12">
                <div className="flex items-start gap-4">
                  <div className="pt-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-[#1a1a1a]">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold tracking-widest uppercase text-[#1a1a1a] mb-1">Made in India</h4>
                    <p className="text-sm text-[#5a5a5a] mb-3">Manufactured in Surat, Gujarat, India.</p>
                    <div className="flex gap-6 text-[10px] font-semibold tracking-widest uppercase text-[#8a8a8a]">
                      <div>Brand: <span className="text-[#1a1a1a]">The Melwick</span></div>
                      <div>Origin: <span className="text-[#1a1a1a]">India</span></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* WHY YOU'LL LOVE IT */}
        {product.keyStrengths && product.keyStrengths.length > 0 && (
          <div className="bg-[#1a1a1a] text-[#f8f6f2] py-24 px-6 md:px-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-medium mb-16">Why You'll Love It</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 text-left">
                {product.keyStrengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#b8976a] shrink-0" />
                    <span className="text-base md:text-lg font-light tracking-wide">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* THE STORY */}
        {product.story && (
          <div className="py-24 px-6 md:px-12 bg-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-[#8a8a8a] mb-6">The Story</h2>
              <p className="font-display text-2xl md:text-3xl lg:text-4xl leading-relaxed text-[#1a1a1a]">
                "{product.story}"
              </p>
            </div>
          </div>
        )}

        {/* PRODUCT DETAILS ACCORDIONS */}
        <div className="max-w-3xl mx-auto px-6 md:px-12 pb-32">
          <div className="border-t border-[#1a1a1a]/10">
            {product.description && <Accordion title="Description" content={product.description} />}
            {product.material && <Accordion title="Material & Fabric" content={product.material} />}
            {product.fitAndSizing && <Accordion title="Fit & Sizing" content={product.fitAndSizing} />}
            {product.care && <Accordion title="Care" content={product.care} />}
            {product.shippingAndReturns && <Accordion title="Shipping & Returns" content={product.shippingAndReturns} />}
          </div>
        </div>

        {/* YOU MAY ALSO LIKE */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-[#1a1a1a]/10 py-24 px-6 md:px-12">
            <div className="max-w-[1440px] mx-auto">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-[#8a8a8a] mb-12 text-center">You May Also Like</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12">
                {relatedProducts.map(rp => (
                  <RelatedProductCard key={rp.id} product={rp} />
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
