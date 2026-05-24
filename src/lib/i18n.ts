export type Locale = 'en' | 'es' | 'pt';
export const LOCALES: readonly Locale[] = ['en', 'es', 'pt'] as const;
export const DEFAULT_LOCALE: Locale = 'en';

export const HREFLANG_MAP: Readonly<Record<Locale, string>> = {
  en: 'en-US',
  es: 'es-AR',
  pt: 'pt-BR',
};

export function localePath(locale: Locale, path = ''): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Always end with `/` to match Astro config `trailingSlash: 'always'` and
  // GitHub Pages directory-style serving. Avoids canonical→served redirects.
  const withTrail = cleanPath === '' ? '' : cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;
  if (locale === DEFAULT_LOCALE) return `/${withTrail}`;
  return `/${locale}/${withTrail}`;
}

export function getLocaleFromUrl(url: URL): Locale {
  const seg = url.pathname.split('/').filter(Boolean)[0];
  return LOCALES.includes(seg as Locale) ? (seg as Locale) : DEFAULT_LOCALE;
}
