import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaLinkElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: inline-block; }
      a { color: var(--gnv-primary, #4c3a8a); font-weight: 500; text-decoration: none; }
      a:hover { text-decoration: underline; color: var(--gnv-primary-hover, #3e2f73); }
    `,
  ];

  @property({ type: String }) href = '#';
  @property({ type: Boolean }) external = false;

  override render() {
    return html`<a href=${this.href} target=${this.external ? '_blank' : '_self'} rel=${this.external ? 'noopener noreferrer' : ''}><slot></slot></a>`;
  }
}
