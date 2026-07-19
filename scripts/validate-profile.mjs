import fs from 'node:fs';
import path from 'node:path';

const name = process.env.LEADBOX_PROFILE || '_template';
const file = path.resolve(`profiles/versions/${name}/profile.json`);
if (!fs.existsSync(file)) throw new Error(`Profile not found: ${file}`);
const p = JSON.parse(fs.readFileSync(file, 'utf8'));
const required = [
  ['schemaVersion'], ['leadboxVersion'], ['runtime'], ['urls'], ['routes'], ['selectors'],
  ['selectors','wp'], ['selectors','shopLogin'], ['selectors','media'], ['selectors','studio']
];
for (const keys of required) {
  let value = p;
  for (const key of keys) value = value?.[key];
  if (value === undefined || value === null) throw new Error(`Missing profile field: ${keys.join('.')}`);
}
console.log(`Profile valid: ${name} (${p.leadboxVersion})`);
