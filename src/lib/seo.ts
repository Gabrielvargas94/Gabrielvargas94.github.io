import { LOCALES, HREFLANG_MAP, DEFAULT_LOCALE, type Locale, localePath } from './i18n';

export const SITE = 'https://gabrielvargas94.github.io';

export function canonicalUrl(locale: Locale, path = ''): string {
  return `${SITE}${localePath(locale, path)}`;
}

export interface HreflangLink {
  hreflang: string;
  href: string;
}

export function hreflangLinks(path = ''): readonly HreflangLink[] {
  const links: HreflangLink[] = LOCALES.map((l) => ({
    hreflang: HREFLANG_MAP[l],
    href: canonicalUrl(l, path),
  }));
  links.push({ hreflang: 'x-default', href: canonicalUrl(DEFAULT_LOCALE, path) });
  return links;
}

export function ogImageUrl(locale: Locale): string {
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  return `${SITE}${prefix}/og/${locale}.png`;
}
