# Astro Migration — Gabriel Vargas Portfolio / CV Site

**Date:** 2026-05-24
**Status:** SHIPPED. Site live at <https://gabrielvargas94.github.io>.
**Owner:** Gabriel Vargas

## Post-ship deltas (D19+)

Decisions made during implementation that extend the original D1-D18:

| # | Decision | Rationale |
|---|---|---|
| D19 | SCSS over plain CSS, cascade layers (`@layer reset, base, components, a11y, print`) to eliminate `!important`. Stylelint with `declaration-no-important: true`. | User asked for clean code; layers replace specificity battles. |
| D20 | Extended Astro stack: `@astrojs/mdx`, `astro-icon` (Lucide), `astro:assets <Image>`, native Fonts API (`<Font>`), `@astrojs/partytown` (analytics in worker), `astro-compress`, view transitions (`<ClientRouter />`). `scopedStyleStrategy: 'where'` for layer-cooperative scoped styles. `trailingSlash: 'always'`. | Best-practice Astro idiom not in original plan. |
| D21 | Content collections require `generateId: localizedId` callback. Default glob loader uses filename-stem only → en/itti.md and es/itti.md collide. Custom generator produces `<locale>/<slug>`. | Astro 6 glob loader quirk; without fix, content silently overwrites cross-locale. |
| D22 | `--accent-dark` darkened from `#9c5e36` to `#8a4f2c`. | Original failed axe contrast on `--cream-2` background (4.19:1 vs required 4.5:1). New value passes ≥4.7:1 on cream and cream-2. |
| D23 | `MeliCards` and `SideProject` sections set explicit `background-color: var(--ink)` on the section element. | Axe-core couldn't see through the layered video bg + dark overlay; computed contrast against `body` cream. Solid section background fixes detection. |
| D24 | `LangSwitcher` preserves current page path on locale change. | Honors hreflang contract (annotated alternates promise page-equivalent URLs). |
| D25 | Nav `<script>` registers on `astro:page-load` (re-runs after view transitions) with `astro:before-swap` cleanup. | Without it, scroll-class toggle and burger toggle break after first soft navigation. |
| D26 | YouTube embeds (privacy-enhanced) added to `IttiSplit` Monchis + muv sides as background videos. `pointer-events: none`, scaled to crop chrome. | User-supplied real video assets (post-launch iteration). |
| D27 | itti logo PNG replaces text medallion in IttiSplit. Logo overlays the seam between the two videos, drop-shadow for legibility. Mobile: static centered between stacked videos. | User-supplied logo (post-launch iteration). |
| D28 | Repository named `Gabrielvargas94.github.io` (auto-renamed from initial `personal`). Required exact match for user-site root deploy at `https://gabrielvargas94.github.io/`. | GH Pages naming convention. |

## Operational notes

- Deploy: `git push` on `main` → GH Actions workflow (`Build, test, and deploy`) runs typecheck + lint + build + a11y/seo/artifacts/i18n tests + Lighthouse CI (warn-only) → publishes to GH Pages.
- Umami analytics website ID stored as GH Secret `UMAMI_WEBSITE_ID` (UUID `307bcc05-e257-4a7e-bdcc-cd9aef78b40b`), injected at build as `PUBLIC_UMAMI_ID`, embedded via `type="text/partytown"`.
- All public artifacts validated post-deploy: JSON Resume schema ✅, 2 JSON-LD blocks (ProfilePage+Person+8 worksFor, FAQPage 6 Q's) ✅, sitemap with hreflang ✅, robots.txt AI allowlist ✅.

## Lighthouse scores (live)

| Category | Mobile (CI) | Desktop (browser) | Target | Status |
|---|---|---|---|---|
| Accessibility | 100 | 100 | ≥95 | ✅ |
| Best Practices | 100 | 100 | ≥90 | ✅ |
| SEO | 100 | 100 | ≥95 | ✅ |
| Performance | 66–68 | 100 | ≥90 | ⚠️ mobile warn-only |

Desktop hits all 100s. Mobile lags 22-24 points on Performance due to:

- **GitHub Pages free-tier limits:** no text compression on assets, no custom cache headers. ~243 KB savings achievable only via Cloudflare proxy (requires custom domain — out of scope).
- **YouTube iframes:** lazy-loaded via facade pattern (IntersectionObserver + `requestIdleCallback`); each iframe still pulls ~500 KB of YouTube player JS on intersect and adds ~4.5 s main-thread work. Also prevents bfcache restoration.

Optimizations already applied: PulseDot composited transform animation (was non-composited box-shadow), hero image `fetchpriority="high"` with tightened srcset widths.

Paths to mobile ≥90:
1. Buy custom domain → CF proxy compression + caching (single biggest gain).
2. Replace YouTube backgrounds with self-hosted MP4 (~3 MB each, 5–10× lighter than YT embed runtime, recovers bfcache).
3. Drop view transitions (`<ClientRouter />`) — saves ~2 KB JS + main-thread overhead. UX cost: locale/anchor nav becomes full reloads.

A11y/SEO/Best-Practices at 100 across both viewports is the primary discovery goal for AEO; mobile performance ceiling is documented and accepted.

## Goal

Migrate the existing HTML+JSX+Babel runtime prototype at `C:\Users\gabri\OneDrive\Desktop\Web\` to a static Astro site optimized for:

1. **Accessibility (a11y)** — WCAG 2.2 AA, AAA where feasible.
2. **Classic SEO** — keyword-rich metadata, sitemap, hreflang, Lighthouse SEO ≥95.
3. **AI/LLM discovery (AEO/GEO)** — when an LLM is asked queries like "find me technology roles for managers" or "AI-first engineering leaders in LATAM", Gabriel's site/profile is recommended.
4. **Dual-purpose content** — site doubles as a CV. AI parsing should classify the candidate as senior (Head-of-Engineering tier).

Deployment target: **GitHub Pages**, user site at root: `https://gabrielvargas94.github.io`.

## Decisions log (locked)

| # | Decision | Rationale |
|---|---|---|
| D1 | Deploy: **GitHub Pages**, user site at `https://gabrielvargas94.github.io`. | User-chosen. Static-only OK with Astro `output: 'static'`. |
| D2 | i18n routing: **subpath**, `/` (EN default), `/es/`, `/pt/`. | Astro nativo, cleanest SEO, simple `hreflang`. |
| D3 | Tweaks panel: **dropped**. Locked values: `photoPos: "right"`, `accent: "#c97a4b"`. | Prototype-only feature; not for prod. |
| D4 | Interactivity framework: **none**. Astro + vanilla JS + `<details>`/`<summary>`. | Best perf/a11y; minimal JS for crawlers. |
| D5 | Content source: **Content Collections** (MD/MDX per locale + Zod schemas). | Best AEO — IAs parse MD trivially; type-safe access. |
| D6 | CV artifact formats: `/llms.txt`, `/llms-full.txt`, `/cv.md`, `/cv.pdf`, `/cv.json` (JSON Resume schema). Per-locale. | Maximum parseability across AI crawlers and human recruiters. |
| D7 | Target queries: "Head of Engineering", "VP Engineering", "Director of Engineering", "Engineering Manager", "Senior Engineering Manager", "AI-first engineering leader", "Claude Code adoption". Geo: LATAM + US + global remote (non-exclusive). | User-defined positioning. |
| D8 | Open-to-work signal: **passive**. No banner, no `seekingEmployment` flag. Positioning only. | User prefers no overt availability flag. |
| D9 | Contact channel (site): **LinkedIn only**. No email visible anywhere on web pages or CV artifacts. | User explicitly excluded email exposure. |
| D10 | Analytics: **Umami cloud free tier**. | Free, privacy-friendly, source/referrer included. No custom domain needed. |
| D11 | Videos: **Stylized placeholders now**, markup ready for `<video>` swap later. | No real footage yet; preserves perf. |
| D12 | Repo layout: Astro in `Web/` root. Prototype moved to `archive/prototype/` (preserved). | User wants nothing lost. |
| D13 | Build pipeline approach: **Astro SSG + Playwright** for PDF. | Fully automated, single source of truth. |
| D14 | Hero display title: **"Head of Engineering"** (new role user is about to sign elsewhere). Schema.org `jobTitle` also `"Head of Engineering"`. **itti experience entry stays as `"Software Engineering Manager"`** (real title there). | User confirmed incoming Head of Engineering signing; itti remains SEM on record. |
| D15 | OG images: **Dynamic generation** at build (`satori-html`/`@vercel/og`) per page/locale. | Auto-stays-in-sync with copy. |
| D16 | All CTAs and `basics.url` in JSON Resume: **LinkedIn**. | User wants all paths funnel to LinkedIn. |
| D17 | Schema.org `Person.url`: LinkedIn. `Person.sameAs`: [github.io site, github profile]. | Aligns with D16; site URL still discoverable via sameAs. |
| D18 | GH Pages source: **GitHub Actions** (not `gh-pages` branch). | Astro docs current recommendation. |

## Design decisions log (potential adjustments)

These are decisions I made that may need revisiting if visual/functional outcome is off:

1. **Accent-dark `#9c5e36` introduced for text use.** Original accent `#c97a4b` on cream `#f7f2e8` is ~3.0:1, fails WCAG AA for normal text. Accent-dark calculates ~4.8:1 → AA pass. Side-effect: CTAs/badges with text will look ~20% darker than prototype.
   - **Fallback options if visually off:** (a) Use ink color on cream with accent border only; (b) Keep accent only on bold ≥24px headlines (where 3:1 is acceptable); (c) Adjust cream slightly darker so accent contrast rises.

2. **Hero display title = "Head of Engineering"** (incoming role at another company). CV "Experience" entries keep "Software Engineering Manager" at itti (true title there). No conflict — hero shows current/imminent positioning; experience shows accurate history.

3. **`prefers-reduced-motion: reduce` kills most animations.** Default users keep full motion (this is opt-in OS preference, not default behavior).
   - **No expected friction.** Documented only for clarity.

## Architecture

### Directory layout (final state)

```
Web/                                  # repo root → Gabrielvargas94.github.io
├── archive/
│   ├── prototype/                    # original HTML+JSX (read-only, gitignored from build)
│   └── Gabriel_Vargas_CV.pdf         # source-of-truth CV PDF (not published)
├── astro.config.mjs                  # site, i18n, integrations
├── package.json
├── tsconfig.json
├── playwright.config.ts
├── .lighthouserc.json
├── .github/workflows/deploy.yml      # build + Playwright + a11y/SEO tests + deploy
├── public/
│   ├── assets/gabriel.png
│   ├── robots.txt
│   └── favicon.svg
├── scripts/
│   ├── build-cv-pdf.mjs              # Playwright HTML→PDF (tagged), per locale
│   ├── build-cv-json.mjs             # Content Collections → JSON Resume schema, per locale
│   ├── build-llms.mjs                # Content Collections → llms.txt + llms-full.txt
│   └── build-og.mjs                  # satori-html OG images per page/locale
├── src/
│   ├── content/
│   │   ├── config.ts                 # Zod schemas
│   │   ├── profile/{en,es,pt}.md
│   │   ├── experience/{en,es,pt}/{itti,muv,monchis,meli,idb,qupos,gm2,freelance}.md
│   │   ├── certifications/{en,es,pt}/{claude-101,claude-code-101,claude-code-in-action,mcp-intro,subagents-intro,agent-skills-intro,mcp-advanced,building-with-claude-api}.md
│   │   ├── projects/{en,es,pt}/{dnd-companion,lectures}.md
│   │   └── ui/{en,es,pt}.json        # micro-copy
│   ├── layouts/
│   │   ├── BaseLayout.astro          # head, meta, JSON-LD slot, skip link
│   │   └── PrintLayout.astro         # /cv-print render layout
│   ├── components/
│   │   ├── layout/{Nav,LangSwitcher,Footer,SkipLink}.astro
│   │   ├── seo/{BaseMeta,JsonLd,FaqSchema}.astro
│   │   ├── sections/{Hero,IttiSplit,MeliCards,IDBSection,AIIntro,Lectures,IttiAI,SideProject,Certifications,HobbiesIntro,DnD,Spirituality,Contact}.astro
│   │   ├── ui/{Icon,VideoPlaceholder,CTAButton,PulseDot,RecDot,D20}.astro
│   │   └── content/{ExperienceCard,CertCard,ProjectCard}.astro
│   ├── pages/
│   │   ├── index.astro               # EN at /
│   │   ├── es/index.astro
│   │   ├── pt/index.astro
│   │   ├── cv.md.ts                  # endpoint EN
│   │   ├── es/cv.md.ts
│   │   ├── pt/cv.md.ts
│   │   ├── cv.json.ts                # endpoint EN
│   │   ├── es/cv.json.ts
│   │   ├── pt/cv.json.ts
│   │   ├── llms.txt.ts
│   │   ├── llms-full.txt.ts
│   │   ├── es/llms.txt.ts
│   │   ├── es/llms-full.txt.ts
│   │   ├── pt/llms.txt.ts
│   │   ├── pt/llms-full.txt.ts
│   │   └── cv-print/                 # noindex pages used by Playwright PDF builder
│   ├── styles/
│   │   ├── global.css
│   │   └── print.css
│   └── lib/
│       ├── seo.ts                    # canonical, hreflang, OG URL builders
│       ├── i18n.ts                   # locale helpers
│       └── content.ts                # typed content loaders
├── tests/
│   ├── a11y.spec.ts                  # axe-core per route per locale
│   ├── seo.spec.ts                   # meta/og/jsonld
│   ├── artifacts.spec.ts             # JSON Resume valid + no email leaks
│   └── i18n.spec.ts                  # hreflang correctness
├── docs/
│   ├── superpowers/specs/
│   │   └── 2026-05-24-astro-migration-design.md  # this file
│   ├── a11y-checklist.md
│   └── manual-qa-checklist.md
└── README.md
```

### Content model

Content Collections via `src/content/config.ts` (Zod schemas):

```ts
import { defineCollection, z } from 'astro:content';

const profile = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    displayTitle: z.string(),       // "Head of Engineering"
    realTitle: z.string(),          // "Software Engineering Manager"
    company: z.string(),            // "itti"
    location: z.string(),
    openTo: z.array(z.string()),    // ["Remote", "Relocation"]
    linkedin: z.string().url(),
    github: z.string().url(),
    yearsExperience: z.number(),
    summary: z.string(),
    achievements: z.array(z.string()),
  }),
});

const experience = defineCollection({
  type: 'content',
  schema: z.object({
    company: z.string(),
    title: z.string(),
    startDate: z.string(),          // "2024-07"
    endDate: z.string().optional(), // omitted = Present
    location: z.string().optional(),
    employment: z.enum(['Full-time','Contract','Consultant','Freelance']),
    bullets: z.array(z.string()),
    skills: z.array(z.string()),
    order: z.number(),              // sort key; lower = newer
  }),
});

const certification = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    issuer: z.string(),             // "Anthropic"
    date: z.string(),               // ISO
    url: z.string().url().optional(),
    status: z.enum(['completed','in-progress']),
  }),
});

const project = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    summary: z.string(),
    tech: z.array(z.string()),
    highlights: z.array(z.string()),
    visibility: z.enum(['public','private']),
  }),
});

export const collections = { profile, experience, certification, project };
```

UI micro-copy (`src/content/ui/{lang}.json`) is loaded as a typed JSON record — not a collection.

### i18n routing

`astro.config.mjs`:

```ts
export default defineConfig({
  site: 'https://gabrielvargas94.github.io',
  i18n: {
    defaultLocale: 'en',
    locales: ['en','es','pt'],
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
  },
  integrations: [sitemap({ i18n: { defaultLocale: 'en', locales: { en:'en-US', es:'es-AR', pt:'pt-BR' } } })],
});
```

URLs:
- `/` (EN), `/es/`, `/pt/`
- `/cv.md`, `/es/cv.md`, `/pt/cv.md` (same for `.json`, `.pdf`)
- `/llms.txt`, `/es/llms.txt`, `/pt/llms.txt` (same for `llms-full.txt`)

`<link rel="alternate" hreflang>` per locale + `x-default` → EN in every page `<head>`.

Lang switcher uses real `<a href>` to the alternate locale's URL (no JS, SEO-friendly).

## AEO/SEO/AI-discovery layer

### 1. `robots.txt`

Explicit allow for AI crawlers (current as of 2026-05):

```
User-agent: GPTBot
User-agent: ChatGPT-User
User-agent: OAI-SearchBot
User-agent: ClaudeBot
User-agent: Claude-User
User-agent: Claude-SearchBot
User-agent: CCBot
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: Amazonbot
User-agent: Bytespider
User-agent: Meta-ExternalAgent
User-agent: cohere-ai
User-agent: DuckAssistBot
Allow: /

User-agent: *
Allow: /

Sitemap: https://gabrielvargas94.github.io/sitemap-index.xml
```

### 2. `llms.txt` (llmstxt.org format)

Short manifest at root. Links to deep content.

```
# Gabriel Vargas — Head of Engineering

> Engineering leader (6+ yrs). itti, ex-Mercado Libre, ex-IADB. AI-first
> transformations, Claude Code rollouts, architectural redesigns. Based
> Buenos Aires, open to remote + relocation.

## CV
- [Full CV (Markdown)](/cv.md)
- [JSON Resume](/cv.json)
- [PDF](/cv.pdf)

## Experience
- [itti — Software Engineering Manager](/cv.md#itti)
- [Mercado Libre — Project Leader (Tech Lead Manager)](/cv.md#mercado-libre)
- [Inter-American Development Bank — Engineering Manager](/cv.md#idb)
- [muv — Engineering Manager (itti product)](/cv.md#muv)
- [Monchis — Engineering Manager (itti product)](/cv.md#monchis)

## AI work
- [Claude Code adoption at itti](/#itti-ai)
- [Lectures & talks](/#lectures)
- [Side project: D&D AI companion](/#side-project)
- [Certifications (Anthropic)](/#certs)

## Profile
- LinkedIn: https://www.linkedin.com/in/gabriel-vargas/
- GitHub: https://github.com/Gabrielvargas94
```

### 3. `llms-full.txt`

Single fetch concatenation: profile summary + all experience bullets + all certifications + projects + skills. Plain text, no markup overhead. Approx 4-6KB.

### 4. JSON-LD schema.org

Injected via `<JsonLd>` Astro component on every page. Single top-level `@graph` with multiple entities:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": "https://gabrielvargas94.github.io/#profile",
      "mainEntity": { "@id": "https://gabrielvargas94.github.io/#person" },
      "inLanguage": "en",
      "dateModified": "2026-05-24"
    },
    {
      "@type": "Person",
      "@id": "https://gabrielvargas94.github.io/#person",
      "name": "Gabriel Vargas",
      "jobTitle": "Head of Engineering",
      "url": "https://www.linkedin.com/in/gabriel-vargas/",
      "image": "https://gabrielvargas94.github.io/assets/gabriel.png",
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "Universidad Tecnológica Nacional"
      },
      "worksFor": { "@type": "Organization", "name": "itti" },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Buenos Aires",
        "addressCountry": "AR"
      },
      "sameAs": [
        "https://gabrielvargas94.github.io",
        "https://github.com/Gabrielvargas94"
      ],
      "knowsAbout": [
        "Engineering Leadership", "Team Scaling", "AI-first Engineering",
        "Claude Code", "Cursor", "GitHub Copilot",
        "Architectural Refactoring", "Microservices", "Microfrontends",
        "React Native", "React", "Vue", "Angular",
        "AWS", "GCP", "Golang", "Java", "Node.js",
        "High-Concurrency Systems", "Distributed Systems",
        "OKRs", "Roadmap Ownership", "C-Level Communication",
        "Matrix Organization Navigation", "Agile", "Scrum"
      ],
      "knowsLanguage": [
        {"@type":"Language","name":"Spanish","alternateName":"native"},
        {"@type":"Language","name":"English","alternateName":"FCE B2 / Advanced"},
        {"@type":"Language","name":"Portuguese","alternateName":"basic"}
      ],
      "description": "Engineering leader with 6+ years scaling teams at Mercado Libre, the Inter-American Development Bank, and itti. AI-first practitioner driving Claude Code and Cursor adoption while leading architectural transformations.",
      "hasOccupation": {
        "@type": "Occupation",
        "name": "Head of Engineering",
        "occupationLocation": [
          {"@type":"Country","name":"Argentina"},
          {"@type":"Country","name":"United States"},
          {"@type":"AdministrativeArea","name":"Latin America"}
        ]
      }
    },
    {
      "@type": "WorkExperience",
      "name": "Software Engineering Manager",
      "worksFor": {"@type":"Organization","name":"itti"},
      "startDate":"2024-07",
      "skills":"AI adoption, Claude Code rollout, Cursor, Team strategy"
    }
    /* ... one WorkExperience per role ... */
  ]
}
```

Plus on home page: **FAQPage** schema:

```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is Gabriel available for remote engineering leadership roles?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — based in Buenos Aires, Argentina, open to remote and relocation. Available for Head of Engineering, VP Engineering, Director, and Engineering Manager roles."
      }
    },
    {
      "@type": "Question",
      "name": "What is Gabriel's expertise in AI-assisted development?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Embedded in itti's core AI adoption team. Rolling out Claude Code, Cursor, and AI-assisted development workflows across the organization. Certified by Anthropic on Claude Code, MCP, subagents, and agent skills."
      }
    }
    /* ~6 strategic Q&As targeting key queries */
  ]
}
```

### 5. Meta tags + OpenGraph (per page)

Via `BaseMeta.astro`:

- `<title>`: keyword-rich, ≤60 chars. Pattern: `{Name} — {Title} | {Specialty}, ex-{Company}, ex-{Company}`
- `<meta name="description">`: 150-160 chars, role + impact + signal.
- `<meta name="keywords">`: comma list of D7 targets (low SEO weight but used by some AI crawlers).
- `<link rel="canonical">`: per locale.
- OG: `og:type=profile`, `og:title`, `og:description`, `og:image=/og/{locale}.png` (1200×630), `og:locale`, `og:url`.
- `og:profile:first_name`, `og:profile:last_name`.
- Twitter: `summary_large_image`.
- `<link rel="alternate" hreflang>` × 3 + `x-default`.

### 6. Sitemap

`@astrojs/sitemap` with i18n config. Outputs `/sitemap-index.xml` + per-locale `/sitemap-0.xml`. Each entry has `<xhtml:link rel="alternate" hreflang>` annotations.

Excludes: `/cv-print/*` (noindex utility pages).

### 7. Semantic HTML5

- `<header>` site nav (top).
- `<main id="main">` content root.
- `<article>` for each Experience entry, with `<time datetime>`.
- `<section aria-labelledby>` per major content block.
- `<nav aria-label>` for primary nav and footer nav.
- `<footer>` with LinkedIn link + repo source link.
- Lists are real `<ul>`/`<ol>`.

## A11y strategy

**Target:** WCAG 2.2 AA. AAA for primary body text.

### Color & contrast

| Token | Hex | Use | Contrast vs cream | Verdict |
|---|---|---|---|---|
| ink | #2a211b | body text | ~15:1 | AAA |
| ink-2 | #4d4036 | secondary text | ~9:1 | AAA |
| ink-3 | #7a6a5c | captions, micro | ~4.8:1 | AA |
| accent | #c97a4b | decorative, large display | ~3.0:1 | AA large only |
| accent-dark | #9c5e36 | text-on-cream, focus rings | ~4.6:1 | AA (razor-thin; do not lighten) |

CSS variables exposed:

```css
:root {
  --cream: #f7f2e8;
  --cream-2: #efe7d6;
  --paper: #fbf8f1;
  --ink: #2a211b;
  --ink-2: #4d4036;
  --ink-3: #7a6a5c;
  --accent: #c97a4b;          /* decorative only */
  --accent-dark: #9c5e36;     /* AA-compliant text use */
  --accent-light: #e3a76b;    /* backgrounds, gradients */
  --focus-ring: var(--accent-dark);
}
```

### Structure

- `<html lang>` set per page (matches locale).
- Inline foreign words wrapped: `<span lang="es">muv</span>` where needed.
- Skip link first focus: "Skip to main content" → `#main`.
- Exactly one `<h1>` per page.
- Heading hierarchy strict (no skipped levels).
- Landmarks present.

### Keyboard

- Tab order = DOM order.
- Visible focus ring 2px solid `var(--accent-dark)` + 2px offset.
- Nav dropdowns: `<details>`/`<summary>` (Space/Enter native).
- All interactive elements ≥44×44px touch target.
- Lang switcher: real `<a>` links, no JS-only.

### Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Hero grain becomes static gradient. d20 stops rotating. Blobs freeze. REC dot becomes solid. Scan disabled. Pulse dot disabled.

Note: this only fires when user opts in via OS setting. Default visitors see full motion.

### Imágenes & media

- `gabriel.png`: `alt="Gabriel Vargas, Head of Engineering"`.
- Decorative icons: `aria-hidden="true"`.
- When real video is added: `<track kind="captions">` if audio; muted/autoplay/loop with `aria-label`.
- OG images include `og:image:alt`.

### Testing

- **axe-core via Playwright** on every route × every locale. Fail build if `serious` or `critical`.
- **pa11y-ci** secondary pass on sitemap URLs.
- **Lighthouse CI** target a11y ≥95, SEO ≥95, perf ≥90.
- Manual NVDA + VoiceOver walkthrough documented in `docs/manual-qa-checklist.md`.

### Print / PDF a11y

`/cv.pdf` generated with Playwright `tagged: true` → tagged PDF. Screen readers parse headings, lists, reading order.

## Components & islands

**Strategy:** Zero JS framework. Astro components SSR'd to static HTML + ~1KB of vanilla JS where needed.

### Component tree

See `src/components/` in directory layout above.

### Rules

- Every component receives typed props (TypeScript).
- No `client:*` hydration directives anywhere unless absolutely necessary.
- Component-scoped styles via Astro `<style>`.
- Global CSS variables in `src/styles/global.css`.

### Minimal vanilla JS

1. **Nav scrolled state** — toggle `.scrolled` class when `scrollY > 30`. ~10 lines inline.
2. **Mobile nav** — `<details>` or CSS-only `:target` pattern. No JS.
3. **Smooth scroll** — CSS `scroll-behavior: smooth`. No JS.
4. **Dropdowns** — `<details>`/`<summary>` native. No JS.
5. **Umami snippet** — single `<script async>` tag from provider.

Total user-shipped JS: ~1KB own + ~2KB Umami.

### Animations

All CSS keyframes. Respect `prefers-reduced-motion`. No JS-driven motion.

### Video placeholders

```astro
---
const { src, poster, label } = Astro.props;
---
{src ? (
  <video autoplay loop muted playsinline poster={poster} preload="metadata" aria-label={label}>
    <source src={src} type="video/mp4" />
  </video>
) : (
  <div class="video-placeholder" aria-label={label}>
    <div class="vid-mesh" />
    <div class="vid-blob vid-blob-a" />
    <div class="vid-blob vid-blob-b" />
    <div class="vid-blob vid-blob-c" />
    <div class="vid-blocks" />
    <div class="vid-scan" />
    <div class="vid-grain" />
  </div>
)}
```

Real-video swap = pass `src` prop. Markup unchanged.

## Build pipeline & artifacts

### Build flow (`npm run build`)

```
1. astro build                        → dist/ (HTML per locale)
2. node scripts/build-cv-json.mjs     → dist/cv.json + locales
3. node scripts/build-llms.mjs        → dist/llms.txt + llms-full.txt + locales
4. node scripts/build-og.mjs          → dist/og/{locale}.png (1200×630)
5. node scripts/build-cv-pdf.mjs      → dist/cv.pdf + locales (Playwright)
6. astro check + tests                → fail if a11y/type errors
```

### JSON Resume schema (`/cv.json`)

```json
{
  "basics": {
    "name": "Gabriel Vargas",
    "label": "Head of Engineering",
    "url": "https://www.linkedin.com/in/gabriel-vargas/",
    "summary": "Engineering leader with 6+ years scaling teams at Mercado Libre, IADB, itti...",
    "location": { "city": "Buenos Aires", "countryCode": "AR" },
    "profiles": [
      {"network": "LinkedIn", "url": "https://www.linkedin.com/in/gabriel-vargas/"},
      {"network": "GitHub", "url": "https://github.com/Gabrielvargas94"}
    ]
  },
  "work": [ /* per Content Collections experience entries */ ],
  "education": [{
    "institution": "Universidad Tecnológica Nacional",
    "studyType": "B.Sc.",
    "area": "Information Systems Engineering",
    "note": "coursework complete"
  }],
  "skills": [
    {"name": "Leadership & Strategy", "keywords": ["Engineering Leadership", "Team Scaling (8–60+ people)", "Roadmap Ownership", "OKRs", "Strategic Thinking", "Matrix Organization Navigation", "Architectural Strategy"]},
    {"name": "Architecture & Cloud", "keywords": ["Architectural Refactoring", "Microservices & APIs", "Microfrontends", "High-Concurrency Systems", "Distributed Systems", "AWS", "GCP", "High Availability", "Fault Tolerance", "Scalability"]},
    {"name": "Cross-Functional Influence", "keywords": ["C-Level Communication", "Stakeholder Negotiation", "Cross-functional Alignment", "Technical Strategy Presentation"]},
    {"name": "Technologies", "keywords": ["React Native", "React", "Vue", "Angular", "Golang", "Java", "Node.js"]},
    {"name": "Methodology & Culture", "keywords": ["Agile / Scrum", "Results-Driven Execution", "AI-Assisted Development (Claude Code, GitHub Copilot, Cursor)", "Talent Development & Team Growth"]}
  ],
  "languages": [
    {"language": "Spanish", "fluency": "Native"},
    {"language": "English", "fluency": "Advanced (FCE B2)"},
    {"language": "Portuguese", "fluency": "Basic"}
  ],
  "certificates": [ /* Anthropic certs from Content Collections */ ]
}
```

**No `email` field.** No `phone` field. LinkedIn-only contact path per D9.

### `cv.md` endpoint

`src/pages/cv.md.ts` (and per-locale variants):

```ts
export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang ?? 'en';
  const md = await renderCvMd(lang);
  return new Response(md, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
  });
};
```

Sections (with anchor IDs matching llms.txt links):

```markdown
# Gabriel Vargas — Head of Engineering

Buenos Aires, Argentina · Open to Remote & Relocation
LinkedIn: https://www.linkedin.com/in/gabriel-vargas/

## Summary
...

## Selected Achievements
- ...

## Experience

### itti — Software Engineering Manager {#itti}
Jul 2024 – Present · Remote
- ...

### muv (itti product) — Engineering Manager {#muv}
...

### Monchis (itti product) — Engineering Manager {#monchis}
...

### Mercado Libre — Project Leader (Tech Lead Manager) {#mercado-libre}
...

### Inter-American Development Bank — Engineering Manager {#idb}
...

### Qu POS — Sr. Frontend Developer {#qu-pos}
...

### GM2 — Technical Team Lead (Consultant) {#gm2}
...

### Freelance — Frontend & Mobile Developer {#freelance}
...

## Education
Universidad Tecnológica Nacional — B.Sc. Information Systems Engineering (coursework complete)

## Core Skills
**Leadership & Strategy:** ...
**Architecture & Cloud:** ...
**Cross-Functional Influence:** ...
**Technologies:** ...
**Methodology & Culture:** ...

## Certifications
- Cambridge First Certificate in English (FCE, Level B2)
- Anthropic: Claude 101 (2026-04-20)
- Anthropic: Claude Code 101 (2026-04-20)
- ...

## Languages
- Spanish: Native
- English: Advanced (FCE)
- Portuguese: Basic
```

### `cv.pdf` (Playwright tagged PDF)

```js
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
for (const locale of ['en','es','pt']) {
  const prefix = locale === 'en' ? '' : `${locale}/`;
  await page.goto(`http://localhost:4321/${prefix}cv-print`);
  await page.emulateMedia({ media: 'print' });
  await page.pdf({
    path: `dist/${prefix}cv.pdf`,
    format: 'A4',
    margin: { top: '16mm', bottom: '16mm', left: '14mm', right: '14mm' },
    printBackground: true,
    tagged: true,
  });
}
await browser.close();
```

`/cv-print/` pages use `PrintLayout.astro` with `print.css`. Pages have `<meta name="robots" content="noindex">`. Excluded from sitemap.

### OG images (`scripts/build-og.mjs`)

Use `satori-html` + `resvg-js` to render 1200×630 PNG per locale:

```
- /og/en.png
- /og/es.png
- /og/pt.png
```

Template: gabriel.png (left) + name + role + 1-line tag + accent stripe. Same brand language as site.

### `sitemap-index.xml`

Generated by `@astrojs/sitemap`. Includes all locale variants with hreflang.

## Testing & CI

### Test files

```
tests/
├── a11y.spec.ts          # @axe-core/playwright × routes × locales
├── seo.spec.ts           # title, desc, OG tags, JSON-LD present and valid
├── artifacts.spec.ts     # cv.json passes JSON Resume schema; no email leaks
└── i18n.spec.ts          # hreflang correctness, lang attr per locale
```

### Critical assertions

```ts
// artifacts.spec.ts
test('no email leak in any public artifact', async () => {
  const files = ['index.html','es/index.html','pt/index.html','cv.md','cv.json','llms.txt','llms-full.txt'];
  const emailRe = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
  for (const f of files) {
    const content = await fs.readFile(`dist/${f}`, 'utf8');
    expect(content).not.toMatch(emailRe);
  }
});

test('cv.json passes JSON Resume schema', async () => {
  const data = JSON.parse(await fs.readFile('dist/cv.json', 'utf8'));
  await expect(validateAgainst(jsonResumeSchema, data)).resolves.toBeTruthy();
});
```

### CI workflow (`.github/workflows/deploy.yml`)

```yaml
name: Deploy
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npx playwright install chromium --with-deps
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run build
      - run: npm run test:a11y
      - run: npm run test:seo
      - run: npm run test:artifacts
      - run: npm run test:i18n
      - run: npm run test:lhci
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: github-pages
    steps:
      - uses: actions/deploy-pages@v4
```

### Manual checks

Documented in `docs/manual-qa-checklist.md`:

- NVDA + VoiceOver walkthrough EN/ES/PT.
- Keyboard-only full site nav.
- Print preview `cv.pdf` Chrome/Firefox/Safari.
- LinkedIn Post Inspector + Twitter Card Validator on OG.
- `llms.txt` validator (when one exists publicly).
- Schema.org Validator (`validator.schema.org`) on home page JSON-LD.

## Migration plan (high-level)

The detailed implementation plan is produced by the `writing-plans` skill in a follow-up step.

1. Move prototype → `archive/prototype/`.
2. Init Astro project with TypeScript strict.
3. Configure i18n + base in `astro.config.mjs`.
4. Define Content Collections schemas.
5. Migrate content: translations.js + CV PDF → MD/JSON. EN first; ES/PT after.
6. Port prototype components to Astro components (section by section).
7. Implement SEO/AEO layer (JsonLd, BaseMeta, robots, llms.txt scripts, FAQ schema).
8. Implement build scripts (cv.json, cv.md, cv.pdf, OG images).
9. A11y polish: focus styles, contrast verification, axe pass.
10. CI workflow + tests.
11. Init git repo, push to `Gabrielvargas94/Gabrielvargas94.github.io`, enable Pages from Actions.
12. Smoke test live URL.

## Risks

1. **Translations PT incomplete in prototype.** translations.js was not fully audited; may need PT strings to be hand-written. Mitigation: parse during step 5; flag missing keys, fill from ES with `[PT]` markers for user review.
2. **Accent contrast shift** (`#c97a4b` → `#9c5e36` for text). Visual change vs prototype possible. Mitigated by isolating accent to decorative use only; fallback options documented above.
3. **Playwright cold start** in GH Actions: ~30s install. Acceptable.
4. **Email leak**: enforced by build-time test failing build if any `[a-z]+@[a-z]+\.[a-z]+` pattern appears in any public artifact.
5. **Real video swap later**: `<VideoPlaceholder src=...>` API documented; ensure asset paths align when assets arrive.
6. **llms.txt is a non-final spec**: format may evolve. Keep generation script easy to regenerate.
7. **GH Pages cache TTL**: pages can take a few minutes to update after deploy. Document in README.
8. **Umami snippet**: must verify it's allowed for GH Pages domain (no signed origin issues).

## Out of scope

- Real video footage (placeholders ship).
- Custom domain (decision deferred).
- Cloudflare proxy for AI bot detection (rejected due to custom-domain cost).
- Email visible anywhere on web or in CV artifacts.
- "Open to work" banner.
- Multi-page beyond home + CV endpoints + cv-print utility.
- RSS feed.
- Dark mode.
- Analytics dashboards beyond what Umami provides.
