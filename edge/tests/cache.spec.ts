import { expect, test } from '@playwright/test';
import { echoCount, edge, resetEcho, waitForBudget } from './helpers';

test.describe.configure({ mode: 'serial' });

test.describe('L1 cache de borda', () => {
  test.beforeEach(async ({ request }) => {
    await waitForBudget(request);
    await resetEcho(request);
  });

  test('E2E-111/112 estatico: MISS e depois HIT sem nova chamada a origem', async ({ request }) => {
    const path = `/static/cache-${Date.now()}.js`;
    const first = await edge(request).get('echo', path);
    expect(first.status()).toBe(200);
    expect(first.headers()['x-cache-status']).toBe('MISS');
    expect(await echoCount(request)).toBe(1);

    const second = await edge(request).get('echo', path);
    expect(second.headers()['x-cache-status']).toBe('HIT');
    expect(await echoCount(request)).toBe(1);
  });

  test('E2E-113 rota dinamica nunca e cacheada', async ({ request }) => {
    const a = await edge(request).get('echo', '/api/dados');
    const b = await edge(request).get('echo', '/api/dados');
    expect(a.headers()['x-cache-status']).toBeUndefined();
    expect(b.headers()['x-cache-status']).toBeUndefined();
    expect(await echoCount(request)).toBe(2);
  });
});
