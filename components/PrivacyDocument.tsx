"use client";

import Link from "next/link";
import { contactEmail } from "@/config/site";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { useLocale } from "@/lib/locale";

export function PrivacyDocument() {
  const { t, text } = useLocale();
  const rights = contactEmail ? text(t.privacy.rightsWithEmail) : t.privacy.rightsNoEmail;

  return (
    <>
      <Navbar />
      <main id="contenido" className="container-px mx-auto max-w-3xl py-16">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{t.privacy.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">{t.privacy.title}</h1>
        <p className="mt-3 text-sm text-slate-500">{t.privacy.updated}</p>
        <p className="mt-6 text-base leading-7 text-slate-700">{text(t.privacy.intro)}</p>
        <div className="mt-8 space-y-6">
          {t.privacy.sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-xl font-semibold text-ink">{section.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{section.body}</p>
            </section>
          ))}
          <section>
            <h2 className="font-display text-xl font-semibold text-ink">{t.privacy.rightsTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{rights}</p>
          </section>
        </div>
        <p className="mt-10">
          <Link href="/" className="text-sm font-semibold text-primary">
            {t.privacy.home}
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
