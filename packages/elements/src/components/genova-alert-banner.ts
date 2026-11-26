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
      background: var(--gnv-error-container, #fef2f2);
      color: var(--gnv-on-error-container, #bc3737);
      border-color: rgba(188, 55, 55, 0.28);
    }
    .banner[data-variant='success'] {
      background: var(--gnv-status-success-bg, #e6f5ee);
      color: var(--gnv-status-success-text, #1f5c4a);
      border-color: var(--gnv-status-success-border, #a8dfc6);
    }
    .banner[data-variant='warning'] {
      background: var(--gnv-status-warning-bg, #fef3c7);
      color: var(--gnv-status-warning, #92400e);
      border-color: #fde68a;
    }
    .banner[data-variant='info'] {
      background: var(--gnv-primary-container, #f1eefc);
      color: var(--gnv-on-surface, #0f172a);
      border-color: var(--gnv-primary-border, #cfc4f5);
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
