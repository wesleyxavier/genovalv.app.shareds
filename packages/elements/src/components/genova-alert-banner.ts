import { LitElement, css, html } from 'lit';
import { registerCustomElement } from '../register';

export type AlertVariant = 'error' | 'success' | 'warning' | 'info';

export class GenovaAlertBannerElement extends LitElement {
  static override properties = {
    variant: { type: String },
    message: { type: String },
    visible: { type: Boolean },
  };

  variant: AlertVariant = 'info';
  message = '';
  visible = false;

  static override styles = css`
    :host {
      display: block;
      width: 100%;
    }
    .banner {
      padding: var(--gnv-space-sm, 0.5rem) var(--gnv-space-md, 0.75rem);
      border-radius: var(--gnv-radius-md, 0.25rem);
      font-size: 0.75rem;
      line-height: 1.125rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: var(--gnv-space-sm, 0.5rem);
      border: 1px solid transparent;
    }
    .banner[data-variant='error'] {
      background: var(--gnv-error-container, #ffdad6);
      color: var(--gnv-on-error-container, #93000a);
      border-color: rgba(186, 26, 26, 0.25);
    }
    .banner[data-variant='success'] {
      background: #ecfdf5;
      color: #047857;
      border-color: #a7f3d0;
    }
    .banner[data-variant='warning'] {
      background: #fef3c7;
      color: #b45309;
      border-color: #fde68a;
    }
    .banner[data-variant='info'] {
      background: var(--gnv-surface-container-low, #eff4ff);
      color: var(--gnv-on-surface, #0b1c30);
      border-color: var(--gnv-surface-container, #e5eeff);
    }
  `;

  override render() {
    if (!this.visible || !this.message) {
      return html``;
    }
    const role = this.variant === 'error' ? 'alert' : 'status';
    return html`
      <div class="banner" data-variant=${this.variant} role=${role} aria-live="polite">
        <span>${this.message}</span>
      </div>
    `;
  }
}

registerCustomElement('genova-alert-banner', GenovaAlertBannerElement);
