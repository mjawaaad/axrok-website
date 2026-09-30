import type { Metadata } from "next";
import { brand, socials } from "@/content/site";

/**
 * Complete per-page metadata. A page's `openGraph` replaces the layout's rather than merging,
 * so every page gets the full set. OG images come from each route's opengraph-image.tsx.
 */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const fullTitle = path === "/" ? title : `${title} | Axrok`;
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Axrok",
      locale: "en_US",
      url: path,
      title: fullTitle,
      description,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}

/** Organization structured data for the root layout. */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Axrok",
  legalName: brand.legalName,
  url: brand.siteUrl,
  logo: `${brand.siteUrl}/icon.svg`,
  slogan: brand.tagline,
  description: brand.positioning,
  address: { "@type": "PostalAddress", addressLocality: "Peshawar", addressCountry: "PK" },
  areaServed: "Worldwide",
  sameAs: socials.map((s) => s.href),
};
