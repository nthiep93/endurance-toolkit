# Endurance Toolkit

Free, fast, no-login running calculators — pace, race prediction, VDOT training paces, heart-rate zones,
marathon splits, race fueling, cadence/stride. Built to rank on search, get cited by AI answers, and
monetize with a sponsor slot, affiliates and (later) display ads.

## Stack

- Next.js 16 (App Router, fully static: every tool page is pre-rendered with `generateStaticParams`)
- React 19 client components for the calculators — all math runs in the browser (privacy + $0 server cost)
- Tailwind CSS v4 with design tokens in `src/app/globals.css` (light/dark)
- Vitest for the calculation library

## Architecture

```
src/
  lib/
    site.ts            site constants (name, URL from NEXT_PUBLIC_SITE_URL)
    registry.ts        ← single source of truth: every tool's slug, SEO title/description, keywords, related tools
    calc/              pure calculation library (no React) + unit tests — contract in docs/CALC_API.md
  components/
    tools/             one client component per tool, registered by slug in tools/index.tsx
    ui/                form + result primitives
    AdSlot.tsx         sponsor / display slots (off until NEXT_PUBLIC_ADS_ENABLED=1)
    JsonLd.tsx         safe structured data
  content/guides/      long-form guide + FAQs per tool (rendered under each calculator, FAQPage/HowTo schema)
  app/
    tools/[slug]/      tool page template + per-tool OG image
    sitemap.ts, robots.ts, llms.txt/route.ts, opengraph-image.tsx
    about, privacy, sponsor
docs/
  CALC_API.md          calc library contract
  STRATEGY.md          SEO keyword map, tool backlog, monetization + 90-day distribution plan
```

### Add a new tool (≈1 evening with Claude Code)

1. Add formulas + tests to `src/lib/calc/` and export from `index.ts`.
2. Add an entry to `TOOLS` in `src/lib/registry.ts`.
3. Create `src/components/tools/<Name>.tsx` and register it in `TOOL_COMPONENTS`.
4. Create `src/content/guides/<slug>.ts` and register it in `GUIDES`.
5. `npm test && npm run build` — sitemap, llms.txt, OG image and JSON-LD update automatically.

## Scripts

```bash
npm install --legacy-peer-deps
npm run dev      # http://localhost:3000
npm test         # calc library tests
npm run lint
npm run build    # static production build
```

## Environment

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical production URL (used in sitemap, canonical tags, JSON-LD) |
| `NEXT_PUBLIC_ADS_ENABLED` | `1` to render sponsor/display slots |

## Deploy

Push to GitHub and import the repo in Vercel (framework preset: Next.js). Set `NEXT_PUBLIC_SITE_URL` to
your domain, then submit `https://<domain>/sitemap.xml` in Google Search Console.
