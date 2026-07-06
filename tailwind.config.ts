import type { Config } from "tailwindcss";

import { colors, fonts, radius, typography } from "./lib/tokens";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./sections/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: colors.bg,
        border: colors.border,
        accent: colors.accent,
        amber: colors.amber,
        text: colors.text,
        status: colors.status,
      },
      fontFamily: {
        sans: [...fonts.sans],
        mono: [...fonts.mono],
      },
      fontSize: { ...typography },
      borderRadius: radius,
      maxWidth: {
        container: "1280px",
      },
      boxShadow: {
        "accent-glow": `0 0 0 1px ${colors.accent.DEFAULT}, 0 0 20px ${colors.accent.glow}`,
        "amber-glow": `0 0 0 1px ${colors.amber.DEFAULT}, 0 0 20px ${colors.amber.glow}`,
        card: "0 1px 3px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)",
        elevated: "0 4px 16px rgba(0,0,0,0.5), 0 16px 48px rgba(0,0,0,0.4)",
      },
      backgroundImage: {
        // Subtle grid overlay for technical-density aesthetic
        "grid-dim":
          "linear-gradient(rgba(38,52,69,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(38,52,69,0.4) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "slide-up": "slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        blink: "blink 1s step-end infinite",
        ping: "ping 1.4s cubic-bezier(0,0,0.2,1) infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        ping: {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
