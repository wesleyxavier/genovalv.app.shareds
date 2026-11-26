import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaPseudoBoxElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: block; }
      .pbox {
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        border: 1px solid var(--gnv-outline-variant, #e7e2d8);
        background: #fff;
        transition: background-color 0.15s ease, border-color 0.15s ease, transform 0.12s ease;
        cursor: pointer;
      }
      .pbox:hover { background: var(--gnv-primary-container, #f1eefc); border-color: var(--gnv-primary-border, #cfc4f5); }
      .pbox:active { transform: scale(0.99); }
      .pbox[data-disabled] { opacity: 0.5; pointer-events: none; }
    `,
  ];

  @property({ type: Boolean }) disabled = false;

  override render() {
    return html`<div class="pbox" ?data-disabled=${this.disabled} tabindex=${this.disabled ? -1 : 0}><slot></slot></div>`;
  }
}
