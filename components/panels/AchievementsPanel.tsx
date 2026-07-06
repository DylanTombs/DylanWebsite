"use client";

import type { AchievementsContent } from "@/data/flatlayObjects";

export function AchievementsPanel({ entries }: AchievementsContent) {
  return (
    <ul className="divide-y divide-white/[0.06]">
      {entries.map((entry) => (
        <li key={entry.label} className="py-3.5 first:pt-0 last:pb-1">
          <p className="mb-0.5 text-sm font-medium text-text-primary">{entry.label}</p>
          <p className="font-mono text-[11px] text-text-tertiary">{entry.detail}</p>
        </li>
      ))}
    </ul>
  );
}
