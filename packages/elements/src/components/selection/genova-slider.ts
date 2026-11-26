import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaSliderElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: block; }
      .row { display: flex; align-items: center; gap: 0.75rem; }
      input { flex: 1; accent-color: var(--gnv-primary, #4c3a8a); }
      .val { font-size: 0.8125rem; font-weight: 600; min-width: 2rem; text-align: right; }
    `,
  ];

  @property({ type: Number }) value = 50;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;

  override render() {
    return html`
      <div class="row">
        <input type="range" min=${this.min} max=${this.max} step=${this.step} .value=${String(this.value)}
          @input=${(e: Event) => {
            this.value = Number((e.target as HTMLInputElement).value);
            this.dispatchEvent(new CustomEvent('genova-change', { detail: { value: this.value }, bubbles: true, composed: true }));
          }} />
        <span class="val">${this.value}</span>
      </div>
    `;
  }
}
