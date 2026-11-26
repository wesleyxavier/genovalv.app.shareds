import { LitElement, css, html } from 'lit';
import { getMfaGuidance, type MfaMethod, type SupportedLocale } from '@genovalv/core';
import { registerCustomElement } from '../register';

const METHODS: MfaMethod[] = ['totp', 'yubikey', 'biometric'];

export class GenovaMfaSelectorElement extends LitElement {
  static override properties = {
    selectedMethod: { type: String, attribute: 'selected-method' },
    locale: { type: String },
  };

  selectedMethod: MfaMethod = 'totp';
  locale: SupportedLocale = 'pt-BR';

  static override styles = css`
    :host {
      display: block;
      width: 100%;
    }
    :host([hidden]) {
      display: none;
    }
    .wrap {
      display: flex;
      flex-direction: column;
      gap: var(--gnv-space-sm, 0.5rem);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--gnv-space-xs, 0.25rem);
    }
    button.option {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.375rem;
      padding: 0.45rem 0.5rem;
      border-radius: var(--gnv-radius-md, 0.25rem);
      border: 1px solid var(--gnv-outline-variant, #e7e2d8);
      background: var(--gnv-surface-container-lowest, #ffffff);
      color: var(--gnv-on-surface, #0f172a);
      font-family: var(--gnv-font-sans, 'Plus Jakarta Sans', system-ui, sans-serif);
      font-size: 0.6875rem;
      font-weight: 600;
      cursor: pointer;
    }
    button.option[aria-pressed='true'] {
      background: var(--gnv-primary-container, #f1eefc);
      border-color: var(--gnv-primary, #715faf);
      color: var(--gnv-on-primary-container, #31255c);
    }
    button.option:focus-visible {
      outline: 2px solid var(--gnv-primary-focus, #8e7cd8);
      outline-offset: 1px;
    }
    .guidance {
      padding: var(--gnv-space-sm, 0.5rem) var(--gnv-space-md, 0.75rem);
      border-radius: var(--gnv-radius-md, 0.25rem);
      background: var(--gnv-surface-container, #eeebe4);
      border: 1px solid var(--gnv-outline-variant, #e7e2d8);
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }
    .guidance-title {
      font-size: 0.6875rem;
      font-weight: 600;
      color: var(--gnv-on-surface, #0f172a);
    }
    .guidance-hint {
      font-family: var(--gnv-font-mono, 'JetBrains Mono', monospace);
      font-size: 0.6875rem;
      color: var(--gnv-on-surface-variant, #475569);
    }
  `;

  private selectMethod(method: MfaMethod): void {
    this.selectedMethod = method;
    const guidance = getMfaGuidance(method, this.locale);
    this.dispatchEvent(
      new CustomEvent('genova-mfa-method-change', {
        detail: { method, guidance },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    const activeGuidance = getMfaGuidance(this.selectedMethod, this.locale);

    return html`
      <div class="wrap">
        <div class="grid" role="group" aria-label=${activeGuidance.label}>
          ${METHODS.map((method) => {
            const info = getMfaGuidance(method, this.locale);
            const active = this.selectedMethod === method;
            return html`
              <button
                type="button"
                class="option"
                data-method=${method}
                aria-pressed=${active ? 'true' : 'false'}
                @click=${() => this.selectMethod(method)}
              >
                <span>${info.label}</span>
              </button>
            `;
          })}
        </div>
        <div class="guidance">
          <span class="guidance-title">${activeGuidance.title}</span>
          <span class="guidance-hint">${activeGuidance.hint}</span>
        </div>
      </div>
    `;
  }
}

registerCustomElement('genova-mfa-selector', GenovaMfaSelectorElement);
