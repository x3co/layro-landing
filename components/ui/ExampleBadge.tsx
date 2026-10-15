export function ExampleBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-950">
      {label}
    </span>
  );
}
