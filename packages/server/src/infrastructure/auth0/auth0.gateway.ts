import type { Auth0JwtClaims, Auth0UserMetadataSnapshot, CreateManagementUserPayload, IAuth0Gateway } from '@genovalv/core';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { AUTH0_PASSWORD_REALM_GRANT } from '../../domain/constants/auth-cookie.constants';
import type { Auth0GatewayConfig } from '../config/auth0-gateway-config';
import { buildManagementUserBody } from './build-management-user-body';
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
    const { payload } = await jwtVerify(token, createRemoteJWKSet(new URL('.well-known/jwks.json', issuer)), {
      issuer, ...(expectedAudience ? { audience: expectedAudience } : {}),
    });
    return payload as Auth0JwtClaims;
  }

  private oauthCreds() {
    return { client_id: this.env.auth0ClientId, client_secret: this.env.auth0ClientSecret };
  }

  loginWithPassword(email: string, password: string) {
    return exchangeAuth0Token(this.baseUrl, {
      grant_type: AUTH0_PASSWORD_REALM_GRANT, realm: 'Username-Password-Authentication', username: email, password,
      ...this.oauthCreds(), scope: 'openid profile email', ...(this.env.auth0Audience ? { audience: this.env.auth0Audience } : {}),
    }, this.fetchFn);
  }

  exchangeAuthorizationCode(code: string) {
    return exchangeAuth0Token(this.baseUrl, {
      grant_type: 'authorization_code', ...this.oauthCreds(), code, redirect_uri: this.env.auth0CallbackUrl,
    }, this.fetchFn);
  }

  buildAuthorizeUrl(): string {
    const params = new URLSearchParams({
      response_type: 'code', client_id: this.env.auth0ClientId, redirect_uri: this.env.auth0CallbackUrl, scope: 'openid profile email',
      ...(this.env.auth0Audience ? { audience: this.env.auth0Audience } : {}),
    });
    return `${this.baseUrl}/authorize?${params.toString()}`;
  }

  buildLogoutUrl(): string {
    return `${this.baseUrl}/v2/logout?${new URLSearchParams({ client_id: this.env.auth0ClientId, returnTo: this.env.auth0LogoutReturnUrl }).toString()}`;
  }

  async obtainManagementToken() {
    const body = {
      grant_type: 'client_credentials', client_id: this.env.auth0MgmtClientId || this.env.auth0ClientId,
      client_secret: this.env.auth0MgmtClientSecret || this.env.auth0ClientSecret, audience: `${this.baseUrl}/api/v2/`,
    };
    const res = await this.fetchFn(`${this.baseUrl}/oauth/token`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) return { ok: false as const, status: res.status, errorBody: await res.text().catch(() => '') };
    const { access_token } = (await res.json()) as { access_token: string };
    return { ok: true as const, token: access_token };
  }

  async createManagementUser(mgmtToken: string, payload: CreateManagementUserPayload) {
    const created = await postAuth0Json<{ user_id: string }>(`${this.baseUrl}/api/v2/users`, buildManagementUserBody(payload), this.fetchFn, mgmtToken);
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

  async getUserEmailVerified(userId: string, accessToken?: string): Promise<boolean | null> {
    if (accessToken) {
      try {
        const res = await this.fetchFn(`${this.baseUrl}/userinfo`, { headers: { Authorization: `Bearer ${accessToken}` } });
        if (res.ok) {
          const info = (await res.json()) as { email_verified?: boolean };
          if (typeof info.email_verified === 'boolean') return info.email_verified;
        }
      } catch { /* fallback to management API */ }
    }
    const mgmt = await this.obtainManagementToken();
    if (!mgmt.ok || !userId) return null;
    const res = await this.fetchFn(`${this.baseUrl}/api/v2/users/${encodeURIComponent(userId)}?fields=email_verified`, { headers: { Authorization: `Bearer ${mgmt.token}` } });
    if (!res.ok) return null;
    const data = (await res.json()) as { email_verified?: boolean };
    return typeof data.email_verified === 'boolean' ? data.email_verified : null;
  }

  async getUserMetadata(userId: string): Promise<Auth0UserMetadataSnapshot | null> {
    const mgmt = await this.obtainManagementToken();
    if (!mgmt.ok || !userId) return null;
    const res = await this.fetchFn(`${this.baseUrl}/api/v2/users/${encodeURIComponent(userId)}?fields=app_metadata,user_metadata`, { headers: { Authorization: `Bearer ${mgmt.token}` } });
    if (!res.ok) return null;
    const data = (await res.json()) as { app_metadata?: Record<string, unknown>; user_metadata?: Record<string, unknown> };
    return { appMetadata: data.app_metadata, userMetadata: data.user_metadata };
  }
}
