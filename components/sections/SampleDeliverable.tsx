"use client";

import { ExampleBadge } from "@/components/ui/ExampleBadge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  EXAMPLE_FLOWS,
  EXAMPLE_ROOMS,
  FLOW_COLORS,
  ISO_COLORS,
  roomLabel,
  roomShortLabel,
} from "@/lib/example-layout";
import { useLocale } from "@/lib/locale";

const PLAN_FLOW = {
  personnel: "#0E7490",
  material: "#B45309",
} as const;

export function SampleDeliverable() {
  const { locale, t } = useLocale();

  return (
    <section id="ejemplo" className="container-px mx-auto max-w-6xl py-20 md:py-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow={t.sample.eyebrow} title={t.sample.title} body={t.sample.body} />
        <ExampleBadge label={t.sample.badge} />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <figure className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
          <svg
            viewBox="-2.2 -1.2 35.2 15.2"
            role="img"
            aria-label={t.sample.planAria}
            className="h-auto w-full"
          >
            <title>{t.sample.planAria}</title>
            <defs>
              <marker id="arrow-personnel" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0,0 L7,3.5 L0,7 Z" fill={PLAN_FLOW.personnel} />
              </marker>
              <marker id="arrow-material" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0,0 L7,3.5 L0,7 Z" fill={PLAN_FLOW.material} />
              </marker>
            </defs>
            <rect x="-1.6" y="-0.6" width="33.2" height="13.6" rx="0.3" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.06" />
            {EXAMPLE_ROOMS.map((room) => (
              <g key={room.id}>
                <rect
                  x={room.x}
                  y={room.z}
                  width={room.w}
                  height={room.d}
                  fill={ISO_COLORS[room.iso]}
                  stroke="#ffffff"
                  strokeWidth="0.08"
                />
                <text
                  x={room.x + room.w / 2}
                  y={room.z + room.d / 2 - 0.12}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="0.42"
                  fontFamily="ui-sans-serif, system-ui, sans-serif"
                >
                  {roomShortLabel(room, locale)}
                </text>
                <text
                  x={room.x + room.w / 2}
                  y={room.z + room.d / 2 + 0.42}
                  textAnchor="middle"
                  fill="#E2E8F0"
                  fontSize="0.34"
                  fontFamily="ui-monospace, monospace"
                >
                  {room.iso}
                </text>
              </g>
            ))}
            {EXAMPLE_FLOWS.map((flow) => (
              <polyline
                key={flow.id}
                points={flow.points.map(([x, z]) => `${x},${z}`).join(" ")}
                fill="none"
                stroke={PLAN_FLOW[flow.kind]}
                strokeWidth="0.14"
                strokeLinejoin="round"
                strokeLinecap="round"
                markerEnd={`url(#arrow-${flow.kind})`}
              />
            ))}
            <text x="-1.2" y="8.35" fontSize="0.38" fill={PLAN_FLOW.personnel} fontFamily="ui-sans-serif, system-ui, sans-serif">
              {t.demo.personnel}
            </text>
            <text x="31.5" y="1.2" fontSize="0.38" fill={PLAN_FLOW.material} textAnchor="end" fontFamily="ui-sans-serif, system-ui, sans-serif">
              {t.demo.material}
            </text>
          </svg>
          <figcaption className="mt-4 text-sm leading-6 text-slate-600">{t.sample.assumption}</figcaption>
        </figure>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-ink">{t.sample.roomList}</h3>
            <ul className="mt-4 space-y-2">
              {EXAMPLE_ROOMS.map((room) => (
                <li key={room.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: ISO_COLORS[room.iso] }} />
                    {roomLabel(room, locale)}
                  </span>
                  <span className="font-mono text-xs text-slate-500">{room.iso}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-500">
              <span className="mr-3 inline-flex items-center gap-1">
                <span className="inline-block h-0.5 w-4" style={{ backgroundColor: FLOW_COLORS.personnel }} />
                {t.demo.personnel}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="inline-block h-0.5 w-4" style={{ backgroundColor: FLOW_COLORS.material }} />
                {t.demo.material}
              </span>
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-ink">{t.sample.indexTitle}</h3>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-600">
              {t.sample.index.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
