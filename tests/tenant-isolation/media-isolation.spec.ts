import {test,expect} from '@playwright/test';
test('workspace B cannot read workspace A media',async({request})=>{
 const base=process.env.LEADBOX_APP_URL; const tokenA=process.env.QA_TENANT_A_TOKEN; const tokenB=process.env.QA_TENANT_B_TOKEN; const mediaId=process.env.QA_TENANT_A_MEDIA_ID;
 test.skip(!base||!tokenA||!tokenB||!mediaId,'Tenant tokens/media fixture not mapped');
 const route=process.env.QA_MEDIA_DETAIL_ROUTE||'/wp-json/leadbox/v1/media/';
 const own=await request.get(base+route+mediaId,{headers:{Authorization:`Bearer ${tokenA}`}}); expect(own.status()).toBe(200);
 const cross=await request.get(base+route+mediaId,{headers:{Authorization:`Bearer ${tokenB}`}}); expect([403,404]).toContain(cross.status());
});
