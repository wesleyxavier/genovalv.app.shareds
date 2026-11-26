import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaTagElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: inline-flex; }
      .tag {
        display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.2rem 0.6rem;
        border-radius: 0.375rem; font-size: 0.75rem; font-weight: 600;
        background: var(--gnv-surface-container, #eeebe4); color: var(--gnv-on-surface, #0f172a);
      }
      button { border: 0; background: transparent; padding: 0; cursor: pointer; font-size: 0.75rem; color: inherit; }
    `,
  ];

  @property({ type: String }) label = '';
  @property({ type: Boolean }) removable = false;

  override render() {
    return html`
      <span class="tag">
        <span>${this.label}<slot></slot></span>
        ${this.removable ? html`<button type="button" aria-label="Remover" @click=${() => this.dispatchEvent(new CustomEvent('genova-remove', { bubbles: true, composed: true }))}>âœ•</button>` : ''}
      </span>
    `;
  }
}
