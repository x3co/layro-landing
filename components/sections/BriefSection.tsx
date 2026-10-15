"use client";

import { ScheduleLink } from "@/components/ScheduleLink";
import { BriefForm } from "@/components/BriefForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLocale } from "@/lib/locale";

export function BriefSection() {
  const { t } = useLocale();

  return (
    <section id="brief" className="border-t border-slate-200 bg-slate-50">
      <div className="container-px mx-auto grid max-w-6xl gap-10 py-20 md:py-28 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHeading eyebrow={t.cta.eyebrow} title={t.cta.title} body={t.cta.body} />
          <div className="mt-8">
            <ScheduleLink variant="dark" />
          </div>
        </div>
        <BriefForm />
      </div>
    </section>
  );
}
