import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/es/', '/pt/'];

for (const route of routes) {
  test(`a11y: ${route} has no serious or critical violations`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa', 'best-practice'])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    if (serious.length > 0) {
      console.error(JSON.stringify(serious, null, 2));
    }
    expect(serious).toEqual([]);
  });
}
