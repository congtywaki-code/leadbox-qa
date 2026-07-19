import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const [action, id, reviewer=''] = process.argv.slice(2);
const root = process.cwd();
const pending = path.join(root, 'approvals', 'pending', `${id}.json`);
const approved = path.join(root, 'approvals', 'approved', `${id}.json`);
if (!['approve','reject'].includes(action) || !id) {
  console.error('Usage: node scripts/visual-approval.mjs approve|reject <id> <reviewer>'); process.exit(2);
}
if (!fs.existsSync(pending)) { console.error(`Pending approval not found: ${pending}`); process.exit(2); }
const record = JSON.parse(fs.readFileSync(pending,'utf8'));
const baselinePath = path.join(root, record.file);
if (!fs.existsSync(baselinePath)) { console.error(`Baseline file missing: ${baselinePath}`); process.exit(2); }
const hash = crypto.createHash('sha256').update(fs.readFileSync(baselinePath)).digest('hex');
if (hash !== record.sha256) { console.error('Baseline checksum mismatch; approval blocked.'); process.exit(1); }
if (action === 'reject') { fs.unlinkSync(pending); console.log(`Rejected ${id}`); process.exit(0); }
if (!reviewer.trim()) { console.error('Reviewer is required.'); process.exit(2); }
record.approvedBy = reviewer;
record.approvedAt = new Date().toISOString();
fs.mkdirSync(path.dirname(approved), {recursive:true});
fs.writeFileSync(approved, JSON.stringify(record,null,2));
fs.unlinkSync(pending);
console.log(`Approved ${id} by ${reviewer}`);
