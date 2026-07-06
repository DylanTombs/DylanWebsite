"use client";

import { useEffect } from "react";
import { motion, useAnimation, useDragControls } from "framer-motion";

interface PanelProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Panel({ onClose, title, children }: PanelProps) {
  const controls = useAnimation();
  const dragControls = useDragControls();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleDragEnd = async (
    _: unknown,
    info: { offset: { y: number }; velocity: { y: number } },
  ) => {
    const dismiss = info.offset.y > 60 || info.velocity.y > 300;
    if (dismiss) {
      // Slide off-screen below, then let the parent smooth-scroll back.
      await controls.start({
        y: typeof window !== "undefined" ? window.innerHeight * 0.55 : 500,
        transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
      });
      onClose();
    } else {
      // Spring back to resting position.
      controls.start({ y: 0, transition: { type: "spring", stiffness: 450, damping: 32 } });
    }
  };

  return (
    <motion.div
      animate={controls}
      drag="y"
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.55 }}
      onDragEnd={handleDragEnd}
      style={{
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
        background: "rgba(8,8,8,0.98)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Drag handle — only this starts the drag */}
      <div
        onPointerDown={(e) => dragControls.start(e)}
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "10px 0 4px",
          cursor: "grab",
          flexShrink: 0,
          touchAction: "none",
        }}
      >
        <div
          style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.22)" }}
        />
      </div>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px 24px 14px",
          flexShrink: 0,
        }}
      >
        <h2 className="font-mono text-sm font-medium tracking-tight text-text-primary">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          className="flex h-7 w-7 items-center justify-center rounded-sm text-text-tertiary transition-colors duration-150 hover:text-text-primary"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M1 1l10 10M11 1L1 11" />
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 32px", touchAction: "pan-y" }}>
        {children}
      </div>
    </motion.div>
  );
}
