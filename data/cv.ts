// ─────────────────────────────────────────────────────────────────────────────
// CV data — single source of truth.
// All content must live here. Components must not contain hardcoded strings.
// ─────────────────────────────────────────────────────────────────────────────

// ── Primitive types ───────────────────────────────────────────────────────────

/** Open-ended range (current role / ongoing study) vs closed range. */
export type DateRange =
  | { readonly start: string; readonly current: true }
  | { readonly start: string; readonly end: string; readonly current: false };

/** Full-time vs internship — drives badge rendering in the Experience section. */
export type ExperienceKind = "full-time" | "internship";

/** Each achievement kind has a distinct shape — use the `kind` tag to narrow. */
export type Achievement =
  | {
      readonly kind: "hackathon";
      readonly name: string;
      readonly year: number;
      readonly description: string;
    }
  | {
      readonly kind: "accelerator";
      readonly name: string;
      readonly rank: string;
      readonly scores: Readonly<Record<string, number>>;
    }
  | {
      readonly kind: "competition";
      readonly name: string;
      readonly award: string;
      readonly years: string;
    };

export type SkillCategory = "languages" | "frameworks" | "cloud-devops" | "other";

// ── Compound types ────────────────────────────────────────────────────────────

export interface Experience {
  readonly role: string;
  readonly company: string;
  readonly kind: ExperienceKind;
  readonly period: DateRange;
  readonly bullets: readonly string[];
}

export interface Project {
  readonly name: string;
  readonly stack: readonly string[];
  readonly bullets: readonly string[];
  readonly githubUrl?: string;
}

export interface EducationEntry {
  readonly institution: string;
  readonly qualification: string;
  readonly grade?: string;
  readonly period: DateRange;
  readonly notes?: readonly string[];
}

export interface SkillGroup {
  readonly category: SkillCategory;
  readonly label: string;
  readonly skills: readonly string[];
}

// ── Contact / meta ────────────────────────────────────────────────────────────

export const meta = {
  name: "Dylan Tombs",
  email: "dylantombs2006@icloud.com",
  phone: "+44 7935 791465",
  github: "https://github.com/DylanTombs",
  linkedin: "https://www.linkedin.com/in/dylantombs/",
} as const;

// ── Experience ─────────────────────────────────────────────────────────────────

export const experience: readonly Experience[] = [
  {
    role: "Software Engineer",
    company: "Cognisses",
    kind: "full-time",
    period: { start: "Dec 2025", current: true },
    bullets: [
      "Led frontend re-architecture of production report-generation system, migrating from Angular to native React while preserving API compatibility and report integrity.",
      "Refactored and deployed an Azure Function pipeline for a new AU region, introducing Durable Functions to parallelise workflows — reducing execution time by 30% and improving reliability for regional workloads.",
      "Migrated 10+ reports serving 2,000+ active users; collaborated in daily engineering stand-ups and code reviews within a multi-developer team.",
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "DeepLearnHS",
    kind: "internship",
    period: { start: "Jun 2025", end: "Aug 2025", current: false },
    bullets: [
      "Led positioning of DeepLearnHS's proprietary AI engine through animation; collaborated with AI engineers to translate abstract model mechanics into a demo used in the Series A investment deck.",
      "Automated 20+ sinusoidal wave generations via scripting, reducing manual keyframing by ~30% and accelerating iteration for investor feedback.",
      "Optimised GPU render pipeline to reduce per-frame render time by 60% via mesh decimation and baking; delivered project 5 days ahead of schedule.",
    ],
  },
  {
    role: "Data Science Intern",
    company: "Collaborative Conveyancing",
    kind: "internship",
    period: { start: "Jun 2024", end: "Sep 2024", current: false },
    bullets: [
      "Designed Python pipelines to clean and format ~10,000 legal emails for LLM input, improving data quality for client-facing demos.",
    ],
  },
];

// ── Projects ──────────────────────────────────────────────────────────────────

export const projects: readonly Project[] = [
  {
    name: "Distributed Backtesting Engine",
    stack: ["Python", "C++", "LibTorch", "Docker"],
    bullets: [
      "Removed Python runtime dependency by deploying models via TorchScript in C++, enabling standalone execution and simplifying deployment.",
      "Reduced data processing time by 2× across multi-symbol workloads by parallelising symbol processing and sharing a single model instance across strategies to reduce memory overhead.",
      "Built a modular event-driven architecture (market, feature, execution events) supporting plug-in strategies without modifying core engine components.",
      "Increased test coverage to 80%+ across Python and C++ layers using pytest and Google Test, covering 6 core engine components.",
      "Implemented CI/CD pipeline (pytest, ctest, CodeQL, Docker) enforcing build reliability and automated testing; production images exclude the compiler toolchain.",
    ],
  },
  {
    name: "Production-Grade URL Shortener",
    stack: ["Java", "Spring Boot", "AWS", "Redis", "PostgreSQL"],
    bullets: [
      "Built a URL shortening service using Spring Boot with a modular architecture and schema versioning via Flyway.",
      "Integrated Redis read-through caching on the redirect path, reducing database load and lowering median redirect latency by 30% for high-frequency short codes.",
      "Built two-tier rate limiting: AWS WAF (100 req / 5 min) and application-level token buckets (60 req/min for redirects, 10/min for creation).",
      "Added monitoring for latency, traffic, and cache hit rates via Micrometer metrics exported to AWS CloudWatch, enabling performance tuning and capacity planning.",
      "Achieved ≥80% line coverage via JaCoCo; integration tests use isolated PostgreSQL and Redis instances via Testcontainers for production-like environments.",
    ],
  },
];

// ── Education ─────────────────────────────────────────────────────────────────

export const education: readonly EducationEntry[] = [
  {
    institution: "University of Bath",
    qualification: "BSc Computer Science and Mathematics",
    grade: "First — 76% (Top 50)",
    period: { start: "2024", current: true },
  },
  {
    institution: "Reading School",
    qualification: "A-Levels",
    grade: "Maths A*, Further Maths A*, Computer Science A*, Physics A",
    period: { start: "2022", end: "2024", current: false },
    notes: ["Gold Awards in Physics & Mathematics Olympiads (2022–2024)"],
  },
];

// ── Skills ────────────────────────────────────────────────────────────────────

export const skills: readonly SkillGroup[] = [
  {
    category: "languages",
    label: "Languages",
    skills: ["Python", "C++", "Java", "JavaScript"],
  },
  {
    category: "frameworks",
    label: "Frameworks & Databases",
    skills: ["Spring Boot", "React", "Docker", "Redis", "PostgreSQL"],
  },
  {
    category: "cloud-devops",
    label: "Cloud & DevOps",
    skills: ["Azure DevOps", "AWS", "CodeQL", "Terraform", "PyTorch", "NumPy", "Pandas"],
  },
  {
    category: "other",
    label: "Other",
    skills: ["Git", "Micrometer", "Testcontainers", "Agile"],
  },
];

// ── Achievements ──────────────────────────────────────────────────────────────

export const achievements: readonly Achievement[] = [
  {
    kind: "hackathon",
    name: "Bath Hack 2026",
    year: 2026,
    description:
      "Won Bath Hack 2026 by engineering an event-driven multi-agent simulation with LLM-powered agents modelling hospital decision-making via a modular simulation engine.",
  },
  {
    kind: "accelerator",
    name: "AmplifyMe Finance Accelerator",
    rank: "Top 10",
    scores: {
      "Buy-Side Risk Management": 97,
      "Sell-Side Risk Management": 92,
    },
  },
  {
    kind: "competition",
    name: "UK Bebras Competition",
    award: "Distinction",
    years: "2017–2023",
  },
  {
    kind: "competition",
    name: "Physics & Mathematics Olympiads",
    award: "Gold",
    years: "2022–2024",
  },
];

// ── Convenience re-export ─────────────────────────────────────────────────────

export const cv = {
  meta,
  experience,
  projects,
  education,
  skills,
  achievements,
} as const;
