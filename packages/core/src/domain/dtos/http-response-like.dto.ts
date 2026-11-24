export interface HttpResponseLike {
  ok: boolean;
  json(): Promise<unknown>;
}
