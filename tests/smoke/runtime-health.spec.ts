import { expect, test } from '@playwright/test';
import { envUrl, loadProfile } from '../../packages/qa-core/src/profile';
const p = loadProfile();

test('LeadBox app login surface loads without WordPress branding', async ({ page }) => {
  await page.goto(envUrl(p.urls.appEnv) + p.routes.shopadminLogin);
  await expect(page.locator('body.lb-auth-page')).toBeVisible();
  await expect(page.locator("form input[name='log']")).toBeVisible();
  await expect(page.locator("form input[name='pwd']")).toBeVisible();
  await expect(page.locator('body')).not.toContainText(/WordPress/i);
});

test('Shop Admin shell loads without fatal errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(envUrl(p.urls.appEnv));
  await expect(page.locator('body')).not.toContainText(/fatal error|critical error|uncaught exception/i);
  expect(errors.filter(e => /fatal|uncaught|500/i.test(e))).toEqual([]);
});
