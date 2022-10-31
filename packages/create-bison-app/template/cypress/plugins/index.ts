import path from 'path';

import { User } from '@prisma/client';

import { cookies } from '@/lib/cookies';
import { LOGIN_TOKEN_KEY } from '@/constants';
import { resetDB, disconnect, setupDB, trpcRequest } from '@/tests/helpers';
import * as Factories from '@/tests/factories';

export interface LoginTaskObject {
  token: string;
}

type FactoryNames = keyof typeof Factories extends `${infer T}Factory` ? T : never;

if (process.env.CYPRESS_LOCAL) {
  console.log('--- WARNING --- RUNNING CYPRESS IN LOCAL MODE... database will not be cleaned');

  // make sure we source env.local
  const envPath = path.resolve(process.cwd(), '.env.local');
  require('dotenv').config({ path: envPath });
} else if (!process.env.DATABASE_URL) {
  const envPath = path.resolve(process.cwd(), '.env.test');
  require('dotenv').config({ path: envPath });
}

export const setupNodeEvents: Cypress.ConfigOptions['setupNodeEvents'] = (on, _config) => {
  on('before:run', async () => {
    await setupDB();
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
    factory: ({ name, attrs }: { name: FactoryNames; attrs: any }) => {
      const Factory = Factories[`${name}Factory`];

      return Factory.create(attrs);
    },
    login: async (attrs: Pick<User, 'email' | 'password'>): Promise<LoginTaskObject> => {
      const { email, password } = attrs;
      const variables = { email, password };

      const response = await trpcRequest().user.login(variables);
      const { token } = response;
      cookies().set(LOGIN_TOKEN_KEY, token);
      return { token };
    },
  });
};
