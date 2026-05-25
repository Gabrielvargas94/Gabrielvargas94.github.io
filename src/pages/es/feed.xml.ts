import type { APIRoute } from 'astro';
import rss from '@astrojs/rss';
import { getEntry } from 'astro:content';
import { canonicalUrl } from '../../lib/seo';
import { getFeedItems, getFeedMeta } from '../../lib/feed';

export const GET: APIRoute = async (context) => {
  const profile = await getEntry('profile', 'es');
  if (!profile) throw new Error('Profile not found for locale es');
  const { title, description } = getFeedMeta('es', profile.data.summary);
  return rss({
    title,
    description,
    site: context.site ?? canonicalUrl('es'),
    items: await getFeedItems('es'),
    customData: '<language>es-AR</language>',
  });
};
