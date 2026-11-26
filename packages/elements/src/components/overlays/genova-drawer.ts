import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaDrawerElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      .backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.45); display: flex; justify-content: flex-end; z-index: 50; }
      .backdrop[data-placement='left'] { justify-content: flex-start; }
      .panel { width: 100%; max-width: 24rem; height: 100%; background: #fff; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; box-shadow: -8px 0 24px rgba(15, 23, 42, 0.12); }
      .head { display: flex; justify-content: space-between; align-items: center; }
      h3 { margin: 0; font-size: 1rem; font-weight: 700; }
      button { border: 0; background: transparent; cursor: pointer; font-size: 1rem; }
    `,
  ];

  @property({ type: Boolean }) open = false;
  @property({ type: String }) override title = '';
  @property({ type: String }) placement: 'left' | 'right' = 'right';

  override render() {
    if (!this.open) return html``;
    return html`
      <div class="backdrop" data-placement=${this.placement}>
        <aside class="panel" role="dialog" aria-modal="true">
          <div class="head">
            <h3>${this.title}</h3>
            <button type="button" aria-label="Fechar" @click=${() => {
              this.open = false;
              this.dispatchEvent(new CustomEvent('genova-close', { bubbles: true, composed: true }));
            }}>✕</button>
          </div>
          <div><slot></slot></div>
        </aside>
      </div>
    `;
  }
}
