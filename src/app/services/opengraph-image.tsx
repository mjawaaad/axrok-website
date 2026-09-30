import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Axrok services: the Amarok wolf mark beside the five service disciplines.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Services", title: "Five disciplines. One accountable partner." });
}
