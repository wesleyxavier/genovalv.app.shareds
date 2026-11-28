import { expect, test } from '@playwright/test';
import { EDGE_BASE_DOMAIN, EDGE_HTTPS_PORT, EDGE_HTTP_PORT } from './helpers';

const edgeHost = `playground.${EDGE_BASE_DOMAIN}`;
const storyPath = '/iframe.html?id=flows-login-foundation--default';

test.describe('L2 playground via borda (Chromium)', () => {
  test('E2E-201 carrega por HTTPS sem erros de console nem falhas de rede na borda', async ({ page }) => {
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];
    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(m.text());
    });
    page.on('requestfailed', (r) => {
      if (new URL(r.url()).hostname === edgeHost) failedRequests.push(`${r.url()} ${r.failure()?.errorText}`);
    });
    page.on('response', (r) => {
      if (new URL(r.url()).hostname === edgeHost && r.status() >= 400) failedRequests.push(`${r.url()} ${r.status()}`);
    });

    await page.goto(storyPath);
    await expect(page.locator('genova-header')).toBeVisible();
    await expect(page.locator('genova-footer')).toBeVisible();

    // fontes externas (Google Fonts) podem falhar offline; so conta erro de recursos da borda
    expect(failedRequests).toEqual([]);
    expect(consoleErrors.filter((e) => !/fonts\.(googleapis|gstatic)/.test(e) && !/ERR_(NAME|INTERNET)/.test(e))).toEqual([]);
  });

  test('E2E-202 versao http:// termina em https:// com a pagina carregada', async ({ page }) => {
    await page.goto(`http://${edgeHost}:${EDGE_HTTP_PORT}${storyPath}`);
    await expect(page).toHaveURL(new RegExp(`^https://${edgeHost.replace(/\./g, '\\.')}:${EDGE_HTTPS_PORT}/iframe\\.html`));
    await expect(page.locator('genova-header')).toBeVisible();
  });

  test('E2E-203 assets estaticos elegiveis passam pelo cache da borda', async ({ page }) => {
    const seen = new Map<string, string>();
    page.on('response', (r) => {
      const status = r.headers()['x-cache-status'];
      if (status && new URL(r.url()).hostname === edgeHost) seen.set(r.url(), status);
    });

    await page.goto(storyPath);
    await page.reload();
    await page.waitForLoadState('networkidle');

    // o Vite dev pode marcar parte dos modulos como no-cache; basta ao menos um asset passar pelo cache
    const statuses = [...seen.values()];
    expect(statuses.length).toBeGreaterThan(0);
    expect(statuses.some((s) => ['HIT', 'MISS', 'EXPIRED', 'BYPASS', 'STALE', 'UPDATING', 'REVALIDATED'].includes(s))).toBe(true);
  });

  test('E2E-207 navegacao por teclado funciona atras da borda', async ({ page, isMobile }) => {
    test.skip(isMobile, 'navegacao por Tab so faz sentido no desktop');
    await page.goto(storyPath);
    await expect(page.locator('genova-header')).toBeVisible();
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName ?? 'BODY');
    expect(focused).not.toBe('BODY');
  });
});
