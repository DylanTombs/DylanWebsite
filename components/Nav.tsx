"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { meta } from "@/data/cv";
import { motion as motionConfig } from "@/lib/tokens";
import { cn } from "@/lib/utils";

// ── Config ────────────────────────────────────────────────────────────────────

const LINKS = [
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Contact", href: "#contact", id: "contact" },
] as const;

type LinkId = (typeof LINKS)[number]["id"];
const SECTION_IDS = ["hero", ...LINKS.map((l) => l.id)] as const;
type SectionId = (typeof SECTION_IDS)[number];

// ── Hooks ─────────────────────────────────────────────────────────────────────

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);
  return scrolled;
}

/*
 * Tracks which section is in the viewport's active zone.
 * rootMargin "-30% 0px -60% 0px" creates a band 30%–40% from the top —
 * the section that enters this zone becomes active.
 */
function useActiveSection() {
  const [active, setActive] = useState<SectionId>("hero");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id as SectionId);
        },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return active;
}

// ── Sub-components ────────────────────────────────────────────────────────────

/*
 * Three-line → X hamburger.
 * Container is 18px tall. Lines at y≈0, y≈8.5, y≈17.
 * Top line shifts down 8px + rotates 45°.
 * Bottom line shifts up 8px + rotates -45°.
 * Middle line fades and collapses.
 */
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="flex h-[18px] w-5 flex-col justify-between">
      <motion.span
        className="block h-px w-full origin-center rounded-full bg-current"
        animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      />
      <motion.span
        className="block h-px w-full origin-center rounded-full bg-current"
        animate={open ? { opacity: 0, scaleX: 0.3 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      />
      <motion.span
        className="block h-px w-full origin-center rounded-full bg-current"
        animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      />
    </span>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────

export function Nav() {
  const scrolled = useScrolled();
  const active = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Lock body scroll while mobile overlay is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close overlay on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [menuOpen, closeMenu]);

  return (
    <>
      {/* ── Fixed header bar ── */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled
            ? "border-b border-border-dim/50 bg-bg-base/75 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-14 max-w-container items-center justify-between px-6 lg:px-12">
          {/* Logo / initials */}
          <a
            href="#hero"
            onClick={closeMenu}
            aria-label="Home"
            className="font-mono text-sm font-bold tracking-[0.18em] text-text-primary transition-colors duration-150 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
          >
            <span className="text-accent">D</span>T
          </a>

          {/* ── Desktop navigation ── */}
          <nav aria-label="Main navigation" className="hidden items-center gap-0.5 md:flex">
            {LINKS.map((link) => {
              const isActive = active === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={cn(
                    "relative rounded-sm px-3 py-1.5 text-sm transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
                    isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary",
                  )}
                >
                  {link.label}

                  {/*
                   * layoutId creates a shared element that slides between nav
                   * links as the active section changes — one indicator,
                   * animated position. Inspired by 21st.dev's shared-element
                   * transition pattern.
                   */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-x-3 bottom-0.5 h-px rounded-full bg-accent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                      />
                    )}
                  </AnimatePresence>
                </a>
              );
            })}
          </nav>

          {/* ── Mobile hamburger ── */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="relative z-50 flex h-9 w-9 cursor-pointer items-center justify-center rounded-sm text-text-primary transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
          >
            <HamburgerIcon open={menuOpen} />
          </button>
        </div>
      </header>

      {/* ── Mobile full-screen overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            key="mobile-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            /*
             * Reveal animation: clip-path sweeps from top → bottom,
             * giving the overlay a "sliding down" feel without a
             * literal translate (which would shift content behind it).
             */
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-bg-base"
          >
            {/* Ambient grid — consistent with rest of the site */}
            <div aria-hidden className="grid-overlay absolute inset-0 opacity-[0.18]" />

            {/* Radial bloom */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_40%,rgba(0,200,255,0.05),transparent_70%)]"
            />

            {/* Nav links */}
            <nav
              aria-label="Mobile navigation"
              className="relative flex flex-1 flex-col items-center justify-center gap-1"
            >
              {LINKS.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={link.href}
                  onClick={closeMenu}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.1 + i * motionConfig.stagger,
                  }}
                  className={cn(
                    "px-8 py-3 text-2xl font-medium tracking-tight transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg-base",
                    active === link.id ? "text-accent" : "text-text-primary hover:text-accent",
                  )}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            {/* Social footer row */}
            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.32, duration: 0.25, ease: "easeOut" }}
              className="relative flex items-center justify-center gap-6 pb-12 pt-4"
            >
              <a
                href={meta.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                GitHub
              </a>
              <span aria-hidden className="h-px w-4 bg-border-dim" />
              <a
                href={meta.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                LinkedIn
              </a>
            </motion.footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
