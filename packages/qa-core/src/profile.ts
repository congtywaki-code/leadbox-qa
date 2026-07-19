import fs from 'node:fs';
import path from 'node:path';

export type LeadBoxProfile = Record<string, any>;

export function loadProfile(): LeadBoxProfile {
  const profileName = process.env.LEADBOX_PROFILE || '_template';
  const profilePath = path.resolve(`profiles/versions/${profileName}/profile.json`);
  if (!fs.existsSync(profilePath)) {
    throw new Error(`LeadBox QA profile not found: ${profilePath}`);
  }
  return JSON.parse(fs.readFileSync(profilePath, 'utf8'));
}

export function envUrl(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value.replace(/\/$/, '');
}

export function selector(template: string, values: Record<string, string> = {}): string {
  return Object.entries(values).reduce((result, [key, value]) => result.replace(`{${key}}`, cssEscape(value)), template);
}

function cssEscape(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
