"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/ui/Logo";
import { BRAND_NAME } from "@/config/site";
import { useLocale } from "@/lib/locale";

const links = [
  { href: "/#problema", key: "problem" },
  { href: "/#metodo", key: "method" },
  { href: "/#entregable", key: "deliverable" },
  { href: "/#modelo", key: "model" },
  { href: "/#faq", key: "faq" },
] as const;

export function Navbar() {
  const { t } = useLocale();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled ? "border-slate-200 bg-white/95 backdrop-blur" : "border-transparent bg-white"
      }`}
    >
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        {t.skip}
      </a>
      <nav className="container-px mx-auto flex h-16 max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="shrink-0" aria-label={BRAND_NAME}>
          <Logo />
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-slate-600 transition-colors hover:text-ink">
              {t.nav[link.key]}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageToggle />
          <a
            href="/#brief"
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary"
          >
            {t.nav.brief}
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageToggle />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-md p-2 text-ink"
            aria-expanded={open}
            aria-label={t.nav.menu}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M4 7h16" strokeLinecap="round" />
                  <path d="M4 12h16" strokeLinecap="round" />
                  <path d="M4 17h16" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-200 bg-white lg:hidden"
          >
            <div className="container-px mx-auto flex max-w-6xl flex-col gap-4 py-5">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-base text-ink"
                >
                  {t.nav[link.key]}
                </a>
              ))}
              <a
                href="/#brief"
                onClick={() => setOpen(false)}
                className="rounded-full bg-ink px-4 py-3 text-center text-sm font-semibold text-white"
              >
                {t.nav.brief}
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
