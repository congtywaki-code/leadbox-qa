import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
const root=path.resolve('reports/evidence'); const out=[];
function walk(d){ if(!fs.existsSync(d))return; for(const n of fs.readdirSync(d)){const f=path.join(d,n); const s=fs.statSync(f); if(s.isDirectory())walk(f); else if(!/\.auth-.*\.json$/.test(n)){out.push({file:path.relative(process.cwd(),f),bytes:s.size,sha256:crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')});}}}
walk(root); fs.writeFileSync(path.join(root,'index.json'),JSON.stringify({schemaVersion:1,generatedAt:new Date().toISOString(),artifacts:out},null,2)); console.log(`Indexed ${out.length} evidence artifacts.`);
