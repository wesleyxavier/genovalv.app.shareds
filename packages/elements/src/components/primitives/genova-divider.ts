import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaDividerElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: block; }
      .line { border: 0; border-top: 1px solid var(--gnv-outline-variant, #e7e2d8); margin: 0; }
      :host([orientation='vertical']) { display: inline-block; height: 100%; }
      .line[data-orientation='vertical'] { border-top: 0; border-left: 1px solid var(--gnv-outline-variant, #e7e2d8); height: 100%; min-height: 1.25rem; }
      .wrap { display: flex; align-items: center; gap: 0.75rem; color: var(--gnv-text-muted, #64748b); font-size: 0.75rem; }
      .wrap .line { flex: 1; }
    `,
  ];

  @property({ type: String, reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';
  @property({ type: String }) label = '';

  override render() {
    if (this.orientation === 'vertical') {
      return html`<hr class="line" data-orientation="vertical" aria-orientation="vertical" />`;
    }
    if (this.label) {
      return html`<div class="wrap" role="separator"><hr class="line" /><span>${this.label}</span><hr class="line" /></div>`;
    }
    return html`<hr class="line" role="separator" />`;
  }
}
