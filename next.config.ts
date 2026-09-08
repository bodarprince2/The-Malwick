import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compress responses with gzip/brotli
  compress: true,

  // Remove x-powered-by header (security + smaller response)
  poweredByHeader: false,

  // Aggressive caching headers for static assets + stale-while-revalidate for pages
  headers: async () => [
    {
      // Static assets: immutable 1-year cache (images, fonts, icons)
      source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      // JS/CSS bundles: immutable (hashed filenames)
      source: "/_next/static/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      // Pages: short cache + stale-while-revalidate for near-instant navigations
      source: "/:path*",
      headers: [
        { key: "Cache-Control", value: "public, s-maxage=60, stale-while-revalidate=300" },
      ],
    },
  ],

  images: {
    // Modern formats for smaller images
    formats: ["image/avif", "image/webp"],
    // Exact breakpoints matching the site's design
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // 90-day cache — product images change rarely
    minimumCacheTTL: 60 * 60 * 24 * 90,
    // Prevent over-compression of product photography
    qualities: [75, 85, 95],
  },

  // Keep false — strict mode double-fires effects, causing duplicate tracking
  reactStrictMode: false,
};

export default nextConfig;

