import { LitElement, css, html } from 'lit';
import { registerCustomElement } from '../register';

export class GenovaCheckboxElement extends LitElement {
  static formAssociated = true;

  static override properties = {
    name: { type: String },
    label: { type: String },
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  name = '';
  label = '';
  checked = false;
  disabled = false;

  private internals?: ElementInternals;

  constructor() {
    super();
    if (typeof HTMLElement !== 'undefined' && typeof this.attachInternals === 'function') {
      try {
        this.internals = this.attachInternals();
      } catch {
        this.internals = undefined;
      }
    }
  }

  static override styles = css`
    :host {
      display: block;
    }
    :host([hidden]) {
      display: none;
    }
    .row {
      display: flex;
      align-items: center;
      gap: var(--gnv-space-sm, 0.5rem);
      padding-top: 0.125rem;
    }
    input {
      width: 1rem;
      height: 1rem;
      border-radius: var(--gnv-radius-sm, 0.125rem);
      accent-color: var(--gnv-secondary, #0051d5);
      cursor: pointer;
    }
    label {
      font-size: 0.75rem;
      line-height: 1.125rem;
      color: var(--gnv-on-surface, #0b1c30);
      cursor: pointer;
      user-select: none;
    }
  `;

  private handleChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.checked = checkbox.checked;
    this.internals?.setFormValue(this.checked ? 'on' : null);
    this.dispatchEvent(
      new CustomEvent<{ checked: boolean; name: string }>('genova-change', {
        detail: { checked: this.checked, name: this.name },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <div class="row">
        <input
          id="checkbox"
          type="checkbox"
          name=${this.name}
          .checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this.handleChange}
        />
        <label for="checkbox">${this.label}</label>
      </div>
    `;
  }
}

registerCustomElement('genova-checkbox', GenovaCheckboxElement);
