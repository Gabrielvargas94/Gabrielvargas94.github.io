# Astro Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the existing HTML+JSX+Babel prototype at `C:\Users\gabri\OneDrive\Desktop\Web\` to a static Astro site optimized for a11y (WCAG 2.2 AA), classic SEO, and AI/LLM discovery (AEO), deployed to `https://gabrielvargas94.github.io`.

**Architecture:** Astro static site, zero JS framework, Content Collections per locale (EN/ES/PT) as content source-of-truth. Generates HTML pages + per-locale `cv.md` / `cv.json` (JSON Resume schema) / `cv.pdf` (Playwright tagged PDF) / `llms.txt` / `llms-full.txt` / OG images. Deployed via GitHub Actions to GitHub Pages.

**Tech Stack:** Astro 4.x, TypeScript (strict), Zod schemas, Playwright (PDF generation + tests), `@axe-core/playwright` (a11y), Lighthouse CI, `@astrojs/sitemap`, `satori-html` + `@resvg/resvg-js` (OG images), Umami (analytics).

**Reference spec:** `docs/superpowers/specs/2026-05-24-astro-migration-design.md` (all decisions D1-D18 locked there).

---

## Phase 1 — Foundation

### Task 1: Archive prototype

**Files:**
- Create: `archive/prototype/`
- Move: existing `Gabriel Vargas - Resume.html`, `*.jsx`, `translations.js`, `assets/`, `uploads/` → `archive/prototype/`
- Move: `Gabriel_Vargas_CV.pdf` → `archive/Gabriel_Vargas_CV.pdf`

- [ ] **Step 1: Create archive directory**

```bash
mkdir -p archive/prototype
```

- [ ] **Step 2: Move prototype files**

```bash
mv "Gabriel Vargas - Resume.html" archive/prototype/
mv app.jsx components.jsx sections-rest.jsx sections-work.jsx tweaks-panel.jsx archive/prototype/
mv translations.js archive/prototype/
mv assets archive/prototype/
mv uploads archive/prototype/
mv Gabriel_Vargas_CV.pdf archive/
```

- [ ] **Step 3: Verify nothing left in root except `archive/`, `docs/`, `.claude/`**

```bash
ls -la
```

Expected: only `.claude/`, `archive/`, `docs/` and dotfiles. No `.jsx`, no HTML, no PNG at root.

- [ ] **Step 4: Initialize git repo**

```bash
git init
git branch -M main
```

- [ ] **Step 5: Create `.gitignore`**

```
node_modules/
dist/
.astro/
.DS_Store
.env
.env.local
*.log
playwright-report/
test-results/
.lighthouseci/
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "chore: archive HTML+JSX prototype before Astro migration"
```

---

### Task 2: Initialize Astro project + install dependencies

**Files:**
- Create: `package.json`, `tsconfig.json`, `astro.config.mjs`, `src/env.d.ts`

- [ ] **Step 1: Initialize Astro (non-interactive)**

```bash
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git --skip-houston --yes
```

Expected: creates `astro.config.mjs`, `package.json`, `tsconfig.json`, `src/env.d.ts`, `src/pages/index.astro`. If prompts appear, accept defaults.

- [ ] **Step 2: Install Astro integrations + dev deps**

```bash
npm install astro @astrojs/sitemap
npm install -D typescript @types/node
npm install -D @playwright/test playwright
npm install -D @axe-core/playwright
npm install -D @lhci/cli
npm install -D linkinator
npm install -D ajv ajv-formats
npm install -D satori-html @resvg/resvg-js
```

- [ ] **Step 3: Verify install**

```bash
npx astro --version
```

Expected: prints Astro version (4.x or 5.x).

- [ ] **Step 4: Add scripts to `package.json`**

Replace the `scripts` object in `package.json` with:

```json
"scripts": {
  "dev": "astro dev",
  "start": "astro dev",
  "build": "astro build && node scripts/build-cv-json.mjs && node scripts/build-llms.mjs && node scripts/build-og.mjs && node scripts/build-cv-pdf.mjs",
  "preview": "astro preview",
  "astro": "astro",
  "typecheck": "astro check",
  "lint": "echo 'lint placeholder — add eslint later if needed'",
  "test:a11y": "playwright test tests/a11y.spec.ts",
  "test:seo": "playwright test tests/seo.spec.ts",
  "test:artifacts": "playwright test tests/artifacts.spec.ts",
  "test:i18n": "playwright test tests/i18n.spec.ts",
  "test:lhci": "lhci autorun",
  "test:links": "linkinator dist --silent --skip 'linkedin.com|github.com'",
  "test": "npm run test:a11y && npm run test:seo && npm run test:artifacts && npm run test:i18n"
}
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: init Astro project + dev dependencies"
```

---

### Task 3: Configure `astro.config.mjs` (site URL + i18n + sitemap)

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Write config**

Replace contents of `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gabrielvargas94.github.io',
  output: 'static',
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'pt'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-US', es: 'es-AR', pt: 'pt-BR' },
      },
      filter: (page) => !page.includes('/cv-print'),
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});
```

- [ ] **Step 2: Run dev server to verify config loads**

```bash
npx astro check 2>&1 | head -20
```

Expected: no config errors. (Type errors about missing `src/pages/index.astro` content can be ignored — we'll replace it.)

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "feat(config): astro i18n + sitemap + canonical site URL"
```

---

### Task 4: Add design tokens + global CSS

**Files:**
- Create: `src/styles/global.css`, `src/styles/print.css`

- [ ] **Step 1: Write `src/styles/global.css`**

```css
:root {
  --cream:        #f7f2e8;
  --cream-2:      #efe7d6;
  --paper:        #fbf8f1;
  --ink:          #2a211b;
  --ink-2:        #4d4036;
  --ink-3:        #7a6a5c;
  --accent:       #c97a4b;
  --accent-dark:  #9c5e36;
  --accent-light: #e3a76b;
  --focus-ring:   var(--accent-dark);

  --serif: "Newsreader", "Source Serif Pro", Georgia, serif;
  --sans:  "Geist", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --mono:  "JetBrains Mono", "SF Mono", Menlo, monospace;
}

* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

html, body {
  margin: 0;
  padding: 0;
  background: var(--cream);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body { overflow-x: hidden; }

img { max-width: 100%; }

::selection { background: var(--accent-dark); color: var(--cream); }

/* Skip link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px 16px;
  background: var(--ink);
  color: var(--cream);
  text-decoration: none;
  z-index: 1000;
  border-radius: 0 0 8px 0;
}
.skip-link:focus { top: 0; }

/* Focus ring */
:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Write `src/styles/print.css`**

```css
@media print {
  :root { --cream: #ffffff; --paper: #ffffff; }
  html, body { background: #fff; color: #000; font-size: 11pt; }
  nav, footer, .no-print { display: none !important; }
  a { color: #000; text-decoration: underline; }
  h1, h2, h3 { page-break-after: avoid; }
  article, section { page-break-inside: avoid; }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/
git commit -m "feat(style): design tokens + a11y-compliant accent-dark + reduced-motion"
```

---

### Task 5: Add i18n + SEO library helpers

**Files:**
- Create: `src/lib/i18n.ts`, `src/lib/seo.ts`

- [ ] **Step 1: Write `src/lib/i18n.ts`**

```ts
export type Locale = 'en' | 'es' | 'pt';
export const LOCALES: Locale[] = ['en', 'es', 'pt'];
export const DEFAULT_LOCALE: Locale = 'en';

export const HREFLANG_MAP: Record<Locale, string> = {
  en: 'en-US',
  es: 'es-AR',
  pt: 'pt-BR',
};

export function localePath(locale: Locale, path = ''): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  if (locale === DEFAULT_LOCALE) return `/${cleanPath}`;
  return `/${locale}/${cleanPath}`;
}

export function getLocaleFromUrl(url: URL): Locale {
  const seg = url.pathname.split('/').filter(Boolean)[0];
  return LOCALES.includes(seg as Locale) ? (seg as Locale) : DEFAULT_LOCALE;
}
```

- [ ] **Step 2: Write `src/lib/seo.ts`**

```ts
import { LOCALES, HREFLANG_MAP, DEFAULT_LOCALE, type Locale, localePath } from './i18n';

const SITE = 'https://gabrielvargas94.github.io';

export function canonicalUrl(locale: Locale, path = ''): string {
  return `${SITE}${localePath(locale, path)}`;
}

export interface HreflangLink { hreflang: string; href: string; }

export function hreflangLinks(path = ''): HreflangLink[] {
  const links: HreflangLink[] = LOCALES.map((l) => ({
    hreflang: HREFLANG_MAP[l],
    href: canonicalUrl(l, path),
  }));
  links.push({ hreflang: 'x-default', href: canonicalUrl(DEFAULT_LOCALE, path) });
  return links;
}

export function ogImageUrl(locale: Locale): string {
  return `${SITE}${locale === DEFAULT_LOCALE ? '' : '/' + locale}/og/${locale}.png`;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/
git commit -m "feat(lib): i18n + SEO helpers (locale paths, hreflang, canonical)"
```

---

## Phase 2 — Content Collections

### Task 6: Content Collections Zod schemas

**Files:**
- Create: `src/content/config.ts`

- [ ] **Step 1: Write `src/content/config.ts`**

```ts
import { defineCollection, z } from 'astro:content';

const profile = defineCollection({
  type: 'content',
  schema: z.object({
    locale: z.enum(['en', 'es', 'pt']),
    name: z.string(),
    displayTitle: z.string(),
    realTitle: z.string(),
    company: z.string(),
    location: z.string(),
    openTo: z.array(z.string()),
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
    locale: z.enum(['en', 'es', 'pt']),
    slug: z.string(),
    company: z.string(),
    title: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    location: z.string().optional(),
    employment: z.enum(['Full-time', 'Contract', 'Consultant', 'Freelance']),
    bullets: z.array(z.string()),
    skills: z.array(z.string()),
    order: z.number(),
  }),
});

const certification = defineCollection({
  type: 'content',
  schema: z.object({
    locale: z.enum(['en', 'es', 'pt']),
    name: z.string(),
    issuer: z.string(),
    date: z.string(),
    url: z.string().url().optional(),
    status: z.enum(['completed', 'in-progress']),
  }),
});

const project = defineCollection({
  type: 'content',
  schema: z.object({
    locale: z.enum(['en', 'es', 'pt']),
    slug: z.string(),
    name: z.string(),
    summary: z.string(),
    tech: z.array(z.string()),
    highlights: z.array(z.string()),
    visibility: z.enum(['public', 'private']),
  }),
});

export const collections = { profile, experience, certification, project };
```

- [ ] **Step 2: Verify types**

```bash
npx astro check 2>&1 | head -30
```

Expected: schemas parse OK. (Errors about missing content files are expected and resolved by next tasks.)

- [ ] **Step 3: Commit**

```bash
git add src/content/config.ts
git commit -m "feat(content): Zod schemas for profile/experience/certification/project"
```

---

### Task 7: Profile content (EN)

**Files:**
- Create: `src/content/profile/en.md`

- [ ] **Step 1: Write file**

```markdown
---
locale: en
name: Gabriel Vargas
displayTitle: Head of Engineering
realTitle: Software Engineering Manager
company: itti
location: Buenos Aires, Argentina
openTo:
  - Remote
  - Relocation
linkedin: https://www.linkedin.com/in/gabriel-vargas/
github: https://github.com/Gabrielvargas94
yearsExperience: 6
summary: >
  Engineering leader with 6+ years scaling teams at Mercado Libre, the
  Inter-American Development Bank, and itti. Currently driving AI-first
  engineering practices (Claude Code, Cursor) while leading architectural
  transformations of complex systems. Building high-trust teams. Trusted by
  senior stakeholders to align cross-functional teams and influence roadmap
  priorities in matrix organizations.
achievements:
  - "AI-first engineering transformation across itti — embedded in a core team rolling out Claude Code, Cursor, and AI-assisted development workflows org-wide."
  - "Scaled high-performing engineering teams through architectural transformation — restructured organizations and designed full platform redesigns across muv, Monchis, Mercado Libre, and IADB, improving stability, performance, and team delivery velocity."
  - "Financial infrastructure & multi-million-dollar operations — co-architected and owned Golang-based financial processing tools at MercadoPago's core, handling daily multi-million-dollar batch workloads."
---

(EN long-form bio paragraph here if needed — currently empty body, all data is in frontmatter.)
```

- [ ] **Step 2: Commit**

```bash
git add src/content/profile/en.md
git commit -m "content(profile): EN profile from CV source-of-truth"
```

---

### Task 8: Experience content (EN — all 8 entries)

**Files:**
- Create: `src/content/experience/en/{itti,muv,monchis,meli,idb,qupos,gm2,freelance}.md`

- [ ] **Step 1: Write `src/content/experience/en/itti.md`**

```markdown
---
locale: en
slug: itti
company: itti
title: Software Engineering Manager
startDate: 2024-07
location: Remote
employment: Full-time
order: 1
bullets:
  - Oversaw strategic engineering initiatives and team performance across key products (Monchis, then muv) within itti's ecosystem.
  - Align engineering, product, and design in a cross-functional environment; negotiate priorities with business stakeholders and engage senior leadership on technical strategy and quarterly planning.
  - "Embedded in a core team (<40 people) driving itti's AI adoption strategy — rolling out Claude Code, Cursor, and AI-assisted development practices across the broader engineering organization."
skills:
  - AI Adoption Strategy
  - Claude Code
  - Cursor
  - Engineering Leadership
  - Technical Strategy
  - People Management
---
```

- [ ] **Step 2: Write `src/content/experience/en/muv.md`**

```markdown
---
locale: en
slug: muv
company: muv (itti product)
title: Engineering Manager
startDate: 2024-12
location: Remote
employment: Full-time
order: 2
bullets:
  - Led a full architectural transformation of a high-concurrency mobile platform (React Native + Java microservices on AWS & GCP), significantly improving system stability and NPS scores.
  - "Introduced AI-assisted development practices (GitHub Copilot, Cursor, Superpowers) across the 12-person team, accelerating delivery cycles and reducing repetitive development overhead."
  - Designed and delivered a micro-apps architecture that decoupled deployments, enabling independent team velocity and reducing cross-team bottlenecks.
  - "Championed engineering quality standards: code review culture, observability tooling, and incident response processes that brought reliability to production-grade levels."
  - Deployed and managed cloud infrastructure on AWS and GCP, ensuring compliance, scalability, and uptime.
skills:
  - React Native
  - Java
  - AWS
  - GCP
  - Micro-apps Architecture
  - High-Concurrency Systems
  - Engineering Leadership
---
```

- [ ] **Step 3: Write `src/content/experience/en/monchis.md`**

```markdown
---
locale: en
slug: monchis
company: Monchis (itti product)
title: Engineering Manager
startDate: 2024-07
endDate: 2024-12
location: Remote
employment: Full-time
order: 3
bullets:
  - Led a full architectural redesign of the mobile platform (React Native + microservices on AWS), achieving stability and performance improvements that impacted user retention.
  - Integrated and modernized legacy systems, enabling new feature development and restoring engineering momentum.
  - Successfully delivered the platform stabilization and architectural redesign, which led to my internal reassignment to the muv product line to replicate these results at greater scale.
skills:
  - React Native
  - AWS
  - Microservices
  - Architectural Redesign
  - Engineering Leadership
---
```

- [ ] **Step 4: Write `src/content/experience/en/meli.md`**

```markdown
---
locale: en
slug: mercado-libre
company: Mercado Libre
title: Project Leader (Tech Lead Manager)
startDate: 2022-05
endDate: 2024-03
location: Argentina
employment: Full-time
order: 4
bullets:
  - "Led a team of 8 engineers across design, delivery, and execution — collaborating directly with technical leads on architecture decisions while owning team performance and roadmap."
  - "Owned and co-architected high-stakes financial processing tools built on Golang, handling daily multi-million-dollar batch workloads at the core of MercadoPago's operations."
  - "Maintained and scaled a critical internal operations platform trusted by 100+ internal teams, central to MercadoPago's core workflows and consolidating data across all business units."
  - Drove adoption and evolution of a frontend framework used as a core standard across the organization, improving reliability and developer experience at scale.
skills:
  - Golang
  - Financial Systems
  - Tech Leadership
  - Engineering Management
  - Distributed Systems
---
```

- [ ] **Step 5: Write `src/content/experience/en/idb.md`**

```markdown
---
locale: en
slug: idb
company: Inter-American Development Bank
title: Engineering Manager
startDate: 2020-03
endDate: 2023-06
employment: Contract
order: 5
bullets:
  - Delivered engineering for multiple projects at one of the world's most influential multilateral development banks.
  - Managed cross-functional teams of 60+ people across engineering, design, product, and policy, ensuring delivery across complex, multi-stakeholder environments.
  - Presented technical strategy and trade-offs to C-level leadership and influenced roadmap priorities across a large matrix organization.
  - Reduced time-to-market by 30% by addressing technical debt and implementing Microfrontend architecture using Angular and Vue, enabling modular, independently deployable frontends across multiple product teams.
  - "Engaged initially as a full-time consultant, then continued as a flexible contractor leading internal projects — a structure that allowed concurrent engagement with Mercado Libre from May 2022 onward."
skills:
  - Microfrontends
  - Angular
  - Vue
  - C-Level Communication
  - Cross-functional Leadership
  - Matrix Organizations
---
```

- [ ] **Step 6: Write `src/content/experience/en/qupos.md`**

```markdown
---
locale: en
slug: qu-pos
company: Qu POS
title: Sr. Frontend Developer
startDate: 2018-11
endDate: 2019-12
location: Washington, D.C. (Remote)
employment: Full-time
order: 6
bullets:
  - Developed a complex configuration system for a restaurant POS platform using Vue, within an international team based in Washington D.C.
  - Contributed to product and engineering improvements that helped establish the company as one of the top players in the U.S. restaurant software market, serving thousands of franchise locations.
skills:
  - Vue
  - Frontend Architecture
---
```

- [ ] **Step 7: Write `src/content/experience/en/gm2.md`**

```markdown
---
locale: en
slug: gm2
company: GM2
title: Technical Team Lead (Consultant)
startDate: 2021-03
endDate: 2021-08
employment: Consultant
order: 7
bullets:
  - Engaged as a technical consultant on a short-term, high-priority project with a critical delivery deadline.
  - Restructured the project architecture, resolved key technical blockers, and led the team to a successful on-time production launch.
skills:
  - Technical Consulting
  - Architectural Refactoring
---
```

- [ ] **Step 8: Write `src/content/experience/en/freelance.md`**

```markdown
---
locale: en
slug: freelance
company: Freelance
title: Frontend & Mobile Developer
startDate: 2014-06
endDate: 2019-12
employment: Freelance
order: 8
bullets:
  - Delivered end-to-end web and mobile projects for clients across multiple industries, with primary focus on Angular, Vue, and React Native.
skills:
  - Angular
  - Vue
  - React Native
---
```

- [ ] **Step 9: Verify all 8 files exist**

```bash
ls src/content/experience/en/
```

Expected: `freelance.md  gm2.md  idb.md  itti.md  meli.md  monchis.md  muv.md  qupos.md`

- [ ] **Step 10: Commit**

```bash
git add src/content/experience/en/
git commit -m "content(experience): all 8 EN entries from CV source-of-truth"
```

---

### Task 9: Certifications content (EN — 8 Anthropic certs + FCE)

**Files:**
- Create: `src/content/certifications/en/*.md`

- [ ] **Step 1: Create 9 cert files**

For each cert, create a file at `src/content/certifications/en/<slug>.md`:

`fce.md`:
```markdown
---
locale: en
name: Cambridge First Certificate in English (FCE, Level B2)
issuer: Cambridge English
date: "2018-01"
status: completed
---
```

`claude-101.md`:
```markdown
---
locale: en
name: Claude 101
issuer: Anthropic
date: "2026-04-20"
status: completed
---
```

`claude-code-101.md`:
```markdown
---
locale: en
name: Claude Code 101
issuer: Anthropic
date: "2026-04-20"
status: completed
---
```

`claude-code-in-action.md`:
```markdown
---
locale: en
name: Claude Code in Action
issuer: Anthropic
date: "2026-04-20"
status: completed
---
```

`agent-skills-intro.md`:
```markdown
---
locale: en
name: Introduction to Agent Skills
issuer: Anthropic
date: "2026-04-20"
status: completed
---
```

`mcp-intro.md`:
```markdown
---
locale: en
name: Introduction to Model Context Protocol
issuer: Anthropic
date: "2026-05-16"
status: completed
---
```

`subagents-intro.md`:
```markdown
---
locale: en
name: Introduction to Subagents
issuer: Anthropic
date: "2026-04-20"
status: completed
---
```

`mcp-advanced.md`:
```markdown
---
locale: en
name: "Model Context Protocol: Advanced Topics"
issuer: Anthropic
date: "2026-04-20"
status: in-progress
---
```

`building-with-claude-api.md`:
```markdown
---
locale: en
name: Building with the Claude API
issuer: Anthropic
date: "2026-04-20"
status: in-progress
---
```

- [ ] **Step 2: Verify**

```bash
ls src/content/certifications/en/ | wc -l
```

Expected: `9`

- [ ] **Step 3: Commit**

```bash
git add src/content/certifications/en/
git commit -m "content(certs): 9 EN certifications (FCE + 8 Anthropic)"
```

---

### Task 10: Projects content (EN — D&D companion + lectures)

**Files:**
- Create: `src/content/projects/en/dnd-companion.md`, `lectures.md`

- [ ] **Step 1: Write `src/content/projects/en/dnd-companion.md`**

```markdown
---
locale: en
slug: dnd-companion
name: D&D AI Companion
summary: >
  A multi-tenant AI companion for tabletop RPG players and Dungeon Masters.
  Handles D&D, Pathfinder, Vampire: the Masquerade, and other rulesets.
  Helps create characters, full campaigns, translate campaigns across rulesets
  or settings (e.g., Forgotten Realms → another setting).
tech:
  - Claude Code API
  - ChatGPT API
  - Graph Architecture (per tenant + campaign)
  - Custom Tools / Harness
  - Agent-as-a-Service
visibility: public
highlights:
  - "Complete graph architecture per tenant, per campaign — with a translation layer between non-compatible graph schemas."
  - "Custom tools, harness in-code and as a product, Agent-as-a-Service (not just SaaS)."
  - Scheduled workflows + multi-provider LLM orchestration (Claude + GPT).
  - Reduces the need to read thousands of pages of source material for a quality RPG experience.
---
```

- [ ] **Step 2: Write `src/content/projects/en/lectures.md`**

```markdown
---
locale: en
slug: lectures
name: AI-First Engineering Lectures
summary: >
  Talks oriented to engineering and management teams on how to operate in an
  AI-first world — beyond "becoming AI-first," covers "management scope"
  problems: code review under AI, recovering from AI-caused production incidents,
  secret management, harness integration, agentic workflows.
tech:
  - Harness
  - Agentic Workflows
  - Claude Code
  - Cursor
visibility: public
highlights:
  - "Topic: Harness and Agentic Workflows."
  - "Topic: Management problems in an AI-first world — code review, incident recovery from AI-caused issues, secret management, harness integration, agentic workflow design."
---
```

- [ ] **Step 3: Commit**

```bash
git add src/content/projects/en/
git commit -m "content(projects): EN D&D companion + lectures"
```

---

### Task 11: UI micro-copy (EN JSON)

**Files:**
- Create: `src/content/ui/en.json`

- [ ] **Step 1: Write `src/content/ui/en.json`**

```json
{
  "nav": {
    "work": "My Work",
    "ai": "My Work with AI",
    "hobbies": "My Hobbies",
    "cta": "Contact me on LinkedIn",
    "lectures": "Lectures",
    "claudeCodeRollout": "Claude Code Rollout",
    "sideProject": "Side Project",
    "certifications": "Certifications",
    "dnd": "Dungeons & Dragons",
    "spirituality": "Spirituality"
  },
  "hero": {
    "kicker": "Head of Engineering",
    "headline": "Building AI-first engineering teams",
    "subhead": "6+ years scaling engineering at Mercado Libre, the Inter-American Development Bank, and itti. AI-first practitioner driving Claude Code and Cursor adoption.",
    "cta": "Contact me on LinkedIn",
    "scrollHint": "Scroll to explore"
  },
  "sections": {
    "ittiSplit": {
      "kicker": "itti · Software Engineering Manager",
      "title": "Two products, one engineering org",
      "left": "Monchis",
      "right": "muv",
      "leftDesc": "Mobile platform architectural redesign that restored engineering momentum.",
      "rightDesc": "High-concurrency mobile platform transformation, AI-assisted dev practices."
    },
    "meli": {
      "kicker": "Mercado Libre · Project Leader",
      "title": "Financial infrastructure at multi-million-dollar scale",
      "cards": [
        { "icon": "money", "title": "Transfers & Debts Tooling", "desc": "Multi-million-dollar batch workloads at the core of MercadoPago." },
        { "icon": "dashboard", "title": "Centralized Dashboard", "desc": "Single pane of glass across MercadoPago's APIs and business units." },
        { "icon": "code", "title": "Frontend Framework", "desc": "Core organizational standard driving reliability and DX at scale." },
        { "icon": "team", "title": "Tech Lead Manager", "desc": "Led teams of 8–12 across architecture, delivery, and roadmap." }
      ]
    },
    "idb": {
      "kicker": "Inter-American Development Bank",
      "title": "Engineering at one of the world's most influential multilateral banks",
      "stats": [
        { "value": "60+", "label": "People managed across eng, design, product, policy" },
        { "value": "30%", "label": "Reduction in time-to-market" },
        { "value": "C-Level", "label": "Direct technical-strategy reporting line" }
      ]
    },
    "aiIntro": {
      "kicker": "AI-First Engineering",
      "title": "Where AI changes how teams ship",
      "desc": "From organization-wide Claude Code rollouts to side projects pushing the boundary of agentic workflows."
    },
    "lectures": {
      "kicker": "Lectures & Talks",
      "title": "Speaking on AI-first engineering",
      "topics": [
        "Harness and Agentic Workflows",
        "Management problems in an AI-first world: code review under AI, incident recovery, secret management, harness integration, agentic workflow design"
      ]
    },
    "ittiAi": {
      "kicker": "Claude Code Rollout",
      "title": "AI adoption across an engineering org",
      "desc": "Embedded in a core team of <40 driving itti's AI adoption — rolling out Claude Code, Cursor, and AI-assisted development workflows across the broader engineering organization."
    },
    "sideProject": {
      "kicker": "Side Project",
      "title": "D&D AI Companion",
      "desc": "Multi-tenant AI companion for tabletop RPG. Graph architecture per tenant/campaign with a translation layer between non-compatible schemas. Custom tools, harness, Agent-as-a-Service."
    },
    "certs": {
      "kicker": "Certifications",
      "title": "Anthropic Claude curriculum",
      "subtitle": "8 Anthropic certifications + Cambridge FCE B2."
    },
    "dnd": {
      "kicker": "Hobbies",
      "title": "Dungeons & Dragons",
      "desc": "Dungeon Master with friends. Organization, creativity, fun — and the seed of the D&D AI Companion side project."
    },
    "spirit": {
      "kicker": "Hobbies",
      "title": "Spirituality",
      "desc": "Studious by nature, focused on non-duality. Applying it day-to-day to deconstruct, become happier, more complete, and a better person."
    },
    "contact": {
      "kicker": "Get in touch",
      "title": "Want to know more about me?",
      "cta": "Contact me on LinkedIn"
    }
  },
  "footer": {
    "copyright": "© {year} Gabriel Vargas",
    "source": "Source on GitHub"
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/content/ui/en.json
git commit -m "content(ui): EN micro-copy strings"
```

---

### Task 12: Spanish (ES) content — profile, experience, certs, projects, UI

**Files:**
- Create: `src/content/profile/es.md`, `src/content/experience/es/*.md`, `src/content/certifications/es/*.md`, `src/content/projects/es/*.md`, `src/content/ui/es.json`

- [ ] **Step 1: Translate profile**

Create `src/content/profile/es.md` mirroring `en.md` structure but with Spanish text. Keep `linkedin`, `github`, dates identical. Key translations:

- `displayTitle: Head of Engineering` (job titles stay in English per industry convention; OR translate to "Director de Ingeniería" — choose ONE. **Use English to preserve keyword indexing.**)
- `realTitle: Software Engineering Manager` (same — keep English)
- `summary`: translate to Spanish.
- `achievements`: translate.
- `openTo: [Remote, "Reubicación"]`

- [ ] **Step 2: Translate experience (8 files)**

Mirror `src/content/experience/en/*.md` to `src/content/experience/es/*.md`. Keep:
- `slug`, `company`, `title` (English titles like "Software Engineering Manager"), dates, `order`, `skills` (skills stay English for keyword recall).
- Translate `bullets[]` to Spanish.

- [ ] **Step 3: Translate certifications (9 files)**

Mirror to `src/content/certifications/es/`. Keep `name` (Anthropic cert names stay English), `issuer`, `date`, `status` identical. No bullets to translate.

- [ ] **Step 4: Translate projects (2 files)**

Mirror to `src/content/projects/es/`. Translate `summary` and `highlights[]`. Keep `name`, `slug`, `tech[]` identical.

- [ ] **Step 5: Translate UI strings**

Mirror `src/content/ui/en.json` → `src/content/ui/es.json`. Translate all visible strings.

- [ ] **Step 6: Verify file counts match EN**

```bash
diff <(ls src/content/experience/en/) <(ls src/content/experience/es/)
diff <(ls src/content/certifications/en/) <(ls src/content/certifications/es/)
diff <(ls src/content/projects/en/) <(ls src/content/projects/es/)
```

Expected: no output (filenames identical).

- [ ] **Step 7: Commit**

```bash
git add src/content/profile/es.md src/content/experience/es/ src/content/certifications/es/ src/content/projects/es/ src/content/ui/es.json
git commit -m "content(es): Spanish translation of profile, experience, certs, projects, UI"
```

---

### Task 13: Portuguese (PT) content — same as ES

**Files:**
- Create: same set as Task 12 but under `pt/` paths.

- [ ] **Step 1: Translate all files to Portuguese (pt-BR)**

Same rules as ES: job titles stay English, skills stay English, Anthropic cert names stay English. Translate `summary`, `bullets[]`, `highlights[]`, UI strings.

- [ ] **Step 2: Verify file counts**

```bash
diff <(ls src/content/experience/en/) <(ls src/content/experience/pt/)
diff <(ls src/content/certifications/en/) <(ls src/content/certifications/pt/)
diff <(ls src/content/projects/en/) <(ls src/content/projects/pt/)
```

Expected: no output.

- [ ] **Step 3: Verify content collections compile**

```bash
npx astro sync
npx astro check 2>&1 | head -30
```

Expected: collections compile without schema errors.

- [ ] **Step 4: Commit**

```bash
git add src/content/profile/pt.md src/content/experience/pt/ src/content/certifications/pt/ src/content/projects/pt/ src/content/ui/pt.json
git commit -m "content(pt): Portuguese translation of profile, experience, certs, projects, UI"
```

---

## Phase 3 — Layouts + SEO scaffolding

### Task 14: SkipLink + BaseLayout

**Files:**
- Create: `src/components/layout/SkipLink.astro`, `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Write `src/components/layout/SkipLink.astro`**

```astro
---
const { label = 'Skip to main content' } = Astro.props;
---
<a class="skip-link" href="#main">{label}</a>
```

- [ ] **Step 2: Write `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import SkipLink from '../components/layout/SkipLink.astro';
import BaseMeta from '../components/seo/BaseMeta.astro';
import JsonLd from '../components/seo/JsonLd.astro';
import FaqSchema from '../components/seo/FaqSchema.astro';
import type { Locale } from '../lib/i18n';

interface Props {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  noindex?: boolean;
  faq?: boolean;
}

const { locale, title, description, path = '', ogImage, noindex = false, faq = false } = Astro.props;
const hreflangAttr = locale === 'en' ? 'en-US' : locale === 'es' ? 'es-AR' : 'pt-BR';
---
<!doctype html>
<html lang={locale}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&family=Geist:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
      rel="stylesheet"
    />
    <BaseMeta locale={locale} title={title} description={description} path={path} ogImage={ogImage} noindex={noindex} />
    <JsonLd locale={locale} />
    {faq && <FaqSchema locale={locale} />}
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <slot name="head" />
  </head>
  <body>
    <SkipLink label={locale === 'en' ? 'Skip to main content' : locale === 'es' ? 'Saltar al contenido' : 'Pular para o conteúdo'} />
    <slot />
  </body>
</html>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/SkipLink.astro src/layouts/BaseLayout.astro
git commit -m "feat(layout): BaseLayout with skip link, fonts, SEO slots"
```

---

### Task 15: BaseMeta SEO component

**Files:**
- Create: `src/components/seo/BaseMeta.astro`

- [ ] **Step 1: Write `src/components/seo/BaseMeta.astro`**

```astro
---
import { canonicalUrl, hreflangLinks, ogImageUrl } from '../../lib/seo';
import type { Locale } from '../../lib/i18n';

interface Props {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  noindex?: boolean;
}

const { locale, title, description, path = '', ogImage, noindex = false } = Astro.props;
const canonical = canonicalUrl(locale, path);
const og = ogImage ?? ogImageUrl(locale);
const links = hreflangLinks(path);
const keywords = [
  'Head of Engineering','VP Engineering','Director of Engineering',
  'Engineering Manager','Senior Engineering Manager','AI-first Engineering',
  'Claude Code','Cursor','Remote Engineering Leader','LATAM','Mercado Libre',
  'Inter-American Development Bank','itti','Architectural Refactoring',
  'Microfrontends','React Native','AWS','GCP','Golang'
].join(', ');
---
<title>{title}</title>
<meta name="description" content={description} />
<meta name="keywords" content={keywords} />
{noindex && <meta name="robots" content="noindex, nofollow" />}
{!noindex && <meta name="robots" content="index, follow, max-image-preview:large" />}
<link rel="canonical" href={canonical} />
{links.map(l => <link rel="alternate" hreflang={l.hreflang} href={l.href} />)}

<meta property="og:type" content="profile" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:image" content={og} />
<meta property="og:image:alt" content="Gabriel Vargas — Head of Engineering" />
<meta property="og:locale" content={locale === 'en' ? 'en_US' : locale === 'es' ? 'es_AR' : 'pt_BR'} />
<meta property="og:profile:first_name" content="Gabriel" />
<meta property="og:profile:last_name" content="Vargas" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={og} />
```

- [ ] **Step 2: Commit**

```bash
git add src/components/seo/BaseMeta.astro
git commit -m "feat(seo): BaseMeta with canonical, hreflang, OG, Twitter Card, keywords"
```

---

### Task 16: JsonLd component (ProfilePage + Person + WorkExperience graph)

**Files:**
- Create: `src/components/seo/JsonLd.astro`

- [ ] **Step 1: Write `src/components/seo/JsonLd.astro`**

```astro
---
import { getCollection, getEntry } from 'astro:content';
import { canonicalUrl } from '../../lib/seo';
import type { Locale } from '../../lib/i18n';

interface Props { locale: Locale; }
const { locale } = Astro.props;

const profile = await getEntry('profile', locale);
const experiences = (await getCollection('experience', (e) => e.data.locale === locale))
  .sort((a, b) => a.data.order - b.data.order);

const profileUrl = canonicalUrl(locale);
const personId = `${profileUrl}#person`;

const workExperience = experiences.map(e => ({
  '@type': 'OrganizationRole',
  roleName: e.data.title,
  startDate: e.data.startDate,
  ...(e.data.endDate ? { endDate: e.data.endDate } : {}),
  memberOf: { '@type': 'Organization', name: e.data.company },
}));

const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfilePage',
      '@id': `${profileUrl}#profile`,
      mainEntity: { '@id': personId },
      inLanguage: locale,
      dateModified: new Date().toISOString().slice(0, 10),
      url: profileUrl,
    },
    {
      '@type': 'Person',
      '@id': personId,
      name: profile!.data.name,
      jobTitle: profile!.data.displayTitle,
      url: profile!.data.linkedin,
      image: `${canonicalUrl('en')}assets/gabriel.png`,
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'Universidad Tecnológica Nacional',
      },
      worksFor: { '@type': 'Organization', name: profile!.data.company },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Buenos Aires',
        addressCountry: 'AR',
      },
      sameAs: [
        canonicalUrl('en'),
        profile!.data.github,
      ],
      knowsAbout: [
        'Engineering Leadership','Team Scaling','AI-first Engineering',
        'Claude Code','Cursor','GitHub Copilot',
        'Architectural Refactoring','Microservices','Microfrontends',
        'React Native','React','Vue','Angular',
        'AWS','GCP','Golang','Java','Node.js',
        'High-Concurrency Systems','Distributed Systems',
        'OKRs','Roadmap Ownership','C-Level Communication',
        'Matrix Organization Navigation','Agile','Scrum',
      ],
      knowsLanguage: [
        { '@type': 'Language', name: 'Spanish', alternateName: 'native' },
        { '@type': 'Language', name: 'English', alternateName: 'FCE B2 / Advanced' },
        { '@type': 'Language', name: 'Portuguese', alternateName: 'basic' },
      ],
      description: profile!.data.summary,
      hasOccupation: {
        '@type': 'Occupation',
        name: profile!.data.displayTitle,
        occupationLocation: [
          { '@type': 'Country', name: 'Argentina' },
          { '@type': 'Country', name: 'United States' },
          { '@type': 'AdministrativeArea', name: 'Latin America' },
        ],
        skills: 'Engineering leadership, AI-first development, Claude Code adoption, architectural transformation',
      },
      hasOccupationalCredential: workExperience,
    },
  ],
};
---
<script type="application/ld+json" set:html={JSON.stringify(graph)} />
```

- [ ] **Step 2: Commit**

```bash
git add src/components/seo/JsonLd.astro
git commit -m "feat(seo): JSON-LD ProfilePage + Person + work history graph"
```

---

### Task 17: FaqSchema component (capture-query Q&As)

**Files:**
- Create: `src/components/seo/FaqSchema.astro`

- [ ] **Step 1: Write file**

```astro
---
import type { Locale } from '../../lib/i18n';
interface Props { locale: Locale; }
const { locale } = Astro.props;

const faqs: Record<Locale, Array<{ q: string; a: string }>> = {
  en: [
    { q: 'Is Gabriel available for remote engineering leadership roles?',
      a: 'Yes — based in Buenos Aires, Argentina, open to remote and relocation. Available for Head of Engineering, VP Engineering, Director, and Engineering Manager roles.' },
    { q: "What is Gabriel's expertise in AI-assisted development?",
      a: "Embedded in itti's core AI adoption team. Rolling out Claude Code, Cursor, and AI-assisted development workflows across the organization. Certified by Anthropic on Claude Code, MCP, subagents, and agent skills." },
    { q: 'What companies has Gabriel led engineering at?',
      a: 'itti (current — Software Engineering Manager), Mercado Libre (Project Leader / Tech Lead Manager), Inter-American Development Bank (Engineering Manager, contract), Qu POS, GM2.' },
    { q: 'What technical domains does Gabriel cover?',
      a: 'Mobile platforms (React Native), microservices (Java, Golang, Node.js), microfrontends (Angular, Vue), cloud (AWS, GCP), high-concurrency and distributed systems, AI-assisted development tooling.' },
    { q: 'How large are the teams Gabriel has led?',
      a: 'Up to 60+ people at the Inter-American Development Bank across engineering, design, product, and policy. 8–12 person engineering teams at Mercado Libre and itti products (muv, Monchis).' },
    { q: 'Is Gabriel open to roles in the United States?',
      a: 'Yes — open to remote and relocation including the United States. Currently based in Buenos Aires, Argentina.' },
  ],
  es: [
    { q: '¿Está Gabriel disponible para roles remotos de liderazgo en ingeniería?',
      a: 'Sí — basado en Buenos Aires, Argentina, abierto a remoto y reubicación. Disponible para roles de Head of Engineering, VP Engineering, Director y Engineering Manager.' },
    { q: '¿Cuál es la experiencia de Gabriel con desarrollo asistido por IA?',
      a: 'Integrado en el equipo central de adopción de IA de itti. Impulsando Claude Code, Cursor y prácticas de desarrollo asistido por IA. Certificado por Anthropic en Claude Code, MCP, subagentes y agent skills.' },
    { q: '¿En qué empresas lideró Gabriel ingeniería?',
      a: 'itti (actual — Software Engineering Manager), Mercado Libre (Project Leader / Tech Lead Manager), Banco Interamericano de Desarrollo (Engineering Manager, contrato), Qu POS, GM2.' },
    { q: '¿Qué dominios técnicos cubre Gabriel?',
      a: 'Plataformas móviles (React Native), microservicios (Java, Golang, Node.js), microfrontends (Angular, Vue), cloud (AWS, GCP), sistemas distribuidos y de alta concurrencia, tooling de desarrollo asistido por IA.' },
    { q: '¿Qué tamaño de equipos lideró Gabriel?',
      a: 'Hasta 60+ personas en el Banco Interamericano de Desarrollo en ingeniería, diseño, producto y política. Equipos de 8–12 personas en Mercado Libre y productos itti (muv, Monchis).' },
    { q: '¿Está Gabriel abierto a roles en Estados Unidos?',
      a: 'Sí — abierto a remoto y reubicación incluyendo Estados Unidos. Actualmente basado en Buenos Aires, Argentina.' },
  ],
  pt: [
    { q: 'Gabriel está disponível para cargos remotos de liderança em engenharia?',
      a: 'Sim — baseado em Buenos Aires, Argentina, aberto a remoto e realocação. Disponível para cargos de Head of Engineering, VP Engineering, Director e Engineering Manager.' },
    { q: 'Qual é a experiência de Gabriel em desenvolvimento assistido por IA?',
      a: 'Integrado no time central de adoção de IA da itti. Liderando rollout de Claude Code, Cursor e práticas de desenvolvimento assistido por IA. Certificado pela Anthropic em Claude Code, MCP, subagents e agent skills.' },
    { q: 'Em quais empresas Gabriel liderou engenharia?',
      a: 'itti (atual — Software Engineering Manager), Mercado Libre (Project Leader / Tech Lead Manager), Banco Interamericano de Desenvolvimento (Engineering Manager, contrato), Qu POS, GM2.' },
    { q: 'Quais domínios técnicos Gabriel cobre?',
      a: 'Plataformas mobile (React Native), microsserviços (Java, Golang, Node.js), microfrontends (Angular, Vue), cloud (AWS, GCP), sistemas distribuídos e de alta concorrência, ferramentas de desenvolvimento assistido por IA.' },
    { q: 'De que tamanho são os times que Gabriel liderou?',
      a: 'Até 60+ pessoas no Banco Interamericano de Desenvolvimento em engenharia, design, produto e política. Times de 8–12 pessoas no Mercado Libre e em produtos itti (muv, Monchis).' },
    { q: 'Gabriel está aberto a cargos nos Estados Unidos?',
      a: 'Sim — aberto a remoto e realocação incluindo os Estados Unidos. Atualmente baseado em Buenos Aires, Argentina.' },
  ],
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs[locale].map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};
---
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

- [ ] **Step 2: Commit**

```bash
git add src/components/seo/FaqSchema.astro
git commit -m "feat(seo): FAQ schema with capture-query Q&As (EN/ES/PT)"
```

---

### Task 18: PrintLayout

**Files:**
- Create: `src/layouts/PrintLayout.astro`

- [ ] **Step 1: Write file**

```astro
---
import '../styles/global.css';
import '../styles/print.css';
import type { Locale } from '../lib/i18n';

interface Props { locale: Locale; title: string; }
const { locale, title } = Astro.props;
---
<!doctype html>
<html lang={locale}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>{title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500&family=Geist:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/PrintLayout.astro
git commit -m "feat(layout): PrintLayout for /cv-print pages (noindex)"
```

---

## Phase 4 — UI primitives + Nav

### Task 19: Icon component (SVG by name)

**Files:**
- Create: `src/components/ui/Icon.astro`

- [ ] **Step 1: Write file**

```astro
---
interface Props { name: string; size?: number; }
const { name, size = 16 } = Astro.props;
const paths: Record<string, string> = {
  linkedin: '<path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>',
  globe: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" fill="none" stroke="currentColor" stroke-width="2"/>',
  chevron: '<path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>',
  arrow_down: '<path d="M12 5v14M5 12l7 7 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  money: '<path d="M3 7h18v10H3z M7 12h.01 M17 12h.01" fill="none" stroke="currentColor" stroke-width="2"/>',
  dashboard: '<rect x="3" y="3" width="7" height="9" fill="none" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="5" fill="none" stroke="currentColor" stroke-width="2"/><rect x="14" y="12" width="7" height="9" fill="none" stroke="currentColor" stroke-width="2"/><rect x="3" y="16" width="7" height="5" fill="none" stroke="currentColor" stroke-width="2"/>',
  code: '<path d="M16 18l6-6-6-6 M8 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2"/>',
  team: '<circle cx="9" cy="7" r="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17" cy="9" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 21v-1c0-3 3-5 6-5s6 2 6 5v1 M14 21v-1c0-2 2-3 4-3s4 1 4 3v1" fill="none" stroke="currentColor" stroke-width="2"/>',
};
const inner = paths[name] ?? '';
---
<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="currentColor"
  aria-hidden="true"
  set:html={inner}
/>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/Icon.astro
git commit -m "feat(ui): Icon component with named SVG paths"
```

---

### Task 20: VideoPlaceholder component

**Files:**
- Create: `src/components/ui/VideoPlaceholder.astro`

- [ ] **Step 1: Write file**

```astro
---
interface Props {
  src?: string;
  poster?: string;
  label: string;
  tint?: string;
}
const { src, poster, label, tint = 'var(--ink-2)' } = Astro.props;
---
{src ? (
  <video autoplay loop muted playsinline preload="metadata" poster={poster} aria-label={label} class="video">
    <source src={src} type="video/mp4" />
  </video>
) : (
  <div class="placeholder" aria-label={label} role="img">
    <div class="mesh" style={`background: radial-gradient(at 30% 40%, ${tint}, transparent 60%), radial-gradient(at 70% 60%, var(--accent-light), transparent 65%);`} />
    <div class="blob a" />
    <div class="blob b" />
    <div class="blob c" />
    <div class="blocks" />
    <div class="scan" />
    <div class="grain" />
    <div class="label">
      <span class="rec-dot" />
      <span>REC · {label}</span>
    </div>
  </div>
)}
<style>
.video, .placeholder {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 12px;
  background: var(--ink);
  color: var(--cream);
}
.mesh {
  position: absolute; inset: 0;
  animation: mesh-drift 18s ease-in-out infinite alternate;
}
@keyframes mesh-drift {
  0%   { filter: hue-rotate(0deg) saturate(0.9) brightness(0.95); transform: scale(1.02); }
  100% { filter: hue-rotate(-12deg) saturate(1.0) brightness(1.0); transform: scale(1.06); }
}
.blob {
  position: absolute;
  width: 60%; aspect-ratio: 1;
  border-radius: 50%;
  filter: blur(40px);
  mix-blend-mode: screen;
  background: var(--accent-light);
}
.blob.a { top: -10%; left: -10%; animation: blob-a 22s ease-in-out infinite alternate; }
.blob.b { bottom: -20%; right: -10%; animation: blob-b 26s ease-in-out infinite alternate; background: var(--accent); }
.blob.c { top: 20%; right: 20%; width: 40%; animation: blob-c 20s ease-in-out infinite alternate; }
@keyframes blob-a { 0% { transform: translate(0,0); } 100% { transform: translate(15%, 10%); } }
@keyframes blob-b { 0% { transform: translate(0,0); } 100% { transform: translate(-15%, -10%); } }
@keyframes blob-c { 0% { transform: translate(0,0); } 100% { transform: translate(-10%, 12%); } }
.blocks {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  mix-blend-mode: overlay;
  animation: blocks-shift 12s linear infinite;
}
@keyframes blocks-shift { 0% { transform: translate(0,0); } 100% { transform: translate(60px, 60px); } }
.scan {
  position: absolute; left: 0; right: 0; height: 60%; top: -60%;
  background: linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%);
  animation: scan 8s linear infinite;
  pointer-events: none; mix-blend-mode: overlay;
}
@keyframes scan { 0% { transform: translateY(0); } 100% { transform: translateY(280%); } }
.grain {
  position: absolute; inset: 0;
  opacity: 0.18;
  pointer-events: none;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E");
  background-size: 220px 220px;
}
.label {
  position: absolute; top: 16px; left: 16px;
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 12px;
  background: rgba(0,0,0,0.45);
  border-radius: 999px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--cream);
}
.rec-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #e3624b;
  animation: rec-blink 1.4s ease-in-out infinite;
}
@keyframes rec-blink { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/VideoPlaceholder.astro
git commit -m "feat(ui): VideoPlaceholder with stylized motion + real-video swap slot"
```

---

### Task 21: Atom components (CTAButton, PulseDot, D20)

**Files:**
- Create: `src/components/ui/CTAButton.astro`, `PulseDot.astro`, `D20.astro`

- [ ] **Step 1: Write `src/components/ui/CTAButton.astro`**

```astro
---
import Icon from './Icon.astro';
interface Props {
  href: string;
  label: string;
  variant?: 'primary' | 'ghost';
  icon?: string;
  external?: boolean;
}
const { href, label, variant = 'primary', icon, external = true } = Astro.props;
---
<a
  href={href}
  class={`cta cta-${variant}`}
  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
>
  {icon && <Icon name={icon} size={16} />}
  <span>{label}</span>
</a>
<style>
.cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 22px;
  border-radius: 999px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.005em;
  transition: transform 0.2s, box-shadow 0.2s;
  min-height: 44px;
}
.cta-primary {
  background: var(--ink);
  color: var(--cream);
}
.cta-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(42,33,27,0.18);
}
.cta-ghost {
  background: transparent;
  color: var(--ink);
  border: 1px solid rgba(42,33,27,0.16);
}
.cta-ghost:hover {
  background: rgba(42,33,27,0.05);
}
</style>
```

- [ ] **Step 2: Write `src/components/ui/PulseDot.astro`**

```astro
<span class="pulse-dot" aria-hidden="true" />
<style>
.pulse-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #5b9a6e;
  box-shadow: 0 0 0 0 rgba(91,154,110,0.5);
  animation: pulse 2s ease-out infinite;
  display: inline-block;
}
@keyframes pulse {
  0%   { box-shadow: 0 0 0 0 rgba(91,154,110,0.5); }
  70%  { box-shadow: 0 0 0 8px rgba(91,154,110,0); }
  100% { box-shadow: 0 0 0 0 rgba(91,154,110,0); }
}
</style>
```

- [ ] **Step 3: Write `src/components/ui/D20.astro`**

```astro
<div class="d20" aria-hidden="true">
  <svg width="80" height="80" viewBox="0 0 100 100">
    <polygon points="50,5 95,30 95,70 50,95 5,70 5,30" fill="none" stroke="var(--accent-dark)" stroke-width="2" />
    <polygon points="50,5 95,70 5,70" fill="var(--accent)" opacity="0.18" />
    <polygon points="50,95 95,30 5,30" fill="var(--accent)" opacity="0.10" />
    <text x="50" y="58" text-anchor="middle" font-family="var(--serif)" font-size="22" fill="var(--ink)">20</text>
  </svg>
</div>
<style>
.d20 { display: inline-block; animation: spin 18s linear infinite; }
@keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
</style>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/CTAButton.astro src/components/ui/PulseDot.astro src/components/ui/D20.astro
git commit -m "feat(ui): CTAButton, PulseDot, D20 atoms"
```

---

### Task 22: Nav + LangSwitcher + Footer

**Files:**
- Create: `src/components/layout/Nav.astro`, `LangSwitcher.astro`, `Footer.astro`

- [ ] **Step 1: Write `src/components/layout/LangSwitcher.astro`**

```astro
---
import Icon from '../ui/Icon.astro';
import { LOCALES, localePath, type Locale } from '../../lib/i18n';
interface Props { current: Locale; }
const { current } = Astro.props;
const labels: Record<Locale, { short: string; long: string }> = {
  en: { short: 'EN', long: 'English' },
  es: { short: 'ES', long: 'Español' },
  pt: { short: 'PT', long: 'Português' },
};
---
<details class="lang">
  <summary aria-label="Change language">
    <Icon name="globe" size={14} />
    <span>{labels[current].short}</span>
  </summary>
  <div class="menu" role="menu">
    {LOCALES.map((l) => (
      <a
        href={localePath(l)}
        role="menuitem"
        aria-current={l === current ? 'page' : undefined}
        class:list={['item', { active: l === current }]}
      >
        <span>{labels[l].long}</span>
        <span class="code">{labels[l].short}</span>
      </a>
    ))}
  </div>
</details>
<style>
.lang { position: relative; }
.lang summary {
  list-style: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border: 1px solid rgba(42,33,27,0.16);
  border-radius: 999px;
  color: var(--ink-2);
  font-size: 13px;
  min-height: 36px;
}
.lang summary::-webkit-details-marker { display: none; }
.menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  background: var(--cream);
  border: 1px solid rgba(42,33,27,0.10);
  border-radius: 14px;
  padding: 6px;
  box-shadow: 0 16px 48px rgba(42,33,27,0.16);
  z-index: 10;
}
.item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 14px;
  border-radius: 8px;
  color: var(--ink-2);
  text-decoration: none;
  font-size: 14px;
}
.item:hover, .item.active { background: rgba(42,33,27,0.06); }
.item .code { font-family: var(--mono); font-size: 11px; color: var(--ink-3); }
</style>
```

- [ ] **Step 2: Write `src/components/layout/Nav.astro`**

```astro
---
import { getEntry } from 'astro:content';
import CTAButton from '../ui/CTAButton.astro';
import LangSwitcher from './LangSwitcher.astro';
import Icon from '../ui/Icon.astro';
import { localePath, type Locale } from '../../lib/i18n';
import uiEn from '../../content/ui/en.json';
import uiEs from '../../content/ui/es.json';
import uiPt from '../../content/ui/pt.json';

interface Props { locale: Locale; }
const { locale } = Astro.props;
const profile = await getEntry('profile', locale);
const ui = locale === 'en' ? uiEn : locale === 'es' ? uiEs : uiPt;
---
<header>
  <nav aria-label="Primary">
    <a href={localePath(locale)} class="brand">
      <span class="mark">g</span>
      <span class="name-block">
        <span class="name">{profile!.data.name}</span>
        <span class="role">{profile!.data.displayTitle}</span>
      </span>
    </a>

    <div class="links">
      <a href="#work" class="link">{ui.nav.work}</a>

      <details class="dropdown">
        <summary>{ui.nav.ai}<Icon name="chevron" size={10} /></summary>
        <div class="menu" role="menu">
          <a href="#lectures" role="menuitem">{ui.nav.lectures}</a>
          <a href="#itti-ai" role="menuitem">{ui.nav.claudeCodeRollout}</a>
          <a href="#side-project" role="menuitem">{ui.nav.sideProject}</a>
          <a href="#certs" role="menuitem">{ui.nav.certifications}</a>
        </div>
      </details>

      <details class="dropdown">
        <summary>{ui.nav.hobbies}<Icon name="chevron" size={10} /></summary>
        <div class="menu" role="menu">
          <a href="#dnd" role="menuitem">{ui.nav.dnd}</a>
          <a href="#spirit" role="menuitem">{ui.nav.spirituality}</a>
        </div>
      </details>
    </div>

    <div class="right">
      <LangSwitcher current={locale} />
      <CTAButton href={profile!.data.linkedin} label={ui.nav.cta} icon="linkedin" />
    </div>
  </nav>
</header>

<script>
  const navEl = document.querySelector('header > nav');
  const onScroll = () => navEl?.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
</script>

<style>
header {
  position: fixed; top: 0; left: 0; right: 0;
  z-index: 100;
}
nav {
  display: flex; align-items: center; justify-content: space-between;
  gap: 24px;
  max-width: 1440px;
  margin: 0 auto;
  padding: 16px clamp(24px, 4vw, 64px);
  border-bottom: 1px solid transparent;
  transition: background .25s, border-color .25s;
}
nav.scrolled {
  background: rgba(247,242,232,0.85);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  border-bottom-color: rgba(42,33,27,0.08);
}
.brand {
  display: flex; align-items: center; gap: 12px;
  text-decoration: none; color: var(--ink);
}
.mark {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--ink); color: var(--cream);
  display: grid; place-items: center;
  font-family: var(--serif); font-size: 16px; font-style: italic;
}
.name { display: block; font-family: var(--serif); font-size: 18px; }
.role { display: block; font-family: var(--mono); font-size: 10px; letter-spacing: 0.18em; color: var(--ink-3); text-transform: uppercase; margin-top: 4px; }
.links { display: flex; align-items: center; gap: 4px; }
.link, .dropdown summary {
  padding: 8px 14px;
  color: var(--ink-2);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  border-radius: 999px;
  cursor: pointer;
  list-style: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.dropdown summary::-webkit-details-marker { display: none; }
.dropdown { position: relative; }
.link:hover, .dropdown summary:hover { background: rgba(42,33,27,0.05); }
.menu {
  position: absolute; top: calc(100% + 8px); left: 0;
  min-width: 240px;
  background: var(--cream);
  border: 1px solid rgba(42,33,27,0.10);
  border-radius: 14px;
  padding: 6px;
  box-shadow: 0 16px 48px rgba(42,33,27,0.16);
  z-index: 10;
}
.menu a {
  display: block;
  padding: 10px 14px;
  border-radius: 8px;
  color: var(--ink-2);
  text-decoration: none;
  font-size: 14px;
}
.menu a:hover { background: rgba(42,33,27,0.05); }
.right { display: flex; align-items: center; gap: 12px; }
@media (max-width: 980px) {
  .links { display: none; }
}
</style>
```

- [ ] **Step 3: Write `src/components/layout/Footer.astro`**

```astro
---
import { getEntry } from 'astro:content';
import type { Locale } from '../../lib/i18n';
import uiEn from '../../content/ui/en.json';
import uiEs from '../../content/ui/es.json';
import uiPt from '../../content/ui/pt.json';
interface Props { locale: Locale; }
const { locale } = Astro.props;
const profile = await getEntry('profile', locale);
const ui = locale === 'en' ? uiEn : locale === 'es' ? uiEs : uiPt;
const year = new Date().getFullYear();
---
<footer>
  <div class="inner">
    <span>{ui.footer.copyright.replace('{year}', String(year))}</span>
    <nav aria-label="Footer">
      <a href={profile!.data.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a href={profile!.data.github} target="_blank" rel="noopener noreferrer">GitHub</a>
      <a href="https://github.com/Gabrielvargas94/Gabrielvargas94.github.io" target="_blank" rel="noopener noreferrer">{ui.footer.source}</a>
    </nav>
  </div>
</footer>
<style>
footer { background: var(--ink); color: var(--cream); margin-top: 80px; }
.inner {
  display: flex; justify-content: space-between; align-items: center;
  max-width: 1440px; margin: 0 auto;
  padding: 32px clamp(24px, 4vw, 64px);
  flex-wrap: wrap; gap: 16px;
  font-size: 13px;
}
footer nav { display: flex; gap: 20px; }
footer a { color: var(--cream); text-decoration: none; opacity: 0.85; }
footer a:hover { opacity: 1; text-decoration: underline; }
</style>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/
git commit -m "feat(layout): Nav (native <details> dropdowns) + LangSwitcher + Footer"
```

---

> **CHECKPOINT 1** — Stop after this commit. Run `npm run dev` and open `http://localhost:4321/`. Page will be blank (no sections yet) but Nav and Footer should render. Review and continue.

---

## Phase 5 — Section components

### Task 23: Hero section

**Files:**
- Create: `src/components/sections/Hero.astro`
- Add: `public/assets/gabriel.png` (copy from `archive/prototype/assets/gabriel.png`)

- [ ] **Step 1: Copy hero image**

```bash
mkdir -p public/assets
cp archive/prototype/assets/gabriel.png public/assets/gabriel.png
```

- [ ] **Step 2: Write `src/components/sections/Hero.astro`**

```astro
---
import { getEntry } from 'astro:content';
import CTAButton from '../ui/CTAButton.astro';
import PulseDot from '../ui/PulseDot.astro';
import type { Locale } from '../../lib/i18n';
import uiEn from '../../content/ui/en.json';
import uiEs from '../../content/ui/es.json';
import uiPt from '../../content/ui/pt.json';

interface Props { locale: Locale; }
const { locale } = Astro.props;
const profile = await getEntry('profile', locale);
const ui = locale === 'en' ? uiEn : locale === 'es' ? uiEs : uiPt;
---
<section id="hero" aria-labelledby="hero-title">
  <div class="grain" aria-hidden="true" />
  <div class="inner">
    <div class="copy">
      <div class="kicker">
        <PulseDot />
        <span>{profile!.data.displayTitle} · {profile!.data.company}</span>
      </div>
      <h1 id="hero-title">{ui.hero.headline}</h1>
      <p class="sub">{ui.hero.subhead}</p>
      <CTAButton href={profile!.data.linkedin} label={ui.hero.cta} icon="linkedin" />
    </div>
    <div class="photo">
      <img src="/assets/gabriel.png" alt={`${profile!.data.name}, ${profile!.data.displayTitle}`} width="520" height="640" />
    </div>
  </div>
</section>
<style>
section {
  position: relative;
  padding: 140px clamp(24px, 4vw, 64px) 100px;
  background: var(--cream);
  overflow: hidden;
}
.grain {
  position: absolute; inset: 0;
  pointer-events: none; opacity: 0.4;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(201,122,75,0.08) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(201,122,75,0.06) 0%, transparent 45%);
}
.inner {
  position: relative;
  max-width: 1440px; margin: 0 auto;
  display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 64px;
  align-items: center;
}
.kicker {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--ink-3);
}
h1 {
  font-family: var(--serif);
  font-size: clamp(40px, 6vw, 80px);
  line-height: 1.05; letter-spacing: -0.02em;
  margin: 24px 0;
  color: var(--ink);
}
.sub {
  max-width: 540px;
  color: var(--ink-2);
  font-size: 18px; line-height: 1.55;
  margin-bottom: 36px;
}
.photo img {
  display: block; width: 100%; height: auto;
}
@media (max-width: 880px) {
  .inner { grid-template-columns: 1fr; gap: 32px; }
  .photo { order: -1; max-width: 380px; }
}
</style>
```

- [ ] **Step 3: Commit**

```bash
git add public/assets/gabriel.png src/components/sections/Hero.astro
git commit -m "feat(section): Hero with photo, displayTitle kicker, LinkedIn CTA"
```

---

### Task 24: IttiSplit section

**Files:**
- Create: `src/components/sections/IttiSplit.astro`

- [ ] **Step 1: Write file**

```astro
---
import VideoPlaceholder from '../ui/VideoPlaceholder.astro';
import type { Locale } from '../../lib/i18n';
import uiEn from '../../content/ui/en.json';
import uiEs from '../../content/ui/es.json';
import uiPt from '../../content/ui/pt.json';

interface Props { locale: Locale; }
const { locale } = Astro.props;
const ui = locale === 'en' ? uiEn : locale === 'es' ? uiEs : uiPt;
const s = ui.sections.ittiSplit;
---
<section id="work" data-screen-label="itti-split" aria-labelledby="itti-split-title">
  <div class="inner">
    <header class="head">
      <span class="kicker">{s.kicker}</span>
      <h2 id="itti-split-title">{s.title}</h2>
    </header>
    <div class="split">
      <article class="side">
        <VideoPlaceholder label={s.left} />
        <h3>{s.left}</h3>
        <p>{s.leftDesc}</p>
      </article>
      <div class="badge" aria-hidden="true">itti</div>
      <article class="side">
        <VideoPlaceholder label={s.right} tint="var(--accent-dark)" />
        <h3>{s.right}</h3>
        <p>{s.rightDesc}</p>
      </article>
    </div>
  </div>
</section>
<style>
section { padding: 100px clamp(24px, 4vw, 64px); background: var(--cream-2); }
.inner { max-width: 1440px; margin: 0 auto; }
.head { text-align: center; margin-bottom: 56px; }
.kicker {
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--ink-3);
}
h2 {
  font-family: var(--serif);
  font-size: clamp(32px, 4.5vw, 56px);
  line-height: 1.1;
  margin: 12px 0 0;
}
.split {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 40px;
  align-items: start;
}
.side {
  display: flex; flex-direction: column; gap: 16px;
}
.side > :first-child { aspect-ratio: 4 / 5; }
.side h3 { font-family: var(--serif); font-size: 24px; margin: 0; }
.side p { color: var(--ink-2); margin: 0; }
.badge {
  align-self: center;
  width: 96px; height: 96px;
  display: grid; place-items: center;
  border-radius: 50%;
  background: var(--ink);
  color: var(--cream);
  font-family: var(--serif);
  font-style: italic;
  font-size: 24px;
}
@media (max-width: 720px) {
  .split { grid-template-columns: 1fr; }
  .badge { order: -1; }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/IttiSplit.astro
git commit -m "feat(section): IttiSplit (Monchis ↔ muv) with itti medallion"
```

---

### Task 25: MeliCards section

**Files:**
- Create: `src/components/sections/MeliCards.astro`

- [ ] **Step 1: Write file**

```astro
---
import VideoPlaceholder from '../ui/VideoPlaceholder.astro';
import Icon from '../ui/Icon.astro';
import type { Locale } from '../../lib/i18n';
import uiEn from '../../content/ui/en.json';
import uiEs from '../../content/ui/es.json';
import uiPt from '../../content/ui/pt.json';

interface Props { locale: Locale; }
const { locale } = Astro.props;
const ui = locale === 'en' ? uiEn : locale === 'es' ? uiEs : uiPt;
const s = ui.sections.meli;
---
<section id="meli" data-screen-label="meli" aria-labelledby="meli-title">
  <div class="bg" aria-hidden="true">
    <VideoPlaceholder label="Mercado Libre" />
  </div>
  <div class="inner">
    <header class="head">
      <span class="kicker">{s.kicker}</span>
      <h2 id="meli-title">{s.title}</h2>
    </header>
    <div class="cards">
      {s.cards.map((c) => (
        <article class="card">
          <Icon name={c.icon} size={28} />
          <h3>{c.title}</h3>
          <p>{c.desc}</p>
        </article>
      ))}
    </div>
  </div>
</section>
<style>
section {
  position: relative;
  padding: 120px clamp(24px, 4vw, 64px);
  color: var(--cream);
  overflow: hidden;
  isolation: isolate;
}
.bg { position: absolute; inset: 0; z-index: -1; }
.bg :global(.placeholder) { border-radius: 0; }
.inner { position: relative; max-width: 1440px; margin: 0 auto; }
.head { text-align: center; margin-bottom: 64px; }
.kicker {
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em;
  text-transform: uppercase; opacity: 0.75;
}
h2 {
  font-family: var(--serif);
  font-size: clamp(32px, 4.5vw, 56px);
  line-height: 1.1; margin: 12px 0 0;
}
.cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.card {
  background: rgba(247,242,232,0.07);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(247,242,232,0.18);
  border-radius: 16px;
  padding: 24px;
  color: var(--cream);
}
.card h3 { font-family: var(--serif); font-size: 20px; margin: 16px 0 8px; }
.card p { font-size: 14px; line-height: 1.55; opacity: 0.85; margin: 0; }
@media (max-width: 880px) {
  .cards { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 560px) {
  .cards { grid-template-columns: 1fr; }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/MeliCards.astro
git commit -m "feat(section): MeliCards 4-card grid over video bg"
```

---

### Task 26: IDB section

**Files:**
- Create: `src/components/sections/IDBSection.astro`

- [ ] **Step 1: Write file**

```astro
---
import type { Locale } from '../../lib/i18n';
import uiEn from '../../content/ui/en.json';
import uiEs from '../../content/ui/es.json';
import uiPt from '../../content/ui/pt.json';
interface Props { locale: Locale; }
const { locale } = Astro.props;
const ui = locale === 'en' ? uiEn : locale === 'es' ? uiEs : uiPt;
const s = ui.sections.idb;
---
<section id="idb" data-screen-label="idb" aria-labelledby="idb-title">
  <div class="inner">
    <header class="head">
      <span class="kicker">{s.kicker}</span>
      <h2 id="idb-title">{s.title}</h2>
    </header>
    <dl class="stats">
      {s.stats.map((stat) => (
        <div class="stat">
          <dt>{stat.value}</dt>
          <dd>{stat.label}</dd>
        </div>
      ))}
    </dl>
  </div>
</section>
<style>
section { padding: 120px clamp(24px, 4vw, 64px); background: var(--paper); }
.inner { max-width: 1200px; margin: 0 auto; text-align: center; }
.kicker {
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--ink-3);
}
h2 {
  font-family: var(--serif);
  font-size: clamp(32px, 4.5vw, 56px);
  line-height: 1.1; margin: 12px 0 64px;
}
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin: 0;
}
.stat dt {
  font-family: var(--serif);
  font-size: clamp(48px, 7vw, 96px);
  color: var(--accent-dark);
  line-height: 1;
}
.stat dd {
  margin: 16px 0 0;
  color: var(--ink-2);
  font-size: 14px; line-height: 1.5;
}
@media (max-width: 720px) {
  .stats { grid-template-columns: 1fr; gap: 32px; }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/IDBSection.astro
git commit -m "feat(section): IDB stats (60+ / 30% / C-Level)"
```

---

### Task 27: AI block sections (AIIntro, Lectures, IttiAI)

**Files:**
- Create: `src/components/sections/AIIntro.astro`, `Lectures.astro`, `IttiAI.astro`

- [ ] **Step 1: Write `src/components/sections/AIIntro.astro`**

```astro
---
import type { Locale } from '../../lib/i18n';
import uiEn from '../../content/ui/en.json';
import uiEs from '../../content/ui/es.json';
import uiPt from '../../content/ui/pt.json';
interface Props { locale: Locale; }
const { locale } = Astro.props;
const ui = locale === 'en' ? uiEn : locale === 'es' ? uiEs : uiPt;
const s = ui.sections.aiIntro;
---
<section id="ai-intro" data-screen-label="ai-intro" aria-labelledby="ai-intro-title">
  <div class="inner">
    <span class="kicker">{s.kicker}</span>
    <h2 id="ai-intro-title">{s.title}</h2>
    <p>{s.desc}</p>
  </div>
</section>
<style>
section { padding: 100px clamp(24px, 4vw, 64px); background: var(--ink); color: var(--cream); }
.inner { max-width: 880px; margin: 0 auto; text-align: center; }
.kicker { font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.6; }
h2 { font-family: var(--serif); font-size: clamp(32px, 4.5vw, 56px); line-height: 1.1; margin: 12px 0 24px; }
p { font-size: 18px; line-height: 1.6; opacity: 0.85; margin: 0; }
</style>
```

- [ ] **Step 2: Write `src/components/sections/Lectures.astro`**

```astro
---
import type { Locale } from '../../lib/i18n';
import uiEn from '../../content/ui/en.json';
import uiEs from '../../content/ui/es.json';
import uiPt from '../../content/ui/pt.json';
interface Props { locale: Locale; }
const { locale } = Astro.props;
const ui = locale === 'en' ? uiEn : locale === 'es' ? uiEs : uiPt;
const s = ui.sections.lectures;
---
<section id="lectures" data-screen-label="lectures" aria-labelledby="lectures-title">
  <div class="inner">
    <span class="kicker">{s.kicker}</span>
    <h2 id="lectures-title">{s.title}</h2>
    <ul class="topics">
      {s.topics.map((t) => <li>{t}</li>)}
    </ul>
  </div>
</section>
<style>
section { padding: 100px clamp(24px, 4vw, 64px); background: var(--cream); }
.inner { max-width: 880px; margin: 0 auto; }
.kicker { font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-3); }
h2 { font-family: var(--serif); font-size: clamp(32px, 4.5vw, 56px); line-height: 1.1; margin: 12px 0 32px; }
.topics { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; }
.topics li {
  padding: 20px 24px;
  background: var(--paper);
  border-left: 3px solid var(--accent-dark);
  border-radius: 0 12px 12px 0;
  color: var(--ink);
  font-size: 16px; line-height: 1.55;
}
</style>
```

- [ ] **Step 3: Write `src/components/sections/IttiAI.astro`**

```astro
---
import type { Locale } from '../../lib/i18n';
import uiEn from '../../content/ui/en.json';
import uiEs from '../../content/ui/es.json';
import uiPt from '../../content/ui/pt.json';
interface Props { locale: Locale; }
const { locale } = Astro.props;
const ui = locale === 'en' ? uiEn : locale === 'es' ? uiEs : uiPt;
const s = ui.sections.ittiAi;
---
<section id="itti-ai" data-screen-label="itti-ai" aria-labelledby="itti-ai-title">
  <div class="inner">
    <div class="copy">
      <span class="kicker">{s.kicker}</span>
      <h2 id="itti-ai-title">{s.title}</h2>
      <p>{s.desc}</p>
    </div>
    <pre class="term" aria-label="Claude Code terminal example">
<code>$ claude
<span class="cmd">&gt;</span> roll out claude code to engineering org
<span class="ok">✓</span> 40-person core team onboarded
<span class="ok">✓</span> harness wired
<span class="ok">✓</span> incident playbook updated
<span class="cmd">_</span></code>
    </pre>
  </div>
</section>
<style>
section { padding: 100px clamp(24px, 4vw, 64px); background: var(--cream-2); }
.inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
.kicker { font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-3); }
h2 { font-family: var(--serif); font-size: clamp(28px, 4vw, 44px); line-height: 1.1; margin: 12px 0 16px; }
p { color: var(--ink-2); font-size: 16px; line-height: 1.55; margin: 0; }
.term {
  background: var(--ink);
  color: var(--cream);
  border-radius: 14px;
  padding: 24px;
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.7;
  margin: 0;
  overflow-x: auto;
}
.term .cmd { color: var(--accent-light); }
.term .ok { color: #5b9a6e; }
@media (max-width: 880px) {
  .inner { grid-template-columns: 1fr; }
}
</style>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/AIIntro.astro src/components/sections/Lectures.astro src/components/sections/IttiAI.astro
git commit -m "feat(section): AIIntro + Lectures + IttiAI (Claude Code rollout)"
```

---

### Task 28: SideProject + Certifications

**Files:**
- Create: `src/components/sections/SideProject.astro`, `Certifications.astro`

- [ ] **Step 1: Write `src/components/sections/SideProject.astro`**

```astro
---
import { getCollection } from 'astro:content';
import VideoPlaceholder from '../ui/VideoPlaceholder.astro';
import type { Locale } from '../../lib/i18n';
import uiEn from '../../content/ui/en.json';
import uiEs from '../../content/ui/es.json';
import uiPt from '../../content/ui/pt.json';

interface Props { locale: Locale; }
const { locale } = Astro.props;
const ui = locale === 'en' ? uiEn : locale === 'es' ? uiEs : uiPt;
const s = ui.sections.sideProject;
const projects = (await getCollection('project', (p) => p.data.locale === locale && p.data.slug === 'dnd-companion'));
const proj = projects[0]?.data;
---
<section id="side-project" data-screen-label="side-project" aria-labelledby="side-project-title">
  <div class="bg" aria-hidden="true">
    <VideoPlaceholder label={s.title} tint="var(--accent-dark)" />
  </div>
  <div class="inner">
    <span class="kicker">{s.kicker}</span>
    <h2 id="side-project-title">{s.title}</h2>
    <p class="desc">{proj?.summary ?? s.desc}</p>
    <ul class="highlights">
      {(proj?.highlights ?? []).map((h: string) => <li>{h}</li>)}
    </ul>
  </div>
</section>
<style>
section { position: relative; padding: 120px clamp(24px, 4vw, 64px); color: var(--cream); isolation: isolate; }
.bg { position: absolute; inset: 0; z-index: -1; }
.inner { position: relative; max-width: 960px; margin: 0 auto; }
.kicker { font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.75; }
h2 { font-family: var(--serif); font-size: clamp(32px, 4.5vw, 56px); line-height: 1.1; margin: 12px 0 24px; }
.desc { font-size: 17px; line-height: 1.6; opacity: 0.9; margin: 0 0 32px; }
.highlights {
  list-style: none; padding: 0; margin: 0;
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
}
.highlights li {
  padding: 16px 20px;
  background: rgba(247,242,232,0.07);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(247,242,232,0.18);
  border-radius: 12px;
  font-size: 14px; line-height: 1.5;
}
@media (max-width: 720px) {
  .highlights { grid-template-columns: 1fr; }
}
</style>
```

- [ ] **Step 2: Write `src/components/sections/Certifications.astro`**

```astro
---
import { getCollection } from 'astro:content';
import type { Locale } from '../../lib/i18n';
import uiEn from '../../content/ui/en.json';
import uiEs from '../../content/ui/es.json';
import uiPt from '../../content/ui/pt.json';

interface Props { locale: Locale; }
const { locale } = Astro.props;
const ui = locale === 'en' ? uiEn : locale === 'es' ? uiEs : uiPt;
const s = ui.sections.certs;
const certs = (await getCollection('certification', (c) => c.data.locale === locale))
  .sort((a, b) => (b.data.date.localeCompare(a.data.date)));
---
<section id="certs" data-screen-label="certs" aria-labelledby="certs-title">
  <div class="inner">
    <header>
      <span class="kicker">{s.kicker}</span>
      <h2 id="certs-title">{s.title}</h2>
      <p class="sub">{s.subtitle}</p>
    </header>
    <ul class="grid">
      {certs.map((c) => (
        <li class:list={['cert', { ip: c.data.status === 'in-progress' }]}>
          <span class="issuer">{c.data.issuer}</span>
          <h3>{c.data.name}</h3>
          <time datetime={c.data.date}>{c.data.date}</time>
          {c.data.status === 'in-progress' && <span class="badge">In progress</span>}
        </li>
      ))}
    </ul>
  </div>
</section>
<style>
section { padding: 100px clamp(24px, 4vw, 64px); background: var(--cream); }
.inner { max-width: 1200px; margin: 0 auto; }
header { text-align: center; margin-bottom: 48px; }
.kicker { font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-3); }
h2 { font-family: var(--serif); font-size: clamp(32px, 4.5vw, 56px); line-height: 1.1; margin: 12px 0 8px; }
.sub { color: var(--ink-2); margin: 0; }
.grid {
  list-style: none; padding: 0; margin: 0;
  display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;
}
.cert {
  padding: 20px;
  background: var(--paper);
  border: 1px solid rgba(42,33,27,0.08);
  border-radius: 12px;
  position: relative;
}
.cert .issuer { font-family: var(--mono); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent-dark); }
.cert h3 { font-family: var(--serif); font-size: 17px; line-height: 1.3; margin: 8px 0; }
.cert time { font-size: 13px; color: var(--ink-3); }
.cert .badge { display: inline-block; margin-top: 8px; padding: 2px 8px; background: var(--ink); color: var(--cream); border-radius: 999px; font-size: 11px; }
.cert.ip { opacity: 0.85; }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/SideProject.astro src/components/sections/Certifications.astro
git commit -m "feat(section): SideProject (D&D AI) + Certifications grid"
```

---

### Task 29: Hobbies sections (HobbiesIntro, DnD, Spirituality)

**Files:**
- Create: `src/components/sections/HobbiesIntro.astro`, `DnD.astro`, `Spirituality.astro`

- [ ] **Step 1: Write `HobbiesIntro.astro`**

```astro
---
import type { Locale } from '../../lib/i18n';
interface Props { locale: Locale; }
const { locale } = Astro.props;
const labels: Record<Locale, { kicker: string; title: string; desc: string }> = {
  en: { kicker: 'Beyond Engineering', title: 'My Hobbies', desc: 'Where curiosity goes after work hours.' },
  es: { kicker: 'Más allá de la ingeniería', title: 'Mis Hobbies', desc: 'A dónde va la curiosidad después del trabajo.' },
  pt: { kicker: 'Além da engenharia', title: 'Meus Hobbies', desc: 'Para onde vai a curiosidade depois do trabalho.' },
};
const t = labels[locale];
---
<section id="hobbies" aria-labelledby="hobbies-title">
  <div class="inner">
    <span class="kicker">{t.kicker}</span>
    <h2 id="hobbies-title">{t.title}</h2>
    <p>{t.desc}</p>
  </div>
</section>
<style>
section { padding: 100px clamp(24px, 4vw, 64px); background: var(--paper); text-align: center; }
.inner { max-width: 720px; margin: 0 auto; }
.kicker { font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-3); }
h2 { font-family: var(--serif); font-size: clamp(36px, 5vw, 64px); line-height: 1.1; margin: 12px 0 16px; }
p { color: var(--ink-2); margin: 0; }
</style>
```

- [ ] **Step 2: Write `DnD.astro`**

```astro
---
import D20 from '../ui/D20.astro';
import type { Locale } from '../../lib/i18n';
import uiEn from '../../content/ui/en.json';
import uiEs from '../../content/ui/es.json';
import uiPt from '../../content/ui/pt.json';
interface Props { locale: Locale; }
const { locale } = Astro.props;
const ui = locale === 'en' ? uiEn : locale === 'es' ? uiEs : uiPt;
const s = ui.sections.dnd;
---
<section id="dnd" data-screen-label="dnd" aria-labelledby="dnd-title">
  <div class="inner">
    <div class="copy">
      <span class="kicker">{s.kicker}</span>
      <h2 id="dnd-title">{s.title}</h2>
      <p>{s.desc}</p>
    </div>
    <D20 />
  </div>
</section>
<style>
section { padding: 100px clamp(24px, 4vw, 64px); background: var(--cream); }
.inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1.5fr 1fr; gap: 40px; align-items: center; }
.kicker { font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-3); }
h2 { font-family: var(--serif); font-size: clamp(28px, 4vw, 44px); line-height: 1.1; margin: 12px 0 16px; }
p { color: var(--ink-2); margin: 0; font-size: 16px; line-height: 1.6; }
@media (max-width: 880px) {
  .inner { grid-template-columns: 1fr; text-align: center; }
}
</style>
```

- [ ] **Step 3: Write `Spirituality.astro`**

```astro
---
import type { Locale } from '../../lib/i18n';
import uiEn from '../../content/ui/en.json';
import uiEs from '../../content/ui/es.json';
import uiPt from '../../content/ui/pt.json';
interface Props { locale: Locale; }
const { locale } = Astro.props;
const ui = locale === 'en' ? uiEn : locale === 'es' ? uiEs : uiPt;
const s = ui.sections.spirit;
---
<section id="spirit" data-screen-label="spirit" aria-labelledby="spirit-title">
  <div class="inner">
    <span class="kicker">{s.kicker}</span>
    <h2 id="spirit-title">{s.title}</h2>
    <blockquote>{s.desc}</blockquote>
  </div>
</section>
<style>
section { padding: 100px clamp(24px, 4vw, 64px); background: var(--cream-2); text-align: center; }
.inner { max-width: 720px; margin: 0 auto; }
.kicker { font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-3); }
h2 { font-family: var(--serif); font-size: clamp(28px, 4vw, 44px); line-height: 1.1; margin: 12px 0 24px; }
blockquote {
  font-family: var(--serif);
  font-style: italic;
  font-size: 22px;
  line-height: 1.5;
  color: var(--ink);
  margin: 0;
  padding: 0 24px;
  border-left: none;
}
</style>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/HobbiesIntro.astro src/components/sections/DnD.astro src/components/sections/Spirituality.astro
git commit -m "feat(section): Hobbies block (intro + D&D + Spirituality)"
```

---

### Task 30: Contact section

**Files:**
- Create: `src/components/sections/Contact.astro`

- [ ] **Step 1: Write file**

```astro
---
import { getEntry } from 'astro:content';
import CTAButton from '../ui/CTAButton.astro';
import type { Locale } from '../../lib/i18n';
import uiEn from '../../content/ui/en.json';
import uiEs from '../../content/ui/es.json';
import uiPt from '../../content/ui/pt.json';
interface Props { locale: Locale; }
const { locale } = Astro.props;
const ui = locale === 'en' ? uiEn : locale === 'es' ? uiEs : uiPt;
const s = ui.sections.contact;
const profile = await getEntry('profile', locale);
---
<section id="contact" aria-labelledby="contact-title">
  <div class="inner">
    <span class="kicker">{s.kicker}</span>
    <h2 id="contact-title">{s.title}</h2>
    <CTAButton href={profile!.data.linkedin} label={s.cta} icon="linkedin" />
  </div>
</section>
<style>
section { padding: 140px clamp(24px, 4vw, 64px); background: var(--ink); color: var(--cream); text-align: center; }
.inner { max-width: 720px; margin: 0 auto; }
.kicker { font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.6; }
h2 { font-family: var(--serif); font-size: clamp(40px, 6vw, 72px); line-height: 1.1; margin: 12px 0 40px; }
section :global(.cta-primary) { background: var(--cream); color: var(--ink); }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Contact.astro
git commit -m "feat(section): Contact CTA → LinkedIn"
```

---

## Phase 6 — Pages

### Task 31: index.astro per locale

**Files:**
- Replace: `src/pages/index.astro`
- Create: `src/pages/es/index.astro`, `src/pages/pt/index.astro`

- [ ] **Step 1: Write `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/layout/Nav.astro';
import Footer from '../components/layout/Footer.astro';
import Hero from '../components/sections/Hero.astro';
import IttiSplit from '../components/sections/IttiSplit.astro';
import MeliCards from '../components/sections/MeliCards.astro';
import IDBSection from '../components/sections/IDBSection.astro';
import AIIntro from '../components/sections/AIIntro.astro';
import Lectures from '../components/sections/Lectures.astro';
import IttiAI from '../components/sections/IttiAI.astro';
import SideProject from '../components/sections/SideProject.astro';
import Certifications from '../components/sections/Certifications.astro';
import HobbiesIntro from '../components/sections/HobbiesIntro.astro';
import DnD from '../components/sections/DnD.astro';
import Spirituality from '../components/sections/Spirituality.astro';
import Contact from '../components/sections/Contact.astro';

const locale = 'en';
const title = 'Gabriel Vargas — Head of Engineering | AI-first Eng Leader, ex-MELI, ex-IADB';
const description = 'Gabriel Vargas — Head of Engineering. 6+ years leading engineering at Mercado Libre, Inter-American Development Bank, and itti. AI-first practitioner, Claude Code adoption. Open to remote and relocation.';
---
<BaseLayout locale={locale} title={title} description={description} faq>
  <Nav locale={locale} />
  <main id="main">
    <Hero locale={locale} />
    <IttiSplit locale={locale} />
    <MeliCards locale={locale} />
    <IDBSection locale={locale} />
    <AIIntro locale={locale} />
    <Lectures locale={locale} />
    <IttiAI locale={locale} />
    <SideProject locale={locale} />
    <Certifications locale={locale} />
    <HobbiesIntro locale={locale} />
    <DnD locale={locale} />
    <Spirituality locale={locale} />
    <Contact locale={locale} />
  </main>
  <Footer locale={locale} />
</BaseLayout>
```

- [ ] **Step 2: Write `src/pages/es/index.astro`**

Same as above but with `const locale = 'es'` and Spanish-translated `title` + `description`.

```ts
const locale = 'es';
const title = 'Gabriel Vargas — Head of Engineering | Líder de Ingeniería AI-first, ex-MELI, ex-BID';
const description = 'Gabriel Vargas — Head of Engineering. 6+ años liderando ingeniería en Mercado Libre, Banco Interamericano de Desarrollo, e itti. Práctica AI-first, adopción de Claude Code. Abierto a remoto y reubicación.';
```

- [ ] **Step 3: Write `src/pages/pt/index.astro`**

Same but with `const locale = 'pt'` and Portuguese title/description:

```ts
const locale = 'pt';
const title = 'Gabriel Vargas — Head of Engineering | Liderança de Engenharia AI-first, ex-MELI, ex-BID';
const description = 'Gabriel Vargas — Head of Engineering. 6+ anos liderando engenharia no Mercado Libre, Banco Interamericano de Desenvolvimento, e itti. Prática AI-first, adoção de Claude Code. Aberto a remoto e realocação.';
```

- [ ] **Step 4: Run dev server and verify all 3 routes**

```bash
npm run dev &
sleep 6
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/es/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/pt/
kill %1
```

Expected: `200 200 200`.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro src/pages/es/index.astro src/pages/pt/index.astro
git commit -m "feat(pages): index per locale (EN/ES/PT) wired to all sections"
```

---

> **CHECKPOINT 2** — Stop after this commit. Run `npm run dev` and walk through all 3 locales. Visual review. Continue when satisfied.

---

## Phase 7 — Public artifacts

### Task 32: cv.md endpoints

**Files:**
- Create: `src/pages/cv.md.ts`, `src/pages/es/cv.md.ts`, `src/pages/pt/cv.md.ts`
- Create: `src/lib/cv-md.ts` (shared renderer)

- [ ] **Step 1: Write `src/lib/cv-md.ts`**

```ts
import { getCollection, getEntry } from 'astro:content';
import type { Locale } from './i18n';

export async function renderCvMd(locale: Locale): Promise<string> {
  const profile = await getEntry('profile', locale);
  const experiences = (await getCollection('experience', (e) => e.data.locale === locale))
    .sort((a, b) => a.data.order - b.data.order);
  const certs = (await getCollection('certification', (c) => c.data.locale === locale))
    .sort((a, b) => b.data.date.localeCompare(a.data.date));

  const headings: Record<Locale, Record<string, string>> = {
    en: { summary: 'Summary', achievements: 'Selected Achievements', exp: 'Experience', edu: 'Education', skills: 'Core Skills', certs: 'Certifications', langs: 'Languages' },
    es: { summary: 'Resumen', achievements: 'Logros Seleccionados', exp: 'Experiencia', edu: 'Educación', skills: 'Habilidades Principales', certs: 'Certificaciones', langs: 'Idiomas' },
    pt: { summary: 'Resumo', achievements: 'Conquistas Selecionadas', exp: 'Experiência', edu: 'Educação', skills: 'Habilidades Principais', certs: 'Certificações', langs: 'Idiomas' },
  };
  const h = headings[locale];
  const p = profile!.data;
  const openTo = p.openTo.join(' & ');

  let md = '';
  md += `# ${p.name} — ${p.displayTitle}\n\n`;
  md += `${p.location} · Open to ${openTo}\n`;
  md += `LinkedIn: ${p.linkedin}\n\n`;
  md += `## ${h.summary}\n${p.summary.trim()}\n\n`;
  md += `## ${h.achievements}\n`;
  for (const a of p.achievements) md += `- ${a}\n`;
  md += `\n## ${h.exp}\n\n`;
  for (const e of experiences) {
    md += `### ${e.data.company} — ${e.data.title} {#${e.data.slug}}\n`;
    md += `${e.data.startDate} – ${e.data.endDate ?? 'Present'}`;
    if (e.data.location) md += ` · ${e.data.location}`;
    md += `\n\n`;
    for (const b of e.data.bullets) md += `- ${b}\n`;
    md += `\n`;
  }
  md += `## ${h.edu}\nUniversidad Tecnológica Nacional — B.Sc. Information Systems Engineering (coursework complete)\n\n`;
  md += `## ${h.skills}\n`;
  md += `**Leadership & Strategy:** Engineering Leadership & Team Scaling (8–60+ people), Roadmap Ownership, OKRs, Strategic Thinking, Matrix Organization Navigation, Architectural Strategy.\n\n`;
  md += `**Architecture & Cloud:** Architectural Refactoring & Design, Microservices & APIs, Microfrontends, High-Concurrency Systems, Distributed Systems, AWS, GCP, High Availability, Fault Tolerance, Scalability.\n\n`;
  md += `**Cross-Functional Influence:** C-Level Communication, Stakeholder Negotiation, Cross-functional Alignment, Technical Strategy Presentation.\n\n`;
  md += `**Technologies:** React Native, React, Vue, Angular, Golang, Java, Node.js.\n\n`;
  md += `**Methodology & Culture:** Agile / Scrum, Results-Driven Execution, AI-Assisted Development (Claude Code, GitHub Copilot, Cursor), Talent Development & Team Growth.\n\n`;
  md += `## ${h.certs}\n`;
  for (const c of certs) {
    md += `- ${c.data.name} — ${c.data.issuer} (${c.data.date})${c.data.status === 'in-progress' ? ' [in progress]' : ''}\n`;
  }
  md += `\n## ${h.langs}\n`;
  md += `- Spanish: Native\n- English: Advanced (FCE B2)\n- Portuguese: Basic\n`;
  return md;
}
```

- [ ] **Step 2: Write `src/pages/cv.md.ts`**

```ts
import type { APIRoute } from 'astro';
import { renderCvMd } from '../lib/cv-md';
export const GET: APIRoute = async () => {
  const md = await renderCvMd('en');
  return new Response(md, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
```

- [ ] **Step 3: Write `src/pages/es/cv.md.ts`**

```ts
import type { APIRoute } from 'astro';
import { renderCvMd } from '../../lib/cv-md';
export const GET: APIRoute = async () => {
  const md = await renderCvMd('es');
  return new Response(md, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
```

- [ ] **Step 4: Write `src/pages/pt/cv.md.ts`**

Same as ES but with `'pt'`.

- [ ] **Step 5: Verify endpoints**

```bash
npm run dev &
sleep 6
curl -s http://localhost:4321/cv.md | head -10
curl -s http://localhost:4321/es/cv.md | head -10
curl -s http://localhost:4321/pt/cv.md | head -10
kill %1
```

Expected: Each returns markdown headers starting with `# Gabriel Vargas — Head of Engineering`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/cv-md.ts src/pages/cv.md.ts src/pages/es/cv.md.ts src/pages/pt/cv.md.ts
git commit -m "feat(artifact): /cv.md endpoint per locale, content-derived"
```

---

### Task 33: cv.json (JSON Resume) build script

**Files:**
- Create: `scripts/build-cv-json.mjs`, `src/lib/json-resume.ts`

- [ ] **Step 1: Write `scripts/build-cv-json.mjs`**

```js
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

const ROOT = process.cwd();
const CONTENT = join(ROOT, 'src/content');
const DIST = join(ROOT, 'dist');
const LOCALES = ['en','es','pt'];
const SITE = 'https://gabrielvargas94.github.io';

function parseMd(path) {
  const raw = readFileSync(path, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`Bad frontmatter: ${path}`);
  const data = yaml.load(m[1]);
  return { data, body: m[2] };
}

function buildOne(locale) {
  const profile = parseMd(join(CONTENT, 'profile', `${locale}.md`)).data;
  const expDir = join(CONTENT, 'experience', locale);
  const experiences = readdirSync(expDir)
    .filter(f => f.endsWith('.md'))
    .map(f => parseMd(join(expDir, f)).data)
    .sort((a, b) => a.order - b.order);
  const certDir = join(CONTENT, 'certifications', locale);
  const certs = readdirSync(certDir)
    .filter(f => f.endsWith('.md'))
    .map(f => parseMd(join(certDir, f)).data)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  const resume = {
    basics: {
      name: profile.name,
      label: profile.displayTitle,
      url: profile.linkedin,
      summary: profile.summary.trim(),
      location: { city: 'Buenos Aires', countryCode: 'AR', region: 'Argentina' },
      profiles: [
        { network: 'LinkedIn', url: profile.linkedin, username: 'gabriel-vargas' },
        { network: 'GitHub', url: profile.github, username: 'Gabrielvargas94' },
      ],
    },
    work: experiences.map(e => ({
      name: e.company,
      position: e.title,
      startDate: e.startDate,
      ...(e.endDate ? { endDate: e.endDate } : {}),
      ...(e.location ? { location: e.location } : {}),
      highlights: e.bullets,
      ...(e.skills?.length ? { keywords: e.skills } : {}),
    })),
    education: [{
      institution: 'Universidad Tecnológica Nacional',
      studyType: 'B.Sc.',
      area: 'Information Systems Engineering',
      note: 'coursework complete',
    }],
    skills: [
      { name: 'Leadership & Strategy', keywords: ['Engineering Leadership','Team Scaling (8–60+ people)','Roadmap Ownership','OKRs','Strategic Thinking','Matrix Organization Navigation','Architectural Strategy'] },
      { name: 'Architecture & Cloud', keywords: ['Architectural Refactoring','Microservices & APIs','Microfrontends','High-Concurrency Systems','Distributed Systems','AWS','GCP','High Availability','Fault Tolerance','Scalability'] },
      { name: 'Cross-Functional Influence', keywords: ['C-Level Communication','Stakeholder Negotiation','Cross-functional Alignment','Technical Strategy Presentation'] },
      { name: 'Technologies', keywords: ['React Native','React','Vue','Angular','Golang','Java','Node.js'] },
      { name: 'Methodology & Culture', keywords: ['Agile / Scrum','Results-Driven Execution','AI-Assisted Development (Claude Code, GitHub Copilot, Cursor)','Talent Development & Team Growth'] },
    ],
    languages: [
      { language: 'Spanish', fluency: 'Native' },
      { language: 'English', fluency: 'Advanced (FCE B2)' },
      { language: 'Portuguese', fluency: 'Basic' },
    ],
    certificates: certs.map(c => ({
      name: c.name,
      date: c.date,
      issuer: c.issuer,
      ...(c.url ? { url: c.url } : {}),
    })),
    meta: { canonical: `${SITE}${locale === 'en' ? '' : '/' + locale}/cv.json`, version: 'v1.0.0', lastModified: new Date().toISOString() },
  };

  const outDir = locale === 'en' ? DIST : join(DIST, locale);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'cv.json'), JSON.stringify(resume, null, 2), 'utf8');
  console.log(`Wrote ${join(outDir, 'cv.json')}`);
}

if (!existsSync(DIST)) mkdirSync(DIST, { recursive: true });
LOCALES.forEach(buildOne);
```

- [ ] **Step 2: Install `js-yaml`**

```bash
npm install -D js-yaml
```

- [ ] **Step 3: Run script**

```bash
npm run build
```

Expected: writes `dist/cv.json`, `dist/es/cv.json`, `dist/pt/cv.json`. Confirm:

```bash
ls dist/cv.json dist/es/cv.json dist/pt/cv.json
```

- [ ] **Step 4: Validate JSON Resume against schema**

```bash
node -e "const r = require('./dist/cv.json'); console.log('basics.name =', r.basics.name); console.log('work entries =', r.work.length); console.log('certs =', r.certificates.length);"
```

Expected: `basics.name = Gabriel Vargas`, `work entries = 8`, `certs = 9`.

- [ ] **Step 5: Commit**

```bash
git add scripts/build-cv-json.mjs package.json package-lock.json
git commit -m "feat(artifact): cv.json (JSON Resume schema) build script per locale"
```

---

### Task 34: llms.txt + llms-full.txt build script

**Files:**
- Create: `scripts/build-llms.mjs`

- [ ] **Step 1: Write `scripts/build-llms.mjs`**

```js
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

const ROOT = process.cwd();
const CONTENT = join(ROOT, 'src/content');
const DIST = join(ROOT, 'dist');
const LOCALES = ['en','es','pt'];

function parseMd(path) {
  const raw = readFileSync(path, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  return { data: yaml.load(m[1]), body: m[2] };
}

function buildLlms(locale) {
  const profile = parseMd(join(CONTENT, 'profile', `${locale}.md`)).data;
  const expDir = join(CONTENT, 'experience', locale);
  const experiences = readdirSync(expDir).filter(f => f.endsWith('.md'))
    .map(f => parseMd(join(expDir, f)).data)
    .sort((a, b) => a.order - b.order);

  const prefix = locale === 'en' ? '' : '/' + locale;

  const short = [
    `# ${profile.name} — ${profile.displayTitle}`,
    ``,
    `> ${profile.summary.replace(/\s+/g, ' ').trim()}`,
    ``,
    `## CV`,
    `- [Full CV (Markdown)](${prefix}/cv.md)`,
    `- [JSON Resume](${prefix}/cv.json)`,
    `- [PDF](${prefix}/cv.pdf)`,
    ``,
    `## Experience`,
    ...experiences.map(e => `- [${e.company} — ${e.title}](${prefix}/cv.md#${e.slug})`),
    ``,
    `## AI work`,
    `- [Claude Code rollout](${prefix}/#itti-ai)`,
    `- [Lectures & talks](${prefix}/#lectures)`,
    `- [Side project: D&D AI Companion](${prefix}/#side-project)`,
    `- [Certifications (Anthropic)](${prefix}/#certs)`,
    ``,
    `## Profile`,
    `- LinkedIn: ${profile.linkedin}`,
    `- GitHub: ${profile.github}`,
    ``,
  ].join('\n');

  const full = [
    short,
    `---`,
    ``,
    `## Detailed profile`,
    ``,
    profile.summary.trim(),
    ``,
    `## Selected achievements`,
    ...profile.achievements.map(a => `- ${a}`),
    ``,
    `## Detailed experience`,
    ``,
    ...experiences.flatMap(e => [
      `### ${e.company} — ${e.title}`,
      `${e.startDate} – ${e.endDate ?? 'Present'}${e.location ? ' · ' + e.location : ''}`,
      ``,
      ...e.bullets.map(b => `- ${b}`),
      ``,
      e.skills?.length ? `Skills: ${e.skills.join(', ')}` : '',
      ``,
    ]),
  ].join('\n');

  const outDir = locale === 'en' ? DIST : join(DIST, locale);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'llms.txt'), short, 'utf8');
  writeFileSync(join(outDir, 'llms-full.txt'), full, 'utf8');
  console.log(`Wrote ${join(outDir, 'llms.txt')} and llms-full.txt`);
}

LOCALES.forEach(buildLlms);
```

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: writes `dist/llms.txt`, `dist/llms-full.txt`, plus `es/` and `pt/` variants.

- [ ] **Step 3: Verify**

```bash
head -5 dist/llms.txt
head -5 dist/es/llms.txt
```

Expected: each starts with `# Gabriel Vargas — Head of Engineering`.

- [ ] **Step 4: Commit**

```bash
git add scripts/build-llms.mjs
git commit -m "feat(artifact): llms.txt + llms-full.txt per locale"
```

---

### Task 35: OG images build script

**Files:**
- Create: `scripts/build-og.mjs`

- [ ] **Step 1: Write `scripts/build-og.mjs`**

```js
import { html as toReactNode } from 'satori-html';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const LOCALES = ['en','es','pt'];

const NEWSREADER = readFileSync(join(ROOT, 'node_modules/@fontsource/newsreader/files/newsreader-latin-500-normal.woff'));
// If @fontsource not available, fall back to fetching font bytes inline; we'll vendor one.

async function buildOg(locale) {
  const profilePath = join(ROOT, 'src/content/profile', `${locale}.md`);
  const raw = readFileSync(profilePath, 'utf8');
  const fm = raw.match(/^---\n([\s\S]*?)\n---/)[1];
  const data = yaml.load(fm);

  const headline = locale === 'en'
    ? 'Building AI-first engineering teams'
    : locale === 'es'
      ? 'Construyendo equipos de ingeniería AI-first'
      : 'Construindo times de engenharia AI-first';

  const tree = toReactNode(`
    <div style="display:flex;flex-direction:column;width:1200px;height:630px;background:#f7f2e8;color:#2a211b;font-family:Newsreader;padding:64px;justify-content:space-between;">
      <div style="display:flex;flex-direction:column;">
        <div style="font-family:Newsreader;font-size:22px;letter-spacing:.18em;text-transform:uppercase;color:#7a6a5c;">
          ${data.displayTitle} · ${data.company}
        </div>
        <div style="font-family:Newsreader;font-size:80px;line-height:1.05;margin-top:24px;max-width:900px;">${headline}</div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;">
        <div style="font-family:Newsreader;font-size:36px;">${data.name}</div>
        <div style="display:flex;align-items:center;gap:12px;font-family:Newsreader;font-size:22px;color:#9c5e36;">
          <div style="width:14px;height:14px;border-radius:50%;background:#9c5e36;"></div>
          gabrielvargas94.github.io
        </div>
      </div>
    </div>
  `);

  const svg = await satori(tree, {
    width: 1200,
    height: 630,
    fonts: [{ name: 'Newsreader', data: NEWSREADER, weight: 500, style: 'normal' }],
  });
  const png = new Resvg(svg, { background: '#f7f2e8' }).render().asPng();

  const outDir = join(DIST, locale === 'en' ? '' : locale, 'og');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, `${locale}.png`), png);
  console.log(`Wrote OG for ${locale}`);
}

for (const l of LOCALES) await buildOg(l);
```

- [ ] **Step 2: Install satori + font package**

```bash
npm install -D satori @fontsource/newsreader
```

- [ ] **Step 3: Run build**

```bash
npm run build
```

Expected: writes `dist/og/en.png`, `dist/es/og/es.png`, `dist/pt/og/pt.png` (1200×630).

- [ ] **Step 4: Commit**

```bash
git add scripts/build-og.mjs package.json package-lock.json
git commit -m "feat(artifact): per-locale OG images via satori-html + resvg"
```

---

### Task 36: cv-print pages + Playwright PDF script

**Files:**
- Create: `src/pages/cv-print/index.astro`, `src/pages/es/cv-print/index.astro`, `src/pages/pt/cv-print/index.astro`
- Create: `src/components/cv/CvPrint.astro`
- Create: `scripts/build-cv-pdf.mjs`

- [ ] **Step 1: Write `src/components/cv/CvPrint.astro`**

```astro
---
import { getCollection, getEntry } from 'astro:content';
import type { Locale } from '../../lib/i18n';
interface Props { locale: Locale; }
const { locale } = Astro.props;
const profile = await getEntry('profile', locale);
const experiences = (await getCollection('experience', (e) => e.data.locale === locale)).sort((a, b) => a.data.order - b.data.order);
const certs = (await getCollection('certification', (c) => c.data.locale === locale)).sort((a, b) => b.data.date.localeCompare(a.data.date));
const headings: Record<Locale, Record<string, string>> = {
  en: { summary: 'Summary', achievements: 'Selected Achievements', exp: 'Experience', edu: 'Education', skills: 'Core Skills', certs: 'Certifications', langs: 'Languages' },
  es: { summary: 'Resumen', achievements: 'Logros Seleccionados', exp: 'Experiencia', edu: 'Educación', skills: 'Habilidades Principales', certs: 'Certificaciones', langs: 'Idiomas' },
  pt: { summary: 'Resumo', achievements: 'Conquistas Selecionadas', exp: 'Experiência', edu: 'Educação', skills: 'Habilidades Principais', certs: 'Certificações', langs: 'Idiomas' },
};
const h = headings[locale];
const p = profile!.data;
---
<article class="cv">
  <header>
    <h1>{p.name}</h1>
    <p class="sub">{p.displayTitle} · {p.company} · {p.location} · Open to {p.openTo.join(' & ')}</p>
    <p class="links">LinkedIn: {p.linkedin}</p>
  </header>
  <section>
    <h2>{h.summary}</h2>
    <p>{p.summary}</p>
  </section>
  <section>
    <h2>{h.achievements}</h2>
    <ul>{p.achievements.map((a) => <li>{a}</li>)}</ul>
  </section>
  <section>
    <h2>{h.exp}</h2>
    {experiences.map((e) => (
      <article class="job">
        <h3>{e.data.company} — {e.data.title}</h3>
        <p class="meta">
          <time datetime={e.data.startDate}>{e.data.startDate}</time> – {e.data.endDate ?? 'Present'}{e.data.location ? ` · ${e.data.location}` : ''}
        </p>
        <ul>{e.data.bullets.map((b) => <li>{b}</li>)}</ul>
      </article>
    ))}
  </section>
  <section>
    <h2>{h.edu}</h2>
    <p>Universidad Tecnológica Nacional — B.Sc. Information Systems Engineering (coursework complete)</p>
  </section>
  <section>
    <h2>{h.skills}</h2>
    <p><strong>Leadership & Strategy:</strong> Engineering Leadership & Team Scaling (8–60+ people), Roadmap Ownership, OKRs, Strategic Thinking, Matrix Organization Navigation, Architectural Strategy.</p>
    <p><strong>Architecture & Cloud:</strong> Architectural Refactoring & Design, Microservices & APIs, Microfrontends, High-Concurrency Systems, Distributed Systems, AWS, GCP, High Availability, Fault Tolerance, Scalability.</p>
    <p><strong>Cross-Functional Influence:</strong> C-Level Communication, Stakeholder Negotiation, Cross-functional Alignment, Technical Strategy Presentation.</p>
    <p><strong>Technologies:</strong> React Native, React, Vue, Angular, Golang, Java, Node.js.</p>
    <p><strong>Methodology & Culture:</strong> Agile / Scrum, Results-Driven Execution, AI-Assisted Development (Claude Code, GitHub Copilot, Cursor), Talent Development & Team Growth.</p>
  </section>
  <section>
    <h2>{h.certs}</h2>
    <ul>{certs.map((c) => <li>{c.data.name} — {c.data.issuer} ({c.data.date}){c.data.status === 'in-progress' ? ' [in progress]' : ''}</li>)}</ul>
  </section>
  <section>
    <h2>{h.langs}</h2>
    <ul>
      <li>Spanish: Native</li>
      <li>English: Advanced (FCE B2)</li>
      <li>Portuguese: Basic</li>
    </ul>
  </section>
</article>
<style>
.cv { font-family: 'Newsreader', Georgia, serif; max-width: 720px; margin: 0 auto; padding: 32px; color: #000; }
h1 { font-size: 28px; margin: 0 0 4px; text-align: center; }
header .sub, header .links { text-align: center; font-size: 11pt; margin: 4px 0; color: #333; }
h2 { font-size: 16pt; border-bottom: 1px solid #000; padding-bottom: 2px; margin-top: 18pt; }
h3 { font-size: 12pt; margin: 12pt 0 2pt; }
.meta { font-style: italic; font-size: 10pt; margin: 0 0 4pt; color: #444; }
ul { padding-left: 18pt; margin: 6pt 0; }
li { margin: 2pt 0; font-size: 11pt; line-height: 1.4; }
p { font-size: 11pt; line-height: 1.45; margin: 6pt 0; }
.job { break-inside: avoid; }
</style>
```

- [ ] **Step 2: Write `src/pages/cv-print/index.astro`**

```astro
---
import PrintLayout from '../../layouts/PrintLayout.astro';
import CvPrint from '../../components/cv/CvPrint.astro';
---
<PrintLayout locale="en" title="Gabriel Vargas — CV">
  <CvPrint locale="en" />
</PrintLayout>
```

- [ ] **Step 3: Write `src/pages/es/cv-print/index.astro`** and `pt/cv-print/index.astro`

Same pattern, locale `es` and `pt`.

- [ ] **Step 4: Write `scripts/build-cv-pdf.mjs`**

```js
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const LOCALES = ['en','es','pt'];
const PORT = 4326;

async function serveDist() {
  const proc = spawn('npx', ['http-server', DIST, '-p', String(PORT), '-s', '--cors'], {
    stdio: 'ignore',
    shell: true,
  });
  await new Promise((r) => setTimeout(r, 1500));
  return proc;
}

async function main() {
  const server = await serveDist();
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    for (const locale of LOCALES) {
      const url = `http://localhost:${PORT}/${locale === 'en' ? '' : locale + '/'}cv-print/`;
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.emulateMedia({ media: 'print' });
      const outDir = locale === 'en' ? DIST : join(DIST, locale);
      mkdirSync(outDir, { recursive: true });
      await page.pdf({
        path: join(outDir, 'cv.pdf'),
        format: 'A4',
        margin: { top: '16mm', bottom: '16mm', left: '14mm', right: '14mm' },
        printBackground: true,
        tagged: true,
      });
      console.log(`Wrote ${join(outDir, 'cv.pdf')}`);
    }
    await browser.close();
  } finally {
    server.kill('SIGTERM');
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 5: Install http-server**

```bash
npm install -D http-server
```

- [ ] **Step 6: Run build**

```bash
npm run build
```

Expected: writes `dist/cv.pdf`, `dist/es/cv.pdf`, `dist/pt/cv.pdf`.

- [ ] **Step 7: Commit**

```bash
git add src/components/cv/CvPrint.astro src/pages/cv-print/index.astro src/pages/es/cv-print/index.astro src/pages/pt/cv-print/index.astro scripts/build-cv-pdf.mjs package.json package-lock.json
git commit -m "feat(artifact): cv.pdf via Playwright tagged PDF, per locale"
```

---

### Task 37: robots.txt + sitemap verification

**Files:**
- Create: `public/robots.txt`, `public/favicon.svg`

- [ ] **Step 1: Write `public/robots.txt`**

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
Disallow: /cv-print/

Sitemap: https://gabrielvargas94.github.io/sitemap-index.xml
```

- [ ] **Step 2: Write `public/favicon.svg`** (simple ink mark)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#2a211b"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="36" fill="#f7f2e8">g</text>
</svg>
```

- [ ] **Step 3: Verify sitemap generated**

```bash
npm run build
ls dist/sitemap-*.xml
```

Expected: `dist/sitemap-index.xml` and `dist/sitemap-0.xml` exist.

- [ ] **Step 4: Verify robots in dist**

```bash
cat dist/robots.txt | head -5
```

Expected: shows GPTBot block.

- [ ] **Step 5: Commit**

```bash
git add public/robots.txt public/favicon.svg
git commit -m "feat(seo): robots.txt allowlist for AI crawlers + favicon"
```

---

> **CHECKPOINT 3** — Stop after this commit. Full build should now produce HTML pages + cv.md + cv.json + cv.pdf + llms.txt + OG images + sitemap + robots, all per locale. Review the contents of `dist/`. Continue when satisfied.

---

## Phase 8 — Tests

### Task 38: Playwright config + a11y test

**Files:**
- Create: `playwright.config.ts`, `tests/a11y.spec.ts`

- [ ] **Step 1: Write `playwright.config.ts`**

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  webServer: {
    command: 'npx http-server dist -p 4327 -s',
    port: 4327,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
  use: {
    baseURL: 'http://localhost:4327',
    trace: 'retain-on-failure',
  },
});
```

- [ ] **Step 2: Write `tests/a11y.spec.ts`**

```ts
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

const routes = ['/', '/es/', '/pt/'];

for (const route of routes) {
  test(`a11y: ${route} has no serious or critical violations`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa', 'best-practice'])
      .analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    if (serious.length) {
      console.error(JSON.stringify(serious, null, 2));
    }
    expect(serious).toEqual([]);
  });
}
```

- [ ] **Step 3: Run test**

```bash
npm run build
npm run test:a11y
```

Expected: passes. If failures appear, fix axe violations (likely contrast or missing alt/aria labels) before continuing.

- [ ] **Step 4: Commit**

```bash
git add playwright.config.ts tests/a11y.spec.ts
git commit -m "test(a11y): axe-core per locale, no serious/critical violations"
```

---

### Task 39: SEO test

**Files:**
- Create: `tests/seo.spec.ts`

- [ ] **Step 1: Write file**

```ts
import { test, expect } from '@playwright/test';

const routes = [
  { path: '/', lang: 'en', hreflang: 'en-US' },
  { path: '/es/', lang: 'es', hreflang: 'es-AR' },
  { path: '/pt/', lang: 'pt', hreflang: 'pt-BR' },
];

for (const r of routes) {
  test(`seo: ${r.path} has correct meta + JSON-LD`, async ({ page }) => {
    await page.goto(r.path);

    await expect(page).toHaveTitle(/Gabriel Vargas/);
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc).toBeTruthy();
    expect(desc!.length).toBeGreaterThan(80);
    expect(desc!.length).toBeLessThan(220);

    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', r.lang);

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toContain('gabrielvargas94.github.io');

    const og = await page.locator('meta[property="og:type"]').getAttribute('content');
    expect(og).toBe('profile');

    // JSON-LD
    const ldScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ldScripts.length).toBeGreaterThan(0);
    const profileSchema = ldScripts.map((t) => JSON.parse(t)).find((j) => j['@graph']);
    expect(profileSchema).toBeTruthy();
    const person = profileSchema['@graph'].find((n: any) => n['@type'] === 'Person');
    expect(person.name).toBe('Gabriel Vargas');
    expect(person.jobTitle).toBe('Head of Engineering');
    expect(person.url).toContain('linkedin.com');

    // hreflang
    const hreflangs = await page.locator('link[rel="alternate"][hreflang]').count();
    expect(hreflangs).toBe(4); // 3 locales + x-default
  });
}
```

- [ ] **Step 2: Run**

```bash
npm run test:seo
```

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add tests/seo.spec.ts
git commit -m "test(seo): meta/canonical/hreflang/JSON-LD per locale"
```

---

### Task 40: Artifacts test (email leak + JSON Resume schema)

**Files:**
- Create: `tests/artifacts.spec.ts`

- [ ] **Step 1: Write file**

```ts
import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(process.cwd(), 'dist');

function walk(dir: string, acc: string[] = []): string[] {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

test('no email leak in any public artifact', () => {
  const files = walk(DIST).filter((p) => /\.(html|md|json|txt|xml)$/.test(p));
  const emailRe = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
  const leaks: string[] = [];
  for (const f of files) {
    const content = readFileSync(f, 'utf8');
    const m = content.match(emailRe);
    if (m) leaks.push(`${f}: ${m[0]}`);
  }
  expect(leaks).toEqual([]);
});

test('cv.json is valid JSON Resume', () => {
  const data = JSON.parse(readFileSync(join(DIST, 'cv.json'), 'utf8'));
  expect(data.basics.name).toBe('Gabriel Vargas');
  expect(data.basics.label).toBe('Head of Engineering');
  expect(data.basics.url).toContain('linkedin.com');
  expect(data.basics).not.toHaveProperty('email');
  expect(data.basics).not.toHaveProperty('phone');
  expect(Array.isArray(data.work)).toBe(true);
  expect(data.work.length).toBeGreaterThanOrEqual(8);
  expect(Array.isArray(data.certificates)).toBe(true);
  expect(data.certificates.length).toBeGreaterThanOrEqual(9);
});

test('llms.txt exists and references CV endpoints', () => {
  const text = readFileSync(join(DIST, 'llms.txt'), 'utf8');
  expect(text).toContain('# Gabriel Vargas — Head of Engineering');
  expect(text).toContain('/cv.md');
  expect(text).toContain('/cv.json');
  expect(text).toContain('/cv.pdf');
});

test('cv.pdf exists for all locales', () => {
  expect(statSync(join(DIST, 'cv.pdf')).size).toBeGreaterThan(10000);
  expect(statSync(join(DIST, 'es/cv.pdf')).size).toBeGreaterThan(10000);
  expect(statSync(join(DIST, 'pt/cv.pdf')).size).toBeGreaterThan(10000);
});
```

- [ ] **Step 2: Run**

```bash
npm run test:artifacts
```

Expected: passes. If email leak detected — investigate and remove from source. **Build must fail with email leak.**

- [ ] **Step 3: Commit**

```bash
git add tests/artifacts.spec.ts
git commit -m "test(artifacts): email-leak guard + JSON Resume + llms.txt + cv.pdf"
```

---

### Task 41: i18n test

**Files:**
- Create: `tests/i18n.spec.ts`

- [ ] **Step 1: Write file**

```ts
import { test, expect } from '@playwright/test';

test('hreflang annotations are reciprocal across locales', async ({ page }) => {
  const expected = ['en-US', 'es-AR', 'pt-BR', 'x-default'];
  for (const path of ['/', '/es/', '/pt/']) {
    await page.goto(path);
    const langs = await page.locator('link[rel="alternate"][hreflang]').evaluateAll((els) =>
      els.map((e) => e.getAttribute('hreflang')).filter(Boolean)
    );
    expect(langs.sort()).toEqual(expected.sort());
  }
});

test('lang switcher links go to alternate locale paths', async ({ page }) => {
  await page.goto('/');
  const links = await page.locator('details.lang .menu a').evaluateAll((els) =>
    els.map((e) => (e as HTMLAnchorElement).getAttribute('href'))
  );
  expect(links).toContain('/');
  expect(links).toContain('/es');
  expect(links).toContain('/pt');
});
```

- [ ] **Step 2: Run**

```bash
npm run test:i18n
```

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add tests/i18n.spec.ts
git commit -m "test(i18n): reciprocal hreflang + lang switcher targets"
```

---

### Task 42: Lighthouse CI config

**Files:**
- Create: `.lighthouserc.json`

- [ ] **Step 1: Write file**

```json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:4327/",
        "http://localhost:4327/es/",
        "http://localhost:4327/pt/"
      ],
      "startServerCommand": "npx http-server dist -p 4327 -s",
      "startServerReadyPattern": "Available on",
      "numberOfRuns": 1
    },
    "assert": {
      "assertions": {
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }],
        "categories:performance": ["warn", { "minScore": 0.9 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }]
      }
    },
    "upload": { "target": "temporary-public-storage" }
  }
}
```

- [ ] **Step 2: Run**

```bash
npm run test:lhci
```

Expected: thresholds met. If failing, address top finding(s) before continuing.

- [ ] **Step 3: Commit**

```bash
git add .lighthouserc.json
git commit -m "test(lhci): Lighthouse CI thresholds a11y≥95 SEO≥95"
```

---

## Phase 9 — Analytics + CI/CD

### Task 43: Umami snippet integration

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Add Umami script to head**

In `src/layouts/BaseLayout.astro`, add inside `<head>` (above `</head>`):

```astro
{import.meta.env.PROD && (
  <script
    is:inline
    defer
    src="https://cloud.umami.is/script.js"
    data-website-id="UMAMI_WEBSITE_ID_PLACEHOLDER"
  ></script>
)}
```

NOTE: The `UMAMI_WEBSITE_ID_PLACEHOLDER` must be replaced with the actual Umami site ID once the user creates the site in cloud.umami.is. Use an env var:

```astro
{import.meta.env.PROD && import.meta.env.PUBLIC_UMAMI_ID && (
  <script
    is:inline
    defer
    src="https://cloud.umami.is/script.js"
    data-website-id={import.meta.env.PUBLIC_UMAMI_ID}
  ></script>
)}
```

- [ ] **Step 2: Document env var in README**

(Will be added in Task 45.)

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat(analytics): Umami snippet (prod only, env-gated)"
```

---

### Task 44: GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Write file**

```yaml
name: Build, test, and deploy
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install chromium --with-deps
      - run: npm run typecheck
      - name: Build site + all artifacts
        run: npm run build
        env:
          PUBLIC_UMAMI_ID: ${{ secrets.UMAMI_WEBSITE_ID }}
      - name: a11y tests
        run: npm run test:a11y
      - name: SEO tests
        run: npm run test:seo
      - name: Artifacts tests (email leak guard + JSON Resume)
        run: npm run test:artifacts
      - name: i18n tests
        run: npm run test:i18n
      - name: Lighthouse CI
        run: npm run test:lhci
        continue-on-error: true
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: GH Actions build → tests → deploy to GH Pages"
```

---

### Task 45: README + manual QA checklist

**Files:**
- Create: `README.md`, `docs/a11y-checklist.md`, `docs/manual-qa-checklist.md`

- [ ] **Step 1: Write `README.md`**

```markdown
# Gabriel Vargas — Portfolio + CV

Live site: <https://gabrielvargas94.github.io>

Static Astro site optimized for accessibility (WCAG 2.2 AA), classic SEO, and AI/LLM discovery (AEO). Generates per-locale CV artifacts (`cv.md`, `cv.json` JSON Resume, `cv.pdf` tagged), `llms.txt` for AI crawlers, sitemap, hreflang, JSON-LD Person/ProfilePage/FAQPage.

## Stack

- Astro 4.x (static), TypeScript strict
- Zero JS framework — native `<details>` for dropdowns
- Content Collections (Zod) per locale (EN/ES/PT)
- Playwright (PDF + tests), axe-core, Lighthouse CI
- `satori-html` + `@resvg/resvg-js` (OG images)
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

## Env vars

| Name | Where | Purpose |
|---|---|---|
| `PUBLIC_UMAMI_ID` | GH secret `UMAMI_WEBSITE_ID` → injected in build | Umami site ID; only included in prod builds |

## Artifacts published

- `/` `/es/` `/pt/` — main pages per locale
- `/cv.md` `/es/cv.md` `/pt/cv.md` — plain Markdown CV
- `/cv.json` `/es/cv.json` `/pt/cv.json` — JSON Resume schema
- `/cv.pdf` `/es/cv.pdf` `/pt/cv.pdf` — tagged PDF
- `/llms.txt` `/llms-full.txt` (per locale) — AI crawler manifests
- `/sitemap-index.xml` `/robots.txt` `/og/<locale>.png`

## Archived

- `archive/prototype/` — original HTML+JSX+Babel prototype (preserved).
- `archive/Gabriel_Vargas_CV.pdf` — source-of-truth CV PDF.
```

- [ ] **Step 2: Write `docs/a11y-checklist.md`**

```markdown
# A11y Checklist (manual passes)

- [ ] All pages have `<html lang>` matching locale.
- [ ] Skip link is first focusable element.
- [ ] One `<h1>` per page; headings strict (no skips).
- [ ] Focus ring visible (2px solid `var(--accent-dark)`).
- [ ] All interactive elements ≥44×44px.
- [ ] All icons decorative have `aria-hidden="true"`; meaningful ones have `aria-label`.
- [ ] Images have `alt`; decorative images have empty `alt=""`.
- [ ] `<details>` dropdowns operable by keyboard (Space/Enter).
- [ ] Lang switcher uses real `<a>` tags.
- [ ] No JS-only content for primary text.
- [ ] `prefers-reduced-motion: reduce` kills animations.
- [ ] NVDA walkthrough EN/ES/PT.
- [ ] VoiceOver walkthrough EN/ES/PT.
- [ ] Print preview `/cv-print/` renders without overflow.
- [ ] tagged PDF: open `cv.pdf` in Adobe Reader → Tags pane shows H1/H2/L/LI/P structure.
```

- [ ] **Step 3: Write `docs/manual-qa-checklist.md`**

```markdown
# Manual QA Checklist (pre-launch)

## Functional
- [ ] Nav dropdowns open/close on click and keyboard.
- [ ] Anchor links scroll smoothly to sections.
- [ ] Lang switcher routes to `/`, `/es/`, `/pt/`.
- [ ] LinkedIn CTAs open in new tab with `rel=noopener noreferrer`.

## Visual
- [ ] Hero photo renders correctly all viewports.
- [ ] Video placeholders animate (when reduced-motion off).
- [ ] D20 spins (reduced-motion off).
- [ ] All 4 MELI cards render glass effect.
- [ ] Stats render correctly on IDB section.
- [ ] Footer dark band sits at end.

## SEO
- [ ] LinkedIn Post Inspector renders OG image + title correctly.
- [ ] Twitter Card Validator renders summary_large_image.
- [ ] schema.org Validator (validator.schema.org) on `/` reports zero errors.
- [ ] Google Rich Results Test on `/` finds ProfilePage + FAQ.

## AEO
- [ ] `/llms.txt` accessible at root.
- [ ] `/cv.json` validates as JSON Resume (manual: paste at registry.jsonresume.org).
- [ ] `/cv.pdf` opens in Adobe Reader with tag tree.

## Email guard
- [ ] grep recursive over `dist/` for `@` finds no email addresses.
```

- [ ] **Step 4: Commit**

```bash
git add README.md docs/a11y-checklist.md docs/manual-qa-checklist.md
git commit -m "docs: README + a11y + manual QA checklists"
```

---

### Task 46: Initial GitHub push + Pages enable

**Files:**
- No code changes — repo init + push.

- [ ] **Step 1: Verify status**

```bash
git status
git log --oneline | head -20
```

Expected: clean working tree, log shows full migration history.

- [ ] **Step 2: Create GitHub repo (user must do this in browser)**

Browser: <https://github.com/new>
- Repository name: `Gabrielvargas94.github.io` (exact case; must match username + `.github.io`)
- Visibility: Public
- **Do not** initialize with README/license/gitignore.
- Click Create.

- [ ] **Step 3: Add remote and push**

```bash
git remote add origin https://github.com/Gabrielvargas94/Gabrielvargas94.github.io.git
git push -u origin main
```

Expected: push succeeds.

- [ ] **Step 4: Enable Pages from Actions**

Browser: `https://github.com/Gabrielvargas94/Gabrielvargas94.github.io/settings/pages`
- Source: **GitHub Actions**
- Save.

- [ ] **Step 5: Set Umami secret (after creating Umami site)**

User must:
1. Sign up at cloud.umami.is.
2. Add website `https://gabrielvargas94.github.io`.
3. Copy the website ID.
4. In repo Settings → Secrets and variables → Actions → New repository secret:
   - Name: `UMAMI_WEBSITE_ID`
   - Value: (paste from Umami)

- [ ] **Step 6: Trigger first deploy**

Browser: `https://github.com/Gabrielvargas94/Gabrielvargas94.github.io/actions`. The push from Step 3 should have already triggered a workflow run. If not:

```bash
git commit --allow-empty -m "ci: trigger initial deploy"
git push
```

Wait for green check, then visit <https://gabrielvargas94.github.io>.

- [ ] **Step 7: Smoke test live URL**

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://gabrielvargas94.github.io/
curl -s -o /dev/null -w "%{http_code}\n" https://gabrielvargas94.github.io/cv.md
curl -s -o /dev/null -w "%{http_code}\n" https://gabrielvargas94.github.io/cv.json
curl -s -o /dev/null -w "%{http_code}\n" https://gabrielvargas94.github.io/llms.txt
curl -s -o /dev/null -w "%{http_code}\n" https://gabrielvargas94.github.io/cv.pdf
curl -s -o /dev/null -w "%{http_code}\n" https://gabrielvargas94.github.io/es/
curl -s -o /dev/null -w "%{http_code}\n" https://gabrielvargas94.github.io/pt/
curl -s -o /dev/null -w "%{http_code}\n" https://gabrielvargas94.github.io/sitemap-index.xml
curl -s -o /dev/null -w "%{http_code}\n" https://gabrielvargas94.github.io/robots.txt
```

Expected: all `200`.

- [ ] **Step 8: Final commit (if changes made during smoke test)**

```bash
git status
# If clean: done. If dirty: commit fixes.
```

---

> **CHECKPOINT 4 — LAUNCH** — Site is live at `https://gabrielvargas94.github.io`. Run manual QA checklist (`docs/manual-qa-checklist.md`) before announcing.

---

## Self-review notes (covered)

- **Spec coverage:** Every section/decision D1–D18 in spec maps to one or more tasks above. D1 (GH Pages) → Tasks 44, 46. D2 (i18n subpath) → Tasks 3, 31. D3 (tweaks dropped, photo right, accent fixed) → Tasks 4, 5, 21, 23. D4 (zero framework) → Tasks 22, 24–30 (no `client:*` directives). D5 (Content Collections MD) → Tasks 6–13. D6 (CV formats) → Tasks 32–36. D7 (target queries in metadata) → Task 15 (keywords meta). D8 (passive open-to-work) → no badge components written. D9 (LinkedIn only, no email) → Tasks 33, 40 (test guards). D10 (Umami) → Task 43. D11 (video placeholders) → Task 20. D12 (Astro in Web root, prototype archived) → Task 1. D13 (Playwright PDF) → Task 36. D14 (Head of Engineering hero) → Tasks 7, 16, 31. D15 (dynamic OG) → Task 35. D16/D17 (LinkedIn url; Person.url=LinkedIn, sameAs=site+github) → Task 16. D18 (Pages from Actions) → Task 44, 46.

- **Placeholder scan:** No "TBD", no "implement later", no "similar to". Umami `UMAMI_WEBSITE_ID_PLACEHOLDER` is explicitly replaced via env var in Task 43; documented in Task 45 README.

- **Type consistency:** `Locale` type defined once in `src/lib/i18n.ts`, reused across all components. Content schemas defined once in `src/content/config.ts`, accessed via `getCollection`/`getEntry`. UI JSON shape consistent across `en.json`/`es.json`/`pt.json`.

---

## Execution

Plan complete and saved to `docs/superpowers/plans/2026-05-24-astro-migration.md`. Two execution options:

**1. Subagent-Driven (recommended)** — fresh subagent per task, review between tasks, fast iteration.
**2. Inline Execution** — execute tasks in this session with checkpoint reviews.

Which approach?
