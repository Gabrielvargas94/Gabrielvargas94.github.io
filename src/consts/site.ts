// Central constants — single source of truth for URLs, identifiers, and metadata.
// Imported by SEO helpers, JSON-LD generators, build scripts, and components.
// If a value changes (domain, LinkedIn handle, repo name), edit it here only.

import type { Locale } from '../lib/i18n';

/** Canonical site origin (matches GitHub Pages user-site URL). */
export const SITE = 'https://gabrielvargas94.github.io';

/** Owner identity. */
export const OWNER = {
  name: 'Gabriel Vargas',
  givenName: 'Gabriel',
  familyName: 'Vargas',
  /** Used in robots/sitemap host headers. */
  domain: 'gabrielvargas94.github.io',
} as const;

/** External profile URLs — funnel destinations for CTAs and `sameAs` in schema.org. */
export const PROFILES = {
  linkedin: 'https://www.linkedin.com/in/gabriel-vargas/',
  github: 'https://github.com/Gabrielvargas94',
  repo: 'https://github.com/Gabrielvargas94/Gabrielvargas94.github.io',
} as const;

/** Address used by schema.org Person.address. */
export const ADDRESS = {
  locality: 'Buenos Aires',
  country: 'AR',
  region: 'Argentina',
} as const;

/** ISO BCP 47 language codes per locale for hreflang and OG meta. */
export const HREFLANG: Readonly<Record<Locale, string>> = {
  en: 'en-US',
  es: 'es-AR',
  pt: 'pt-BR',
};

/** OpenGraph locale identifiers (underscore form). */
export const OG_LOCALE: Readonly<Record<Locale, string>> = {
  en: 'en_US',
  es: 'es_AR',
  pt: 'pt_BR',
};

/** Education credential — referenced by JSON-LD and cv.md. */
export const EDUCATION = {
  institution: 'Universidad Tecnológica Nacional',
  studyType: 'B.Sc.',
  area: 'Information Systems Engineering',
  note: 'coursework complete',
} as const;

/** Target-query keywords for `<meta name="keywords">` and AEO signals. */
export const KEYWORDS = [
  'Head of Engineering',
  'VP Engineering',
  'Director of Engineering',
  'Engineering Manager',
  'Senior Engineering Manager',
  'AI-first Engineering',
  'Claude Code',
  'Cursor',
  'Remote Engineering Leader',
  'LATAM',
  'Mercado Libre',
  'Inter-American Development Bank',
  'itti',
  'Architectural Refactoring',
  'Microfrontends',
  'React Native',
  'AWS',
  'GCP',
  'Golang',
] as const;
