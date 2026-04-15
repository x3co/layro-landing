import { Reveal } from "../ui/Reveal";

const tiers = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "For individuals exploring AI-driven layouts.",
    features: ["5 generations / month", "1 user", "Community support", "DWG export"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Professional",
    price: "$149",
    period: "/month",
    description: "For design teams shipping projects every week.",
    features: [
      "Unlimited generations",
      "5 users included",
      "Priority support",
      "API access",
      "DWG, IFC & RVT export",
    ],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations with scale and compliance needs.",
    features: [
      "Unlimited everything",
      "SSO & RBAC",
      "Dedicated support",
      "Custom integrations",
      "99.9% SLA",
    ],
    cta: "Contact sales",
    highlight: false,
  },
];

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5 9-11" />
    </svg>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="relative bg-white py-24 md:py-32">
      <div className="container-px mx-auto max-w-7xl">
        <Reveal>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
              Pricing
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl text-balance">
              Start designing smarter
            </h2>
            <p className="mt-4 text-slate-600">
              Simple pricing. No seats lock-in. Cancel anytime.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-8 transition-all ${
                  t.highlight
                    ? "border-primary bg-white shadow-2xl shadow-primary/20 scale-[1.02]"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                {t.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                    Most popular
                  </span>
                )}
                <h3 className="font-display text-xl font-semibold text-ink">
                  {t.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{t.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-bold text-ink">
                    {t.price}
                  </span>
                  {t.period && (
                    <span className="text-sm text-slate-500">{t.period}</span>
                  )}
                </div>
                <ul className="mt-8 space-y-3 text-sm text-slate-700">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span
                        className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full ${
                          t.highlight
                            ? "bg-primary text-white"
                            : "bg-surface text-primary"
                        }`}
                      >
                        <Check />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#"
                  className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all ${
                    t.highlight
                      ? "bg-primary text-white hover:bg-primary-dark"
                      : "bg-ink text-white hover:bg-primary-dark"
                  }`}
                >
                  {t.cta}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
