import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaFormControlElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: flex; flex-direction: column; gap: 0.375rem; }
      label { font-size: 0.8125rem; font-weight: 600; color: var(--gnv-on-surface, #0f172a); }
      .req { color: var(--gnv-error, #bc3737); margin-left: 0.15rem; }
      .hint { font-size: 0.75rem; color: var(--gnv-text-muted, #64748b); }
      .error { font-size: 0.75rem; color: var(--gnv-error, #bc3737); font-weight: 500; }
    `,
  ];

  @property({ type: String }) label = '';
  @property({ type: String }) hint = '';
  @property({ type: String }) error = '';
  @property({ type: Boolean }) required = false;

  override render() {
    return html`
      ${this.label ? html`<label>${this.label}${this.required ? html`<span class="req">*</span>` : ''}</label>` : ''}
      <slot></slot>
      ${this.error ? html`<span class="error" role="alert">${this.error}</span>` : this.hint ? html`<span class="hint">${this.hint}</span>` : ''}
    `;
  }
}
