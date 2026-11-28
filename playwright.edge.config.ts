import { defineConfig, devices } from '@playwright/test';
import { EDGE_HTTPS_PORT } from './edge/tests/helpers';

// Suíte da borda local (spec 002). O ambiente Docker sobe/desce em globalSetup/globalTeardown.
export default defineConfig({
  testDir: './edge/tests',
  testMatch: /.*\.spec\.ts/,
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  timeout: 60_000,
  globalSetup: './edge/tests/global-setup.ts',
  globalTeardown: './edge/tests/global-teardown.ts',
  use: {
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'edge-api',
      testIgnore: /browser-.*\.spec\.ts|hmr\.spec\.ts/,
    },
    {
      // Regressao E2E-206: suite existente do playground executada atras da borda
      name: 'edge-playground-regression',
      testDir: './playground/e2e',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
        ignoreHTTPSErrors: true,
        baseURL: `https://playground.genova.localhost:${EDGE_HTTPS_PORT}`,
      },
    },
    {
      name: 'edge-chromium-desktop',
      testMatch: /(browser-.*|hmr)\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
        ignoreHTTPSErrors: true,
        baseURL: `https://playground.genova.localhost:${EDGE_HTTPS_PORT}`,
      },
    },
    {
      name: 'edge-chromium-mobile',
      testMatch: /browser-.*\.spec\.ts/,
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 390, height: 844 },
        ignoreHTTPSErrors: true,
        baseURL: `https://playground.genova.localhost:${EDGE_HTTPS_PORT}`,
      },
    },
  ],
});
