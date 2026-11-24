import type { UserCookieSession } from './user-cookie-session';

export interface ISessionTokenGateway {
  sign(session: UserCookieSession, ttlSeconds?: number): Promise<string>;
  verify(token: string): Promise<UserCookieSession | null>;
}
