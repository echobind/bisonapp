import { objectType, extendType, inputObjectType, stringArg, arg } from '@nexus/schema';
import { Role } from '@prisma/client';
import { UserInputError, ForbiddenError } from 'apollo-server-micro';

import { hashPassword, appJwtForUser, comparePasswords } from '../../services/auth';
import { isAdmin, canAccess } from '../../services/permissions';

// User Type
export const User = objectType({
  name: 'User',
  description: 'A User',
  definition(t) {
    t.model.id();
    t.model.email();
    t.model.roles();
    t.model.createdAt();
    t.model.updatedAt();
    t.model.profile();

    // Show email as null for unauthorized users
    t.string('email', {
      nullable: true,
      resolve: (profile, _args, ctx) => (canAccess(profile, ctx) ? profile.email : null),
    });
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
      nullable: true,
      resolve: (_root, _args, ctx) => ctx.user,
    });

    // List Users Query (admin only)
    t.crud.users({
      filtering: true,
      ordering: true,
      resolve: async (root, args, ctx, info, originalResolve) => {
        if (!isAdmin(ctx.user)) throw new ForbiddenError('Unauthorized');

        return await originalResolve(root, args, ctx, info);
      },
    });

    // User Query
    t.crud.user();
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
        email: stringArg({ required: true }),
        password: stringArg({ required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const { email, password } = args;
        const user = await ctx.db.user.findOne({ where: { email } });

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

    // User Create (admin only)
    t.crud.createOneUser({
      alias: 'createUser',
      resolve: async (root, args, ctx, info, originalResolve) => {
        if (!isAdmin(ctx.user)) {
          throw new ForbiddenError('Not authorized');
        }

        const user = await ctx.db.user.findOne({ where: { email: args.data.email } });

        if (user) {
          throw new UserInputError('Email already exists.', {
            invalidArgs: { email: 'already exists' },
          });
        }

        // force role to user and hash the password
        const updatedArgs = {
          data: {
            ...args.data,
            password: hashPassword(args.data.password),
          },
        };

        return originalResolve(root, updatedArgs, ctx, info);
      },
    });

    t.field('signup', {
      type: 'AuthPayload',
      description: 'Signup for an account',
      args: {
        data: arg({ type: 'SignupInput', required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const existingUser = await ctx.db.user.findOne({ where: { email: args.data.email } });

        if (existingUser) {
          throw new UserInputError('Email already exists.', {
            invalidArgs: { email: 'already exists' },
          });
        }

        // force role to user and hash the password
        const updatedArgs = {
          data: {
            ...args.data,
            roles: { set: [Role.USER] },
            password: hashPassword(args.data.password),
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

export const SignupInput = inputObjectType({
  name: 'SignupInput',
  definition: (t) => {
    t.string('email', { required: true });
    t.string('password', { required: true });
    t.field('profile', { type: 'ProfileCreateOneWithoutUserInput' });
  },
});
