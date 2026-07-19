import { test as setup } from '@playwright/test';
import { loginShopadmin } from '../../packages/qa-core/src/auth';

setup('authenticate shop admin', async ({ page }) => {
  await loginShopadmin(page);
  await page.context().storageState({ path: 'reports/.auth-shopadmin.json' });
});
