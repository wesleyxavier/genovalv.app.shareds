export async function postAuth0Json<T>(
  url: string,
  body: unknown,
  fetchFn: typeof fetch,
  bearerToken?: string,
): Promise<T> {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (bearerToken) headers['authorization'] = `Bearer ${bearerToken}`;
  const res = await fetchFn(url, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`Auth0 request failed (${res.status}): ${await res.text()}`);
  return (await res.json()) as T;
}
