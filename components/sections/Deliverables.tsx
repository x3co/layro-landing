"use client";

import { PRICE_FROM_LABEL } from "@/config/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLocale } from "@/lib/locale";

export function Deliverables() {
  const { t, text } = useLocale();

  return (
    <section id="entregable" className="container-px mx-auto max-w-6xl py-20 md:py-28">
      <Reveal>
        <SectionHeading eyebrow={t.deliverable.eyebrow} title={t.deliverable.title} body={t.deliverable.body} />
      </Reveal>
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {t.deliverable.items.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.04}>
            <article className="h-full rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="font-display text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text(item.body)}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <Reveal>
          <div className="h-full rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-ink">{t.deliverable.excludedTitle}</h3>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {t.deliverable.excluded.map((item) => (
                <li key={item} className="text-sm text-slate-600">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="flex h-full flex-col justify-between rounded-2xl bg-ink p-6 text-white">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-300">
              {t.deliverable.priceCaption}
            </p>
            <p className="mt-6 font-display text-4xl font-semibold">{PRICE_FROM_LABEL}</p>
            <p className="mt-4 text-sm text-slate-300">{t.hero.priceNote}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
