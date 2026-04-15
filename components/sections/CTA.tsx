"use client";

import { Reveal } from "../ui/Reveal";
import { NodeField } from "../ui/NodeField";
import { Logo } from "../ui/Logo";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-primary py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-30 bg-dot-grid bg-[size:24px_24px]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <NodeField className="h-full w-full" density={20} intensity={0.6} />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[50vh] w-[80vw] -translate-x-1/2 rounded-full bg-accent-light/30 blur-3xl"
      />

      <div className="container-px relative z-10 mx-auto max-w-4xl text-center">
        <Reveal>
          <Logo variant="brand-bg" className="mx-auto mb-8 h-10 w-auto" />
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl text-balance">
            Ready to design 10x faster?
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
            Join thousands of engineers who&apos;ve upgraded their workflow.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold text-primary shadow-xl shadow-black/20 transition-transform hover:scale-[1.02]"
            >
              Get started free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              Book a demo
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
