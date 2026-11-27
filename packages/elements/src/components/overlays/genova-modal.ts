import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaModalElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      .backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.45); display: flex; align-items: center; justify-content: center; padding: 1rem; z-index: 50; }
      .modal { width: 100%; max-width: 30rem; background: #fff; border-radius: 0.875rem; border: 1px solid var(--gnv-outline-variant, #e7e2d8); padding: 1.5rem; box-shadow: 0 20px 40px rgba(15, 23, 42, 0.16); max-height: 90vh; overflow-y: auto; }
      .modal[data-size='md'] { max-width: 35rem; }
      .modal[data-size='lg'] { max-width: 48rem; }
      .head { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem; margin-bottom: 1rem; }
      h3 { margin: 0; font-size: 1.0625rem; font-weight: 700; color: var(--gnv-text, #0f172a); }
      .sub { margin: 0.25rem 0 0; font-size: 0.8125rem; color: var(--gnv-text-secondary, #475569); }
      .close { border: 0; background: transparent; cursor: pointer; font-size: 1rem; color: var(--gnv-text-secondary, #475569); padding: 0.25rem; line-height: 1; }
      .footer { margin-top: 1.25rem; display: flex; justify-content: flex-end; gap: 0.625rem; }
    `,
  ];

  @property({ type: Boolean }) open = false;
  @property({ type: String }) override title = '';
  @property({ type: String }) subtitle = '';
  @property({ type: String }) size: 'sm' | 'md' | 'lg' = 'sm';

  private readonly onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.open) this.closeModal();
  };

  override connectedCallback(): void {
    super.connectedCallback();
    if (typeof document !== 'undefined') document.addEventListener('keydown', this.onKeyDown);
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (typeof document !== 'undefined') document.removeEventListener('keydown', this.onKeyDown);
  }

  private closeModal(): void {
    this.open = false;
    this.dispatchEvent(new CustomEvent('genova-close', { bubbles: true, composed: true }));
  }

  override render() {
    if (!this.open) return html``;
    return html`
      <div class="backdrop">
        <div class="modal" data-size=${this.size} role="dialog" aria-modal="true">
          <div class="head">
            <div>
              <h3>${this.title}</h3>
              ${this.subtitle ? html`<p class="sub">${this.subtitle}</p>` : ''}
            </div>
            <button class="close" type="button" aria-label="Fechar" @click=${() => this.closeModal()}>✕</button>
          </div>
          <div><slot></slot></div>
          <div class="footer"><slot name="footer"></slot></div>
        </div>
      </div>
    `;
  }
}
