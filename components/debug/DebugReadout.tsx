"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DebugPos, ImageState, Preset } from "./types";
import { PRESET_OPTIONS } from "./types";

interface Props {
  positions: DebugPos[];
  imageState: ImageState;
  onImageChange: (updates: Partial<ImageState>) => void;
  preset: Preset;
  onPresetChange: (p: Preset) => void;
}

const fmt = (n: number) => n.toFixed(1);

function buildObjectsTS(positions: DebugPos[], preset: Preset): string {
  const rows = positions
    .map(
      (p) =>
        `  { id: "${p.id}", top: "${fmt(p.top)}%", left: "${fmt(p.left)}%", width: "${fmt(p.width)}%", rotation: ${p.rotation} }`,
    )
    .join(",\n");
  const dims = PRESET_OPTIONS[preset];
  const label = dims ? `${dims.label} (${dims.width}×${dims.height})` : "Desktop (full viewport)";
  return `// Paste updated positions into FLATLAY_OBJECTS in /data/flatlayObjects.ts\n// Preset: ${label}\n[\n${rows}\n]`;
}

function buildSingleTS(p: DebugPos): string {
  return `top: "${fmt(p.top)}%", left: "${fmt(p.left)}%", width: "${fmt(p.width)}%", rotation: ${p.rotation}`;
}

function buildImageTS(img: ImageState): string {
  return `// Paste into FlatlayScene.tsx:\nconst IMG_SCALE = ${img.scale.toFixed(2)};\nconst IMG_X = ${img.x.toFixed(1)};\nconst IMG_Y = ${img.y.toFixed(1)};`;
}

const PANEL_WIDTH = 256;
const PRESETS: Preset[] = ["desktop", "iphone", "ipad"];

export function DebugReadout({ positions, imageState, onImageChange, preset, onPresetChange }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Start off-screen until useEffect sets real coords (avoids SSR flash)
  const [pos, setPos] = useState({ x: -999, y: 12 });
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setPos({ x: window.innerWidth - PANEL_WIDTH - 16, y: 12 });
  }, []);

  const startDrag = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    const onMove = (ev: MouseEvent) => {
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - PANEL_WIDTH - 4, ev.clientX - dragOffset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - 44, ev.clientY - dragOffset.current.y)),
      });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  const copyAll = useCallback(async () => {
    await navigator.clipboard.writeText(buildObjectsTS(positions, preset));
  }, [positions, preset]);

  const copySingle = useCallback(async (p: DebugPos) => {
    await navigator.clipboard.writeText(buildSingleTS(p));
  }, []);

  const copyImage = useCallback(async () => {
    await navigator.clipboard.writeText(buildImageTS(imageState));
  }, [imageState]);

  const sliderStyle: React.CSSProperties = {
    width: "100%",
    accentColor: "#ffd200",
    cursor: "pointer",
    margin: "4px 0 0",
  };

  const labelRowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    color: "#888",
    fontSize: 10,
    marginTop: 8,
  };

  return (
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        top: pos.y,
        left: pos.x,
        width: PANEL_WIDTH,
        maxHeight: collapsed ? "auto" : "calc(100dvh - 24px)",
        overflowY: collapsed ? "hidden" : "auto",
        background: "rgba(10,10,10,0.92)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8,
        zIndex: 9999,
        fontFamily: "ui-monospace, monospace",
        fontSize: 11,
        color: "#888",
        userSelect: "none",
      }}
    >
      {/* ── Draggable header ── */}
      <div
        onMouseDown={startDrag}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          cursor: "grab",
          borderBottom: collapsed ? "none" : "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* drag grip dots */}
          <svg width="10" height="14" viewBox="0 0 10 14" fill="rgba(255,255,255,0.3)" aria-hidden>
            <circle cx="2" cy="2"  r="1.5" /><circle cx="8" cy="2"  r="1.5" />
            <circle cx="2" cy="7"  r="1.5" /><circle cx="8" cy="7"  r="1.5" />
            <circle cx="2" cy="12" r="1.5" /><circle cx="8" cy="12" r="1.5" />
          </svg>
          <span style={{ color: "#fff", fontWeight: 600, fontSize: 12, letterSpacing: "0.04em" }}>
            debug
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {!collapsed && (
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={copyAll}
              style={{
                padding: "3px 8px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 4,
                color: "#ddd",
                fontSize: 10,
                cursor: "pointer",
                letterSpacing: "0.06em",
              }}
            >
              Copy all
            </button>
          )}
          {/* Collapse / expand toggle */}
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "Expand" : "Collapse"}
            style={{
              width: 22,
              height: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 4,
              color: "#888",
              fontSize: 14,
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            {collapsed ? "+" : "−"}
          </button>
        </div>
      </div>

      {/* ── Body (hidden when collapsed) ── */}
      {!collapsed && (
        <div style={{ padding: "10px 14px 14px" }}>
          {/* Viewport presets */}
          <div style={{ paddingBottom: 12, marginBottom: 4, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ color: "#e2e2e2", fontSize: 11, marginBottom: 8 }}>viewport</div>
            <div style={{ display: "flex", gap: 6 }}>
              {PRESETS.map((p) => {
                const dims = PRESET_OPTIONS[p];
                const active = preset === p;
                return (
                  <button
                    key={p}
                    onClick={() => onPresetChange(p)}
                    style={{
                      flex: 1,
                      padding: "5px 0",
                      background: active ? "rgba(255,210,0,0.15)" : "transparent",
                      border: `1px solid ${active ? "rgba(255,210,0,0.6)" : "rgba(255,255,255,0.12)"}`,
                      borderRadius: 4,
                      color: active ? "#ffd200" : "#888",
                      fontSize: 10,
                      cursor: "pointer",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {dims ? dims.label : "Desktop"}
                    {dims && (
                      <div style={{ fontSize: 8, opacity: 0.7, marginTop: 2 }}>
                        {dims.width}×{dims.height}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image controls */}
          <div style={{ paddingBottom: 12, marginBottom: 4, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ color: "#e2e2e2", fontSize: 11 }}>image</span>
              <button
                onClick={copyImage}
                style={{ padding: "2px 7px", background: "transparent", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 3, color: "#888", fontSize: 10, cursor: "pointer" }}
              >
                Copy
              </button>
            </div>

            <div style={labelRowStyle}>
              <span>scale</span>
              <span style={{ color: "#e2e2e2" }}>{imageState.scale.toFixed(2)}×</span>
            </div>
            <input type="range" min={0.8} max={3} step={0.01} value={imageState.scale}
              onChange={(e) => onImageChange({ scale: parseFloat(e.target.value) })} style={sliderStyle} />

            <div style={labelRowStyle}>
              <span>x pos</span>
              <span style={{ color: "#e2e2e2" }}>{imageState.x.toFixed(1)}%</span>
            </div>
            <input type="range" min={0} max={100} step={0.5} value={imageState.x}
              onChange={(e) => onImageChange({ x: parseFloat(e.target.value) })} style={sliderStyle} />

            <div style={labelRowStyle}>
              <span>y pos</span>
              <span style={{ color: "#e2e2e2" }}>{imageState.y.toFixed(1)}%</span>
            </div>
            <input type="range" min={0} max={100} step={0.5} value={imageState.y}
              onChange={(e) => onImageChange({ y: parseFloat(e.target.value) })} style={sliderStyle} />
          </div>

          {/* Per-object rows */}
          {positions.map((pos) => (
            <div key={pos.id} style={{ paddingTop: 8, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ color: "#e2e2e2", fontSize: 11 }}>{pos.id}</span>
                <button
                  onClick={() => copySingle(pos)}
                  style={{ padding: "2px 7px", background: "transparent", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 3, color: "#888", fontSize: 10, cursor: "pointer" }}
                >
                  Copy
                </button>
              </div>
              <div style={{ lineHeight: 1.9 }}>
                <div>
                  top <span style={{ color: "#e2e2e2" }}>{fmt(pos.top)}%</span>
                  {"  "}left <span style={{ color: "#e2e2e2" }}>{fmt(pos.left)}%</span>
                </div>
                <div>
                  width <span style={{ color: "#e2e2e2" }}>{fmt(pos.width)}%</span>
                  {"  "}rot{" "}
                  <span style={{ color: pos.rotation !== 0 ? "#ffd200" : "#e2e2e2" }}>{pos.rotation}°</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
