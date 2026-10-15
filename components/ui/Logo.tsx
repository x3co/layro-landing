import { BRAND_NAME } from "@/config/site";

export function Logo({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const color = tone === "light" ? "text-white" : "text-ink";
  return (
    <span className={`inline-flex items-center gap-2 ${color} ${className}`}>
      <svg viewBox="0 0 80 80" aria-hidden="true" className="h-7 w-7">
        <circle cx="40" cy="40" r="7" fill="currentColor" opacity="0.9" />
        <circle cx="14" cy="12" r="3" fill="currentColor" opacity="0.3" />
        <circle cx="66" cy="10" r="3.5" fill="currentColor" opacity="0.38" />
        <circle cx="68" cy="56" r="2.5" fill="currentColor" opacity="0.25" />
        <circle cx="14" cy="66" r="3" fill="currentColor" opacity="0.3" />
        <circle cx="60" cy="72" r="2" fill="currentColor" opacity="0.2" />
        <line x1="40" y1="40" x2="14" y2="12" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
        <line x1="40" y1="40" x2="66" y2="10" stroke="currentColor" strokeWidth="0.8" opacity="0.38" />
        <line x1="40" y1="40" x2="68" y2="56" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
        <line x1="40" y1="40" x2="14" y2="66" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
        <line x1="40" y1="40" x2="60" y2="72" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      </svg>
      <span className="font-display text-lg font-bold tracking-tight">{BRAND_NAME}</span>
    </span>
  );
}
