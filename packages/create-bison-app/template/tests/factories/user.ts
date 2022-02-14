import Chance from 'chance';
import { Role, Prisma } from '@prisma/client';

import { buildPrismaIncludeFromAttrs } from '@/tests/helpers/buildPrismaIncludeFromAttrs';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/services/auth';

const chance = new Chance();

export const UserFactory = {
  build: (attrs: Partial<Prisma.UserCreateInput> = {}) => {
    return {
      email: chance.email(),
      password: 'test1234',
      roles: { set: [Role.USER] },
      ...attrs,
    };
  },

  create: async (attrs: Partial<Prisma.UserCreateInput> = {}) => {
    const user = UserFactory.build(attrs);
    const options: Partial<Prisma.UserCreateArgs> = {};
    const includes = buildPrismaIncludeFromAttrs(attrs);
    if (includes) options.include = includes;

    return await prisma.user.create({
      data: { ...user, password: hashPassword(user.password), roles: user.roles },
      ...options,
    });
  },
};
