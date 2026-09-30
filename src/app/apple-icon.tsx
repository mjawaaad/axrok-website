import { ImageResponse } from "next/og";
import geometry from "@/content/logo-geometry.json";

// Generated at build time; required for the static export used by GitHub Pages.
export const dynamic = "force-static";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "#0B0139" }}>
        <svg viewBox={geometry.viewBox.join(" ")} width={112} height={127}>
          <path d={geometry.path} fill="#5B70FF" fillRule="evenodd" />
        </svg>
      </div>
    ),
    size
  );
}
