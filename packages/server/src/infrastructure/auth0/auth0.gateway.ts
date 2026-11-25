import type { Auth0JwtClaims, IAuth0Gateway } from '@genovalv/core';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { AUTH0_PASSWORD_REALM_GRANT } from '../../domain/constants/auth-cookie.constants';
import type { Auth0GatewayConfig } from '../config/auth0-gateway-config';
import { exchangeAuth0Token } from './exchange-auth0-token';
import { postAuth0Json } from './post-auth0-json';
import { resolveAuth0BaseUrl } from './resolve-auth0-base-url';

export class Auth0Gateway implements IAuth0Gateway {
  private readonly baseUrl: string;

  constructor(private readonly env: Auth0GatewayConfig, private readonly fetchFn: typeof fetch = fetch) {
    this.baseUrl = resolveAuth0BaseUrl(env.auth0Domain);
  }

  async verifyJwt(token: string, expectedAudience = this.env.auth0ClientId): Promise<Auth0JwtClaims> {
    const issuer = `${this.baseUrl}/`;
    const jwks = createRemoteJWKSet(new URL('.well-known/jwks.json', issuer));
    const { payload } = await jwtVerify(token, jwks, { issuer, ...(expectedAudience ? { audience: expectedAudience } : {}) });
    return payload as Auth0JwtClaims;
  }

  private oauthClientCredentials() {
    return { client_id: this.env.auth0ClientId, client_secret: this.env.auth0ClientSecret };
  }

  loginWithPassword(email: string, password: string) {
    return exchangeAuth0Token(this.baseUrl, {
      grant_type: AUTH0_PASSWORD_REALM_GRANT,
      realm: 'Username-Password-Authentication',
      username: email,
      password,
      ...this.oauthClientCredentials(),
      scope: 'openid profile email',
      ...(this.env.auth0Audience ? { audience: this.env.auth0Audience } : {}),
    }, this.fetchFn);
  }

  exchangeAuthorizationCode(code: string) {
    return exchangeAuth0Token(this.baseUrl, {
      grant_type: 'authorization_code',
      ...this.oauthClientCredentials(),
      code,
      redirect_uri: this.env.auth0CallbackUrl,
    }, this.fetchFn);
  }

  buildAuthorizeUrl(): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.env.auth0ClientId,
      redirect_uri: this.env.auth0CallbackUrl,
      scope: 'openid profile email',
      ...(this.env.auth0Audience ? { audience: this.env.auth0Audience } : {}),
    });
    return `${this.baseUrl}/authorize?${params.toString()}`;
  }

  buildLogoutUrl(): string {
    return `${this.baseUrl}/v2/logout?${new URLSearchParams({ client_id: this.env.auth0ClientId, returnTo: this.env.auth0LogoutReturnUrl }).toString()}`;
  }

  async obtainManagementToken() {
    const body = {
      grant_type: 'client_credentials',
      client_id: this.env.auth0MgmtClientId || this.env.auth0ClientId,
      client_secret: this.env.auth0MgmtClientSecret || this.env.auth0ClientSecret,
      audience: `${this.baseUrl}/api/v2/`,
    };
    const res = await this.fetchFn(`${this.baseUrl}/oauth/token`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) return { ok: false as const, status: res.status, errorBody: await res.text().catch(() => '') };
    const { access_token } = (await res.json()) as { access_token: string };
    return { ok: true as const, token: access_token };
  }

  async createManagementUser(mgmtToken: string, payload: { email: string; fullName: string; password: string; sqlId: string; cpf: string; env?: string; mustChangePassword?: boolean }) {
    const appMetadata: Record<string, unknown> = {
      sql_id: payload.sqlId,
      cpf: payload.cpf,
      active: true,
      must_change_password: payload.mustChangePassword ?? true,
      ...(payload.env ? { env: payload.env } : {}),
    };
    const created = await postAuth0Json<{ user_id: string }>(`${this.baseUrl}/api/v2/users`, {
      connection: 'Username-Password-Authentication',
      email: payload.email,
      name: payload.fullName,
      password: payload.password,
      email_verified: true,
      app_metadata: appMetadata,
    }, this.fetchFn, mgmtToken);
    return { userId: created.user_id };
  }

  async createPasswordChangeTicket(mgmtToken: string, userId: string, resultUrl: string): Promise<string> {
    const { ticket } = await postAuth0Json<{ ticket: string }>(`${this.baseUrl}/api/v2/tickets/password-change`, { user_id: userId, result_url: resultUrl, mark_email_as_verified: true }, this.fetchFn, mgmtToken);
    return ticket;
  }

  async signupDatabaseUser(email: string, fullName: string, password: string) {
    const data = await postAuth0Json<{ _id?: string; id?: string; email_verified?: boolean }>(`${this.baseUrl}/dbconnections/signup`, { client_id: this.env.auth0ClientId, connection: 'Username-Password-Authentication', email, password, name: fullName }, this.fetchFn);
    const rawId = data._id || data.id || '';
    if (!rawId) throw new Error('Auth0 /dbconnections/signup returned no user id');
    return { auth0Id: rawId.startsWith('auth0|') ? rawId : `auth0|${rawId}`, emailVerified: Boolean(data.email_verified) };
  }
}
