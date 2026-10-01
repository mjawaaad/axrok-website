// Decides whether this device gets the WebGL depth-parallax wolf story on Home ("high")
// or the lighter image-based version ("static"). Phones, low-power devices, Save-Data and
// software or missing WebGL get "static". Override for testing with ?quality=high|static.

export type Quality = "high" | "static";

export type Capability = { quality: Quality; reason: string };

export function detectCapability(): Capability {
  if (typeof window === "undefined") return { quality: "static", reason: "ssr" };

  const override = new URLSearchParams(window.location.search).get("quality");
  if (override === "high" || override === "static") return { quality: override, reason: "override" };

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if (nav.connection?.saveData) return { quality: "static", reason: "save-data" };

  // Phones: coarse pointer on a small screen get the static render.
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (coarse && Math.min(screen.width, screen.height) < 768) return { quality: "static", reason: "phone" };

  if ((nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2)
    return { quality: "static", reason: "low-power" };

  let gl: WebGL2RenderingContext | WebGLRenderingContext | null = null;
  try {
    const canvas = document.createElement("canvas");
    gl =
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ??
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true });
  } catch {
    gl = null;
  }
  if (!gl) return { quality: "static", reason: "no-webgl" };

  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
  gl.getExtension("WEBGL_lose_context")?.loseContext();
  if (/swiftshader|llvmpipe|software|basic render/i.test(renderer))
    return { quality: "static", reason: "software-gl" };

  return { quality: "high", reason: "ok" };
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
