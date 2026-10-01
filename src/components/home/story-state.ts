import wolf from "@/content/wolf.json";

/**
 * The Home story's live values. The scrubbed GSAP timeline tweens this object; the WebGL
 * scene (or the image version) reads it every frame. Plain object, no React renders.
 */
export const story = {
  /** Log zoom along the three-frame push-in (0 = widest frame). See zoom.ts. */
  lz: 0,
  /** Multiplies luminance before grading: low values sink the scene into near-darkness. */
  exposure: 0.62,
  /** Depth parallax strength (fraction of the frame). */
  parallax: 0.006,
  /** Cobalt rim light along depth edges. */
  rim: 0,
  /** Cobalt light catching the eyes of the closest frame. */
  eyes: 0,
  /** Fade to void navy for the logo beat. */
  fade: 0,
  /** 0..1 entrance from total darkness, played once on page entry (not scroll-driven). */
  reveal: 0,
};

export const WOLF = {
  grade: wolf.grade,
  alt: wolf.alt,
  /** Eyes of the closest frame (fractions, top-left origin), where the catchlights land. */
  eyes: wolf.frames[wolf.frames.length - 1].eyes as [number, number][],
};

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const WOLF_TEXTURES = {
  frames: wolf.frames.map((_, i) => `${base}/wolf/frame-${i + 1}.webp`),
  depths: wolf.frames.map((_, i) => `${base}/wolf/depth-${i + 1}.webp`),
};
