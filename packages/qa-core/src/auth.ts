import { expect, Page } from '@playwright/test';
import { envUrl, loadProfile } from './profile';

export async function loginSuperadmin(page: Page): Promise<void> {
  const p = loadProfile();
  await page.goto(envUrl(p.urls.baseEnv) + p.routes.wpLogin);
  await page.locator(p.selectors.wp.username).fill(required('SUPERADMIN_USERNAME'));
  await page.locator(p.selectors.wp.password).fill(required('SUPERADMIN_PASSWORD'));
  await Promise.all([
    page.waitForLoadState('domcontentloaded'),
    page.locator(p.selectors.wp.submit).click()
  ]);
  await expect(page.locator(p.selectors.wp.adminBar)).toBeVisible();
}

export async function loginShopadmin(page: Page): Promise<void> {
  const p = loadProfile();
  await page.goto(envUrl(p.urls.appEnv) + p.routes.shopadminLogin);
  await page.locator(p.selectors.shopLogin.username).fill(required('SHOPADMIN_USERNAME'));
  await page.locator(p.selectors.shopLogin.password).fill(required('SHOPADMIN_PASSWORD'));
  await page.locator(p.selectors.shopLogin.submit).click();
  await expect(page.locator(p.selectors.shopLogin.authenticatedMarker)).toBeVisible({ timeout: 20000 });
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing secret: ${name}`);
  return value;
}
