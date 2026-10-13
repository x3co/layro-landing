export function SectionHeading({
  eyebrow,
  title,
  body,
  tone = "dark",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  tone?: "dark" | "light";
}) {
  const titleColor = tone === "light" ? "text-white" : "text-ink";
  const bodyColor = tone === "light" ? "text-slate-300" : "text-slate-600";
  const eyebrowColor = tone === "light" ? "text-accent-light" : "text-primary";
  return (
    <div className="max-w-2xl">
      <p className={`font-mono text-xs uppercase tracking-[0.18em] ${eyebrowColor}`}>{eyebrow}</p>
      <h2 className={`mt-3 font-display text-3xl font-semibold tracking-tight text-balance md:text-4xl ${titleColor}`}>
        {title}
      </h2>
      {body ? <p className={`mt-4 text-lg text-balance ${bodyColor}`}>{body}</p> : null}
    </div>
  );
}
