import { hashPassword } from '../../../services/auth';
import { Role, UserCreateInput } from '../../../types';

// *********************************************
// ** DEVELOPMENT DATA SET
// *********************************************

const INITIAL_PASSWORD = 'test1234';

const initialDevUsers: UserCreateInput[] = [
  {
    email: 'ballen@speedforce.net',
    password: hashPassword(INITIAL_PASSWORD),
    roles: [Role.ADMIN],
    profile: {
      create: {
        firstName: 'Barry',
        lastName: 'Allen',
      },
    },
  },
];

// *********************************************
// ** PRODUCTION DATA SET
// *********************************************

const INITIAL_PROD_PASSWORD = 'strong@password';

const initialProdUsers: UserCreateInput[] = [
  {
    email: 'apps@echobind.com',
    password: hashPassword(INITIAL_PROD_PASSWORD),
    roles: [Role.ADMIN],
    profile: {
      create: {
        firstName: 'EB',
        lastName: 'Admin',
      },
    },
  },
];

// *********************************************
// ** MAIN DATA EXPORT
// *********************************************

const appEnv = process.env.APP_ENV || 'development';

export const userCreateData: UserCreateInput[] =
  appEnv === 'production' ? initialProdUsers : initialDevUsers;
