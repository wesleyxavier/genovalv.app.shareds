import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { computePaginationRange } from '@genovalv/core';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';
import { paginationStyles } from './genova-pagination.styles';

export class GenovaPaginationElement extends LitElement {
  static override styles = [etapa1BaseStyles, paginationStyles];

  @property({ type: Number }) page = 1;
  @property({ type: Number, attribute: 'page-size' }) pageSize = 10;
  @property({ type: Number, attribute: 'total-items' }) totalItems = 0;

  private goTo(target: number): void {
    this.dispatchEvent(new CustomEvent('genova-page-change', { detail: { page: target }, bubbles: true, composed: true }));
  }

  override render() {
    const info = computePaginationRange(this.page, this.pageSize, this.totalItems);
    const pages = Array.from({ length: info.totalPages }, (_, i) => i + 1);
    return html`
      <div class="wrap">
        <span>${info.start}–${info.end} de ${info.totalItems}</span>
        <div class="controls" role="navigation" aria-label="Paginação">
          <button type="button" ?disabled=${info.currentPage <= 1} aria-label="Anterior"
            @click=${() => this.goTo(info.currentPage - 1)}>&lt;</button>
          ${pages.map((p) => html`
            <button type="button" data-active=${p === info.currentPage}
              @click=${() => this.goTo(p)}>${p}</button>
          `)}
          <button type="button" ?disabled=${info.currentPage >= info.totalPages} aria-label="Próxima"
            @click=${() => this.goTo(info.currentPage + 1)}>&gt;</button>
        </div>
      </div>
    `;
  }
}
