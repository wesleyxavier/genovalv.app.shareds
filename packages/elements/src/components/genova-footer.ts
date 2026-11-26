import { LitElement, css, html } from 'lit';
import { DEFAULT_LOGIN_CONTEXT, type LoginLink, type SupportedLocale } from '@genovalv/core';
import { registerCustomElement } from '../register';

export class GenovaFooterElement extends LitElement {
  static override properties = {
    copyrightText: { type: String, attribute: 'copyright-text' },
    links: { attribute: false },
    locale: { type: String },
  };

  copyrightText = DEFAULT_LOGIN_CONTEXT.copyrightText;
  links: LoginLink[] = [...DEFAULT_LOGIN_CONTEXT.footerLinks];
  locale: SupportedLocale = 'pt-BR';

  static override styles = css`
    :host {
      display: block;
      width: 100%;
    }
    footer {
      width: 100%;
      background: transparent;
    }
    .inner {
      max-width: 80rem;
      margin: 0 auto;
      padding: var(--gnv-space-md, 0.75rem) var(--gnv-space-lg, 1rem);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      gap: var(--gnv-space-sm, 0.5rem);
      color: var(--gnv-text-muted, #64748b);
      font-size: 0.6875rem;
      line-height: 0.875rem;
      font-weight: 600;
      letter-spacing: 0.025em;
    }
    @media (min-width: 640px) {
      .inner {
        flex-direction: row;
        padding: var(--gnv-space-md, 0.75rem) var(--gnv-space-xl, 1.5rem);
      }
    }
    .links {
      display: flex;
      align-items: center;
      gap: var(--gnv-space-lg, 1rem);
      flex-wrap: wrap;
    }
    a {
      color: inherit;
      text-decoration: none;
      transition: color 150ms ease;
    }
    a:hover,
    a:focus-visible {
      color: var(--gnv-on-surface, #0f172a);
      outline: 2px solid var(--gnv-primary-focus, #8e7cd8);
      outline-offset: 2px;
      border-radius: var(--gnv-radius-sm, 0.125rem);
    }
  `;

  private handleLinkClick(event: MouseEvent, link: LoginLink): void {
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
      <footer>
        <div class="inner">
          <div>${this.copyrightText}</div>
          <nav class="links" aria-label="Links institucionais">
            ${this.links.map(
              (link) => html`
                <a
                  href=${link.href}
                  target=${link.external ? '_blank' : '_self'}
                  rel=${link.external ? 'noopener noreferrer' : ''}
                  @click=${(e: MouseEvent) => this.handleLinkClick(e, link)}
                >
                  ${link.label}
                </a>
              `,
            )}
          </nav>
        </div>
      </footer>
    `;
  }
}

registerCustomElement('genova-footer', GenovaFooterElement);
