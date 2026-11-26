import { LitElement, css, html } from 'lit';
import type { LoginLink, SupportedLocale } from '@genovalv/core';
import { DEFAULT_LOGIN_CONTEXT } from '@genovalv/core';
import { registerCustomElement } from '../register';
import { renderGenovaCloudHorizontalDark } from './genova-brand-logo';
import './genova-header';
import './genova-footer';

export class GenovaAuthShellElement extends LitElement {
  static override properties = {
    brandName: { type: String, attribute: 'brand-name' },
    brandSuffix: { type: String, attribute: 'brand-suffix' },
    badgeText: { type: String, attribute: 'badge-text' },
    copyrightText: { type: String, attribute: 'copyright-text' },
    footerLinks: { attribute: false },
    heroTitle: { type: String, attribute: 'hero-title' },
    heroSubtitle: { type: String, attribute: 'hero-subtitle' },
    heroSteps: { attribute: false },
    locale: { type: String },
  };

  brandName = DEFAULT_LOGIN_CONTEXT.brandName;
  brandSuffix = DEFAULT_LOGIN_CONTEXT.brandSuffix ?? '';
  badgeText = '';
  copyrightText = DEFAULT_LOGIN_CONTEXT.copyrightText;
  footerLinks: LoginLink[] = [...DEFAULT_LOGIN_CONTEXT.footerLinks];
  heroTitle = 'Console operacional';
  heroSubtitle = 'Unificado e seguro.';
  heroSteps: string[] = [
    'Autenticação protegida com MFA',
    'Acesso multi-empresa em tempo real',
  ];
  locale: SupportedLocale = 'pt-BR';

  static override styles = css`
    :host {
      display: block;
      min-height: 100vh;
      width: 100%;
      background: var(--gnv-surface, #faf7f0);
      color: var(--gnv-on-surface, #0f172a);
      font-family: var(--gnv-font-sans, 'Plus Jakarta Sans', system-ui, sans-serif);
      overflow-x: hidden;
    }
    .layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      min-height: 100vh;
      width: 100%;
    }
    @media (min-width: 960px) {
      .layout {
        grid-template-columns: minmax(340px, 460px) minmax(0, 1fr);
      }
    }
    @media (min-width: 1280px) {
      .layout {
        grid-template-columns: 520px minmax(0, 1fr);
      }
    }
    .brand-aside {
      margin: 0.75rem 0.75rem 0;
      border-radius: 1.25rem;
      background: linear-gradient(145deg, #1b1633 0%, #33285f 60%, #1f5c4a 100%);
      color: #ffffff;
      padding: 1.5rem;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1.25rem;
    }
    @media (min-width: 960px) {
      .brand-aside {
        margin: 1rem;
        border-radius: 1.5rem;
        padding: 3.5rem 2.75rem;
        justify-content: center;
        gap: 2.25rem;
      }
    }
    .brand-logo {
      position: relative;
      z-index: 2;
      max-width: 100%;
    }
    .brand-logo svg {
      max-width: 100%;
      height: auto;
      display: block;
    }
    .brand-copy {
      position: relative;
      z-index: 2;
      display: grid;
      gap: 0.25rem;
    }
    .brand-headline {
      margin: 0;
      font-size: 1.375rem;
      line-height: 1.25;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.02em;
    }
    .brand-subheadline {
      margin: 0;
      font-size: 1.375rem;
      line-height: 1.25;
      font-weight: 600;
      color: #a8dfc6;
      letter-spacing: -0.02em;
    }
    @media (min-width: 960px) {
      .brand-headline,
      .brand-subheadline {
        font-size: 1.75rem;
      }
    }
    .brand-steps {
      position: relative;
      z-index: 2;
      display: none;
      gap: 0.875rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    @media (min-width: 960px) {
      .brand-steps {
        display: grid;
      }
    }
    .brand-steps li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #cfc4f5;
    }
    .step-num {
      width: 1.375rem;
      height: 1.375rem;
      border-radius: 9999px;
      border: 1.5px solid #a8dfc6;
      color: #a8dfc6;
      font-size: 0.6875rem;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .waves {
      position: absolute;
      inset: auto 0 0 0;
      width: 100%;
      height: 38%;
      pointer-events: none;
      z-index: 1;
    }
    .workspace {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 0;
      width: 100%;
    }
    @media (min-width: 960px) {
      .workspace {
        min-height: 100vh;
      }
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
      padding: var(--gnv-space-lg, 1rem) var(--gnv-space-lg, 1rem);
      box-sizing: border-box;
    }
    @media (min-width: 960px) {
      main {
        padding: var(--gnv-space-xl, 1.5rem) var(--gnv-space-xl, 1.5rem);
      }
    }
  `;

  override render() {
    return html`
      <div class="layout">
        <aside class="brand-aside" aria-label="Identidade Genova Cloud">
          <div class="brand-logo">
            ${renderGenovaCloudHorizontalDark(276, 105, 'shell')}
          </div>
          <div class="brand-copy">
            <p class="brand-headline">${this.heroTitle}</p>
            <p class="brand-subheadline">${this.heroSubtitle}</p>
          </div>
          ${this.heroSteps.length > 0
            ? html`
                <ol class="brand-steps">
                  ${this.heroSteps.map(
                    (step, index) => html`
                      <li>
                        <span class="step-num">${index + 1}</span>
                        <span>${step}</span>
                      </li>
                    `,
                  )}
                </ol>
              `
            : ''}
          <svg class="waves" viewBox="0 0 547 260" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 92 Q 130 130 270 72 T 547 88" fill="none" stroke="#FFFFFF" stroke-width="2.5" opacity="0.28" />
            <path d="M0 156 Q 150 110 290 154 T 547 132" fill="none" stroke="#FFFFFF" stroke-width="4.5" opacity="0.14" />
            <path d="M0 184 Q 140 140 285 186 T 547 166" fill="none" stroke="#FFFFFF" stroke-width="2" opacity="0.22" />
            <path d="M0 214 Q 170 250 320 206 T 547 224" fill="none" stroke="#FFFFFF" stroke-width="8" opacity="0.08" />
          </svg>
        </aside>

        <div class="workspace">
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
        </div>
      </div>
    `;
  }
}

registerCustomElement('genova-auth-shell', GenovaAuthShellElement);
