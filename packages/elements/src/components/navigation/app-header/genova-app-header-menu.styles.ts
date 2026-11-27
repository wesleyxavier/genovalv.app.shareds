import { css } from 'lit';

export const appHeaderMenuStyles = css`
  .user-wrap { position: relative; display: inline-flex; align-items: center; }
  .dropdown, .popover {
    position: absolute; top: calc(100% + 0.375rem); right: 0; z-index: 40;
    background: #ffffff; border: 1px solid var(--gnv-outline-variant, #e7e2d8);
    border-radius: 0.75rem; box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12); padding: 0.375rem;
  }
  .dropdown { left: 0; right: auto; min-width: 12.5rem; top: calc(100% - 0.375rem); }
  .popover { width: 15.5rem; padding: 0.5rem; }
  .popover-head { padding: 0.5rem 0.625rem 0.625rem; }
  .popover-name { margin: 0; font-size: 0.8125rem; font-weight: 700; color: var(--gnv-on-surface, #0f172a); }
  .popover-email { margin: 0.125rem 0 0; font-size: 0.75rem; color: var(--gnv-text-muted, #64748b); word-break: break-all; }
  .divider { height: 1px; background: var(--gnv-outline-variant, #e7e2d8); margin: 0.375rem 0; }
  .menu-item {
    display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; width: 100%;
    text-align: left; border: 0; background: transparent; text-decoration: none;
    padding: 0.5rem 0.625rem; border-radius: 0.5rem; font-family: inherit;
    font-size: 0.8125rem; font-weight: 500; color: var(--gnv-on-surface, #0f172a); cursor: pointer;
  }
  .menu-item:hover:not([aria-disabled='true']):not(:disabled) { background: var(--gnv-surface, #faf7f0); }
  .menu-item.active { background: var(--gnv-primary-tint, #f1eefc); color: var(--gnv-primary, #715faf); font-weight: 600; }
  .menu-item.highlight { background: var(--gnv-primary-tint, #f1eefc); color: var(--gnv-primary, #715faf); }
  .menu-item.danger { color: var(--gnv-danger, #bc3737); font-weight: 600; }
  .menu-item[aria-disabled='true'], .menu-item:disabled { opacity: 0.5; cursor: not-allowed; }
  .item-left { display: flex; align-items: flex-start; gap: 0.5rem; min-width: 0; }
  .item-icon { display: inline-flex; margin-top: 0.1rem; flex-shrink: 0; }
  .item-desc { display: block; font-size: 0.6875rem; font-weight: 400; color: var(--gnv-text-muted, #64748b); margin-top: 0.1rem; }
  .mobile-panel {
    border-top: 1px solid var(--gnv-outline-variant, #e7e2d8); background: #ffffff;
    padding: 0.875rem 1.25rem 1rem; display: grid; gap: 0.625rem;
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
  }
  .mobile-search { width: 100%; display: flex; }
  .mobile-group { display: grid; gap: 0.25rem; }
  .mobile-children { padding-left: 1rem; display: grid; gap: 0.25rem; border-left: 2px solid var(--gnv-outline-variant, #e7e2d8); margin-left: 0.5rem; }
  .mobile-meta { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; padding: 0.25rem 0; }
`;
