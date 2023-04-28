import Chance from 'chance';
import { BrowserContext, Locator, Page } from '@playwright/test';
import { Role } from '@prisma/client';
import { encode as encodeJwt } from 'next-auth/jwt';
import { nanoid } from 'nanoid';

import { UserFactory } from '~/prisma/factories/user';
import playwrightConfig from '~/playwright.config';
import { config } from '@/config';

const chance = new Chance();

export type SessionUser = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  roles: Role[];
};

const generateSessionToken = async (user: SessionUser, nowS: number): Promise<string> => {
  return encodeJwt({
    token: {
      email: user.email,
      sub: user.id,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
      },
      iat: nowS - 3600,
      exp: nowS + 7200,
      jti: nanoid(),
    },
    secret: config.auth.secret,
  });
};

export async function clickNewPage(
  context: BrowserContext,
  // the locator that, when clicked, will open a new page
  clickableTarget: Locator
): Promise<Page> {
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    // assume this opens the new tab
    clickableTarget.click(),
  ]);

  // the page doesn't seem to inherit the timeout from context, so setting it
  // here too
  newPage.setDefaultTimeout(playwrightConfig.timeout || 30000);
  newPage.setDefaultNavigationTimeout(playwrightConfig.timeout || 30000);

  await newPage.waitForLoadState();

  return newPage;
}

export async function uploadFile(page: Page, clickableTarget: Locator, filePath: string) {
  // Note that Promise.all prevents a race condition
  // between clicking and waiting for the file chooser.
  const [fileChooser] = await Promise.all([
    // It is important to call waitForEvent before click to set up waiting.
    page.waitForEvent('filechooser'),
    // Opens the file chooser.
    clickableTarget.click(),
  ]);

  await fileChooser.setFiles(filePath);
}

export async function loginAs(page: Page, userInitial: Partial<SessionUser>) {
  const nowMs = Date.now();
  const nowS = Math.floor(nowMs / 1000);

  const user = {
    email: chance.email(),
    firstName: chance.first(),
    lastName: chance.last(),
    roles: [Role.USER],
    ...userInitial,
  };

  const createArgs = {
    email: user.email,
    roles: user.roles,
    emailVerified: new Date().toISOString(),
    profile: {
      create: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    },
  };

  const userPrisma = await UserFactory.create(createArgs);

  const sessionToken = await generateSessionToken(
    {
      ...userPrisma,
      ...userPrisma.profile,
    },
    nowS
  );

  const context = page.context();

  await context.addCookies([
    {
      name: 'next-auth.session-token',
      value: sessionToken,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
      expires: nowS + 7200,
    },
  ]);

  return userPrisma;
}
