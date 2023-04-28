// https://playwright.dev/docs/next/auth#multiple-signed-in-roles
import { Page, test, expect } from '@playwright/test';
import { Role } from '@prisma/client';

import { loginAs } from './helpers';

import { resetDB } from '~/tests/helpers/db';
import { disconnect } from '@/lib/prisma';

test.beforeEach(async () => resetDB());
test.afterAll(async () => disconnect());

test.describe(() => {
  test('Can login as a User', async ({ page }: { page: Page }) => {
    const firstName = 'Qwerty';
    await loginAs(page, { roles: [Role.USER], firstName });

    await page.goto('/');
    await page.waitForSelector('internal:attr=[data-testid="welcome-header"]');

    const welcomeHeader = page.getByTestId('welcome-header');
    const welcomeMsg = `Welcome, ${firstName}!`;
    await expect(welcomeHeader).toContainText(welcomeMsg, { ignoreCase: true });
  });
});

test.describe(() => {
  test('Can login as an Admin', async ({ page }: { page: Page }) => {
    const firstName = 'Zxcv';
    await loginAs(page, { roles: [Role.ADMIN], firstName });

    await page.goto('/');
    await page.waitForSelector('internal:attr=[data-testid="welcome-header"]');

    const welcomeHeader = page.getByTestId('welcome-header');
    const welcomeMsg = `Welcome, ${firstName}!`;
    await expect(welcomeHeader).toContainText(welcomeMsg, { ignoreCase: true });
  });
});
