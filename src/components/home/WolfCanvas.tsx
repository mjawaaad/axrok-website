"use client";

import { useProgress, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useApp } from "@/lib/app-store";
import { WOLF, WOLF_TEXTURES, story } from "./story-state";
import { frameAt } from "./zoom";

const stops = WOLF.grade.stops.map(([t, c]) => ({ t: t as number, c: new THREE.Color(c as string) }));

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Composites the three frames in luminance (so the grade is seamless across hand-offs), then
// grades with the same gradient map as scripts/prepare-wolf.mjs.
const fragmentShader = /* glsl */ `
  precision highp float;
  uniform sampler2D uTex0, uTex1, uTex2;
  uniform sampler2D uDep0, uDep1, uDep2;
  uniform vec4 uRect0, uRect1, uRect2;     // x, y, w, h in CSS px, top-left origin
  uniform vec2 uLayer1, uLayer2;           // alpha, feather
  uniform float uBase;
  uniform vec2 uRes, uAnchor, uPar;
  uniform vec3 uStopC[5];
  uniform float uStopT[5];
  uniform float uCrush, uClip, uShoulder, uGamma, uExposure;
  uniform float uRim, uEyes, uFade, uTime;
  uniform vec3 uEye0, uEye1;               // x, y, radius in CSS px
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

  // Samples one frame: luminance, depth and a rim term; returns the frame's coverage in .w.
  vec4 layer(sampler2D tex, sampler2D dep, vec4 rect, float feather, vec2 p) {
    vec2 uv = (p - rect.xy) / rect.zw;
    float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
    float m = inside;
    if (feather > 0.0) {
      m *= smoothstep(0.0, feather, uv.x) * smoothstep(0.0, feather, 1.0 - uv.x);
      m *= smoothstep(0.0, feather, uv.y) * smoothstep(0.0, feather, 1.0 - uv.y);
    }
    vec2 tc = vec2(uv.x, 1.0 - uv.y);
    float d = texture2D(dep, tc).r;
    tc = clamp(tc + (d - 0.5) * uPar, 0.0, 1.0);
    float l = texture2D(tex, tc).r;
    vec2 o = vec2(2.5 / 1024.0, 2.5 / 576.0);
    float gx = texture2D(dep, tc + vec2(o.x, 0.0)).r - texture2D(dep, tc - vec2(o.x, 0.0)).r;
    float gy = texture2D(dep, tc + vec2(0.0, o.y)).r - texture2D(dep, tc - vec2(0.0, o.y)).r;
    float rim = smoothstep(0.02, 0.1, length(vec2(gx, gy))) * smoothstep(0.35, 0.65, d) * l;
    return vec4(l, rim, d, m);
  }

  void main() {
    vec2 p = vec2(vUv.x, 1.0 - vUv.y) * uRes;
    float l = 0.0;
    float rim = 0.0;
    if (uBase < 0.5) {
      vec4 a = layer(uTex0, uDep0, uRect0, 0.0, p);
      l = a.x; rim = a.y;
    }
    if (uBase < 1.5 && uLayer1.x > 0.0) {
      vec4 b = layer(uTex1, uDep1, uRect1, uLayer1.y, p);
      float k = uLayer1.x * b.w;
      l = mix(l, b.x, k); rim = mix(rim, b.y, k);
    }
    if (uLayer2.x > 0.0) {
      vec4 c = layer(uTex2, uDep2, uRect2, uLayer2.y, p);
      float k = uLayer2.x * c.w;
      l = mix(l, c.x, k); rim = mix(rim, c.y, k);
    }

    l = max((l * uExposure - uCrush) / (uClip - uCrush), 0.0);
    if (l > uShoulder) l = uShoulder + (1.0 - uShoulder) * (1.0 - exp(-(l - uShoulder) / (1.0 - uShoulder)));
    l = pow(l, uGamma);
    vec3 col = gradientMap(l);
    col += vec3(0.16, 0.26, 1.0) * rim * uRim * 0.9;

    // Catchlights in the closest frame's eyes: a small hard core and a tight cobalt halo.
    float e0 = distance(p, uEye0.xy) / uEye0.z;
    float e1 = distance(p, uEye1.xy) / uEye1.z;
    float core = exp(-pow(e0 / 0.22, 2.0)) + exp(-pow(e1 / 0.22, 2.0));
    float halo = exp(-pow(e0 * 0.9, 2.0)) + exp(-pow(e1 * 0.9, 2.0));
    col += (vec3(0.85, 0.89, 1.0) * core * 0.9 + vec3(0.12, 0.22, 1.0) * halo * 0.35) * uEyes;

    // Night falloff around the wolf, then the fade to void navy. (smoothstep edges must ascend:
    // reversed edges are undefined in GLSL and return 0 on Direct3D, which darkened everything.)
    float v = 1.0 - smoothstep(0.2, 1.25, distance(p, uAnchor) / max(uRes.x, uRes.y) * 1.6);
    col *= mix(0.4, 1.0, v);
    col = mix(col, vec3(0.043, 0.004, 0.224), uFade);

    col += (hash(vUv * 1024.0 + uTime) - 0.5) * 0.03;
    gl_FragColor = vec4(col, 1.0);
  }
`;

const prepareTextures = (textures: THREE.Texture | THREE.Texture[]) => {
  for (const t of Array.isArray(textures) ? textures : [textures]) {
    t.colorSpace = THREE.NoColorSpace;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.anisotropy = 4;
    t.needsUpdate = true;
  }
};

function WolfFrames({ onReady }: { onReady?: () => void }) {
  const textures = useTexture([...WOLF_TEXTURES.frames, ...WOLF_TEXTURES.depths], prepareTextures);
  const set = useApp((s) => s.set);
  const mesh = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTex0: { value: textures[0] },
          uTex1: { value: textures[1] },
          uTex2: { value: textures[2] },
          uDep0: { value: textures[3] },
          uDep1: { value: textures[4] },
          uDep2: { value: textures[5] },
          uRect0: { value: new THREE.Vector4() },
          uRect1: { value: new THREE.Vector4() },
          uRect2: { value: new THREE.Vector4() },
          uLayer1: { value: new THREE.Vector2() },
          uLayer2: { value: new THREE.Vector2() },
          uBase: { value: 0 },
          uRes: { value: new THREE.Vector2(1, 1) },
          uAnchor: { value: new THREE.Vector2() },
          uPar: { value: new THREE.Vector2() },
          uStopC: { value: stops.map((s) => s.c) },
          uStopT: { value: stops.map((s) => s.t) },
          uCrush: { value: WOLF.grade.shadowCrush },
          uClip: { value: WOLF.grade.highlightClip },
          uShoulder: { value: WOLF.grade.shoulder },
          uGamma: { value: WOLF.grade.gamma },
          uExposure: { value: 0 },
          uRim: { value: 0 },
          uEyes: { value: 0 },
          uFade: { value: 0 },
          uTime: { value: 0 },
          uEye0: { value: new THREE.Vector3() },
          uEye1: { value: new THREE.Vector3() },
        },
      }),
    [textures]
  );

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

  useFrame(({ clock, size }) => {
    if (!mesh.current) return;
    const u = (mesh.current.material as THREE.ShaderMaterial).uniforms;
    const t = clock.elapsedTime;
    const f = frameAt(story.lz, size.width, size.height);
    const [l0, l1, l2] = f.layers;
    u.uRect0.value.set(l0.x, l0.y, l0.w, l0.h);
    u.uRect1.value.set(l1.x, l1.y, l1.w, l1.h);
    u.uRect2.value.set(l2.x, l2.y, l2.w, l2.h);
    u.uLayer1.value.set(l1.visible ? l1.alpha : 0, l1.feather);
    u.uLayer2.value.set(l2.visible ? l2.alpha : 0, l2.feather);
    u.uBase.value = f.base;
    u.uRes.value.set(size.width, size.height);
    u.uAnchor.value.set(f.anchor[0], f.anchor[1]);
    // A slow drift through the depth map keeps the frame alive between scrolls.
    u.uPar.value.set(Math.sin(t * 0.23) * story.parallax, Math.cos(t * 0.19) * story.parallax * 0.6);
    u.uTime.value = t % 100;
    u.uExposure.value = story.exposure * story.reveal;
    u.uRim.value = story.rim;
    u.uEyes.value = story.eyes * (0.92 + 0.08 * Math.sin(t * 2.1));
    u.uFade.value = story.fade;
    const radius = l2.w * 0.012;
    u.uEye0.value.set(l2.x + WOLF.eyes[0][0] * l2.w, l2.y + WOLF.eyes[0][1] * l2.h, radius);
    u.uEye1.value.set(l2.x + WOLF.eyes[1][0] * l2.w, l2.y + WOLF.eyes[1][1] * l2.h, radius);
  });

  return (
    <mesh ref={mesh} material={material} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
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

/** The three-frame push-in, graded live. Rendering pauses whenever the story is off screen. */
export default function WolfCanvas({ active, onReady }: { active: boolean; onReady?: () => void }) {
  return (
    <>
      <Progress />
      <Canvas
        dpr={[1, 1.75]}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance", stencil: false, depth: false }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NoToneMapping;
        }}
      >
        <Suspense fallback={null}>
          <WolfFrames onReady={onReady} />
        </Suspense>
      </Canvas>
    </>
  );
}
