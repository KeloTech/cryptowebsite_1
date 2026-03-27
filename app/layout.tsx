import { Background } from "@/components/Background";
import { MobileMotionProvider } from "@/components/MobileMotionProvider";
import { siteConfig } from "@/data/siteConfig";
import type { Metadata, Viewport } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const base = new URL(siteConfig.meta.siteUrl);

export const metadata: Metadata = {
  metadataBase: base,
  title: siteConfig.meta.title,
  description: siteConfig.meta.description,
  applicationName: siteConfig.brand.name,
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: siteConfig.meta.title,
    description: siteConfig.meta.description,
    url: base,
    siteName: siteConfig.brand.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: siteConfig.meta.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.brand.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.meta.title,
    description: siteConfig.meta.description,
    creator: siteConfig.meta.twitterHandle,
    images: [siteConfig.meta.ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#07080f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${sans.variable} ${display.variable} min-h-screen font-sans`}
      >
        <MobileMotionProvider>
          <Background />
          {children}
        </MobileMotionProvider>
      </body>
    </html>
  );
}
