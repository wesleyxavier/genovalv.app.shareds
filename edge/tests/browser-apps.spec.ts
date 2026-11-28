import { expect, test } from '@playwright/test';
import { EDGE_BASE_DOMAIN, EDGE_HTTPS_PORT, edge } from './helpers';

test.describe('L2 apps atras da borda', () => {
  test('E2E-204 ERP renderiza por HTTPS via borda (skip explicito se origem indisponivel)', async ({
    page,
    request,
  }) => {
    const probe = await edge(request).get('erp', '/', { maxRedirects: 0 });
    test.skip([502, 504].includes(probe.status()), 'ERP (EDGE_UPSTREAM_ERP) indisponivel: suba o compose do ERP na porta 3101');

    const res = await page.goto(`https://erp.${EDGE_BASE_DOMAIN}:${EDGE_HTTPS_PORT}/`);
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('E2E-205 Admin pela URL propria nao passa pela borda', async ({ request }) => {
    const adminUrl = process.env.ADMIN_URL;
    test.skip(!adminUrl, 'defina ADMIN_URL com a URL propria do Admin para executar este caso');

    const res = await request.get(adminUrl as string, { failOnStatusCode: false });
    expect(res.headers()['x-cache-status']).toBeUndefined();
    expect(res.headers()['cf-ray']).toBeUndefined();
  });
});
