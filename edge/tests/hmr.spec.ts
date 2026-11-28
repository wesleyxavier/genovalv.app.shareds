import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { EDGE_BASE_DOMAIN, EDGE_HTTPS_PORT, ROOT } from './helpers';

const mainTs = join(ROOT, 'playground', 'src', 'stories', 'flows', 'login-foundation.stories.ts');

test.describe('L3 HMR/WebSocket via borda @hmr', () => {
  let original = '';

  test.beforeEach(() => {
    original = readFileSync(mainTs, 'utf8');
  });

  test.afterEach(async () => {
    writeFileSync(mainTs, original);
    // deixa o Vite assentar apos reverter o arquivo para nao afetar testes seguintes
    await new Promise((r) => setTimeout(r, 1500));
  });

  test('E2E-302/304 playground: WebSocket do Vite conecta pela borda e recebe update em ate 5s', async ({ page }) => {
    const frames: string[] = [];
    let opened = false;
    page.on('websocket', (ws) => {
      opened = true;
      ws.on('framereceived', (f) => frames.push(String(f.payload)));
    });

    await page.goto('/');
    await expect.poll(() => opened, { timeout: 10_000 }).toBe(true);

    appendFileSync(mainTs, `\n// hmr-probe ${Date.now()}\n`);

    await expect
      .poll(() => frames.some((f) => /"type":"(update|full-reload)"/.test(f)), { timeout: 5_000 })
      .toBe(true);
  });

  // Bloqueado: depende da change de dockerizacao no repo FactoryFloor (tasks.md T048).
  test.fixme('E2E-301/303 FactoryFloor: pagina Nuxt via borda e HMR em ate 5s', async ({ page }) => {
    await page.goto(`https://factoryfloor.${EDGE_BASE_DOMAIN}:${EDGE_HTTPS_PORT}/`);
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
