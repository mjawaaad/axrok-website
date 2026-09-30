"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";
import { pose, scrollPose } from "@/lib/scene-state";

/**
 * Dark studio. Metal reads almost entirely through reflections, so the environment is a
 * hand-built light rig: two hard cobalt strips behind the subject (rims), a narrow cool
 * top strip (key), all against void navy. Direct lights add hot rim edges for the bloom.
 */
export function Lights() {
  const rimL = useRef<THREE.SpotLight>(null);
  const rimR = useRef<THREE.SpotLight>(null);
  const key = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.HemisphereLight>(null);

  useFrame(({ scene }) => {
    const dim = 1 - scrollPose.dim;
    if (rimL.current) rimL.current.intensity = 42 * pose.rim * dim;
    if (rimR.current) rimR.current.intensity = 26 * pose.rim * dim;
    if (key.current) key.current.intensity = 1.8 * pose.key * dim;
    if (fill.current) fill.current.intensity = (0.25 + 1.2 * pose.fill) * dim;
    // Environment carries the metal; fade it with the route's lighting state.
    scene.environmentIntensity = (0.3 + 0.4 * pose.rim + 0.7 * pose.key + 1.0 * pose.fill) * dim;
  });

  return (
    <>
      <spotLight ref={rimL} color="#3d58ff" position={[-5, 3.5, -4]} angle={0.5} penumbra={0.3} decay={2} />
      <spotLight ref={rimR} color="#2c46ff" position={[5.5, -1.5, -3.5]} angle={0.5} penumbra={0.35} decay={2} />
      <directionalLight ref={key} color="#e3e7ff" position={[2.5, 4, 6]} />
      <hemisphereLight ref={fill} color="#7d8fff" groundColor="#0b0139" />

      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#05001c"]} />
        {/* Rims: tall hard strips behind and to the sides. */}
        <Lightformer form="rect" color="#3350ff" intensity={4} position={[-4.5, 1, -3]} rotation={[0, Math.PI / 3, 0]} scale={[0.6, 9, 1]} />
        <Lightformer form="rect" color="#2440ff" intensity={3.5} position={[4.5, -0.5, -2.5]} rotation={[0, -Math.PI / 3, 0]} scale={[0.5, 8, 1]} />
        {/* Front softboxes: metal only shows color where it has something to reflect. */}
        <Lightformer form="rect" color="#3552ff" intensity={1.3} position={[-4, 1.5, 5]} rotation={[0, -Math.PI / 5, 0]} scale={[6, 8, 1]} />
        <Lightformer form="rect" color="#2743ff" intensity={1.0} position={[4.5, -0.5, 5]} rotation={[0, Math.PI / 5, 0]} scale={[6, 8, 1]} />
        {/* A thin bright strip: the specular line that sweeps across facets as the wolf turns. */}
        <Lightformer form="rect" color="#e6eaff" intensity={2.2} position={[2.6, 0.5, 4.5]} rotation={[0, Math.PI / 8, 0]} scale={[0.18, 7, 1]} />
        {/* Key: a narrow cool strip overhead, slightly forward. */}
        <Lightformer form="rect" color="#dfe5ff" intensity={1.1} position={[0.5, 5, 2.5]} rotation={[Math.PI / 2.4, 0, 0]} scale={[7, 0.5, 1]} />
      </Environment>
    </>
  );
}
