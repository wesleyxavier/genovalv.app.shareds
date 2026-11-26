import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaMenuElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: inline-block; position: relative; }
      .trigger {
        padding: 0.5rem 0.9rem; border-radius: 0.5rem; border: 1px solid var(--gnv-outline-variant, #e7e2d8);
        background: #fff; font-family: inherit; font-size: 0.875rem; font-weight: 600; cursor: pointer;
      }
      .list {
        position: absolute; top: calc(100% + 0.375rem); left: 0; min-width: 11rem; z-index: 20;
        background: #fff; border: 1px solid var(--gnv-outline-variant, #e7e2d8); border-radius: 0.625rem;
        padding: 0.25rem; box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
      }
      .item {
        display: block; width: 100%; text-align: left; border: 0; background: transparent;
        padding: 0.5rem 0.75rem; border-radius: 0.375rem; font-family: inherit; font-size: 0.8125rem; cursor: pointer;
      }
      .item:hover { background: var(--gnv-primary-container, #f1eefc); color: var(--gnv-primary, #4c3a8a); }
    `,
  ];

  @property({ type: String }) label = 'OpÃ§Ãµes';
  @property({ type: Array }) items: Array<{ id: string; label: string }> = [];
  @property({ type: Boolean }) open = false;

  override render() {
    return html`
      <button type="button" class="trigger" aria-expanded=${String(this.open)} @click=${() => { this.open = !this.open; }}>${this.label} â–¾</button>
      ${this.open ? html`
        <div class="list" role="menu">
          ${this.items.map((item) => html`
            <button type="button" class="item" role="menuitem" @click=${() => {
              this.open = false;
              this.dispatchEvent(new CustomEvent('genova-select', { detail: { id: item.id }, bubbles: true, composed: true }));
            }}>${item.label}</button>
          `)}
        </div>
      ` : ''}
    `;
  }
}
