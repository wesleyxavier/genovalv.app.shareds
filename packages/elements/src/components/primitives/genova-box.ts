import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaBoxElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: block; }
      .box { background: var(--box-bg, var(--gnv-surface-container-lowest, #fff)); border: 1px solid var(--box-border, var(--gnv-outline-variant, #e7e2d8)); border-radius: var(--box-radius, 0.75rem); padding: var(--box-pad, 1rem); }
      .box[data-variant='muted'] { background: var(--gnv-surface-container, #eeebe4); }
      .box[data-variant='tint'] { background: var(--gnv-primary-container, #f1eefc); border-color: var(--gnv-primary-border, #cfc4f5); }
    `,
  ];

  @property({ type: String }) variant: 'surface' | 'muted' | 'tint' = 'surface';
  @property({ type: String }) padding = '';

  override render() {
    const style = this.padding ? `padding:${this.padding}` : '';
    return html`<div class="box" data-variant=${this.variant} style=${style}><slot></slot></div>`;
  }
}
