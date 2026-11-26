import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaListElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: block; }
      ul, ol { margin: 0; padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.375rem; font-size: 0.875rem; }
      ul[data-plain] { list-style: none; padding-left: 0; }
    `,
  ];

  @property({ type: Array }) items: string[] = [];
  @property({ type: Boolean }) ordered = false;
  @property({ type: Boolean }) plain = false;

  override render() {
    const content = this.items.map((item) => html`<li>${item}</li>`);
    return this.ordered ? html`<ol>${content}<slot></slot></ol>` : html`<ul ?data-plain=${this.plain}>${content}<slot></slot></ul>`;
  }
}
