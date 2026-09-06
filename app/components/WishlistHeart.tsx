"use client";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleWishlist } from "../store/slices/wishlistSlice";
import { Product } from "../data/products";

export default function WishlistHeart({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isLiked = wishlistItems.some((item) => item.id === product.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(toggleWishlist(product));
      }}
      className={`shrink-0 mt-0.5 transition-colors duration-300 ${
        isLiked ? "text-red-500" : "text-[#8a8a8a] hover:text-[#b8976a]"
      }`}
      aria-label={isLiked ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={isLiked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-transform duration-300 ${isLiked ? "scale-110" : "scale-100"}`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
