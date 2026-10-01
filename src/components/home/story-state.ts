import wolf from "@/content/wolf.json";

/**
 * The Home story's live values. The scrubbed GSAP timeline tweens this object; the WebGL
 * scene (or the light image version) reads it every frame. Plain object, no React renders.
 */
export const story = {
  /** 1 = the whole frame (cover). Higher values move the camera closer. */
  zoom: 1,
  /** 0 = frame centred on the wolf, 1 = centred on the eyes. */
  focus: 0,
  /** Camera orbit around the subject in radians; easing to 0 reads as the head turning to face you. */
  yaw: 0.0,
  /** Multiplies source luminance before grading: low values sink the scene into near-darkness. */
  exposure: 0.42,
  /** Depth displacement strength (world units). */
  displace: 0.16,
  /** Cobalt rim light along depth edges. */
  rim: 0,
  /** Cobalt light catching the eyes. */
  eyes: 0,
  /** Fade to void navy for the logo beat. */
  fade: 0,
  /** 0..1 entrance from total darkness, played once on page entry (not scroll-driven). */
  reveal: 0,
};

export const WOLF = {
  aspect: wolf.source.width / wolf.source.height,
  /** Focus points in UV space (origin bottom-left), as WebGL samples them. */
  body: [wolf.focus.wolf[0], 1 - wolf.focus.wolf[1]] as [number, number],
  head: [wolf.focus.head[0], 1 - wolf.focus.head[1]] as [number, number],
  eyes: wolf.focus.eyes.map(([x, y]) => [x, 1 - y]) as [number, number][],
  grade: wolf.grade,
  alt: wolf.alt,
};

/** Midpoint between the eyes, the point the camera closes in on. */
export const EYES_MID: [number, number] = [
  (WOLF.eyes[0][0] + WOLF.eyes[1][0]) / 2,
  (WOLF.eyes[0][1] + WOLF.eyes[1][1]) / 2,
];

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const WOLF_TEXTURES = {
  luma: (hi: boolean) => `${base}/wolf/luma-${hi ? 2048 : 1024}.webp`,
  depth: `${base}/wolf/depth-1024.webp`,
};
