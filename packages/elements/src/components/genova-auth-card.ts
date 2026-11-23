import { LitElement, css, html } from 'lit';
import { DEFAULT_LOGIN_CONTEXT, type LoginLink, type SupportedLocale } from '@genovalv/core';
import { registerCustomElement } from '../register';

export class GenovaAuthCardElement extends LitElement {
  static override properties = {
    portalTitle: { type: String, attribute: 'portal-title' },
    portalSubtitle: { type: String, attribute: 'portal-subtitle' },
    supportLinks: { attribute: false },
    locale: { type: String },
  };

  portalTitle = DEFAULT_LOGIN_CONTEXT.portalTitle;
  portalSubtitle = DEFAULT_LOGIN_CONTEXT.portalSubtitle;
  supportLinks: LoginLink[] = [...DEFAULT_LOGIN_CONTEXT.supportLinks];
  locale: SupportedLocale = 'pt-BR';

  static override styles = css`
    :host {
      display: block;
      width: 100%;
      max-width: 28rem;
      margin: 0 auto;
    }
    .wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--gnv-space-lg, 1rem);
      width: 100%;
    }
    .hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0.5rem;
    }
    .emblem {
      width: 3rem;
      height: 3rem;
      border-radius: var(--gnv-radius-xl, 0.75rem);
      background: var(--gnv-primary-container, #131b2e);
      color: var(--gnv-on-primary, #ffffff);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--gnv-shadow-level-1, 0 1px 2px rgba(15, 23, 42, 0.04));
      margin-bottom: 0.25rem;
    }
    h1 {
      margin: 0;
      font-size: 1.5rem;
      line-height: 2rem;
      letter-spacing: -0.02em;
      font-weight: 700;
      color: var(--gnv-on-surface, #0b1c30);
    }
    .subtitle {
      margin: 0;
      font-size: 0.8125rem;
      line-height: 1.25rem;
      color: var(--gnv-on-surface-variant, #45464d);
    }
    .card {
      width: 100%;
      box-sizing: border-box;
      background: var(--gnv-surface-container-lowest, #ffffff);
      border-radius: var(--gnv-radius-lg, 0.5rem);
      border: 1px solid var(--gnv-surface-container, #e5eeff);
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
      color: var(--gnv-on-surface-variant, #45464d);
    }
    .support a {
      color: inherit;
      text-decoration: none;
      transition: color 150ms ease;
    }
    .support a:hover,
    .support a:focus-visible {
      color: var(--gnv-on-surface, #0b1c30);
      outline: 2px solid var(--gnv-secondary, #0051d5);
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
          <div class="emblem" aria-hidden="true">
            <slot name="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
              </svg>
            </slot>
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
