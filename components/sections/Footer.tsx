"use client";

import Link from "next/link";
import { OWNER_NAME } from "@/config/site";
import { Logo } from "@/components/ui/Logo";
import { useLocale } from "@/lib/locale";

export function Footer() {
  const { t, text } = useLocale();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-px mx-auto flex max-w-6xl flex-col gap-6 py-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md">
          <Logo />
          <p className="mt-3 text-sm leading-6 text-slate-600">{text(t.footer.blurb)}</p>
          <p className="mt-2 text-sm text-slate-500">{OWNER_NAME}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-slate-600">
          <a href="/#modelo" className="hover:text-ink">
            {t.nav.model}
          </a>
          <a href="/#brief" className="hover:text-ink">
            {t.nav.brief}
          </a>
          <Link href="/privacidad" className="hover:text-ink">
            {t.footer.privacy}
          </Link>
          <p>{t.footer.scope}</p>
        </div>
      </div>
    </footer>
  );
}
