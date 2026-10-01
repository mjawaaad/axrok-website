// Prepares the Home story's wolf assets from the three-frame push-in.
//
//   assets/wolf/frames/wolf-{1,2,3}.png   the frames, each closer than the last
//   assets/wolf/frames/depth-{n}.png      optional depth maps (near = white); estimated with
//                                         Depth Anything V2 and cached here if absent
//
// Outputs:
//   public/wolf/frame-{n}.webp           luminance, graded live by the WebGL shader
//   public/wolf/depth-{n}.webp           depth, for parallax and the cobalt rim light
//   src/assets/wolf/frame-{n}.webp       pre-graded colour frames (phones, reduced motion)
//   src/assets/wolf/graded-head.webp     close crop for interior pages
//   assets/og/wolf-graded.jpg            source for Open Graph images
//
// The grade (src/content/wolf.json) is the same gradient map the shader applies.
// Run with `npm run prepare:wolf`.
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const p = (rel) => decodeURIComponent(new URL(rel, root).pathname).replace(/^\/([A-Za-z]:)/, "$1");
const cfg = JSON.parse(readFileSync(p("src/content/wolf.json"), "utf8"));
for (const d of ["public/wolf", "src/assets/wolf", "assets/og"]) mkdirSync(p(d), { recursive: true });

// Gradient map lookup table, identical to the shader's.
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const stops = cfg.grade.stops.map(([t, c]) => [t, hex(c)]);
const lut = new Uint8Array(256 * 3);
const { shadowCrush, highlightClip, shoulder: s, gamma, stillExposure } = cfg.grade;
for (let i = 0; i < 256; i++) {
  let l = Math.max(0, ((i / 255) * stillExposure - shadowCrush) / (highlightClip - shadowCrush));
  if (l > s) l = s + (1 - s) * (1 - Math.exp(-(l - s) / (1 - s)));
  l = Math.pow(l, gamma);
  let k = 0;
  while (k < stops.length - 2 && l > stops[k + 1][0]) k++;
  const [t0, c0] = stops[k];
  const [t1, c1] = stops[k + 1];
  const f = Math.min(1, Math.max(0, (l - t0) / (t1 - t0)));
  for (let ch = 0; ch < 3; ch++) lut[i * 3 + ch] = Math.round(c0[ch] + (c1[ch] - c0[ch]) * f);
}
const grade = (lum, w, h) => {
  const rgb = Buffer.alloc(w * h * 3);
  for (let i = 0; i < w * h; i++) {
    rgb[i * 3] = lut[lum[i] * 3];
    rgb[i * 3 + 1] = lut[lum[i] * 3 + 1];
    rgb[i * 3 + 2] = lut[lum[i] * 3 + 2];
  }
  return sharp(rgb, { raw: { width: w, height: h, channels: 3 } });
};

let estimator = null;
const estimateDepth = async (file, out) => {
  if (!estimator) {
    console.log("loading Depth Anything V2 (first run downloads the model)");
    const { pipeline } = await import("@huggingface/transformers");
    estimator = await pipeline("depth-estimation", "onnx-community/depth-anything-v2-small", { dtype: "fp32" });
  }
  const { RawImage } = await import("@huggingface/transformers");
  const { depth } = await estimator(await RawImage.read(file));
  await depth.save(out);
};

const graded = [];
for (const [i, frame] of cfg.frames.entries()) {
  const n = i + 1;
  const src = p(`assets/wolf/frames/${frame.file}`);
  const { width: W, height: H } = await sharp(src).metadata();

  // Luminance with a per-frame gain so the three frames sit at the same brightness.
  const lum = await sharp(src).greyscale().extractChannel(0).raw().toBuffer();
  for (let k = 0; k < lum.length; k++) lum[k] = Math.min(255, Math.round(lum[k] * frame.gain));
  await sharp(lum, { raw: { width: W, height: H, channels: 1 } }).webp({ quality: 80 }).toFile(p(`public/wolf/frame-${n}.webp`));

  // Depth (near = bright), softened so parallax never tears at hard edges.
  const depthPng = p(`assets/wolf/frames/depth-${n}.png`);
  if (!existsSync(depthPng)) await estimateDepth(src, depthPng);
  await sharp(depthPng).greyscale().resize({ width: 1024 }).blur(1.6).webp({ quality: 88 }).toFile(p(`public/wolf/depth-${n}.webp`));

  // Pre-graded colour frame (no vignette: frames are layered, the vignette is applied on screen).
  const g = await grade(lum, W, H).png().toBuffer();
  await sharp(g).webp({ quality: 78 }).toFile(p(`src/assets/wolf/frame-${n}.webp`));
  graded.push({ buf: g, W, H, frame });
  console.log(`frame ${n}: ${W}x${H}`);
}

const vignette = (w, h, [cx, cy], strength = 0.9) =>
  Buffer.from(
    `<svg width="${w}" height="${h}"><defs><radialGradient id="v" cx="${cx}" cy="${cy}" r="0.8"><stop offset="0.3" stop-color="#020009" stop-opacity="0"/><stop offset="1" stop-color="#020009" stop-opacity="${strength}"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#v)"/></svg>`
  );

// Head crop from the closest frame, for interior pages.
{
  const { buf, W, H, frame } = graded[2];
  const cropW = Math.round(W * 0.42);
  const cropH = Math.round(cropW * 1.12);
  const left = Math.max(0, Math.min(W - cropW, Math.round(frame.anchor[0] * W - cropW / 2)));
  const top = Math.max(0, Math.min(H - cropH, Math.round(frame.anchor[1] * H - cropH * 0.36)));
  const withV = await sharp(buf).composite([{ input: vignette(W, H, frame.anchor, 0.75) }]).toBuffer();
  await sharp(withV).extract({ left, top, width: cropW, height: cropH }).resize({ width: 900 }).webp({ quality: 82 }).toFile(p("src/assets/wolf/graded-head.webp"));
}

// Open Graph source from the middle frame.
{
  const { buf, W, H, frame } = graded[1];
  // Composite first: sharp applies resize before composite in a single pipeline.
  const withV = await sharp(buf).composite([{ input: vignette(W, H, frame.anchor, 0.85) }]).toBuffer();
  await sharp(withV)
    .resize({ width: 1200 })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(p("assets/og/wolf-graded.jpg"));
}

console.log("done");
