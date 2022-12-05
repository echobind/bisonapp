import Chance from 'chance';
import { Role } from '@prisma/client';

import { createUserFactory } from '@/prisma/generated/factories';
import { hashPassword } from '@/services/auth';

const chance = new Chance();

export const UserFactory = createUserFactory({
  email() {
    return chance.email();
  },
  password: hashPassword('test1234'),
  roles: { set: Role.USER },
  profile: {
    create: {
      firstName() {
        return chance.first();
      },
      lastName() {
        return chance.last();
      },
    },
  },
});
