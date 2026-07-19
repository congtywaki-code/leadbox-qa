import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import { envUrl, loadProfile } from '../../packages/qa-core/src/profile';
import { writeEvidence } from '../../packages/evidence/src/evidence';

const p = loadProfile();
const stagingEnabled = process.env.QA_STAGING_EXECUTION === 'true';

for (const role of ['superadmin', 'shopadmin'] as const) {
  test(`real authentication evidence · ${role}`, async ({ browser }) => {
    test.skip(!stagingEnabled, 'Set QA_STAGING_EXECUTION=true to collect evidence from isolated staging.');
    const stateFile = role === 'superadmin' ? 'reports/.auth-superadmin.json' : 'reports/.auth-shopadmin.json';
    expect(fs.existsSync(stateFile), `${stateFile} must be created by qa:setup`).toBe(true);
    const base = envUrl(role === 'superadmin' ? p.urls.baseEnv : p.urls.appEnv);
    const route = role === 'superadmin' ? p.routes.superadminMedia : p.routes.shopadminHome;
    const marker = role === 'superadmin' ? p.selectors.wp.adminMarker : p.selectors.shopLogin.authenticatedMarker;
    const context = await browser.newContext({ storageState: stateFile });
    const page = await context.newPage();
    const response = await page.goto(base + route, { waitUntil: 'domcontentloaded' });
    const finalUrl = page.url();
    const markerVisible = await page.locator(marker).first().isVisible().catch(() => false);
    const redirectedToLogin = /\/login\/?(?:\?|$)|wp-login\.php/i.test(finalUrl);
    const status = response?.status() ?? 0;
    const passed = status > 0 && status < 400 && markerVisible && !redirectedToLogin;
    const screenshot = `reports/evidence/auth/${role}.png`;
    await page.screenshot({ path: screenshot, fullPage: true });
    writeEvidence(`reports/evidence/auth/${role}.json`, {
      schemaVersion: 1, id: `AUTH-${role.toUpperCase()}`, type: 'authentication',
      status: passed ? 'PASS' : 'FAIL', capturedAt: new Date().toISOString(),
      leadboxVersion: p.leadboxVersion, environment: base, summary: passed ? 'Authenticated staging session verified.' : 'Authenticated session could not be proven.',
      details: { role, requestedRoute: route, finalUrl, httpStatus: status, marker, markerVisible, redirectedToLogin },
      artifacts: []
    });
    expect(passed).toBe(true);
    await context.close();
  });
}
