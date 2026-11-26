import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaControlBoxElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: inline-flex; }
      .cbox {
        display: inline-flex; align-items: center; justify-content: center;
        width: 1.25rem; height: 1.25rem; border-radius: 0.375rem;
        border: 1.5px solid var(--gnv-outline, #857f93); background: #fff; color: #fff;
        transition: all 0.15s ease;
      }
      .cbox[data-shape='circle'] { border-radius: 9999px; }
      .cbox[data-checked] { background: var(--gnv-primary, #4c3a8a); border-color: var(--gnv-primary, #4c3a8a); }
      .cbox[data-disabled] { opacity: 0.5; }
    `,
  ];

  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) shape: 'square' | 'circle' = 'square';

  override render() {
    return html`<span class="cbox" data-shape=${this.shape} ?data-checked=${this.checked} ?data-disabled=${this.disabled}><slot></slot></span>`;
  }
}
