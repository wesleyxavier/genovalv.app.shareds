import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaBreadcrumbElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: block; }
      ol { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 0.375rem; font-size: 0.8125rem; }
      a { color: var(--gnv-text-muted, #64748b); text-decoration: none; }
      a:hover { color: var(--gnv-primary, #4c3a8a); text-decoration: underline; }
      .sep { color: var(--gnv-outline, #857f93); }
      .cur { color: var(--gnv-on-surface, #0f172a); font-weight: 600; }
    `,
  ];

  @property({ type: Array }) items: Array<{ label: string; href?: string }> = [];

  override render() {
    return html`
      <nav aria-label="Breadcrumb">
        <ol>
          ${this.items.map((item, idx) => html`
            <li>${idx > 0 ? html`<span class="sep">/</span>` : ''}${idx === this.items.length - 1 || !item.href
              ? html`<span class="cur" aria-current="page">${item.label}</span>`
              : html`<a href=${item.href}>${item.label}</a>`}</li>
          `)}
        </ol>
      </nav>
    `;
  }
}
