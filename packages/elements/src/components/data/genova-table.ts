import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaTableElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: block; overflow-x: auto; }
      table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid var(--gnv-outline-variant, #e7e2d8); border-radius: 0.75rem; font-size: 0.875rem; }
      th, td { text-align: left; padding: 0.75rem 1rem; border-bottom: 1px solid var(--gnv-outline-variant, #e7e2d8); }
      th { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--gnv-text-muted, #64748b); background: var(--gnv-surface, #faf7f0); }
      tr:last-child td { border-bottom: 0; }
    `,
  ];

  @property({ type: Array }) columns: string[] = [];
  @property({ type: Array }) rows: string[][] = [];

  override render() {
    return html`
      <table>
        <thead><tr>${this.columns.map((c) => html`<th>${c}</th>`)}</tr></thead>
        <tbody>${this.rows.map((r) => html`<tr>${r.map((cell) => html`<td>${cell}</td>`)}</tr>`)}</tbody>
      </table>
    `;
  }
}
