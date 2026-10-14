"use client";

import Link from "next/link";
import { HotmartLink } from "@/components/HotmartLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLocale } from "@/lib/locale";

export function Scenario() {
  const { t } = useLocale();

  return (
    <section id="escenario" className="bg-white">
      <div className="container-px mx-auto max-w-6xl py-20 md:py-24">
        <SectionHeading eyebrow={t.scenario.eyebrow} title={t.scenario.title} body={t.scenario.body} />
        <ul className="mt-8 grid gap-3 md:grid-cols-2">
          {t.scenario.points.map((point) => (
            <li key={point} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {point}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <HotmartLink />
          <Link href="/app" className="text-sm font-semibold text-blue-800 underline">
            {t.scenario.open}
          </Link>
        </div>
        <p className="mt-3 text-xs text-slate-500">{t.scenario.priceNote}</p>
      </div>
    </section>
  );
}
