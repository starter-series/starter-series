import { expect, test } from '@playwright/test';

const HERO_COMMAND = 'npx @starter-series/create add-component';

test.beforeEach(async ({ context, page }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const runtimeMessages = [];
  page.on('console', (msg) => {
    if (['error', 'warning'].includes(msg.type())) {
      runtimeMessages.push(`${msg.type()}: ${msg.text()}`);
    }
  });
  page.on('pageerror', (err) => runtimeMessages.push(`pageerror: ${err.message}`));
  page.runtimeMessages = runtimeMessages;
});

test.afterEach(async ({ page }) => {
  expect(page.runtimeMessages).toEqual([]);
});

test('hero copy command works in a real browser without horizontal overflow', async ({ page }) => {
  await page.goto('/');

  const copyButton = page.locator('#hero-command .copy-btn');
  await expect(copyButton).toBeVisible();
  await copyButton.click();

  await expect(copyButton).toHaveClass(/copied/);
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(HERO_COMMAND);

  const overflow = await page.evaluate(() => (
    document.documentElement.scrollWidth - document.documentElement.clientWidth
  ));
  expect(overflow).toBeLessThanOrEqual(1);
});
