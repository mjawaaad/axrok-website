import type { Metadata } from "next";
import { WolfStory } from "@/components/home/WolfStory";
import { ServicesTeaser, WhyTeaser } from "@/components/home/HomeSections";
import { brand } from "@/content/site";
import { pageMeta } from "@/lib/metadata";

export const metadata: Metadata = pageMeta({
  title: `Axrok | ${brand.tagline}`,
  description: brand.positioning,
  path: "/",
});

/** The story is the point; the rest of Home stays light. */
export default function Home() {
  return (
    <>
      <WolfStory />
      <ServicesTeaser />
      <WhyTeaser />
    </>
  );
}
