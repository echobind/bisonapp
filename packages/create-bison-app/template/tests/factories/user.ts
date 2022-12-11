import Chance from 'chance';
import { Prisma, Role } from '@prisma/client';

import { prisma, UserWithRelations } from '@/lib/prisma';
import { hashPassword } from '@/services/auth';
import { defaultUserSelect } from '@/server/routers/user';

const chance = new Chance();

type FactoryUpsertArgs = {
  where: Prisma.UserUpsertArgs['where'];
  createArgs: Partial<Prisma.UserUpsertArgs['create']>;
  updateArgs: Prisma.UserUpsertArgs['update'];
  select?: Prisma.UserUpsertArgs['select'];
};

export const UserFactory = {
  build: (
    args: Partial<Prisma.UserCreateArgs['data']> = {},
    select: Prisma.UserCreateArgs['select'] = {}
  ): Prisma.UserCreateArgs => {
    const password = args.password ? hashPassword(args.password) : hashPassword('test1234');
    const defaultSelect = { ...select, ...defaultUserSelect };

    return {
      data: {
        email: chance.email(),
        roles: { set: [Role.USER] },
        profile: {
          create: {
            firstName: chance.first(),
            lastName: chance.last(),
          },
        },
        ...args,
        password,
      },

      select: defaultSelect,
    };
  },

  create: async (
    args: Partial<Prisma.UserCreateArgs['data']> = {},
    select: Prisma.UserCreateArgs['select'] = {}
  ): Promise<UserWithRelations> => {
    const userArgs = UserFactory.build(args, select);

    const user = (await prisma.user.create(userArgs)) as UserWithRelations;
    return user;
  },

  upsert: async ({ where, createArgs = {}, updateArgs = {}, select = {} }: FactoryUpsertArgs) => {
    // Grab Build Defaults for Create
    const userArgs = UserFactory.build(createArgs, select);
    const password = updateArgs.password ? hashPassword(updateArgs.password as string) : undefined;

    return await prisma.user.upsert({
      where,
      create: userArgs.data,
      select: userArgs.select,
      update: { ...updateArgs, password },
    });
  },
};
