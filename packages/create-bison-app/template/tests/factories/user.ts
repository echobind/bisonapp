import Chance from 'chance';
import { User, Role } from '@prisma/client';

import { buildPrismaIncludeFromAttrs, prisma } from '../helpers';
import { hashPassword } from '../../services/auth';

const chance = new Chance();

interface UserAttrs extends Omit<Partial<User>, 'roles'> {
  roles?: { set: Role[] };
}

export const UserFactory = {
  build: (attrs: UserAttrs = {}) => {
    return {
      id: chance.guid(),
      email: chance.email(),
      password: 'test1234',
      roles: { set: [Role.USER] },
      ...attrs,
    };
  },

  create: async (attrs: UserAttrs = {}) => {
    const user = UserFactory.build(attrs);
    const options: Record<string, any> = {};
    const includes = buildPrismaIncludeFromAttrs(attrs);
    if (includes) options.include = includes;

    return await prisma.user.create({
      data: { ...user, password: hashPassword(user.password), roles: user.roles as any },
      ...options,
    });
  },
};
