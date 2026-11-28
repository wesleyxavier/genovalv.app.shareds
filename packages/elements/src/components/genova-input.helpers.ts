import {
  createTranslator,
  formatCep,
  formatCnpj,
  formatCpf,
  isValidCep,
  isValidCnpj,
  isValidCpf,
  validateEmail,
  type SupportedLocale,
} from '@genovalv/core';
import { html } from 'lit';

export type MaskedInputMode = 'cpf' | 'cnpj' | 'cep';

export function isMaskedMode(mode: string): mode is MaskedInputMode {
  return mode === 'cpf' || mode === 'cnpj' || mode === 'cep';
}

export function formatMaskedValue(mode: string, raw: string): string {
  if (mode === 'cpf') return formatCpf(raw);
  if (mode === 'cnpj') return formatCnpj(raw);
  if (mode === 'cep') return formatCep(raw);
  return raw;
}

export function resolveNativeInputMode(mode: string): string {
  return isMaskedMode(mode) ? 'numeric' : mode || 'text';
}

const ALLOWED_KEYS = new Set(['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']);

export function isBlockedNumericKey(e: KeyboardEvent): boolean {
  if (e.ctrlKey || e.metaKey || e.altKey || ALLOWED_KEYS.has(e.key)) return false;
  return !/^\d$/.test(e.key);
}

export function computeInputValidity(
  params: { value: string; required: boolean; type: string; inputmode: string; locale: SupportedLocale },
): { flags: ValidityStateFlags; message: string } {
  const t = createTranslator(params.locale);
  const trimmed = params.value.trim();
  if (params.required && !trimmed) return { flags: { valueMissing: true }, message: t('validation.fieldRequired') };
  if (!trimmed) return { flags: {}, message: '' };
  if (params.type === 'email' && validateEmail(trimmed, params.locale)) return { flags: { typeMismatch: true }, message: t('validation.emailInvalid') };
  if (params.inputmode === 'cpf' && !isValidCpf(trimmed)) return { flags: { customError: true }, message: t('validation.cpfInvalid') };
  if (params.inputmode === 'cnpj' && !isValidCnpj(trimmed)) return { flags: { customError: true }, message: t('validation.cnpjInvalid') };
  if (params.inputmode === 'cep' && !isValidCep(trimmed)) return { flags: { customError: true }, message: t('validation.cepInvalid') };
  return { flags: {}, message: '' };
}

export function renderInputIcon(icon: string) {
  if (icon === 'email') return html`<span class="icon" aria-hidden="true">@</span>`;
  if (icon === 'lock') {
    return html`<span class="icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg></span>`;
  }
  if (icon === 'shield') {
    return html`<span class="icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg></span>`;
  }
  return '';
}

export function renderSearchIcon() {
  return html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>`;
}
