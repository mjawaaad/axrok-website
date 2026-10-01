"use client";

import { useProgress, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useApp } from "@/lib/app-store";
import { EYES_MID, WOLF, WOLF_TEXTURES, story } from "./story-state";

const PLANE_H = 2;
const PLANE_W = PLANE_H * WOLF.aspect;
const FOV = 35;

const hex = (h: string) => new THREE.Color(h);
const stops = WOLF.grade.stops.map(([t, c]) => ({ t: t as number, c: hex(c as string) }));

const vertexShader = /* glsl */ `
  uniform sampler2D uDepth;
  uniform float uDisplace;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    p.z += texture2D(uDepth, uv).r * uDisplace;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

// Same gradient map as scripts/prepare-wolf.mjs, so the live scene and the stills match.
const fragmentShader = /* glsl */ `
  precision highp float;
  uniform sampler2D uLuma;
  uniform sampler2D uDepth;
  uniform vec3 uStopC[5];
  uniform float uStopT[5];
  uniform float uCrush, uClip, uGamma, uExposure;
  uniform float uRim, uEyes, uFade, uTime, uAspect;
  uniform vec2 uEye0, uEye1, uFocus, uTexel;
  varying vec2 vUv;

  vec3 gradientMap(float l) {
    vec3 c = uStopC[0];
    for (int i = 0; i < 4; i++) {
      float f = clamp((l - uStopT[i]) / (uStopT[i + 1] - uStopT[i]), 0.0, 1.0);
      c = l > uStopT[i] ? mix(uStopC[i], uStopC[i + 1], f) : c;
    }
    return c;
  }
  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

  void main() {
    float l = texture2D(uLuma, vUv).r * uExposure;
    l = clamp((l - uCrush) / (uClip - uCrush), 0.0, 1.0);
    l = pow(l, uGamma);
    vec3 col = gradientMap(l);

    // Cobalt rim light: bright where depth changes sharply on the near (wolf) side.
    float d = texture2D(uDepth, vUv).r;
    vec2 o = uTexel * 3.0;
    float gx = texture2D(uDepth, vUv + vec2(o.x, 0.0)).r - texture2D(uDepth, vUv - vec2(o.x, 0.0)).r;
    float gy = texture2D(uDepth, vUv + vec2(0.0, o.y)).r - texture2D(uDepth, vUv - vec2(0.0, o.y)).r;
    float edge = smoothstep(0.015, 0.09, length(vec2(gx, gy))) * smoothstep(0.38, 0.62, d);
    col += vec3(0.16, 0.26, 1.0) * edge * uRim * (0.55 + 0.6 * l);

    // Eye glints: a hard core and a soft cobalt halo.
    vec2 a = vec2(uAspect, 1.0);
    float e0 = distance(vUv * a, uEye0 * a);
    float e1 = distance(vUv * a, uEye1 * a);
    // Catchlights, not glowing orbs: a small hard core and a tight cobalt halo.
    float core = exp(-pow(e0 / 0.0024, 2.0)) + exp(-pow(e1 / 0.0024, 2.0));
    float halo = exp(-pow(e0 / 0.0085, 2.0)) + exp(-pow(e1 / 0.0085, 2.0));
    col += (vec3(0.85, 0.89, 1.0) * core * 1.15 + vec3(0.12, 0.22, 1.0) * halo * 0.45) * uEyes;

    // Night falloff around the subject, then the fade to void navy.
    float v = smoothstep(1.05, 0.25, distance(vUv * a, uFocus * a));
    col *= mix(0.35, 1.0, v);
    col = mix(col, vec3(0.043, 0.004, 0.224), uFade);

    // Very light animated grain.
    col += (hash(vUv * 1024.0 + uTime) - 0.5) * 0.03;
    gl_FragColor = vec4(col, 1.0);
  }
`;

// Data textures: sampled as raw values, never colour-converted.
const prepareTextures = (textures: THREE.Texture | THREE.Texture[]) => {
  for (const t of Array.isArray(textures) ? textures : [textures]) {
    t.colorSpace = THREE.NoColorSpace;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.anisotropy = 4;
    t.needsUpdate = true;
  }
};

function WolfPlane({ hi, onReady }: { hi: boolean; onReady?: () => void }) {
  const [luma, depth] = useTexture([WOLF_TEXTURES.luma(hi), WOLF_TEXTURES.depth], prepareTextures);
  const set = useApp((s) => s.set);
  const mesh = useRef<THREE.Mesh>(null);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uLuma: { value: luma },
        uDepth: { value: depth },
        uDisplace: { value: story.displace },
        uStopC: { value: stops.map((s) => s.c) },
        uStopT: { value: stops.map((s) => s.t) },
        uCrush: { value: WOLF.grade.shadowCrush },
        uClip: { value: WOLF.grade.highlightClip },
        uGamma: { value: WOLF.grade.gamma },
        uExposure: { value: story.exposure },
        uRim: { value: 0 },
        uEyes: { value: 0 },
        uFade: { value: 0 },
        uTime: { value: 0 },
        uAspect: { value: WOLF.aspect },
        uEye0: { value: new THREE.Vector2(...WOLF.eyes[0]) },
        uEye1: { value: new THREE.Vector2(...WOLF.eyes[1]) },
        uFocus: { value: new THREE.Vector2(...WOLF.body) },
        uTexel: { value: new THREE.Vector2(1 / 1024, 1 / 683) },
      },
    });
  }, [luma, depth]);

  // Two frames after mount the wolf is on screen: tell the loader and the cross-fade.
  useEffect(() => {
    set({ assetProgress: 1 });
    let a = 0;
    let b = 0;
    a = requestAnimationFrame(
      () =>
        (b = requestAnimationFrame(() => {
          set({ sceneReady: true });
          onReady?.();
        }))
    );
    return () => {
      cancelAnimationFrame(a);
      cancelAnimationFrame(b);
    };
  }, [set, onReady]);

  useFrame(({ camera, clock, size }) => {
    if (!mesh.current) return;
    const u = (mesh.current.material as THREE.ShaderMaterial).uniforms;
    const t = clock.elapsedTime;
    u.uTime.value = t % 100;
    u.uExposure.value = story.exposure * story.reveal;
    u.uDisplace.value = story.displace;
    u.uRim.value = story.rim;
    u.uEyes.value = story.eyes * (0.92 + 0.08 * Math.sin(t * 2.1));
    u.uFade.value = story.fade;

    // Frame like CSS object-fit: cover, then move closer with story.zoom.
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const vpAspect = size.width / size.height;
    const dCover = Math.min(PLANE_H / (2 * tanHalf), PLANE_W / (2 * tanHalf * vpAspect)) * 0.94;
    const dist = dCover / Math.max(1, story.zoom);
    const visH = 2 * dist * tanHalf;
    const visW = visH * vpAspect;

    // Focus slides from the wolf's body to its eyes; clamp so the frame never leaves the photo.
    const fx = THREE.MathUtils.lerp(WOLF.body[0], EYES_MID[0], story.focus);
    const fy = THREE.MathUtils.lerp(WOLF.body[1], EYES_MID[1], story.focus);
    u.uFocus.value.set(fx, fy);
    const mx = Math.max(0, PLANE_W / 2 - visW / 2);
    const my = Math.max(0, PLANE_H / 2 - visH / 2);
    // A slow idle drift keeps the parallax alive between scrolls.
    const driftX = Math.sin(t * 0.21) * 0.012 * story.zoom;
    const driftY = Math.cos(t * 0.17) * 0.008 * story.zoom;
    const tx = THREE.MathUtils.clamp((fx - 0.5) * PLANE_W + driftX, -mx, mx);
    const ty = THREE.MathUtils.clamp((fy - 0.5) * PLANE_H + driftY, -my, my);

    camera.position.set(tx + Math.sin(story.yaw) * dist, ty, Math.cos(story.yaw) * dist + story.displace * 0.5);
    camera.lookAt(tx, ty, story.displace * 0.5);
  });

  return (
    <mesh ref={mesh} material={material}>
      <planeGeometry args={[PLANE_W, PLANE_H, 320, Math.round(320 / WOLF.aspect)]} />
    </mesh>
  );
}

function Progress() {
  const { progress } = useProgress();
  const set = useApp((s) => s.set);
  useEffect(() => {
    if (!useApp.getState().sceneReady) set({ assetProgress: Math.min(0.95, progress / 100) });
  }, [progress, set]);
  return null;
}

/** The depth-displaced, colour-graded wolf. Rendering pauses whenever the story is off screen. */
export default function WolfCanvas({ active, onReady }: { active: boolean; onReady?: () => void }) {
  // The camera closes in on the eyes, so any desktop-sized screen needs the full-resolution texture.
  const hi = typeof window !== "undefined" && window.innerWidth >= 900;
  return (
    <>
      <Progress />
      <Canvas
        dpr={[1, 1.75]}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance", stencil: false, depth: true }}
        camera={{ fov: FOV, near: 0.05, far: 50, position: [0, 0, 4] }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NoToneMapping;
        }}
      >
        <color attach="background" args={["#020009"]} />
        <Suspense fallback={null}>
          <WolfPlane hi={hi} onReady={onReady} />
        </Suspense>
      </Canvas>
    </>
  );
}
