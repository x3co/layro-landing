"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Logo } from "@/components/ui/Logo";
import { LayoutResult } from "@/components/osd/LayoutResult";
import { DEFAULT_INPUTS, type OsdInputs, type OsdLayout } from "@/lib/osd/generate";

type Gate = "checking" | "anon" | "ready";

const fieldClass =
  "mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-blue-700";

export function Workspace({ initialToken }: { initialToken: string }) {
  const [gate, setGate] = useState<Gate>("checking");
  const [email, setEmail] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [gateError, setGateError] = useState("");
  const [inputs, setInputs] = useState<OsdInputs>(DEFAULT_INPUTS);
  const [footprintWidth, setFootprintWidth] = useState("");
  const [footprintDepth, setFootprintDepth] = useState("");
  const [layout, setLayout] = useState<OsdLayout | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const open = async () => {
      const token = initialToken.trim();
      const response = await fetch(token ? "/api/access" : "/api/access", {
        method: token ? "POST" : "GET",
        headers: token ? { "Content-Type": "application/json" } : undefined,
        body: token ? JSON.stringify({ token }) : undefined,
      });
      if (cancelled) return;
      if (response.ok) {
        const body = (await response.json()) as { email?: string };
        setBuyerEmail(body.email || "");
        setGate("ready");
        if (token) {
          const url = new URL(window.location.href);
          url.searchParams.delete("token");
          window.history.replaceState({}, "", url.pathname);
        }
        return;
      }
      setGate("anon");
    };
    void open();
    return () => {
      cancelled = true;
    };
  }, [initialToken]);

  const recover = async (event: FormEvent) => {
    event.preventDefault();
    setGateError("");
    const response = await fetch("/api/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const body = (await response.json().catch(() => ({}))) as { error?: string; email?: string };
    if (!response.ok) {
      setGateError(body.error || "No se pudo abrir el acceso.");
      return;
    }
    setBuyerEmail(body.email || email);
    setGate("ready");
  };

  const generate = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setPending(true);
    const width = footprintWidth.trim() === "" ? null : Number(footprintWidth);
    const depth = footprintDepth.trim() === "" ? null : Number(footprintDepth);
    const payload: OsdInputs = {
      ...inputs,
      footprintWidthM: width !== null && Number.isFinite(width) ? width : null,
      footprintDepthM: depth !== null && Number.isFinite(depth) ? depth : null,
    };
    try {
      const response = await fetch("/api/layouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: payload }),
      });
      const body = (await response.json().catch(() => ({}))) as { error?: string; layout?: OsdLayout };
      if (!response.ok || !body.layout) {
        setLayout(null);
        setError(body.error || "No se pudo generar el layout.");
        return;
      }
      setLayout(body.layout);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-px mx-auto flex max-w-6xl items-center justify-between py-4">
          <Link href="/">
            <Logo />
          </Link>
          <p className="text-xs text-slate-500">Sólidos orales · 1.000.000 comprimidos/mes</p>
        </div>
      </header>
      <main className="container-px mx-auto max-w-6xl py-10">
        <p className="font-mono text-xs uppercase tracking-wider text-blue-800">Escenario único</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">Layout conceptual de comprimidos recubiertos</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          La forma y la capacidad están fijas. El motor es determinista: mismas entradas, mismo plano.
          El resultado es un layout conceptual y requiere revisión experta. No sustituye el encargo de tres variantes.
        </p>

        {gate === "checking" ? <p className="mt-8 text-sm text-slate-500">Comprobando el acceso…</p> : null}

        {gate === "anon" ? (
          <form onSubmit={recover} className="mt-8 max-w-md space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-display text-lg font-semibold">Acceso de compra</h2>
            <p className="text-sm text-slate-600">
              Escriba el email con el que pagó. En esta versión, conocer ese email abre el escenario: no hay un segundo factor.
            </p>
            <label className="block text-sm font-medium">
              Email
              <input className={fieldClass} type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            {gateError ? <p className="text-sm text-rose-700">{gateError}</p> : null}
            <button type="submit" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
              Entrar
            </button>
            <p className="text-sm">
              <Link href="/#escenario" className="text-blue-800 underline">
                Comprar el escenario
              </Link>
            </p>
          </form>
        ) : null}

        {gate === "ready" ? (
          <form onSubmit={generate} className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2">
            <p className="md:col-span-2 text-sm text-slate-600">Sesión de {buyerEmail || "la compra"}.</p>
            <label className="text-sm font-medium">
              Forma farmacéutica
              <input className={fieldClass} value="Comprimido recubierto (pelicular)" disabled readOnly />
            </label>
            <label className="text-sm font-medium">
              Capacidad
              <input className={fieldClass} value="1.000.000 comprimidos / mes" disabled readOnly />
            </label>
            <label className="text-sm font-medium">
              Grado objetivo
              <input className={fieldClass} value="Grado D / ISO 8" disabled readOnly />
            </label>
            <label className="text-sm font-medium">
              Turnos por día
              <select
                className={fieldClass}
                value={inputs.shiftsPerDay}
                onChange={(event) => setInputs({ ...inputs, shiftsPerDay: Number(event.target.value) })}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
              </select>
            </label>
            <label className="text-sm font-medium">
              Días laborables / mes
              <input
                className={fieldClass}
                type="number"
                min={18}
                max={23}
                value={inputs.workingDaysPerMonth}
                onChange={(event) => setInputs({ ...inputs, workingDaysPerMonth: Number(event.target.value) })}
              />
            </label>
            <label className="text-sm font-medium">
              Peso del comprimido (mg)
              <input
                className={fieldClass}
                type="number"
                min={100}
                max={800}
                value={inputs.tabletWeightMg}
                onChange={(event) => setInputs({ ...inputs, tabletWeightMg: Number(event.target.value) })}
              />
            </label>
            <label className="text-sm font-medium">
              Vía
              <select
                className={fieldClass}
                value={inputs.route}
                onChange={(event) =>
                  setInputs({ ...inputs, route: event.target.value === "direct-compression" ? "direct-compression" : "wet" })
                }
              >
                <option value="wet">Granulación húmeda</option>
                <option value="direct-compression">Compresión directa</option>
              </select>
            </label>
            <label className="text-sm font-medium">
              Contención (OEB)
              <select
                className={fieldClass}
                value={inputs.oeb}
                onChange={(event) => setInputs({ ...inputs, oeb: Number(event.target.value) })}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </label>
            <label className="text-sm font-medium">
              Huella disponible, ancho (m, opcional)
              <input className={fieldClass} inputMode="decimal" value={footprintWidth} onChange={(event) => setFootprintWidth(event.target.value)} />
            </label>
            <label className="text-sm font-medium">
              Huella disponible, fondo (m, opcional)
              <input className={fieldClass} inputMode="decimal" value={footprintDepth} onChange={(event) => setFootprintDepth(event.target.value)} />
            </label>
            <div className="md:col-span-2">
              <button type="submit" disabled={pending} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                {pending ? "Generando…" : "Generar layout"}
              </button>
              {error ? <p className="mt-3 text-sm text-rose-700">{error}</p> : null}
            </div>
          </form>
        ) : null}

        {layout ? (
          <div className="mt-10">
            <LayoutResult layout={layout} />
          </div>
        ) : null}
      </main>
    </div>
  );
}
