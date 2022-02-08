import { Prisma, Role } from '@prisma/client';

import { hashPassword } from '@/services/auth';
// *********************************************
// ** DEVELOPMENT DATA SET
// *********************************************

const INITIAL_PASSWORD = 'test1234';

const initialDevUsers: Prisma.UserCreateInput[] = [
  {
    email: 'barry.allen@speedforce.net',
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

const initialProdUsers: Prisma.UserCreateInput[] = [
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

export const userSeedData: Prisma.UserCreateInput[] =
  appEnv === 'production' ? initialProdUsers : initialDevUsers;
