export interface IdempotencyRecord<TResponse = unknown> {
  key: string;
  requestHash: string;
  response: TResponse;
  createdAt: string;
}
