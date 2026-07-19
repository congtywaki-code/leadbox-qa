import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const matrix = JSON.parse(fs.readFileSync(path.resolve('config/responsive-matrix.json'),'utf8'));
const profileName = process.env.LEADBOX_PROFILE || '_template';
const profile = JSON.parse(fs.readFileSync(path.resolve(`profiles/versions/${profileName}/profile.json`),'utf8'));

for (const vp of matrix.viewports) {
  test.describe(`shared renderer parity · ${vp.id}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });
    test('Studio preview remains contained and visually comparable', async ({ page }) => {
      test.skip(!profile.capabilities?.sharedRendererParity, 'Map official LeadBox build first.');
      await page.goto(`${process.env.LEADBOX_APP_URL}${profile.routes.studio}`);
      const preview = page.locator(profile.selectors.studio.preview);
      await expect(preview).toBeVisible();
      const box = await preview.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(vp.width + 1);
      await expect(preview).toHaveScreenshot(`studio-${vp.id}.png`, { animations: 'disabled', maxDiffPixelRatio: 0.002 });
    });
  });
}
