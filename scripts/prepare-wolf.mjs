// Prepares the Home story's wolf assets from one photo.
//
//   assets/wolf/source.jpg  (the photo; replace to swap the wolf)
//   assets/wolf/depth.png   (optional; if absent a depth map is estimated with Depth Anything V2)
//
// Outputs:
//   public/wolf/luma-{2048,1024}.webp    luminance, graded live by the WebGL shader
//   public/wolf/depth-1024.webp          depth (near = bright), drives the displacement
//   src/assets/wolf/graded-{full,head}.webp  pre-graded stills: phone/low-power story, interior pages
//   assets/og/wolf-graded.jpg            source for Open Graph images
//
// The grade (src/content/wolf.json) is the same gradient map the shader applies.
// Run with `npm run prepare:wolf`.
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const p = (rel) => decodeURIComponent(new URL(rel, root).pathname).replace(/^\/([A-Za-z]:)/, "$1");
const cfg = JSON.parse(readFileSync(p("src/content/wolf.json"), "utf8"));
const SRC = p("assets/wolf/source.jpg");
const DEPTH_IN = p("assets/wolf/depth.png");

for (const d of ["public/wolf", "src/assets/wolf", "assets/og"]) mkdirSync(p(d), { recursive: true });

const { width: W, height: H } = await sharp(SRC).metadata();
console.log(`source ${W}x${H}`);

// Single-channel raw buffer at W x H. extractChannel guards against sharp promoting
// greyscale to three channels, which silently scrambles the layout.
const gray = (input, opts) => sharp(input, opts).resize(W, H).extractChannel(0).raw().toBuffer();

// 1. Depth: use a supplied map, or estimate one (near = bright).
let depthPng;
if (existsSync(DEPTH_IN)) {
  console.log("using supplied depth map");
  depthPng = DEPTH_IN;
} else {
  console.log("estimating depth with Depth Anything V2 (first run downloads the model)");
  const { pipeline, RawImage } = await import("@huggingface/transformers");
  const estimator = await pipeline("depth-estimation", "onnx-community/depth-anything-v2-small", { dtype: "fp32" });
  const { depth: out } = await estimator(await RawImage.read(SRC));
  depthPng = p("assets/wolf/depth.generated.png");
  await out.save(depthPng);
}
const depth = await gray(depthPng);
// Soften so the displaced mesh does not tear at hard depth edges.
await sharp(depth, { raw: { width: W, height: H, channels: 1 } })
  .resize({ width: 1024 })
  .blur(2.2)
  .webp({ quality: 90 })
  .toFile(p("public/wolf/depth-1024.webp"));

// 2. Depth of field: blur the far background, keep the wolf sharp. Cinematic, and the
//    blurred brush compresses far better than the raw texture.
const luma = await gray(SRC);
const far = await sharp(luma, { raw: { width: W, height: H, channels: 1 } }).blur(5).extractChannel(0).raw().toBuffer();
const dof = Buffer.alloc(W * H);
for (let i = 0; i < W * H; i++) {
  const d = depth[i] / 255;
  const sharpness = Math.min(1, Math.max(0, (d - 0.42) / 0.22)); // near objects stay sharp
  dof[i] = Math.round(far[i] + (luma[i] - far[i]) * sharpness);
}
const dofImg = () => sharp(dof, { raw: { width: W, height: H, channels: 1 } });

// 3. Luminance textures for the shader (greyscale is a third of the bytes of colour).
for (const size of [2048, 1024]) {
  await dofImg().resize({ width: Math.min(size, W) }).webp({ quality: 78 }).toFile(p(`public/wolf/luma-${size}.webp`));
}

// 4. Pre-graded stills: the same gradient map as the shader.
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const stops = cfg.grade.stops.map(([t, c]) => [t, hex(c)]);
const lut = new Uint8Array(256 * 3);
for (let i = 0; i < 256; i++) {
  let l = i / 255;
  l = Math.min(1, Math.max(0, (l - cfg.grade.shadowCrush) / (cfg.grade.highlightClip - cfg.grade.shadowCrush)));
  l = Math.pow(l, cfg.grade.gamma);
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
    const v = lum[i];
    rgb[i * 3] = lut[v * 3];
    rgb[i * 3 + 1] = lut[v * 3 + 1];
    rgb[i * 3 + 2] = lut[v * 3 + 2];
  }
  return sharp(rgb, { raw: { width: w, height: h, channels: 3 } });
};

const fullW = Math.min(2048, W);
const fullH = Math.round((H * fullW) / W);
const fullLum = await dofImg().resize(fullW, fullH).extractChannel(0).raw().toBuffer();
const graded = grade(fullLum, fullW, fullH);
const gradedPng = await graded.png().toBuffer();
// Night falloff: a soft vignette centred on the wolf so the edges sink into void navy.
const [fx, fy] = cfg.focus.wolf;
const vignette = Buffer.from(
  `<svg width="${fullW}" height="${fullH}"><defs><radialGradient id="v" cx="${fx}" cy="${fy}" r="0.75"><stop offset="0.35" stop-color="#03000f" stop-opacity="0"/><stop offset="1" stop-color="#03000f" stop-opacity="0.92"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#v)"/></svg>`
);
const stillFull = await sharp(gradedPng).composite([{ input: vignette }]).toBuffer();
await sharp(stillFull).webp({ quality: 80 }).toFile(p("src/assets/wolf/graded-full.webp"));

// Head crop (square-ish, for interior pages and the phone story's close beat).
const [hx, hy] = cfg.focus.head;
const cropW = Math.round(fullW * 0.34);
const cropH = Math.round(cropW * 1.1);
const left = Math.max(0, Math.min(fullW - cropW, Math.round(hx * fullW - cropW / 2)));
const top = Math.max(0, Math.min(fullH - cropH, Math.round(hy * fullH - cropH * 0.42)));
await sharp(stillFull).extract({ left, top, width: cropW, height: cropH }).resize({ width: 900 }).webp({ quality: 82 }).toFile(p("src/assets/wolf/graded-head.webp"));

// Open Graph source (read at build time, not shipped).
await sharp(stillFull).resize({ width: 1200 }).jpeg({ quality: 86, mozjpeg: true }).toFile(p("assets/og/wolf-graded.jpg"));

console.log("done");
