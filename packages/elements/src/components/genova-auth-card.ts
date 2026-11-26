import { LitElement, css, html } from 'lit';
import { DEFAULT_LOGIN_CONTEXT, type LoginLink, type SupportedLocale } from '@genovalv/core';
import { registerCustomElement } from '../register';
import { renderGenovaBrandSymbol } from './genova-brand-logo';

export class GenovaAuthCardElement extends LitElement {
  static override properties = {
    portalTitle: { type: String, attribute: 'portal-title' },
    portalSubtitle: { type: String, attribute: 'portal-subtitle' },
    badgeText: { type: String, attribute: 'badge-text' },
    supportLinks: { attribute: false },
    locale: { type: String },
  };

  portalTitle = DEFAULT_LOGIN_CONTEXT.portalTitle;
  portalSubtitle = DEFAULT_LOGIN_CONTEXT.portalSubtitle;
  badgeText = '';
  supportLinks: LoginLink[] = [...DEFAULT_LOGIN_CONTEXT.supportLinks];
  locale: SupportedLocale = 'pt-BR';

  static override styles = css`
    :host {
      display: block;
      width: 100%;
      max-width: 28rem;
      margin: 0 auto;
      font-family: var(--gnv-font-sans, 'Plus Jakarta Sans', system-ui, sans-serif);
    }
    .wrapper {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: var(--gnv-space-lg, 1rem);
      width: 100%;
    }
    .hero {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
      gap: 0.45rem;
    }
    .hero-top {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .emblem {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--gnv-radius-lg, 0.5rem);
      background: var(--gnv-surface-container-lowest, #ffffff);
      border: 1px solid var(--gnv-outline-variant, #e7e2d8);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--gnv-shadow-level-1, 0 1px 2px rgba(15, 23, 42, 0.04));
      flex-shrink: 0;
    }
    .pill-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      background: var(--gnv-primary-container, #f1eefc);
      border: 1px solid var(--gnv-primary-border, #cfc4f5);
      color: var(--gnv-primary, #715faf);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.01em;
    }
    h1 {
      margin: 0;
      font-size: 1.5rem;
      line-height: 2rem;
      letter-spacing: -0.02em;
      font-weight: 700;
      color: var(--gnv-on-surface, #0f172a);
    }
    .subtitle {
      margin: 0;
      font-size: 0.8125rem;
      line-height: 1.25rem;
      color: var(--gnv-on-surface-variant, #475569);
    }
    .card {
      width: 100%;
      box-sizing: border-box;
      background: var(--gnv-surface-container-lowest, #ffffff);
      border-radius: var(--gnv-radius-xl, 0.75rem);
      border: 1px solid var(--gnv-outline-variant, #e7e2d8);
      padding: var(--gnv-space-xl, 1.5rem);
      box-shadow: var(--gnv-shadow-level-2, 0 4px 6px -1px rgba(15, 23, 42, 0.07));
      display: flex;
      flex-direction: column;
      gap: var(--gnv-space-lg, 1rem);
    }
    .support {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: var(--gnv-space-md, 0.75rem);
      font-size: 0.6875rem;
      line-height: 0.875rem;
      font-weight: 600;
      letter-spacing: 0.025em;
      color: var(--gnv-on-surface-variant, #475569);
    }
    .support a {
      color: inherit;
      text-decoration: none;
      transition: color 150ms ease;
    }
    .support a:hover,
    .support a:focus-visible {
      color: var(--gnv-primary, #715faf);
      outline: 2px solid var(--gnv-primary-focus, #8e7cd8);
      outline-offset: 2px;
      border-radius: var(--gnv-radius-sm, 0.125rem);
    }
  `;

  private handleSupportClick(event: MouseEvent, link: LoginLink): void {
    if (link.href.startsWith('#')) {
      event.preventDefault();
    }
    this.dispatchEvent(
      new CustomEvent('genova-link-click', {
        detail: { label: link.label, href: link.href },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <div class="wrapper">
        <div class="hero">
          <div class="hero-top">
            <div class="emblem" aria-hidden="true">
              <slot name="icon">
                ${renderGenovaBrandSymbol(26, 28, 'card')}
              </slot>
            </div>
            ${this.badgeText ? html`<span class="pill-badge">${this.badgeText}</span>` : ''}
          </div>
          <h1>${this.portalTitle}</h1>
          <p class="subtitle">${this.portalSubtitle}</p>
        </div>

        <section class="card" aria-label=${this.portalTitle}>
          <slot name="feedback"></slot>
          <slot></slot>
        </section>

        ${this.supportLinks.length > 0
          ? html`
              <nav class="support" aria-label="Links de apoio">
                ${this.supportLinks.map(
                  (link, index) => html`
                    ${index > 0 ? html`<span aria-hidden="true">•</span>` : ''}
                    <a
                      href=${link.href}
                      target=${link.external ? '_blank' : '_self'}
                      rel=${link.external ? 'noopener noreferrer' : ''}
                      @click=${(e: MouseEvent) => this.handleSupportClick(e, link)}
                    >
                      ${link.label}
                    </a>
                  `,
                )}
              </nav>
            `
          : ''}
      </div>
    `;
  }
}

registerCustomElement('genova-auth-card', GenovaAuthCardElement);
