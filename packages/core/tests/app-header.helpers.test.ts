import { describe, expect, it } from 'vitest';
import { formatEnvBadgeLabel, getUserInitials } from '../src';

describe('app-header helpers', () => {
  it('derives two uppercase initials from fullName words', () => {
    expect(getUserInitials('Wesley Xavier')).toBe('WX');
    expect(getUserInitials('  Maria   Clara  Souza ')).toBe('MS');
  });

  it('derives two letters from single-word name or email fallback', () => {
    expect(getUserInitials('Administrador')).toBe('AD');
    expect(getUserInitials('', 'carlos@genova.app')).toBe('CA');
    expect(getUserInitials('  ', '  ')).toBe('AD');
    expect(getUserInitials('X', null)).toBe('X');
    expect(getUserInitials(null, 'a@b.c')).toBe('AB');
    expect(getUserInitials(null, null)).toBe('AD');
  });

  it('formats environment badge and hides it in production', () => {
    expect(formatEnvBadgeLabel('development')).toBe('DEVELOPMENT');
    expect(formatEnvBadgeLabel(' staging ')).toBe('STAGING');
    expect(formatEnvBadgeLabel('production')).toBe('');
    expect(formatEnvBadgeLabel('PROD')).toBe('');
    expect(formatEnvBadgeLabel('')).toBe('');
    expect(formatEnvBadgeLabel(undefined)).toBe('');
  });
});

