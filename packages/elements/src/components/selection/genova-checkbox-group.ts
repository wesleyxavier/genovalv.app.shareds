import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaCheckboxGroupElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: block; }
      .list { display: flex; flex-direction: column; gap: 0.5rem; }
      .list[data-direction='row'] { flex-direction: row; flex-wrap: wrap; gap: 1rem; }
      label { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; cursor: pointer; }
      input { accent-color: var(--gnv-primary, #4c3a8a); width: 1rem; height: 1rem; }
    `,
  ];

  @property({ type: Array }) options: Array<{ label: string; value: string }> = [];
  @property({ type: Array }) value: string[] = [];
  @property({ type: String }) direction: 'column' | 'row' = 'column';

  private toggle(val: string, checked: boolean) {
    const next = checked ? [...new Set([...this.value, val])] : this.value.filter((v) => v !== val);
    this.value = next;
    this.dispatchEvent(new CustomEvent('genova-change', { detail: { value: next }, bubbles: true, composed: true }));
  }

  override render() {
    return html`
      <div class="list" role="group" data-direction=${this.direction}>
        ${this.options.map((opt) => html`
          <label>
            <input type="checkbox" .checked=${this.value.includes(opt.value)} @change=${(e: Event) => this.toggle(opt.value, (e.target as HTMLInputElement).checked)} />
            <span>${opt.label}</span>
          </label>
        `)}
      </div>
    `;
  }
}
