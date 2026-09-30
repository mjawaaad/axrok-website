import type { MetadataRoute } from "next";
import { brand, nav } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return nav.map((item) => ({
    url: `${brand.siteUrl}${item.href === "/" ? "" : item.href}`,
    changeFrequency: "monthly",
    priority: item.href === "/" ? 1 : item.href === "/contact" ? 0.9 : 0.8,
  }));
}
