import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaHeadingElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: block; }
      .h { margin: 0; font-weight: 700; letter-spacing: -0.02em; color: var(--gnv-on-surface, #0f172a); line-height: 1.25; }
      .h[data-size='xs'] { font-size: 0.875rem; }
      .h[data-size='sm'] { font-size: 1rem; }
      .h[data-size='md'] { font-size: 1.25rem; }
      .h[data-size='lg'] { font-size: 1.5rem; }
      .h[data-size='xl'] { font-size: 2rem; }
    `,
  ];

  @property({ type: String }) size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'lg';
  @property({ type: Number }) level = 2;

  override render() {
    return html`<div class="h" role="heading" aria-level=${this.level} data-size=${this.size}><slot></slot></div>`;
  }
}
