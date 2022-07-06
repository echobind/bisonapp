import { defineConfig } from 'cypress';

import { setupNodeEvents } from './cypress/plugins';

export default defineConfig({
  fixturesFolder: false,
  e2e: {
    setupNodeEvents,
    baseUrl: 'http://localhost:3001',
    specPattern: 'tests/e2e/**/*.cy.{ts,tsx}',
    excludeSpecPattern: ['tsconfig.json'],
  },
});
