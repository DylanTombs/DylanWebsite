"use client";

import type { ProjectsContent } from "@/data/flatlayObjects";

function ExternalIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 10L10 2M5 2h5v5" />
    </svg>
  );
}

export function ProjectsPanel({ entries }: ProjectsContent) {
  return (
    <div className="divide-y divide-white/[0.06]">
      {entries.map((project) => (
        <div key={project.name} className="py-4 first:pt-0 last:pb-1">
          {/* Title + optional GitHub link */}
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">{project.name}</span>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub — ${project.name}`}
                onClick={(e) => e.stopPropagation()}
                className="text-text-tertiary transition-colors duration-150 hover:text-accent"
              >
                <ExternalIcon />
              </a>
            )}
          </div>

          {/* Stack tags */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-sm border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-text-tertiary"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Bullets */}
          <ul className="space-y-1.5">
            {project.bullets.map((bullet, i) => (
              <li key={i} className="flex gap-2 text-xs leading-relaxed text-text-secondary">
                <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-text-tertiary" />
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
