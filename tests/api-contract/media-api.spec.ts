import {test,expect} from '@playwright/test';
import {assertNoSecretLeak} from '../../packages/api-contract/src/schema';
test('media taxonomy API contract is stable',async({request})=>{
 const base=process.env.LEADBOX_BASE_URL; test.skip(!base,'LEADBOX_BASE_URL not mapped');
 const route=process.env.QA_MEDIA_TAXONOMY_ROUTE||'/wp-json/leadbox/v1/media/taxonomies';
 const r=await request.get(base+route); expect([200,401,403]).toContain(r.status());
 if(r.status()===200){ const b=await r.json(); assertNoSecretLeak(b); expect(b).toBeTruthy(); }
});
