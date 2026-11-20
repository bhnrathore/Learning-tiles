import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:5173', trace: 'retain-on-failure' },
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
      },
    },
    {
      name: 'tablet',
      use: {
        ...devices['iPad Mini'],
        defaultBrowserType: 'chromium',
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], viewport: { width: 360, height: 800 } },
    },
  ],
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
  },
});
