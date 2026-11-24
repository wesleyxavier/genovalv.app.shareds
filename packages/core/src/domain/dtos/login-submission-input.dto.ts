import type { MfaMethod } from './mfa-method.dto';

export interface LoginSubmissionInput {
  email: string;
  password: string;
  mfaCode?: string;
  mfaMethod?: MfaMethod;
  rememberDevice: boolean;
}
