"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

import type { DateRange, Experience as ExperienceEntry } from "@/data/cv";
import { experience } from "@/data/cv";
import { motion as motionConfig } from "@/lib/tokens";
import { cn } from "@/lib/utils";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDateRange(period: DateRange): string {
  return period.current ? `${period.start} – Present` : `${period.start} – ${period.end}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function KindBadge({ kind }: { kind: ExperienceEntry["kind"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide",
        kind === "full-time"
          ? "border-accent/30 bg-accent/10 text-accent"
          : "border-border-dim bg-bg-elevated text-text-tertiary",
      )}
    >
      {kind === "full-time" ? "FT" : "Intern"}
    </span>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <motion.svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </motion.svg>
  );
}

// ── Timeline entry ────────────────────────────────────────────────────────────

/*
 * Desktop layout: 2-col grid [11rem date] [content]
 * The section holds a continuous spine line at left-[11rem].
 * Each entry places a dot at the same offset (absolute, -translate-x-1/2).
 *
 * Mobile: stacked — company/date header then role row.
 */
function TimelineEntry({ entry, index }: { entry: ExperienceEntry; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -16 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { ...motionConfig.easeOut, delay: index * 0.12 },
        },
      }}
      className="group relative"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-0">
        {/* ── Left: date + company (desktop) / stacked header (mobile) ── */}
        <div className="flex items-baseline gap-2 sm:block sm:w-44 sm:shrink-0 sm:pr-8 sm:pt-0.5 sm:text-right lg:w-52 lg:pr-10">
          {/* Company — visually distinct: accent colour */}
          <p className="text-sm font-semibold text-accent sm:text-right">{entry.company}</p>
          {/* Date range */}
          <time className="font-mono text-xs text-text-tertiary sm:mt-1 sm:block">
            {formatDateRange(entry.period)}
          </time>
          {/* Kind badge — mobile only (desktop badge is in the content column) */}
          <span className="sm:hidden">
            <KindBadge kind={entry.kind} />
          </span>
        </div>

        {/* ── Spine dot — desktop only ── */}
        <div
          aria-hidden="true"
          className="absolute left-[11rem] top-1 hidden -translate-x-1/2 sm:block lg:left-[13rem]"
        >
          <div className="h-2.5 w-2.5 rounded-full border-2 border-accent bg-bg-base transition-colors duration-300 group-hover:bg-accent" />
        </div>

        {/* ── Right: role title + expand + bullets ── */}
        <div className="flex-1 sm:pl-10 lg:pl-12">
          {/* Click target: role row */}
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            className="flex w-full cursor-pointer items-center justify-between gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
          >
            <div className="flex flex-wrap items-center gap-2">
              {/* Role title */}
              <h3 className="text-base font-medium text-text-primary">{entry.role}</h3>
              {/* Kind badge — desktop only */}
              <span className="hidden sm:inline-flex">
                <KindBadge kind={entry.kind} />
              </span>
            </div>
            {/* Animated chevron */}
            <span className="shrink-0 text-text-tertiary transition-colors group-hover:text-text-secondary">
              <ChevronIcon open={isOpen} />
            </span>
          </button>

          {/* Expandable bullet list */}
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                key="bullets"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                style={{ overflow: "hidden" }}
              >
                <ul className="mt-4 flex flex-col gap-2.5 border-l border-border-dim pb-1 pl-4">
                  {entry.bullets.map((bullet, i) => (
                    <li key={i} className="text-sm leading-relaxed text-text-secondary">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export function Experience() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="experience"
      ref={ref}
      className="mx-auto w-full max-w-container px-6 py-24 lg:px-12"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={motionConfig.easeOut}
        className="mb-14"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
          Work History
        </p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-text-primary lg:text-4xl">
          Experience
        </h2>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/*
         * Continuous spine line — desktop only.
         * sm: left-[11rem] matches w-44 date column.
         * lg: left-[13rem] matches lg:w-52 date column.
         */}
        <div
          aria-hidden="true"
          className="absolute top-1 hidden h-[calc(100%-0.25rem)] w-px bg-border-dim sm:left-[11rem] sm:block lg:left-[13rem]"
        />

        <motion.div
          className="flex flex-col gap-10"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {experience.map((entry, i) => (
            <TimelineEntry key={`${entry.company}-${entry.role}`} entry={entry} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
