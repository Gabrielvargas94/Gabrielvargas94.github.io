import type { APIRoute } from 'astro';
import rss from '@astrojs/rss';
import { getEntry } from 'astro:content';
import { canonicalUrl } from '../../lib/seo';
import { getFeedItems, getFeedMeta } from '../../lib/feed';

export const GET: APIRoute = async (context) => {
  const profile = await getEntry('profile', 'pt');
  if (!profile) throw new Error('Profile not found for locale pt');
  const { title, description } = getFeedMeta('pt', profile.data.summary);
  return rss({
    title,
    description,
    site: context.site ?? canonicalUrl('pt'),
    items: await getFeedItems('pt'),
    customData: '<language>pt-BR</language>',
  });
};
