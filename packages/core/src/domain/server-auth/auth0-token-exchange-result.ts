export type Auth0TokenExchangeResult =
  | { ok: true; idToken: string; accessToken?: string }
  | { ok: false; status: number; errorBody: string };
