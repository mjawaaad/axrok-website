"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useApp } from "@/lib/app-store";
import { scrollPose } from "@/lib/scene-state";

// Raw public-folder URL, so it needs the base path when hosted under a subpath (GitHub Pages).
export const WOLF_URL = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/models/amarok.glb`;

/** Procedural brushed-metal grain: horizontal streaks used as a roughness map. */
function makeBrushedTexture() {
  const w = 512;
  const h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  for (let y = 0; y < h; y++) {
    // Each row is a streak; neighbours vary slightly so the grain reads as brushed, not striped.
    const row = 0.34 + (rand() - 0.5) * 0.16;
    let drift = 0;
    for (let x = 0; x < w; x++) {
      drift += (rand() - 0.5) * 0.012;
      drift *= 0.985;
      const v = Math.max(0, Math.min(1, row + drift + (rand() - 0.5) * 0.04));
      const i = (y * w + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v * 255;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1.6, 1.6);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}

/**
 * The Amarok: the Axrok mark as a precision-cut sculpture. Materials are assigned here rather
 * than baked into the glTF so they stay art-directable in code.
 */
export function Wolf() {
  const { scene } = useGLTF(WOLF_URL, false, true);
  const set = useApp((s) => s.set);

  const { root, facets } = useMemo(() => {
    const brushed = makeBrushedTexture();
    const cobalt = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#1e3aff"),
      // Slightly below full metal: a little diffuse cobalt keeps every facet readable at any angle,
      // while reflections and the clearcoat carry the machined, lacquered finish.
      metalness: 0.82,
      roughness: 0.42,
      roughnessMap: brushed,
      // No anisotropy: without authored tangents it produced NaN fragments on the flat facets,
      // which Bloom's mip blur then spread across the whole frame. The grain carries the brushed look.
      clearcoat: 0.3,
      clearcoatRoughness: 0.18,
      envMapIntensity: 1,
    });
    const voidMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#0b0139"),
      metalness: 0.55,
      roughness: 0.5,
      envMapIntensity: 0.5,
    });
    const root = scene.clone(true);
    const facets: { mesh: THREE.Mesh; base: THREE.Vector3; dir: THREE.Vector3 }[] = [];
    root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const name = Array.isArray(m.material) ? "" : m.material.name;
      m.material = name === "void" ? voidMat : cobalt;
      const base = m.position.clone();
      // Explode direction: outward in the plane, plus forward, so facets separate toward camera.
      const dir = new THREE.Vector3(base.x, base.y, 0).normalize().multiplyScalar(0.8).add(new THREE.Vector3(0, 0, 1));
      facets.push({ mesh: m, base, dir });
    });
    return { root, facets };
  }, [scene]);

  // Two frames after mount the sculpture is on screen: hand over to the loader.
  useEffect(() => {
    let a = 0;
    let b = 0;
    a = requestAnimationFrame(() => {
      b = requestAnimationFrame(() => set({ sceneReady: true, assetProgress: 1 }));
    });
    return () => {
      cancelAnimationFrame(a);
      cancelAnimationFrame(b);
    };
  }, [set]);

  useFrame(() => {
    const e = scrollPose.explode;
    for (const f of facets) f.mesh.position.copy(f.base).addScaledVector(f.dir, e);
  });

  return <primitive object={root} />;
}
