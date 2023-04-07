// https://playwright.dev/docs/next/auth#multiple-signed-in-roles
import { Page, test, expect } from '@playwright/test';

import { resetDB } from '@/tests/helpers/db';
import { disconnect } from '@/lib/prisma';

import { ADMIN, USER } from './constants';

test.beforeEach(async () => resetDB());
test.afterAll(async () => disconnect());

test.describe(() => {
  test.use({ storageState: USER.storageState });

  test('Can Login as a User', async ({ page }: { page: Page }) => {
    await page.goto('/');
    await page.waitForSelector('internal:attr=[data-testid="welcome-header"]');

    const welcomeHeader = await page.getByTestId('welcome-header');
    const welcomeMsg = `Welcome, ${USER.firstName}!`;
    await expect(welcomeHeader).toContainText(welcomeMsg, { ignoreCase: true });
  });
});

test.describe(() => {
  test.use({ storageState: ADMIN.storageState });
  test('Can Login as an Admin', async ({ page }: { page: Page }) => {
    await page.goto('/');
    await page.waitForSelector('internal:attr=[data-testid="welcome-header"]');

    const welcomeHeader = await page.getByTestId('welcome-header');
    const welcomeMsg = `Welcome, ${ADMIN.firstName}!`;
    await expect(welcomeHeader).toContainText(welcomeMsg, { ignoreCase: true });
  });
});
