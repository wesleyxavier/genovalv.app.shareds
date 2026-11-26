import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaModalElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      .backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.45); display: flex; align-items: center; justify-content: center; padding: 1rem; z-index: 50; }
      .modal { width: 100%; max-width: 30rem; background: #fff; border-radius: 0.875rem; border: 1px solid var(--gnv-outline-variant, #e7e2d8); padding: 1.25rem; box-shadow: 0 20px 40px rgba(15, 23, 42, 0.16); }
      .head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
      h3 { margin: 0; font-size: 1.0625rem; font-weight: 700; }
      button { border: 0; background: transparent; cursor: pointer; font-size: 1rem; }
    `,
  ];

  @property({ type: Boolean }) open = false;
  @property({ type: String }) override title = '';

  override render() {
    if (!this.open) return html``;
    return html`
      <div class="backdrop">
        <div class="modal" role="dialog" aria-modal="true">
          <div class="head">
            <h3>${this.title}</h3>
            <button type="button" aria-label="Fechar" @click=${() => {
              this.open = false;
              this.dispatchEvent(new CustomEvent('genova-close', { bubbles: true, composed: true }));
            }}>✕</button>
          </div>
          <div><slot></slot></div>
        </div>
      </div>
    `;
  }
}
