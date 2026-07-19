import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const sourceRoot = process.env.LEADBOX_SOURCE_ROOT;

test.describe('LeadBox 9.9.1.12-rc2 source contract', () => {
  test.skip(!sourceRoot, 'Set LEADBOX_SOURCE_ROOT to the extracted LeadBox plugin directory.');

  test('plugin version and mapped runtime contracts exist', async () => {
    const read = (file: string) => fs.readFileSync(path.join(sourceRoot!, file), 'utf8');
    const main = read('leadbox-crm.php');
    const owner = read('includes/class-lb-owner-app.php');
    const media = read('includes/class-lb-capture-studio-runtime.php');
    const shared = read('includes/class-lb-shared-media-library.php');
    const studio = read('assets/js/studio.js');
    expect(main).toContain("0.9.9.1.12-rc2-step9.9.1.12-rc2");
    expect(owner).toContain("LeadBoxMediaRuntime");
    expect(owner).toContain("/leadbox/v1/owner/studio/");
    expect(media).toContain("/owner/studio/media");
    expect(shared).toContain("leadbox-system-v2");
    expect(shared).toContain("data-lb9426-builder");
    expect(studio).toContain("data-preview-renderer");
    expect(studio).toContain("LeadBoxTemplateRenderer9912");
  });
});
