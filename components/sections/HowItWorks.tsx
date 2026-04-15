import { Reveal } from "../ui/Reveal";

const steps = [
  {
    n: "01",
    title: "Describe your space",
    body: "Tell LAYRO what you need in plain language. Room types, classifications, adjacencies, flows.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5h16v10H8l-4 4V5z" />
        <path d="M8 9h8M8 12h5" />
      </svg>
    ),
  },
  {
    n: "02",
    title: "AI generates layouts",
    body: "Our engine processes GMP, ISO, and building codes to create optimized spatial arrangements.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "Export to Revit",
    body: "Get production-ready DWG and IFC files. Open directly in Revit, ArchiCAD, or any BIM tool.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v12" />
        <path d="M7 10l5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative bg-white py-24 md:py-32">
      <div className="container-px mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-16 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
              How it works
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl text-balance">
              From prompt to plan in three steps
            </h2>
          </div>
        </Reveal>

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* connecting line */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-16 hidden h-px bg-gradient-to-r from-surface via-accent/40 to-surface md:block"
          />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="relative rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-primary">
                    {s.icon}
                  </div>
                  <span className="font-display text-5xl font-bold text-primary/10">
                    {s.n}
                  </span>
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold text-ink">
                  {s.title}
                </h3>
                <p className="text-slate-600">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
