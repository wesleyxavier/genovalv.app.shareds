import { expect, test } from '@playwright/test';
import { compose } from './helpers';

test.describe('L0 infra', () => {
  test('E2E-000 docker compose config é válido sem variável indefinida', () => {
    const r = compose(['--profile', 'test', 'config', '-q']);
    expect(r.status, r.output).toBe(0);
    expect(r.output).not.toMatch(/variable is not set/i);
  });

  test('E2E-001 nginx -t retorna syntax is ok', () => {
    const r = compose(['exec', '-T', 'edge-proxy', 'nginx', '-t']);
    expect(r.status, r.output).toBe(0);
    expect(r.output).toContain('syntax is ok');
  });
});
