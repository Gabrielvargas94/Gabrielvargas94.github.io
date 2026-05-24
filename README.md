# Gabriel Vargas — Portfolio + CV

Live site: <https://gabrielvargas94.github.io>

Static Astro site optimized for accessibility (WCAG 2.2 AA), classic SEO, and AI/LLM discovery (AEO). Generates per-locale CV artifacts (`cv.md`, `cv.json` JSON Resume, `cv.pdf` tagged), `llms.txt` for AI crawlers, sitemap, hreflang, JSON-LD Person/ProfilePage/FAQPage.

## Stack

- Astro 6.x (static), TypeScript strict
- Zero JS framework — native `<details>` for dropdowns
- SCSS with cascade layers (no `!important`), stylelint enforced
- Content Collections (Zod) per locale (EN/ES/PT)
- astro-icon (Lucide), astro:assets `<Image>`, native Fonts API
- Partytown (worker analytics), astro-compress, view transitions
- Playwright (PDF + tests), axe-core, Lighthouse CI
- `satori` + `@resvg/resvg-js` (OG images)
- Umami analytics (cloud free tier)
- Deployed via GitHub Actions to GitHub Pages

## Local dev

```bash
npm install
npx playwright install chromium
npm run dev          # http://localhost:4321
npm run build        # produces dist/ with all artifacts
npm run test         # all test suites
```

## Repo structure

See `docs/superpowers/specs/2026-05-24-astro-migration-design.md`.
Implementation plan: `docs/superpowers/plans/2026-05-24-astro-migration.md`.
Engineering pre-flight: `docs/engineering-checklist.md`.

## Env vars

| Name | Where | Purpose |
|---|---|---|
| `PUBLIC_UMAMI_ID` | GitHub Secret `UMAMI_WEBSITE_ID` injected at build | Umami site ID; only included in prod builds |

## Artifacts published

- `/` `/es/` `/pt/` — main pages per locale
- `/cv.md` `/es/cv.md` `/pt/cv.md` — plain Markdown CV
- `/cv.json` `/es/cv.json` `/pt/cv.json` — JSON Resume schema
- `/cv.pdf` `/es/cv.pdf` `/pt/cv.pdf` — tagged PDF
- `/llms.txt` `/llms-full.txt` (+ per-locale) — AI crawler manifests
- `/sitemap-index.xml` `/robots.txt` `/og/{locale}.png`

## Archived

- `archive/prototype/` — original HTML+JSX+Babel prototype (preserved).
- `archive/Gabriel_Vargas_CV.pdf` — source-of-truth CV PDF.
