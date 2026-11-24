export type Auth0TokenExchangeResult =
  | { ok: true; idToken: string }
  | { ok: false; status: number; errorBody: string };
