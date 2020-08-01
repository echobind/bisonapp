const testPathIgnorePatterns = [
  '<rootDir>/node_modules',
  'cypress',
  'factories',
  'helpers',
  'tests/e2e',
];

module.exports = {
  preset: 'ts-jest',
  rootDir: 'tests',
  // testEnvironment: join(__dirname, 'tests', 'nexus-test-environment.js'),
  // setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
  globalSetup: '<rootDir>/jest.setup.js',
  globalTeardown: '<rootDir>/jest.teardown.js',
  testPathIgnorePatterns,
  globals: {
    'ts-jest': {
      tsConfig: {
        jsx: 'react',
      },
    },
  },
};
