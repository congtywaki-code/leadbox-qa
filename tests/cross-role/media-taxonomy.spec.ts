import { expect, test } from '@playwright/test';
import { envUrl, loadProfile } from '../../packages/qa-core/src/profile';
const p = loadProfile();
test.use({ storageState: 'reports/.auth-shopadmin.json' });

test('Shop Admin media picker exposes server-backed industry and topic facets', async ({ page }) => {
  await page.goto(envUrl(p.urls.appEnv) + p.routes.shopadminMedia);
  await expect(page.locator(p.selectors.studio.shell)).toBeVisible();
  const open = page.locator(p.selectors.media.libraryOpen);
  await expect(open).toBeVisible();
  await open.click();
  await expect(page.locator(p.selectors.media.library)).toBeVisible();
  const industry = page.locator(p.selectors.media.industryFilter);
  const topic = page.locator(p.selectors.media.topicFilter);
  await expect(industry).toBeVisible();
  await expect(topic).toBeVisible();
  expect(await industry.locator('option').count()).toBeGreaterThan(1);
  expect(await topic.locator('option').count()).toBeGreaterThan(1);
});
