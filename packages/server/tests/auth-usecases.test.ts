import type { IAuth0Gateway, IBaseAuthUserRepository, ISessionTokenGateway } from '@genovalv/core';
import { describe, expect, it, vi } from 'vitest';
import {
  BackchannelLogoutUseCase,
  OAuthCallbackUseCase,
  PasswordLoginUseCase,
  ResolvePostLoginUseCase,
} from '../src/index';

describe('@genovalv/server auth use cases', () => {
  it('resolves active user and rejects inactive/unverified', async () => {
    const repo = {
      findByAuth0Id: vi.fn().mockResolvedValue(undefined),
      findByEmail: vi.fn().mockResolvedValue({
        id: 'u-1', auth0Id: null, email: 'a@b.c', emailVerified: false, fullName: 'A', documentType: 'CPF', documentNumber: '000', active: true,
      }),
      linkAuth0Id: vi.fn(),
      findBindingsByUserId: vi.fn().mockResolvedValue([]),
    } as unknown as IBaseAuthUserRepository;

    const uc = new ResolvePostLoginUseCase(repo);
    expect(await uc.execute('auth0|1', 'a@b.c', false)).toEqual({ ok: false, reason: 'email_not_verified' });
    const ok = await uc.execute('auth0|1', 'a@b.c', true);
    expect(ok.ok).toBe(true);
    expect(repo.linkAuth0Id).toHaveBeenCalledWith('u-1', 'auth0|1', true);
  });

  it('handles PasswordLogin, OAuthCallback and BackchannelLogout', async () => {
    const auth0 = {
      loginWithPassword: vi.fn().mockResolvedValue({ ok: true, idToken: 'idt' }),
      exchangeAuthorizationCode: vi.fn().mockResolvedValue({ ok: true, idToken: 'idt' }),
      verifyJwt: vi.fn().mockResolvedValue({ sub: 'auth0|1', email: 'a@b.c', email_verified: true, sid: 's-1' }),
    } as unknown as IAuth0Gateway;
    const resolvePostLogin = {
      execute: vi.fn().mockResolvedValue({
        ok: true, session: { userId: 'u-1', auth0Id: 'auth0|1', email: 'a@b.c', fullName: 'A', documentType: 'CPF', documentNumber: '000', bindings: [] },
      }),
    } as unknown as ResolvePostLoginUseCase;
    const tokens = { sign: vi.fn().mockResolvedValue('jwt-tok') } as unknown as ISessionTokenGateway;
    const audit = { log: vi.fn() };

    const pwdRes = await new PasswordLoginUseCase(auth0, resolvePostLogin, tokens, audit).execute({ email: 'a@b.c', password: '123' });
    expect(pwdRes.ok).toBe(true);
    const cbRes = await new OAuthCallbackUseCase(auth0, resolvePostLogin, tokens, audit).execute('code-1');
    expect(cbRes).toEqual({ ok: true, sessionJwt: 'jwt-tok', redirectTo: '/' });
    expect(await new BackchannelLogoutUseCase(auth0).execute('lt')).toEqual({ ok: true, sid: 's-1', sub: 'auth0|1' });
  });

  it('fetches email_verified from Auth0 user when omitted from id_token', async () => {
    const auth0 = {
      loginWithPassword: vi.fn().mockResolvedValue({ ok: true, idToken: 'idt', accessToken: 'act' }),
      verifyJwt: vi.fn().mockResolvedValue({ sub: 'auth0|1', email: 'a@b.c' }),
      getUserEmailVerified: vi.fn().mockResolvedValue(true),
    } as unknown as IAuth0Gateway;
    const resolvePostLogin = {
      execute: vi.fn().mockResolvedValue({ ok: true, session: { userId: 'u-1', auth0Id: 'auth0|1', email: 'a@b.c', fullName: 'A', documentType: 'CPF', documentNumber: '000', bindings: [] } }),
    } as unknown as ResolvePostLoginUseCase;
    const tokens = { sign: vi.fn().mockResolvedValue('jwt-tok') } as unknown as ISessionTokenGateway;
    const res = await new PasswordLoginUseCase(auth0, resolvePostLogin, tokens, { log: vi.fn() }).execute({ email: 'a@b.c', password: '123' });
    expect(res.ok).toBe(true);
    expect(auth0.getUserEmailVerified).toHaveBeenCalledWith('auth0|1', 'act');
    expect(resolvePostLogin.execute).toHaveBeenCalledWith('auth0|1', 'a@b.c', true);
  });

  it('enforces expectedAppSetup in PasswordLogin and OAuthCallback with getUserMetadata fallback', async () => {
    const expected = { appSetupId: 'app-1', appSetupSecret: 'sec-1', environment: 'production', requireGenovaAdmin: true, claimsNamespace: 'https://genova.cloud/' };
    const auth0 = {
      loginWithPassword: vi.fn().mockResolvedValue({ ok: true, idToken: 'idt' }),
      exchangeAuthorizationCode: vi.fn().mockResolvedValue({ ok: true, idToken: 'idt' }),
      verifyJwt: vi.fn().mockResolvedValue({ sub: 'auth0|1', email: 'a@b.c', email_verified: true }),
      getUserMetadata: vi.fn()
        .mockResolvedValueOnce({ appMetadata: { app_setup_id: 'wrong', app_setup_secret: 'sec-1', environment: 'production' }, userMetadata: { genova_admin: true } })
        .mockResolvedValueOnce({ appMetadata: { app_setup_id: 'app-1', app_setup_secret: 'sec-1', environment: 'production' }, userMetadata: { genova_admin: true } }),
    } as unknown as IAuth0Gateway;
    const resolvePostLogin = {
      execute: vi.fn().mockResolvedValue({ ok: true, session: { userId: 'u-1', auth0Id: 'auth0|1', email: 'a@b.c', fullName: 'A', documentType: 'CPF', documentNumber: '000', bindings: [] } }),
    } as unknown as ResolvePostLoginUseCase;
    const tokens = { sign: vi.fn().mockResolvedValue('jwt-tok') } as unknown as ISessionTokenGateway;

    const denied = await new PasswordLoginUseCase(auth0, resolvePostLogin, tokens, { log: vi.fn() }, expected).execute({ email: 'a@b.c', password: '123' });
    expect(denied).toEqual({ ok: false, statusCode: 403, message: 'app_setup_mismatch' });

    const allowed = await new OAuthCallbackUseCase(auth0, resolvePostLogin, tokens, { log: vi.fn() }, expected).execute('code-ok');
    expect(allowed).toEqual({ ok: true, sessionJwt: 'jwt-tok', redirectTo: '/' });
  });
});
