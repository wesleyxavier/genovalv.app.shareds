const HIDDEN_ENV_VALUES = new Set(['', 'production', 'prod']);

/**
 * Extracts up to two uppercase initials from a user display name or email.
 */
export function getUserInitials(fullName?: string | null, email?: string | null): string {
  const words = (fullName ?? '').trim().split(/\s+/).filter(Boolean);
  const [first, ...rest] = words;
  const last = rest.pop();
  if (first && last) {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  }
  const cleanWord = (words[0] ?? '').replace(/[^a-zA-Z0-9]/g, '');
  if (cleanWord.length >= 1) {
    return cleanWord.slice(0, 2).toUpperCase();
  }
  const cleanEmail = (email ?? '').trim().replace(/[^a-zA-Z0-9]/g, '');
  if (cleanEmail.length >= 1) {
    return cleanEmail.slice(0, 2).toUpperCase();
  }
  return 'AD';
}

/**
 * Formats non-production environment labels and hides production badges.
 */
export function formatEnvBadgeLabel(env?: string | null): string {
  const normalized = (env ?? '').trim().toLowerCase();
  if (HIDDEN_ENV_VALUES.has(normalized)) {
    return '';
  }
  return normalized.toUpperCase();
}

