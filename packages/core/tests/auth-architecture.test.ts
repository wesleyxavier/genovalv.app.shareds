import { describe, expect, it, vi } from 'vitest';
import {
  BaseLoginAuthUseCase,
  BaseLogoutAuthUseCase,
  BaseRefreshSessionUseCase,
  HttpAuthRepository,
  UNAUTHENTICATED_SESSION,
  createUnauthenticatedSession,
  type AuthSession,
  type IAuthSessionWriter,
  type SessionUser,
} from '../src';

describe('Shared Auth Architecture (VO, UseCases, HttpAuthRepository)', () => {
  it('provides frozen UNAUTHENTICATED_SESSION and extensible factory', () => {
    expect(Object.isFrozen(UNAUTHENTICATED_SESSION)).toBe(true);
    expect(UNAUTHENTICATED_SESSION.authenticated).toBe(false);
    const extended = createUnauthenticatedSession<SessionUser<'client'>, { tenantId: string | null }>({
      tenantId: null,
    });
    expect(extended).toEqual({
      authenticated: false,
      user: null,
      tenantId: null,
    });
  });

  it('executes BaseLoginAuthUseCase, BaseLogoutAuthUseCase and BaseRefreshSessionUseCase', async () => {
    let state: AuthSession<SessionUser<'saas-admin'>> = createUnauthenticatedSession();
    const writer: IAuthSessionWriter<AuthSession<SessionUser<'saas-admin'>>> = {
      setSession: (s) => { state = s; },
      clearSession: () => { state = createUnauthenticatedSession(); },
    };

    const validSession: AuthSession<SessionUser<'saas-admin'>> = {
      authenticated: true,
      user: { id: 'u1', email: 'a@g.cloud', role: 'saas-admin' },
    };

    const loginUc = new BaseLoginAuthUseCase(
      {
        login: vi.fn()
          .mockResolvedValueOnce({ ok: true, session: validSession })
          .mockResolvedValueOnce({ ok: false, errorKey: 'auth.invalidCredentials' }),
      },
      writer,
    );

    const ok = await loginUc.login({ email: 'a@g.cloud', password: '123', rememberDevice: true, locale: 'pt-BR' });
    expect(ok.ok).toBe(true);
    expect(state.authenticated).toBe(true);

    const fail = await loginUc.login({ email: 'a@g.cloud', password: 'bad', rememberDevice: false, locale: 'pt-BR' });
    expect(fail.ok).toBe(false);
    expect(state.authenticated).toBe(false);

    const refreshUc = new BaseRefreshSessionUseCase(
      {
        refreshFromCookie: vi.fn()
          .mockResolvedValueOnce({ authenticated: true, session: { userId: 'u2', email: 'b@g.cloud', fullName: 'B' } })
          .mockResolvedValueOnce({ authenticated: false })
          .mockRejectedValueOnce(new Error('offline')),
      },
      writer,
      (s) => ({
        authenticated: true,
        user: { id: s.userId, email: s.email, name: s.fullName, role: 'saas-admin' },
        expiresAt: 123,
        rememberDevice: false,
      }),
    );

    await refreshUc.refreshFromCookie();
    expect(state.user?.email).toBe('b@g.cloud');
    await refreshUc.refreshFromCookie();
    await refreshUc.refreshFromCookie();

    const logoutUc = new BaseLogoutAuthUseCase({ logout: vi.fn().mockResolvedValue(undefined) }, writer);
    await logoutUc.logout();
    expect(state.authenticated).toBe(false);
  });

  it('handles HTTP login, logout and refreshFromCookie branches in HttpAuthRepository', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ authenticated: true, user: null, expiresAt: null, rememberDevice: false }), { status: 200 }))
      .mockResolvedValueOnce(new Response('bad', { status: 401 }))
      .mockRejectedValueOnce(new Error('net'))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockRejectedValueOnce(new Error('net'))
      .mockResolvedValueOnce(new Response(JSON.stringify({ authenticated: true }), { status: 200 }))
      .mockResolvedValueOnce(new Response('unauth', { status: 401 }))
      .mockRejectedValueOnce(new Error('net'));

    const repo = new HttpAuthRepository(
      { passwordLogin: '/api/login', logout: '/api/logout', me: '/api/me' },
      'auth.invalidCredentials',
      fetchMock as unknown as typeof fetch,
    );

    expect((await repo.login({ email: 'e', password: 'p', rememberDevice: false, locale: 'pt-BR' })).ok).toBe(true);
    expect(await repo.login({ email: 'e', password: 'p', rememberDevice: false, locale: 'pt-BR' })).toEqual({ ok: false, errorKey: 'auth.invalidCredentials' });
    expect(await repo.login({ email: 'e', password: 'p', rememberDevice: false, locale: 'pt-BR' })).toEqual({ ok: false, errorKey: 'auth.invalidCredentials' });

    await repo.logout();
    await repo.logout();

    expect(await repo.refreshFromCookie()).toEqual({ authenticated: true });
    expect(await repo.refreshFromCookie()).toEqual({ authenticated: false });
    expect(await repo.refreshFromCookie()).toEqual({ authenticated: false });
  });
});
