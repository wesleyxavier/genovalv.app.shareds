import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaBadgeElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: inline-flex; }
      .badge {
        display: inline-flex; align-items: center; padding: 0.15rem 0.55rem;
        border-radius: 9999px; font-size: 0.75rem; font-weight: 600;
        background: var(--gnv-primary-container, #f1eefc); color: var(--gnv-primary, #715faf);
      }
      .badge[data-variant='success'] { background: var(--gnv-status-success-bg, #e6f5ee); color: var(--gnv-status-success-text, #1f5c4a); }
      .badge[data-variant='warning'] { background: var(--gnv-status-warning-bg, #fef3c7); color: var(--gnv-status-warning, #92400e); }
      .badge[data-variant='error'] { background: var(--gnv-error-container, #fef2f2); color: var(--gnv-error, #bc3737); }
      .badge[data-variant='neutral'] { background: var(--gnv-surface-muted, #f1f5f9); color: var(--gnv-text-secondary, #475569); }
    `,
  ];

  @property({ type: String }) variant: 'primary' | 'success' | 'warning' | 'error' | 'neutral' = 'primary';

  override render() {
    return html`<span class="badge" data-variant=${this.variant}><slot></slot></span>`;
  }
}
