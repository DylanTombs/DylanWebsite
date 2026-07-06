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
      "Worked within frontend re-architecture of production report-generation system, migrating from Angular to native React while preserving API compatibility and report integrity.",
      "Designed and implemented an MCP (Model Context Protocol) server over the company data catalogue, enabling live grounded AI-assisted data discovery",
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "DeepLearnHS",
    kind: "internship",
    period: { start: "Jun 2025", end: "Aug 2025", current: false },
    bullets: [
      "Refactored and deployed an Azure Function pipeline for a new AU region, introducing Durable Functions to parallelise workflows,",
      "Migrated 10 Azure services to Terraform, enabling infrastructure-as-code provisioning across the engineering team and eliminating manual Azure portal configurationMigrated [X] Azure services to Terraform, enabling infrastructure-as-code provisioning across the engineering team and eliminating manual Azure portal configuration",
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
    name: "Production URL Shortener with Caching",
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
    grade: "First — 76%",
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
    skills: ["Spring Boot", "React", "Docker", "Redis", "PostgresSQL"],
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
