"use client";

import { useCallback, useRef, useState } from "react";

export interface FlatlayObjectPlaceholder {
  color: string;
  aspect: string;
}

interface FlatlayObjectProps {
  id: string;
  src: string;
  top: string;
  left: string;
  width: string;
  rotation: number;
  label: string;
  placeholder: FlatlayObjectPlaceholder;
  interactive: boolean; // false = decorative: no hover lift, no cursor, click ignored
  isActive: boolean;
  onClick: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
}

export function FlatlayObject({
  src,
  top,
  left,
  width,
  rotation,
  label,
  placeholder,
  interactive,
  onClick,
  isActive,
  onActivate,
  onDeactivate,
}: FlatlayObjectProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  // Pre-rendered offscreen canvas for pixel-accurate hit detection.
  // Populated once the image loads — getImageData then reads alpha at click point.
  const hitCanvas = useRef<HTMLCanvasElement | null>(null);
  // Falls back to a coloured placeholder rectangle when the PNG is missing
  const [imgFailed, setImgFailed] = useState(false);

  const handleLoad = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext("2d")!.drawImage(img, 0, 0);
    hitCanvas.current = canvas;
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const img = imgRef.current;
      const canvas = hitCanvas.current;

      // Fall through to onClick if canvas isn't ready (image not yet loaded)
      if (!img || !canvas) {
        onClick();
        return;
      }

      const rect = img.getBoundingClientRect();
      const x = Math.round((e.clientX - rect.left) * (img.naturalWidth / rect.width));
      const y = Math.round((e.clientY - rect.top) * (img.naturalHeight / rect.height));

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        onClick();
        return;
      }

      const [, , , alpha] = ctx.getImageData(x, y, 1, 1).data;
      // Only fire if the clicked pixel is opaque — transparent areas are dead zones
      if (alpha > 10) onClick();
    },
    [onClick],
  );

  return (
    <button
      type="button"
      aria-label={label}
      onPointerEnter={onActivate}
      onPointerLeave={onDeactivate}
      onClick={handleClick}
      style={{
        position: "absolute",
        top,
        left,
        width,
        zIndex: isActive ? 30 : 20,
        // translateY first (screen-space lift), then rotate (local orientation)
        transform: `translateY(${interactive && isActive ? "-4px" : "0"}) rotate(${rotation}deg)`,
        filter:
          interactive && isActive
            ? "drop-shadow(0 6px 20px rgba(0,200,255,0.22)) drop-shadow(0 2px 10px rgba(0,0,0,0.5))"
            : "none",
        transition: "transform 400ms ease-out, filter 500ms ease-out",
        cursor: interactive ? "pointer" : "default",
        background: "none",
        border: "none",
        padding: 0,
        // Kill the tap flash on iOS
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {imgFailed ? (
        // Coloured placeholder — same bounding box as the real PNG, fully clickable.
        // Drop in the real PNG and next.js hot-reload swaps it with zero code changes.
        <div
          style={{
            width: "100%",
            aspectRatio: placeholder.aspect,
            background: placeholder.color,
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
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
        </div>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          ref={imgRef}
          src={src}
          alt={label}
          crossOrigin="anonymous"
          onLoad={handleLoad}
          onError={() => setImgFailed(true)}
          draggable={false}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            // Prevent the <img> itself from receiving pointer events —
            // all events are handled by the parent <button>
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      )}
    </button>
  );
}
