import type { AuthSession } from '../entities/auth-session.entity';
import type { SessionUser } from '../entities/session-user.entity';

export const UNAUTHENTICATED_SESSION: Readonly<AuthSession<SessionUser<string>>> = Object.freeze({
  authenticated: false,
  user: null,
});
