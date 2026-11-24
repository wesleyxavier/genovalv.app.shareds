import type { MfaMethod } from './mfa-method.dto';

export interface LoginRawInput {
  email: string;
  password: string;
  mfaCode?: string;
  mfaMethod?: MfaMethod;
  rememberDevice?: boolean;
}
