/// <reference types="cypress" />
// ***********************************************
// For comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import '@testing-library/cypress/add-commands';

import { Prisma, Profile, Role, User } from '@prisma/client';
import { Session } from 'next-auth';

declare global {
  type PrismaUser = User & { roles: Role[]; profile: Profile | null };

  // see next-auth.d.ts
  interface NextAuthSession extends Session {
    user: PrismaUser;
    isAdmin: boolean;
    idToken?: string;
    accessToken?: string;
  }

  namespace Cypress {
    interface Chainable {
      login(user: NextAuthSession['user']): Chainable<NextAuthSession>;
      createUserAndLogin(args?: Partial<Prisma.UserCreateInput>): Chainable<NextAuthSession>;
    }
  }
}
/**
 *  Handles logging a user in via email and password.
 *  This should be used to login in future e2e tests instead of the login form.
 */

const login = (user: PrismaUser) => {
  return cy.task<NextAuthSession>('mockValidSession', { user }).then((session) => {
    cy.intercept('/api/auth/session', { body: session, statusCode: 200 }).as('session');

    cy.intercept('/api/auth/callback/credentials?', {
      fixture: 'credentials_success.json',
    }).as('credentials');

    // Make this "Chainable"
    return Promise.resolve(session);
  });
};
/**
 *  Handles creating and logging in a user with a set of attributes
 *  This should be used to login in future e2e tests instead of the login form.
 */
const createUserAndLogin = (args: Partial<Prisma.UserCreateInput> = {}) => {
  const attrs = {
    ...args,
    password: args?.password || 'abcd1234',
  };

  return cy
    .task<NextAuthSession['user']>('factory', { name: 'User', attrs })
    .then((user) => cy.login(user));
};

Cypress.Commands.add('login', login);
Cypress.Commands.add('createUserAndLogin', createUserAndLogin);
