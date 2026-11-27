import { describe, expect, it, vi } from 'vitest';
import { HttpAuthRepository } from '../src';

describe('HttpAuthRepository default fetch', () => {
  it('uses globalThis.fetch when no fetchFn is injected', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false });
    vi.stubGlobal('fetch', fetchMock);
    const repo = new HttpAuthRepository(
      { passwordLogin: '/api/login', logout: '/api/logout', me: '/api/me' },
      'invalid',
    );
    const res = await repo.refreshFromCookie();
    expect(res).toEqual({ authenticated: false });
    expect(fetchMock).toHaveBeenCalledWith('/api/me', { credentials: 'include' });
    vi.unstubAllGlobals();
  });
});
