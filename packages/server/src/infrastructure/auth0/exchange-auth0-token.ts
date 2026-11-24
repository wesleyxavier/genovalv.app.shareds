import type { Auth0TokenExchangeResult } from '@genovalv/core';

export async function exchangeAuth0Token(
  baseUrl: string,
  body: Record<string, unknown>,
  fetchFn: typeof fetch,
): Promise<Auth0TokenExchangeResult> {
  const res = await fetchFn(`${baseUrl}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) return { ok: false, status: res.status, errorBody: await res.text().catch(() => '') };
  const data = (await res.json()) as { id_token?: string };
  if (!data.id_token) return { ok: false, status: 401, errorBody: 'Missing id_token' };
  return { ok: true, idToken: data.id_token };
}
