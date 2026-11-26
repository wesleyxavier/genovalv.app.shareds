import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaButtonElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: inline-block; }
      button {
        display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
        border-radius: 0.5rem; font-family: inherit; font-weight: 600; cursor: pointer;
        border: 1px solid transparent; transition: background-color 0.15s ease, border-color 0.15s ease;
      }
      button[data-size='sm'] { padding: 0.375rem 0.75rem; font-size: 0.75rem; }
      button[data-size='md'] { padding: 0.55rem 1rem; font-size: 0.875rem; }
      button[data-size='lg'] { padding: 0.75rem 1.35rem; font-size: 1rem; }
      button[data-variant='solid'] { background: var(--gnv-primary, #715faf); color: #fff; }
      button[data-variant='solid']:hover:not(:disabled) { background: var(--gnv-primary-hover, #3e2f73); }
      button[data-variant='outline'] { background: #fff; color: var(--gnv-primary, #715faf); border-color: var(--gnv-primary-border, #cfc4f5); }
      button[data-variant='outline']:hover:not(:disabled) { background: var(--gnv-primary-container, #f1eefc); }
      button[data-variant='ghost'] { background: transparent; color: var(--gnv-on-surface, #0f172a); }
      button[data-variant='ghost']:hover:not(:disabled) { background: var(--gnv-surface-container, #eeebe4); }
      button[data-variant='danger'] { background: var(--gnv-error, #bc3737); color: #fff; }
      button:disabled { opacity: 0.55; cursor: not-allowed; }
    `,
  ];

  @property({ type: String }) variant: 'solid' | 'outline' | 'ghost' | 'danger' = 'solid';
  @property({ type: String }) size: 'sm' | 'md' | 'lg' = 'md';
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) loading = false;
  @property({ type: String }) type: 'button' | 'submit' | 'reset' = 'button';

  override render() {
    return html`
      <button type=${this.type} data-variant=${this.variant} data-size=${this.size} ?disabled=${this.disabled || this.loading}
        @click=${() => this.dispatchEvent(new CustomEvent('genova-press', { bubbles: true, composed: true }))}>
        ${this.loading ? html`<span>...</span>` : ''}<slot></slot>
      </button>
    `;
  }
}
