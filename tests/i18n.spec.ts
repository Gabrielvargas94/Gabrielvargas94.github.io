import { test, expect } from '@playwright/test';

test('hreflang annotations are reciprocal across locales', async ({ page }) => {
  const expected = ['en-US', 'es-AR', 'pt-BR', 'x-default'];
  for (const path of ['/', '/es/', '/pt/']) {
    await page.goto(path);
    const langs = await page.locator('link[rel="alternate"][hreflang]').evaluateAll((els) =>
      els.map((e) => e.getAttribute('hreflang')).filter((x): x is string => x !== null),
    );
    expect(langs.sort()).toEqual([...expected].sort());
  }
});

test('lang switcher offers all three locale paths', async ({ page }) => {
  await page.goto('/');
  // Open language dropdown
  await page.locator('details.lang summary').click();
  const links = await page.locator('details.lang .menu a').evaluateAll((els) =>
    els.map((e) => (e as HTMLAnchorElement).getAttribute('href')),
  );
  // Default locale path is `/`; ES + PT are prefixed.
  expect(links).toContain('/');
  expect(links.some((l) => l?.startsWith('/es'))).toBe(true);
  expect(links.some((l) => l?.startsWith('/pt'))).toBe(true);
});
