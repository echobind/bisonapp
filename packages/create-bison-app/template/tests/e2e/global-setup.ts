import { chromium, FullConfig } from '@playwright/test';
import { Prisma, Role } from '@prisma/client';

import { UserFactory } from '../factories';

import { ADMIN, APP_URL, LOGIN_URL, USER } from './constants';

async function globalSetup(_config: FullConfig) {
  // There's a case where a config/setup may fail in which case teardown doesn't fire
  // Upsert here to avoid manual cleanup when testing locally.
  const adminArgs: Prisma.UserCreateInput = {
    email: ADMIN.email,
    emailVerified: new Date().toISOString(),
    roles: [Role.ADMIN],
    password: ADMIN.password,
    profile: {
      create: {
        firstName: ADMIN.firstName,
        lastName: ADMIN.lastName,
      },
    },
  };

  const _adminUser = await UserFactory.upsert({
    where: { email: ADMIN.email },
    createArgs: adminArgs,
    updateArgs: {
      ...adminArgs,
      profile: { update: { firstName: ADMIN.firstName, lastName: ADMIN.lastName } },
    },
  }).catch((e) => console.log({ e }));

  const userArgs: Prisma.UserCreateInput = {
    email: USER.email,
    emailVerified: new Date().toISOString(),
    roles: [Role.USER],
    password: USER.password,
    accounts: {},
    profile: {
      create: {
        firstName: USER.firstName,
        lastName: USER.lastName,
      },
    },
  };

  const _user = await UserFactory.upsert({
    where: { email: USER.email },
    createArgs: userArgs,
    updateArgs: {
      ...userArgs,
      profile: { update: { firstName: USER.firstName, lastName: USER.lastName } },
    },
  }).catch((e) => console.log({ e }));

  const browser = await chromium.launch();
  const adminPage = await browser.newPage();
  await adminPage.goto(LOGIN_URL);
  await adminPage.getByTestId('login-email').fill(ADMIN.email);
  await adminPage.getByTestId('login-password').fill(ADMIN.password);
  await adminPage.getByTestId('login-submit').click();
  await adminPage.waitForNavigation();
  await adminPage.waitForURL((url) => url.origin === APP_URL, { waitUntil: 'networkidle' });
  await adminPage.context().storageState({ path: ADMIN.storageState });

  const userPage = await browser.newPage();
  await userPage.goto(LOGIN_URL);
  await userPage.getByTestId('login-email').fill(USER.email);
  await userPage.getByTestId('login-password').fill(USER.password);
  await userPage.getByTestId('login-submit').click();
  await userPage.waitForNavigation();
  await userPage.waitForURL((url) => url.origin === APP_URL, { waitUntil: 'networkidle' });
  await userPage.context().storageState({ path: USER.storageState });
  await browser.close();
}

export default globalSetup;
