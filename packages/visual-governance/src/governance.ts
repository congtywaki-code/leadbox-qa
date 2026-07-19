import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export type BaselineRecord = {
  id: string;
  surface: string;
  viewport: string;
  file: string;
  sha256: string;
  approvedBy: string;
  approvedAt: string;
  leadboxVersion: string;
};

export function sha256(file: string): string {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

export function assertApprovalMetadata(record: BaselineRecord): void {
  const required: (keyof BaselineRecord)[] = ['id','surface','viewport','file','sha256','approvedBy','approvedAt','leadboxVersion'];
  for (const key of required) if (!record[key]) throw new Error(`Missing baseline metadata: ${key}`);
  if (!record.file.startsWith('baselines/')) throw new Error('Baseline file must be inside baselines/');
}

export function writePendingApproval(record: BaselineRecord, root = process.cwd()): string {
  assertApprovalMetadata(record);
  const out = path.join(root, 'approvals', 'pending', `${record.id}.json`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(record, null, 2));
  return out;
}
