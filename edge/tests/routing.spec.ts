import { expect, test } from '@playwright/test';
import { edge, waitForBudget } from './helpers';

test.describe('L1 roteamento por host', () => {
  test.beforeEach(async ({ request }) => waitForBudget(request));

  test('E2E-141 host desconhecido nao e roteado e nao vaza upstream', async ({ request }) => {
    const res = await edge(request).get('desconhecido', '/');
    expect([404, 421]).toContain(res.status());
    const body = await res.text();
    expect(body).not.toMatch(/host\.docker\.internal|edge-origin-echo|upstream|\d+\.\d+\.\d+\.\d+:\d+/i);
  });

  test('E2E-142 admin passa pela borda (nao retorna 404 de host desconhecido)', async ({ request }) => {
    const res = await edge(request).get('admin', '/');
    expect(res.status()).not.toBe(404);
    expect(res.status()).not.toBe(421);
    const body = await res.text();
    expect(body).not.toMatch(/host\.docker\.internal|\d+\.\d+\.\d+\.\d+:\d+/i);
  });
});
