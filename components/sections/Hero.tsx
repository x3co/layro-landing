"use client";

import { PRICE_FROM_LABEL } from "@/config/site";
import { ScheduleLink } from "@/components/ScheduleLink";
import { Reveal } from "@/components/ui/Reveal";
import { useLocale } from "@/lib/locale";

export function Hero() {
  const { t, text } = useLocale();

  return (
    <section id="top" className="relative overflow-hidden mesh-bg text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30 bg-dot-grid bg-[size:24px_24px]" aria-hidden />
      <div className="container-px relative mx-auto grid max-w-6xl gap-12 py-16 md:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-light">{t.hero.eyebrow}</p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
            {t.hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-200 text-balance md:text-xl">{t.hero.lead}</p>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">{text(t.hero.body)}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="#brief"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-slate-100"
            >
              {t.hero.primary}
            </a>
            <ScheduleLink variant="ghost" />
            <a
              href="#modelo"
              className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white underline-offset-4 hover:underline"
            >
              {t.hero.tertiary}
            </a>
          </div>
          <p className="mt-6 text-sm text-slate-400">{t.hero.audience}</p>
        </Reveal>

        <Reveal delay={0.08}>
          <aside className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur md:p-8">
            <h2 className="font-display text-xl font-semibold">{t.hero.cardTitle}</h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-100">
              {t.hero.cardItems.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-light" aria-hidden />
                  <span>{text(item)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-300">
              {t.deliverable.priceCaption}
            </p>
            <p className="mt-2 font-display text-3xl font-semibold">{PRICE_FROM_LABEL}</p>
            <p className="mt-3 text-sm text-slate-300">{t.hero.priceNote}</p>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
