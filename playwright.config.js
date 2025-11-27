// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * 🖤 Playwright Configuration for Medieval Trading Game
 * Tests run against a local server or GitHub Pages deployment
 *
 * Optimized for faster CI runs with increased timeouts
 */

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,  // Reduced retries for speed
  workers: process.env.CI ? 2 : undefined,  // Allow 2 workers in CI
  reporter: process.env.CI ? 'line' : 'html',  // Faster reporter in CI

  // Increased timeouts for game loading
  timeout: 60000,  // 60s per test (game takes time to load)
  expect: {
    timeout: 10000,  // 10s for assertions
  },

  use: {
    // Base URL - use environment variable or default to local
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',

    // Performance optimizations
    video: 'off',
    launchOptions: {
      args: ['--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage'],
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Run local dev server before tests (only when not in CI with deployed site)
  webServer: process.env.BASE_URL ? undefined : {
    command: 'npx serve -l 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
