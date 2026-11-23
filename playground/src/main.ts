import '@genovalv/tokens/tokens.css';
import {
  DEFAULT_LOGIN_CONTEXT,
  createTranslator,
  sanitizeMfaCode,
  validateLoginSubmission,
  type MfaMethod,
  type MfaMode,
  type SubmissionState,
  type SupportedLocale,
} from '@genovalv/core';
import { registerGenovaElements } from '@genovalv/elements';

registerGenovaElements();

const params = new URLSearchParams(window.location.search);
const mfaMode = (params.get('mfaMode') as MfaMode | null) ?? 'hidden';
const simulateOutcome = params.get('outcome') ?? 'success';
let currentLocale: SupportedLocale = (params.get('locale') as SupportedLocale | null) ?? 'pt-BR';
let activeMfaMethod: MfaMethod = 'totp';
let submissionState: SubmissionState = 'idle';

const shell = document.getElementById('auth-shell') as HTMLElement & {
  locale: SupportedLocale;
};
const card = document.getElementById('auth-card') as HTMLElement & {
  locale: SupportedLocale;
  portalTitle: string;
  portalSubtitle: string;
};
const mfaSelector = document.getElementById('mfa-selector') as HTMLElement & {
  locale: SupportedLocale;
  selectedMethod: MfaMethod;
};
const submitBtn = document.getElementById('submit-btn') as HTMLElement & {
  locale: SupportedLocale;
  state: SubmissionState;
};
const alertBanner = document.getElementById('form-alert') as HTMLElement & {
  variant: 'error' | 'success' | 'warning' | 'info';
  message: string;
  visible: boolean;
};

const localeSelect = document.getElementById('locale-select') as HTMLSelectElement;
const form = document.getElementById('login-form') as HTMLFormElement;
const emailInput = document.getElementById('login-email') as HTMLInputElement;
const passwordInput = document.getElementById('login-password') as HTMLInputElement;
const mfaField = document.getElementById('mfa-field') as HTMLDivElement;
const mfaInput = document.getElementById('login-mfa') as HTMLInputElement;
const rememberInput = document.getElementById('remember-device') as HTMLInputElement;
const togglePasswordBtn = document.getElementById('toggle-password') as HTMLButtonElement;

const emailLabel = document.getElementById('email-label') as HTMLLabelElement;
const passwordLabel = document.getElementById('password-label') as HTMLLabelElement;
const forgotLink = document.getElementById('forgot-link') as HTMLAnchorElement;
const mfaLabel = document.getElementById('mfa-label') as HTMLLabelElement;
const mfaHint = document.getElementById('mfa-hint') as HTMLSpanElement;
const rememberLabel = document.getElementById('remember-label') as HTMLLabelElement;

const emailError = document.getElementById('email-error') as HTMLSpanElement;
const passwordError = document.getElementById('password-error') as HTMLSpanElement;
const mfaError = document.getElementById('mfa-error') as HTMLSpanElement;

function applyLocale(locale: SupportedLocale): void {
  currentLocale = locale;
  const t = createTranslator(locale);
  document.documentElement.lang = locale;

  shell.locale = locale;
  card.locale = locale;
  mfaSelector.locale = locale;
  submitBtn.locale = locale;

  emailLabel.textContent = t('auth.emailLabel');
  emailInput.placeholder = t('auth.emailPlaceholder');
  passwordLabel.textContent = t('auth.passwordLabel');
  forgotLink.textContent = t('auth.forgotPassword');
  mfaLabel.textContent = t('auth.mfaLabel');
  mfaHint.textContent = t('auth.mfaHint');
  rememberLabel.textContent = t('auth.rememberDevice', { days: DEFAULT_LOGIN_CONTEXT.rememberDeviceDays });

  const isVisible = passwordInput.type === 'text';
  togglePasswordBtn.setAttribute('aria-label', isVisible ? t('auth.hidePassword') : t('auth.showPassword'));
}

function setFieldError(input: HTMLInputElement, errEl: HTMLSpanElement, msg?: string): void {
  if (msg) {
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errEl.id);
    errEl.textContent = msg;
    errEl.hidden = false;
  } else {
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    errEl.textContent = '';
    errEl.hidden = true;
  }
}

const showMfa = mfaMode !== 'hidden';
mfaField.hidden = !showMfa;
mfaSelector.hidden = !showMfa;

localeSelect.value = currentLocale;
applyLocale(currentLocale);

localeSelect.addEventListener('change', () => {
  applyLocale(localeSelect.value as SupportedLocale);
});

togglePasswordBtn.addEventListener('click', () => {
  const t = createTranslator(currentLocale);
  const show = passwordInput.type === 'password';
  passwordInput.type = show ? 'text' : 'password';
  togglePasswordBtn.setAttribute('aria-pressed', show ? 'true' : 'false');
  togglePasswordBtn.setAttribute('aria-label', show ? t('auth.hidePassword') : t('auth.showPassword'));
});

mfaInput.addEventListener('input', () => {
  mfaInput.value = sanitizeMfaCode(mfaInput.value);
});

mfaSelector.addEventListener('genova-mfa-method-change', (ev) => {
  const detail = (ev as CustomEvent<{ method: MfaMethod }>).detail;
  activeMfaMethod = detail.method;
});

function handleSubmit(): void {
  if (submissionState === 'validating') {
    return;
  }

  const result = validateLoginSubmission(
    {
      email: emailInput.value,
      password: passwordInput.value,
      mfaCode: mfaInput.value,
      mfaMethod: activeMfaMethod,
      rememberDevice: rememberInput.checked,
    },
    { mfaMode, locale: currentLocale },
  );

  setFieldError(emailInput, emailError, result.errors.email);
  setFieldError(passwordInput, passwordError, result.errors.password);
  setFieldError(mfaInput, mfaError, result.errors.mfaCode);

  if (!result.valid) {
    alertBanner.visible = false;
    return;
  }

  const t = createTranslator(currentLocale);
  submissionState = 'validating';
  submitBtn.state = 'validating';
  alertBanner.visible = false;

  window.setTimeout(() => {
    if (simulateOutcome === 'error') {
      submissionState = 'error';
      submitBtn.state = 'idle';
      alertBanner.variant = 'error';
      alertBanner.message = t('auth.invalidCredentials');
      alertBanner.visible = true;
      return;
    }

    submissionState = 'success';
    submitBtn.state = 'success';
    alertBanner.variant = 'success';
    alertBanner.message = t('auth.success');
    alertBanner.visible = true;
  }, 250);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  handleSubmit();
});

submitBtn.addEventListener('genova-action', () => {
  handleSubmit();
});
