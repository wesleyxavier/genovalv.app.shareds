import { createError, getQuery, readBody, type H3Event } from 'h3';

export abstract class BaseController {
  protected async readJsonBody<T>(event: H3Event): Promise<Partial<T>> {
    return ((await readBody<Partial<T>>(event)) || {}) as Partial<T>;
  }

  protected getQueryString(event: H3Event, key: string): string {
    const query = getQuery(event);
    return typeof query[key] === 'string' ? (query[key] as string) : '';
  }

  protected async executeOrBadRequest<T>(fn: () => Promise<T>, fallbackMessage: string): Promise<T> {
    try {
      return await fn();
    } catch (err) {
      throw createError({
        statusCode: 400,
        statusMessage: err instanceof Error ? err.message : fallbackMessage,
      });
    }
  }
}
