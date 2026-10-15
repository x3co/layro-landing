"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Logo } from "@/components/ui/Logo";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [message, setMessage] = useState("");
  const [accessPath, setAccessPath] = useState("");
  const [pending, setPending] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setAccessPath("");
    try {
      const response = await fetch("/api/admin/mark-paid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, adminToken }),
      });
      const body = (await response.json().catch(() => ({}))) as { error?: string; accessPath?: string };
      if (!response.ok || !body.accessPath) {
        setMessage(body.error || "No se pudo marcar el pago.");
        return;
      }
      setAccessPath(body.accessPath);
      setMessage("Pedido marcado como pagado.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-px mx-auto flex max-w-xl items-center justify-between py-4">
          <Link href="/">
            <Logo />
          </Link>
        </div>
      </header>
      <main className="container-px mx-auto max-w-xl py-10">
        <h1 className="font-display text-2xl font-bold text-ink">Marcar compra como pagada</h1>
        <p className="mt-2 text-sm text-slate-600">
          Camino manual para pruebas. El token no se guarda en el navegador. No publica este formulario.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
          <label className="block text-sm font-medium">
            Email del comprador
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm font-medium">
            Token de administración
            <input
              required
              type="password"
              value={adminToken}
              autoComplete="off"
              onChange={(event) => setAdminToken(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <button type="submit" disabled={pending} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {pending ? "Guardando…" : "Marcar como pagado"}
          </button>
          {message ? <p className="text-sm text-slate-700">{message}</p> : null}
          {accessPath ? (
            <p className="text-sm">
              <Link className="text-blue-800 underline" href={accessPath}>
                Abrir la herramienta
              </Link>
            </p>
          ) : null}
        </form>
      </main>
    </div>
  );
}
