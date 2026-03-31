import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  use: {
    baseURL: 'http://127.0.0.1:5173',
    headless: true,
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 5000',
      cwd: '../backend',
      url: 'http://127.0.0.1:5000/api/health',
      reuseExistingServer: true,
      timeout: 60_000,
      env: {
        E2E_MODE: 'true',
      },
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 5173',
      cwd: '.',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: true,
      timeout: 60_000,
      env: {
        VITE_API_URL: 'http://127.0.0.1:5000',
      },
    },
  ],
});
