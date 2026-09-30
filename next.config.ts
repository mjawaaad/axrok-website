import type { NextConfig } from "next";

// GitHub Pages serves static files only, under /<repo>/. The Pages workflow sets
// GITHUB_PAGES=true and PAGES_BASE_PATH; every other build (local, Vercel) is a normal
// server build with the /api/contact handler.
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = isPages ? (process.env.PAGES_BASE_PATH ?? "") : "";

const nextConfig: NextConfig = {
  ...(isPages && {
    output: "export",
    basePath,
    trailingSlash: true,
    // The default image optimizer needs a server.
    images: { unoptimized: true },
  }),
  env: {
    // Client code needs these for raw asset URLs (the glTF) and to pick the form endpoint.
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_STATIC_EXPORT: isPages ? "true" : "",
  },
};

export default nextConfig;
