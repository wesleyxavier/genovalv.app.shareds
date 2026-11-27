import Decimal from 'decimal.js';

function normalizeMoneyInput(raw: string): string {
  const trimmed = raw.trim().replace(/^R\$\s*/i, '').replace(/\s+/g, '');
  if (trimmed.includes(',')) {
    return trimmed.replace(/\./g, '').replace(',', '.');
  }
  return trimmed;
}

export const Money = {
  parse(raw: string): Decimal {
    const normalized = normalizeMoneyInput(raw);
    if (!/^-?\d+(\.\d+)?$/.test(normalized)) {
      throw new Error(`Invalid money value: ${raw}`);
    }
    return new Decimal(normalized);
  },

  isValidNonNegative(raw: string): boolean {
    try {
      const value = Money.parse(raw);
      return !value.isNegative() && value.isFinite();
    } catch {
      return false;
    }
  },

  toDbString(raw: string): string {
    const value = Money.parse(raw);
    if (value.isNegative()) {
      throw new Error(`Negative money value is not allowed: ${raw}`);
    }
    return value.toFixed(2);
  },

  formatBrl(raw: string): string {
    const value = Money.parse(raw);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value.toNumber());
  },
};
