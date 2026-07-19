import fs from 'node:fs';
import path from 'node:path';
export type QaArtifact={id:string;type:string;owner:string;createdAt:string;cleanup?:{method:'api'|'ui';route?:string}};
export class TestDataLifecycle {
  constructor(private manifestPath='fixtures/manifests/active-run.json'){}
  read():QaArtifact[]{ if(!fs.existsSync(this.manifestPath)) return []; return JSON.parse(fs.readFileSync(this.manifestPath,'utf8')).artifacts||[]; }
  record(a:QaArtifact){ const artifacts=this.read(); artifacts.push(a); fs.mkdirSync(path.dirname(this.manifestPath),{recursive:true}); fs.writeFileSync(this.manifestPath,JSON.stringify({schema:1,artifacts},null,2)); }
  clear(){ fs.mkdirSync(path.dirname(this.manifestPath),{recursive:true}); fs.writeFileSync(this.manifestPath,JSON.stringify({schema:1,artifacts:[]},null,2)); }
}
