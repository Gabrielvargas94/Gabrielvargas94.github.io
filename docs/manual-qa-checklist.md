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
- [ ] `/cv.json` validates as JSON Resume (paste at registry.jsonresume.org).
- [ ] `/cv.pdf` opens in Adobe Reader with tag tree.

## Email guard
- [ ] grep recursive over `dist/` for `@` finds no email addresses.
