import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Contact Axrok: the Amarok wolf mark beside the tagline.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Contact", title: "Tell us what you need protected." });
}
