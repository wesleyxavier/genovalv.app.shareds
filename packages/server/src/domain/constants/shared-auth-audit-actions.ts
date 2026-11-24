export const SHARED_AUTH_AUDIT_ACTIONS = {
  passwordLoginFailed: 'auth.password_login.failed',
  passwordLoginDenied: 'auth.password_login.denied',
  passwordLoginSuccess: 'auth.password_login.success',
  oauthCallbackFailed: 'auth.oauth_callback.failed',
  oauthCallbackDenied: 'auth.oauth_callback.denied',
  oauthCallbackSuccess: 'auth.oauth_callback.success',
} as const;
