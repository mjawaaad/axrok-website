import { create } from "zustand";
import type { Quality } from "./capability";

type AppState = {
  /** null until detected on the client. "high" gets the WebGL wolf story; "static" the light version. */
  quality: Quality | null;
  reducedMotion: boolean;
  /** 0..1 progress of the Home story's assets behind the loader. */
  assetProgress: number;
  /** True once the Home story has its first frame (or its still) on screen. */
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
