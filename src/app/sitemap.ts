import type { MetadataRoute } from "next";
import { allRoutes, brand } from "@/content/site";

// Generated at build time; required for the static export used by GitHub Pages.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return allRoutes.map((path) => ({
    url: `${brand.siteUrl}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path === "/contact" ? 0.9 : path.split("/").length > 2 ? 0.7 : 0.8,
  }));
}
