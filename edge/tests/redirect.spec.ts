import { expect, test } from '@playwright/test';
import { EDGE_BASE_DOMAIN, EDGE_HTTPS_PORT, edge } from './helpers';

test.describe('L1 redirect HTTP -> HTTPS', () => {
  test('E2E-101 redireciona preservando path e query', async ({ request }) => {
    const res = await edge(request).httpGet('echo', '/x?a=1', { maxRedirects: 0 });
    expect(res.status()).toBe(301);
    expect(res.headers()['location']).toBe(`https://echo.${EDGE_BASE_DOMAIN}:${EDGE_HTTPS_PORT}/x?a=1`);
  });
});
