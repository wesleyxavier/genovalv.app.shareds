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
import { GenovaBoxElement } from './components/primitives/genova-box';
import { GenovaPseudoBoxElement } from './components/primitives/genova-pseudo-box';
import { GenovaControlBoxElement } from './components/primitives/genova-control-box';
import { GenovaDividerElement } from './components/primitives/genova-divider';
import { GenovaHeadingElement } from './components/primitives/genova-heading';
import { GenovaIconElement } from './components/primitives/genova-icon';
import { GenovaImageElement } from './components/primitives/genova-image';
import { GenovaButtonElement } from './components/actions/genova-button';
import { GenovaButtonGroupElement } from './components/actions/genova-button-group';
import { GenovaCloseButtonElement } from './components/actions/genova-close-button';
import { GenovaIconButtonElement } from './components/actions/genova-icon-button';
import { GenovaLinkElement } from './components/actions/genova-link';
import { GenovaInputGroupElement } from './components/forms/genova-input-group';
import { GenovaNumberInputElement } from './components/forms/genova-number-input';
import { GenovaTextareaElement } from './components/forms/genova-textarea';
import { GenovaEditableElement } from './components/forms/genova-editable';
import { GenovaFormControlElement } from './components/forms/genova-form-control';
import { GenovaCheckboxGroupElement } from './components/selection/genova-checkbox-group';
import { GenovaRadioElement } from './components/selection/genova-radio';
import { GenovaRadioButtonGroupElement } from './components/selection/genova-radio-button-group';
import { GenovaSelectElement } from './components/selection/genova-select';
import { GenovaSwitchElement } from './components/selection/genova-switch';
import { GenovaSliderElement } from './components/selection/genova-slider';
import { GenovaBreadcrumbElement } from './components/navigation/genova-breadcrumb';
import { GenovaTabsElement } from './components/navigation/genova-tabs';
import { GenovaMenuElement } from './components/navigation/genova-menu';
import { GenovaAccordionElement } from './components/navigation/genova-accordion';
import { GenovaCollapseElement } from './components/navigation/genova-collapse';
import { GenovaAppHeaderElement } from './components/navigation/app-header/genova-app-header';
import { GenovaAlertElement } from './components/feedback/genova-alert';
import { GenovaCircularProgressElement } from './components/feedback/genova-circular-progress';
import { GenovaProgressElement } from './components/feedback/genova-progress';
import { GenovaSkeletonElement } from './components/feedback/genova-skeleton';
import { GenovaSpinnerElement } from './components/feedback/genova-spinner';
import { GenovaToastElement } from './components/feedback/genova-toast';
import { GenovaAlertDialogElement } from './components/overlays/genova-alert-dialog';
import { GenovaDrawerElement } from './components/overlays/genova-drawer';
import { GenovaModalElement } from './components/overlays/genova-modal';
import { GenovaTooltipElement } from './components/overlays/genova-tooltip';
import { GenovaAvatarElement } from './components/data/genova-avatar';
import { GenovaBadgeElement } from './components/data/genova-badge';
import { GenovaListElement } from './components/data/genova-list';
import { GenovaStatsElement } from './components/data/genova-stats';
import { GenovaTableElement } from './components/data/genova-table';
import { GenovaTagElement } from './components/data/genova-tag';

export {
  GenovaActionButtonElement, GenovaAlertBannerElement, GenovaAuthCardElement, GenovaAuthShellElement,
  GenovaCheckboxElement, GenovaFooterElement, GenovaHeaderElement, GenovaInputElement,
  GenovaLocaleSelectorElement, GenovaMfaSelectorElement,
  GenovaBoxElement, GenovaPseudoBoxElement, GenovaControlBoxElement, GenovaDividerElement,
  GenovaHeadingElement, GenovaIconElement, GenovaImageElement,
  GenovaButtonElement, GenovaButtonGroupElement, GenovaCloseButtonElement, GenovaIconButtonElement, GenovaLinkElement,
  GenovaInputGroupElement, GenovaNumberInputElement, GenovaTextareaElement, GenovaEditableElement, GenovaFormControlElement,
  GenovaCheckboxGroupElement, GenovaRadioElement, GenovaRadioButtonGroupElement, GenovaSelectElement, GenovaSwitchElement, GenovaSliderElement,
  GenovaBreadcrumbElement, GenovaTabsElement, GenovaMenuElement, GenovaAccordionElement, GenovaCollapseElement, GenovaAppHeaderElement,
  GenovaAlertElement, GenovaCircularProgressElement, GenovaProgressElement, GenovaSkeletonElement, GenovaSpinnerElement, GenovaToastElement,
  GenovaAlertDialogElement, GenovaDrawerElement, GenovaModalElement, GenovaTooltipElement,
  GenovaAvatarElement, GenovaBadgeElement, GenovaListElement, GenovaStatsElement, GenovaTableElement, GenovaTagElement,
};

const ELEMENTS: Array<[string, CustomElementConstructor]> = [
  ['genova-header', GenovaHeaderElement], ['genova-footer', GenovaFooterElement],
  ['genova-auth-card', GenovaAuthCardElement], ['genova-auth-shell', GenovaAuthShellElement],
  ['genova-action-button', GenovaActionButtonElement], ['genova-alert-banner', GenovaAlertBannerElement],
  ['genova-mfa-selector', GenovaMfaSelectorElement], ['genova-locale-selector', GenovaLocaleSelectorElement],
  ['genova-input', GenovaInputElement], ['genova-checkbox', GenovaCheckboxElement],
  ['genova-box', GenovaBoxElement], ['genova-pseudo-box', GenovaPseudoBoxElement],
  ['genova-control-box', GenovaControlBoxElement], ['genova-divider', GenovaDividerElement],
  ['genova-heading', GenovaHeadingElement], ['genova-icon', GenovaIconElement], ['genova-image', GenovaImageElement],
  ['genova-button', GenovaButtonElement], ['genova-button-group', GenovaButtonGroupElement],
  ['genova-close-button', GenovaCloseButtonElement], ['genova-icon-button', GenovaIconButtonElement], ['genova-link', GenovaLinkElement],
  ['genova-input-group', GenovaInputGroupElement], ['genova-number-input', GenovaNumberInputElement],
  ['genova-textarea', GenovaTextareaElement], ['genova-editable', GenovaEditableElement], ['genova-form-control', GenovaFormControlElement],
  ['genova-checkbox-group', GenovaCheckboxGroupElement], ['genova-radio', GenovaRadioElement],
  ['genova-radio-button-group', GenovaRadioButtonGroupElement], ['genova-select', GenovaSelectElement],
  ['genova-switch', GenovaSwitchElement], ['genova-slider', GenovaSliderElement],
  ['genova-breadcrumb', GenovaBreadcrumbElement], ['genova-tabs', GenovaTabsElement],
  ['genova-menu', GenovaMenuElement], ['genova-accordion', GenovaAccordionElement], ['genova-collapse', GenovaCollapseElement], ['genova-app-header', GenovaAppHeaderElement],
  ['genova-alert', GenovaAlertElement], ['genova-circular-progress', GenovaCircularProgressElement],
  ['genova-progress', GenovaProgressElement], ['genova-skeleton', GenovaSkeletonElement],
  ['genova-spinner', GenovaSpinnerElement], ['genova-toast', GenovaToastElement],
  ['genova-alert-dialog', GenovaAlertDialogElement], ['genova-drawer', GenovaDrawerElement],
  ['genova-modal', GenovaModalElement], ['genova-tooltip', GenovaTooltipElement],
  ['genova-avatar', GenovaAvatarElement], ['genova-badge', GenovaBadgeElement],
  ['genova-list', GenovaListElement], ['genova-stats', GenovaStatsElement],
  ['genova-table', GenovaTableElement], ['genova-tag', GenovaTagElement],
];

export function registerGenovaElements(): void {
  for (const [tag, ctor] of ELEMENTS) {
    registerCustomElement(tag, ctor);
  }
}
