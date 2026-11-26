import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaTabsElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: block; }
      .list { display: flex; gap: 0.25rem; border-bottom: 1px solid var(--gnv-outline-variant, #e7e2d8); }
      button {
        border: 0; background: transparent; padding: 0.625rem 1rem; font-family: inherit;
        font-size: 0.875rem; font-weight: 600; color: var(--gnv-text-muted, #64748b);
        border-bottom: 2px solid transparent; cursor: pointer;
      }
      button[aria-selected='true'] { color: var(--gnv-primary, #715faf); border-bottom-color: var(--gnv-primary, #715faf); }
      .panel { padding: 1rem 0; font-size: 0.875rem; }
    `,
  ];

  @property({ type: Array }) tabs: Array<{ id: string; label: string; content?: string }> = [];
  @property({ type: String }) activeId = '';

  override render() {
    const active = this.tabs.find((t) => t.id === this.activeId) ?? this.tabs[0];
    return html`
      <div class="list" role="tablist">
        ${this.tabs.map((tab) => html`
          <button type="button" role="tab" aria-selected=${String(active?.id === tab.id)}
            @click=${() => {
              this.activeId = tab.id;
              this.dispatchEvent(new CustomEvent('genova-tab-change', { detail: { id: tab.id }, bubbles: true, composed: true }));
            }}>${tab.label}</button>
        `)}
      </div>
      <div class="panel" role="tabpanel">${active?.content ?? ''}<slot></slot></div>
    `;
  }
}
