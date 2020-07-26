const { join } = require('path');
const testPathIgnorePatterns = [
  '<rootDir>/node_modules',
  'cypress',
  'factories',
  'helpers',
  'tests/nexus-tes-environment.js',
];

module.exports = {
  preset: 'ts-jest',
  rootDir: 'tests',
  testEnvironment: join(__dirname, 'tests', 'nexus-test-environment.js'),
  // setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
  testPathIgnorePatterns,
  globals: {
    'ts-jest': {
      tsConfig: {
        jsx: 'react',
      },
    },
  },
};
