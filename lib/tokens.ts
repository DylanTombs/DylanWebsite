// Design tokens — single source of truth.
// All values here are consumed by tailwind.config.ts and referenced directly in components.
// Never hardcode colors, fonts, or spacing outside this file.

export const colors = {
  // Surface layers — dark-first, additive luminance
  bg: {
    base: "#080B0F", // deepest background (body, page fill)
    surface: "#0D1117", // card / panel surfaces
    elevated: "#151C25", // elevated modal / overlay surfaces
    subtle: "#1C2430", // hover state, subtle separators
  },

  // Borders — fine-line precision aesthetic
  border: {
    dim: "#1F2B3A", // default structural borders
    default: "#263445", // active element outlines
    bright: "#3A4F66", // focused / selected states
  },

  // Accent — single high-signal color (electric cyan, engineering-terminal feel)
  accent: {
    DEFAULT: "#00C8FF", // primary call-to-action, highlights
    dim: "#007A9E", // muted accent (secondary badges, inactive tabs)
    glow: "rgba(0,200,255,0.12)", // glow/spread for box-shadow
  },

  // Warm amber — secondary accent for skills / data viz
  amber: {
    DEFAULT: "#F5A623",
    dim: "#8A5C0D",
    glow: "rgba(245,166,35,0.10)",
  },

  // Text scale
  text: {
    primary: "#E8EDF2", // body copy, headings
    secondary: "#8A9BB0", // captions, meta
    tertiary: "#4A5E72", // placeholders, disabled
    inverse: "#080B0F", // text on light/accent backgrounds
  },

  // Semantic states
  status: {
    success: "#2EA44F",
    warning: "#F5A623",
    error: "#CF2223",
    info: "#00C8FF",
  },
} as const;

export const fonts = {
  sans: ["var(--font-inter)", "system-ui", "sans-serif"],
  mono: ["var(--font-geist-mono)", "Menlo", "Monaco", "Consolas", "monospace"],
} as const;

export const spacing = {
  // Page-level rhythm (multiples of 8px baseline)
  section: "96px", // vertical gap between major sections
  container: "1280px", // max content width
  gutter: "24px", // horizontal page padding (mobile)
  gutterLg: "48px", // horizontal page padding (desktop)
} as const;

export const typography = {
  // Modular scale (base 16px, ratio 1.25)
  xs: "0.75rem", // 12px — timestamps, metadata
  sm: "0.875rem", // 14px — captions, labels
  base: "1rem", // 16px — body
  lg: "1.125rem", // 18px — lead paragraphs
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px — card headings
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px — section headings
  "5xl": "3rem", // 48px — hero sub
  "6xl": "3.75rem", // 60px — hero headline
} as const;

export const radius = {
  sm: "4px",
  DEFAULT: "6px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  full: "9999px",
} as const;

export const shadows = {
  // Glow variants for accent elements
  accentGlow: `0 0 0 1px ${colors.accent.DEFAULT}, 0 0 20px ${colors.accent.glow}`,
  amberGlow: `0 0 0 1px ${colors.amber.DEFAULT}, 0 0 20px ${colors.amber.glow}`,
  // Layered depth for cards/panels
  card: `0 1px 3px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)`,
  elevated: `0 4px 16px rgba(0,0,0,0.5), 0 16px 48px rgba(0,0,0,0.4)`,
} as const;

export const motion = {
  // Framer Motion default transitions
  spring: { type: "spring", stiffness: 300, damping: 28 },
  easeOut: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  stagger: 0.07,
} as const;
