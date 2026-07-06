"use client";

import { useCallback, useRef, useState } from "react";
import type { FlatlayObjectDef } from "@/data/flatlayObjects";
import type { DebugPos } from "./types";

interface Props {
  obj: FlatlayObjectDef;
  pos: DebugPos;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (id: string, updates: Partial<Omit<DebugPos, "id">>) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function pointerXY(e: MouseEvent | TouchEvent): { x: number; y: number } {
  if ("touches" in e) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
}

function nativeOf(e: React.MouseEvent | React.TouchEvent): MouseEvent | TouchEvent {
  return e.nativeEvent as MouseEvent | TouchEvent;
}

function attachDrag(
  onMove: (e: MouseEvent | TouchEvent) => void,
  onUp: () => void,
): void {
  window.addEventListener("mousemove", onMove, { passive: false });
  window.addEventListener("mouseup", onUp);
  window.addEventListener("touchmove", onMove, { passive: false });
  window.addEventListener("touchend", onUp);
}

function detachDrag(
  onMove: (e: MouseEvent | TouchEvent) => void,
  onUp: () => void,
): void {
  window.removeEventListener("mousemove", onMove);
  window.removeEventListener("mouseup", onUp);
  window.removeEventListener("touchmove", onMove);
  window.removeEventListener("touchend", onUp);
}

export function DebugObject({ obj, pos, isSelected, onSelect, onUpdate, containerRef }: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [imgFailed, setImgFailed] = useState(false);
  const [activeDrag, setActiveDrag] = useState<"move" | "resize" | "rotate" | null>(null);

  // ── MOVE ────────────────────────────────────────────────────────────────────
  const startMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onSelect();

      const container = containerRef.current;
      if (!container) return;
      const cr = container.getBoundingClientRect();

      const { x: x0, y: y0 } = pointerXY(nativeOf(e));
      const top0 = pos.top;
      const left0 = pos.left;
      setActiveDrag("move");

      const onMove = (ev: MouseEvent | TouchEvent) => {
        ev.preventDefault();
        const { x, y } = pointerXY(ev);
        onUpdate(obj.id, {
          top: Math.max(0, top0 + ((y - y0) / cr.height) * 100),
          left: Math.max(0, left0 + ((x - x0) / cr.width) * 100),
        });
      };
      const onUp = () => {
        setActiveDrag(null);
        detachDrag(onMove, onUp);
      };
      attachDrag(onMove, onUp);
    },
    [pos.top, pos.left, obj.id, onSelect, onUpdate, containerRef],
  );

  // ── RESIZE ──────────────────────────────────────────────────────────────────
  const startResize = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const container = containerRef.current;
      if (!container) return;
      const cr = container.getBoundingClientRect();

      const { x: x0 } = pointerXY(nativeOf(e));
      const width0 = pos.width;
      setActiveDrag("resize");

      const onMove = (ev: MouseEvent | TouchEvent) => {
        ev.preventDefault();
        const { x } = pointerXY(ev);
        onUpdate(obj.id, { width: Math.max(2, width0 + ((x - x0) / cr.width) * 100) });
      };
      const onUp = () => {
        setActiveDrag(null);
        detachDrag(onMove, onUp);
      };
      attachDrag(onMove, onUp);
    },
    [pos.width, obj.id, onUpdate, containerRef],
  );

  // ── ROTATE ──────────────────────────────────────────────────────────────────
  const startRotate = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const outer = outerRef.current;
      if (!outer) return;
      const rect = outer.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const { x: mx0, y: my0 } = pointerXY(nativeOf(e));
      const startAngle = Math.atan2(my0 - cy, mx0 - cx);
      const rot0 = pos.rotation;
      setActiveDrag("rotate");

      const onMove = (ev: MouseEvent | TouchEvent) => {
        ev.preventDefault();
        const { x, y } = pointerXY(ev);
        const angle = Math.atan2(y - cy, x - cx);
        const delta = ((angle - startAngle) * 180) / Math.PI;
        onUpdate(obj.id, { rotation: Math.round((rot0 + delta) * 10) / 10 });
      };
      const onUp = () => {
        setActiveDrag(null);
        detachDrag(onMove, onUp);
      };
      attachDrag(onMove, onUp);
    },
    [pos.rotation, obj.id, onUpdate],
  );

  const outline = isSelected
    ? "2px dashed rgba(255,255,255,0.85)"
    : "1px solid rgba(255,255,255,0.18)";

  return (
    <div
      ref={outerRef}
      style={{
        position: "absolute",
        top: `${pos.top}%`,
        left: `${pos.left}%`,
        width: `${pos.width}%`,
        transform: `rotate(${pos.rotation}deg)`,
        zIndex: isSelected ? 200 : 100,
        cursor: activeDrag === "move" ? "grabbing" : "grab",
        outline,
        outlineOffset: 3,
        touchAction: "none",
      }}
      onMouseDown={startMove}
      onTouchStart={startMove}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Image or placeholder */}
      {imgFailed ? (
        <div
          style={{
            width: "100%",
            aspectRatio: obj.placeholder.aspect,
            background: obj.placeholder.color,
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {obj.label}
          </span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={obj.src}
          alt={obj.label}
          draggable={false}
          onError={() => setImgFailed(true)}
          style={{ width: "100%", height: "auto", display: "block", pointerEvents: "none", userSelect: "none" }}
        />
      )}

      {/* ── Rotate handle — yellow circle above top-centre ── */}
      <div
        title="Drag to rotate"
        style={{
          position: "absolute",
          top: -28,
          left: "50%",
          transform: "translateX(-50%)",
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "rgba(255,210,0,0.92)",
          border: "2px solid rgba(0,0,0,0.35)",
          cursor: "crosshair",
          zIndex: 10,
          touchAction: "none",
          boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
        }}
        onMouseDown={startRotate}
        onTouchStart={startRotate}
      />

      {/* ── Resize handle — white square at bottom-right ── */}
      <div
        title="Drag to resize"
        style={{
          position: "absolute",
          bottom: -7,
          right: -7,
          width: 14,
          height: 14,
          background: "rgba(255,255,255,0.92)",
          border: "2px solid rgba(0,0,0,0.35)",
          cursor: "se-resize",
          zIndex: 10,
          touchAction: "none",
          boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
        }}
        onMouseDown={startResize}
        onTouchStart={startResize}
      />
    </div>
  );
}
