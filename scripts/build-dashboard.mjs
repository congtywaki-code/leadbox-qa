import fs from 'node:fs';
import path from 'node:path';
const src=process.argv[2]||'reports/qa-summary.json';
const dashboard='apps/qa-dashboard';
fs.mkdirSync(dashboard,{recursive:true});
if(!fs.existsSync(src)){
 const fallback={generatedAt:new Date().toISOString(),counts:{pass:0,fail:0,blocked:1},coverage:0,rules:[{id:'LB-MAP-001',status:'BLOCKED',severity:'HIGH',message:'Chưa map version profile LeadBox chính thức.'}]};
 fs.writeFileSync(path.join(dashboard,'summary.json'),JSON.stringify(fallback,null,2));
}else fs.copyFileSync(src,path.join(dashboard,'summary.json'));
console.log(path.resolve(dashboard,'index.html'));
