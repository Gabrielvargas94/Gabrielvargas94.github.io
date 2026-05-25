# AGENTS.md

Instructions for AI agents (Claude Code, Cursor, Copilot, ChatGPT, etc.) and human contributors
working on this repository.

## What this repo is

Static Astro site at <https://gabrielvargas94.github.io> — Gabriel Vargas's personal portfolio +
CV, optimized for accessibility (WCAG 2.2 AA), classic SEO, and AI/LLM discovery (AEO/GEO).
EN/ES/PT content. Per-locale CV artifacts (`cv.md`, `cv.json` JSON Resume, `cv.pdf` tagged
PDF) + `llms.txt` for AI crawlers.

## Reading order for first-time contributors

1. `README.md` — what it is, how to run it
2. `docs/engineering-checklist.md` — non-negotiable rules
3. `docs/superpowers/specs/2026-05-24-astro-migration-design.md` — original design + post-ship deltas
4. `src/content.config.ts` — content schemas
5. `src/lib/i18n.ts` and `src/lib/seo.ts` — locale + URL helpers

## Non-negotiable rules (will fail review)

- **No `!important` in SCSS.** Enforced by stylelint. Use `@layer reset, base, components, a11y, print`
  to resolve specificity instead.
- **All component `<style>` blocks must be `<style lang="scss">` and wrapped in `@layer components { ... }`.**
- **No emails anywhere in public artifacts.** Build-time test fails the build if any `[a-z]+@[a-z]+\.[a-z]+`
  pattern leaks into `dist/`. Contact path is **LinkedIn only**.
- **No `client:*` hydration directives.** Astro SSR + vanilla JS only. View transitions via `<ClientRouter />`
  in `BaseLayout`.
- **Icons via `astro-icon` (`<Icon name="lucide:..." />`), not inline SVG.** Exception: decorative
  illustrations like the d20 (custom SVG, documented as exception).
- **Images via `<Image>` from `astro:assets`** for any non-trivial raster. Never raw `<img>` for
  content imagery.
- **Touch targets ≥44×44px** for all interactive elements.
- **One `<h1>` per page** (Hero only). Sections use `<h2>` or `<h3>`. Strict heading hierarchy.
- **TypeScript strict, no `any`.** Use `Locale` from `src/lib/i18n.ts` everywhere.
- **WCAG 2.2 AA contrast.** `--accent-dark` (`#8a4f2c`) for body text on cream;
  `--accent-light` (`#e3a76b`) for body text on ink. Verify if you introduce a new color combo.

## Local dev commands

```bash
npm install
npx playwright install chromium    # one-time
npm run dev                        # http://localhost:4321
npm run build                      # full pipeline: HTML + cv.* + llms.* + OG
npm run typecheck                  # astro check
npm run lint:css                   # stylelint
npm run test                       # a11y + seo + artifacts + i18n
npm run validate:cv                # JSON Resume schema check
npm run inspect:jsonld <url>       # parse live JSON-LD blocks
```

## Branch + commit policy

- **Conventional commits only.** Examples:
  - `feat(section): add IttiSplit overlay scrim`
  - `fix(a11y): kicker contrast on cream-2`
  - `refactor(lib): inline SITE constant`
  - `docs: update spec post-ship deltas`
  - `chore: bump astro to 6.3.7`
- **One logical change per commit.** Smaller is better.
- **Never commit `node_modules/`, `dist/`, `.env*`.** `.gitignore` covers them.
- **Never skip hooks** (`--no-verify`) unless explicitly told to.

## Anti-patterns (do not do)

- Don't add new dependencies without first checking if `astro:assets`, `astro-icon`, or an
  existing dep already covers the need.
- Don't add JS framework runtimes (React, Vue, Solid). Astro SSR + native HTML behaves +
  vanilla JS is the contract.
- Don't use `document.querySelector` directly — wrap in `$`/`$$` from `src/lib/dom.ts`
  for testability (planned helper).
- Don't bypass the engineering checklist for "just a small section".
- Don't translate brand/product names (`Claude Code`, `Cursor`, `itti`, `muv`, `MercadoPago`,
  job titles like `Software Engineering Manager`). Spanish/Portuguese content keeps those
  in English to preserve AEO keyword indexing.

## How to add a new section

1. Add content schema (if needed) to `src/content.config.ts`.
2. Add UI strings to `src/content/ui/{en,es,pt}.json` under `sections.<name>`.
3. Create `src/components/sections/<Name>.astro` following the cascade-layer + Pill kicker pattern.
4. Wire into `src/pages/index.astro`, `src/pages/es/index.astro`, `src/pages/pt/index.astro`.
5. Run `npm run typecheck && npm run lint:css && npm run test` before committing.

## How to add a new locale (future)

1. Append to `LOCALES` in `src/lib/i18n.ts` and `HREFLANG_MAP`.
2. Update `astro.config.mjs` `i18n.locales` and `@astrojs/sitemap` config.
3. Mirror `src/content/{profile,experience,certifications,projects,ui}/<locale>/` from EN.
4. Add page at `src/pages/<locale>/index.astro`.
5. Regenerate artifacts (`npm run build`).

## Where things live

- **Pages**: `src/pages/{,/es,/pt}/index.astro`. CV endpoints in `src/pages/{,/es,/pt}/cv.{md,json}.ts`.
- **Layouts**: `src/layouts/BaseLayout.astro` (default) and `PrintLayout.astro` (CV PDF).
- **Components**: `src/components/{layout,seo,sections,ui,cv}/...`.
- **Content**: `src/content/{profile,experience,certifications,projects,ui}/...`. Schemas in `content.config.ts`.
- **Lib**: `src/lib/{i18n,seo,cv-md}.ts`.
- **Build scripts**: `scripts/build-{cv-json,cv-pdf,llms,og}.mjs`.
- **Styles**: `src/styles/{global,print}.scss`. Component CSS lives inline in `<style lang="scss">`.
- **Specs & plans**: `docs/superpowers/{specs,plans}/...`.

## CI / Deploy

Every push to `main` triggers `.github/workflows/deploy.yml`:

1. `npm ci` + `npx playwright install chromium --with-deps`
2. `astro check` (typecheck)
3. `stylelint` (CSS lint)
4. `npm run build` (HTML + all artifacts)
5. Playwright a11y/seo/artifacts/i18n suites
6. Lighthouse CI (warn-only, mobile)
7. Deploy to GitHub Pages

Tests must pass. Lighthouse mobile target ≥90 performance, ≥95 a11y/SEO/best-practices (currently
≥100 desktop, ~70 mobile due to GH Pages compression limits + YouTube iframe weight — documented).

## Privacy & contact

- LinkedIn (`https://www.linkedin.com/in/gabriel-vargas/`) is the only public contact path.
- Email exists in profile content but is **filtered out of every public artifact** at build.
- Analytics: Umami cloud via Partytown worker. Website ID stored as GH Secret `UMAMI_WEBSITE_ID`.
