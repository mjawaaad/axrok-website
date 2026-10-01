import type { Metadata } from "next";
import { brand } from "@/content/site";
import { pageMeta } from "@/lib/metadata";

export const metadata: Metadata = pageMeta({
  title: `Axrok | ${brand.tagline}`,
  description: brand.positioning,
  path: "/",
});

// Stage 1 stub: the wolf story is built in stage 5.
export default function Home() {
  return (
    <section className="flex min-h-dvh items-end px-10 pb-24">
      <h1 className="display text-6xl">{brand.tagline}</h1>
    </section>
  );
}
