import type { MfaMethod } from './mfa-method.dto';

export interface MfaGuidance {
  method: MfaMethod;
  label: string;
  title: string;
  hint: string;
}
