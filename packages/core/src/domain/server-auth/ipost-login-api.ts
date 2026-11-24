export interface PostLoginApi {
  access: { deny: (reason: string) => void };
  idToken: { setCustomClaim: (name: string, value: unknown) => void };
  accessToken: { setCustomClaim: (name: string, value: unknown) => void };
}
