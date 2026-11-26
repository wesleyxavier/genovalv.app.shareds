import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaAlertElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: block; }
      .alert { padding: 0.75rem 1rem; border-radius: 0.625rem; border: 1px solid var(--gnv-primary-border, #cfc4f5); background: var(--gnv-primary-container, #f1eefc); font-size: 0.875rem; }
      .alert[data-status='success'] { background: var(--gnv-status-success-bg, #e6f5ee); border-color: var(--gnv-status-success-border, #a8dfc6); color: var(--gnv-status-success-text, #1f5c4a); }
      .alert[data-status='warning'] { background: var(--gnv-status-warning-bg, #fef3c7); border-color: #fde68a; color: var(--gnv-status-warning, #92400e); }
      .alert[data-status='error'] { background: var(--gnv-error-container, #fef2f2); border-color: #fecaca; color: var(--gnv-error, #bc3737); }
      .title { font-weight: 700; margin-bottom: 0.125rem; }
    `,
  ];

  @property({ type: String }) status: 'info' | 'success' | 'warning' | 'error' = 'info';
  @property({ type: String }) override title = '';

  override render() {
    return html`
      <div class="alert" role="alert" data-status=${this.status}>
        ${this.title ? html`<div class="title">${this.title}</div>` : ''}
        <slot></slot>
      </div>
    `;
  }
}
