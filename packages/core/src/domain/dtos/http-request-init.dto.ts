export interface HttpRequestInit {
  method?: string;
  credentials?: 'include' | 'omit' | 'same-origin';
  headers?: Record<string, string>;
  body?: string;
}
