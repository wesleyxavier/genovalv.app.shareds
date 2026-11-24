import { createEvent } from 'h3';
import { IncomingMessage, ServerResponse } from 'node:http';
import { Socket } from 'node:net';
import { describe, expect, it, vi } from 'vitest';
import {
  Auth0Gateway,
  JoseSessionTokenGateway,
  NodeHashService,
  buildSessionCookieHeader,
  clearSessionCookieHeader,
  requireIdempotencyKey,
  requireUserSession,
} from '../src/index';

function mockReqEvent(headers: Record<string, string> = {}) {
  const req = new IncomingMessage(new Socket());
  Object.assign(req.headers, headers);
  return createEvent(req, new ServerResponse(req));
}

describe('@genovalv/server security, http & auth0', () => {
  it('signs/verifies JOSE session and builds/clears HttpOnly cookies', async () => {
    const tokens = new JoseSessionTokenGateway('unit-secret-32-chars-minimum-ok!');
    const jwt = await tokens.sign({
      userId: 'u-1', auth0Id: 'auth0|1', email: 'a@b.c', fullName: 'A', documentType: 'CPF', documentNumber: '000', bindings: [],
    });
    expect((await tokens.verify(jwt))?.userId).toBe('u-1');
    expect(await tokens.verify('bad.jwt')).toBeNull();
    expect(buildSessionCookieHeader('gnv', 'tok', true, 60)).toContain('HttpOnly; SameSite=Lax; Max-Age=60; Secure');
    expect(clearSessionCookieHeader('gnv', false)).toContain('Max-Age=0');
    expect(new NodeHashService().sha256('abc')).toHaveLength(64);
  });

  it('enforces session cookie and idempotency-key guards', async () => {
    const tokens = new JoseSessionTokenGateway('unit-secret-32-chars-minimum-ok!');
    const validJwt = await tokens.sign({
      userId: 'u-1', auth0Id: 'auth0|1', email: 'a@b.c', fullName: 'A', documentType: 'CPF', documentNumber: '000', bindings: [],
    });
    await expect(requireUserSession(mockReqEvent(), 'gnv', tokens)).rejects.toMatchObject({ statusCode: 401 });
    await expect(requireUserSession(mockReqEvent({ cookie: 'gnv=bad' }), 'gnv', tokens)).rejects.toMatchObject({ statusCode: 401 });
    expect((await requireUserSession(mockReqEvent({ cookie: `gnv=${validJwt}` }), 'gnv', tokens)).userId).toBe('u-1');
    expect(() => requireIdempotencyKey(mockReqEvent())).toThrow();
    expect(requireIdempotencyKey(mockReqEvent({ 'idempotency-key': 'k-1' }))).toBe('k-1');
  });

  it('builds Auth0 authorize/logout URLs cleanly', () => {
    const gw = new Auth0Gateway({
      auth0Domain: 'tenant.us.auth0.com', auth0ClientId: 'cid', auth0ClientSecret: 'sec',
      auth0MgmtClientId: '', auth0MgmtClientSecret: '', auth0Audience: 'https://api',
      auth0CallbackUrl: 'https://app/cb', auth0LogoutReturnUrl: 'https://app/logout',
    }, vi.fn() as unknown as typeof fetch);
    expect(gw.buildAuthorizeUrl()).toContain('https://tenant.us.auth0.com/authorize');
    expect(gw.buildLogoutUrl()).toContain('https://tenant.us.auth0.com/v2/logout');
  });
});
