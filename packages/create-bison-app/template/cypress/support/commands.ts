import '@testing-library/cypress/add-commands';

import { Prisma, User } from '@prisma/client';

import { LOGIN_TOKEN_KEY } from '@/constants';
import { LoginTaskObject } from '@/cypress/plugins';

declare global {
  // eslint-disable-next-line
  namespace Cypress {
    interface Chainable {
      login: typeof login;
    }
  }
}

// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

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
function createUserAndLogin(args: Prisma.UserCreateInput) {
  const attrs = {
    ...args,
    password: args?.password || 'abcd1234',
  };

  return cy.task('factory', { name: 'User', attrs }).then((user: User) => {
    return login({ email: user.email, password: attrs.password }).then(() => user);
  });
}

Cypress.Commands.add('login', login);
Cypress.Commands.add('createUserAndLogin', createUserAndLogin);
