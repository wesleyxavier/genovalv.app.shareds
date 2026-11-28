import { spawnSync } from 'node:child_process';
import { expect, test } from '@playwright/test';
import { edge } from './helpers';

test.describe.configure({ mode: 'serial' });

// Stack alternativa (projeto compose proprio) com limite baixo, para nao afetar os demais testes/browsers.
const ALT = { http: 28080, https: 28443, echo: 29100 };
const env = {
  ...process.env,
  EDGE_HTTP_PORT: String(ALT.http),
  EDGE_HTTPS_PORT: String(ALT.https),
  EDGE_ECHO_PORT: String(ALT.echo),
  EDGE_RATE_LIMIT_RPS: '5',
  EDGE_RATE_LIMIT_BURST: '10',
};
const base = ['compose', '-p', 'genova-edge-rl', '--env-file', 'edge/test.env', '--profile', 'test'];
const dc = (args: string[]) => spawnSync('docker', [...base, ...args], { cwd: process.cwd(), env, encoding: 'utf8' });

test.describe('L1 rate limit (RPS=5, BURST=10)', () => {
  test.beforeAll(() => {
    test.setTimeout(180_000);
    const up = dc(['up', '-d', '--no-deps', '--wait', 'edge-proxy', 'edge-origin-echo']);
    if (up.status !== 0) throw new Error(`stack alternativa falhou:\n${up.stdout}${up.stderr}`);
  });

  test.afterAll(() => {
    dc(['down']);
  });

  test('E2E-121 rajada acima do limite recebe 429 e depois recupera', async ({ request }) => {
    const api = edge(request, ALT.https, ALT.http);
    const responses = await Promise.all(
      Array.from({ length: 60 }, () => api.get('echo', '/__burst', { maxRedirects: 0 })),
    );
    const statuses = responses.map((r) => r.status());
    expect(statuses).toContain(429);
    expect(statuses).toContain(200);

    await expect.poll(async () => (await api.get('echo', '/__burst')).status(), { timeout: 15_000 }).toBe(200);
  });

  test('E2E-122 trafego legitimo abaixo do limite nunca recebe 429', async ({ request }) => {
    const api = edge(request, ALT.https, ALT.http);
    await new Promise((r) => setTimeout(r, 3000)); // balde enche de novo (burst 10 / rps 5 = 2s)
    for (let i = 0; i < 10; i += 1) {
      const res = await api.get('echo', '/__ok');
      expect(res.status()).not.toBe(429);
      await new Promise((r) => setTimeout(r, 300));
    }
  });
});
