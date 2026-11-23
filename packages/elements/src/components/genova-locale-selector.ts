import { LitElement, css, html } from 'lit';
import { resolveSupportedLocale, type SupportedLocale } from '@genovalv/core';
import { registerCustomElement } from '../register';

export class GenovaLocaleSelectorElement extends LitElement {
  static override properties = {
    locale: { type: String, reflect: true },
  };

  locale: SupportedLocale = 'pt-BR';

  static override styles = css`
    :host {
      display: inline-block;
    }
    :host([hidden]) {
      display: none;
    }
    select {
      font-family: var(--gnv-font-sans, 'Inter', system-ui, sans-serif);
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.25rem 0.5rem;
      border-radius: var(--gnv-radius-md, 0.25rem);
      border: 1px solid var(--gnv-outline-variant, #c6c6cd);
      background: var(--gnv-surface-container-lowest, #ffffff);
      color: var(--gnv-on-surface, #0b1c30);
      cursor: pointer;
      outline: none;
      transition: border-color 150ms ease, box-shadow 150ms ease;
    }
    select:focus-visible {
      border-color: var(--gnv-secondary, #0051d5);
      box-shadow: 0 0 0 2px rgba(0, 81, 213, 0.2);
    }
  `;

  private handleChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const next = resolveSupportedLocale(select.value);
    this.locale = next;
    this.dispatchEvent(
      new CustomEvent<{ locale: SupportedLocale }>('genova-locale-change', {
        detail: { locale: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <select
        aria-label="Selecionar idioma"
        .value=${this.locale}
        @change=${this.handleChange}
      >
        <option value="pt-BR" ?selected=${this.locale === 'pt-BR'}>PT-BR</option>
        <option value="en-US" ?selected=${this.locale === 'en-US'}>EN-US</option>
        <option value="es-ES" ?selected=${this.locale === 'es-ES'}>ES-ES</option>
      </select>
    `;
  }
}

registerCustomElement('genova-locale-selector', GenovaLocaleSelectorElement);
