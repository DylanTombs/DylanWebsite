"use client";

import type { ExperienceContent } from "@/data/flatlayObjects";

export function ExperiencePanel({ entries }: ExperienceContent) {
  return (
    <div className="divide-y divide-white/[0.06]">
      {entries.map((entry) => (
        <div key={entry.company} className="py-4 first:pt-0 last:pb-1">
          <div className="mb-1 flex items-baseline justify-between gap-4">
            <span className="text-sm font-medium text-text-primary">{entry.company}</span>
            <span className="shrink-0 font-mono text-[10px] text-text-tertiary">{entry.dates}</span>
          </div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-text-tertiary">
            {entry.role}
          </p>
          <p className="text-xs leading-relaxed text-text-secondary">{entry.bullet}</p>
        </div>
      ))}
    </div>
  );
}
