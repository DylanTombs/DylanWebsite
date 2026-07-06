"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import { meta, projects } from "@/data/cv";
import type { Project } from "@/data/cv";
import { motion as motionConfig } from "@/lib/tokens";
import { cn } from "@/lib/utils";

// ── Icons ─────────────────────────────────────────────────────────────────────

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────

function StackBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-border-dim bg-bg-elevated px-2 py-0.5 font-mono text-xs text-text-secondary">
      {label}
    </span>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────

const MAX_BULLETS = 3;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { ...motionConfig.easeOut, delay: i * motionConfig.stagger },
  }),
};

/*
 * Hover pattern adapted from 21st.dev display-cards:
 * A semi-transparent overlay sits over each non-lead card at rest.
 * On hover the overlay fades to opacity-0, "awakening" the card —
 * border brightens and the accent glow fires simultaneously.
 */
function ProjectCard({
  project,
  isLead,
  index,
}: {
  project: Project;
  isLead: boolean;
  index: number;
}) {
  const bullets = project.bullets.slice(0, MAX_BULLETS);

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      className={cn(
        "group relative flex flex-col gap-5 overflow-hidden rounded-md border p-6",
        "transition-all duration-300 hover:-translate-y-0.5",
        isLead
          ? "border-border-default bg-bg-elevated hover:border-accent/50 hover:shadow-accent-glow"
          : "border-border-dim bg-bg-surface hover:border-border-bright hover:shadow-accent-glow",
      )}
    >
      {/* Lead: top accent rule */}
      {isLead && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
        />
      )}

      {/* Non-lead: 21st.dev overlay — dims at rest, fades on hover */}
      {!isLead && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-md bg-bg-base/20 opacity-100 transition-opacity duration-500 group-hover:opacity-0"
        />
      )}

      {/* Header: name + GitHub link */}
      <div className="relative flex items-start justify-between gap-4">
        <h3 className="text-base font-semibold leading-snug text-text-primary">{project.name}</h3>
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`GitHub — ${project.name}`}
            className="shrink-0 cursor-pointer text-text-tertiary transition-colors duration-150 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-bg-base"
          >
            <GitHubIcon />
          </a>
        )}
      </div>

      {/* Stack badges */}
      <div className="relative flex flex-wrap gap-1.5">
        {project.stack.map((tech) => (
          <StackBadge key={tech} label={tech} />
        ))}
      </div>

      {/* Top bullets */}
      <ul className="relative flex flex-col gap-2.5">
        {bullets.map((bullet, i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-text-secondary">
            <span
              aria-hidden="true"
              className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent/55"
            />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

// Backtesting Engine leads — it has the highest technical depth signal.
const sortedProjects = [...projects].sort((a) => (a.name.includes("Backtesting") ? -1 : 1));

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: motionConfig.stagger } },
};

export function Projects() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" ref={ref} className="mx-auto w-full max-w-container px-6 py-24 lg:px-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={motionConfig.easeOut}
        className="mb-12 flex items-end justify-between gap-4"
      >
        <div className="flex flex-col gap-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
            Selected Work
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary lg:text-4xl">
            Projects
          </h2>
        </div>
        <a
          href={meta.github}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 cursor-pointer text-sm text-text-secondary transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
        >
          View all on GitHub&nbsp;→
        </a>
      </motion.div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 gap-5 md:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {sortedProjects.map((project, i) => (
          <ProjectCard key={project.name} project={project} isLead={i === 0} index={i} />
        ))}
      </motion.div>
    </section>
  );
}
