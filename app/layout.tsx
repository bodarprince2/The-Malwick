import type { Metadata } from "next";
import Script from "next/script";
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
  manifest: "/site.webmanifest",
  openGraph: {
    title: "The Melwick | Premium Streetwear & Modern Heritage Apparel",
    description:
      "The Melwick is a premium clothing brand redefining everyday style. Discover our modern heritage apparel and luxury streetwear. Sign up for early access.",
    url: "https://themelwick.com",
    siteName: "The Melwick",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 742,
        height: 495,
        alt: "The Melwick Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Melwick | Premium Streetwear & Modern Heritage Apparel",
    description:
      "The Melwick is a premium clothing brand redefining everyday style. Discover our modern heritage apparel and luxury streetwear.",
    creator: "@themelwick",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://themelwick.com/#organization",
    "name": "The Melwick",
    "alternateName": ["Melwick", "Malwick", "The Malwick", "Mel", "Male"],
    "url": "https://themelwick.com",
    "logo": "https://themelwick.com/logo.png",
    "sameAs": [
      "https://www.instagram.com/themelwick/",
      "https://www.facebook.com/themelwick/",
      "https://x.com"
    ]
  };

  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ETQ9RC1J8T"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ETQ9RC1J8T');
          `}
        </Script>

        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ActivityTracker />
        {children}
      </body>
    </html>
  );
}
