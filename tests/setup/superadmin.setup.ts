import { test as setup } from '@playwright/test';
import { loginSuperadmin } from '../../packages/qa-core/src/auth';

setup('authenticate superadmin', async ({ page }) => {
  await loginSuperadmin(page);
  await page.context().storageState({ path: 'reports/.auth-superadmin.json' });
});
