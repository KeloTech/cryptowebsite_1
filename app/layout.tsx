import { Background } from "@/components/Background";
import { MobileMotionProvider } from "@/components/MobileMotionProvider";
import { siteConfig } from "@/data/siteConfig";
import type { Metadata, Viewport } from "next";
import { Nunito, Quicksand } from "next/font/google";
import "./globals.css";

const sans = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const display = Quicksand({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const base = new URL(siteConfig.meta.siteUrl);

export const metadata: Metadata = {
  metadataBase: base,
  title: siteConfig.meta.title,
  description: siteConfig.meta.description,
  applicationName: siteConfig.brand.name,
  icons: {
    icon: "/bluesloth%20icon.png",
    apple: "/bluesloth%20icon.png",
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
  themeColor: "#e8f5ef",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${sans.variable} ${display.variable}`}>
        <MobileMotionProvider>
          <Background />
          {children}
        </MobileMotionProvider>
      </body>
    </html>
  );
}
