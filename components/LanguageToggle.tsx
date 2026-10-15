"use client";

import { useLocale } from "@/lib/locale";

export function LanguageToggle({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { locale, setLocale, t } = useLocale();
  const idle = tone === "light" ? "text-slate-300 hover:text-white" : "text-slate-500 hover:text-ink";
  const active = tone === "light" ? "bg-white text-ink" : "bg-ink text-white";

  return (
    <div role="group" aria-label={t.langLabel} className="inline-flex items-center rounded-full border border-current/15 p-0.5 text-xs font-semibold">
      {(["es", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={locale === code}
          onClick={() => setLocale(code)}
          className={`rounded-full px-2.5 py-1 uppercase tracking-wide ${locale === code ? active : idle}`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
