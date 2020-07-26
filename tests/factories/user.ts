import Chance from 'chance';
import { User, Role } from '@prisma/client';
import { prisma, disconnect } from '../helpers';
import { hashPassword } from '../../services/auth';

const chance = new Chance();

export const UserFactory = {
  build: (attrs: Partial<User> = {}) => {
    return {
      id: chance.guid(),
      email: chance.email(),
      password: 'test1234',
      roles: [Role.USER],
      ...attrs,
    };
  },

  create: async (attrs: Partial<User> = {}) => {
    const user = UserFactory.build(attrs);

    return await prisma.user.create({
      data: { ...user, password: hashPassword(user.password), roles: { set: user.roles } },
    });
  },
};
