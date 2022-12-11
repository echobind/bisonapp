import Chance from 'chance';
import { Prisma } from '@prisma/client';

import { prisma, UserWithRelations } from '@/lib/prisma';
import { hashPassword } from '@/services/auth';

const chance = new Chance();

type FactoryUpsertArgs = {
  where: Prisma.UserUpsertArgs['where'];
  createArgs: Partial<Prisma.UserUpsertArgs['create']>;
  updateArgs: Prisma.UserUpsertArgs['update'];
  include?: Prisma.UserUpsertArgs['include'];
};

export const UserFactory = {
  build: (
    args: Partial<Prisma.UserCreateArgs['data']> = {},
    include: Prisma.UserCreateArgs['include'] = {}
  ): Prisma.UserCreateArgs => {
    const password = args.password ? hashPassword(args.password) : hashPassword('test1234');

    return {
      data: {
        email: chance.email(),
        profile: {
          create: {
            firstName: chance.first(),
            lastName: chance.last(),
          },
        },
        ...args,
        password,
      },

      include: { ...include, profile: true },
    };
  },

  create: async (
    args: Partial<Prisma.UserCreateArgs['data']> = {},
    include: Prisma.UserCreateArgs['include'] = {}
  ): Promise<UserWithRelations> => {
    const userArgs = UserFactory.build(args, include);
    const user = await prisma.user.create(userArgs);
    return user;
  },

  upsert: async ({ where, createArgs = {}, updateArgs = {}, include = {} }: FactoryUpsertArgs) => {
    // Grab Build Defaults for Create
    const userArgs = UserFactory.build(createArgs, include);
    const defaultIncludes = { ...include, profile: true };

    return await prisma.user.upsert({
      where,
      create: userArgs.data,
      include: defaultIncludes,
      update: updateArgs,
    });
  },
};
