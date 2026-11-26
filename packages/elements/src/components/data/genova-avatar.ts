import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';

export class GenovaAvatarElement extends LitElement {
  static override styles = [
    etapa1BaseStyles,
    css`
      :host { display: inline-flex; }
      .avatar {
        display: inline-flex; align-items: center; justify-content: center;
        border-radius: 9999px; overflow: hidden; background: var(--gnv-primary-container, #f1eefc);
        color: var(--gnv-primary, #715faf); font-weight: 700; font-size: 0.875rem;
      }
      img { width: 100%; height: 100%; object-fit: cover; }
    `,
  ];

  @property({ type: String }) name = 'Genova User';
  @property({ type: String }) src = '';
  @property({ type: Number }) size = 40;

  private get initials() {
    return this.name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('') || 'G';
  }

  override render() {
    return html`
      <div class="avatar" style=${`width:${this.size}px;height:${this.size}px`} aria-label=${this.name}>
        ${this.src ? html`<img src=${this.src} alt=${this.name} />` : this.initials}
      </div>
    `;
  }
}
