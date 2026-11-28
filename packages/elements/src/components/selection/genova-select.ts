import { createTranslator, type SupportedLocale } from '@genovalv/core';
import { LitElement, css, html } from 'lit';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaSelectElement extends LitElement {
  static formAssociated = true;

  static override properties = {
    options: { type: Array },
    value: { type: String },
    placeholder: { type: String },
    label: { type: String },
    name: { type: String },
    error: { type: String },
    required: { type: Boolean },
    disabled: { type: Boolean },
    locale: { type: String },
  };

  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: block; width: 100%; }
      .field { display: flex; flex-direction: column; gap: 0.375rem; }
      label { font-size: 0.8125rem; font-weight: 600; color: var(--gnv-on-surface, #0f172a); }
      select {
        width: 100%; padding: 0.55rem 0.75rem; border-radius: 0.5rem; font-family: inherit; font-size: 0.875rem;
        border: 1px solid var(--gnv-outline-variant, #e7e2d8); background: #fff; color: var(--gnv-on-surface, #0f172a);
      }
      select[aria-invalid='true'] { border-color: var(--gnv-error, #bc3737); box-shadow: 0 0 0 1.5px rgba(188, 55, 55, 0.25); }
      .error-msg { font-size: 0.75rem; line-height: 1.125rem; color: var(--gnv-error, #bc3737); font-weight: 500; }
    `,
  ];

  options: Array<{ label: string; value: string }> = [];
  value = '';
  placeholder = 'Selecione...';
  label = '';
  name = '';
  error = '';
  required = false;
  disabled = false;
  locale: SupportedLocale = 'pt-BR';

  private internals?: ElementInternals;

  constructor() {
    super();
    if (typeof HTMLElement !== 'undefined' && typeof this.attachInternals === 'function') {
      try { this.internals = this.attachInternals(); } catch { this.internals = undefined; }
    }
  }

  private syncValidity(): void {
    this.internals?.setFormValue(this.value);
    const missing = this.required && !this.value;
    const msg = missing ? createTranslator(this.locale)('validation.fieldRequired') : '';
    const anchor = this.renderRoot.querySelector('select') ?? undefined;
    this.internals?.setValidity(missing ? { valueMissing: true } : {}, msg, anchor);
  }

  override updated(): void { this.syncValidity(); }
  checkValidity(): boolean { this.syncValidity(); return !this.required || Boolean(this.value); }
  reportValidity(): boolean { this.syncValidity(); return this.internals?.reportValidity?.() ?? this.checkValidity(); }

  private handleChange(e: Event): void {
    this.value = (e.target as HTMLSelectElement).value;
    this.syncValidity();
    this.dispatchEvent(new CustomEvent('genova-change', { detail: { value: this.value }, bubbles: true, composed: true }));
  }

  override render() {
    return html`
      <div class="field">
        ${this.label ? html`<label for="control">${this.label}</label>` : ''}
        <div class="select-wrap">
          <select id="control" name=${this.name} .value=${this.value} ?disabled=${this.disabled} ?required=${this.required}
            aria-invalid=${this.error ? 'true' : 'false'} aria-describedby=${this.error ? 'error-msg' : ''} @change=${this.handleChange}>
            <option value="" disabled ?selected=${!this.value}>${this.placeholder}</option>
            ${this.options.map((o) => html`<option value=${o.value} ?selected=${o.value === this.value}>${o.label}</option>`)}
          </select>
        </div>
        ${this.error ? html`<span id="error-msg" class="error-msg" role="alert">${this.error}</span>` : ''}
      </div>
    `;
  }
}
