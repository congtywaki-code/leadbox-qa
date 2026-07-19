import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import { envUrl, loadProfile } from '../../packages/qa-core/src/profile';
import { writeEvidence } from '../../packages/evidence/src/evidence';

const p = loadProfile();
const stagingEnabled = process.env.QA_STAGING_EXECUTION === 'true';

test('diagnose public media visibility from API to Shop Admin picker', async ({ browser }) => {
  test.skip(!stagingEnabled, 'Set QA_STAGING_EXECUTION=true to diagnose isolated staging.');
  const context = await browser.newContext({ storageState: 'reports/.auth-shopadmin.json' });
  const page = await context.newPage();
  const network: Array<Record<string, unknown>> = [];
  const consoleErrors: string[] = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('response', async response => {
    if (!response.url().includes('/leadbox/v1/owner/studio/media')) return;
    let body: unknown = null;
    try { body = await response.json(); } catch { body = '[non-json]'; }
    network.push({ url: response.url(), status: response.status(), contentType: response.headers()['content-type'], body });
  });
  const studioUrl = envUrl(p.urls.appEnv) + p.routes.studio;
  await page.goto(studioUrl, { waitUntil: 'domcontentloaded' });
  await expect(page.locator(p.selectors.studio.shell)).toBeVisible();
  const open = page.locator(p.selectors.media.libraryOpen).first();
  if (await open.count()) await open.click();
  const libraryVisible = await page.locator(p.selectors.media.library).first().isVisible().catch(() => false);
  await page.waitForTimeout(1500);
  const cardCount = await page.locator(p.selectors.media.card).count();
  const industryOptions = await page.locator(`${p.selectors.media.industryFilter} option`).allTextContents().catch(() => []);
  const topicOptions = await page.locator(`${p.selectors.media.topicFilter} option`).allTextContents().catch(() => []);
  const screenshot = 'reports/evidence/media/shop-library.png';
  await page.screenshot({ path: screenshot, fullPage: true });
  const apiCall = network.at(-1);
  const apiStatus = Number(apiCall?.status || 0);
  const diagnosis = !apiCall ? 'API_NOT_CALLED' : apiStatus !== 200 ? 'API_HTTP_FAILURE' : !libraryVisible ? 'PICKER_NOT_VISIBLE' : cardCount === 0 ? 'CATALOG_EMPTY_OR_FILTERED' : 'VISIBLE';
  const passed = diagnosis === 'VISIBLE';
  writeEvidence('reports/evidence/media/publish-visibility.json', {
    schemaVersion: 1, id: 'LB-MEDIA-001-DIAGNOSIS', type: 'media-diagnosis', status: passed ? 'PASS' : 'FAIL',
    capturedAt: new Date().toISOString(), leadboxVersion: p.leadboxVersion, environment: envUrl(p.urls.appEnv),
    summary: `Media visibility diagnosis: ${diagnosis}`,
    details: { studioUrl, diagnosis, libraryVisible, cardCount, industryOptionCount: industryOptions.length, topicOptionCount: topicOptions.length, network, consoleErrors }, artifacts: []
  });
  fs.writeFileSync('reports/evidence/media/network-summary.json', JSON.stringify({ network, consoleErrors }, null, 2));
  expect(apiCall, 'Owner media catalog request must be observed').toBeTruthy();
  expect(apiStatus).toBe(200);
  expect(libraryVisible).toBe(true);
  expect(cardCount).toBeGreaterThan(0);
  await context.close();
});
