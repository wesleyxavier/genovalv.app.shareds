import { createError, getHeader, type H3Event } from 'h3';

export function requireIdempotencyKey(event: H3Event): string {
  const key = getHeader(event, 'idempotency-key')?.trim();
  if (!key) throw createError({ statusCode: 400, statusMessage: 'Missing Idempotency-Key header' });
  return key;
}
