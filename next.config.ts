import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compress responses with gzip/brotli
  compress: true,

  // Remove x-powered-by header (security + smaller response)
  poweredByHeader: false,

  // Aggressive caching headers for static assets
  headers: async () => [
    {
      source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
  ],

  images: {
    // Modern formats for smaller images
    formats: ["image/avif", "image/webp"],
    // Exact breakpoints matching the site's design
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // Minimize quality without visible loss
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Enable React strict mode for catching issues
  reactStrictMode: false, // Keep false — strict mode double-fires effects, causing duplicate tracking
};

export default nextConfig;
