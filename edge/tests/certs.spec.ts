import { existsSync, mkdtempSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { EDGE_DATA_DIR, compose, run } from './helpers';

const certDir = join(EDGE_DATA_DIR, 'certs');

test.describe('L0 certificados', () => {
  test('E2E-002 cert e chave existem no volume', () => {
    expect(existsSync(join(certDir, 'tls.crt'))).toBe(true);
    expect(existsSync(join(certDir, 'tls.key'))).toBe(true);
  });

  test('E2E-003 reexecutar edge-certs-init é idempotente', () => {
    const before = statSync(join(certDir, 'tls.crt')).mtimeMs;
    const r = compose(['run', '--rm', 'edge-certs-init']);
    expect(r.status, r.output).toBe(0);
    expect(statSync(join(certDir, 'tls.crt')).mtimeMs).toBe(before);
  });

  test('E2E-004 nenhum .pem/.key/.crt versionado', () => {
    const r = run('git', ['ls-files']);
    expect(r.status).toBe(0);
    expect(r.output.split('\n').filter((f) => /\.(pem|key|crt)$/i.test(f.trim()))).toEqual([]);
  });

  test('E2E-005 sem cert o proxy falha com mensagem clara', () => {
    const empty = mkdtempSync(join(tmpdir(), 'edge-nocert-'));
    const r = compose([
      'run', '--rm', '--no-deps', '-v', `${empty}:/etc/nginx/certs:ro`, 'edge-proxy',
    ]);
    expect(r.status).not.toBe(0);
    expect(r.output).toMatch(/certificado/i);
  });
});
