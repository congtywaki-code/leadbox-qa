import fs from 'node:fs';
import path from 'node:path';
const input = process.argv[2] || 'reports/qa-summary.json';
const output = process.argv[3] || 'reports/ai-analysis.md';
const data = JSON.parse(fs.readFileSync(input,'utf8'));
const failures = data.rules.filter(r=>r.status!=='PASS');
const lines=['# LeadBox QA Analysis','',`Generated: ${new Date().toISOString()}`,''];
if(!failures.length){lines.push('Không phát hiện lỗi chặn phát hành.');}
for(const r of failures){
  let hint='Kiểm tra selector, route và dữ liệu fixture của version profile.';
  if(r.id.startsWith('LB-MEDIA')) hint='Ưu tiên kiểm tra API publish, visibility, taxonomy mapping, cache và tenant scope.';
  if(r.id.startsWith('LB-RESP')) hint='Kiểm tra container width, overflow, iframe scaling và shared renderer.';
  if(r.id.startsWith('LB-AUTH')) hint='Kiểm tra nonce, cookie domain, redirect và storage state.';
  lines.push(`## ${r.id} — ${r.severity}`,'',`- Trạng thái: ${r.status}`,`- Mô tả: ${r.message}`,`- Gợi ý: ${hint}`,'');
}
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,lines.join('\n'));
console.log(output);
