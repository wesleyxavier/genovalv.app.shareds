import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import type { ListFilterConfig } from '@genovalv/core';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';
import { listToolbarStyles } from './genova-list-toolbar.styles';

export class GenovaListToolbarElement extends LitElement {
  static override styles = [etapa1BaseStyles, listToolbarStyles];

  @property({ type: String, attribute: 'search-value' }) searchValue = '';
  @property({ type: String, attribute: 'search-placeholder' }) searchPlaceholder = 'Buscar...';
  @property({ type: Array }) filters: readonly ListFilterConfig[] = [];

  private onSearch(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    this.searchValue = value;
    this.dispatchEvent(new CustomEvent('genova-search-change', { detail: { value }, bubbles: true, composed: true }));
  }

  private onFilter(id: string, e: Event): void {
    const value = (e.target as HTMLSelectElement).value;
    this.dispatchEvent(new CustomEvent('genova-filter-change', { detail: { id, value }, bubbles: true, composed: true }));
  }

  override render() {
    return html`
      <div class="bar">
        <div class="left">
          <div class="search-wrap">
            <span class="search-icon" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="7"></circle><path d="m16 16 4 4"></path>
              </svg>
            </span>
            <input type="search" .value=${this.searchValue} placeholder=${this.searchPlaceholder}
              aria-label=${this.searchPlaceholder} @input=${(e: Event) => this.onSearch(e)} />
          </div>
          ${this.filters.map((f) => html`
            <select aria-label=${f.label} .value=${f.value} @change=${(e: Event) => this.onFilter(f.id, e)}>
              ${f.options.map((o) => html`<option value=${o.value} ?selected=${o.value === f.value}>${o.label}</option>`)}
            </select>
          `)}
        </div>
        <div class="actions"><slot name="actions"></slot></div>
      </div>
    `;
  }
}
