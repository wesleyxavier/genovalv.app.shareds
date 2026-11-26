import { LitElement, css, html, svg } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

const ICON_PATHS: Record<string, string> = {
  check: 'M5 13l4 4L19 7',
  close: 'M6 18L18 6M6 6l12 12',
  plus: 'M12 5v14M5 12h14',
  search: 'M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z',
  info: 'M12 16v-4m0-4h.01M22 12a10 10 0 11-20 0 10 10 0 0120 0z',
  warning: 'M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z',
  chevron: 'M9 18l6-6-6-6',
  user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
};

export class GenovaIconElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: inline-flex; align-items: center; justify-content: center; }
      svg { display: block; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    `,
  ];

  @property({ type: String }) name: keyof typeof ICON_PATHS | string = 'check';
  @property({ type: Number }) size = 18;
  @property({ type: String }) label = '';

  override render() {
    const d = ICON_PATHS[this.name] ?? ICON_PATHS.info;
    return html`<svg width=${this.size} height=${this.size} viewBox="0 0 24 24" role=${this.label ? 'img' : 'presentation'} aria-label=${this.label || ''}>${svg`<path d=${d} />`}</svg>`;
  }
}
