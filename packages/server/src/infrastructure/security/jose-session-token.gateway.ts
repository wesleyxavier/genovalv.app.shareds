import type { ISessionTokenGateway, UserCookieSession } from '@genovalv/core';
import { jwtVerify, SignJWT } from 'jose';
import { DEFAULT_COOKIE_TTL_SECONDS } from '../../domain/constants/auth-cookie.constants';

export class JoseSessionTokenGateway implements ISessionTokenGateway {
  private readonly encodedSecret: Uint8Array;

  constructor(secret: string) {
    this.encodedSecret = new TextEncoder().encode(secret);
  }

  sign(session: UserCookieSession, ttlSeconds = DEFAULT_COOKIE_TTL_SECONDS): Promise<string> {
    return new SignJWT({ session })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(`${ttlSeconds}s`)
      .sign(this.encodedSecret);
  }

  async verify(token: string): Promise<UserCookieSession | null> {
    try {
      const { payload } = await jwtVerify(token, this.encodedSecret);
      return (payload['session'] as UserCookieSession) ?? null;
    } catch {
      return null;
    }
  }
}
