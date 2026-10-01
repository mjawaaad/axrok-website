import { ogContentType, ogSize, renderOg } from "@/lib/og";

// Generated at build time; required for the static export used by GitHub Pages.
export const dynamic = "force-static";

export const alt = "Axrok Labs: a grey wolf in cobalt night light, coming soon.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Labs", title: "Research and tooling, coming soon." });
}