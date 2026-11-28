import { createTranslator, type SupportedLocale } from '@genovalv/core';
import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaTextareaElement extends LitElement {
  static formAssociated = true;

  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: block; width: 100%; }
      textarea {
        width: 100%; min-height: 5.5rem; padding: 0.625rem 0.75rem; border-radius: 0.5rem;
        border: 1px solid var(--gnv-outline-variant, #e7e2d8); background: #fff;
        font-family: inherit; font-size: 0.875rem; resize: vertical;
      }
      textarea[data-invalid], textarea[aria-invalid='true'] { border-color: var(--gnv-error, #bc3737); }
      .error-msg { font-size: 0.75rem; color: var(--gnv-error, #bc3737); font-weight: 500; }
    `,
  ];

  @property({ type: String }) name = '';
  @property({ type: String }) value = '';
  @property({ type: String }) placeholder = '';
  @property({ type: String }) error = '';
  @property({ type: Number }) rows = 3;
  @property({ type: Boolean }) invalid = false;
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) locale: SupportedLocale = 'pt-BR';

  private internals?: ElementInternals;

  constructor() {
    super();
    if (typeof HTMLElement !== 'undefined' && typeof this.attachInternals === 'function') {
      try { this.internals = this.attachInternals(); } catch { this.internals = undefined; }
    }
  }

  private syncValidity(): void {
    this.internals?.setFormValue(this.value);
    const missing = this.required && !this.value.trim();
    const msg = missing ? createTranslator(this.locale)('validation.fieldRequired') : '';
    const anchor = this.renderRoot.querySelector('textarea') ?? undefined;
    this.internals?.setValidity(missing ? { valueMissing: true } : {}, msg, anchor);
  }

  override updated(): void { this.syncValidity(); }
  checkValidity(): boolean { this.syncValidity(); return !this.required || Boolean(this.value.trim()); }
  reportValidity(): boolean { this.syncValidity(); return this.internals?.reportValidity?.() ?? this.checkValidity(); }

  override render() {
    const isInvalid = this.invalid || Boolean(this.error);
    return html`
      <textarea name=${this.name} rows=${this.rows} .value=${this.value} placeholder=${this.placeholder}
        ?disabled=${this.disabled} ?required=${this.required} ?data-invalid=${isInvalid}
        aria-invalid=${isInvalid ? 'true' : 'false'}
        @input=${(e: Event) => {
          this.value = (e.target as HTMLTextAreaElement).value;
          this.syncValidity();
          this.dispatchEvent(new CustomEvent('genova-input', { detail: { value: this.value }, bubbles: true, composed: true }));
        }}></textarea>
      ${this.error ? html`<span class="error-msg" role="alert">${this.error}</span>` : ''}
    `;
  }
}
