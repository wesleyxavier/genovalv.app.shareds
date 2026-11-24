import type { PostLoginDenyReason } from './post-login-deny-reason';
import type { UserCookieSession } from './user-cookie-session';

export type ResolveUserResult =
  | { ok: true; session: UserCookieSession }
  | { ok: false; reason: PostLoginDenyReason };
