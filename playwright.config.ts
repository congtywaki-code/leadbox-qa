import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 12_000, toHaveScreenshot: { maxDiffPixelRatio: 0.01 } },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['json', { outputFile: 'reports/results.json' }]
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    ignoreHTTPSErrors: true
  },
  projects: [
    { name: 'setup-superadmin', testMatch: /superadmin\.setup\.ts/ },
    { name: 'setup-shopadmin', testMatch: /shopadmin\.setup\.ts/ },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] }, dependencies: ['setup-superadmin', 'setup-shopadmin'] },
    { name: 'tablet', use: { ...devices['iPad Pro 11'] }, dependencies: ['setup-shopadmin'] },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, dependencies: ['setup-shopadmin'] }
  ],
  outputDir: 'reports/artifacts'
});
