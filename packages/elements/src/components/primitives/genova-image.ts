import { LitElement, css, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaImageElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: inline-block; overflow: hidden; border-radius: 0.75rem; background: var(--gnv-surface-container, #eeebe4); }
      img { display: block; width: 100%; height: 100%; object-fit: cover; }
      .fallback { display: flex; align-items: center; justify-content: center; padding: 1.5rem; font-size: 0.75rem; color: var(--gnv-text-muted, #64748b); }
    `,
  ];

  @property({ type: String }) src = '';
  @property({ type: String }) alt = '';
  @property({ type: String }) fallbackText = 'Imagem indisponÃ­vel';
  @state() private failed = false;

  override render() {
    if (!this.src || this.failed) {
      return html`<div class="fallback" role="img" aria-label=${this.alt || this.fallbackText}>${this.fallbackText}</div>`;
    }
    return html`<img src=${this.src} alt=${this.alt} @error=${() => { this.failed = true; }} />`;
  }
}
