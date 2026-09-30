import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "About Axrok: the Amarok wolf mark beside the founder-led story.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "About", title: "Security, led by the people who do the work." });
}
