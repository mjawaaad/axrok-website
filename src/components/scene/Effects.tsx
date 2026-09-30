"use client";

import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";

const ALL = ["bloom", "tone", "vignette", "grain"] as const;
type Fx = (typeof ALL)[number];

/**
 * Subtle bloom on the machined edges, neutral tone mapping (keeps cobalt from drifting to
 * magenta the way ACES does), a light vignette and a very light film grain over everything.
 */
export function Effects({ lite = false, only }: { lite?: boolean; only?: Fx[] }) {
  const on = new Set<Fx>(only ?? ALL);
  return (
    <EffectComposer multisampling={lite ? 0 : 4}>
      <>{on.has("bloom") && <Bloom mipmapBlur intensity={0.36} luminanceThreshold={0.9} luminanceSmoothing={0.15} radius={0.6} />}</>
      <>{on.has("tone") && <ToneMapping mode={ToneMappingMode.NEUTRAL} />}</>
      <>{on.has("vignette") && <Vignette offset={0.28} darkness={0.62} />}</>
      <>{on.has("grain") && <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.22} />}</>
    </EffectComposer>
  );
}
