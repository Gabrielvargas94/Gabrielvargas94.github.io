import type { APIRoute } from 'astro';
import { renderCvMd } from '../lib/cv-md';

export const GET: APIRoute = async () => {
  const md = await renderCvMd('en');
  return new Response(md, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
