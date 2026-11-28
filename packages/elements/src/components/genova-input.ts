import { LitElement, html } from 'lit';
import { createTranslator, stripNonDigits, type SupportedLocale } from '@genovalv/core';
import { registerCustomElement } from '../register';
import {
  computeInputValidity, formatMaskedValue, isBlockedNumericKey, isMaskedMode,
  renderInputIcon, renderSearchIcon, resolveNativeInputMode,
} from './genova-input.helpers';
import { genovaInputStyles } from './genova-input.styles';

export class GenovaInputElement extends LitElement {
  static formAssociated = true;
  static override styles = genovaInputStyles;
  static override properties = {
    name: { type: String }, type: { type: String }, label: { type: String }, placeholder: { type: String },
    value: { type: String }, autocomplete: { type: String }, error: { type: String }, hint: { type: String },
    icon: { type: String }, actionLabel: { type: String, attribute: 'action-label' },
    actionHref: { type: String, attribute: 'action-href' },
    showPasswordToggle: { type: Boolean, attribute: 'show-password-toggle' },
    passwordVisible: { state: true }, required: { type: Boolean }, disabled: { type: Boolean },
    inputmode: { type: String }, monospace: { type: Boolean }, locale: { type: String },
  };

  name = ''; type: 'text' | 'email' | 'password' | 'search' = 'text'; label = ''; placeholder = '';
  value = ''; autocomplete = ''; error = ''; hint = ''; icon: 'email' | 'lock' | 'shield' | 'none' = 'none';
  actionLabel = ''; actionHref = ''; showPasswordToggle = false; passwordVisible = false;
  required = false; disabled = false; inputmode = ''; monospace = false; locale: SupportedLocale = 'pt-BR';
  private internals?: ElementInternals;

  constructor() {
    super();
    if (typeof HTMLElement !== 'undefined' && typeof this.attachInternals === 'function') {
      try { this.internals = this.attachInternals(); } catch { this.internals = undefined; }
    }
  }

  override focus(options?: FocusOptions): void { this.renderRoot.querySelector('input')?.focus(options); }

  private syncValidity(): boolean {
    if (isMaskedMode(this.inputmode)) this.value = formatMaskedValue(this.inputmode, this.value);
    this.internals?.setFormValue(this.value);
    const { flags, message } = computeInputValidity({ value: this.value, required: this.required, type: this.type, inputmode: this.inputmode, locale: this.locale });
    const anchor = this.renderRoot.querySelector('input') ?? undefined;
    this.internals?.setValidity(flags, message, anchor);
    return Object.keys(flags).length === 0;
  }

  override updated(): void { this.syncValidity(); }
  checkValidity(): boolean { return this.syncValidity(); }
  reportValidity(): boolean { const ok = this.syncValidity(); return this.internals?.reportValidity?.() ?? ok; }

  private handleKeyDown(e: KeyboardEvent): void {
    if (isMaskedMode(this.inputmode) && isBlockedNumericKey(e)) { e.preventDefault(); return; }
    if (this.type === 'search' && e.key === 'Enter') { e.preventDefault(); this.emitSearch(); }
  }

  private updateFromInput(event: Event, evName: 'genova-input' | 'genova-change'): void {
    const input = event.target as HTMLInputElement;
    const next = isMaskedMode(this.inputmode) ? formatMaskedValue(this.inputmode, input.value) : input.value;
    if (input.value !== next) input.value = next;
    this.value = next;
    this.syncValidity();
    this.dispatchEvent(new CustomEvent(evName, { detail: { value: this.value, name: this.name }, bubbles: true, composed: true }));
  }

  private emitSearch(): void {
    if (this.disabled) return;
    this.dispatchEvent(new CustomEvent('genova-search', {
      detail: { value: this.value, rawDigits: stripNonDigits(this.value), inputmode: this.inputmode, name: this.name },
      bubbles: true, composed: true,
    }));
  }

  override render() {
    const t = createTranslator(this.locale);
    const hasToggle = this.showPasswordToggle || this.type === 'password';
    const hasSearch = this.type === 'search';
    const effectiveType = this.type === 'password' && this.passwordVisible ? 'text' : this.type;
    return html`
      <div class="field">
        ${this.label || this.actionLabel || this.hint ? html`<div class="header">${this.label ? html`<label for="control">${this.label}</label>` : html`<span></span>`}${this.actionLabel ? html`<a class="action-link" href=${this.actionHref || '#'}>${this.actionLabel}</a>` : this.hint ? html`<span class="hint">${this.hint}</span>` : ''}</div>` : ''}
        <div class="wrap">
          ${renderInputIcon(this.icon)}
          <input id="control" class="${this.icon !== 'none' ? 'with-icon' : ''} ${hasToggle || hasSearch ? 'with-action' : ''} ${this.monospace ? 'mono' : ''}"
            name=${this.name} type=${effectiveType} .value=${this.value} placeholder=${this.placeholder}
            autocomplete=${this.autocomplete || 'off'} inputmode=${resolveNativeInputMode(this.inputmode)}
            ?required=${this.required} ?disabled=${this.disabled} aria-invalid=${this.error ? 'true' : 'false'}
            aria-describedby=${this.error ? 'error-msg' : ''} @keydown=${this.handleKeyDown}
            @input=${(e: Event) => this.updateFromInput(e, 'genova-input')} @change=${(e: Event) => this.updateFromInput(e, 'genova-change')} />
          ${hasToggle ? html`<button type="button" class="toggle" aria-label=${this.passwordVisible ? t('auth.hidePassword') : t('auth.showPassword')} aria-pressed=${this.passwordVisible ? 'true' : 'false'} @click=${() => { this.passwordVisible = !this.passwordVisible; }}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg></button>` : ''}
          ${hasSearch && !hasToggle ? html`<button type="button" class="search-btn" aria-label=${t('auth.searchAction')} ?disabled=${this.disabled} @click=${() => this.emitSearch()}>${renderSearchIcon()}</button>` : ''}
        </div>
        ${this.error ? html`<span id="error-msg" class="error-msg">${this.error}</span>` : ''}
      </div>
    `;
  }
}

registerCustomElement('genova-input', GenovaInputElement);
