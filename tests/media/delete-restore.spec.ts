import {test,expect} from '@playwright/test';
test.describe('Media delete and restore truth',()=>{
 test.skip(()=>process.env.QA_ALLOW_WRITE_TESTS!=='true','Write tests are locked');
 test('delete hides asset; restore returns original metadata and visibility',async({page})=>{
  test.skip(!process.env.SHOPADMIN_STORAGE_STATE,'Shop Admin auth state not mapped');
  const base=process.env.LEADBOX_APP_URL!; const name=`LBQA-${process.env.QA_TEST_RUN_ID||Date.now()}-restore`;
  await page.goto(base+(process.env.QA_SHOP_MEDIA_ROUTE||'/media'));
  await page.locator('[data-qa="media-upload"]').setInputFiles('fixtures/sample-media.svg');
  await page.locator('[data-qa="media-name"]').fill(name); await page.locator('[data-qa="media-save"]').click();
  const card=page.locator('[data-qa="media-card"]',{hasText:name}); await expect(card).toBeVisible();
  await card.locator('[data-qa="media-delete"]').click(); await page.locator('[data-qa="confirm-delete"]').click(); await expect(card).toBeHidden();
  await page.locator('[data-qa="media-trash-tab"]').click(); const trash=page.locator('[data-qa="media-card"]',{hasText:name}); await expect(trash).toBeVisible();
  await trash.locator('[data-qa="media-restore"]').click(); await page.locator('[data-qa="confirm-restore"]').click();
  await page.locator('[data-qa="media-library-tab"]').click(); const restored=page.locator('[data-qa="media-card"]',{hasText:name}); await expect(restored).toBeVisible(); await expect(restored).toHaveAttribute('data-original-intact','true');
 });
});
