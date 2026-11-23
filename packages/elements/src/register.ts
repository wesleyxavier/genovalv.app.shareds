export function registerCustomElement(
  tagName: string,
  ctor: CustomElementConstructor,
): boolean {
  if (typeof window === 'undefined' || typeof customElements === 'undefined') {
    return false;
  }
  if (!customElements.get(tagName)) {
    customElements.define(tagName, ctor);
    return true;
  }
  return false;
}
