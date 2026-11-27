import { expect, test } from '@playwright/test';

const ADMIN_HEADER_URL = '/iframe.html?id=etapa-1-04-app-header--admin-default';
const PROD_HEADER_URL = '/iframe.html?id=etapa-1-04-app-header--production-environment';

test.describe('Shared App Header E2E', () => {
  test('renders Admin header, toggles Cadastros dropdown and AD popover with zero overflow', async ({
    page,
    isMobile,
  }) => {
    await page.goto(ADMIN_HEADER_URL);
    const header = page.locator('genova-app-header');
    await expect(header).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);

    if (isMobile) {
      await header.locator('[data-testid="mobile-menu-toggle"]').click();
      const mobilePanel = header.locator('[data-testid="mobile-menu-panel"]');
      await expect(mobilePanel).toBeVisible();
      await expect(mobilePanel).toContainText('Usuários');
      await expect(mobilePanel).toContainText('Acessar sandbox');
    } else {
      await expect(header.locator('[data-testid="env-badge"]')).toContainText('DEVELOPMENT');
      await header.locator('[data-nav-id="registrations"]').click();
      await expect(header.locator('[data-sub-id="users"]')).toBeVisible();
      await expect(header.locator('[data-sub-id="companies"]')).toBeDisabled();

      await header.locator('[data-testid="user-avatar-btn"]').click();
      await expect(header.locator('[data-user-item-id="account"]')).toBeDisabled();
      await expect(header.locator('[data-user-item-id="sandbox"]')).toBeEnabled();
    }
  });

  test('hides environment badge in production', async ({ page }) => {
    await page.goto(PROD_HEADER_URL);
    const header = page.locator('genova-app-header');
    await expect(header).toBeVisible();
    await expect(header.locator('[data-testid="env-badge"]')).toHaveCount(0);
  });
});
