import { expect, test } from '@playwright/test';

const HERO_COMMAND = 'gh repo create my-app --template starter-series/docker-deploy-starter';

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

test('goal picker opens starter modal with a copyable template command', async ({ page }) => {
  await page.goto('/');

  const pickerTemplates = await page
    .locator('[data-picker-template]')
    .evaluateAll((buttons) => buttons.map((button) => button.dataset.pickerTemplate));
  expect(pickerTemplates.length).toBeGreaterThan(0);

  for (const template of pickerTemplates) {
    await page.locator(`[data-picker-template="${template}"]`).click();
    await expect(page.locator('#modal')).toHaveClass(/open/);
    await expect(page.locator('#modalCommand')).toHaveText(
      `gh repo create my-app --template starter-series/${template}`,
    );
    await page.keyboard.press('Escape');
    await expect(page.locator('#modal')).not.toHaveClass(/open/);
  }

  await page.locator('[data-picker-template="cloudflare-pages-starter"]').click();
  await expect(page.locator('#modal')).toHaveClass(/open/);

  const modalCopyButton = page.locator('.modal-command .copy-btn[data-copy-source="modalCommand"]');
  await modalCopyButton.click();
  await expect(modalCopyButton).toHaveClass(/copied/);
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(
    'gh repo create my-app --template starter-series/cloudflare-pages-starter',
  );
});
