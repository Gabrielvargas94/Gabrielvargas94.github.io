# Gabriel Vargas — Portfolio + CV

> [gabrielvargas94.github.io](https://gabrielvargas94.github.io) — Personal portfolio +
> CV. Static Astro site, trilingual (EN/ES/PT), optimized for accessibility, classic SEO,
> and AI/LLM discovery (AEO/GEO).

[![Build, test, and deploy](https://github.com/Gabrielvargas94/Gabrielvargas94.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/Gabrielvargas94/Gabrielvargas94.github.io/actions/workflows/deploy.yml)
[![Astro](https://img.shields.io/badge/Astro-6.x-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![WCAG 2.2 AA](https://img.shields.io/badge/WCAG-2.2_AA-2a8c4a)](https://www.w3.org/TR/WCAG22/)

## What this is

A single-purpose site that doubles as a CV. Designed so that:

- **Recruiters** can read it, share it, or download a printable PDF.
- **Search engines** can index it cleanly (hreflang, sitemap, schema.org Person + ProfilePage + FAQ).
- **AI crawlers** (GPTBot, ClaudeBot, Perplexity, etc.) get first-class artifacts: `/llms.txt`,
  `/llms-full.txt`, `/cv.md`, `/cv.json` (JSON Resume schema), and a tagged `/cv.pdf`.
- **Humans on phones** get a fast, accessible page (Lighthouse 100/100/100 on desktop,
  ~70–80 on mobile — limited by GitHub Pages free-tier compression and YouTube background embeds).

## Stack

| Layer | Choice |
|---|---|
| Framework | Astro 6 (static) |
| Language | TypeScript strict |
| Styling | SCSS with cascade layers (`@layer reset, base, components, a11y, print`), zero `!important` |
| Linting | `stylelint` + `astro check` |
| Content | Content Collections (Zod-validated) per locale |
| Icons | `astro-icon` (Lucide pack pre-included) |
| Images | `astro:assets` `<Image>` with auto WebP + responsive widths |
| Fonts | Astro native Fonts API (self-hosted Newsreader, Geist, JetBrains Mono) |
| Routing | Astro i18n: `/`, `/es/`, `/pt/`, with `trailingSlash: 'always'` |
| Analytics | Umami cloud, offloaded to a worker via `@astrojs/partytown` |
| Build artifacts | Playwright (tagged PDF), `satori` + `@resvg/resvg-js` (OG images), js-yaml parse |
| Testing | Playwright + `@axe-core/playwright` + Lighthouse CI |
| Deploy | GitHub Actions → GitHub Pages (user site at root) |

## Local development

```bash
nvm use                              # picks Node from .nvmrc
pnpm install
pnpm exec playwright install chromium      # one-time

pnpm run dev                          # http://localhost:4321
pnpm run build                        # HTML + cv.{md,json,pdf} + llms.* + OG + sitemap + robots
pnpm run typecheck                    # astro check
pnpm run lint:css                     # stylelint on **/*.scss
pnpm run test                         # a11y + seo + artifacts + i18n suites
pnpm run validate:cv                  # JSON Resume schema check against jsonresume.org
pnpm run inspect:jsonld <url>         # parse + summarize live JSON-LD blocks
```

## Public artifacts

Each is generated at build time and served by GitHub Pages:

| Path | Purpose |
|---|---|
| `/`, `/es/`, `/pt/` | Main pages, per locale |
| `/cv.md`, `/es/cv.md`, `/pt/cv.md` | Plain Markdown CV — what AI crawlers prefer |
| `/cv.json`, `/es/cv.json`, `/pt/cv.json` | [JSON Resume](https://jsonresume.org/schema/) schema |
| `/cv.pdf`, `/es/cv.pdf`, `/pt/cv.pdf` | Tagged PDF (Playwright `tagged: true`) |
| `/llms.txt`, `/llms-full.txt` (+ per-locale) | AI crawler manifests (llmstxt.org format) |
| `/sitemap-index.xml`, `/sitemap-0.xml` | hreflang-annotated sitemap |
| `/robots.txt` | Explicit allow for GPTBot / ClaudeBot / CCBot / Perplexity / etc. |
| `/og/{locale}.png`, `/{locale}/og/{locale}.png` | OpenGraph images (1200×630, auto-generated) |

## Repo layout

```
.
├── archive/                     # prior HTML+JSX prototype + source-of-truth CV (read-only)
├── docs/
│   ├── engineering-checklist.md # non-negotiable rules for any change
│   ├── a11y-checklist.md
│   ├── manual-qa-checklist.md
│   └── superpowers/{specs,plans}/...
├── public/                      # static assets (gabriel.png, itti-logo.png, favicon, robots.txt)
├── scripts/
│   ├── build-cv-json.mjs        # → dist/cv.json (JSON Resume) per locale
│   ├── build-cv-pdf.mjs         # Playwright → dist/cv.pdf tagged, per locale
│   ├── build-llms.mjs           # → dist/llms.txt + llms-full.txt per locale
│   ├── build-og.mjs             # satori-html + resvg → 1200×630 PNG per locale
│   ├── validate-cv-json.mjs     # ajv schema validation against jsonresume.org
│   └── inspect-jsonld.mjs       # dev helper: parse live JSON-LD blocks
├── src/
│   ├── components/{layout,seo,sections,ui,cv}/...
│   ├── consts/site.ts           # SITE, OWNER, PROFILES, ADDRESS, HREFLANG, KEYWORDS
│   ├── content/                 # profile/, experience/, certifications/, projects/, ui/ × {en,es,pt}
│   ├── content.config.ts        # Zod schemas + glob loaders with locale-aware ids
│   ├── layouts/{BaseLayout,PrintLayout}.astro
│   ├── lib/{i18n,seo,cv-md}.ts
│   ├── pages/{,/es,/pt}/{index.astro,cv.md.ts,cv.json.ts,cv-print/index.astro}
│   └── styles/{global,print}.scss
├── tests/                       # Playwright suites
├── AGENTS.md                    # standing instructions for AI agents + humans
├── CLAUDE.md                    # quick pointer for Claude Code sessions
└── astro.config.mjs
```

## Conventions

See `AGENTS.md` for the standing-instructions ruleset. Highlights:

- SCSS in `@layer components`, no `!important`.
- Astro components, vanilla JS, no client-side framework runtime.
- `astro-icon` for icons, `astro:assets` `<Image>` for raster content.
- One `<h1>` per page. Pill kicker on every section.
- Conventional commits.
- No emails or phone numbers in any public artifact (build test enforces).

## Privacy + contact

LinkedIn is the only public contact path: <https://www.linkedin.com/in/gabriel-vargas/>.
Email exists in profile content but is filtered out of every committed artifact by a
build-time test that fails the build if any `[a-z]+@[a-z]+\.[a-z]+` pattern leaks into
`dist/`.

## Spec + decision history

- `docs/superpowers/specs/2026-05-24-astro-migration-design.md` — original spec (D1–D18)
  plus post-ship deltas (D19–D28) tracking every architectural decision.
- `docs/superpowers/plans/2026-05-24-astro-migration.md` — original 46-task implementation plan.
- `docs/engineering-checklist.md` — pre-flight checklist enforced on every change.

## License

This is a personal site. Code MIT-style permissive for the patterns themselves
(an Astro AEO setup is something you can copy). Content + branding belong to Gabriel Vargas
and is not licensed for reuse.
