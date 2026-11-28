import type { Auth0UserMetadataSnapshot } from './app-setup-context';
import type { Auth0JwtClaims } from './auth0-jwt-claims';
import type { Auth0TokenExchangeResult } from './auth0-token-exchange-result';
import type { CreateManagementUserPayload } from './create-management-user-payload';

export interface IAuth0Gateway {
  verifyJwt(token: string, expectedAudience?: string): Promise<Auth0JwtClaims>;
  loginWithPassword(email: string, password: string): Promise<Auth0TokenExchangeResult>;
  exchangeAuthorizationCode(code: string): Promise<Auth0TokenExchangeResult>;
  buildAuthorizeUrl(): string;
  buildLogoutUrl(): string;
  obtainManagementToken(): Promise<{ ok: true; token: string } | { ok: false; status: number; errorBody: string }>;
  createManagementUser(mgmtToken: string, payload: CreateManagementUserPayload): Promise<{ userId: string }>;
  createPasswordChangeTicket(mgmtToken: string, userId: string, resultUrl: string): Promise<string>;
  signupDatabaseUser(email: string, fullName: string, password: string): Promise<{ auth0Id: string; emailVerified: boolean }>;
  getUserEmailVerified?(userId: string, accessToken?: string): Promise<boolean | null>;
  getUserMetadata?(userId: string): Promise<Auth0UserMetadataSnapshot | null>;
}
