# CLAUDE.md

This file is loaded automatically by Claude Code when working in this repo. Treat its
contents as standing instructions for any task you take here.

## Quick orientation

This is a static Astro 6 site deployed to GitHub Pages: `https://gabrielvargas94.github.io`.
Trilingual (EN/ES/PT) portfolio + CV that doubles as an AEO/GEO-optimized public profile.

## Always

- **Read `AGENTS.md` first** — full conventions live there. This file (CLAUDE.md) is a pointer.
- **Read `docs/engineering-checklist.md`** before writing CSS or markup.
- **SCSS + cascade layers + zero `!important`.** Enforced by `stylelint`.
- **No emails in artifacts.** Build test fails on email pattern in `dist/`.
- **Conventional commits.** `feat(scope):`, `fix(scope):`, `refactor(scope):`, `chore:`, `docs:`, `test(scope):`.
- **Run before committing:** `npx astro check && npm run lint:css`.

## Never

- Add a JS framework runtime (React, Vue, Solid). Astro + vanilla JS only.
- Hardcode emails or phone numbers in any committed file.
- Inline SVG icons when `astro-icon` `lucide:*` covers them.
- Translate brand names, job titles, or technology names in ES/PT content.
- `!important`. Use layers.

## Useful commands

```bash
npm run dev               # local dev
npm run build             # full pipeline (HTML + cv.{md,json,pdf} + llms.txt + OG)
npm run typecheck         # astro check
npm run lint:css          # stylelint
npm run test              # a11y + seo + artifacts + i18n
npm run validate:cv       # JSON Resume schema check vs jsonresume.org
npm run inspect:jsonld    # parse live JSON-LD on a URL
```

## File map (most important)

| Path | Purpose |
|---|---|
| `src/content.config.ts` | Zod schemas for content collections |
| `src/lib/i18n.ts` | `Locale` type, `LOCALES`, `localePath()` |
| `src/lib/seo.ts` | `SITE`, `canonicalUrl()`, `hreflangLinks()`, `ogImageUrl()` |
| `src/content/ui/{en,es,pt}.json` | All UI strings (nav, sections, hero, etc.) |
| `src/content/{profile,experience,certifications,projects}/{en,es,pt}/...md` | Content collections |
| `src/components/sections/*.astro` | Page sections (Hero, IttiSplit, MeliCards, ...) |
| `src/components/ui/Pill.astro` | Universal kicker pill component |
| `src/layouts/BaseLayout.astro` | Default page layout with fonts, JSON-LD, view transitions |
| `astro.config.mjs` | Astro config (i18n, integrations, fonts API, scoped style strategy) |
| `docs/superpowers/specs/2026-05-24-astro-migration-design.md` | Original spec + D1-D28 deltas |
| `docs/engineering-checklist.md` | Non-negotiable engineering rules |

## When you're stuck

If a Claude Code session needs broader context than this repo provides, check the spec doc
post-ship deltas section (D19–D28) — it captures decisions made during implementation that
extend the original D1–D18 spec.

If a build is failing on `dist/` content (email leak test, JSON Resume validation, etc.),
the test suites in `tests/` will tell you what failed and at which file.
