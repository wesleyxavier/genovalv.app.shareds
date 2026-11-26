import { LitElement, css, html } from 'lit';
import { createTranslator, type SupportedLocale } from '@genovalv/core';
import { registerCustomElement } from '../register';

export class GenovaInputElement extends LitElement {
  static formAssociated = true;

  static override properties = {
    name: { type: String },
    type: { type: String },
    label: { type: String },
    placeholder: { type: String },
    value: { type: String },
    autocomplete: { type: String },
    error: { type: String },
    hint: { type: String },
    icon: { type: String },
    actionLabel: { type: String, attribute: 'action-label' },
    actionHref: { type: String, attribute: 'action-href' },
    showPasswordToggle: { type: Boolean, attribute: 'show-password-toggle' },
    passwordVisible: { state: true },
    required: { type: Boolean },
    disabled: { type: Boolean },
    inputmode: { type: String },
    monospace: { type: Boolean },
    locale: { type: String },
  };

  name = '';
  type: 'text' | 'email' | 'password' = 'text';
  label = '';
  placeholder = '';
  value = '';
  autocomplete = '';
  error = '';
  hint = '';
  icon: 'email' | 'lock' | 'shield' | 'none' = 'none';
  actionLabel = '';
  actionHref = '';
  showPasswordToggle = false;
  passwordVisible = false;
  required = false;
  disabled = false;
  inputmode = '';
  monospace = false;
  locale: SupportedLocale = 'pt-BR';

  private internals?: ElementInternals;

  constructor() {
    super();
    if (typeof HTMLElement !== 'undefined' && typeof this.attachInternals === 'function') {
      try {
        this.internals = this.attachInternals();
      } catch {
        this.internals = undefined;
      }
    }
  }

  static override styles = css`
    :host {
      display: block;
      width: 100%;
    }
    :host([hidden]) {
      display: none;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }
    label {
      font-size: 0.8125rem;
      line-height: 1rem;
      font-weight: 600;
      color: var(--gnv-on-surface, #0f172a);
    }
    .hint {
      font-family: var(--gnv-font-mono, 'JetBrains Mono', monospace);
      font-size: 0.6875rem;
      line-height: 1rem;
      font-weight: 500;
      color: var(--gnv-on-surface-variant, #475569);
    }
    a.action-link {
      font-size: 0.6875rem;
      line-height: 0.875rem;
      font-weight: 600;
      letter-spacing: 0.025em;
      color: var(--gnv-primary, #715faf);
      text-decoration: none;
    }
    a.action-link:hover,
    a.action-link:focus-visible {
      text-decoration: underline;
      outline: none;
    }
    .wrap {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
    }
    .icon {
      position: absolute;
      left: 0.75rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--gnv-on-surface-variant, #45464d);
      pointer-events: none;
      font-size: 0.95rem;
    }
    input {
      width: 100%;
      box-sizing: border-box;
      background-color: var(--gnv-surface-container-lowest, #ffffff);
      color: var(--gnv-on-surface, #0f172a);
      font-family: var(--gnv-font-sans, 'Plus Jakarta Sans', system-ui, sans-serif);
      font-size: 0.8125rem;
      line-height: 1.25rem;
      padding: 0.625rem 0.875rem;
      border: 1px solid var(--gnv-outline, #857f93);
      border-radius: var(--gnv-radius-lg, 0.5rem);
      outline: none;
      transition: background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
    }
    input.with-icon {
      padding-left: 2.5rem;
    }
    input.with-action {
      padding-right: 2.5rem;
    }
    input.mono {
      font-family: var(--gnv-font-mono, 'JetBrains Mono', monospace);
      letter-spacing: 0.12em;
    }
    input:focus {
      background-color: var(--gnv-surface-container-lowest, #ffffff);
      border-color: var(--gnv-primary, #715faf);
      box-shadow: 0 0 0 2px var(--gnv-primary-border, #cfc4f5);
    }
    input[aria-invalid='true'] {
      border-color: var(--gnv-error, #bc3737);
      box-shadow: 0 0 0 1.5px rgba(188, 55, 55, 0.25);
    }
    button.toggle {
      position: absolute;
      right: 0.625rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.25rem;
      border: none;
      background: transparent;
      color: var(--gnv-on-surface-variant, #475569);
      border-radius: var(--gnv-radius-md, 0.25rem);
      cursor: pointer;
    }
    button.toggle:hover,
    button.toggle:focus-visible {
      color: var(--gnv-on-surface, #0f172a);
      outline: 2px solid var(--gnv-primary-focus, #8e7cd8);
      outline-offset: 1px;
    }
    .error-msg {
      font-size: 0.75rem;
      line-height: 1.125rem;
      color: var(--gnv-error, #bc3737);
      font-weight: 500;
    }
  `;

  override focus(options?: FocusOptions): void {
    this.renderRoot.querySelector('input')?.focus(options);
  }

  private handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.internals?.setFormValue(this.value);
    this.dispatchEvent(
      new CustomEvent<{ value: string; name: string }>('genova-input', {
        detail: { value: this.value, name: this.name },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.internals?.setFormValue(this.value);
    this.dispatchEvent(
      new CustomEvent<{ value: string; name: string }>('genova-change', {
        detail: { value: this.value, name: this.name },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  private renderIcon() {
    if (this.icon === 'email') {
      return html`<span class="icon" aria-hidden="true">@</span>`;
    }
    if (this.icon === 'lock') {
      return html`
        <span class="icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </span>
      `;
    }
    if (this.icon === 'shield') {
      return html`
        <span class="icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          </svg>
        </span>
      `;
    }
    return '';
  }

  override render() {
    const t = createTranslator(this.locale);
    const hasToggle = this.showPasswordToggle || this.type === 'password';
    const effectiveType =
      this.type === 'password' && this.passwordVisible ? 'text' : this.type;

    return html`
      <div class="field">
        ${this.label || this.actionLabel || this.hint
          ? html`
              <div class="header">
                ${this.label ? html`<label for="control">${this.label}</label>` : html`<span></span>`}
                ${this.actionLabel
                  ? html`
                      <a class="action-link" href=${this.actionHref || '#'}>${this.actionLabel}</a>
                    `
                  : this.hint
                    ? html`<span class="hint">${this.hint}</span>`
                    : ''}
              </div>
            `
          : ''}
        <div class="wrap">
          ${this.renderIcon()}
          <input
            id="control"
            class="${this.icon !== 'none' ? 'with-icon' : ''} ${hasToggle ? 'with-action' : ''} ${this.monospace ? 'mono' : ''}"
            name=${this.name}
            type=${effectiveType}
            .value=${this.value}
            placeholder=${this.placeholder}
            autocomplete=${this.autocomplete || 'off'}
            inputmode=${this.inputmode || 'text'}
            ?required=${this.required}
            ?disabled=${this.disabled}
            aria-invalid=${this.error ? 'true' : 'false'}
            aria-describedby=${this.error ? 'error-msg' : ''}
            @input=${this.handleInput}
            @change=${this.handleChange}
          />
          ${hasToggle
            ? html`
                <button
                  type="button"
                  class="toggle"
                  aria-label=${this.passwordVisible ? t('auth.hidePassword') : t('auth.showPassword')}
                  aria-pressed=${this.passwordVisible ? 'true' : 'false'}
                  @click=${this.togglePassword}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              `
            : ''}
        </div>
        ${this.error ? html`<span id="error-msg" class="error-msg">${this.error}</span>` : ''}
      </div>
    `;
  }
}

registerCustomElement('genova-input', GenovaInputElement);
