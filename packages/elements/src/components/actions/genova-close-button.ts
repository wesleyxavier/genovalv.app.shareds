import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaCloseButtonElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: inline-flex; }
      button {
        display: inline-flex; align-items: center; justify-content: center;
        width: 2rem; height: 2rem; border-radius: 0.5rem; border: 1px solid transparent;
        background: transparent; color: var(--gnv-on-surface-variant, #475569); cursor: pointer;
        font-size: 1rem; line-height: 1;
      }
      button:hover:not(:disabled) { background: var(--gnv-surface-container, #eeebe4); color: var(--gnv-on-surface, #0f172a); }
      button:disabled { opacity: 0.5; cursor: not-allowed; }
    `,
  ];

  @property({ type: String }) label = 'Fechar';
  @property({ type: Boolean }) disabled = false;

  override render() {
    return html`<button type="button" aria-label=${this.label} ?disabled=${this.disabled}
      @click=${() => this.dispatchEvent(new CustomEvent('genova-close', { bubbles: true, composed: true }))}>✕</button>`;
  }
}
