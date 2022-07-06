/// <reference types="cypress" />
// ***********************************************
// For comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import '@testing-library/cypress/add-commands';

import { Prisma, User } from '@prisma/client';

import { LOGIN_TOKEN_KEY } from '@/constants';
import { LoginTaskObject } from '@/cypress/plugins';

declare global {
  namespace Cypress {
    interface Chainable {
      login: typeof login;
      createUserAndLogin: typeof createUserAndLogin;
    }
  }
}

/**
 *  Handles logging a user in via email and password.
 *  This should be used to login in future e2e tests instead of the login form.
 */
function login(attrs: Pick<User, 'email' | 'password'>) {
  const { email, password } = attrs;
  return cy
    .task<LoginTaskObject>('login', { email, password })
    .then(({ token }) => {
      return cy.setCookie(LOGIN_TOKEN_KEY, token).then(() => token);
    });
}

/**
 *  Handles creating and logging in a user with a set of attributes
 *  This should be used to login in future e2e tests instead of the login form.
 */
function createUserAndLogin(args: Partial<Prisma.UserCreateInput> = {}) {
  const attrs = {
    ...args,
    password: args?.password || 'abcd1234',
  };

  return cy.task<User>('factory', { name: 'User', attrs }).then((user) => {
    return login({ email: user.email, password: attrs.password }).then(() => user);
  });
}

Cypress.Commands.add('login', login);
Cypress.Commands.add('createUserAndLogin', createUserAndLogin);
