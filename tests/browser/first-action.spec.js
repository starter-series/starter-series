import { expect, test } from '@playwright/test';

test('legacy page exposes one canonical destination without horizontal overflow', async ({ page }) => {
  const runtimeMessages = [];
  page.on('console', (msg) => {
    if (['error', 'warning'].includes(msg.type())) {
      runtimeMessages.push(`${msg.type()}: ${msg.text()}`);
    }
  });
  page.on('pageerror', (err) => runtimeMessages.push(`pageerror: ${err.message}`));

  await page.goto('/');

  await expect(page.getByRole('heading', { name: /canonical hub/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /open the canonical site/i })).toHaveAttribute(
    'href',
    'https://starter-series.github.io/starter-series/',
  );

  const overflow = await page.evaluate(() => (
    document.documentElement.scrollWidth - document.documentElement.clientWidth
  ));
  expect(overflow).toBeLessThanOrEqual(1);
  expect(runtimeMessages).toEqual([]);
});
