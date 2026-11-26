import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaAccordionElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: block; }
      .wrap { border: 1px solid var(--gnv-outline-variant, #e7e2d8); border-radius: 0.75rem; background: #fff; overflow: hidden; }
      .item + .item { border-top: 1px solid var(--gnv-outline-variant, #e7e2d8); }
      button {
        width: 100%; display: flex; justify-content: space-between; align-items: center;
        padding: 0.875rem 1rem; border: 0; background: transparent; font-family: inherit;
        font-size: 0.875rem; font-weight: 600; text-align: left; cursor: pointer;
      }
      .body { padding: 0 1rem 0.875rem; font-size: 0.8125rem; color: var(--gnv-on-surface-variant, #475569); }
    `,
  ];

  @property({ type: Array }) items: Array<{ id: string; title: string; content: string }> = [];
  @property({ type: String }) openId = '';

  override render() {
    return html`
      <div class="wrap">
        ${this.items.map((item) => {
          const isOpen = this.openId === item.id;
          return html`
            <div class="item">
              <button type="button" aria-expanded=${String(isOpen)} @click=${() => { this.openId = isOpen ? '' : item.id; }}>
                <span>${item.title}</span><span>${isOpen ? 'âˆ’' : '+'}</span>
              </button>
              ${isOpen ? html`<div class="body">${item.content}</div>` : ''}
            </div>
          `;
        })}
      </div>
    `;
  }
}
