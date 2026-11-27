import { css } from 'lit';

export const appHeaderLayoutStyles = css`
  :host { display: block; width: 100%; position: relative; z-index: 30; }
  :host([hidden]) { display: none; }
  .bar {
    height: 4rem; width: 100%; background: var(--gnv-surface-container-lowest, #ffffff);
    border-bottom: 1px solid var(--gnv-outline-variant, #e7e2d8);
    padding: 0 1.25rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  }
  .left { display: flex; align-items: center; gap: 1.5rem; min-width: 0; }
  .brand { display: inline-flex; align-items: center; text-decoration: none; flex-shrink: 0; border-radius: 0.5rem; }
  .nav { display: flex; align-items: center; gap: 0.5rem; }
  .nav-group { position: relative; display: inline-flex; align-items: center; height: 4rem; }
  .nav-item {
    display: inline-flex; align-items: center; gap: 0.375rem; height: 2.25rem; padding: 0 0.75rem;
    border-radius: 0.5rem; border: 0; background: transparent; text-decoration: none;
    color: var(--gnv-on-surface-variant, #475569); font-family: inherit; font-size: 0.8125rem;
    font-weight: 500; cursor: pointer; white-space: nowrap; transition: background 0.15s ease, color 0.15s ease;
  }
  .nav-item:hover:not([aria-disabled='true']):not(:disabled) {
    background: var(--gnv-surface, #faf7f0); color: var(--gnv-on-surface, #0f172a);
  }
  .nav-item.active { background: var(--gnv-primary-tint, #f1eefc); color: var(--gnv-primary, #715faf); font-weight: 600; }
  .nav-item[aria-disabled='true'], .nav-item:disabled { opacity: 0.5; cursor: not-allowed; }
  .active-bar {
    position: absolute; left: 0.625rem; right: 0.625rem; bottom: 0; height: 3px;
    border-radius: 9999px; background: var(--gnv-success, #3fa37c);
  }
  .right { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }
  .search-wrap {
    display: inline-flex; align-items: center; gap: 0.5rem; height: 2.25rem; width: 13.75rem;
    padding: 0 0.5rem 0 0.625rem; border-radius: 0.5rem;
    background: var(--gnv-surface, #faf7f0); border: 1px solid var(--gnv-outline-variant, #e7e2d8);
    color: var(--gnv-text-muted, #64748b);
  }
  .search-wrap.disabled { opacity: 0.65; cursor: not-allowed; }
  .search-input {
    border: 0; background: transparent; outline: none; width: 100%; min-width: 0;
    font-family: inherit; font-size: 0.8125rem; color: var(--gnv-on-surface, #0f172a);
  }
  .search-input:disabled { cursor: not-allowed; color: var(--gnv-text-muted, #64748b); }
  .shortcut {
    padding: 0.125rem 0.375rem; border-radius: 0.3125rem; background: #ffffff;
    border: 1px solid var(--gnv-outline-variant, #e7e2d8); font-size: 0.625rem;
    font-weight: 600; color: var(--gnv-on-surface-variant, #475569); white-space: nowrap;
  }
  .env-badge {
    display: inline-flex; align-items: center; height: 1.375rem; padding: 0 0.5rem; border-radius: 0.375rem;
    background: #e9edf8; border: 1px solid #c3ceeb; color: #2f4a8c;
    font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.02em; white-space: nowrap;
  }
  .bell-btn {
    position: relative; width: 2.25rem; height: 2.25rem; border-radius: 9999px; border: 0;
    background: transparent; color: var(--gnv-on-surface-variant, #475569);
    display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
  }
  .bell-btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .bell-count {
    position: absolute; top: 0.125rem; right: 0.125rem; min-width: 1rem; height: 1rem; padding: 0 0.25rem;
    border-radius: 9999px; background: var(--gnv-danger, #bc3737); color: #ffffff;
    font-size: 0.625rem; font-weight: 700; display: inline-flex; align-items: center; justify-content: center;
  }
  .avatar-btn {
    width: 2.25rem; height: 2.25rem; border-radius: 9999px; border: 0; cursor: pointer;
    background: var(--gnv-primary, #715faf); color: #ffffff;
    font-family: inherit; font-size: 0.75rem; font-weight: 700;
    display: inline-flex; align-items: center; justify-content: center;
  }
  .mobile-toggle {
    display: none; width: 2.25rem; height: 2.25rem; border-radius: 0.5rem;
    border: 1px solid var(--gnv-outline-variant, #e7e2d8); background: var(--gnv-surface, #faf7f0);
    color: var(--gnv-on-surface, #0f172a); align-items: center; justify-content: center; cursor: pointer;
  }
  @media (max-width: 1023px) {
    .nav, .search-wrap { display: none; }
    .mobile-toggle { display: inline-flex; }
  }
  @media (max-width: 639px) {
    .env-badge, .bell-btn, .user-desktop { display: none; }
  }
`;
