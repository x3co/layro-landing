"use client";

import { hotmartCheckoutUrl } from "@/config/site";
import { useLocale } from "@/lib/locale";

export function HotmartLink({ className }: { className?: string }) {
  const { t } = useLocale();
  const classes = `inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark ${className ?? ""}`;

  if (!hotmartCheckoutUrl) {
    return (
      <span className="inline-flex flex-col items-start gap-1">
        <button type="button" className={`${classes} cursor-not-allowed opacity-60`} aria-disabled="true">
          {t.scenario.buy}
        </button>
        <span className="text-xs text-slate-500">{t.scenario.buyUnavailable}</span>
      </span>
    );
  }

  return (
    <a href={hotmartCheckoutUrl} className={classes} target="_blank" rel="noopener noreferrer">
      {t.scenario.buy}
    </a>
  );
}
