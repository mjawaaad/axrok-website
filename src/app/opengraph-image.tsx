import { ogContentType, ogSize, renderOg } from "@/lib/og";

// Generated at build time; required for the static export used by GitHub Pages.
export const dynamic = "force-static";

export const alt = "Axrok: a grey wolf in cobalt night light beside the tagline Precision Offense. Absolute Defense.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Offensive security", title: "Precision Offense. Absolute Defense." });
}