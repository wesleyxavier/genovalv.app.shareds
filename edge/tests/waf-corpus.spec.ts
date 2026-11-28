import { expect, test } from '@playwright/test';
import { edge, waitForBudget } from './helpers';

const malicious = [
  '/.env',
  '/.env.local',
  '/.git/HEAD',
  '/.git/config',
  '/..%2f..%2fetc/passwd',
  '/%2e%2e%2f%2e%2e%2fwindows/win.ini',
  '/..%5c..%5cboot.ini',
  '/wp-admin/',
  '/wp-login.php',
  '/phpmyadmin/index.php',
  '/PHPMyAdmin/',
  '/?q=<script>alert(1)</script>',
  '/?q=%3Cscript%3Ealert(1)',
  '/?id=1+union+select+1,2',
  '/?id=1%20UNION%20SELECT%20null',
  '/app/.env',
  '/static/.git/index',
  '/x/../..%2fetc/passwd',
  '/?redirect=<SCRIPT>',
  '/api/wp-login.php',
];

const legitimate = [
  '/',
  '/index.html',
  '/api/users',
  '/api/users?id=10',
  '/login',
  '/assets/app.css',
  '/_next/static/chunk.js',
  '/_nuxt/entry.js',
  '/docs/environment',
  '/search?q=hello+world',
  '/products/union-station',
  '/blog/how-to-select-a-theme',
  '/admin-panel-docs',
  '/health',
  '/favicon.ico',
  '/img/logo.png',
  '/api/v1/orders?status=open',
  '/about',
  '/contact',
  '/terms',
];

// 400 = rejeitado pelo parser do Nginx (traversal codificado); 403 = regra WAF. Ambos nao chegam a origem.
test.describe('L1 corpus WAF (SC-004)', () => {
  test.beforeEach(async ({ request }) => waitForBudget(request));

  test('E2E-134 100% dos payloads maliciosos bloqueados', async ({ request }) => {
    const failures: string[] = [];
    for (const path of malicious) {
      const res = await edge(request).get('echo', path, { maxRedirects: 0 });
      if (![400, 403].includes(res.status())) failures.push(`${path} -> ${res.status()}`);
    }
    expect(failures).toEqual([]);
  });

  test('E2E-134b 0% das rotas legitimas bloqueadas', async ({ request }) => {
    const failures: string[] = [];
    for (const path of legitimate) {
      const res = await edge(request).get('echo', path, { maxRedirects: 0 });
      if ([403, 429].includes(res.status())) failures.push(`${path} -> ${res.status()}`);
      await new Promise((r) => setTimeout(r, 120));
    }
    expect(failures).toEqual([]);
  });
});
