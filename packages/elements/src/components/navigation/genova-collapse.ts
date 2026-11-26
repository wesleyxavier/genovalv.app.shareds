import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaCollapseElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: block; }
      .box { padding: 0.75rem 1rem; border-radius: 0.5rem; background: var(--gnv-surface-container, #eeebe4); font-size: 0.875rem; }
    `,
  ];

  @property({ type: Boolean }) open = false;

  override render() {
    return this.open ? html`<div class="box"><slot></slot></div>` : html``;
  }
}
