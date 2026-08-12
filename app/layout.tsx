import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
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
  title: "The Melwick | Premium Clothing Brand — Coming Soon",
  description:
    "The Melwick is launching soon — a premium clothing brand redefining modern style. Sign up now to get early access, exclusive drops, and launch-day offers.",
  keywords:
    "clothing brand, The Melwick, streetwear, premium apparel, fashion launch, new clothing brand 2026",
  openGraph: {
    title: "The Melwick | Premium Clothing Brand — Coming Soon",
    description:
      "The Melwick is launching soon — a premium clothing brand redefining modern style. Sign up now to get early access, exclusive drops, and launch-day offers.",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "The Melwick Logo" }],
    type: "website",
    siteName: "The Melwick",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Melwick | Premium Clothing Brand — Coming Soon",
    description:
      "The Melwick is launching soon — a premium clothing brand redefining modern style.",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
