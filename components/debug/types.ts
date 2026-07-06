export interface DebugPos {
  id: string;
  top: number; // % of container height
  left: number; // % of container width
  width: number; // % of container width
  rotation: number; // degrees
}

export interface ImageState {
  scale: number; // 1.0 = natural object-cover
  x: number; // objectPosition X (0–100)
  y: number; // objectPosition Y (0–100)
}

export type Preset = "desktop" | "iphone" | "ipad";

export interface PresetDims {
  label: string;
  width: number;
  height: number;
}

// null = fill the real viewport (desktop behaviour)
export const PRESET_OPTIONS: Record<Preset, PresetDims | null> = {
  desktop: null,
  iphone: { label: "iPhone", width: 390, height: 844 },
  ipad: { label: "iPad", width: 820, height: 1180 },
};
