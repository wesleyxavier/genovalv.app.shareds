import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaStatsElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: block; }
      .card { padding: 1rem 1.25rem; border-radius: 0.75rem; border: 1px solid var(--gnv-outline-variant, #e7e2d8); background: #fff; }
      .label { font-size: 0.75rem; font-weight: 600; color: var(--gnv-text-muted, #64748b); }
      .val { font-size: 1.5rem; font-weight: 700; margin: 0.25rem 0; color: var(--gnv-on-surface, #0f172a); }
      .help { font-size: 0.75rem; color: var(--gnv-status-success-text, #1f5c4a); }
    `,
  ];

  @property({ type: String }) label = '';
  @property({ type: String }) value = '';
  @property({ type: String }) helpText = '';

  override render() {
    return html`
      <div class="card">
        <div class="label">${this.label}</div>
        <div class="val">${this.value}</div>
        ${this.helpText ? html`<div class="help">${this.helpText}</div>` : ''}
      </div>
    `;
  }
}
