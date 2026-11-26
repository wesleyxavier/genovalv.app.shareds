import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaRadioButtonGroupElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: inline-flex; }
      .wrap { display: inline-flex; border: 1px solid var(--gnv-outline-variant, #e7e2d8); border-radius: 0.5rem; background: #fff; overflow: hidden; }
      button {
        border: 0; background: transparent; padding: 0.45rem 0.9rem; font-family: inherit;
        font-size: 0.8125rem; font-weight: 600; color: var(--gnv-on-surface-variant, #475569); cursor: pointer;
      }
      button[aria-checked='true'] { background: var(--gnv-primary, #715faf); color: #fff; }
    `,
  ];

  @property({ type: Array }) options: Array<{ label: string; value: string }> = [];
  @property({ type: String }) value = '';

  override render() {
    return html`
      <div class="wrap" role="radiogroup">
        ${this.options.map((opt) => html`
          <button type="button" role="radio" aria-checked=${String(this.value === opt.value)}
            @click=${() => {
              this.value = opt.value;
              this.dispatchEvent(new CustomEvent('genova-change', { detail: { value: opt.value }, bubbles: true, composed: true }));
            }}>${opt.label}</button>
        `)}
      </div>
    `;
  }
}
