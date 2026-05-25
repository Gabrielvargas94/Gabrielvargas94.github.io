import type { RSSFeedItem } from '@astrojs/rss';
import { getCollection, getEntry } from 'astro:content';
import { canonicalUrl } from './seo';
import type { Locale } from './i18n';

interface FeedMeta {
  title: string;
  description: string;
}

const FEED_TITLE: Record<Locale, string> = {
  en: 'Gabriel Vargas — Engineering Leadership Feed',
  es: 'Gabriel Vargas — Liderazgo en Ingeniería',
  pt: 'Gabriel Vargas — Liderança em Engenharia',
};

// Synthetic day-of-month per role so feed readers order them deterministically
// — content collections only store startDate as YYYY-MM.
function parseYearMonth(ym: string): Date {
  const [y, m] = ym.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, 1));
}

export function getFeedMeta(locale: Locale, summary: string): FeedMeta {
  return { title: FEED_TITLE[locale], description: summary };
}

export async function getFeedItems(locale: Locale): Promise<RSSFeedItem[]> {
  const profile = await getEntry('profile', locale);
  if (!profile) throw new Error(`Profile not found for locale ${locale}`);

  const experiences = (await getCollection('experience', (e) => e.data.locale === locale)).sort(
    (a, b) => b.data.startDate.localeCompare(a.data.startDate),
  );

  const profileUrl = canonicalUrl(locale);

  const items: RSSFeedItem[] = experiences.map((e) => ({
    title: `${e.data.company} — ${e.data.title}`,
    link: `${profileUrl}#${e.data.slug}`,
    pubDate: parseYearMonth(e.data.startDate),
    description: e.data.bullets[0],
    content: `<ul>${e.data.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>`,
    categories: e.data.skills,
  }));

  return items;
}

function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
