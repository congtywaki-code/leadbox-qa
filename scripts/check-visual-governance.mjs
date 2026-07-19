import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const pendingDir=path.join(root,'approvals','pending');
const pending=fs.existsSync(pendingDir)?fs.readdirSync(pendingDir).filter(x=>x.endsWith('.json')):[];
if(pending.length){console.error(`Visual gate blocked: ${pending.length} screenshot approval(s) pending.`);process.exit(1)}
const policy=JSON.parse(fs.readFileSync(path.join(root,'config','visual-policy.json'),'utf8'));
if(!policy.approvalRequired||!policy.forbidAutoApprovalInCi){console.error('Unsafe visual policy.');process.exit(1)}
console.log('Visual governance gate passed.');
