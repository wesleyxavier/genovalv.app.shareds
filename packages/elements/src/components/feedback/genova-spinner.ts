import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaSpinnerElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: inline-flex; }
      .spin {
        border-radius: 9999px; border: 2.5px solid var(--gnv-outline-variant, #e7e2d8);
        border-top-color: var(--gnv-primary, #4c3a8a); animation: spin 0.7s linear infinite;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
    `,
  ];

  @property({ type: Number }) size = 24;

  override render() {
    return html`<div class="spin" role="status" aria-label="Carregando" style=${`width:${this.size}px;height:${this.size}px`}></div>`;
  }
}
