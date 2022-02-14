/// <reference types="cypress" />

// import 'cypress';
import path from 'path';

import { User } from '@prisma/client';

import { cookies } from '@/lib/cookies';
import { LOGIN_TOKEN_KEY } from '@/constants';
import { resetDB, disconnect, setupDB, graphQLRequest } from '@/tests/helpers';
import * as Factories from '@/tests/factories';

declare global {
  // eslint-disable-next-line
  namespace Cypress {
    interface Chainable<Subject = any> {
      task<T>(event: string, arg?: any, options?: Partial<Loggable & Timeoutable>): Chainable<T>;
    }
  }
}

// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

if (process.env.CYPRESS_LOCAL) {
  console.log('--- WARNING --- RUNNING CYPRESS IN LOCAL MODE... database will not be cleaned');

  // make sure we source env.local
  const envPath = path.resolve(process.cwd(), '.env.local');
  require('dotenv').config({ path: envPath });
} else if (!process.env.DATABASE_URL) {
  const envPath = path.resolve(process.cwd(), '.env.test');
  require('dotenv').config({ path: envPath });
}

/**
 * @type {Cypress.PluginConfig}
 */
export default (on, _config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('before:run', () => {
    return setupDB();
  });

  on('task', {
    resetDB: () => {
      if (process.env.CYPRESS_LOCAL) return false;

      return resetDB();
    },
    setupDB: () => {
      console.log('Setting up DB', process.env.DATABASE_URL);

      return setupDB();
    },
    disconnectDB: () => {
      return disconnect();
    },
    factory: ({ name, attrs }) => {
      const Factory = Factories[`${name}Factory`];
      return Factory.create(attrs);
    },
    login: (attrs: Pick<User, 'email' | 'password'>): Promise<LoginTaskObject> => {
      const { email, password } = attrs;
      const variables = { email, password };

      const query = `
        mutation login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token
          }
        }
      `;

      return graphQLRequest({ query, variables }).then((response) => {
        const { token } = response.body.data.login;

        cookies().set(LOGIN_TOKEN_KEY, token);

        return { token };
      });
    },
  });
};

export interface LoginTaskObject {
  token: string;
}
