import type { PostLoginUserMetadata } from './post-login-user-metadata';

export interface PostLoginEvent {
  user: { email_verified?: boolean; app_metadata?: PostLoginUserMetadata };
  authorization?: Record<string, unknown>;
}
