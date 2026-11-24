export interface Auth0JwtClaims {
  sub?: string;
  iss?: string;
  email?: string;
  email_verified?: boolean;
  sid?: string;
  [key: string]: unknown;
}
