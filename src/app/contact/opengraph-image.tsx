import { ogContentType, ogSize, renderOg } from "@/lib/og";

// Generated at build time; required for the static export used by GitHub Pages.
export const dynamic = "force-static";

export const alt = "Contact Axrok: a grey wolf in cobalt night light beside the tagline.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Contact", title: "Tell us what you need protected." });
}