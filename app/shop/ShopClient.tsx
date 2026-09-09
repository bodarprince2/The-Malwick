"use client";

import { useState, useMemo, useCallback, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import WishlistHeart from "../components/WishlistHeart";
import { Product } from "../data/products";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addToCart } from "../store/slices/cartSlice";
import toast from "react-hot-toast";
import CustomDropdown from "../components/CustomDropdown";


interface ShopClientProps {
  products: Product[];
}

export default function ShopClient({ products }: ShopClientProps) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  // O(1) cart lookup using a Set instead of .some() per card
  const cartProductIds = useMemo(
    () => new Set(cartItems.map(item => item.productId)),
    [cartItems]
  );

  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  const sortedProducts = useMemo(() => {
    let result = [...filteredProducts];
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      result.reverse();
    }
    return result;
  }, [filteredProducts, sortBy]);

  return (
    <main className="flex-1">
      {/* Compact Title & Filter Bar */}
      <div className="px-6 md:px-12 py-4 border-b border-[#1a1a1a]/10 bg-[#f8f6f2]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <h1 className="font-display text-xl font-medium text-[#1a1a1a]">
              {activeCategory === "All" ? "All Products" : activeCategory}
            </h1>
            <span className="text-xs text-[#8a8a8a]">{sortedProducts.length} items</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <CustomDropdown
              className="flex-1 sm:flex-none sm:w-[180px]"
              value={activeCategory}
              options={categories.map((cat) => ({ label: cat, value: cat }))}
              onChange={setActiveCategory}
            />
            <CustomDropdown
              className="flex-1 sm:flex-none sm:w-[180px]"
              value={sortBy}
              options={[
                { label: "Featured", value: "featured" },
                { label: "Price: Low - High", value: "price-low" },
                { label: "Price: High - Low", value: "price-high" },
                { label: "Newest", value: "newest" },
              ]}
              onChange={setSortBy}
            />
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="px-6 md:px-12 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              inCart={cartProductIds.has(product.id)}
              dispatch={dispatch}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

/** Memoized product card — prevents re-rendering all cards when one changes */
const ProductCard = memo(function ProductCard({
  product,
  inCart,
  dispatch,
}: {
  product: Product;
  inCart: boolean;
  dispatch: ReturnType<typeof useAppDispatch>;
}) {
  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({
      product,
      size: product.sizes?.[0]
    }));
    toast.success("Product added to cart");
  }, [dispatch, product]);

  return (
    <div className="group flex flex-col product-card-lazy" id={`product-${product.id}`}>
      {/* Product image card */}
      <Link href={`/product/${product.id}`} className="block relative aspect-[3/4] w-full bg-[#eae7e1] overflow-hidden cursor-pointer">
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
        <div className="absolute top-3 right-3 z-10" onClick={(e) => e.preventDefault()}>
          <WishlistHeart product={product} />
        </div>
        <Image
          src={product.image}
          alt={product.name}
          fill
          loading="lazy"
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </Link>

      {/* Product info */}
      <div className="pt-4 flex flex-col gap-1.5">
        <h3 className="font-body text-sm md:text-base font-semibold text-[#1a1a1a] leading-tight line-clamp-1 group-hover:text-[#b8976a] transition-colors">
          <Link href={`/product/${product.id}`} className="no-underline text-inherit">
            {product.name}
          </Link>
        </h3>

        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm md:text-base font-bold text-black">
            ₹ {product.price.toLocaleString("en-IN")}
          </p>
          {product.originalPrice && (
            <p className="text-xs md:text-sm text-[#8a8a8a] line-through">
              ₹ {product.originalPrice.toLocaleString("en-IN")}
            </p>
          )}
        </div>

        {inCart ? (
          <Link
            href="/cart"
            className="group relative overflow-hidden mt-3 w-full flex items-center justify-center py-3.5 text-xs font-semibold tracking-[0.1em] uppercase transition-colors duration-300 bg-[#b8976a] text-[#f8f6f2]"
          >
            <span className="inline-flex items-center gap-2 justify-center transition-transform duration-300 ease-out md:group-hover:-translate-x-3 motion-reduce:transition-none motion-reduce:transform-none">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Added
            </span>
            <span className="absolute right-4 opacity-0 transition-all duration-300 ease-out md:group-hover:opacity-100 md:group-hover:translate-x-0 translate-x-3 hidden md:block motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:transform-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </Link>
        ) : (
          <button
            onClick={handleAddToCart}
            className="group relative overflow-hidden mt-3 w-full flex items-center justify-center py-3.5 text-xs font-semibold tracking-[0.1em] uppercase transition-colors duration-300 bg-[#1a1a1a] text-[#f8f6f2] hover:bg-[#b8976a]"
          >
            <span className="inline-flex items-center justify-center transition-transform duration-300 ease-out md:group-hover:-translate-x-3 motion-reduce:transition-none motion-reduce:transform-none">
              Add to Cart
            </span>
            <span className="absolute right-4 opacity-0 transition-all duration-300 ease-out md:group-hover:opacity-100 md:group-hover:translate-x-0 translate-x-3 hidden md:block motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:transform-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </button>
        )}
      </div>
    </div>
  );
});
