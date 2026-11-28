import { expect, test } from '@playwright/test';
import { edge, waitForBudget } from './helpers';

interface Echo {
  headers: Record<string, string>;
}

test.describe('L1 headers de borda', () => {
  test.beforeEach(async ({ request }) => waitForBudget(request));

  test('E2E-102 origem recebe os 7 headers de borda preenchidos', async ({ request }) => {
    const res = await edge(request).get('echo', '/');
    expect(res.status()).toBe(200);
    const { headers } = (await res.json()) as Echo;
    for (const name of [
      'cf-connecting-ip',
      'cf-ray',
      'cf-ipcountry',
      'cf-visitor',
      'x-forwarded-for',
      'x-forwarded-proto',
      'x-forwarded-host',
    ]) {
      expect(headers[name], name).toBeTruthy();
    }
    expect(headers['x-forwarded-proto']).toBe('https');
    expect(headers['cf-visitor']).toBe('{"scheme":"https"}');
    expect(headers['x-forwarded-host']).toMatch(/^echo\./);
  });

  test('E2E-103 valores CF-* forjados pelo cliente sao substituidos', async ({ request }) => {
    const res = await edge(request).get('echo', '/', {
      headers: { 'CF-Connecting-IP': '1.2.3.4', 'CF-IPCountry': 'XX', 'CF-Ray': 'forged', 'CF-Visitor': 'forged' },
    });
    const { headers } = (await res.json()) as Echo;
    expect(headers['cf-connecting-ip']).not.toBe('1.2.3.4');
    expect(headers['cf-ipcountry']).toBe('BR');
    expect(headers['cf-ray']).not.toBe('forged');
    expect(headers['cf-visitor']).toBe('{"scheme":"https"}');
  });

  test('E2E-104 X-Forwarded-For existente e anexado a cadeia', async ({ request }) => {
    const res = await edge(request).get('echo', '/', { headers: { 'X-Forwarded-For': '9.9.9.9' } });
    const { headers } = (await res.json()) as Echo;
    expect(headers['x-forwarded-for']).toMatch(/^9\.9\.9\.9, .+/);
  });

  test('E2E-105 CF-Ray distinto entre requisicoes', async ({ request }) => {
    const a = (await (await edge(request).get('echo', '/')).json()) as Echo;
    const b = (await (await edge(request).get('echo', '/')).json()) as Echo;
    expect(a.headers['cf-ray']).not.toBe(b.headers['cf-ray']);
  });
});
