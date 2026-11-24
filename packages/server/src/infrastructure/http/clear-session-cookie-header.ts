import { buildSessionCookieHeader } from './build-session-cookie-header';

export function clearSessionCookieHeader(name: string, secure: boolean): string {
  return buildSessionCookieHeader(name, '', secure, 0);
}
