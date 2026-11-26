import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaTextareaElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: block; }
      textarea {
        width: 100%; min-height: 5.5rem; padding: 0.625rem 0.75rem; border-radius: 0.5rem;
        border: 1px solid var(--gnv-outline-variant, #e7e2d8); background: #fff;
        font-family: inherit; font-size: 0.875rem; resize: vertical;
      }
      textarea[data-invalid] { border-color: var(--gnv-error, #bc3737); }
    `,
  ];

  @property({ type: String }) value = '';
  @property({ type: String }) placeholder = '';
  @property({ type: Number }) rows = 3;
  @property({ type: Boolean }) invalid = false;
  @property({ type: Boolean }) disabled = false;

  override render() {
    return html`
      <textarea rows=${this.rows} .value=${this.value} placeholder=${this.placeholder} ?disabled=${this.disabled} ?data-invalid=${this.invalid}
        @input=${(e: Event) => {
          this.value = (e.target as HTMLTextAreaElement).value;
          this.dispatchEvent(new CustomEvent('genova-input', { detail: { value: this.value }, bubbles: true, composed: true }));
        }}></textarea>
    `;
  }
}
