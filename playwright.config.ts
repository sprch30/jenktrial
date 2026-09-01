import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Read target environment from run script profile flag (defaults to stage)
const environment = process.env.ENV || 'stage';

// Automatically parse the targeted environment file properties
dotenv.config({ path: path.resolve(__dirname, `.env.${environment}`) });

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],
  use: {
    baseURL: process.env.URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
