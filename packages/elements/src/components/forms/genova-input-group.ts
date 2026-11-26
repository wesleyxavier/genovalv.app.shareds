import { LitElement, css, html } from 'lit';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaInputGroupElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: block; }
      .wrap {
        display: flex; align-items: stretch; border: 1px solid var(--gnv-outline-variant, #e7e2d8);
        border-radius: 0.5rem; background: #fff; overflow: hidden;
      }
      .addon { display: inline-flex; align-items: center; padding: 0 0.75rem; background: var(--gnv-surface-container, #eeebe4); font-size: 0.8125rem; color: var(--gnv-on-surface-variant, #475569); }
      .main { flex: 1; min-width: 0; }
      ::slotted(input) { border: 0; width: 100%; padding: 0.5rem 0.75rem; font-family: inherit; outline: none; }
    `,
  ];

  override render() {
    return html`
      <div class="wrap">
        <span class="addon"><slot name="prefix"></slot></span>
        <div class="main"><slot></slot></div>
        <span class="addon"><slot name="suffix"></slot></span>
      </div>
    `;
  }
}
