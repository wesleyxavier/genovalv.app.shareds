import type { SessionUser } from './session-user.entity';

export interface AuthSession<TUser = SessionUser> {
  authenticated: boolean;
  user: TUser | null;
}
