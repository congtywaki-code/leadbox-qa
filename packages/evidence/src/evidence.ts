import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export type EvidenceStatus = 'PASS' | 'FAIL' | 'BLOCKED';
export type EvidenceRecord = {
  schemaVersion: 1;
  id: string;
  type: 'authentication' | 'media-diagnosis' | 'visual-baseline' | 'staging-readiness';
  status: EvidenceStatus;
  capturedAt: string;
  leadboxVersion: string;
  environment: string;
  summary: string;
  details: Record<string, unknown>;
  artifacts: Array<{ file: string; sha256: string }>;
};

export function sha256File(file: string): string {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

export function redact(value: unknown): unknown {
  const secret = /(password|passwd|authorization|cookie|nonce|token|secret|api[-_]?key)/i;
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k,v]) => [k, secret.test(k) ? '[REDACTED]' : redact(v)]));
  }
  if (typeof value === 'string') {
    return value.replace(/(Bearer\s+)[A-Za-z0-9._~+\/-]+=*/gi, '$1[REDACTED]');
  }
  return value;
}

export function writeEvidence(relativeFile: string, record: EvidenceRecord): void {
  const file = path.resolve(relativeFile);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(redact(record), null, 2));
}
