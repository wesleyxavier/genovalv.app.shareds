import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaSkeletonElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: block; }
      .sk {
        background: linear-gradient(90deg, #eeebe4 25%, #e7e2d8 50%, #eeebe4 75%);
        background-size: 200% 100%; border-radius: 0.5rem; animation: pulse 1.4s ease infinite;
      }
      @keyframes pulse { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    `,
  ];

  @property({ type: String }) width = '100%';
  @property({ type: String }) height = '1rem';

  override render() {
    return html`<div class="sk" aria-busy="true" style=${`width:${this.width};height:${this.height}`}></div>`;
  }
}
