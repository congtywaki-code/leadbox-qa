import fs from 'node:fs';
const file = 'reports/results.json';
if (!fs.existsSync(file)) {
  console.error('No Playwright JSON report found. Run npm run qa:all first.');
  process.exit(1);
}
const report = JSON.parse(fs.readFileSync(file, 'utf8'));
let passed = 0, failed = 0, skipped = 0;
function walk(suites = []) {
  for (const suite of suites) {
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        const status = test.results?.at(-1)?.status;
        if (status === 'passed') passed++;
        else if (status === 'skipped') skipped++;
        else failed++;
      }
    }
    walk(suite.suites);
  }
}
walk(report.suites);
const severity = failed ? 'BLOCKED' : 'PASS';
const summary = { severity, passed, failed, skipped, generatedAt: new Date().toISOString() };
fs.writeFileSync('reports/qa-summary.json', JSON.stringify(summary, null, 2));
console.log(summary);
process.exit(failed ? 1 : 0);
