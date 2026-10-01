import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import geometry from "@/content/logo-geometry.json";
import { brand } from "@/content/site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/**
 * Shared Open Graph card: the colour-graded wolf (assets/og/wolf-graded.jpg, produced by
 * scripts/prepare-wolf.mjs) fading into void navy behind the mark, page title and base.
 */
export async function renderOg({ eyebrow, title }: { eyebrow: string; title: string }) {
  const root = process.cwd();
  const [wolf, font600, font400] = await Promise.all([
    readFile(join(root, "assets/og/wolf-graded.jpg")),
    readFile(join(root, "node_modules/@fontsource/archivo/files/archivo-latin-600-normal.woff")),
    readFile(join(root, "node_modules/@fontsource/archivo/files/archivo-latin-400-normal.woff")),
  ]);
  const wolfSrc = `data:image/jpeg;base64,${wolf.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ display: "flex", position: "relative", width: "100%", height: "100%", background: "#0B0139", fontFamily: "Archivo" }}>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={wolfSrc} width={1200} height={800} style={{ position: "absolute", left: 180, top: -110, width: 1200, height: 800, objectFit: "cover" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "linear-gradient(90deg, #0B0139 0%, rgba(11,1,57,0.94) 38%, rgba(11,1,57,0.35) 68%, rgba(11,1,57,0) 100%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 0 64px 72px", width: 660 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg viewBox={geometry.viewBox.join(" ")} width={44} height={50}>
              <path d={geometry.path} fill="#5B70FF" fillRule="evenodd" />
            </svg>
            <div style={{ color: "#F4F5FF", fontSize: 24, fontWeight: 600, letterSpacing: 9 }}>AXROK</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#A3B1FF", fontSize: 18, letterSpacing: 5, textTransform: "uppercase", fontWeight: 400 }}>{eyebrow}</div>
            <div style={{ color: "#F4F5FF", fontSize: 56, fontWeight: 600, lineHeight: 1.04, marginTop: 20, letterSpacing: -1 }}>{title}</div>
          </div>
          <div style={{ display: "flex", color: "#B9BEE6", fontSize: 20, fontWeight: 400 }}>{brand.location}</div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Archivo", data: font600, weight: 600, style: "normal" },
        { name: "Archivo", data: font400, weight: 400, style: "normal" },
      ],
    }
  );
}
