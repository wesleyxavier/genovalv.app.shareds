import type { ISessionTokenGateway } from '@genovalv/core';
import { createEvent, type H3Event } from 'h3';
import { IncomingMessage, ServerResponse } from 'node:http';
import { Socket } from 'node:net';
import { describe, expect, it, vi } from 'vitest';
import {
  BackchannelLogoutController,
  BaseUserController,
  CallbackController,
  LoginController,
  LogoutController,
  MeController,
  PasswordLoginController,
  type BackchannelLogoutUseCase,
  type OAuthCallbackUseCase,
  type PasswordLoginUseCase,
} from '../src/index';

function mockEvent(method: string, url = '/', body?: unknown, headers: Record<string, string> = {}) {
  const req = new IncomingMessage(new Socket());
  req.method = method;
  req.url = url;
  Object.assign(req.headers, headers);
  const event = createEvent(req, new ServerResponse(req));
  if (body !== undefined) (event as { _requestBody: unknown })._requestBody = body;
  return event;
}

class ProtectedTestController extends BaseUserController {
  async check(event: H3Event) {
    return { session: await this.requireSession(event), key: this.requireIdempotencyKey(event) };
  }
}

describe('@genovalv/server H3 controllers', () => {
  it('handles Login, Callback, PasswordLogin, Me, Logout, Backchannel and BaseUser guards', async () => {
    const cookieConfig = { cookieName: 'gnv', cookieSecure: true };
    const auth0 = { buildAuthorizeUrl: () => 'https://auth0/auth', buildLogoutUrl: () => 'https://auth0/logout' };

    const loginEv = mockEvent('GET');
    await new LoginController(auth0).handle(loginEv);
    expect(loginEv.node.res.getHeader('location')).toBe('https://auth0/auth');

    const cbUc = { execute: vi.fn().mockResolvedValue({ ok: true, sessionJwt: 'j-1', redirectTo: '/' }) } as unknown as OAuthCallbackUseCase;
    const cbEv = mockEvent('GET', '/api/auth/callback?code=abc');
    await new CallbackController(cookieConfig, cbUc).handle(cbEv);
    expect(String(cbEv.node.res.getHeader('set-cookie'))).toContain('gnv=j-1');

    const pwdUc = {
      execute: vi.fn().mockResolvedValue({
        ok: true, sessionJwt: 'j-2', ttlSeconds: 60, rememberDevice: true,
        session: { userId: 'u-1', email: 'a@b.c', fullName: 'A' },
      }),
    } as unknown as PasswordLoginUseCase;
    const pwdRes = await new PasswordLoginController(cookieConfig, pwdUc, 'saas-admin').handle(mockEvent('POST', '/', { email: 'a@b.c', password: '123' }));
    expect(pwdRes.user.role).toBe('saas-admin');

    const tokens = { verify: vi.fn().mockResolvedValue({ userId: 'u-1' }) } as unknown as ISessionTokenGateway;
    expect(await new MeController('gnv', tokens).handle(mockEvent('GET', '/', undefined, { cookie: 'gnv=j' }))).toMatchObject({ authenticated: true });
    expect(new LogoutController(cookieConfig, auth0).handle(mockEvent('POST'))).toEqual({ ok: true, logoutUrl: 'https://auth0/logout' });

    const bclUc = { execute: vi.fn().mockResolvedValue({ ok: true, sid: 's', sub: 'u' }) } as unknown as BackchannelLogoutUseCase;
    expect(await new BackchannelLogoutController(bclUc).handle(mockEvent('POST', '/', { logout_token: 'lt' }))).toEqual({ ok: true, sid: 's', sub: 'u' });

    const protectedRes = await new ProtectedTestController('gnv', tokens).check(mockEvent('POST', '/', {}, { cookie: 'gnv=ok', 'idempotency-key': 'i-1' }));
    expect(protectedRes).toEqual({ session: { userId: 'u-1' }, key: 'i-1' });
  });
});
