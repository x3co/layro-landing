"use client";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLocale } from "@/lib/locale";

export function HowItWorks() {
  const { t, text } = useLocale();

  return (
    <section id="metodo" className="border-y border-slate-200 bg-white">
      <div className="container-px mx-auto max-w-6xl py-20 md:py-28">
        <Reveal>
          <SectionHeading eyebrow={t.method.eyebrow} title={t.method.title} body={t.method.body} />
        </Reveal>
        <ol className="mt-12 grid gap-4 md:grid-cols-2">
          {t.method.steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.05}>
              <li className="h-full rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="font-mono text-xs text-primary">0{index + 1}</p>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text(step.body)}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal>
          <p className="mt-8 max-w-3xl text-sm leading-6 text-slate-600">{t.method.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
