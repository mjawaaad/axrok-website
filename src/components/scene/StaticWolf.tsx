"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useApp } from "@/lib/app-store";
import { routeKeyFor, type RouteKey } from "@/lib/scene-state";
import front from "@/assets/renders/amarok-front.webp";
import turned from "@/assets/renders/amarok-turned.webp";

// Placement mirrors each route's 3D pose. Phones stack content over the image, so it sits higher
// and quieter there; the page also dims it once the visitor scrolls (see SceneRoot).
// `tone` sets per-breakpoint opacity: quieter on phones where text sits over the image.
const PLACEMENT: Record<RouteKey, { src: typeof front; className: string; tone: string }> = {
  home: {
    src: front,
    className: "left-1/2 top-[9vh] w-[min(92vw,62vh)] -translate-x-1/2",
    tone: "opacity-100",
  },
  services: {
    src: turned,
    className: "right-[-14vw] top-[10vh] w-[70vw] md:right-[4vw] md:top-[16vh] md:w-[min(40vw,58vh)]",
    tone: "opacity-40 md:opacity-60",
  },
  about: {
    src: front,
    className: "left-1/2 top-[8vh] w-[min(80vw,52vh)] -translate-x-1/2 md:left-[6vw] md:top-[14vh] md:w-[min(42vw,60vh)] md:translate-x-0",
    tone: "opacity-35 md:opacity-90",
  },
  contact: {
    src: front,
    className: "right-[-8vw] top-[9vh] w-[56vw] md:right-[6vw] md:top-[12vh] md:w-[min(32vw,48vh)]",
    tone: "opacity-60 md:opacity-80",
  },
};

// Feathers the still's edges into the page so the render's background never shows as a box.
const FEATHER = { maskImage: "radial-gradient(closest-side, #000 72%, transparent)", WebkitMaskImage: "radial-gradient(closest-side, #000 72%, transparent)" };

/**
 * Static fallback for phones, low-power devices and browsers without usable WebGL:
 * a pre-rendered still of the same Amarok in the same lighting (scripts/render-stills.mjs).
 */
export function StaticWolf() {
  const pathname = usePathname();
  const key = routeKeyFor(pathname);
  const place = PLACEMENT[key];
  const reduced = useReducedMotion();
  const set = useApp((s) => s.set);

  useEffect(() => set({ assetProgress: 1 }), [set]);

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={key}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute ${place.className}`}
      >
        <motion.div
          animate={reduced ? undefined : { y: [0, -8, 0] }}
          transition={reduced ? undefined : { duration: 7, ease: "easeInOut", repeat: Infinity }}
          className={place.tone}
          style={FEATHER}
        >
          <Image
            src={place.src}
            alt="The Axrok Amarok: a precision-cut cobalt wolf emblem"
            sizes="(max-width: 768px) 92vw, 60vh"
            priority={key === "home"}
            placeholder="empty"
            onLoad={() => set({ sceneReady: true })}
            className="h-auto w-full select-none"
            draggable={false}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
