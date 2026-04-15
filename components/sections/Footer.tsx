import { Logo } from "../ui/Logo";

const columns = [
  {
    title: "Product",
    links: ["Features", "Pricing", "API", "Changelog"],
  },
  {
    title: "Resources",
    links: ["Docs", "Blog", "Tutorials", "Community"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Contact", "Press"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security", "Cookies"],
  },
];

const socials = [
  {
    name: "Twitter",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2H21.5l-7.5 8.6L22.5 22h-6.83l-5.35-6.54L3.96 22H.7l8.03-9.2L.3 2h6.99l4.84 6.02L18.24 2zm-1.2 18h1.82L7.05 3.92H5.1L17.05 20z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.2 8h4.6v14H.2V8zm7.6 0h4.41v1.91h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.47 3.04 5.47 6.99V22h-4.6v-6.22c0-1.48-.03-3.38-2.06-3.38-2.06 0-2.38 1.61-2.38 3.27V22H7.8V8z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.93c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.38-3.88-1.38-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.3 1.2-3.1-.12-.3-.52-1.5.12-3.12 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.49 3.2-1.18 3.2-1.18.64 1.62.24 2.82.12 3.12.75.8 1.2 1.84 1.2 3.1 0 4.43-2.7 5.4-5.27 5.69.4.35.77 1.05.77 2.12v3.15c0 .31.2.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="relative bg-ink text-slate-400">
      <div className="container-px mx-auto max-w-7xl py-16">
        <div className="grid gap-12 md:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo variant="dark" className="h-8 w-auto" />
            <p className="mt-4 max-w-xs text-sm">
              AI-powered spatial design for every industry. From prompt to
              production-ready layout in minutes.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href="#"
                  aria-label={s.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((c) => (
              <div key={c.title}>
                <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-white">
                  {c.title}
                </div>
                <ul className="space-y-2.5 text-sm">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="transition-colors hover:text-white"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500 md:flex-row md:items-center">
          <span>© 2026 LAYRO. All rights reserved.</span>
          <span className="font-mono">AI-POWERED DESIGN</span>
        </div>
      </div>
    </footer>
  );
}
