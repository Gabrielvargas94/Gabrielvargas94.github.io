# A11y Checklist (manual passes)

- [ ] All pages have `<html lang>` matching locale.
- [ ] Skip link is first focusable element.
- [ ] One `<h1>` per page; headings strict (no skips).
- [ ] Focus ring visible (2px solid `var(--focus-ring)`).
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
- [ ] Tagged PDF: open `cv.pdf` in Adobe Reader → Tags pane shows H1/H2/L/LI/P structure.
