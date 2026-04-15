const logos = [
  "PharmaCo",
  "BuildTech",
  "MedDesign",
  "IndustriAI",
  "ArchiLab",
  "CleanSpace",
  "NovaWorks",
  "Kalyx",
];

function FakeLogo({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 opacity-60 transition-opacity hover:opacity-100">
      <svg width="20" height="20" viewBox="0 0 20 20" className="text-slate-400">
        <rect x="2" y="2" width="16" height="16" rx="4" fill="currentColor" fillOpacity="0.3" />
        <circle cx="10" cy="10" r="3" fill="currentColor" />
      </svg>
      <span className="font-display text-base font-semibold text-slate-500 tracking-tight">
        {name}
      </span>
    </div>
  );
}

export function SocialProof() {
  const doubled = [...logos, ...logos];
  return (
    <section className="border-y border-slate-200 bg-white py-12">
      <p className="container-px mx-auto mb-8 max-w-7xl text-center text-xs font-medium uppercase tracking-widest text-slate-500">
        Trusted by engineering teams worldwide
      </p>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />
        <div className="flex w-max animate-marquee gap-14 whitespace-nowrap">
          {doubled.map((name, i) => (
            <FakeLogo key={i} name={name} />
          ))}
        </div>
      </div>
    </section>
  );
}
