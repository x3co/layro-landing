"use client";

import { motion } from "framer-motion";
import { NodeField } from "../ui/NodeField";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-screen items-center overflow-hidden mesh-bg"
    >
      {/* dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 bg-dot-grid bg-[size:24px_24px]"
        aria-hidden
      />
      {/* node field */}
      <div className="pointer-events-none absolute inset-0">
        <NodeField className="h-full w-full" density={36} />
      </div>
      {/* diagonal shine */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[60vh] w-[80vw] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl"
      />

      <div className="container-px relative z-10 mx-auto w-full max-w-6xl pt-28 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-200 backdrop-blur"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent-light animate-pulse" />
          AI-powered spatial design — now in beta
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="font-display text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl text-balance"
        >
          Design spaces <span className="bg-gradient-to-r from-accent-light via-white to-accent-light bg-clip-text text-transparent">with AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 md:text-xl text-balance"
        >
          From natural language to production-ready layouts. LAYRO generates
          spatial designs for any industry in minutes, not weeks.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href="#pricing"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-black/20 transition-transform hover:scale-[1.02]"
          >
            Try LAYRO free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-0.5">
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="#showcase"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch demo
          </a>
        </motion.div>

        {/* prompt preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto mt-16 max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-md"
        >
          <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-red-400/70" />
            <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
            <span className="h-2 w-2 rounded-full bg-green-400/70" />
            <span className="ml-2 font-mono">layro.ai / new-project</span>
          </div>
          <div className="font-mono text-sm text-slate-200">
            <span className="text-accent-light">&gt;</span>{" "}
            <span className="text-white">
              1,200 m² sterile pharma facility, ISO 7 corridor, 4 clean rooms,
              airlock, warehouse adjacent
            </span>
            <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-white/80" />
          </div>
        </motion.div>
      </div>

      {/* bottom fade */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white/95"
      />
    </section>
  );
}
