import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NordWacht | AI Implementation Agency - Houston TX",
  description:
    "Stop wasting human capital. NordWacht delivers AI-powered automation solutions for Houston businesses. Get your free $2,500 AI Efficiency Audit today.",
  keywords: [
    "AI automation",
    "Houston AI agency",
    "business automation",
    "AI implementation",
    "workflow automation",
    "Houston TX",
  ],
  authors: [{ name: "NordWacht" }],
  openGraph: {
    title: "NordWacht | AI Implementation Agency - Houston TX",
    description:
      "Stop wasting human capital. AI-powered automation solutions for Houston businesses.",
    url: "https://nordwacht.com",
    siteName: "NordWacht",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NordWacht | AI Implementation Agency",
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
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
