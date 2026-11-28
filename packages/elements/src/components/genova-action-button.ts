import { LitElement, css, html } from 'lit';
import { createTranslator, type SubmissionState, type SupportedLocale } from '@genovalv/core';
import { registerCustomElement } from '../register';

export class GenovaActionButtonElement extends LitElement {
  static override properties = {
    label: { type: String },
    loadingLabel: { type: String, attribute: 'loading-label' },
    successLabel: { type: String, attribute: 'success-label' },
    state: { type: String },
    disabled: { type: Boolean },
    type: { type: String },
    locale: { type: String },
  };

  label = '';
  loadingLabel = '';
  successLabel = '';
  state: SubmissionState = 'idle';
  disabled = false;
  type: 'button' | 'submit' = 'button';
  locale: SupportedLocale = 'pt-BR';

  static override styles = css`
    :host {
      display: block;
      width: 100%;
    }
    button {
      width: 100%;
      min-height: 34.5px;
      border: 0;
      border-radius: var(--gnv-radius-md, 0.25rem);
      background: var(--gnv-primary, #715faf);
      color: var(--gnv-on-primary, #ffffff);
      padding: 0.625rem var(--gnv-space-lg, 1rem);
      font-family: var(--gnv-font-sans, 'Plus Jakarta Sans', system-ui, sans-serif);
      font-size: 0.9375rem;
      line-height: 1.375rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--gnv-space-sm, 0.5rem);
      cursor: pointer;
      box-shadow: var(--gnv-shadow-level-1, 0 1px 2px rgba(15, 23, 42, 0.04));
      transition: background-color 150ms ease, transform 100ms ease, opacity 150ms ease;
    }
    button:hover:not(:disabled) {
      background: var(--gnv-primary-hover, #3e2f73);
    }
    button:active:not(:disabled) {
      transform: scale(0.99);
    }
    button:focus-visible {
      outline: 2px solid var(--gnv-primary-focus, #8e7cd8);
      outline-offset: 2px;
    }
    button:disabled {
      opacity: 0.8;
      cursor: not-allowed;
    }
    button[data-state='success'] {
      background: var(--gnv-status-success, #3fa37c);
    }
    .spinner {
      animation: gnv-spin 1s linear infinite;
      display: inline-flex;
    }
    @keyframes gnv-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `;

  private handleClick(event: MouseEvent): void {
    if (this.disabled || this.state === 'validating') {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.dispatchEvent(
      new CustomEvent('genova-action', {
        detail: { state: this.state },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    const t = createTranslator(this.locale);
    const isValidating = this.state === 'validating';
    const isSuccess = this.state === 'success';
    const text = isValidating
      ? this.loadingLabel || t('auth.submitting')
      : isSuccess
        ? this.successLabel || t('auth.success')
        : this.label || t('auth.submit');

    return html`
      <button
        type=${this.type}
        data-state=${this.state}
        ?disabled=${this.disabled || isValidating}
        aria-busy=${isValidating ? 'true' : 'false'}
        @click=${this.handleClick}
      >
        ${isValidating
          ? html`
              <span class="spinner" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              </span>
            `
          : ''}
        <span>${text}</span>
        ${!isValidating && !isSuccess
          ? html`
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            `
          : ''}
      </button>
    `;
  }
}

registerCustomElement('genova-action-button', GenovaActionButtonElement);
