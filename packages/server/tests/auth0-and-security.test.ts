import { describe, expect, it, vi } from 'vitest';
import {
  Auth0Gateway,
  JoseSessionTokenGateway,
  NodeHashService,
  buildSessionCookieHeader,
  clearSessionCookieHeader,
} from '../src/index';

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

  it('builds Auth0 authorize/logout URLs cleanly', () => {
    const gw = new Auth0Gateway({
      auth0Domain: 'tenant.us.auth0.com', auth0ClientId: 'cid', auth0ClientSecret: 'sec',
      auth0MgmtClientId: '', auth0MgmtClientSecret: '', auth0Audience: 'https://api',
      auth0CallbackUrl: 'https://app/cb', auth0LogoutReturnUrl: 'https://app/logout',
    }, vi.fn() as unknown as typeof fetch);
    expect(gw.buildAuthorizeUrl()).toContain('https://tenant.us.auth0.com/authorize');
    expect(gw.buildLogoutUrl()).toContain('https://tenant.us.auth0.com/v2/logout');
  });

  it('includes env and must_change_password in createManagementUser app_metadata', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user_id: 'auth0|admin1' }),
    });
    const gw = new Auth0Gateway({
      auth0Domain: 'tenant.us.auth0.com', auth0ClientId: 'cid', auth0ClientSecret: 'sec',
      auth0MgmtClientId: '', auth0MgmtClientSecret: '', auth0Audience: 'https://api',
      auth0CallbackUrl: 'https://app/cb', auth0LogoutReturnUrl: 'https://app/logout',
    }, fetchMock as unknown as typeof fetch);

    const res = await gw.createManagementUser('mgmt-tok', {
      email: 'admin@empresa.com', fullName: 'Admin', password: 'Strong!2026', sqlId: 'u-1', cpf: '52998224725', env: 'staging', mustChangePassword: false,
    });
    expect(res.userId).toBe('auth0|admin1');
    const body = JSON.parse((fetchMock.mock.calls[0]?.[1] as { body: string }).body);
    expect(body.app_metadata).toEqual({
      sql_id: 'u-1', cpf: '52998224725', active: true, must_change_password: false, env: 'staging',
    });
  });
});
