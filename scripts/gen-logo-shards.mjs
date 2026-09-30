// Cuts the Axrok mark into a jittered triangular lattice for the loader's
// assembly animation. Only triangles that overlap a filled piece are kept.
// Output: src/content/logo-shards.json. Run with `npm run gen:logo`.
import { readFileSync, writeFileSync } from "node:fs";

const geo = JSON.parse(readFileSync(new URL("../src/content/logo-geometry.json", import.meta.url)));
const [, , W, H] = geo.viewBox;
const COLS = 7;
const ROWS = 8;

// Deterministic PRNG so the shard layout is stable between runs.
let seed = 1337;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

const inPoly = ([x, y], poly) => {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const inPiece = (p, piece) => inPoly(p, piece.outer) && !piece.holes.some((h) => inPoly(p, h));
const inLogo = (p) => geo.filled.some((k) => inPiece(p, geo.pieces[k]));

const pad = 4;
const grid = [];
for (let r = 0; r <= ROWS; r++) {
  const row = [];
  for (let c = 0; c <= COLS; c++) {
    const edgeX = c === 0 || c === COLS;
    const edgeY = r === 0 || r === ROWS;
    const jx = edgeX ? 0 : (rand() - 0.5) * 0.6 * (W / COLS);
    const jy = edgeY ? 0 : (rand() - 0.5) * 0.6 * (H / ROWS);
    row.push([-pad + (c * (W + 2 * pad)) / COLS + jx, -pad + (r * (H + 2 * pad)) / ROWS + jy]);
  }
  grid.push(row);
}

const tris = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const a = grid[r][c], b = grid[r][c + 1], d = grid[r + 1][c], e = grid[r + 1][c + 1];
    if ((r + c) % 2 === 0) tris.push([a, b, e], [a, e, d]);
    else tris.push([a, b, d], [b, e, d]);
  }
}

// Sample each triangle with barycentric points; keep it if any land on the mark.
const overlaps = ([a, b, c]) => {
  for (let i = 0; i <= 8; i++) {
    for (let j = 0; j <= 8 - i; j++) {
      const u = i / 8, v = j / 8, w = 1 - u - v;
      if (inLogo([a[0] * u + b[0] * v + c[0] * w, a[1] * u + b[1] * v + c[1] * w])) return true;
    }
  }
  return false;
};

const round = (n) => Math.round(n * 10) / 10;
const shards = tris.filter(overlaps).map((t) => {
  const cx = (t[0][0] + t[1][0] + t[2][0]) / 3;
  const cy = (t[0][1] + t[1][1] + t[2][1]) / 3;
  return { points: t.map(([x, y]) => `${round(x)},${round(y)}`).join(" "), cx: round(cx), cy: round(cy) };
});

writeFileSync(
  new URL("../src/content/logo-shards.json", import.meta.url),
  JSON.stringify({ viewBox: geo.viewBox, shards }, null, 0) + "\n"
);
console.log(`wrote ${shards.length} shards of ${tris.length}`);
