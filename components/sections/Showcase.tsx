"use client";

import { Reveal } from "../ui/Reveal";
import { motion } from "framer-motion";

export function Showcase() {
  return (
    <section id="showcase" className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="container-px mx-auto max-w-7xl">
        <Reveal>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
              Product
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl text-balance">
              See LAYRO in action
            </h2>
            <p className="mt-4 text-slate-600">
              A prompt becomes a validated layout in seconds. Iterate until it
              fits your project perfectly.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mx-auto max-w-5xl">
            <div
              aria-hidden
              className="absolute -inset-10 -z-10 rounded-[40px] bg-gradient-to-tr from-accent/20 via-primary/10 to-accent-light/20 blur-3xl"
            />
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-primary/10">
              {/* browser frame */}
              <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <div className="ml-3 rounded-md bg-white px-3 py-1 font-mono text-xs text-slate-500 border border-slate-200">
                  app.layro.ai / project / pharma-facility-a
                </div>
              </div>

              <div className="grid gap-0 md:grid-cols-[280px_1fr]">
                {/* sidebar */}
                <aside className="hidden border-r border-slate-200 bg-slate-50/50 p-5 md:block">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                    Prompt
                  </p>
                  <div className="mb-6 rounded-lg border border-slate-200 bg-white p-3 font-mono text-[12px] leading-relaxed text-slate-700">
                    1,200 m² sterile pharma facility, ISO 7 corridor, 4 clean
                    rooms, airlock, warehouse adjacent.
                  </div>
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                    Variants
                  </p>
                  <ul className="space-y-2 text-sm">
                    {["Variant A — 78% efficiency", "Variant B — 81% efficiency", "Variant C — 74% efficiency"].map((v, i) => (
                      <li
                        key={v}
                        className={`rounded-md px-3 py-2 ${
                          i === 1
                            ? "bg-primary text-white"
                            : "text-slate-700 hover:bg-white"
                        }`}
                      >
                        {v}
                      </li>
                    ))}
                  </ul>
                </aside>

                {/* canvas */}
                <div className="relative aspect-[4/3] bg-white">
                  <FloorPlanSVG />
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="absolute bottom-4 right-4 rounded-xl border border-slate-200 bg-white/90 p-3 text-xs shadow-lg backdrop-blur"
                  >
                    <div className="text-slate-500">Compliance check</div>
                    <div className="mt-1 font-semibold text-emerald-600">
                      ✓ ISO 14644 · ✓ GMP Annex 1
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FloorPlanSVG() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern
          id="grid"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="#DBEAFE"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="400" height="300" fill="url(#grid)" />

      {/* outer walls */}
      <rect
        x="30"
        y="30"
        width="340"
        height="240"
        fill="none"
        stroke="#0B0F1A"
        strokeWidth="2"
      />

      {/* rooms */}
      {[
        { x: 40, y: 40, w: 100, h: 90, label: "Clean R1", color: "#DBEAFE" },
        { x: 150, y: 40, w: 100, h: 90, label: "Clean R2", color: "#DBEAFE" },
        { x: 260, y: 40, w: 100, h: 90, label: "Airlock", color: "#60A5FA33" },
        { x: 40, y: 140, w: 100, h: 90, label: "Clean R3", color: "#DBEAFE" },
        { x: 150, y: 140, w: 100, h: 90, label: "Clean R4", color: "#DBEAFE" },
        { x: 260, y: 140, w: 100, h: 40, label: "Corridor", color: "#3B82F622" },
        { x: 260, y: 190, w: 100, h: 40, label: "Warehouse", color: "#f1f5f9" },
      ].map((r, i) => (
        <g key={i}>
          <rect
            x={r.x}
            y={r.y}
            width={r.w}
            height={r.h}
            fill={r.color}
            stroke="#1E3A8A"
            strokeWidth="1"
          />
          <text
            x={r.x + r.w / 2}
            y={r.y + r.h / 2 + 4}
            textAnchor="middle"
            fontSize="10"
            fontFamily="monospace"
            fill="#1E3A8A"
          >
            {r.label}
          </text>
        </g>
      ))}

      {/* flow arrow */}
      <path
        d="M80 250 Q200 260 320 250"
        fill="none"
        stroke="#3B82F6"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
    </svg>
  );
}
