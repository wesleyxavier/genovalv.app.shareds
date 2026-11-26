import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaToastElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: block; }
      .toast {
        display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;
        padding: 0.75rem 1rem; border-radius: 0.625rem; background: var(--gnv-on-surface, #0f172a);
        color: #fff; font-size: 0.875rem; box-shadow: 0 10px 24px rgba(15, 23, 42, 0.16);
      }
      .toast[data-status='success'] { background: var(--gnv-status-success-text, #1f5c4a); }
      .toast[data-status='error'] { background: var(--gnv-error, #b91c1c); }
      button { border: 0; background: transparent; color: inherit; cursor: pointer; font-size: 0.875rem; }
    `,
  ];

  @property({ type: String }) message = '';
  @property({ type: String }) status: 'info' | 'success' | 'error' = 'info';
  @property({ type: Boolean }) open = true;

  override render() {
    if (!this.open) return html``;
    return html`
      <div class="toast" role="status" data-status=${this.status}>
        <span>${this.message}<slot></slot></span>
        <button type="button" aria-label="Fechar" @click=${() => {
          this.open = false;
          this.dispatchEvent(new CustomEvent('genova-close', { bubbles: true, composed: true }));
        }}>âœ•</button>
      </div>
    `;
  }
}
