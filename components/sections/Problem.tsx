"use client";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLocale } from "@/lib/locale";

export function Problem() {
  const { t } = useLocale();

  return (
    <section id="problema" className="container-px mx-auto max-w-6xl py-20 md:py-28">
      <Reveal>
        <SectionHeading eyebrow={t.problem.eyebrow} title={t.problem.title} body={t.problem.body} />
      </Reveal>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {t.problem.items.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.05}>
            <article className="h-full rounded-2xl border border-slate-200 bg-white p-6">
              <p className="font-mono text-xs text-primary">0{index + 1}</p>
              <h3 className="mt-4 font-display text-xl font-semibold text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
