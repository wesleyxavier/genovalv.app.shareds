import type { IdempotencyRecord } from '../dtos/idempotency-record.dto';

export interface IdempotencyStore {
  findByKey<TResponse = unknown>(key: string): Promise<IdempotencyRecord<TResponse> | undefined>;
  save<TResponse = unknown>(record: IdempotencyRecord<TResponse>): Promise<void>;
}
