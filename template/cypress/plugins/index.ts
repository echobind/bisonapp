import path from 'path';

import { resetDB, disconnect, setupDB } from '../../tests/helpers';
import * as Factories from '../../tests/factories';

/// <reference types="cypress" />
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

  // if DATABASE_URL isn't already defined, source local .env.test
  if (!process.env.DATABASE_URL) {
    const envPath = path.resolve(process.cwd(), '.env.local');
    require('dotenv').config({ path: envPath });
  }
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
  on('task', {
    resetDB: () => {
      if (process.env.CYPRESS_LOCAL) return false;

      return resetDB();
    },
    setupDB: () => {
      console.log('DB', process.env.DATABASE_URL);

      return setupDB();
    },
    disconnectDB: () => {
      return disconnect();
    },
    factory: ({ name, attrs }) => {
      const Factory = Factories[`${name}Factory`];
      return Factory.create(attrs);
    },
  });
};
