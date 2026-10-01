import { ogContentType, ogSize, renderOg } from "@/lib/og";

// Generated at build time; required for the static export used by GitHub Pages.
export const dynamic = "force-static";

export const alt = "Axrok products: a grey wolf in cobalt night light beside the platforms behind Axrok services.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Products", title: "The platforms behind the service." });
}