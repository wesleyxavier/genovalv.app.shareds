import { LitElement, css, html } from 'lit';
import type { LoginLink, SupportedLocale } from '@genovalv/core';
import { DEFAULT_LOGIN_CONTEXT } from '@genovalv/core';
import { registerCustomElement } from '../register';
import './genova-header';
import './genova-footer';

export class GenovaAuthShellElement extends LitElement {
  static override properties = {
    brandName: { type: String, attribute: 'brand-name' },
    brandSuffix: { type: String, attribute: 'brand-suffix' },
    badgeText: { type: String, attribute: 'badge-text' },
    copyrightText: { type: String, attribute: 'copyright-text' },
    footerLinks: { attribute: false },
    locale: { type: String },
  };

  brandName = DEFAULT_LOGIN_CONTEXT.brandName;
  brandSuffix = DEFAULT_LOGIN_CONTEXT.brandSuffix ?? '';
  badgeText = '';
  copyrightText = DEFAULT_LOGIN_CONTEXT.copyrightText;
  footerLinks: LoginLink[] = [...DEFAULT_LOGIN_CONTEXT.footerLinks];
  locale: SupportedLocale = 'pt-BR';

  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 100vh;
      width: 100%;
      background: var(--gnv-surface, #f8f9ff);
      color: var(--gnv-on-surface, #0b1c30);
      position: relative;
      overflow-x: hidden;
    }
    .dot-grid {
      pointer-events: none;
      position: fixed;
      inset: 0;
      z-index: 0;
      background-image: radial-gradient(var(--gnv-surface-container-highest, #d3e4fe) 1px, transparent 1px);
      background-size: 24px 24px;
      opacity: 0.7;
    }
    .layer {
      position: relative;
      z-index: 10;
      width: 100%;
    }
    main {
      position: relative;
      z-index: 10;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: var(--gnv-space-xl, 1.5rem) var(--gnv-space-lg, 1rem);
      box-sizing: border-box;
    }
  `;

  override render() {
    return html`
      <div class="dot-grid" aria-hidden="true"></div>
      <div class="layer">
        <slot name="header">
          <genova-header
            brand-name=${this.brandName}
            brand-suffix=${this.brandSuffix}
            badge-text=${this.badgeText}
            locale=${this.locale}
          >
            <slot name="actions" slot="actions"></slot>
          </genova-header>
        </slot>
      </div>
      <main>
        <slot></slot>
      </main>
      <div class="layer">
        <slot name="footer">
          <genova-footer
            copyright-text=${this.copyrightText}
            locale=${this.locale}
            .links=${this.footerLinks}
          ></genova-footer>
        </slot>
      </div>
    `;
  }
}

registerCustomElement('genova-auth-shell', GenovaAuthShellElement);
