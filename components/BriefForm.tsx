"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { COUNTRIES, ISO_OPTIONS, TIMELINES, validateBrief, type BriefField } from "@/lib/brief";
import { useLocale } from "@/lib/locale";

type Fields = Partial<Record<BriefField, string>>;

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export function BriefForm() {
  const { locale, t, text } = useLocale();
  const [country, setCountry] = useState("ES");
  const [submitting, setSubmitting] = useState(false);
  const [fields, setFields] = useState<Fields>({});
  const [error, setError] = useState("");
  const [successId, setSuccessId] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFields({});
    const form = event.currentTarget;
    const data = new FormData(form);
    const selectedIso = data.getAll("iso").filter((value): value is string => typeof value === "string");
    const fileEntry = data.get("file");
    const file =
      fileEntry instanceof File && fileEntry.size > 0
        ? { name: fileEntry.name, type: fileEntry.type, size: fileEntry.size }
        : null;

    const checked = validateBrief({
      locale,
      company: String(data.get("company") ?? ""),
      contactName: String(data.get("contact") ?? ""),
      email: String(data.get("email") ?? ""),
      country: String(data.get("country") ?? ""),
      countryOther: String(data.get("countryOther") ?? ""),
      productType: String(data.get("product") ?? ""),
      areaM2: String(data.get("area") ?? ""),
      isoClasses: selectedIso,
      timeline: String(data.get("timeline") ?? ""),
      notes: String(data.get("notes") ?? ""),
      fileLink: String(data.get("fileLink") ?? ""),
      consent: data.get("consent") === "yes",
      honeypot: String(data.get("company_website") ?? ""),
      file,
    });

    if (!checked.ok) {
      setError(checked.error);
      setFields(checked.fields);
      return;
    }

    data.set("locale", locale);
    setSubmitting(true);
    try {
      const response = await fetch("/api/brief", { method: "POST", body: data });
      let payload: { ok?: boolean; id?: string; error?: string; fields?: Fields } | null = null;
      try {
        payload = (await response.json()) as { ok?: boolean; id?: string; error?: string; fields?: Fields };
      } catch {
        setError(t.form.invalid);
        return;
      }
      if (!response.ok || !payload?.ok || !payload.id) {
        setError(payload?.error || t.form.invalid);
        setFields(payload?.fields ?? {});
        return;
      }
      setSuccessId(payload.id);
      form.reset();
      setCountry("ES");
    } catch {
      setError(t.form.network);
    } finally {
      setSubmitting(false);
    }
  }

  if (successId) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6" role="status">
        <h3 className="font-display text-xl font-semibold text-ink">{t.form.successTitle}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-700">{text(t.form.successBody.replace("{id}", successId))}</p>
        <p className="mt-4 font-mono text-xs text-slate-500">
          {t.form.reference}: {successId}
        </p>
        <button
          type="button"
          onClick={() => setSuccessId("")}
          className="mt-6 text-sm font-semibold text-primary"
        >
          {t.form.another}
        </button>
      </div>
    );
  }

  return (
      <form onSubmit={onSubmit} noValidate className="relative rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
      {error ? (
        <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <div className="sr-only" aria-hidden="true">
        <label>
          Website
          <input name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t.form.company} error={fields.company} requiredLabel={t.form.required}>
          <input id="company" name="company" required autoComplete="organization" className={inputClass} aria-invalid={Boolean(fields.company)} />
        </Field>
        <Field label={t.form.contact} error={fields.contact} requiredLabel={t.form.required}>
          <input id="contact" name="contact" required autoComplete="name" className={inputClass} aria-invalid={Boolean(fields.contact)} />
        </Field>
        <Field label={t.form.email} error={fields.email} requiredLabel={t.form.required}>
          <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} aria-invalid={Boolean(fields.email)} />
        </Field>
        <Field label={t.form.country} error={fields.country} requiredLabel={t.form.required}>
          <select
            id="country"
            name="country"
            required
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            className={inputClass}
            aria-invalid={Boolean(fields.country)}
          >
            {COUNTRIES.map((item) => (
              <option key={item.code} value={item.code}>
                {locale === "en" ? item.en : item.es}
              </option>
            ))}
          </select>
        </Field>
        {country === "OTHER" ? (
          <Field label={t.form.countryOther} error={fields.countryOther} requiredLabel={t.form.required}>
            <input id="countryOther" name="countryOther" className={inputClass} aria-invalid={Boolean(fields.countryOther)} />
          </Field>
        ) : (
          <input type="hidden" name="countryOther" value="" />
        )}
        <div className="md:col-span-2">
          <Field label={t.form.product} hint={t.form.productHint} error={fields.product} requiredLabel={t.form.required}>
            <input id="product" name="product" required className={inputClass} aria-invalid={Boolean(fields.product)} />
          </Field>
        </div>
        <Field label={t.form.area} hint={t.form.areaHint} error={fields.area} requiredLabel={t.form.required}>
          <input id="area" name="area" inputMode="decimal" required className={inputClass} aria-invalid={Boolean(fields.area)} />
        </Field>
        <Field label={t.form.timeline} error={fields.timeline} requiredLabel={t.form.required}>
          <select id="timeline" name="timeline" required defaultValue="" className={inputClass} aria-invalid={Boolean(fields.timeline)}>
            <option value="" disabled>
              {t.form.timelinePlaceholder}
            </option>
            {TIMELINES.map((item) => (
              <option key={item.code} value={item.code}>
                {locale === "en" ? item.en : item.es}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <fieldset className="mt-4">
        <legend className="text-sm font-medium text-ink">
          {t.form.iso} <span className="font-normal text-slate-400">({t.form.required})</span>
        </legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {ISO_OPTIONS.map((item) => (
            <label key={item.code} className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" name="iso" value={item.code} className="h-4 w-4 accent-primary" />
              {locale === "en" ? item.en : item.es}
            </label>
          ))}
        </div>
        {fields.iso ? <p className="mt-2 text-sm text-red-700">{fields.iso}</p> : null}
      </fieldset>

      <div className="mt-4">
        <Field label={t.form.notes} error={fields.notes}>
          <textarea id="notes" name="notes" rows={4} className={inputClass} aria-invalid={Boolean(fields.notes)} />
        </Field>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field label={t.form.file} hint={t.form.fileHint} error={fields.file}>
          <input
            id="file"
            name="file"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp"
            className={`${inputClass} file:mr-3 file:rounded-full file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-xs file:font-semibold`}
          />
        </Field>
        <Field label={t.form.link} hint={t.form.linkHint} error={fields.fileLink}>
          <input id="fileLink" name="fileLink" type="url" placeholder="https://" className={inputClass} aria-invalid={Boolean(fields.fileLink)} />
        </Field>
      </div>

      <p className="mt-4 text-sm text-slate-600">{t.form.warning}</p>

      <label className="mt-4 flex items-start gap-3 text-sm text-slate-700">
        <input type="checkbox" name="consent" value="yes" className="mt-1 h-4 w-4 accent-primary" aria-invalid={Boolean(fields.consent)} />
        <span>
          {t.form.consentBefore}{" "}
          <Link href="/privacidad" className="font-semibold text-primary underline-offset-2 hover:underline">
            {t.form.consentLink}
          </Link>{" "}
          {t.form.consentAfter}
        </span>
      </label>
      {fields.consent ? <p className="mt-2 text-sm text-red-700">{fields.consent}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary disabled:cursor-wait disabled:opacity-70"
      >
        {submitting ? t.form.sending : t.form.submit}
      </button>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  requiredLabel,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  requiredLabel?: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-ink">
      <span>
        {label}
        {requiredLabel ? <span className="ml-2 font-normal text-slate-400">({requiredLabel})</span> : null}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs font-normal text-slate-500">{hint}</span> : null}
      {error ? <span className="mt-1 block text-sm font-normal text-red-700">{error}</span> : null}
    </label>
  );
}
