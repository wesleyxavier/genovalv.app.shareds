import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaLoadingStateElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: block; width: 100%; }
      .wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; color: var(--gnv-on-surface-variant, #475569); font-size: 0.75rem; font-weight: 500; }
      .fullscreen { position: fixed; inset: 0; z-index: 50; background: var(--gnv-surface, #faf7f0); min-height: 100vh; }
      .card { background: var(--gnv-surface-container-lowest, #ffffff); border: 1px solid var(--gnv-outline-variant, #e7e2d8); border-radius: 0.75rem; padding: 2.5rem 1.5rem; }
      .spin { border-radius: 9999px; border: 3.5px solid var(--gnv-outline-variant, #e7e2d8); border-top-color: var(--gnv-primary, #715faf); animation: gnv-spin 0.7s linear infinite; }
      @keyframes gnv-spin { to { transform: rotate(360deg); } }
    `,
  ];

  @property({ type: String }) variant: 'fullscreen' | 'card' = 'card';
  @property({ type: String }) message = 'Carregando...';
  @property({ type: Number }) size = 32;

  override render() {
    return html`
      <div class="wrap ${this.variant === 'fullscreen' ? 'fullscreen' : 'card'}" role="status" aria-live="polite" aria-label=${this.message}>
        <div class="spin" style=${`width:${this.size}px;height:${this.size}px`}></div>
        ${this.message ? html`<span>${this.message}</span>` : null}
      </div>
    `;
  }
}
