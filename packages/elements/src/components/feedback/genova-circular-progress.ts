import { LitElement, css, html, svg } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaCircularProgressElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: inline-flex; position: relative; align-items: center; justify-content: center; }
      .label { position: absolute; font-size: 0.75rem; font-weight: 700; }
    `,
  ];

  @property({ type: Number }) value = 65;
  @property({ type: Number }) size = 56;

  override render() {
    const pct = Math.min(100, Math.max(0, this.value));
    const r = 22;
    const c = 2 * Math.PI * r;
    const offset = c - (pct / 100) * c;
    return html`
      <svg width=${this.size} height=${this.size} viewBox="0 0 56 56" role="progressbar" aria-valuenow=${pct} aria-valuemin="0" aria-valuemax="100">
        ${svg`<circle cx="28" cy="28" r=${r} fill="none" stroke="#e7e2d8" stroke-width="5" />`}
        ${svg`<circle cx="28" cy="28" r=${r} fill="none" stroke="var(--gnv-primary, #715faf)" stroke-width="5" stroke-linecap="round" stroke-dasharray=${c} stroke-dashoffset=${offset} transform="rotate(-90 28 28)" />`}
      </svg>
      <span class="label">${pct}%</span>
    `;
  }
}
