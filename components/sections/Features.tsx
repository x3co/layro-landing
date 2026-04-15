import { Reveal } from "../ui/Reveal";

const features = [
  {
    title: "Multi-sector intelligence",
    body: "Pharma, industrial, healthcare, commercial, residential. One engine, every standard.",
    icon: (p: string) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={p} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l9 5-9 5-9-5 9-5z" />
        <path d="M3 12l9 5 9-5" />
        <path d="M3 17l9 5 9-5" />
      </svg>
    ),
  },
  {
    title: "Code compliance",
    body: "GMP, ISO 14644, ASHRAE, local building codes built into every generation.",
    icon: (p: string) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={p} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4" />
        <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
      </svg>
    ),
  },
  {
    title: "Instant iterations",
    body: "Generate 10 layout variants in the time it takes to sketch one.",
    icon: (p: string) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={p} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" />
      </svg>
    ),
  },
  {
    title: "BIM-native output",
    body: "DWG, IFC, and RVT files ready for your existing workflow.",
    icon: (p: string) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={p} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    title: "Team collaboration",
    body: "Share, comment, and version layouts with your entire project team.",
    icon: (p: string) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={p} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="10" r="2.2" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <path d="M15 20c0-2.3 1.8-4 4-4s4 1.7 4 4" />
      </svg>
    ),
  },
  {
    title: "API access",
    body: "Integrate LAYRO into your own tools. Full REST API with webhook support.",
    icon: (p: string) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={p} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3l-6 9 6 9" />
        <path d="M16 3l6 9-6 9" />
      </svg>
    ),
  },
];

export function Features() {
  return (
    <section id="features" className="relative bg-surface/40 py-24 md:py-32">
      <div className="container-px mx-auto max-w-7xl">
        <Reveal>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
              Features
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl text-balance">
              Built for every design challenge
            </h2>
            <p className="mt-4 text-slate-600">
              Everything you need to move from concept to construction-ready
              documentation.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.08}>
              <div className="group h-full rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  {f.icon("currentColor")}
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-ink">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-600">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
