"use client";

import { useState } from "react";
import type { FlatlayObjectDef } from "@/data/flatlayObjects";
import { DebugObject } from "./DebugObject";
import { DebugReadout } from "./DebugReadout";
import type { DebugPos, ImageState, Preset } from "./types";

export interface DebugLayerProps {
  objects: readonly FlatlayObjectDef[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  imageState: ImageState;
  onImageChange: (updates: Partial<ImageState>) => void;
  preset: Preset;
  onPresetChange: (p: Preset) => void;
}

export function DebugLayer({
  objects,
  containerRef,
  imageState,
  onImageChange,
  preset,
  onPresetChange,
}: DebugLayerProps) {
  const [positions, setPositions] = useState<DebugPos[]>(() =>
    objects.map((obj) => {
      const src = preset === "iphone" && obj.mobile ? obj.mobile : obj;
      return {
        id: obj.id,
        top: parseFloat(src.top),
        left: parseFloat(src.left),
        width: parseFloat(src.width),
        rotation: src.rotation,
      };
    }),
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const update = (id: string, updates: Partial<Omit<DebugPos, "id">>) => {
    setPositions((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  return (
    <>
      {/* Transparent backdrop — click to deselect */}
      <div
        style={{ position: "absolute", inset: 0, zIndex: 50 }}
        onClick={() => setSelectedId(null)}
      />

      {objects.map((obj) => {
        const pos = positions.find((p) => p.id === obj.id);
        if (!pos) return null;
        return (
          <DebugObject
            key={obj.id}
            obj={obj}
            pos={pos}
            isSelected={selectedId === obj.id}
            onSelect={() => setSelectedId(obj.id)}
            onUpdate={update}
            containerRef={containerRef}
          />
        );
      })}

      <DebugReadout
        positions={positions}
        imageState={imageState}
        onImageChange={onImageChange}
        preset={preset}
        onPresetChange={onPresetChange}
      />
    </>
  );
}
