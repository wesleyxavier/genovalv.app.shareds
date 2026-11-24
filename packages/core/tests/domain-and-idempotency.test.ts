import { describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_BASE_PROFILES,
  executeIdempotent,
  extractCnpjRoot,
  hasEmailCpfCompanyConflict,
  isValidCnpj,
  isValidCpf,
  validateActiveBindings,
  type CompanyBinding,
  type IdempotencyRecord,
  type IdempotencyStore,
} from '../src';

describe('Document validators (CPF / CNPJ)', () => {
  it('validates real and invalid CPFs', () => {
    expect(isValidCpf('52998224725')).toBe(true);
    expect(isValidCpf('12345678909')).toBe(true);
    expect(isValidCpf('529.982.247-25')).toBe(true);
    expect(isValidCpf('11111111111')).toBe(false);
    expect(isValidCpf('52998224720')).toBe(false);
    expect(isValidCpf('123')).toBe(false);
  });

  it('validates real and invalid CNPJs and extracts 8-digit root', () => {
    expect(isValidCnpj('11222333000181')).toBe(true);
    expect(isValidCnpj('33000167000101')).toBe(true);
    expect(isValidCnpj('11.222.333/0001-81')).toBe(true);
    expect(isValidCnpj('00000000000000')).toBe(false);
    expect(isValidCnpj('11222333000180')).toBe(false);
    expect(extractCnpjRoot('11.222.333/0001-81')).toBe('11222333');
  });
});

describe('Company bindings and email+CPF uniqueness', () => {
  const baseBinding: CompanyBinding = {
    id: 'b-1',
    tenantId: 't-1',
    profileId: 'p-1',
    cpf: '52998224725',
    cnpj: '11222333000181',
    branchType: 'headquarters',
    sandbox: false,
    active: true,
  };

  it('allows 1 or N active bindings from the same CNPJ root as array', () => {
    const branch: CompanyBinding = {
      ...baseBinding,
      id: 'b-2',
      tenantId: 't-2',
      cnpj: '11222333000262',
      branchType: 'branch',
    };
    const result = validateActiveBindings([baseBinding, branch, { ...baseBinding, id: 'b-3', active: false }]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.activeBindings).toHaveLength(2);
      expect(result.cnpjRoot).toBe('11222333');
    }
  });

  it('rejects empty active bindings or active bindings from distinct CNPJ roots', () => {
    expect(validateActiveBindings([{ ...baseBinding, active: false }])).toEqual({
      ok: false,
      reason: 'no_active_bindings',
    });

    const otherCompany: CompanyBinding = { ...baseBinding, id: 'b-9', cnpj: '99888777000110' };
    expect(validateActiveBindings([baseBinding, otherCompany])).toEqual({
      ok: false,
      reason: 'multiple_company_roots',
    });
  });

  it('detects email + cpf conflict across distinct companies', () => {
    const existing = [{ email: 'user@genova.cloud', cpf: '52998224725', cnpjRoot: '11222333' }];
    expect(
      hasEmailCpfCompanyConflict(existing, {
        email: 'USER@genova.cloud',
        cpf: '529.982.247-25',
        cnpjRoot: '11222333',
      }),
    ).toBe(false);
    expect(
      hasEmailCpfCompanyConflict(existing, {
        email: 'user@genova.cloud',
        cpf: '52998224725',
        cnpjRoot: '99888777',
      }),
    ).toBe(true);
  });
});

describe('Idempotency & Base Seed Config', () => {
  it('replays stored response for duplicate Idempotency-Key without re-executing handler', async () => {
    const records = new Map<string, IdempotencyRecord<string>>();
    const store: IdempotencyStore = {
      findByKey: async (k) => records.get(k) as IdempotencyRecord<string> | undefined,
      save: async (rec) => {
        records.set(rec.key, rec);
      },
    };
    const handler = vi.fn().mockResolvedValue('created-ok');

    const first = await executeIdempotent(store, 'key-1', 'hash-1', handler);
    const second = await executeIdempotent(store, 'key-1', 'hash-1', handler);

    expect(first).toEqual({ status: 'executed', response: 'created-ok' });
    expect(second).toEqual({ status: 'replayed', response: 'created-ok' });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('provides default Admin and Client base profiles for initial migration seed', () => {
    expect(DEFAULT_BASE_PROFILES.map((p) => `${p.scope}:${p.role}`)).toEqual([
      'admin:admin',
      'admin:user',
      'client:admin',
      'client:user',
    ]);
  });
});
