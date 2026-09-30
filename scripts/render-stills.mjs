// Captures pre-rendered stills of the live Amarok scene for the static fallback (phones,
// low-power devices, no WebGL) and for Open Graph images. Same model, same light rig.
//
// Usage: start the app (`npm run dev` or `npm start`), then `npm run render:stills`.
// Env: BASE_URL (default http://localhost:3000), CHROME_PATH (a local Chrome/Edge binary).
import { mkdirSync } from "node:fs";
import puppeteer from "puppeteer-core";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const CHROME =
  process.env.CHROME_PATH ??
  (process.platform === "win32"
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "darwin"
      ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      : "/usr/bin/google-chrome");

const SIZE = 1200;
mkdirSync(new URL("../src/assets/renders/", import.meta.url), { recursive: true });
mkdirSync(new URL("../assets/renders/", import.meta.url), { recursive: true });
const out = (rel) => decodeURIComponent(new URL(rel, import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1");

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--enable-gpu", "--ignore-gpu-blocklist", "--hide-scrollbars"],
});

for (const still of ["front", "turned"]) {
  const page = await browser.newPage();
  await page.setViewport({ width: SIZE, height: SIZE, deviceScaleFactor: 1 });
  await page.goto(`${BASE}/?quality=high&still=${still}`, { waitUntil: "networkidle2" });
  await page.waitForSelector("canvas", { timeout: 30000 });
  await new Promise((r) => setTimeout(r, 4500)); // let the canvas fade in and the environment bake
  const canvas = await page.$("canvas");
  // Web fallback, statically imported by StaticWolf (next/image resizes and re-encodes per device).
  await canvas.screenshot({ path: out(`../src/assets/renders/amarok-${still}.webp`), type: "webp", quality: 88 });
  // Lossless source for Open Graph images (read at build time, not shipped publicly).
  await canvas.screenshot({ path: out(`../assets/renders/amarok-${still}.png`), type: "png" });
  console.log(`rendered ${still}`);
  await page.close();
}

await browser.close();
