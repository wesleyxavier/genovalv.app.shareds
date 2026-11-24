import type { IdempotencyStore } from '../../domain/interfaces/iidempotency-store';

export async function executeIdempotent<TResponse>(
  store: IdempotencyStore,
  key: string,
  requestHash: string,
  handler: () => Promise<TResponse>,
): Promise<{ status: 'executed' | 'replayed'; response: TResponse }> {
  const existing = await store.findByKey<TResponse>(key);
  if (existing) {
    return { status: 'replayed', response: existing.response };
  }

  const response = await handler();
  await store.save({
    key,
    requestHash,
    response,
    createdAt: new Date().toISOString(),
  });

  return { status: 'executed', response };
}
