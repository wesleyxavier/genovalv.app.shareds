import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaProgressElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: block; }
      .track { width: 100%; height: 0.5rem; border-radius: 9999px; background: var(--gnv-surface-container-high, #e7e2d8); overflow: hidden; }
      .fill { height: 100%; background: var(--gnv-primary, #4c3a8a); transition: width 0.2s ease; }
    `,
  ];

  @property({ type: Number }) value = 50;

  override render() {
    const pct = Math.min(100, Math.max(0, this.value));
    return html`<div class="track" role="progressbar" aria-valuenow=${pct} aria-valuemin="0" aria-valuemax="100"><div class="fill" style=${`width:${pct}%`}></div></div>`;
  }
}
