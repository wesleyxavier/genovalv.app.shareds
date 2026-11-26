import { LitElement, css, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaEditableElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: inline-block; }
      .preview { padding: 0.25rem 0.5rem; border-radius: 0.375rem; cursor: text; }
      .preview:hover { background: var(--gnv-surface-container, #eeebe4); }
      input { padding: 0.25rem 0.5rem; border-radius: 0.375rem; border: 1px solid var(--gnv-primary, #4c3a8a); font-family: inherit; font-size: inherit; }
    `,
  ];

  @property({ type: String }) value = 'Clique para editar';
  @state() private editing = false;

  private commit(next: string) {
    this.value = next;
    this.editing = false;
    this.dispatchEvent(new CustomEvent('genova-submit', { detail: { value: next }, bubbles: true, composed: true }));
  }

  override render() {
    if (this.editing) {
      return html`<input .value=${this.value} @blur=${(e: Event) => this.commit((e.target as HTMLInputElement).value)}
        @keydown=${(e: KeyboardEvent) => { if (e.key === 'Enter') this.commit((e.target as HTMLInputElement).value); if (e.key === 'Escape') this.editing = false; }} />`;
    }
    return html`<span class="preview" tabindex="0" @click=${() => { this.editing = true; }} @keydown=${(e: KeyboardEvent) => { if (e.key === 'Enter') this.editing = true; }}>${this.value}</span>`;
  }
}
