import type { UserCookieSession } from './user-cookie-session';

export type PasswordLoginOutcome =
  | { ok: true; sessionJwt: string; ttlSeconds: number; rememberDevice: boolean; session: UserCookieSession }
  | { ok: false; statusCode: 400 | 401 | 403; message: string };
