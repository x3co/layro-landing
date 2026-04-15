import { Reveal } from "../ui/Reveal";

const quotes = [
  {
    quote:
      "LAYRO cut our early-stage design cycles from three weeks to two days. The compliance checks alone are worth it.",
    name: "Marta Villalobos",
    role: "Principal Engineer",
    company: "Helix Pharma",
    gradient: "from-blue-400 to-indigo-600",
  },
  {
    quote:
      "We generate ten validated variants per project now. The client conversation is completely different.",
    name: "Daniel Okafor",
    role: "Design Lead",
    company: "Mercer & Field",
    gradient: "from-cyan-400 to-blue-600",
  },
  {
    quote:
      "BIM-native exports mean zero rework. It plugs into our Revit workflow like it was built for it.",
    name: "Sara Lindqvist",
    role: "BIM Coordinator",
    company: "Nordstrand Architects",
    gradient: "from-sky-400 to-primary",
  },
];

export function Testimonials() {
  return (
    <section className="relative bg-surface/40 py-24 md:py-32">
      <div className="container-px mx-auto max-w-7xl">
        <Reveal>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
              Testimonials
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl text-balance">
              Teams that design faster with LAYRO
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {quotes.map((q, i) => (
            <Reveal key={q.name} delay={i * 0.08}>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <p className="text-slate-700">&ldquo;{q.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-full bg-gradient-to-br ${q.gradient}`}
                  />
                  <div>
                    <div className="text-sm font-semibold text-ink">
                      {q.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {q.role} · {q.company}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
