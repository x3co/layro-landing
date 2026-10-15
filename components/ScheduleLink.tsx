"use client";

import { calendarUrl } from "@/config/site";
import { useLocale } from "@/lib/locale";

export function ScheduleLink({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark" | "ghost";
}) {
  const { t } = useLocale();
  const styles = {
    light: "bg-white text-ink hover:bg-slate-100",
    dark: "bg-ink text-white hover:bg-primary-dark",
    ghost: "border border-white/25 bg-white/5 text-white hover:bg-white/10",
  }[variant];

  const classes = `inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors ${styles} ${className ?? ""}`;

  if (!calendarUrl) {
    return (
      <span className="inline-flex flex-col items-start gap-1">
        <button
          type="button"
          className={`${classes} cursor-not-allowed opacity-60`}
          aria-disabled="true"
          onClick={(event) => event.preventDefault()}
        >
          {t.schedule.label}
        </button>
        <span className={`text-xs ${variant === "dark" ? "text-slate-500" : "text-slate-300"}`}>
          {t.schedule.unavailable}
        </span>
      </span>
    );
  }

  return (
    <a href={calendarUrl} className={classes} target="_blank" rel="noopener noreferrer">
      {t.schedule.label}
    </a>
  );
}
