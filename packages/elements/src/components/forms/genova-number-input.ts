import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaNumberInputElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: inline-flex; }
      .wrap { display: inline-flex; border: 1px solid var(--gnv-outline-variant, #e7e2d8); border-radius: 0.5rem; background: #fff; overflow: hidden; }
      input { width: 5rem; border: 0; text-align: center; font-family: inherit; font-size: 0.875rem; padding: 0.45rem; outline: none; }
      button { width: 2rem; border: 0; background: var(--gnv-surface-container, #eeebe4); cursor: pointer; font-weight: 700; }
      button:hover:not(:disabled) { background: var(--gnv-primary-container, #f1eefc); }
    `,
  ];

  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = -Infinity;
  @property({ type: Number }) max = Infinity;
  @property({ type: Number }) step = 1;
  @property({ type: Boolean }) disabled = false;

  private updateVal(next: number) {
    const safe = Number.isFinite(next) ? next : this.min > -Infinity ? this.min : 0;
    const clamped = Math.min(this.max, Math.max(this.min, safe));
    this.value = clamped;
    this.dispatchEvent(new CustomEvent('genova-change', { detail: { value: clamped }, bubbles: true, composed: true }));
  }

  private onKeyDown(e: KeyboardEvent): void {
    if (this.min >= 0 && (e.key === '-' || e.key === 'e' || e.key === 'E')) e.preventDefault();
  }

  override render() {
    return html`
      <div class="wrap">
        <button type="button" aria-label="Diminuir" ?disabled=${this.disabled || this.value <= this.min} @click=${() => this.updateVal(this.value - this.step)}>−</button>
        <input type="number" .value=${String(this.value)} min=${this.min > -Infinity ? String(this.min) : ''} ?disabled=${this.disabled}
          @keydown=${this.onKeyDown} @change=${(e: Event) => this.updateVal(Number((e.target as HTMLInputElement).value))} />
        <button type="button" aria-label="Aumentar" ?disabled=${this.disabled || this.value >= this.max} @click=${() => this.updateVal(this.value + this.step)}>+</button>
      </div>
    `;
  }
}
