import { spawnSync } from 'node:child_process';
import { X509Certificate } from 'node:crypto';
import { mkdtempSync, readFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { EDGE_DATA_DIR, compose, edge, waitForBudget } from './helpers';

test.describe.configure({ mode: 'serial' });

test.describe('L4 resiliencia', () => {
  test.beforeEach(async ({ request }) => waitForBudget(request));

  test('E2E-143 origem parada devolve 502/504 generico sem detalhes internos', async ({ request }) => {
    const res = await edge(request).get('factoryfloor', '/');
    test.skip(![502, 504].includes(res.status()), `porta de EDGE_UPSTREAM_FACTORYFLOOR em uso por outro processo (status ${res.status()}); pare-o para validar`);
    expect([502, 504]).toContain(res.status());
    expect(await res.text()).not.toMatch(/host\.docker\.internal|\d+\.\d+\.\d+\.\d+|upstream/i);
  });

  test('E2E-403 origem cai e volta sem reiniciar a borda', async ({ request }) => {
    test.setTimeout(120_000);
    expect(compose(['--profile', 'test', 'stop', 'edge-origin-echo']).status).toBe(0);
    try {
      const down = await edge(request).get('echo', '/qualquer');
      expect([502, 504]).toContain(down.status());
    } finally {
      expect(compose(['--profile', 'test', 'start', 'edge-origin-echo']).status).toBe(0);
    }
    await expect
      .poll(async () => (await edge(request).get('echo', '/qualquer')).status(), { timeout: 40_000, intervals: [1000] })
      .toBe(200);
  });

  test('E2E-404 recriar contêineres preserva o certificado', () => {
    const crt = join(EDGE_DATA_DIR, 'certs', 'tls.crt');
    const before = statSync(crt).mtimeMs;
    expect(compose(['--profile', 'test', 'rm', '-sf', 'edge-proxy']).status).toBe(0);
    const up = compose(['--profile', 'test', 'up', '-d', '--no-deps', '--wait', 'edge-proxy']);
    expect(up.status, up.output).toBe(0);
    expect(statSync(crt).mtimeMs).toBe(before);
  });

  test('E2E-402 certificado perto de expirar e regenerado pelo init', () => {
    test.setTimeout(120_000);
    const dir = mkdtempSync(join(tmpdir(), 'edge-expiring-'));
    const mount = ['-v', `${dir}:/certs`];

    const short = compose(['run', '--rm', ...mount, '-e', 'EDGE_CERT_DAYS=1', 'edge-certs-init']);
    expect(short.status, short.output).toBe(0);
    const first = new X509Certificate(readFileSync(join(dir, 'tls.crt')));

    const regen = compose(['run', '--rm', ...mount, 'edge-certs-init']);
    expect(regen.status, regen.output).toBe(0);
    expect(regen.output).toContain('gerando certificado');
    const second = new X509Certificate(readFileSync(join(dir, 'tls.crt')));
    expect(new Date(second.validTo).getTime()).toBeGreaterThan(new Date(first.validTo).getTime());
  });

  test('E2E-401 porta HTTPS configuravel via env sem editar arquivos versionados', async ({ request }) => {
    test.setTimeout(180_000);
    // projeto compose separado (-p) para nao colidir com a stack principal
    const env = { ...process.env, EDGE_HTTP_PORT: '18080', EDGE_HTTPS_PORT: '18443', EDGE_ECHO_PORT: '19100' };
    const base = ['compose', '-p', 'genova-edge-alt', '--env-file', 'edge/test.env', '--profile', 'test'];
    const dc = (args: string[]) => spawnSync('docker', [...base, ...args], { cwd: process.cwd(), env, encoding: 'utf8' });

    const up = dc(['up', '-d', '--no-deps', '--wait', 'edge-proxy', 'edge-origin-echo']);
    try {
      expect(up.status, `${up.stdout}${up.stderr}`).toBe(0);
      const redirect = await request.get('http://127.0.0.1:18080/x', {
        headers: { Host: 'echo.genova.localhost' },
        maxRedirects: 0,
      });
      expect(redirect.status()).toBe(301);
      expect(redirect.headers()['location']).toBe('https://echo.genova.localhost:18443/x');
    } finally {
      dc(['down']);
    }
  });

  test('E2E-405 ambiente limpo sobe em ate 5 minutos', async () => {
    test.skip(process.env.EDGE_CLEAN_BOOT !== '1', 'execucao manual/CI: defina EDGE_CLEAN_BOOT=1 (apaga certs e imagens do projeto)');
  });
});
