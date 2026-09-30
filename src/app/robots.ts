import type { MetadataRoute } from "next";
import { brand } from "@/content/site";

// Generated at build time; required for the static export used by GitHub Pages.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${brand.siteUrl}/sitemap.xml`,
  };
}
