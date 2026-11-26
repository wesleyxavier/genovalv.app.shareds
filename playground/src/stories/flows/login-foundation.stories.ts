import type { Meta, StoryObj } from '@storybook/web-components';
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
import type {
  GenovaActionButtonElement,
  GenovaAlertBannerElement,
  GenovaAuthCardElement,
  GenovaAuthShellElement,
  GenovaCheckboxElement,
  GenovaInputElement,
  GenovaLocaleSelectorElement,
  GenovaMfaSelectorElement,
} from '@genovalv/elements';

type LoginArgs = {
  mfaMode: MfaMode;
  outcome: 'success' | 'error';
  locale: SupportedLocale;
};

const meta: Meta<LoginArgs> = {
  title: 'Flows/Login Foundation',
  argTypes: {
    mfaMode: { control: 'select', options: ['hidden', 'optional', 'required'] },
    outcome: { control: 'select', options: ['success', 'error'] },
    locale: { control: 'select', options: ['pt-BR', 'en-US', 'es-ES'] },
  },
  args: {
    mfaMode: 'hidden',
    outcome: 'success',
    locale: 'pt-BR',
  },
};

export default meta;
type Story = StoryObj<LoginArgs>;

function createLoginFoundationNode(args: LoginArgs): HTMLElement {
  const params = new URLSearchParams(window.location.search);
  const mfaMode = (params.get('mfaMode') as MfaMode | null) ?? args.mfaMode;
  const simulateOutcome = params.get('outcome') ?? args.outcome;
  let currentLocale: SupportedLocale = (params.get('locale') as SupportedLocale | null) ?? args.locale;
  let activeMfaMethod: MfaMethod = 'totp';
  let submissionState: SubmissionState = 'idle';

  const root = document.createElement('div');
  root.innerHTML = `
    <genova-auth-shell id="auth-shell">
      <div slot="actions" style="display:flex;align-items:center;gap:0.5rem;">
        <genova-locale-selector id="locale-select"></genova-locale-selector>
      </div>
      <genova-auth-card id="auth-card" portal-title="Genova Cloud" portal-subtitle="Admin Console • Acesso Restrito">
        <genova-alert-banner id="form-alert" slot="feedback"></genova-alert-banner>
        <form id="login-form" class="genova-form" novalidate>
          <genova-input id="login-email" name="email" type="email" icon="email" autocomplete="email" required></genova-input>
          <genova-input id="login-password" name="password" type="password" icon="lock" autocomplete="current-password" placeholder="••••••••••••" show-password-toggle required></genova-input>
          <genova-input id="login-mfa" name="mfaCode" type="text" icon="shield" inputmode="numeric" monospace placeholder="000 000" hidden></genova-input>
          <genova-mfa-selector id="mfa-selector" hidden></genova-mfa-selector>
          <genova-checkbox id="remember-device" name="rememberDevice" checked></genova-checkbox>
          <genova-action-button id="submit-btn" type="submit" style="margin-top:0.25rem;"></genova-action-button>
        </form>
      </genova-auth-card>
    </genova-auth-shell>
  `;

  const shell = root.querySelector('#auth-shell') as GenovaAuthShellElement;
  const card = root.querySelector('#auth-card') as GenovaAuthCardElement;
  const mfaSelector = root.querySelector('#mfa-selector') as GenovaMfaSelectorElement;
  const submitBtn = root.querySelector('#submit-btn') as GenovaActionButtonElement;
  const alertBanner = root.querySelector('#form-alert') as GenovaAlertBannerElement;
  const localeSelect = root.querySelector('#locale-select') as GenovaLocaleSelectorElement;
  const form = root.querySelector('#login-form') as HTMLFormElement;
  const emailInput = root.querySelector('#login-email') as GenovaInputElement;
  const passwordInput = root.querySelector('#login-password') as GenovaInputElement;
  const mfaInput = root.querySelector('#login-mfa') as GenovaInputElement;
  const rememberInput = root.querySelector('#remember-device') as GenovaCheckboxElement;

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
    rememberInput.label = t('auth.rememberDevice', { days: DEFAULT_LOGIN_CONTEXT.rememberDeviceDays });
  }

  const showMfa = mfaMode !== 'hidden';
  mfaInput.hidden = !showMfa;
  mfaSelector.hidden = !showMfa;
  applyLocale(currentLocale);

  localeSelect.addEventListener('genova-locale-change', (ev) => {
    applyLocale((ev as CustomEvent<{ locale: SupportedLocale }>).detail.locale);
  });
  mfaInput.addEventListener('genova-input', () => {
    mfaInput.value = sanitizeMfaCode(mfaInput.value);
  });
  mfaSelector.addEventListener('genova-mfa-method-change', (ev) => {
    activeMfaMethod = (ev as CustomEvent<{ method: MfaMethod }>).detail.method;
  });

  function handleSubmit(): void {
    if (submissionState === 'validating') return;
    const result = validateLoginSubmission(
      { email: emailInput.value, password: passwordInput.value, mfaCode: mfaInput.value, mfaMethod: activeMfaMethod, rememberDevice: rememberInput.checked },
      { mfaMode, locale: currentLocale },
    );
    emailInput.error = result.errors.email ?? '';
    passwordInput.error = result.errors.password ?? '';
    mfaInput.error = result.errors.mfaCode ?? '';
    if (!result.valid) { alertBanner.visible = false; return; }

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

  form.addEventListener('submit', (e) => { e.preventDefault(); handleSubmit(); });
  submitBtn.addEventListener('genova-action', () => handleSubmit());
  return root;
}

export const Default: Story = {
  render: (args) => createLoginFoundationNode(args),
};
