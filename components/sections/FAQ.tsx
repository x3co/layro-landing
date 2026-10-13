"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLocale } from "@/lib/locale";

export function FAQ() {
  const { t, text } = useLocale();

  return (
    <section id="faq" className="border-t border-slate-200 bg-white">
      <div className="container-px mx-auto max-w-3xl py-20 md:py-28">
        <SectionHeading eyebrow={t.faq.eyebrow} title={t.faq.title} />
        <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
          {t.faq.items.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="cursor-pointer list-none font-display text-lg font-semibold text-ink [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-4">
                  {item.q}
                  <span className="mt-1 font-mono text-sm text-slate-400 group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{text(item.a)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
