// Builds the Amarok sculpture from the logo geometry and writes public/models/amarok.glb.
//
// The mark is cut into facets along its own lines (the eye slit becomes the seam between
// brow and cheek), each facet is extruded with a chamfered bevel and tilted on its own plane.
// Neighbouring chamfers meet in machined V-grooves, so it reads as a precision-cut emblem.
// Output is Meshopt-compressed and quantized. Run with `npm run build:wolf`.
import { readFileSync, mkdirSync } from "node:fs";
import * as THREE from "three";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { NodeIO } from "@gltf-transform/core";
import { EXTMeshoptCompression, KHRMeshQuantization } from "@gltf-transform/extensions";
import { meshopt, prune, dedup, weld } from "@gltf-transform/functions";
import { MeshoptEncoder } from "meshoptimizer";

// GLTFExporter uses FileReader for binary output; Node has Blob but not FileReader.
globalThis.FileReader ??= class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      this.onloadend?.();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = `data:${blob.type};base64,` + Buffer.from(buf).toString("base64");
      this.onloadend?.();
    });
  }
};

const geo = JSON.parse(readFileSync(new URL("../src/content/logo-geometry.json", import.meta.url)));
const [, , VW, VH] = geo.viewBox;
const K = 200; // SVG units per world unit: the mark is ~3.0 x 3.45 units.
const toWorld = ([x, y]) => new THREE.Vector2((x - VW / 2) / K, -(y - VH / 2) / K);

// A facet's surface is the plane through three anchor points with chosen heights (world z).
// Facets that share an edge share the anchors along it, so they meet in a continuous fold
// rather than a step; the chamfers then read as a machined groove along the fold line.
const plane = (anchors) => {
  const [p1, p2, p3] = anchors.map(([pt, h]) => {
    const v = toWorld(pt);
    return [v.x, v.y, h];
  });
  // Solve h = aX + bY + c through three points.
  const det = (m) =>
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  const M = [[p1[0], p1[1], 1], [p2[0], p2[1], 1], [p3[0], p3[1], 1]];
  const H = [p1[2], p2[2], p3[2]];
  const D = det(M);
  const col = (i) => M.map((row, r) => row.map((v, c) => (c === i ? H[r] : v)));
  return { a: det(col(0)) / D, b: det(col(1)) / D, c: det(col(2)) / D };
};
const at = (p, [x, y]) => {
  const v = toWorld([x, y]);
  return p.a * v.x + p.b * v.y + p.c;
};
const offset = (p, dz) => ({ ...p, c: p.c + dz });

// Key points (SVG coordinates).
const APEX = [300, 78];
const EYE_TOP = [131.3, 250.1]; // the eye's axis meets the outer brow edge
const EYE_LOW = [301, 472.8]; // the eye's axis meets the center line
const LEFT = [2, 382];
const RIGHT = [606, 385];
const CHIN = [301, 644];

// Left half folds along the eye's axis: the eye becomes a slit in the fold.
const browPlane = plane([[APEX, 0.16], [EYE_TOP, -0.02], [EYE_LOW, 0.34]]);
const lowerPlane = plane([[EYE_TOP, -0.02], [EYE_LOW, 0.34], [LEFT, -0.16]]);
// Right half: the outline frame mirrors the left, meeting it at apex and chin.
const framePlane = plane([[APEX, 0.16], [RIGHT, -0.16], [CHIN, at(lowerPlane, CHIN)]]);

const facets = [
  { name: "brow", material: "cobalt", pts: [APEX, EYE_TOP, EYE_LOW], plane: browPlane, depth: 0.34 },
  {
    name: "cheek",
    material: "cobalt",
    pts: [EYE_TOP, LEFT, [153, 631], [131, 484], [160, 376], [175, 331], [145, 268]],
    plane: lowerPlane,
    depth: 0.34,
  },
  {
    // Coplanar with the cheek: separated only by a machined groove.
    name: "muzzle",
    material: "cobalt",
    pts: [[131, 484], [177, 559], [201, 653], [266, 690], [250, 639], CHIN, EYE_LOW, [276, 440], [160, 376]],
    plane: lowerPlane,
    depth: 0.34,
  },
  { name: "frame", material: "cobalt", pts: geo.pieces.frameR.outer, plane: framePlane, depth: 0.34 },
  { name: "eyeR", material: "cobalt", pts: geo.pieces.eyeR.outer, plane: offset(framePlane, -0.03), depth: 0.26 },
  // Void navy negative space: a recessed satin plate inside the frame.
  { name: "void", material: "void", pts: geo.pieces.voidR.outer, plane: offset(framePlane, -0.16), depth: 0.14, bevel: 0.01 },
  // Ears lean back at the tips.
  { name: "earL", material: "cobalt", pts: [[70, 1], [208, 134], [70, 265]], plane: plane([[[70, 1], -0.26], [[208, 134], 0.02], [[70, 265], -0.04]]), depth: 0.28 },
  { name: "earR", material: "cobalt", pts: [[537, 1], [537, 265], [399, 134]], plane: plane([[[537, 1], -0.26], [[399, 134], 0.02], [[537, 265], -0.04]]), depth: 0.28 },
];

const materials = {
  cobalt: new THREE.MeshStandardMaterial({ name: "cobalt", color: 0x1e3aff, metalness: 1, roughness: 0.32 }),
  void: new THREE.MeshStandardMaterial({ name: "void", color: 0x0b0139, metalness: 0.6, roughness: 0.55 }),
};

const scene = new THREE.Scene();
const root = new THREE.Group();
root.name = "Amarok";
scene.add(root);

for (const f of facets) {
  const shape = new THREE.Shape(f.pts.map(toWorld));
  const bevel = f.bevel ?? 0.028;
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: f.depth,
    bevelEnabled: true,
    bevelThickness: bevel * 1.2,
    bevelSize: bevel,
    bevelOffset: -bevel, // chamfer inward so the silhouette stays true to the mark
    bevelSegments: 1,
    curveSegments: 1,
  });
  // Center depth on z=0 before tilting.
  g.translate(0, 0, -f.depth / 2);

  // Lay the facet onto its plane (a linear shear keeps every face planar).
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    pos.setZ(i, pos.getZ(i) + f.plane.a * x + f.plane.b * y + f.plane.c);
  }

  // Pivot at the facet's centroid so the runtime can separate facets ("explode") along their offset.
  g.computeBoundingBox();
  const pivot = g.boundingBox.getCenter(new THREE.Vector3());
  g.translate(-pivot.x, -pivot.y, -pivot.z);
  g.deleteAttribute("normal");
  const flat = g.index ? g.toNonIndexed() : g;
  flat.computeVertexNormals();

  const mesh = new THREE.Mesh(flat, materials[f.material]);
  mesh.name = f.name;
  mesh.position.copy(pivot);
  root.add(mesh);
}

const exporter = new GLTFExporter();
const glb = await exporter.parseAsync(scene, { binary: true });

const io = new NodeIO().registerExtensions([EXTMeshoptCompression, KHRMeshQuantization]).registerDependencies({
  "meshopt.encoder": MeshoptEncoder,
});
await MeshoptEncoder.ready;
const doc = await io.readBinary(new Uint8Array(glb));
// Keep flat normals: weld only exact duplicates, which never merge across faceted edges.
await doc.transform(dedup(), weld({ overwrite: false }), prune(), meshopt({ encoder: MeshoptEncoder, level: "high" }));

mkdirSync(new URL("../public/models/", import.meta.url), { recursive: true });
const out = new URL("../public/models/amarok.glb", import.meta.url);
await io.write(out.pathname.replace(/^\/([A-Z]:)/, "$1"), doc);

const tris = facets.length;
const bytes = readFileSync(out).byteLength;
console.log(`amarok.glb: ${tris} facets, ${(bytes / 1024).toFixed(1)} KB (raw ${(glb.byteLength / 1024).toFixed(1)} KB)`);
