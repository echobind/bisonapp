import { Prisma } from '@prisma/client';

import { hashPassword } from '@/services/auth';
import { Role } from '@/types';
import { seedUsers } from '@/prisma/seeds/users';
import { prisma } from '@/lib/prisma';

// HR: Hey, we've had a few more employees join -- can you create an account for them?!

const INITIAL_PASSWORD = 'test1234';

const main = async () => {
  const newEmployees: Prisma.UserCreateInput[] = [
    {
      profile: {
        create: {
          firstName: 'Cisco',
          lastName: 'Ramon',
        },
      },
      email: 'cisco.ramon@speedforce.net',
      password: hashPassword(INITIAL_PASSWORD),
      roles: [Role.ADMIN],
    },
    {
      profile: {
        create: {
          firstName: 'Caitlin',
          lastName: 'Snow',
        },
      },
      email: 'caitlin.snow@speedforce.net',
      password: hashPassword(INITIAL_PASSWORD),
      roles: [Role.ADMIN],
    },
    {
      profile: {
        create: {
          firstName: 'Harrison',
          lastName: 'Wells',
        },
      },
      email: 'harrison.wells@speedforce.net',
      password: hashPassword(INITIAL_PASSWORD),
      roles: [Role.ADMIN],
    },
  ];

  await seedUsers(newEmployees);
};

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
