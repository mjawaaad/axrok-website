import { ogContentType, ogSize, renderOg } from "@/lib/og";

// Generated at build time; required for the static export used by GitHub Pages.
export const dynamic = "force-static";

export const alt = "About Axrok: a grey wolf in cobalt night light beside the founder-led story.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "About", title: "Security, led by the people who do the work." });
}