import type { AuthSession } from './auth-session.entity';
import type { SessionUser } from './session-user.entity';

export interface RememberedAuthSession<TUser = SessionUser> extends AuthSession<TUser> {
  expiresAt: number | null;
  rememberDevice: boolean;
}
