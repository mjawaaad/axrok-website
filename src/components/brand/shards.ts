import geometry from "@/content/logo-geometry.json";
import shardData from "@/content/logo-shards.json";

const [, , W, H] = geometry.viewBox;
const CX = W / 2;
const CY = H / 2;
const MAX_D = Math.hypot(CX, CY);

/** Where each shard starts before assembling: pushed outward from the mark's center with a twist. */
export const shards = shardData.shards.map((s, i) => {
  const dx = s.cx - CX;
  const dy = s.cy - CY;
  const d = Math.hypot(dx, dy) || 1;
  const push = 90 + ((i * 37) % 140);
  return {
    ...s,
    tx: (dx / d) * push,
    ty: (dy / d) * push,
    r: ((i * 53) % 50) - 25,
    /** 0 at the center, 1 at the outer corners: used to stagger from the center out. */
    dist: d / MAX_D,
  };
});

export { geometry };
