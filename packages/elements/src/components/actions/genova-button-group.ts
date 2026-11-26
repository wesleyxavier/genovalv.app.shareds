import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaButtonGroupElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: inline-flex; }
      .group { display: inline-flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; }
      .group[data-attached] { gap: 0; }
      .group[data-attached] ::slotted(*) { border-radius: 0; }
    `,
  ];

  @property({ type: Boolean }) attached = false;

  override render() {
    return html`<div class="group" role="group" ?data-attached=${this.attached}><slot></slot></div>`;
  }
}
