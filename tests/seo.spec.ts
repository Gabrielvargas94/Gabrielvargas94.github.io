import { test, expect } from '@playwright/test';

interface Route {
  path: string;
  lang: 'en' | 'es' | 'pt';
}

const routes: Route[] = [
  { path: '/', lang: 'en' },
  { path: '/es/', lang: 'es' },
  { path: '/pt/', lang: 'pt' },
];

for (const r of routes) {
  test(`seo: ${r.path} has correct meta + JSON-LD`, async ({ page }) => {
    await page.goto(r.path);

    await expect(page).toHaveTitle(/Gabriel Vargas/);

    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    // Google truncates meta descriptions at ~155-160 chars on desktop and
    // ~120 on mobile. Keep within the SEO sweet spot so snippets aren't cut.
    expect(desc).toBeTruthy();
    expect(desc!.length).toBeGreaterThanOrEqual(120);
    expect(desc!.length).toBeLessThanOrEqual(160);

    await expect(page.locator('html')).toHaveAttribute('lang', r.lang);

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toContain('gabrielvargas94.github.io');

    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
    expect(ogType).toBe('profile');

    const ldScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ldScripts.length).toBeGreaterThanOrEqual(2);

    const graphSchema = ldScripts
      .map((t) => JSON.parse(t) as Record<string, unknown>)
      .find((j) => Array.isArray((j as { '@graph'?: unknown[] })['@graph']));
    expect(graphSchema).toBeTruthy();

    type GraphNode = { '@type': string; name?: string; jobTitle?: string; url?: string };
    const graph = (graphSchema as { '@graph': GraphNode[] })['@graph'];
    const person = graph.find((n) => n['@type'] === 'Person');
    expect(person?.name).toBe('Gabriel Vargas');
    expect(person?.jobTitle).toBe('Head of Engineering');
    expect(person?.url).toContain('linkedin.com');

    // 3 locales + x-default
    const hreflangCount = await page.locator('link[rel="alternate"][hreflang]').count();
    expect(hreflangCount).toBe(4);
  });
}
