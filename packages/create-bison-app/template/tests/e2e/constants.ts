export const APP_URL = process.env.BASE_URL || 'http://localhost:3001';
export const LOGIN_URL = `${APP_URL}/login`;

export const storageDir = './tests/e2e/temp';

export const ADMIN = {
  email: 'brainiac@lex.com',
  firstName: 'Lex',
  lastName: 'Luther',
  password: '1amBrainiac!',
  storageState: `${storageDir}/adminStorageState.json`,
};
export const USER = {
  email: 'clark@thedaily.com',
  firstName: 'Clark',
  lastName: 'Kent',
  password: 'krypton8!',
  storageState: `${storageDir}/userStorageState.json`,
};
