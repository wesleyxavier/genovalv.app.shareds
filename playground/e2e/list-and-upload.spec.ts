import { expect, test } from '@playwright/test';

const LIST_URL = '/iframe.html?id=etapa-1-08-list-upload--list-toolbar-and-pagination';
const MODAL_URL = '/iframe.html?id=etapa-1-08-list-upload--support-access-modal-with-dropzone';

test.describe('Shared List Toolbar, Pagination & Dropzone Modal E2E', () => {
  test('renders list toolbar and pagination with zero horizontal overflow', async ({ page }) => {
    await page.goto(LIST_URL);
    await expect(page.locator('genova-list-toolbar')).toBeVisible();
    await expect(page.locator('genova-pagination')).toContainText('1–10 de 24');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });

  test('renders 560px support modal with file dropzone and attached file', async ({ page }) => {
    await page.goto(MODAL_URL);
    const dialog = page.locator('genova-modal [role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(page.locator('genova-file-dropzone')).toContainText('autorizacao-lgpd-assinada.pdf');
  });
});
