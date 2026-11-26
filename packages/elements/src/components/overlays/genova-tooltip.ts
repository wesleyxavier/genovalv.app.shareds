import { LitElement, css, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaTooltipElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: inline-block; position: relative; }
      .tip {
        position: absolute; bottom: calc(100% + 0.375rem); left: 50%; transform: translateX(-50%);
        white-space: nowrap; padding: 0.3rem 0.6rem; border-radius: 0.375rem;
        background: var(--gnv-on-surface, #0f172a); color: #fff; font-size: 0.75rem; z-index: 30;
      }
    `,
  ];

  @property({ type: String }) label = '';
  @state() private visible = false;

  override render() {
    return html`
      <span @mouseenter=${() => { this.visible = true; }} @mouseleave=${() => { this.visible = false; }}
        @focusin=${() => { this.visible = true; }} @focusout=${() => { this.visible = false; }}>
        <slot></slot>
      </span>
      ${this.visible && this.label ? html`<span class="tip" role="tooltip">${this.label}</span>` : ''}
    `;
  }
}
