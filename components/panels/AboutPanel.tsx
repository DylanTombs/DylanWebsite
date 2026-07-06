"use client";

import type { AboutContent } from "@/data/flatlayObjects";

export function AboutPanel({ role, bio }: AboutContent) {
  return (
    <div className="space-y-3 pb-1">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-tertiary">{role}</p>
      <p className="text-sm leading-relaxed text-text-secondary">{bio}</p>
    </div>
  );
}
