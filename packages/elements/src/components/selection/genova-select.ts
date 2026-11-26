import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaSelectElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: block; }
      select {
        width: 100%; padding: 0.55rem 0.75rem; border-radius: 0.5rem; font-family: inherit; font-size: 0.875rem;
        border: 1px solid var(--gnv-outline-variant, #e7e2d8); background: #fff; color: var(--gnv-on-surface, #0f172a);
      }
    `,
  ];

  @property({ type: Array }) options: Array<{ label: string; value: string }> = [];
  @property({ type: String }) value = '';
  @property({ type: String }) placeholder = 'Selecione...';
  @property({ type: Boolean }) disabled = false;

  override render() {
    return html`
      <select .value=${this.value} ?disabled=${this.disabled}
        @change=${(e: Event) => {
          this.value = (e.target as HTMLSelectElement).value;
          this.dispatchEvent(new CustomEvent('genova-change', { detail: { value: this.value }, bubbles: true, composed: true }));
        }}>
        <option value="" disabled ?selected=${!this.value}>${this.placeholder}</option>
        ${this.options.map((o) => html`<option value=${o.value} ?selected=${o.value === this.value}>${o.label}</option>`)}
      </select>
    `;
  }
}
