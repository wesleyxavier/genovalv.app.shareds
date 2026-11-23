import { expect, test } from '@playwright/test';

test.describe('Shared Login Foundation E2E (US1-US4)', () => {
  test('US1: renders institutional shell, card, support links and has no horizontal overflow', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('genova-header')).toBeVisible();
    await expect(page.locator('genova-auth-card')).toContainText('Genova Cloud');
    await expect(page.locator('genova-auth-card')).toContainText('Admin Console • Acesso Restrito');
    await expect(page.locator('genova-footer')).toBeVisible();
    await expect(page.locator('#login-mfa')).toBeHidden();
    await expect(page.locator('#mfa-selector')).toBeHidden();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });

  test('US2: toggles password visibility, blocks invalid input, prevents double submit and handles success/error', async ({
    page,
  }) => {
    await page.goto('/?outcome=error');

    // Empty submit blocked
    await page.locator('#submit-btn').click();
    await expect(page.locator('#login-email #error-msg')).toContainText('Informe o e-mail corporativo.');
    await expect(page.locator('#login-password #error-msg')).toContainText('Informe sua senha.');

    // Toggle password visibility
    const pwdInput = page.locator('#login-password input');
    await expect(pwdInput).toHaveAttribute('type', 'password');
    await page.locator('#login-password button.toggle').click();
    await expect(pwdInput).toHaveAttribute('type', 'text');

    // Fill valid credentials and trigger error outcome (preserving email)
    await page.locator('#login-email input').fill('  Admin@Genova.Cloud ');
    await pwdInput.fill('MinhaSenha123');
    await page.locator('#submit-btn').click();

    await expect(page.locator('#form-alert')).toContainText('Credenciais inválidas');
    await expect(page.locator('#login-email input')).toHaveValue('Admin@Genova.Cloud');

    // Success outcome + double submit guard
    await page.goto('/?outcome=success');
    await page.locator('#login-email input').fill('admin@genova.cloud');
    await page.locator('#login-password input').fill('MinhaSenha123');

    const submitBtn = page.locator('#submit-btn');
    await submitBtn.click();
    await expect(submitBtn.locator('button')).toBeDisabled();
    await expect(page.locator('#form-alert')).toContainText('Acesso concedido');
  });

  test('US3: sanitizes pasted MFA code, enforces required mode and updates guidance on method switch', async ({
    page,
  }) => {
    await page.goto('/?mfaMode=required');

    const mfaInput = page.locator('#login-mfa input');
    await mfaInput.fill('12a3 45b678');
    await expect(mfaInput).toHaveValue('123456');

    await page.locator('genova-mfa-selector [data-method="yubikey"]').click();
    await expect(page.locator('genova-mfa-selector')).toContainText('YubiKey');
    await expect(page.locator('genova-mfa-selector')).toContainText('WebAuthn CTAP2');
  });

  test('US4: supports full keyboard navigation and live locale switching (pt-BR / en-US / es-ES)', async ({
    page,
  }) => {
    await page.goto('/');

    // Switch locale dynamically
    await page.locator('#locale-select select').selectOption('en-US');
    await expect(page.locator('#login-email label')).toHaveText('Corporate Email');
    await expect(page.locator('#submit-btn button')).toContainText('Sign In');

    await page.locator('#locale-select select').selectOption('es-ES');
    await expect(page.locator('#login-email label')).toHaveText('Correo Corporativo');
    await expect(page.locator('#submit-btn button')).toContainText('Iniciar sesión');

    // Keyboard traversal reaches email, password, toggle
    await page.locator('#login-email input').focus();
    await page.keyboard.type('user@genova.cloud');
    await page.keyboard.press('Tab'); // forgot link
    await page.keyboard.press('Tab'); // password input
    await page.keyboard.type('Secret123');
    await page.keyboard.press('Tab'); // toggle password
    await page.keyboard.press('Space');
    await expect(page.locator('#login-password input')).toHaveAttribute('type', 'text');
  });
});
