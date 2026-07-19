import fs from 'node:fs';
import path from 'node:path';
if (fs.existsSync('.env')) {
  for (const raw of fs.readFileSync('.env','utf8').split(/\r?\n/)) {
    const line = raw.trim(); if (!line || line.startsWith('#') || !line.includes('=')) continue;
    const i=line.indexOf('='); const key=line.slice(0,i).trim(); let value=line.slice(i+1).trim();
    value=value.replace(/^['\"]|['\"]$/g,''); if (!(key in process.env)) process.env[key]=value;
  }
}
const required = ['LEADBOX_BASE_URL','LEADBOX_APP_URL','SUPERADMIN_USERNAME','SUPERADMIN_PASSWORD','SHOPADMIN_USERNAME','SHOPADMIN_PASSWORD'];
const missing = required.filter(k => !process.env[k]?.trim());
const productionHosts = ['leadbox.vn','app.leadbox.vn'];
let unsafe = [];
for (const key of ['LEADBOX_BASE_URL','LEADBOX_APP_URL']) {
  try { const host = new URL(process.env[key] || 'http://invalid').hostname; if (productionHosts.includes(host) && process.env.QA_ALLOW_PRODUCTION !== 'true') unsafe.push(`${key}=${host}`); } catch {}
}
const enabled = process.env.QA_STAGING_EXECUTION === 'true';
const status = missing.length || unsafe.length || !enabled ? 'BLOCKED' : 'PASS';
const result = { schemaVersion: 1, status, checkedAt: new Date().toISOString(), stagingExecutionEnabled: enabled, missingVariables: missing, unsafeProductionTargets: unsafe, writeTestsEnabled: process.env.QA_ALLOW_WRITE_TESTS === 'true', message: status === 'PASS' ? 'Staging execution prerequisites are present.' : 'Staging execution is blocked until prerequisites are satisfied.' };
fs.mkdirSync(path.resolve('reports/evidence'),{recursive:true});
fs.writeFileSync('reports/evidence/staging-readiness.json', JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
if (status !== 'PASS') process.exit(2);
