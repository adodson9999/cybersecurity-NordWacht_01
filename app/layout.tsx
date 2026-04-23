import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Zander Services | AI Implementation Agency - Houston TX",
  description:
    "Stop wasting human capital. Zander Services delivers AI-powered automation solutions for Houston businesses. Book a call today to transform your operations.",
  keywords: [
    "AI automation",
    "Houston AI agency",
    "business automation",
    "AI implementation",
    "workflow automation",
    "Houston TX",
  ],
  authors: [{ name: "Zander Services" }],
  openGraph: {
    title: "Zander Services | AI Implementation Agency - Houston TX",
    description:
      "Stop wasting human capital. AI-powered automation solutions for Houston businesses.",
    url: "https://zanderservices.com",
    siteName: "Zander Services",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zander Services | AI Implementation Agency",
    description: "Stop wasting human capital. AI-powered automation for Houston businesses.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0F0F0F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} bg-background`}>
      <head>
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        {/* Preconnect for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
