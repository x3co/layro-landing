# LayoutGMP — conceptual GMP layout landing

Spanish-first site for a service that prepares conceptual GMP plant layouts: options drafted with IA, review by a team of experts, 2D plans, and an interactive 3D model.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and react-three-fiber.

## Brand, price, and domain

Edit `config/site.ts`:

- `BRAND_NAME` — `LayoutGMP`. This is the only place the visible name is defined.
- `siteUrl` — `https://layoutgmp.com`. Canonical URLs, metadata, Open Graph, the sitemap, and JSON-LD use this origin.
- `PRICE_FROM_LABEL` — currently `Desde USD X`.

Spanish copy says **IA**. The English toggle says **AI**. `plantagmp.com` is not a canonical host in this app; it is expected to redirect to `https://layoutgmp.com` later.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The page is Spanish by default. The header switches copy to English in the browser. That toggle is not a separate URL.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_CALENDAR_URL` | No | HTTPS link for **Agendar llamada**. If empty, the button is visible and disabled. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | Address on the privacy page. If empty, people are told to use the brief form. |
| `DATABASE_URL` | For briefs, or to sell the scenario | Postgres connection string. Preferred store for brief submissions. Required for orders and generated layouts; a purchase is not stored any other way. |
| `RESEND_API_KEY` | Only without Postgres, briefs only | Resend API key. |
| `RESEND_FROM_EMAIL` | Only without Postgres, briefs only | Verified sender, for example `Briefs <briefs@your-domain.com>`. |
| `BRIEF_NOTIFY_EMAIL` | Only without Postgres, briefs only | Inbox that receives the brief. |
| `NEXT_PUBLIC_HOTMART_CHECKOUT_URL` | No | Hotmart checkout for the oral solid dosage scenario. If empty, the buy button is visible and disabled. |
| `HOTMART_WEBHOOK_TOKEN` | For the webhook | Compared with `X-HOTMART-HOTTOK` or the `hottok` field. If unset, `POST /api/webhooks/hotmart` returns 503. |
| `ADMIN_TOKEN` | For manual payment | `POST /api/admin/mark-paid` with `Authorization: Bearer` or JSON `adminToken`. If unset, the route returns 503. |

Storage rules:

1. If `DATABASE_URL` is set, the brief is inserted into Postgres. Resend is not called.
2. If `DATABASE_URL` is empty, the brief is sent with Resend, and all three Resend variables must be set.
3. If neither path is configured, `POST /api/brief` returns **503** and the form shows the error. It does not pretend the brief was saved.

Vercel Web Analytics is included (`@vercel/analytics`). It is cookieless and only reports once the site is deployed on Vercel. No analytics keys are required in this repo.

## Database

With `DATABASE_URL` set, the first successful configuration creates the table itself (`CREATE TABLE IF NOT EXISTS`). You can also apply it manually:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

The brief table is `briefs`. Optional file uploads (PDF, PNG, JPG, WEBP, max 5 MB) are stored in `file_bytes`. A link can be sent instead of a file. The same script creates `orders` and `layouts` for the oral solid dosage scenario. The order routes also run that SQL on first use, even if the briefs table was created earlier.

Hosted Postgres (Neon, Supabase, RDS) should use TLS. Local Postgres does not:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/briefs
```

## Oral solid dosage scenario

One software scenario: a film-coated tablet plant at exactly 1,000,000 tablets per month. The landing section `#escenario` links to Hotmart and to `/app`. After a paid order exists, `/app` takes the short input form, runs the deterministic engine in `lib/osd/generate.ts`, and shows the plan in 2D and in the existing 3D viewer. Exports are PDF, PNG, and JSON. Every output is labeled **Layout conceptual, requiere revisión experta**.

Assumptions (batch size, cycle times, pressures, room rectangles) are in `lib/osd/assumptions.ts`. The Spanish write-up is `docs/MVP_OSD_1M.md`.

Purchase storage:

1. Hotmart `POST /api/webhooks/hotmart` with a matching token creates a paid order on `PURCHASE_APPROVED`, `PURCHASE_COMPLETE`, or `approved`. Other events return 200 and are ignored. The same transaction id does not create a second order.
2. `POST /api/admin/mark-paid` does the same for a typed email during tests and returns `/app?token=…`.
3. Opening that link, or posting the purchase email to `POST /api/access`, sets an httpOnly cookie `lgmp_access` (30 days). Knowing the purchase email is enough in this version.
4. `POST /api/layouts` generates and stores the layout for that order. Inputs outside the scenario return 422 and a message that starts with `Fuera de alcance de esta versión (v2):`.

The public 3D model on the landing page stays the invented filling-suite example. It is not this plant.

```bash
npm test
```

`npm test` generates the default layout and checks scope rejections. It does not need Postgres.

## Scripts

```bash
npm run dev
npm test
npm run lint
npm run build
npm start
```

## What the page claims

The offer is a conceptual GMP layout in about five days: three options, ISO 14644 / Annex 1 zoning, personnel and material flows, 2D plans, one interactive 3D model of the recommended option, and review by a team of senior engineers specialized in GMP.

It does not claim client logos, testimonials, user counts, BIM export, an API, HVAC design, qualification, or regulatory approval. The 3D viewer and the plan under it are labeled **Ejemplo**. They are an invented filling suite, not a client project.

## Deploy

This repository is ready to import on Vercel and attach to `layoutgmp.com`. Set the environment variables in that project before inviting real briefs. Canonical metadata already points at `https://layoutgmp.com`. Production promotion is a separate decision from opening a preview. `plantagmp.com` should redirect to that origin when the DNS move happens; this app does not serve that redirect.
