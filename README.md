# LAYRO — Landing page

Landing page for **LAYRO**, the AI-powered spatial design platform.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS** and **Framer Motion**. Deploy-ready for Vercel.

## Dev

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Structure

```
app/
  layout.tsx         # fonts, metadata, global layout
  page.tsx           # composition of all sections
  globals.css
components/
  Navbar.tsx
  sections/          # Hero, SocialProof, HowItWorks, Features, Showcase, Pricing, Testimonials, CTA, Footer
  ui/                # Logo, Reveal, NodeField
public/brand/        # SVG brand assets
```

## Brand

- Primary `#1E40AF` · Dark `#1E3A8A` · Accent `#3B82F6` · Light `#60A5FA` · Surface `#DBEAFE` · Ink `#0B0F1A`
- Display: Plus Jakarta Sans · Body: DM Sans · Mono: JetBrains Mono

## Deploy

Push this repo to GitHub and import it in Vercel — no configuration needed (Next.js preset).
