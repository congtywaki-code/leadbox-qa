import { expect, test } from '@playwright/test';
import { envUrl, loadProfile } from '../../packages/qa-core/src/profile';

const p = loadProfile();
test.use({ storageState: 'reports/.auth-shopadmin.json' });

test('Studio preview stays inside viewport without horizontal overflow', async ({ page }) => {
  await page.goto(envUrl(p.urls.appEnv) + p.routes.studio);
  await expect(page.locator(p.selectors.studio.shell)).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow).toBe(false);
  const box = await page.locator(p.selectors.studio.preview).boundingBox();
  expect(box).not.toBeNull();
  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width + 1);
});
