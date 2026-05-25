# DESIGN.md

Design system + visual language for `gabrielvargas94.github.io`. Source of truth when
adding sections, components, or refining the brand. Pairs with `AGENTS.md` (rules) and
`docs/engineering-checklist.md` (a11y/perf gates).

## Direction

Warm editorial. Cream paper + ink text. Newsreader serif headlines with italic accents.
Generous whitespace. Monospace as decoration, not body. Photo treated with frame
ticks + radial accent blob. Section transitions through background swaps (cream ↔ ink ↔
cream-2 ↔ paper), not page wipes.

The goal is recruiter trust + AI readability. Avoid skeuomorphic effects, glossy gradients,
or marketing flourish. The site should read closer to a printed magazine spread than a SaaS
landing page.

## Palette

CSS custom properties live in `src/styles/global.scss`. Use `var(--*)`, never raw hex.

| Token | Hex | Use | Contrast vs cream | Contrast vs ink |
|---|---|---|---|---|
| `--cream` | `#f7f2e8` | Body background, hero | — | — |
| `--cream-2` | `#efe7d6` | Section bg alternation (IDB, IttiAI) | — | — |
| `--paper` | `#fbf8f1` | Card surfaces (Lectures, Certifications) | — | — |
| `--ink` | `#2a211b` | Body text, dark sections | 15:1 AAA | — |
| `--ink-2` | `#4d4036` | Secondary text, captions | 9:1 AAA | — |
| `--ink-3` | `#7a6a5c` | Tertiary text (meta, mono labels) | 4.8:1 AA | — |
| `--accent` | `#c97a4b` | Decorative, large display (≥24px bold), italic accents | 3:1 (large only) | — |
| `--accent-dark` | `#8a4f2c` | Body text on cream/cream-2, focus ring, kickers | 4.7:1 AA | fails (don't use) |
| `--accent-light` | `#e3a76b` | Body text on ink, italic accents on dark | fails (don't use) | 9:1 AAA |

**Rule:** never use `--accent` for body text. Use `--accent-dark` on light backgrounds and
`--accent-light` on `--ink` backgrounds.

## Typography

Loaded via Astro Fonts API (`astro.config.mjs`). Exposed as CSS variables `--font-newsreader`,
`--font-geist`, `--font-jetbrains-mono`. Wrapped in semantic aliases inside
`global.scss`:

| Variable | Stack | Use |
|---|---|---|
| `--serif` | Newsreader, Source Serif Pro, Georgia, serif | Headings, italic accents, pull quotes |
| `--sans` | Geist, system-ui, sans-serif | Body, UI controls, default `<body>` |
| `--mono` | JetBrains Mono, SF Mono, Menlo, monospace | Kickers, eyebrows, meta labels, code |

### Scale (use `clamp()` for fluidity)

| Element | Range | Letter-spacing |
|---|---|---|
| Hero `<h1>` | `clamp(48px, 7vw, 108px)` | -0.03em |
| Contact `<h2>` | `clamp(48px, 8vw, 132px)` | -0.035em |
| Section `<h2>` | `clamp(36px, 5vw, 72px)` | -0.025em |
| Sub-section `<h3>` | `clamp(28px, 4vw, 44px)` | -0.015em |
| Card title `<h3>`/`<h4>` | 22-26px | -0.01em |
| Lede paragraph | `clamp(17px, 1.4vw, 22px)` | normal |
| Body paragraph | 15-17px | normal |
| Mono kicker | 11px | 0.16-0.22em |

Italic accent words (`<em>` inside hero `<h1>` and contact `<h2>`) use `--accent` color +
serif italic. They are not decorative-only — they should be semantically meaningful
(e.g., "Building **AI-first** engineering teams").

## Components

### Pill (`src/components/ui/Pill.astro`)

Universal kicker. Two variants: `light` (default, on cream surfaces) and `dark`
(on `--ink` surfaces). Includes a small dot. Use as the first element in every section's
header.

```astro
<Pill>{s.kicker}</Pill>
<Pill variant="dark">{s.kicker}</Pill>
```

### CTAButton (`src/components/ui/CTAButton.astro`)

Three variants: `primary` (ink-on-cream), `ghost` (transparent with border), `invert`
(cream-on-ink). All ≥44×44px touch target. External by default (target=_blank,
rel=noopener).

### VideoPlaceholder (`src/components/ui/VideoPlaceholder.astro`)

Three modes:
- **Placeholder** (default): stylized mesh + blobs + grain + REC chip
- **Video**: pass `src` prop for an MP4
- **YouTube facade**: pass `youtubeId` — placeholder renders SSR-side, JS lazily injects
  an iframe via IntersectionObserver after `requestIdleCallback`. Avoids LCP/TBT pressure.

### Icon (`src/components/ui/Icon.astro`)

Thin wrapper around `astro-icon/components` `<Icon>`. Use Lucide names: `lucide:linkedin`,
`lucide:chevron-down`, `lucide:award`, etc. Pre-included icons live in `astro.config.mjs`
under `icon.include.lucide`.

### Pull-quote / Frame patterns

- **Frame corners** (used on Hero photo): four absolutely positioned 28×28 corners with
  `border-top: 1.5px solid var(--ink); opacity: 0.55`. Each rotated 0°/90°/-90°/180°.
- **Accent blob** (Hero, Contact halo): radial-gradient with `--accent`, blurred ~20px.
- **Concentric rings** (Spirituality quote frame): inline SVG with 6 nested circles at
  `opacity: 0.16`.
- **Glass card** (SideProject, MELI): `background: rgb(247 242 232 / 5-10%)` +
  `backdrop-filter: blur(12-14px)` + thin cream border at 14-18% opacity.

## Section patterns

Each section conforms to one of these patterns:

### Pattern A — Single column centered

Used by: AIIntro, HobbiesIntro.

```
[Pill kicker]
[<h2> big serif title]
[<p> lede]
```

### Pattern B — 2-column header + content

Used by: MELI, IttiAI, Lectures, SideProject, IDB.

```
[Pill kicker]                              [meta mono label / icon]
[<h2> big serif title]
[<p> lede]
─────────────────────────────────────────────────────────────────
[Content: cards / list / numbered items / stats grid]
```

### Pattern C — Sticky left + scrolling right

Used by: IDB, Certifications.

```
┌─────────────┬─────────────────────────────────┐
│  [icon box] │ [<h2> org name]                 │
│  [Pill]     │ [<p> lede]                      │
│  [mono]     │ [stats grid]                    │
│  (sticky)   │ [italic body quote with border] │
│             │ [...]                           │
└─────────────┴─────────────────────────────────┘
```

### Pattern D — Full-bleed video + overlay card

Used by: IttiSplit (two sides), MeliCards (header + cards over video bg).

Video as `position: absolute; inset: 0; z-index: -1`. Content overlaid at `z-index: 1`
with a glass card or dark gradient scrim guaranteeing ≥4.5:1 contrast for text.

## Motion

- **All animations use `transform` and `opacity`** for GPU compositing. No `box-shadow`,
  `width`, `height`, `top` animations.
- **Respect `prefers-reduced-motion`.** Global rule in `global.scss` `@layer a11y` zeroes
  duration when user opts in.
- **Stagger entries** subtly via `transition-delay` if needed — never block initial paint.
- **Hover transforms ≤4px.** Cards: `translateY(-2px to -4px)`. Talk cards: `translateX(6px)`.
- **Cubic-bezier `cubic-bezier(0.2, 0.8, 0.2, 1)`** is the house easing for hover lifts.

Specific motion in the wild:

| Element | Animation | Notes |
|---|---|---|
| PulseDot | `transform: scale(1→3)` + `opacity: 0.5→0` 2s ease-out infinite | Composited |
| D20 | `transform: rotate()` 18-24s linear infinite | Composited |
| REC dot | `opacity: 1→0.25` 1.4s ease-in-out infinite | Composited |
| Scroll cue arrow | `translateY(0→4px)` 2.4s ease-in-out infinite | Composited |
| Mesh drift | `filter` + `transform: scale()` 18s alternate | Filter cost accepted; can disable |

## Layers (specificity strategy)

```scss
@layer reset, base, components, a11y, print;
```

| Layer | Contents |
|---|---|
| `reset` | `* { box-sizing }`, normalizations |
| `base` | `:root` tokens, `html`/`body`, `img`, `::selection`, `color-scheme: light` |
| `components` | All component `<style>` blocks (wrapped via `@layer components { ... }`) |
| `a11y` | `.skip-link`, `:focus-visible`, `prefers-reduced-motion` |
| `print` | `print.scss` `@media print { ... }` |

**No `!important` anywhere.** Stylelint enforces `declaration-no-important: true`. If a
rule isn't winning, you're in the wrong layer.

## Spacing

Universal padding pattern: `clamp(16px, 4vw, 64px)` for horizontal, `clamp(64px, 8vw, 120px)`
for vertical section padding. Hero is wider (`clamp(80px, 10vw, 140px)`). Contact is
widest (`clamp(120px, 14vw, 200px)`).

Card padding: 24-32px. Border radius: 12px (small), 14-16px (medium), 18-20px (large
frames).

## Responsive

Breakpoints (modern range syntax — `@media (width <= ...)`):

| Width | Effect |
|---|---|
| ≤ 980px | Nav burger menu |
| ≤ 880px | 2-col → 1-col on most sections; hero photo above text |
| ≤ 720px | IttiSplit video panes stack vertically |
| ≤ 560px | Cards single column; status meta inline |

All grids use `auto-fit, minmax(N, 1fr)` where possible — natural reflow without media
queries.

## A11y guardrails

See `docs/a11y-checklist.md` for the full QA list. Highlights:

- Every interactive element ≥44×44px touch target.
- Single `<h1>` per page (the Hero). Sections use `<h2>` (or `<h3>` for sub-sections inside).
- `<details>` for dropdowns — keyboard ops native.
- Lang switcher uses real `<a href>` links; never JS-only.
- `prefers-reduced-motion` respected globally.
- Axe-core enforces ≥4.5:1 contrast for all body text. Fail = build fail.
- `--accent-dark` is the AA-compliant accent for text on cream surfaces.
  `--accent` is decorative-only.

## Brand voice (copy)

- **Concrete > generic.** "Daily multi-million-dollar Golang batches at MercadoPago's core"
  beats "led financial tooling".
- **Numbers up front.** Team sizes, time-to-market lifts, percentage reductions.
- **Real product names.** itti, muv, Monchis, One Source, MercadoPago, Claude Code, Codex,
  Cursor — never genericize.
- **No marketing fluff.** Skip "passionate about", "synergize", "rockstar". Use action
  verbs + measurable outcomes.
- **Italic accent on one word per major headline.** Picks the keyword that should land
  ("Building *AI-first* engineering teams").

## When in doubt

1. Check existing sections for pattern reuse — most layouts already exist.
2. Use `<Pill>` for the kicker, never roll a custom mono span.
3. Use `<Icon name="lucide:..." />`, not inline SVG paths.
4. Reach for `var(--*)` tokens, never raw hex.
5. Run `npm run lint:css && npx astro check && npm run test` before committing.
