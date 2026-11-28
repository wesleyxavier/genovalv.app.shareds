import { spawnSync } from 'node:child_process';
import type { APIRequestContext, APIResponse } from '@playwright/test';

export const EDGE_BASE_DOMAIN = process.env.EDGE_BASE_DOMAIN ?? 'genova.localhost';
export const EDGE_HTTP_PORT = Number(process.env.EDGE_HTTP_PORT ?? 8080);
export const EDGE_HTTPS_PORT = Number(process.env.EDGE_HTTPS_PORT ?? 3010);
export const EDGE_ECHO_PORT = Number(process.env.EDGE_ECHO_PORT ?? 9100);
export const EDGE_DATA_DIR = process.env.EDGE_DATA_DIR ?? 'C:/Docker-Volumes/genova/new-edge';
export const ROOT = process.cwd();

export const host = (name: string): string => `${name}.${EDGE_BASE_DOMAIN}`;
export const httpsUrl = (name: string, path = '/'): string =>
  `https://${host(name)}:${EDGE_HTTPS_PORT}${path}`;
export const httpUrl = (name: string, path = '/'): string =>
  `http://${host(name)}:${EDGE_HTTP_PORT}${path}`;
export const echoDirectUrl = (path: string): string => `http://127.0.0.1:${EDGE_ECHO_PORT}${path}`;

type ReqOpts = Parameters<APIRequestContext['get']>[1];

/**
 * Cliente da borda para testes API. O Node nao resolve *.localhost (so o Chromium), entao conectamos
 * em 127.0.0.1 e enviamos o Host desejado: o Nginx roteia por Host, nao por SNI.
 */
export function edge(request: APIRequestContext, httpsPort = EDGE_HTTPS_PORT, httpPort = EDGE_HTTP_PORT) {
  const withHost = (name: string, o: ReqOpts = {}): ReqOpts => ({
    ...o,
    headers: { Host: host(name), ...(o?.headers ?? {}) },
  });
  return {
    get: (name: string, path = '/', o?: ReqOpts): Promise<APIResponse> =>
      request.get(`https://127.0.0.1:${httpsPort}${path}`, withHost(name, o)),
    fetch: (name: string, path: string, o?: Parameters<APIRequestContext['fetch']>[1]): Promise<APIResponse> =>
      request.fetch(`https://127.0.0.1:${httpsPort}${path}`, {
        ...o,
        headers: { Host: host(name), ...(o?.headers ?? {}) },
      }),
    httpGet: (name: string, path = '/', o?: ReqOpts): Promise<APIResponse> =>
      request.get(`http://127.0.0.1:${httpPort}${path}`, withHost(name, o)),
  };
}

export interface RunResult {
  status: number;
  output: string;
}

/** Executa um comando e devolve status + stdout/stderr combinados (nunca lança). */
export function run(cmd: string, args: string[]): RunResult {
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: 'utf8', shell: false });
  return { status: r.status ?? -1, output: `${r.stdout ?? ''}${r.stderr ?? ''}` };
}

/** `docker compose --env-file edge/test.env ...` a partir da raiz do workspace. */
export function compose(args: string[]): RunResult {
  return run('docker', ['compose', '--env-file', 'edge/test.env', ...args]);
}

export async function resetEcho(request: APIRequestContext): Promise<void> {
  await request.post(echoDirectUrl('/__reset'));
}

export async function echoCount(request: APIRequestContext): Promise<number> {
  const res = await request.get(echoDirectUrl('/__count'));
  return ((await res.json()) as { count: number }).count;
}

/** Aguarda o balde do rate limit esvaziar (evita contaminação entre testes). */
export async function waitForBudget(request: APIRequestContext): Promise<void> {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    const res = await edge(request).get('echo', '/__budget', { maxRedirects: 0 });
    if (res.status() !== 429) return;
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('rate limit não esvaziou em 15s');
}
