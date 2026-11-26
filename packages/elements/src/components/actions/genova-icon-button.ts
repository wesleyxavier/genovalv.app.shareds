import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaIconButtonElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: inline-flex; }
      button {
        display: inline-flex; align-items: center; justify-content: center;
        width: 2.25rem; height: 2.25rem; border-radius: 0.5rem;
        border: 1px solid var(--gnv-outline-variant, #e7e2d8);
        background: #fff; color: var(--gnv-on-surface, #0f172a); cursor: pointer;
      }
      button[data-variant='solid'] { background: var(--gnv-primary, #715faf); border-color: var(--gnv-primary, #715faf); color: #fff; }
      button:hover:not(:disabled) { filter: brightness(0.95); }
      button:disabled { opacity: 0.5; cursor: not-allowed; }
    `,
  ];

  @property({ type: String }) override ariaLabel = 'Ação';
  @property({ type: String }) variant: 'outline' | 'solid' = 'outline';
  @property({ type: Boolean }) disabled = false;

  override render() {
    return html`<button type="button" data-variant=${this.variant} aria-label=${this.ariaLabel} ?disabled=${this.disabled}
      @click=${() => this.dispatchEvent(new CustomEvent('genova-press', { bubbles: true, composed: true }))}><slot></slot></button>`;
  }
}
