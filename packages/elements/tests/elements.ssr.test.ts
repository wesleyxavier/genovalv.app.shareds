// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { registerCustomElement } from '../src/register';
import {
  GenovaActionButtonElement,
  GenovaAlertBannerElement,
  GenovaAuthCardElement,
  GenovaAuthShellElement,
  GenovaFooterElement,
  GenovaHeaderElement,
  GenovaMfaSelectorElement,
  registerGenovaElements,
} from '../src/index';

describe('SSR-safety', () => {
  it('imports full @genovalv/elements barrel in Node without throwing', () => {
    expect(typeof window).toBe('undefined');
    expect(GenovaHeaderElement).toBeDefined();
    expect(GenovaFooterElement).toBeDefined();
    expect(GenovaAuthCardElement).toBeDefined();
    expect(GenovaAuthShellElement).toBeDefined();
    expect(GenovaActionButtonElement).toBeDefined();
    expect(GenovaAlertBannerElement).toBeDefined();
    expect(GenovaMfaSelectorElement).toBeDefined();
    expect(() => registerGenovaElements()).not.toThrow();
    expect(registerCustomElement('genova-dummy-ssr', class {} as unknown as CustomElementConstructor)).toBe(false);
  });
});
