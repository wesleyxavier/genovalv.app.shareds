import { expect, test } from '@playwright/test';
import { edge, waitForBudget } from './helpers';

const blockedPaths = [
  '/.env',
  '/.git/config',
  '/wp-admin/install.php',
  '/phpmyadmin/',
  '/?q=<script>alert(1)</script>',
  '/?q=%3Cscript%3E',
  '/?id=1%20union%20select%20password',
];

// O parser do Nginx rejeita (400) URIs codificadas que escapam da raiz antes da regra WAF; ambos bloqueiam.
const traversalPaths = ['/..%2f..%2fetc/passwd', '/%2e%2e%2fetc/passwd'];

test.describe('L1 WAF basico', () => {
  test.beforeEach(async ({ request }) => waitForBudget(request));

  for (const path of blockedPaths) {
    test(`E2E-131 bloqueia path malicioso ${path}`, async ({ request }) => {
      const res = await edge(request).get('echo', path, { maxRedirects: 0 });
      expect(res.status()).toBe(403);
      expect(res.headers()['x-edge-rule']).toBeTruthy();
    });
  }

  for (const path of traversalPaths) {
    test(`E2E-131 bloqueia path traversal ${path}`, async ({ request }) => {
      const res = await edge(request).get('echo', path, { maxRedirects: 0 });
      expect([400, 403]).toContain(res.status());
      expect(await res.text()).not.toContain('"headers"');
    });
  }

  for (const ua of ['sqlmap/1.7', 'Nikto/2.5', 'masscan/1.3', 'Nmap Scripting Engine']) {
    test(`E2E-132 bloqueia user-agent ${ua}`, async ({ request }) => {
      const res = await edge(request).get('echo', '/', { headers: { 'User-Agent': ua } });
      expect(res.status()).toBe(403);
      expect(res.headers()['x-edge-rule']).toBe('bad-user-agent');
    });
  }

  test('E2E-133 bloqueia metodo invalido', async ({ request }) => {
    const res = await edge(request).fetch('echo', '/', { method: 'PROPFIND' });
    expect(res.status()).toBe(403);
    expect(res.headers()['x-edge-rule']).toBe('method-not-allowed');

    const trace = await edge(request).fetch('echo', '/', { method: 'TRACE' });
    expect([403, 405]).toContain(trace.status());
  });

  test('E2E-131b requisicao bloqueada nao chega a origem (sem header da origem)', async ({ request }) => {
    const res = await edge(request).get('echo', '/.env');
    expect(res.headers()['cache-control']).toBeUndefined();
    expect(await res.text()).toContain('edge: bloqueado');
  });
});
