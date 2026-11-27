const CATALOG_CODE_PATTERN = /^[A-Z0-9_]{2,32}$/;

export function validateCatalogCode(code: string): boolean {
  return typeof code === 'string' && CATALOG_CODE_PATTERN.test(code);
}

export function validateCatalogName(name: string): boolean {
  if (typeof name !== 'string') {
    return false;
  }
  const trimmed = name.trim();
  return trimmed.length >= 1 && trimmed.length <= 120;
}

export function validateCatalogDescription(description: string | null | undefined): boolean {
  if (description === null || description === undefined) {
    return true;
  }
  return typeof description === 'string' && description.length <= 500;
}
