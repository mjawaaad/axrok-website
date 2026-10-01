import wolf from "@/content/wolf.json";

/**
 * One continuous push-in built from three frames, each closer than the last.
 *
 * Every frame is placed so the wolf's eyes (its anchor) sit at the same screen point, at the
 * size they would have at the current zoom. The next frame enters as a soft-edged window around
 * the wolf while it is still smaller than the screen, and grows until it covers it, so the centre
 * of the image is always the sharpest frame and the hand-off happens out in the dark edges.
 * Zoom is driven in log space (lz), so equal scroll gives equal perceived zoom throughout.
 *
 * Shared by the WebGL scene and the image (phone) version so both move identically.
 */

export const AR = wolf.source.width / wolf.source.height;
export const FRAMES = wolf.frames;

/** Zoom at which each frame exactly covers the screen (frame 1 = 1). */
export const HOMES = FRAMES.reduce<number[]>((acc, f, i) => [...acc, i === 0 ? 1 : acc[i - 1] * f.scale], []);
/** Log zoom at which each frame exactly covers the screen. */
export const LZ_HOMES = HOMES.map(Math.log);

export type Layer = { x: number; y: number; w: number; h: number; alpha: number; feather: number; visible: boolean };
export type Frame = { anchor: [number, number]; base: number; layers: Layer[]; zoom: number };

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Monotone cubic (Fritsch-Carlson) through the frames' anchors, so the camera's pan is smooth. */
function anchorPath(lz: number, axis: 0 | 1) {
  const xs = LZ_HOMES;
  const ys = FRAMES.map((f) => f.anchor[axis]);
  if (lz <= xs[0]) return ys[0];
  if (lz >= xs[xs.length - 1]) return ys[ys.length - 1];
  const d = xs.slice(1).map((x, i) => (ys[i + 1] - ys[i]) / (x - xs[i]));
  const m = ys.map((_, i) => {
    if (i === 0) return d[0];
    if (i === ys.length - 1) return d[d.length - 1];
    return d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  });
  let k = 0;
  while (k < xs.length - 2 && lz > xs[k + 1]) k++;
  const h = xs[k + 1] - xs[k];
  const t = (lz - xs[k]) / h;
  const t2 = t * t;
  const t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * ys[k] + (t3 - 2 * t2 + t) * h * m[k] + (-2 * t3 + 3 * t2) * ys[k + 1] + (t3 - t2) * h * m[k + 1];
}

/** Where every frame sits on screen at log-zoom `lz`, for a vw x vh viewport (CSS px). */
export function frameAt(lz: number, vw: number, vh: number): Frame {
  const zoom = Math.exp(Math.max(0, lz));
  const bw = Math.max(vw, vh * AR);
  const bh = bw / AR;
  const scales = HOMES.map((h) => zoom / h);
  const base = scales.reduce((b, s, i) => (s >= 1 ? i : b), 0);

  // Desired screen position of the eyes: the frames' own composition, pulled toward the
  // centre on screens narrower (phones) or wider than the frames.
  const va = vw / vh;
  let sx = anchorPath(lz, 0);
  let sy = anchorPath(lz, 1);
  if (va < AR) sx += (0.5 - sx) * Math.min(1, (AR - va) / (AR - 0.5));
  if (va > AR) sy += (0.42 - sy) * Math.min(1, (va - AR) / AR);
  let ax = sx * vw;
  let ay = sy * vh;

  // Keep the base (screen-filling) frame covering the viewport.
  const [bx, by] = FRAMES[base].anchor;
  const w0 = bw * scales[base];
  const h0 = bh * scales[base];
  ax = Math.min(bx * w0, Math.max(vw - (1 - bx) * w0, ax));
  ay = Math.min(by * h0, Math.max(vh - (1 - by) * h0, ay));

  const layers = FRAMES.map((f, i) => {
    const s = scales[i];
    const w = bw * s;
    const h = bh * s;
    const alpha = i === 0 ? 1 : smoothstep(0.36, 0.6, s);
    const feather = i === 0 ? 0 : 0.26 * (1 - smoothstep(0.78, 1, s));
    // Frames below the base are fully covered; frames not yet faded in are skipped.
    const visible = i >= base && alpha > 0;
    return { x: ax - f.anchor[0] * w, y: ay - f.anchor[1] * h, w, h, alpha, feather, visible };
  });

  return { anchor: [ax, ay], base, layers, zoom };
}
