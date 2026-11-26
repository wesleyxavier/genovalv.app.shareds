import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaRadioElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: inline-flex; }
      label { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; cursor: pointer; }
      input { accent-color: var(--gnv-primary, #4c3a8a); width: 1rem; height: 1rem; }
    `,
  ];

  @property({ type: String }) name = 'radio';
  @property({ type: String }) value = '';
  @property({ type: String }) label = '';
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean }) disabled = false;

  override render() {
    return html`
      <label>
        <input type="radio" name=${this.name} .value=${this.value} .checked=${this.checked} ?disabled=${this.disabled}
          @change=${() => {
            this.checked = true;
            this.dispatchEvent(new CustomEvent('genova-change', { detail: { value: this.value }, bubbles: true, composed: true }));
          }} />
        <span>${this.label}<slot></slot></span>
      </label>
    `;
  }
}
