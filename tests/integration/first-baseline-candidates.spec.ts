import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { envUrl, loadProfile } from '../../packages/qa-core/src/profile';

const p = loadProfile();
const matrix = JSON.parse(fs.readFileSync('config/responsive-matrix.json','utf8'));
const stagingEnabled = process.env.QA_STAGING_EXECUTION === 'true';

for (const vp of matrix.viewports) {
  test(`capture first Studio baseline candidate · ${vp.id}`, async ({ browser }) => {
    test.skip(!stagingEnabled, 'Set QA_STAGING_EXECUTION=true to capture staging baseline candidates.');
    const context = await browser.newContext({ storageState: 'reports/.auth-shopadmin.json', viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    await page.goto(envUrl(p.urls.appEnv) + p.routes.studio, { waitUntil: 'networkidle' });
    await expect(page.locator(p.selectors.studio.preview)).toBeVisible();
    await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}' });
    const file = path.resolve(`baselines/candidates/studio-${vp.id}.png`);
    await page.locator(p.selectors.studio.preview).screenshot({ path: file, animations: 'disabled' });
    const sha256 = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    const id = `studio-${vp.id}-${p.leadboxVersion.replace(/[^a-z0-9.-]/gi,'_')}`;
    const pending = {
      schemaVersion: 1, id, surface: 'shopadmin-studio-preview', viewport: vp,
      leadboxVersion: p.leadboxVersion, environment: envUrl(p.urls.appEnv),
      status: 'pending', createdAt: new Date().toISOString(), file: path.relative(process.cwd(), file), sha256,
      sourceRoute: p.routes.studio, selector: p.selectors.studio.preview,
      approvalPolicy: 'manual-review-required'
    };
    fs.writeFileSync(`approvals/pending/${id}.json`, JSON.stringify(pending,null,2));
    await context.close();
  });
}
