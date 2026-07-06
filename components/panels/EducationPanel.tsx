"use client";

import type { EducationContent } from "@/data/flatlayObjects";

export function EducationPanel({ entries }: EducationContent) {
  return (
    <div className="divide-y divide-white/[0.06]">
      {entries.map((entry) => (
        <div key={entry.institution} className="py-4 first:pt-0 last:pb-1">
          <div className="mb-1 flex items-baseline justify-between gap-4">
            <span className="text-sm font-medium text-text-primary">{entry.institution}</span>
            <span className="shrink-0 font-mono text-[10px] text-text-tertiary">{entry.dates}</span>
          </div>
          <p className="mb-1 text-xs text-text-secondary">{entry.qualification}</p>
          {entry.grade && (
            <p className="font-mono text-[10px] text-text-tertiary">{entry.grade}</p>
          )}
        </div>
      ))}
    </div>
  );
}
