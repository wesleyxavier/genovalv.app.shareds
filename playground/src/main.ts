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
import {
  registerGenovaElements,
  type GenovaActionButtonElement,
  type GenovaAlertBannerElement,
  type GenovaAuthCardElement,
  type GenovaAuthShellElement,
  type GenovaCheckboxElement,
  type GenovaInputElement,
  type GenovaLocaleSelectorElement,
  type GenovaMfaSelectorElement,
} from '@genovalv/elements';

registerGenovaElements();

const params = new URLSearchParams(window.location.search);
const mfaMode = (params.get('mfaMode') as MfaMode | null) ?? 'hidden';
const simulateOutcome = params.get('outcome') ?? 'success';
let currentLocale: SupportedLocale = (params.get('locale') as SupportedLocale | null) ?? 'pt-BR';
let activeMfaMethod: MfaMethod = 'totp';
let submissionState: SubmissionState = 'idle';

const shell = document.getElementById('auth-shell') as GenovaAuthShellElement;
const card = document.getElementById('auth-card') as GenovaAuthCardElement;
const mfaSelector = document.getElementById('mfa-selector') as GenovaMfaSelectorElement;
const submitBtn = document.getElementById('submit-btn') as GenovaActionButtonElement;
const alertBanner = document.getElementById('form-alert') as GenovaAlertBannerElement;

const localeSelect = document.getElementById('locale-select') as GenovaLocaleSelectorElement;
const form = document.getElementById('login-form') as HTMLFormElement;
const emailInput = document.getElementById('login-email') as GenovaInputElement;
const passwordInput = document.getElementById('login-password') as GenovaInputElement;
const mfaInput = document.getElementById('login-mfa') as GenovaInputElement;
const rememberInput = document.getElementById('remember-device') as GenovaCheckboxElement;

function applyLocale(locale: SupportedLocale): void {
  currentLocale = locale;
  const t = createTranslator(locale);
  document.documentElement.lang = locale;

  shell.locale = locale;
  card.locale = locale;
  mfaSelector.locale = locale;
  submitBtn.locale = locale;
  localeSelect.locale = locale;

  emailInput.locale = locale;
  emailInput.label = t('auth.emailLabel');
  emailInput.placeholder = t('auth.emailPlaceholder');

  passwordInput.locale = locale;
  passwordInput.label = t('auth.passwordLabel');
  passwordInput.actionLabel = t('auth.forgotPassword');

  mfaInput.locale = locale;
  mfaInput.label = t('auth.mfaLabel');
  mfaInput.hint = t('auth.mfaHint');

  rememberInput.label = t('auth.rememberDevice', {
    days: DEFAULT_LOGIN_CONTEXT.rememberDeviceDays,
  });
}

const showMfa = mfaMode !== 'hidden';
mfaInput.hidden = !showMfa;
mfaSelector.hidden = !showMfa;

applyLocale(currentLocale);

localeSelect.addEventListener('genova-locale-change', (ev) => {
  const detail = (ev as CustomEvent<{ locale: SupportedLocale }>).detail;
  applyLocale(detail.locale);
});

mfaInput.addEventListener('genova-input', () => {
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

  emailInput.error = result.errors.email ?? '';
  passwordInput.error = result.errors.password ?? '';
  mfaInput.error = result.errors.mfaCode ?? '';

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
