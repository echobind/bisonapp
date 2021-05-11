import { objectType, extendType, inputObjectType, stringArg, arg, nonNull, enumType } from 'nexus';
import { Role } from '@prisma/client';
import { UserInputError, ForbiddenError } from 'apollo-server-micro';

import { hashPassword, appJwtForUser, comparePasswords } from '../../services/auth';
import { isAdmin, canAccess } from '../../services/permissions';

// User Type
export const User = objectType({
  name: 'User',
  description: 'A User',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');
    t.nonNull.list.nonNull.field('roles', { type: 'Role' });

    // Show email as null for unauthorized users
    t.string('email', {
      resolve: (profile, _args, ctx) => (canAccess(profile, ctx) ? profile.email : null),
    });

    t.field('profile', {
      type: 'Profile',
      resolve: (parent, _, context) => {
        return context.prisma.user.findUnique({
          where: { id: parent.id }
        }).profile()
      }
    })
  },
});

// Auth Payload Type
export const AuthPayload = objectType({
  name: 'AuthPayload',
  description: 'Payload returned if login or signup is successful',
  definition(t) {
    t.field('user', { type: 'User', description: 'The logged in user' });
    t.string('token', {
      description: 'The current JWT token. Use in Authentication header',
    });
  },
});

// Queries
export const UserQueries = extendType({
  type: 'Query',
  definition: (t) => {
    // Me Query
    t.field('me', {
      type: 'User',
      description: 'Returns the currently logged in user',
      resolve: (_root, _args, ctx) => ctx.user,
    });
  },
});

// Mutations
export const Mutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    // Login Mutation
    t.field('login', {
      type: 'AuthPayload',
      description: 'Login to an existing account',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_root, args, ctx) => {
        const { email, password } = args;
        const user = await ctx.db.user.findUnique({ where: { email } });

        if (!user) {
          throw new UserInputError(`No user found for email: ${email}`, {
            invalidArgs: { email: 'is invalid' },
          });
        }

        const valid = comparePasswords(password, user.password);

        if (!valid) {
          throw new UserInputError('Invalid password', {
            invalidArgs: { password: 'is invalid' },
          });
        }

        const token = appJwtForUser(user);

        return {
          token,
          user,
        };
      },
    });

    t.field('signup', {
      type: 'AuthPayload',
      description: 'Signup for an account',
      args: {
        data: nonNull(arg({ type: 'SignupInput' })),
      },
      resolve: async (_root, args, ctx) => {
        const { data } = args;
        const existingUser = await ctx.db.user.findUnique({ where: { email: data.email } });

        if (existingUser) {
          throw new UserInputError('Email already exists.', {
            invalidArgs: { email: 'already exists' },
          });
        }

        // force role to user and hash the password
        const updatedArgs = {
          data: {
            ...data,
            roles: { set: [Role.USER] },
            password: hashPassword(data.password),
          },
        };

        const user = await ctx.db.user.create(updatedArgs);
        const token = appJwtForUser(user);

        return {
          user,
          token,
        };
      },
    });
  },
});

// Inputs
export const SignupInput = inputObjectType({
  name: 'SignupInput',
  description: 'Input required for a user to signup',
  definition: (t) => {
    t.nonNull.string('email');
    t.nonNull.string('password');
  },
});

// Manually added types that were previously in the prisma plugin
export const UserRole = enumType({
  name: 'Role',
  members: Object.values(Role),
});

export const UserOrderByInput = inputObjectType({
  name: 'UserOrderByInput',
  description: 'Order users by a specific field',
  definition(t) {
    t.field('email', { type: 'SortOrder' });
    t.field('createdAt', { type: 'SortOrder' });
    t.field('updatedAt', { type: 'SortOrder' });
  },
});

export const UserWhereUniqueInput = inputObjectType({
  name: 'UserWhereUniqueInput',
  description: 'Input to find users based on unique fields',
  definition(t) {
    t.id('id');
    t.string('email');
  },
});

export const UserWhereInput = inputObjectType({
  name: 'UserWhereInput',
  description: 'Input to find users based other fields',
  definition(t) {
    t.int('id');
    t.field('email', { type: 'StringFilter' });
  },
});