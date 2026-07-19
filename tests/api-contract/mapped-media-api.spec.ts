import { expect, test } from '@playwright/test';
import { envUrl, loadProfile } from '../../packages/qa-core/src/profile';
const p = loadProfile();
test.use({ storageState: 'reports/.auth-shopadmin.json' });

test('mapped owner media catalog returns canonical facets and items', async ({ page }) => {
  const app = envUrl(p.urls.appEnv);
  const response = await page.request.get(app + p.routes.ownerMediaQuery);
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.ok).toBe(true);
  expect(Array.isArray(body.items)).toBe(true);
  expect(body.facets).toBeTruthy();
  expect(typeof body.count).toBe('number');
});
