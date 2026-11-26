import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaAlertDialogElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      .backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.45); display: flex; align-items: center; justify-content: center; padding: 1rem; z-index: 50; }
      .dialog { width: 100%; max-width: 26rem; background: #fff; border-radius: 0.875rem; border: 1px solid var(--gnv-outline-variant, #e7e2d8); padding: 1.25rem; box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15); }
      h3 { margin: 0 0 0.5rem; font-size: 1rem; font-weight: 700; }
      .body { font-size: 0.875rem; color: var(--gnv-on-surface-variant, #475569); margin-bottom: 1rem; }
      .actions { display: flex; justify-content: flex-end; gap: 0.5rem; }
      button { padding: 0.5rem 0.9rem; border-radius: 0.5rem; font-family: inherit; font-size: 0.8125rem; font-weight: 600; cursor: pointer; border: 1px solid var(--gnv-outline-variant, #e7e2d8); background: #fff; }
      .confirm { background: var(--gnv-error, #bc3737); border-color: var(--gnv-error, #bc3737); color: #fff; }
    `,
  ];

  @property({ type: Boolean }) open = false;
  @property({ type: String }) override title = 'Confirmar ação';
  @property({ type: String }) confirmLabel = 'Confirmar';
  @property({ type: String }) cancelLabel = 'Cancelar';

  override render() {
    if (!this.open) return html``;
    return html`
      <div class="backdrop">
        <div class="dialog" role="alertdialog" aria-modal="true">
          <h3>${this.title}</h3>
          <div class="body"><slot></slot></div>
          <div class="actions">
            <button type="button" @click=${() => {
              this.open = false;
              this.dispatchEvent(new CustomEvent('genova-cancel', { bubbles: true, composed: true }));
            }}>${this.cancelLabel}</button>
            <button type="button" class="confirm" @click=${() => {
              this.open = false;
              this.dispatchEvent(new CustomEvent('genova-confirm', { bubbles: true, composed: true }));
            }}>${this.confirmLabel}</button>
          </div>
        </div>
      </div>
    `;
  }
}
