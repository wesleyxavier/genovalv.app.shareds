import type { LoginFieldName } from './login-field-name.dto';
import type { LoginSubmissionInput } from './login-submission-input.dto';
import type { LoginTranslationKey } from './login-translation-key.dto';

export interface LoginValidationResult {
  valid: boolean;
  errors: Partial<Record<LoginFieldName, string>>;
  errorKeys: Partial<Record<LoginFieldName, LoginTranslationKey>>;
  normalized: LoginSubmissionInput;
}
