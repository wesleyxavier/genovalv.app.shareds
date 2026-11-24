import { DEFAULT_COOKIE_TTL_SECONDS } from '../../domain/constants/auth-cookie.constants';

export function buildSessionCookieHeader(
  name: string,
  value: string,
  secure: boolean,
  maxAgeSeconds = DEFAULT_COOKIE_TTL_SECONDS,
): string {
  const parts = [`${name}=${value}`, 'Path=/', 'HttpOnly', 'SameSite=Lax', `Max-Age=${maxAgeSeconds}`];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}
