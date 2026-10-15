"use client";

import dynamic from "next/dynamic";
import { ISO_COLORS } from "@/lib/example-layout";
import { useLocale } from "@/lib/locale";
import { ExampleBadge } from "@/components/ui/ExampleBadge";
import { SectionHeading } from "@/components/ui/SectionHeading";

const CleanroomViewer = dynamic(() => import("@/components/three/CleanroomViewer"), {
  ssr: false,
  loading: () => <ViewerLoading />,
});

function ViewerLoading() {
  const { t } = useLocale();
  return (
    <div className="flex h-[min(70vh,640px)] min-h-[420px] items-center justify-center rounded-2xl border border-white/10 bg-[#0B1220] text-sm text-slate-300">
      {t.demo.loading}
    </div>
  );
}

const legend = [
  { iso: "ISO 5" as const, es: "Llenado", en: "Filling" },
  { iso: "ISO 7" as const, es: "Esclusa de personal, pesada, preparación", en: "Personnel airlock, weighing, preparation" },
  { iso: "ISO 8" as const, es: "Pasillo, vestuario, material, acondicionado", en: "Corridor, gowning, material, packaging" },
];

export function Demo3D() {
  const { locale, t } = useLocale();

  return (
    <section id="modelo" className="bg-ink text-white">
      <div className="container-px mx-auto max-w-6xl py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={t.demo.eyebrow} title={t.demo.title} body={t.demo.body} tone="light" />
          <ExampleBadge label={t.demo.badge} />
        </div>

        <div className="mt-8 flex flex-wrap gap-3 text-xs">
          {legend.map((item) => (
            <span key={item.iso} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: ISO_COLORS[item.iso] }} />
              <span className="font-mono">{item.iso}</span>
              <span className="text-slate-300">{locale === "en" ? item.en : item.es}</span>
            </span>
          ))}
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            <span className="h-0.5 w-4 bg-[#22D3EE]" />
            {t.demo.personnel}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            <span className="h-0.5 w-4 bg-[#FBBF24]" />
            {t.demo.material}
          </span>
        </div>

        <div className="mt-6">
          <CleanroomViewer />
        </div>
        <p className="mt-4 max-w-3xl text-sm text-slate-400">{t.demo.assumption}</p>
      </div>
    </section>
  );
}
