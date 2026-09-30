"use client";

import { PerformanceMonitor, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import { Rig } from "./Rig";
import { Lights } from "./Lights";
import { Effects } from "./Effects";
import { Wolf } from "./Wolf";
import { useApp } from "@/lib/app-store";
import { stillMode } from "@/lib/scene-state";

/** Mirrors three's loading manager into the app store for the intro's percentage. */
function ProgressBridge() {
  const { progress } = useProgress();
  const set = useApp((s) => s.set);
  useEffect(() => {
    if (!useApp.getState().sceneReady) set({ assetProgress: Math.min(0.95, progress / 100) });
  }, [progress, set]);
  return null;
}

export default function SceneCanvas() {
  const [dpr, setDpr] = useState(1.5);
  const [lite, setLite] = useState(false);
  // Debug switch: ?fx=0 renders without the post stack; ?fx=bloom,tone limits it to those effects.
  const [fx] = useState(() => new URLSearchParams(window.location.search).get("fx"));
  const [still] = useState(() => stillMode());
  return (
    <>
      <ProgressBridge />
      <Canvas
        dpr={dpr}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: false, stencil: false }}
        camera={{ fov: 28, near: 0.1, far: 80, position: [0, 0, 13.5] }}
        onCreated={({ gl }) => {
          // Tone mapping happens in the post stack (ToneMapping effect).
          gl.toneMapping = THREE.NoToneMapping;
        }}
      >
        <PerformanceMonitor
          onIncline={() => setDpr(Math.min(1.75, window.devicePixelRatio))}
          onDecline={() => {
            setDpr(1);
            setLite(true);
          }}
          flipflops={3}
          onFallback={() => {
            setDpr(1);
            setLite(true);
          }}
        />
        <color attach="background" args={["#0b0139"]} />
        <fog attach="fog" args={["#0b0139", 11, 24]} />
        <Lights />
        <Suspense fallback={null}>
          <Rig>
            <Wolf />
          </Rig>
        </Suspense>
        {fx !== "0" && (
          <Effects
            lite={lite}
            // Stills: no vignette (edges must match the page ground) and no grain (compresses badly).
            only={still ? ["bloom", "tone"] : fx ? (fx.split(",") as Parameters<typeof Effects>[0]["only"]) : undefined}
          />
        )}
      </Canvas>
    </>
  );
}
