"use client";

import { motion, MotionConfig, useReducedMotion } from "framer-motion";

import { meta } from "@/data/cv";
import { motion as motionConfig } from "@/lib/tokens";

// ── Sub-components ────────────────────────────────────────────────────────────

function TerminalCursor() {
  return (
    <span
      aria-hidden="true"
      className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[1px] animate-blink bg-accent align-middle"
    />
  );
}

function StatusBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border-dim bg-bg-surface px-3 py-1.5">
      {/* Pulsing "online" indicator */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-success opacity-50" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-status-success" />
      </span>
      <span className="font-mono text-xs tracking-wide text-text-secondary">
        Open to 2026 SWE internships &amp; grad roles
      </span>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  );
}

function ScrollCue({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.5, ease: "easeOut" }}
      aria-hidden="true"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
        scroll
      </span>
      <motion.div
        className="h-9 w-px origin-top bg-gradient-to-b from-text-tertiary/60 to-transparent"
        animate={reduced ? {} : { scaleY: [1, 0.45, 1], opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

// ── Motion variants ───────────────────────────────────────────────────────────

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: motionConfig.stagger },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: motionConfig.easeOut,
  },
};

// ── Hero ──────────────────────────────────────────────────────────────────────

export function Hero() {
  const reduced = useReducedMotion() ?? false;

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="hero"
        className="relative flex min-h-dvh flex-col justify-center overflow-hidden"
      >
        {/* ── Ambient layers ── */}

        {/* Fine-line coordinate grid */}
        <div aria-hidden="true" className="grid-overlay absolute inset-0 opacity-[0.32]" />

        {/*
         * Radial bloom: a faint cone of cyan light that falls from above the
         * name. It locates the hierarchy without moving. The restraint is
         * intentional — the bloom disappears completely at the fold.
         */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_45%_at_50%_-5%,rgba(0,200,255,0.08),transparent_70%)]"
        />

        {/* Hard vignette to kill grid at edges */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_55%,rgba(8,11,15,0.85)_100%)]"
        />

        {/* ── Content ── */}
        <div className="relative z-10 mx-auto w-full max-w-container px-6 pb-24 pt-28 lg:px-12">
          <motion.div
            className="flex max-w-3xl flex-col gap-7"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {/* Status */}
            <motion.div variants={item}>
              <StatusBadge />
            </motion.div>

            {/* Name block */}
            <motion.div variants={item} className="flex flex-col gap-1.5">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-tertiary">
                CS + Mathematics · University of Bath
              </p>
              <h1
                className="text-5xl font-bold leading-[1.04] tracking-[-0.025em] text-text-primary sm:text-6xl lg:text-[5.25rem] xl:text-[5.75rem]"
                /*
                 * No gradient, no glow, no chromatic tricks.
                 * Scale and weight alone carry the name.
                 */
              >
                Dylan Tombs
              </h1>
            </motion.div>

            {/* Descriptor */}
            <motion.p
              variants={item}
              className="max-w-[56ch] text-lg leading-relaxed text-text-secondary lg:text-xl"
            >
              Distributed systems, ML inference engines, and the{" "}
              <span className="text-text-primary">production-grade engineering detail</span> that
              makes software reliable at scale. Building toward SWE roles at top-tier companies.
              <TerminalCursor />
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-wrap items-center gap-3 pt-1">
              {/* Primary — scroll anchor */}
              <a
                href="#projects"
                className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-text-inverse transition-all duration-200 hover:bg-accent/85 hover:shadow-accent-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
              >
                <ArrowDownIcon />
                View Projects
              </a>

              {/* Secondary — external */}
              <a
                href={meta.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border-default bg-bg-surface px-5 py-2.5 text-sm font-medium text-text-primary transition-all duration-200 hover:border-border-bright hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
              >
                <GitHubIcon />
                GitHub
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <ScrollCue reduced={reduced} />
      </section>
    </MotionConfig>
  );
}
