import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaSwitchElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: inline-flex; }
      button {
        display: inline-flex; align-items: center; gap: 0.5rem; border: 0; background: transparent;
        padding: 0; font-family: inherit; font-size: 0.875rem; cursor: pointer;
      }
      .track {
        position: relative; width: 2.5rem; height: 1.375rem; border-radius: 9999px;
        background: var(--gnv-outline-variant, #e7e2d8); transition: background-color 0.15s ease;
      }
      button[aria-checked='true'] .track { background: var(--gnv-primary, #4c3a8a); }
      .thumb {
        position: absolute; top: 0.1875rem; left: 0.1875rem; width: 1rem; height: 1rem;
        border-radius: 9999px; background: #fff; transition: transform 0.15s ease;
      }
      button[aria-checked='true'] .thumb { transform: translateX(1.125rem); }
    `,
  ];

  @property({ type: Boolean }) checked = false;
  @property({ type: String }) label = '';
  @property({ type: Boolean }) disabled = false;

  override render() {
    return html`
      <button type="button" role="switch" aria-checked=${String(this.checked)} ?disabled=${this.disabled}
        @click=${() => {
          this.checked = !this.checked;
          this.dispatchEvent(new CustomEvent('genova-change', { detail: { checked: this.checked }, bubbles: true, composed: true }));
        }}>
        <span class="track"><span class="thumb"></span></span>
        ${this.label ? html`<span>${this.label}</span>` : ''}
      </button>
    `;
  }
}
