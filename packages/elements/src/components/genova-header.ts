import { LitElement, css, html } from 'lit';
import { createTranslator, type SupportedLocale } from '@genovalv/core';
import { registerCustomElement } from '../register';
import { renderGenovaBrandSymbol } from './genova-brand-logo';

export class GenovaHeaderElement extends LitElement {
  static override properties = {
    brandName: { type: String, attribute: 'brand-name' },
    brandSuffix: { type: String, attribute: 'brand-suffix' },
    badgeText: { type: String, attribute: 'badge-text' },
    locale: { type: String },
  };

  brandName = 'Genova';
  brandSuffix = 'Cloud';
  badgeText = '';
  locale: SupportedLocale = 'pt-BR';

  static override styles = css`
    :host {
      display: block;
      width: 100%;
    }
    header {
      width: 100%;
      background: transparent;
    }
    .inner {
      height: 3.75rem;
      max-width: 80rem;
      margin: 0 auto;
      padding: 0 var(--gnv-space-lg, 1rem);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--gnv-space-md, 0.75rem);
    }
    @media (min-width: 768px) {
      .inner {
        padding: 0 var(--gnv-space-xl, 1.5rem);
      }
    }
    .brand {
      display: flex;
      align-items: center;
      gap: var(--gnv-space-sm, 0.5rem);
    }
    .icon-box {
      width: 2rem;
      height: 2rem;
      border-radius: var(--gnv-radius-lg, 0.5rem);
      background: var(--gnv-surface-container-lowest, #ffffff);
      border: 1px solid var(--gnv-outline-variant, #e7e2d8);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .brand-text {
      display: flex;
      align-items: baseline;
      gap: var(--gnv-space-xs, 0.25rem);
      font-size: 1rem;
      line-height: 1.5rem;
      letter-spacing: -0.015em;
    }
    .brand-name {
      font-weight: 700;
      color: var(--gnv-on-surface, #0f172a);
    }
    .brand-suffix {
      font-weight: 500;
      color: var(--gnv-on-surface-variant, #475569);
    }
    .right {
      display: flex;
      align-items: center;
      gap: var(--gnv-space-sm, 0.5rem);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: var(--gnv-space-xs, 0.25rem);
      padding: 0.25rem 0.625rem;
      border-radius: var(--gnv-radius-pill, 9999px);
      background: var(--gnv-surface-container, #eeebe4);
      color: var(--gnv-on-surface-variant, #475569);
      font-size: 0.6875rem;
      line-height: 0.875rem;
      font-weight: 600;
      letter-spacing: 0.025em;
      white-space: nowrap;
    }
    .lock-icon {
      color: var(--gnv-primary, #715faf);
      display: inline-flex;
    }
  `;

  override render() {
    const t = createTranslator(this.locale);
    const resolvedBadge = this.badgeText || t('header.securityBadge');

    return html`
      <header>
        <div class="inner">
          <div class="brand">
            <div class="icon-box" aria-hidden="true">
              <slot name="icon">
                ${renderGenovaBrandSymbol(22, 24, 'hdr')}
              </slot>
            </div>
            <div class="brand-text">
              <span class="brand-name">${this.brandName}</span>
              ${this.brandSuffix ? html`<span class="brand-suffix">${this.brandSuffix}</span>` : ''}
            </div>
          </div>
          <div class="right">
            <slot name="actions"></slot>
            <div class="badge">
              <span class="lock-icon" aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <span>${resolvedBadge}</span>
            </div>
          </div>
        </div>
      </header>
    `;
  }
}

registerCustomElement('genova-header', GenovaHeaderElement);
