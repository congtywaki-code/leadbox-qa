import path from 'node:path';
import { expect, test } from '@playwright/test';
import { envUrl, loadProfile, selector } from '../../packages/qa-core/src/profile';

const p = loadProfile();
const canWrite = process.env.QA_ALLOW_WRITE_TESTS === 'true' && p.capabilities.mediaWriteTest === true;

test.describe('LB-MEDIA-001 public media truth', () => {
  test.skip(!canWrite, 'Enable only on isolated staging with QA_ALLOW_WRITE_TESTS=true and mediaWriteTest=true.');

  test('published Superadmin media becomes visible in Shop Admin', async ({ browser }) => {
    const runId = process.env.QA_TEST_RUN_ID || Date.now().toString();
    const title = `QA Media ${runId}`;

    const superContext = await browser.newContext({ storageState: 'reports/.auth-superadmin.json' });
    const superPage = await superContext.newPage();
    await superPage.goto(envUrl(p.urls.baseEnv) + p.routes.superadminMedia);
    await superPage.locator(p.selectors.media.uploadInput).setInputFiles(path.resolve(p.fixtures.mediaFile));
    await superPage.locator(p.selectors.media.titleInput).fill(title);
    await superPage.locator(p.selectors.media.industrySelect).selectOption(p.fixtures.industry);
    await superPage.locator(p.selectors.media.topicSelect).selectOption(p.fixtures.topic);
    await superPage.locator(p.selectors.media.publishButton).click();
    await expect(superPage.locator(p.selectors.media.publishSuccess)).toBeVisible();
    await superContext.close();

    const shopContext = await browser.newContext({ storageState: 'reports/.auth-shopadmin.json' });
    const shopPage = await shopContext.newPage();
    await shopPage.goto(envUrl(p.urls.appEnv) + p.routes.shopadminMedia);
    await expect(shopPage.locator(p.selectors.media.library)).toBeVisible();
    await expect(shopPage.locator(selector(p.selectors.media.cardByTitle, { title }))).toBeVisible({ timeout: 20000 });
    await shopContext.close();
  });
});
