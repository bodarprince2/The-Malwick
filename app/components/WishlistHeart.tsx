"use client";

import { useState } from "react";

export default function WishlistHeart({ name }: { name: string }) {
  const [liked, setLiked] = useState(false);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setLiked((prev) => !prev);
      }}
      className={`shrink-0 mt-0.5 transition-colors duration-300 ${
        liked ? "text-red-500" : "text-[#8a8a8a] hover:text-[#b8976a]"
      }`}
      aria-label={liked ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-transform duration-300 ${liked ? "scale-110" : "scale-100"}`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
