import { registerCustomElement } from './register';
import { GenovaActionButtonElement } from './components/genova-action-button';
import { GenovaAlertBannerElement } from './components/genova-alert-banner';
import { GenovaAuthCardElement } from './components/genova-auth-card';
import { GenovaAuthShellElement } from './components/genova-auth-shell';
import { GenovaCheckboxElement } from './components/genova-checkbox';
import { GenovaFooterElement } from './components/genova-footer';
import { GenovaHeaderElement } from './components/genova-header';
import { GenovaInputElement } from './components/genova-input';
import { GenovaLocaleSelectorElement } from './components/genova-locale-selector';
import { GenovaMfaSelectorElement } from './components/genova-mfa-selector';

export {
  GenovaActionButtonElement,
  GenovaAlertBannerElement,
  GenovaAuthCardElement,
  GenovaAuthShellElement,
  GenovaCheckboxElement,
  GenovaFooterElement,
  GenovaHeaderElement,
  GenovaInputElement,
  GenovaLocaleSelectorElement,
  GenovaMfaSelectorElement,
};

export function registerGenovaElements(): void {
  registerCustomElement('genova-header', GenovaHeaderElement);
  registerCustomElement('genova-footer', GenovaFooterElement);
  registerCustomElement('genova-auth-card', GenovaAuthCardElement);
  registerCustomElement('genova-auth-shell', GenovaAuthShellElement);
  registerCustomElement('genova-action-button', GenovaActionButtonElement);
  registerCustomElement('genova-alert-banner', GenovaAlertBannerElement);
  registerCustomElement('genova-mfa-selector', GenovaMfaSelectorElement);
  registerCustomElement('genova-locale-selector', GenovaLocaleSelectorElement);
  registerCustomElement('genova-input', GenovaInputElement);
  registerCustomElement('genova-checkbox', GenovaCheckboxElement);
}
