import type { Metadata } from "next";
import { ClosingCta, HomeHero, Industries, ServicesTeaser, WhyTeaser } from "@/components/home/HomeSections";
import { Manifesto } from "@/components/home/Manifesto";
import { ScenePath, type SceneOffset } from "@/components/motion/ScenePath";
import { brand } from "@/content/site";
import { pageMeta } from "@/lib/metadata";

export const metadata: Metadata = pageMeta({
  title: `Axrok | ${brand.tagline}`,
  description: brand.positioning,
  path: "/",
});

// Where the wolf sits, relative to the Home pose, as each section takes the screen.
const HOME_PATH: Record<string, SceneOffset> = {
  hero: {},
  // Recedes and turns aside; facets part slightly, like an exploded product view.
  manifesto: { camZ: 2.4, wolfZ: -0.8, wolfY: -0.25, rotY: -0.72, rotX: 0.06, dim: 0.4, explode: 0.14 },
  services: { camZ: 1.2, wolfX: 0.64, wolfZ: -1, wolfY: -0.2, rotY: -0.55, scale: -0.24, dim: 0.3 },
  industries: { camZ: 1.2, wolfX: 0.64, wolfZ: -1, wolfY: -0.2, rotY: -0.7, scale: -0.24, dim: 0.35 },
  why: { camZ: 0.4, wolfX: -0.56, wolfY: -0.15, rotY: 0.38, rotX: -0.08, scale: -0.12, dim: 0.05 },
  cta: { camZ: 1.6, wolfX: 0.45, wolfY: 0.05, rotY: -0.25, scale: -0.08, dim: 0.15 },
};

export default function Home() {
  return (
    <>
      <HomeHero />
      <Manifesto />
      <ServicesTeaser />
      <Industries />
      <WhyTeaser />
      <ClosingCta />
      {/* Last, so the manifesto pin exists before these triggers measure. */}
      <ScenePath path={HOME_PATH} />
    </>
  );
}
