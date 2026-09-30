// Shared, mutable scene state. GSAP tweens these plain objects; the R3F rig reads
// them every frame. Nothing here triggers React renders.

export type ScenePose = {
  /** Camera position (world units). */
  camX: number;
  camY: number;
  camZ: number;
  /** Camera look-at target. */
  lookX: number;
  lookY: number;
  /** Wolf position. X is a fraction of the visible half-width at z=0, so layouts hold on any aspect. */
  wolfX: number;
  wolfY: number;
  wolfZ: number;
  /** Wolf orientation (radians). */
  rotX: number;
  rotY: number;
  scale: number;
  /** Idle sway amplitude (0 = static). */
  sway: number;
  /** Light rig. */
  rim: number;
  key: number;
  fill: number;
  /** Cursor-driven orbit strength (0 = off). Only Home and About enable it. */
  cursor: number;
};

export type RouteKey = "home" | "services" | "about" | "contact";

export const ROUTE_POSES: Record<RouteKey, ScenePose> = {
  // Center stage, turning slowly, cursor orbit on.
  home: {
    camX: 0, camY: 0.1, camZ: 9.5, lookX: 0, lookY: 0.1,
    wolfX: 0, wolfY: 0.62, wolfZ: 0, rotX: 0.04, rotY: 0, scale: 0.74,
    sway: 1, rim: 1, key: 0.55, fill: 0.12, cursor: 1,
  },
  // Quietly to one side, alert but not the focal point.
  services: {
    camX: 0, camY: 0, camZ: 10.5, lookX: 0, lookY: 0,
    wolfX: 0.64, wolfY: 0.15, wolfZ: -1.2, rotX: 0.02, rotY: -0.55, scale: 0.66,
    sway: 0.25, rim: 0.7, key: 0.28, fill: 0.06, cursor: 0,
  },
  // Poised and alert: faces forward, head slightly raised, harder rim.
  about: {
    camX: 0, camY: -0.1, camZ: 9.8, lookX: 0, lookY: 0,
    wolfX: -0.52, wolfY: 0.5, wolfZ: 0, rotX: -0.1, rotY: 0.32, scale: 0.7,
    sway: 0.35, rim: 1.35, key: 0.5, fill: 0.1, cursor: 1,
  },
  // Static and fully lit beside the form.
  contact: {
    camX: 0, camY: 0, camZ: 10, lookX: 0, lookY: 0,
    wolfX: 0.6, wolfY: 0.6, wolfZ: -0.4, rotX: 0, rotY: -0.3, scale: 0.6,
    sway: 0, rim: 1.1, key: 1.05, fill: 0.35, cursor: 0,
  },
};

/**
 * Poses for pre-rendered stills (?still=front|turned): centered, static, fully lit.
 * Captured by scripts/render-stills.mjs for the static fallback and Open Graph images.
 */
export const STILL_POSES: Record<"front" | "turned", ScenePose> = {
  front: {
    camX: 0, camY: 0, camZ: 9.5, lookX: 0, lookY: 0,
    wolfX: 0, wolfY: 0, wolfZ: 0, rotX: 0.02, rotY: 0.2, scale: 1.08,
    sway: 0, rim: 1.1, key: 0.75, fill: 0.2, cursor: 0,
  },
  turned: {
    camX: 0, camY: 0, camZ: 9.5, lookX: 0, lookY: 0,
    wolfX: 0, wolfY: 0, wolfZ: 0, rotX: 0.02, rotY: -0.5, scale: 1.08,
    sway: 0, rim: 1, key: 0.55, fill: 0.15, cursor: 0,
  },
};

export const stillMode = (): keyof typeof STILL_POSES | null => {
  if (typeof window === "undefined") return null;
  const v = new URLSearchParams(window.location.search).get("still");
  return v === "front" || v === "turned" ? v : null;
};

export const routeKeyFor = (pathname: string): RouteKey => {
  if (pathname.startsWith("/services")) return "services";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/contact")) return "contact";
  return "home";
};

/** The live pose. Route changes tween this toward ROUTE_POSES[route]. */
export const pose: ScenePose = { ...ROUTE_POSES.home, camZ: 13.5 };

/** Additive offsets written by per-page ScrollTrigger timelines (Home only). */
export const scrollPose = { wolfX: 0, wolfY: 0, wolfZ: 0, rotY: 0, rotX: 0, camZ: 0, scale: 0, dim: 0, explode: 0 };

export const resetScrollPose = () => {
  for (const k of Object.keys(scrollPose) as (keyof typeof scrollPose)[]) scrollPose[k] = 0;
};
