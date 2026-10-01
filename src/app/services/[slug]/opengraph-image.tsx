import { ogContentType, ogSize, renderOg } from "@/lib/og";
import { serviceBySlug, services } from "@/content/site";

// Generated at build time for each service; required for the static export used by GitHub Pages.
export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export const alt = "An Axrok service: a grey wolf in cobalt night light beside the service name.";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  return renderOg({ eyebrow: s ? `Service ${s.index}` : "Service", title: s?.title ?? "Axrok services" });
}