import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ClientInit } from "@/components/site/ClientInit";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Preloader } from "@/components/loader/Preloader";
import { introHeadScript } from "@/lib/intro";
import { organizationJsonLd } from "@/lib/metadata";
import { brand } from "@/content/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: {
    default: `Axrok | ${brand.tagline}`,
    template: "%s | Axrok",
  },
  description: brand.positioning,
  applicationName: "Axrok",
  openGraph: {
    type: "website",
    siteName: "Axrok",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0B0139",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // The intro head script and capability detection set data attributes before hydration.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introHeadScript }} />
        <noscript>
          <style>{"#intro{display:none}"}</style>
        </noscript>
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-[100] border border-cobalt-lift bg-navy px-4 py-2 text-sm focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <ClientInit />
        <SmoothScroll />
        <Preloader />
        <Header />
        <main id="main" className="relative">
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
