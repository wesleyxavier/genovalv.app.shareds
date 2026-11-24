import type { AuthSession } from '../entities/auth-session.entity';
import type { SessionUser } from '../entities/session-user.entity';

export function createUnauthenticatedSession<
  TUser = SessionUser,
  TExtra extends Record<string, unknown> = Record<string, never>,
>(extra?: TExtra): AuthSession<TUser> & TExtra {
  return {
    authenticated: false,
    user: null,
    ...(extra as TExtra),
  };
}
