"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { pose, scrollPose } from "@/lib/scene-state";
import { useApp } from "@/lib/app-store";

const target = new THREE.Vector3();
const offset = new THREE.Vector3();
const spherical = new THREE.Spherical();

// The canvas sits behind the page with pointer-events off, so read the pointer from window.
const cursor = { x: 0, y: 0 };

/**
 * Drives the camera and the wolf's transform from the shared pose every frame.
 * Cursor orbit is weighted by pose.cursor, which only Home and About set above zero.
 */
export function Rig({ children }: { children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const reduced = useApp((s) => s.reducedMotion);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cursor.x = (e.clientX / window.innerWidth) * 2 - 1;
      cursor.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const delta = Math.min(dt, 1 / 20);

    // Cursor: eased toward the live pointer, scaled by the route's cursor weight.
    const k = reduced ? 0 : pose.cursor;
    pointer.current.x = THREE.MathUtils.damp(pointer.current.x, cursor.x * k, 2.2, delta);
    pointer.current.y = THREE.MathUtils.damp(pointer.current.y, cursor.y * k, 2.2, delta);

    // Camera: orbit around the look target by a few degrees.
    target.set(pose.lookX, pose.lookY, 0);
    offset.set(pose.camX, pose.camY, pose.camZ + scrollPose.camZ).sub(target);
    spherical.setFromVector3(offset);
    spherical.theta += pointer.current.x * 0.22;
    spherical.phi = THREE.MathUtils.clamp(spherical.phi - pointer.current.y * 0.1, 0.6, 2.5);
    offset.setFromSpherical(spherical);
    camera.position.copy(target).add(offset);
    camera.lookAt(target);

    // Wolf: X is a fraction of the visible half-width at z=0.
    const g = group.current;
    if (!g) return;
    const cam = camera as THREE.PerspectiveCamera;
    const halfH = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * pose.camZ;
    const halfW = halfH * (size.width / size.height);
    // On tall, narrow viewports pull side-placed poses toward center.
    const narrow = size.width / size.height < 0.9 ? 0.35 : 1;

    const sway = reduced ? 0 : pose.sway;
    g.position.set(
      (pose.wolfX + scrollPose.wolfX) * halfW * narrow,
      pose.wolfY + scrollPose.wolfY + Math.sin(t * 0.6) * 0.04 * sway,
      pose.wolfZ + scrollPose.wolfZ
    );
    g.rotation.set(
      pose.rotX + scrollPose.rotX + Math.sin(t * 0.45) * 0.02 * sway,
      pose.rotY + scrollPose.rotY + Math.sin(t * 0.22) * 0.42 * sway,
      0
    );
    g.scale.setScalar(Math.max(0.01, pose.scale + scrollPose.scale));
  });

  return <group ref={group}>{children}</group>;
}
