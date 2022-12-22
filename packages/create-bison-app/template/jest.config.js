const { pathsToModuleNameMapper } = require('ts-jest/utils');

const { compilerOptions } = require('./tsconfig.json');

// this creates a module name map based on all the path aliases from tsconfig
// (so you only need to add path aliases in tsconfig, not here).
const moduleNameMapper = compilerOptions.paths
  ? pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/../' })
  : {};

const testPathIgnorePatterns = ['<rootDir>/node_modules', 'factories', 'helpers', 'tests/e2e'];

/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  rootDir: 'tests',
  // setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
  globalSetup: '<rootDir>/jest.setup.js',
  globalTeardown: '<rootDir>/jest.teardown.js',
  testPathIgnorePatterns,
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react-jsx',
      },
    },
  },
  transformIgnorePatterns: ['/node_modules/(?!(@swc|@trpc))/'],
  moduleNameMapper: {
    ...moduleNameMapper,
    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i': `<rootDir>/__mocks__/fileMock.js`,
  },
};
