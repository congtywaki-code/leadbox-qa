import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { envUrl, loadProfile } from '../../packages/qa-core/src/profile';

const p = loadProfile();
test.use({ storageState: 'reports/.auth-shopadmin.json' });

test('Shop Admin has no serious or critical accessibility violations', async ({ page }) => {
  await page.goto(envUrl(p.urls.appEnv) + p.routes.shopadminMedia);
  const result = await new AxeBuilder({ page }).analyze();
  const blocking = result.violations.filter(v => v.impact === 'serious' || v.impact === 'critical');
  expect(blocking).toEqual([]);
});
