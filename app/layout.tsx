import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// JetBrains Mono: designed for code display, excellent x-height, supports
// ligatures — a precise, legible choice for the mono label and cursor elements.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Dylan Tombs",
    template: "%s | Dylan Tombs",
  },
  description:
    "CS & Maths student at the University of Bath. Building toward FAANG/Palantir. Systems, algorithms, and engineering at scale.",
  keywords: ["Dylan Tombs", "software engineer", "University of Bath", "CS", "mathematics"],
  authors: [{ name: "Dylan Tombs" }],
  creator: "Dylan Tombs",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Dylan Tombs",
    title: "Dylan Tombs",
    description:
      "CS & Maths student at the University of Bath. Building toward FAANG/Palantir. Systems, algorithms, and engineering at scale.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dylan Tombs",
    description:
      "CS & Maths student at the University of Bath. Building toward FAANG/Palantir. Systems, algorithms, and engineering at scale.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#080B0F",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
