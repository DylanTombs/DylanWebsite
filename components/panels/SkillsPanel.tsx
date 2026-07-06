"use client";

import type { SkillsContent } from "@/data/flatlayObjects";

export function SkillsPanel({ groups }: SkillsContent) {
  return (
    <div className="space-y-4 pb-1">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-text-tertiary">
            {group.label}
          </p>
          <div className="flex flex-wrap gap-2">
            {group.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-sm border border-white/10 px-2 py-1 font-mono text-[11px] text-text-secondary"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
