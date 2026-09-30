import { create } from "zustand";
import type { Quality } from "./capability";

type AppState = {
  /** null until detected on the client. */
  quality: Quality | null;
  reducedMotion: boolean;
  /** 0..1 progress of the 3D assets behind the loader. */
  assetProgress: number;
  /** True once the scene has rendered its first frame (or the static render has loaded). */
  sceneReady: boolean;
  /** True once the intro loader has finished (or was skipped this session). */
  introDone: boolean;
  set: (patch: Partial<Omit<AppState, "set">>) => void;
};

export const useApp = create<AppState>((set) => ({
  quality: null,
  reducedMotion: false,
  assetProgress: 0,
  sceneReady: false,
  introDone: false,
  set: (patch) => set(patch),
}));
