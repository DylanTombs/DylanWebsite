"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { Panel } from "./Panel";
import { FlatlayObject } from "./FlatlayObject";
import { ContactPanel } from "./panels/ContactPanel";
import { AboutPanel } from "./panels/AboutPanel";
import { ExperiencePanel } from "./panels/ExperiencePanel";
import { ProjectsPanel } from "./panels/ProjectsPanel";
import { EducationPanel } from "./panels/EducationPanel";
import { AchievementsPanel } from "./panels/AchievementsPanel";
import { SkillsPanel } from "./panels/SkillsPanel";

import { FLATLAY_OBJECTS } from "@/data/flatlayObjects";
import type { FlatlayObjectDef, ObjectPosition, PanelContent } from "@/data/flatlayObjects";
import type { ImageState, Preset } from "./debug/types";
import { PRESET_OPTIONS } from "./debug/types";

const DebugLayer = dynamic(
  () => import("./debug/DebugLayer").then((m) => ({ default: m.DebugLayer })),
  { ssr: false },
);

const FLATLAY_DESKTOP = "/flatlay/Flatlay.png";
const FLATLAY_MOBILE  = "/flatlay/FlatlayPhone.png";

const IMG_SCALE = 1.45;
const IMG_X = 49.5;
const IMG_Y = 100.0;

function getPos(obj: FlatlayObjectDef, isMobile: boolean): ObjectPosition {
  if (isMobile && obj.mobile) return obj.mobile;
  return { top: obj.top, left: obj.left, width: obj.width, rotation: obj.rotation };
}

function renderPanelContent(content: PanelContent | null): React.ReactNode {
  if (!content) return null;
  switch (content.kind) {
    case "contact":      return <ContactPanel {...content} />;
    case "about":        return <AboutPanel {...content} />;
    case "experience":   return <ExperiencePanel {...content} />;
    case "projects":     return <ProjectsPanel {...content} />;
    case "education":    return <EducationPanel {...content} />;
    case "achievements": return <AchievementsPanel {...content} />;
    case "skills":       return <SkillsPanel {...content} />;
  }
}

export function FlatlayScene() {
  const containerRef   = useRef<HTMLDivElement>(null);
  const panelSectionRef = useRef<HTMLDivElement>(null);

  const [isDebug, setIsDebug] = useState(false);
  useEffect(() => {
    setIsDebug(new URLSearchParams(window.location.search).get("debug") === "true");
  }, []);

  const [isPhonePortrait, setIsPhonePortrait] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(orientation: portrait) and (max-width: 768px)");
    setIsPhonePortrait(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsPhonePortrait(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const [debugImage, setDebugImage] = useState<ImageState>({ scale: IMG_SCALE, x: IMG_X, y: IMG_Y });
  const [debugPreset, setDebugPreset] = useState<Preset>("desktop");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openPanelId, setOpenPanelId] = useState<string | null>(null);

  const closePanel = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setOpenPanelId(null), 380);
  };

  const togglePanel = (id: string) => {
    if (openPanelId === id) {
      closePanel();
    } else {
      setOpenPanelId(id);
    }
  };

  // Scroll to panel section when it opens.
  useEffect(() => {
    if (openPanelId && panelSectionRef.current) {
      panelSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [openPanelId]);

  const imgScale = isDebug ? debugImage.scale : IMG_SCALE;
  const imgX     = isDebug ? debugImage.x : IMG_X;
  const imgY     = isDebug ? debugImage.y : IMG_Y;
  const presetDims = isDebug ? PRESET_OPTIONS[debugPreset] : null;
  const flatlaySrc =
    (isDebug && debugPreset === "iphone") || (!isDebug && isPhonePortrait)
      ? FLATLAY_MOBILE
      : FLATLAY_DESKTOP;

  const activeObj = openPanelId
    ? (FLATLAY_OBJECTS.find((o) => o.id === openPanelId && o.panelContent !== null) ?? null)
    : null;

  // ── Debug layout ──────────────────────────────────────────────────────────
  if (isDebug) {
    return (
      <div style={{ width: "100dvw", height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a", overflow: "hidden" }}>
        <div
          ref={containerRef}
          style={{
            position: "relative",
            overflow: "hidden",
            ...(presetDims
              ? { width: presetDims.width, height: presetDims.height, boxShadow: "0 0 0 1px rgba(255,255,255,0.15), 0 8px 48px rgba(0,0,0,0.8)" }
              : { width: "100%", height: "100%" }),
          }}
        >
          <Image src={flatlaySrc} alt="Workspace flat-lay" fill priority sizes="100vw" className="object-cover"
            style={{ objectPosition: `${imgX}% ${imgY}%`, transform: `scale(${imgScale})`, transformOrigin: "center center" }} />
          <DebugLayer
            key={debugPreset}
            objects={FLATLAY_OBJECTS}
            containerRef={containerRef}
            imageState={debugImage}
            onImageChange={(u) => setDebugImage((p) => ({ ...p, ...u }))}
            preset={debugPreset}
            onPresetChange={setDebugPreset}
          />
        </div>
      </div>
    );
  }

  // ── Production layout ─────────────────────────────────────────────────────
  return (
    <>
      {/*
       * Scene — always exactly 100dvh, never resized or dimmed.
       * Clicking an object scrolls the page down to the panel section below.
       */}
      <div
        ref={containerRef}
        style={{ height: "100dvh", position: "relative", overflow: "hidden", background: "#0a0a0a" }}
      >
        <Image
          src={flatlaySrc}
          alt="Workspace flat-lay"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: `${imgX}% ${imgY}%`, transform: `scale(${imgScale})`, transformOrigin: "center center" }}
        />

        {FLATLAY_OBJECTS.map((obj) => {
          const interactive = obj.panelContent !== null;
          const pos = getPos(obj, isPhonePortrait);
          return (
            <FlatlayObject
              key={obj.id}
              id={obj.id}
              src={obj.src}
              top={pos.top}
              left={pos.left}
              width={pos.width}
              rotation={pos.rotation}
              label={obj.label}
              placeholder={obj.placeholder}
              interactive={interactive}
              isActive={interactive && (activeId === obj.id || openPanelId === obj.id)}
              onClick={() => { if (interactive) togglePanel(obj.id); }}
              onActivate={() => { if (interactive) setActiveId(obj.id); }}
              onDeactivate={() => setActiveId(null)}
            />
          );
        })}
      </div>

      {/*
       * Panel section — lives below the scene in normal document flow.
       * No entry animation: the section appears instantly and the smooth
       * scroll is the only transition the user sees.
       * scrollToClose is passed as onClose so X/Escape scroll back to the
       * scene; the scroll listener above removes the panel when scrollY < 60.
       */}
      {activeObj !== null && (
        <div
          ref={panelSectionRef}
          style={{ minHeight: "45dvh", display: "flex", flexDirection: "column", background: "#0a0a0a" }}
        >
          <Panel onClose={closePanel} title={activeObj.panelTitle}>
            {renderPanelContent(activeObj.panelContent)}
          </Panel>
        </div>
      )}
    </>
  );
}
