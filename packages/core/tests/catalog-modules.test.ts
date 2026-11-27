import { describe, expect, it } from 'vitest';
import {
  BASE_MODULE_CATALOG,
  resolveEffectiveModules,
} from '../src/index';

describe('BASE_MODULE_CATALOG & resolveEffectiveModules', () => {
  it('exposes the 10 base modules with FISCAL inactive by default', () => {
    expect(BASE_MODULE_CATALOG).toHaveLength(10);
    const fiscal = BASE_MODULE_CATALOG.find((m) => m.code === 'FISCAL');
    expect(fiscal?.active).toBe(false);
    expect(BASE_MODULE_CATALOG.filter((m) => m.active)).toHaveLength(9);
  });

  it('returns sorted unique intersection of plan, segment and active modules', () => {
    const result = resolveEffectiveModules(
      ['SALES', 'FINANCE', 'FISCAL', 'SALES'],
      ['FINANCE', 'PRODUCTION', 'FISCAL'],
      ['SALES', 'FINANCE', 'PRODUCTION'],
    );
    expect(result).toEqual(['FINANCE']);
  });

  it('fails closed when plan or segment modules are empty or nullish', () => {
    expect(resolveEffectiveModules([], ['FINANCE'], ['FINANCE'])).toEqual([]);
    expect(resolveEffectiveModules(['FINANCE'], [], ['FINANCE'])).toEqual([]);
    expect(resolveEffectiveModules(null, ['FINANCE'], ['FINANCE'])).toEqual([]);
    expect(resolveEffectiveModules(['FINANCE'], undefined, ['FINANCE'])).toEqual([]);
  });
});
