"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Re-mounts on every navigation: page content fades in while the 3D camera carries the transition.
 * Opacity only. A transform here would break ScrollTrigger pinning inside the page.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0.3 : 0.8, ease: [0.16, 1, 0.3, 1], delay: reduced ? 0 : 0.2 }}
    >
      {children}
    </motion.div>
  );
}
