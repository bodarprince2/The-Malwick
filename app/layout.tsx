import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import ActivityTracker from "./components/ActivityTracker";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://themelwick.com"),
  title: {
    default: "The Melwick | Premium Streetwear & Modern Heritage Apparel",
    template: "%s | The Melwick"
  },
  description:
    "The Melwick is a premium clothing brand redefining everyday style. Discover our modern heritage apparel and luxury streetwear. Sign up for early access.",
  keywords: [
    "The Melwick",
    "Melwick",
    "Malwick",
    "The Malwick",
    "Mel",
    "Male",
    "luxury streetwear brands",
    "premium streetwear essentials",
    "modern heritage apparel",
    "high-end streetwear clothing",
    "timeless streetwear",
    "minimalist streetwear",
    "elevated basics",
    "heritage-inspired urban wear",
    "exclusive clothing brand launch",
    "heavyweight hoodies",
    "oversized graphic tees",
    "quality craftsmanship clothing"
  ],
  authors: [{ name: "The Melwick" }],
  creator: "The Melwick",
  publisher: "The Melwick",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "The Melwick | Premium Streetwear & Modern Heritage Apparel",
    description:
      "The Melwick is a premium clothing brand redefining everyday style. Discover our modern heritage apparel and luxury streetwear. Sign up for early access.",
    url: "https://themelwick.com",
    siteName: "The Melwick",
    images: [
      {
        url: "/the-melwick-logo.png",
        width: 1200,
        height: 630,
        alt: "The Melwick - Premium Streetwear Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Melwick | Premium Streetwear & Modern Heritage Apparel",
    description:
      "The Melwick is a premium clothing brand redefining everyday style. Discover our modern heritage apparel and luxury streetwear.",
    images: ["/the-melwick-logo.png"],
    creator: "@themelwick",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/the-melwick-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <ActivityTracker />
        {children}
      </body>
    </html>
  );
}
