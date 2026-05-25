import type { APIRoute } from 'astro';
import rss from '@astrojs/rss';
import { getEntry } from 'astro:content';
import { canonicalUrl } from '../lib/seo';
import { getFeedItems, getFeedMeta } from '../lib/feed';

export const GET: APIRoute = async (context) => {
  const profile = await getEntry('profile', 'en');
  if (!profile) throw new Error('Profile not found for locale en');
  const { title, description } = getFeedMeta('en', profile.data.summary);
  return rss({
    title,
    description,
    site: context.site ?? canonicalUrl('en'),
    items: await getFeedItems('en'),
    customData: '<language>en-US</language>',
  });
};
