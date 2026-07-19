import fs from 'node:fs';
import path from 'node:path';

const input = process.argv[2] || 'reports/qa-summary.json';
const output = process.argv[3] || 'reports/release-gate.json';
const data = JSON.parse(fs.readFileSync(input, 'utf8'));
const blocking = data.rules.filter(r => ['critical','high'].includes(String(r.severity).toLowerCase()) && r.status !== 'PASS');
const result = {
  generatedAt: new Date().toISOString(),
  status: blocking.length ? 'BLOCKED' : 'PASS',
  blockingRules: blocking.map(r => ({ id:r.id, severity:r.severity, message:r.message }))
};
fs.mkdirSync(path.dirname(output), {recursive:true});
fs.writeFileSync(output, JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
if (blocking.length) process.exitCode = 2;
