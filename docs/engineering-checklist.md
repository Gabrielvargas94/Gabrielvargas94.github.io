# Engineering Checklist (for every component / task)

This is the pre-flight checklist every implementer subagent must verify before
committing. Reviewers will fail tasks that miss these.

## CSS / SCSS

- **No `!important`.** Enforced by `stylelint` (`declaration-no-important: true`).
  - Use cascade layers (`@layer reset, base, components, a11y, print`) to win specificity battles.
  - Every component `<style>` block in Astro MUST be wrapped in `@layer components { ... }`.
- **No hex shorthand.** Use `#ffffff`, not `#fff` (stylelint enforces).
- **Lowercase value keywords.** Stylelint catches `Auto`, `Block`, etc.
- **`color-scheme: light`** declared in `:root`.
- **No `:focus`, use `:focus-visible`.** Keyboard rings only — mouse users don't see them.
- **Focus ring uses `var(--focus-ring)`** (= `--accent-dark`), 2px solid, 2px offset. No `border-radius` on the ring rule itself.
- **No magic numbers.** Pull from `$palette`, `$fonts`, or document why a literal is necessary.
- **Use CSS custom properties (`var(--token)`), not raw hex** inside component styles.
- **Max nesting depth: 3.** Stylelint enforces.
- **Comments use `/* ... */` for emitted CSS, `// ...` for SCSS-only intent.**

## A11y

- **WCAG 2.2 AA target.** No `serious` or `critical` axe violations.
- **One `<h1>` per page.** Headings strict — no skipped levels.
- **Skip link** as first focusable element on every full page.
- **Decorative icons:** `aria-hidden="true"` AND no aria-label.
- **Meaningful icons:** `aria-label="..."` with translated text.
- **Images:** `alt=""` for decorative, descriptive `alt="..."` for content.
- **Touch targets ≥44×44px** (CSS `min-height: 44px` on CTAs/buttons/nav items).
- **Native semantics first.** Use `<details>`/`<summary>` for disclosures, real `<a>` for navigation, `<button>` for actions. ARIA only when no native equivalent.
- **`lang` attribute** on every `<html>`, locale-specific.
- **Inline foreign words** get `<span lang="...">`.

## SEO / AEO

- **Title ≤60 chars**, keyword-rich pattern: `{Name} — {Title} | {Specialty}, ex-{Company}`.
- **Meta description 150–160 chars**.
- **One canonical** `<link rel="canonical">` per page.
- **hreflang** annotations for all 3 locales + `x-default`.
- **JSON-LD ProfilePage + Person + WorkExperience** on home pages.
- **OpenGraph + Twitter Card** complete.
- **No JS-only content** for primary text. Crawlers/AI must see the content in HTML.

## Email & privacy

- **No email addresses** in any public artifact (HTML, MD, JSON, TXT, XML). Enforced by Task 40 artifact test.
- **No phone numbers** in CV artifacts.
- **Contact path = LinkedIn only.**

## TypeScript

- **Strict mode** (`astro/tsconfigs/strict`).
- **No `any`.** Use proper types or `unknown` with narrowing.
- **No unused imports** (Astro check catches).
- **`Locale` type imported from `src/lib/i18n.ts`**, never inlined.
- **Content access** via `getCollection` / `getEntry` only.

## Performance

- **Zero JS framework runtime** for components. Astro SSR + vanilla JS only.
- **`client:*` hydration** forbidden unless absolutely necessary — document why.
- **Inline scripts ≤1KB total** across all pages.
- **CSS scoped to component** via Astro `<style>` blocks, wrapped in `@layer components`.
- **Image dimensions** (`width` + `height`) set on every `<img>`.
- **Fonts** preconnected + display=swap.

## Git / commit hygiene

- **Conventional commits**: `feat(scope):`, `fix(scope):`, `chore:`, `refactor(scope):`, `test(scope):`, `docs(scope):`.
- **One logical change per commit.**
- **No `node_modules/`** in commit (`.gitignore` covers).
- **Lockfile committed** with every dependency change.
- **No `console.log`** in shipped code.

## Pre-commit gates

Run before every commit:
1. `npm run lint:css` — must pass with zero violations.
2. `npm run typecheck` — must exit 0 (once `@astrojs/check` is installed).
3. Verify file doesn't contain `@gabrielvargas94` or any email-like string.
