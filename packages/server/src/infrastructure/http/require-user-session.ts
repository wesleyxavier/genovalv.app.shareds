import type { ISessionTokenGateway, UserCookieSession } from '@genovalv/core';
import { createError, getCookie, type H3Event } from 'h3';

export async function requireUserSession(
  event: H3Event,
  cookieName: string,
  tokenGateway: ISessionTokenGateway,
): Promise<UserCookieSession> {
  const token = getCookie(event, cookieName);
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  const session = await tokenGateway.verify(token);
  if (!session) throw createError({ statusCode: 401, statusMessage: 'Invalid session' });
  return session;
}
