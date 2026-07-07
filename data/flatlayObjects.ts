// Single source of truth for all flat-lay interactive objects.
// Add a new object by pushing one entry to FLATLAY_OBJECTS — no other code changes needed.
// When a real PNG lands in /public/flatlay/, it replaces the placeholder automatically.
//
// Coordinates are percentages of the INNER CONTAINER (fixed-aspect-ratio div that holds
// the base image), not the viewport. Fine-tune with the debug drag tool in FlatlayScene.

import type { DateRange } from "./cv";
import { meta, experience, projects, education, skills } from "./cv";

const periodEnd = (p: DateRange): string => (p.current ? "Present" : p.end);

// ── Panel content types ───────────────────────────────────────────────────────

export interface ContactContent {
  readonly kind: "contact";
  readonly email: string;
  readonly github: string;
  readonly linkedin: string;
}

export interface AboutContent {
  readonly kind: "about";
  readonly bio: string;
  readonly role: string;
}

export interface ExperienceSummary {
  readonly company: string;
  readonly role: string;
  readonly dates: string;
  readonly bullet: string;
}

export interface ExperienceContent {
  readonly kind: "experience";
  readonly entries: readonly ExperienceSummary[];
}

export interface ProjectSummary {
  readonly name: string;
  readonly stack: readonly string[];
  readonly bullets: readonly string[];
  readonly githubUrl?: string;
}

export interface ProjectsContent {
  readonly kind: "projects";
  readonly entries: readonly ProjectSummary[];
}

export interface EducationSummary {
  readonly institution: string;
  readonly qualification: string;
  readonly grade?: string;
  readonly dates: string;
}

export interface EducationContent {
  readonly kind: "education";
  readonly entries: readonly EducationSummary[];
}

export interface AchievementSummary {
  readonly label: string;
  readonly detail: string;
}

export interface AchievementsContent {
  readonly kind: "achievements";
  readonly entries: readonly AchievementSummary[];
}

export interface SkillGroupSummary {
  readonly label: string;
  readonly skills: readonly string[];
}

export interface SkillsContent {
  readonly kind: "skills";
  readonly groups: readonly SkillGroupSummary[];
}

export type PanelContent =
  | ContactContent
  | AboutContent
  | ExperienceContent
  | ProjectsContent
  | EducationContent
  | AchievementsContent
  | SkillsContent;

// ── Object definition ─────────────────────────────────────────────────────────

export interface ObjectPosition {
  readonly top: string;
  readonly left: string;
  readonly width: string;
  readonly rotation: number;
}

export interface FlatlayObjectDef {
  readonly id: string;
  readonly src: string;
  // Desktop positions (default)
  readonly top: string;
  readonly left: string;
  readonly width: string;
  readonly rotation: number;
  // iPhone-specific positions — used when FlatlayPhone.png is active
  readonly mobile?: ObjectPosition;
  readonly label: string;
  readonly panelTitle: string;
  // null = decorative object — no panel, no click interaction, no hover effect
  readonly panelContent: PanelContent | null;
  // Shown when src fails to load (PNG not yet added). Drop a real PNG and hot-reload swaps it.
  readonly placeholder: {
    readonly color: string;
    readonly aspect: string; // CSS aspect-ratio, e.g. "3/2"
  };
}

// ── Data ──────────────────────────────────────────────────────────────────────

export const FLATLAY_OBJECTS: readonly FlatlayObjectDef[] = [
  {
    id: "phone",
    src: "/flatlay/phone.png",
    top: "17.0%",
    left: "28.1%",
    width: "8.5%",
    rotation: 1,
    mobile: { top: "23.9%", left: "8.0%", width: "19.0%", rotation: 0 },
    label: "Contact",
    panelTitle: "Contact.",
    placeholder: { color: "rgba(120,120,255,0.25)", aspect: "9/19.5" },
    panelContent: {
      kind: "contact",
      email: meta.email,
      github: "github.com/DylanTombs",
      linkedin: "linkedin.com/in/dylantombs",
    },
  },
  {
    id: "headphones",
    src: "/flatlay/headphones.png",
    top: "9.1%",
    left: "37.7%",
    width: "21.7%",
    rotation: 0,
    mobile: { top: "15.9%", left: "30.0%", width: "42.5%", rotation: 0 },
    label: "About",
    panelTitle: "About.",
    placeholder: { color: "rgba(255,255,255,0.15)", aspect: "3/2" },
    panelContent: {
      kind: "about",
      role: "CS & Mathematics · University of Bath",
      bio: "Second-year student building distributed systems and ML inference engines. Targeting SWE roles at companies — currently open to 2027 grad positions.",
    },
  },
  {
    id: "camera",
    src: "/flatlay/camera.png",
    top: "22.9%",
    left: "53.9%",
    width: "25.1%",
    rotation: -90,
    mobile: { top: "28.4%", left: "65.5%", width: "42.8%", rotation: -90 },
    label: "Projects",
    panelTitle: "Projects.",
    placeholder: { color: "rgba(50,200,100,0.25)", aspect: "3/2" },
    panelContent: {
      kind: "projects",
      entries: [
        {
          name: projects[0].name,
          stack: projects[0].stack,
          bullets: projects[0].bullets.slice(0, 3),
          githubUrl: projects[0].githubUrl,
        },
        {
          name: projects[1].name,
          stack: projects[1].stack,
          bullets: projects[1].bullets.slice(0, 2),
          githubUrl: projects[1].githubUrl,
        },
      ],
    },
  },
  {
    id: "wallet",
    src: "/flatlay/Wallet.png",
    top: "63.3%",
    left: "56.4%",
    width: "9.8%",
    rotation: 0,
    mobile: { top: "56.2%", left: "71.4%", width: "19.2%", rotation: 0 },
    label: "Skills",
    panelTitle: "Skills.",
    placeholder: { color: "rgba(150,100,50,0.25)", aspect: "3/2" },
    panelContent: {
      kind: "skills",
      groups: skills.map((g) => ({ label: g.label, skills: g.skills })),
    },
  },
  {
    id: "swecard",
    src: "/flatlay/SWECard.png",
    top: "63.6%",
    left: "39.6%",
    width: "11.4%",
    rotation: 0,
    mobile: { top: "57.6%", left: "34.2%", width: "25.4%", rotation: 0 },
    label: "Experience",
    panelTitle: "Experience.",
    placeholder: { color: "rgba(0,200,255,0.25)", aspect: "16/9" },
    panelContent: {
      kind: "experience",
      entries: [
        {
          company: experience[0].company,
          role: experience[0].role,
          dates: `${experience[0].period.start} – Present`,
          bullet: experience[0].bullets[0],
        },
        {
          company: experience[1].company,
          role: experience[1].role,
          dates: `${experience[1].period.start} – ${periodEnd(experience[1].period)}`,
          bullet: experience[1].bullets[2],
        },
        {
          company: experience[2].company,
          role: experience[2].role,
          dates: `${experience[2].period.start} – ${periodEnd(experience[2].period)}`,
          bullet: experience[2].bullets[0],
        },
      ],
    },
  },
  {
    id: "passport",
    src: "/flatlay/Passport.png",
    top: "56.9%",
    left: "28.4%",
    width: "7.9%",
    rotation: 0.4,
    mobile: { top: "48.3%", left: "6.7%", width: "18.0%", rotation: 0 },
    label: "Education",
    panelTitle: "Education.",
    placeholder: { color: "rgba(100,80,180,0.25)", aspect: "2/3" },
    panelContent: {
      kind: "education",
      entries: [
        {
          institution: education[0].institution,
          qualification: education[0].qualification,
          grade: education[0].grade,
          dates: `${education[0].period.start} – Present`,
        },
        {
          institution: education[1].institution,
          qualification: education[1].qualification,
          grade: education[1].grade,
          dates: `${education[1].period.start} – ${periodEnd(education[1].period)}`,
        },
      ],
    },
  },
  {
    // Drop sunglasses.png in /public/flatlay/ to replace the placeholder
    id: "sunglasses",
    src: "/flatlay/Sunglasses.png",
    top: "47.9%",
    left: "39.2%",
    width: "17.6%",
    rotation: -0.1,
    mobile: { top: "44.2%", left: "31.6%", width: "40.3%", rotation: 0 },
    label: "Achievements",
    panelTitle: "Achievements.",
    placeholder: { color: "rgba(200,150,0,0.25)", aspect: "2/1" },
    panelContent: {
      kind: "achievements",
      entries: [
        {
          label: "Bath Hack 2026 — Winner",
          detail: "Event-driven multi-agent simulation with LLM-powered hospital decision-making.",
        },
        {
          label: "AmplifyMe Finance Accelerator — Top 10",
          detail: "Buy-Side Risk 97 · Sell-Side Risk 92",
        },
        {
          label: "UK Bebras — Distinction",
          detail: "2017 – 2023",
        },
        {
          label: "Physics & Maths Olympiads — Gold",
          detail: "2022 – 2024",
        },
      ],
    },
  },
];
