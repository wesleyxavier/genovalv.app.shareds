import type { HttpRequestInit } from './http-request-init.dto';
import type { HttpResponseLike } from './http-response-like.dto';

export type HttpFetch = (input: string, init?: HttpRequestInit) => Promise<HttpResponseLike>;
