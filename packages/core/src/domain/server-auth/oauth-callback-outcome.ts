export type OAuthCallbackOutcome =
  | { ok: true; sessionJwt: string; redirectTo: '/' }
  | { ok: false; redirectTo: string };
